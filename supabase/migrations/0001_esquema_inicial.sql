-- =============================================================================
-- Blitocuenca — esquema inicial de base de datos (Fase 2A)
--
-- Diseño aprobado el 27/09/2026. Documentación: docs/database/DISEÑO.md
-- Requiere un proyecto de Supabase (usa los esquemas auth y storage y los roles
-- anon, authenticated y service_role). No incluye datos (depósitos, categorías, admins).
--
-- Convenciones:
--   · Claves primarias uuid (gen_random_uuid()), salvo tablas puente con PK compuesta.
--   · Timestamps en timestamptz (UTC). created_at / updated_at en todas las tablas editables.
--   · Dinero en bigint, en unidades menores (centavos): *_minor. Nunca float.
--   · Textos visibles en español (columna base) + *_pt_br opcional (si falta, se usa el español).
--   · RLS activado en TODAS las tablas. La service_role (Edge Functions / servidor de Vercel)
--     es la única que escribe pedidos y pagos.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Tipos
-- -----------------------------------------------------------------------------

create type public.market_code as enum ('AR', 'BR');
create type public.currency_code as enum ('ARS', 'BRL', 'USD');
create type public.locale_code as enum ('es-AR', 'pt-BR');
create type public.user_role as enum ('customer', 'admin');
create type public.product_status as enum ('draft', 'active', 'archived');
create type public.cart_status as enum ('active', 'converted', 'abandoned');

-- Talles de indumentaria. El orden del enum es el orden de talles (sirve para ordenar).
create type public.apparel_size as enum ('XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL');

-- Estado de stock que ve el cliente (nunca la cantidad exacta).
create type public.stock_status as enum (
  'in_stock',     -- En stock
  'low_stock',    -- Últimas unidades (1 a low_stock_threshold())
  'out_of_stock', -- Sin stock
  'backorder'     -- Sin stock pero se vende por encargo (allow_backorder)
);

-- Ciclo de vida del pedido (lo gobierna la tienda).
create type public.order_status as enum (
  'pending_payment', -- creado, stock reservado, esperando el pago
  'paid',            -- pago aprobado
  'preparing',       -- en preparación
  'shipped',         -- despachado
  'delivered',       -- entregado
  'cancelled',       -- cancelado (por el cliente, la tienda, pago rechazado o reserva vencida)
  'refunded'         -- devuelto
);

-- Estado del pago: espejo 1:1 de los estados de Mercado Pago, para no perder información.
create type public.payment_status as enum (
  'pending',
  'in_process',
  'authorized',
  'approved',
  'in_mediation',
  'rejected',
  'cancelled',
  'refunded',
  'charged_back'
);

create type public.payment_provider as enum ('mercadopago');
create type public.discount_type as enum ('percentage', 'fixed_amount');
create type public.tax_id_type as enum ('DNI', 'CUIT', 'CUIL', 'CPF', 'CNPJ');

-- Slug para URLs: minúsculas, números y guiones.
create domain public.slug as text
  check (value ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(value) <= 120);


-- -----------------------------------------------------------------------------
-- 2. Funciones auxiliares
-- -----------------------------------------------------------------------------

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Moneda en la que se cobra en cada mercado.
create function public.market_currency(market public.market_code)
returns public.currency_code
language sql
immutable
set search_path = ''
as $$
  select case market
    when 'AR' then 'ARS'::public.currency_code
    when 'BR' then 'BRL'::public.currency_code
  end;
$$;

-- Umbral de "Últimas unidades". Es fijo en el servidor a propósito: si el cliente pudiera
-- elegirlo, podría averiguar la cantidad exacta probando valores. Cambiarlo = una migración.
create function public.low_stock_threshold()
returns integer
language sql
immutable
set search_path = ''
as $$
  select 3;
$$;


-- -----------------------------------------------------------------------------
-- 3. Usuarios
-- -----------------------------------------------------------------------------

-- Un perfil por usuario de Supabase Auth (se crea solo, con un trigger).
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text check (char_length(full_name) <= 120),
  phone text check (char_length(phone) <= 30),
  preferred_locale public.locale_code not null default 'es-AR',
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Se define después de profiles porque la consulta. security definer: evita la recursión de
-- RLS al consultar profiles desde las políticas de profiles.
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  label text check (char_length(label) <= 40),          -- "Casa", "Trabajo"
  recipient_name text not null check (char_length(recipient_name) <= 120),
  phone text check (char_length(phone) <= 30),
  country public.market_code not null,                  -- solo se envía a AR y BR
  street text not null,
  street_number text not null,
  complement text,                                      -- piso/depto (AR) o complemento (BR)
  neighborhood text,                                    -- barrio / bairro (obligatorio en BR para envíos)
  city text not null,
  state text not null,                                  -- provincia / estado (UF)
  postal_code text not null,                            -- CP / CEP
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- -----------------------------------------------------------------------------
-- 4. Catálogo
-- -----------------------------------------------------------------------------

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  slug public.slug not null unique,
  name text not null check (char_length(name) between 1 and 80),
  logo_path text,                                       -- ruta en Storage (bucket catalog)
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Árbol de categorías: zapatillas, indumentaria (→ remeras, buzos…), perfumes, accesorios.
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories (id) on delete restrict,
  slug public.slug not null unique,
  name text not null check (char_length(name) between 1 and 80),
  name_pt_br text check (char_length(name_pt_br) between 1 and 80),
  description text,
  description_pt_br text,
  image_path text,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_not_own_parent check (parent_id is distinct from id)
);

-- Un producto existe una sola vez y se vende en AR y/o BR según tenga precio en ARS y/o BRL.
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug public.slug not null unique,
  name text not null check (char_length(name) between 1 and 200),
  name_pt_br text check (char_length(name_pt_br) between 1 and 200),
  description text not null default '',
  description_pt_br text,
  brand_id uuid references public.brands (id) on delete restrict,        -- null: sin marca
  category_id uuid not null references public.categories (id) on delete restrict,
  status public.product_status not null default 'draft',
  published_at timestamptz,                             -- primera vez que pasó a 'active'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- La unidad vendible. Todo producto tiene al menos una variante (aunque no tenga opciones).
--   · zapatillas: shoe_size_eu = 42, shoe_size_us = 9, shoe_size_br = 40, color
--   · indumentaria: apparel_size = 'M', color
--   · perfumes: volume_ml = 100
--   · accesorios: color, o ninguna opción (variante única)
--   · otras opciones futuras (material, largo…): attributes jsonb, sin migrar
-- Las equivalencias de calzado se guardan por variante porque dependen de la marca y del modelo
-- (un EU 42 no es el mismo US en Nike que en Vans): no sirve una tabla de conversión global.
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  sku text not null unique check (sku ~ '^[A-Z0-9][A-Z0-9-]{2,63}$'),
  shoe_size_eu numeric(3, 1) check (shoe_size_eu between 15 and 55),   -- EU = AR
  shoe_size_us numeric(3, 1) check (shoe_size_us between 0 and 20),
  shoe_size_br numeric(3, 1) check (shoe_size_br between 13 and 53),
  apparel_size public.apparel_size,
  color text check (char_length(color) <= 40),
  volume_ml integer check (volume_ml > 0),
  attributes jsonb not null default '{}' check (jsonb_typeof(attributes) = 'object'),
  position integer not null default 0,
  is_active boolean not null default true,
  allow_backorder boolean not null default false,       -- vender sin stock (p. ej. importados por encargo)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Un producto es de calzado o de indumentaria, no las dos cosas.
  constraint product_variants_one_size_kind check (shoe_size_eu is null or apparel_size is null),
  -- US y BR son equivalencias del talle EU: no existen sin él.
  constraint product_variants_shoe_equivalences check (
    shoe_size_eu is not null or (shoe_size_us is null and shoe_size_br is null)
  ),
  constraint product_variants_options_unique
    unique nulls not distinct (product_id, shoe_size_eu, apparel_size, color, volume_ml, attributes),
  -- Permite que product_images valide que la variante pertenece al mismo producto.
  constraint product_variants_id_product_unique unique (id, product_id)
);

-- Precio de cada variante por moneda, cargado a mano (no hay conversión automática).
--   · ARS: precio de venta en Argentina. Sin fila en ARS → no se vende en Argentina.
--   · BRL: precio de venta en Brasil. Sin fila en BRL → no se vende en Brasil.
--   · USD: costo / referencia interna. Nunca se cobra ni se muestra: RLS lo oculta al público.
create table public.variant_prices (
  variant_id uuid not null references public.product_variants (id) on delete cascade,
  currency public.currency_code not null,
  amount_minor bigint not null check (amount_minor >= 0),
  compare_at_amount_minor bigint,                       -- precio tachado ("antes")
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (variant_id, currency),
  constraint variant_prices_compare_at_greater check (compare_at_amount_minor > amount_minor),
  constraint variant_prices_no_compare_at_for_cost check (currency <> 'USD' or compare_at_amount_minor is null)
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  variant_id uuid,                                      -- opcional: imagen de un color específico
  storage_path text not null unique,                    -- products/{product_id}/{id}.webp
  alt text not null default '',
  alt_pt_br text,
  width integer check (width > 0),
  height integer check (height > 0),
  position integer not null default 0,
  created_at timestamptz not null default now(),
  constraint product_images_variant_same_product
    foreign key (variant_id, product_id)
    references public.product_variants (id, product_id)
    on delete set null (variant_id)
);

-- Depósitos. Se empieza con uno en Argentina y uno en Brasil; agregar otro es insertar una fila.
-- `markets`: a qué tiendas abastece (un depósito en AR podría despachar también a BR).
create table public.warehouses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z0-9-]{2,20}$'),   -- 'AR-BUE', 'BR-SP'
  name text not null check (char_length(name) <= 80),
  country_code char(2) not null check (country_code ~ '^[A-Z]{2}$'),  -- ubicación física (ISO 3166-1)
  markets public.market_code[] not null check (cardinality(markets) >= 1),
  priority integer not null default 0,                  -- menor = se usa primero al asignar stock
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Stock de cada variante en cada depósito. Solo lo ven los admins; el cliente ve get_stock_status().
--   · quantity_on_hand: unidades físicas. La edita el admin (ingresos, ajustes).
--   · quantity_reserved: unidades apartadas por pedidos esperando pago. Solo la tocan las funciones
--     de checkout (service_role); el admin no tiene permiso de UPDATE sobre esta columna.
-- Invariante: reserved ≤ on_hand. Aunque el código de checkout tuviera un error, la base rechaza
-- cualquier reserva que deje el disponible en negativo: no se puede vender dos veces la última unidad.
create table public.inventory (
  variant_id uuid not null references public.product_variants (id) on delete cascade,
  warehouse_id uuid not null references public.warehouses (id) on delete restrict,
  quantity_on_hand integer not null default 0 check (quantity_on_hand >= 0),
  quantity_reserved integer not null default 0 check (quantity_reserved >= 0),
  quantity_available integer generated always as (quantity_on_hand - quantity_reserved) stored,
  updated_at timestamptz not null default now(),
  primary key (variant_id, warehouse_id),
  constraint inventory_reserved_within_on_hand check (quantity_reserved <= quantity_on_hand)
);


-- -----------------------------------------------------------------------------
-- 5. Favoritos y carrito
-- -----------------------------------------------------------------------------

create table public.favorites (
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- Carrito del usuario logueado (sincroniza dispositivos). El invitado sigue en localStorage
-- y se fusiona al iniciar sesión. Los precios NO se guardan: se calculan en el checkout.
create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  market public.market_code not null,
  status public.cart_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts (id) on delete cascade,
  variant_id uuid not null references public.product_variants (id) on delete cascade,
  quantity integer not null check (quantity between 1 and 99),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cart_items_variant_unique unique (cart_id, variant_id)
);


-- -----------------------------------------------------------------------------
-- 6. Cupones, pedidos y pagos
-- -----------------------------------------------------------------------------

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z0-9_-]{3,32}$'),   -- siempre en mayúsculas
  description text,
  discount_type public.discount_type not null,
  percent_off numeric(5, 2) check (percent_off > 0 and percent_off <= 100),
  amount_off_minor bigint check (amount_off_minor > 0),
  currency public.currency_code check (currency <> 'USD'),         -- moneda de amount_off y min_subtotal
  market public.market_code,                                       -- null: válido en AR y BR
  min_subtotal_minor bigint check (min_subtotal_minor >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  max_redemptions integer check (max_redemptions > 0),
  max_redemptions_per_user integer check (max_redemptions_per_user > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint coupons_discount_shape check (
    (discount_type = 'percentage' and percent_off is not null and amount_off_minor is null)
    or (discount_type = 'fixed_amount' and amount_off_minor is not null and percent_off is null and currency is not null)
  ),
  constraint coupons_min_subtotal_has_currency check (min_subtotal_minor is null or currency is not null),
  constraint coupons_currency_matches_market check (
    market is null or currency is null or currency = public.market_currency(market)
  ),
  constraint coupons_valid_window check (ends_at is null or starts_at is null or ends_at > starts_at)
);

-- El pedido es una foto inmutable de la compra: guarda datos del cliente, dirección y precios
-- del momento, aunque después cambien el perfil, la dirección o el catálogo.
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity (start with 1001) unique,  -- se muestra como BLT-1001
  user_id uuid references public.profiles (id) on delete set null,          -- null: compra como invitado
  -- Invitados: hash (SHA-256) del token secreto del link "ver mi pedido" que llega por email.
  -- El token en claro nunca se guarda. Se valida desde el servidor.
  guest_access_token_hash text unique,
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  customer_name text not null check (char_length(customer_name) <= 120),
  customer_phone text check (char_length(customer_phone) <= 30),
  customer_tax_id_type public.tax_id_type,              -- DNI/CUIT (AR), CPF/CNPJ (BR, requerido para Pix)
  customer_tax_id text,
  market public.market_code not null,
  currency public.currency_code not null,
  locale public.locale_code not null default 'es-AR',
  status public.order_status not null default 'pending_payment',
  subtotal_minor bigint not null check (subtotal_minor >= 0),
  discount_minor bigint not null default 0 check (discount_minor >= 0),
  shipping_minor bigint not null default 0 check (shipping_minor >= 0),
  total_minor bigint not null check (total_minor >= 0),
  coupon_id uuid references public.coupons (id) on delete set null,
  coupon_code text,                                     -- copia del código usado
  -- Copia de la dirección (el invitado no tiene `addresses`). Campos obligatorios validados acá.
  shipping_address jsonb not null check (
    jsonb_typeof(shipping_address) = 'object'
    and shipping_address ?& array['recipient_name', 'street', 'street_number', 'city', 'state', 'postal_code', 'country']
  ),
  notes text check (char_length(notes) <= 500),
  expires_at timestamptz,                               -- vence la reserva de stock si no se paga
  paid_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz,
  cancelled_at timestamptz,
  cancel_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_currency_matches_market check (currency = public.market_currency(market)),
  constraint orders_discount_within_subtotal check (discount_minor <= subtotal_minor),
  constraint orders_total_consistent check (total_minor = subtotal_minor - discount_minor + shipping_minor),
  constraint orders_tax_id_pair check ((customer_tax_id_type is null) = (customer_tax_id is null)),
  -- Coherencia entre estado y fechas: el job de vencimiento necesita expires_at, y un pedido
  -- pagado/cancelado siempre registra cuándo.
  constraint orders_pending_has_expiry check (status <> 'pending_payment' or expires_at is not null),
  constraint orders_paid_has_paid_at check (
    status not in ('paid', 'preparing', 'shipped', 'delivered', 'refunded') or paid_at is not null
  ),
  constraint orders_cancelled_has_cancelled_at check (status <> 'cancelled' or cancelled_at is not null),
  -- Destino de la FK compuesta de payments (el pago debe estar en la moneda del pedido).
  constraint orders_id_currency_unique unique (id, currency)
  -- No se exige "user_id o token": si un usuario borra su cuenta, user_id pasa a null y el pedido
  -- se conserva igual (requisito contable).
);

-- Todas las FK son RESTRICT: un ítem vendido impide borrar el pedido, el producto, la variante o el
-- depósito (se archivan/desactivan). Además se guarda una copia de los datos para mostrar el pedido
-- aunque el catálogo cambie.
-- Cada línea sale de UN depósito. Si hace falta stock de dos depósitos, o una parte es por encargo,
-- se crean varias líneas de la misma variante.
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete restrict,
  product_id uuid not null references public.products (id) on delete restrict,
  variant_id uuid not null references public.product_variants (id) on delete restrict,
  warehouse_id uuid not null references public.warehouses (id) on delete restrict,  -- de dónde sale / dónde se reserva
  -- true: unidades por encargo (allow_backorder), NO reservan stock. false: reservan en warehouse_id.
  is_backorder boolean not null default false,
  -- Copia de los datos al momento de la compra:
  sku text not null,
  product_name text not null,
  variant_label text,                                   -- "EU 42 · US 9 · BR 40", "M · Negro", "100 ml"
  image_path text,
  unit_price_minor bigint not null check (unit_price_minor >= 0),
  quantity integer not null check (quantity between 1 and 99),
  total_minor bigint generated always as (unit_price_minor * quantity) stored,
  created_at timestamptz not null default now(),
  constraint order_items_line_unique unique (order_id, variant_id, warehouse_id, is_backorder)
);

-- Un pedido puede tener varios intentos de pago (p. ej. tarjeta rechazada y después Pix).
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null,
  provider public.payment_provider not null default 'mercadopago',
  provider_payment_id text,                             -- id del pago en Mercado Pago
  provider_preference_id text,                          -- id de la preferencia de Checkout Pro
  status public.payment_status not null default 'pending',
  status_detail text,                                   -- p. ej. cc_rejected_insufficient_amount
  payment_type text,                                    -- credit_card, debit_card, bank_transfer (Pix), ticket…
  payment_method text,                                  -- visa, master, pix…
  installments integer check (installments > 0),
  amount_minor bigint not null check (amount_minor >= 0),
  currency public.currency_code not null check (currency <> 'USD'),
  raw_payload jsonb,                                    -- última respuesta del proveedor (auditoría)
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Idempotencia de webhooks: un pago del proveedor = una fila.
  constraint payments_provider_payment_unique unique (provider, provider_payment_id),
  -- El pago pertenece al pedido y está en SU moneda. RESTRICT: un pedido con pagos no se borra.
  constraint payments_order_currency_fk foreign key (order_id, currency)
    references public.orders (id, currency) on delete restrict
);


-- -----------------------------------------------------------------------------
-- 7. Índices (las PK y UNIQUE ya crean los suyos)
-- -----------------------------------------------------------------------------

create index addresses_user_id_idx on public.addresses (user_id);
create unique index addresses_one_default_per_user on public.addresses (user_id) where is_default;

create index categories_parent_id_idx on public.categories (parent_id);

-- Listados de la tienda: solo productos activos, más nuevos primero.
create index products_category_listing_idx on public.products (category_id, published_at desc) where status = 'active';
create index products_brand_listing_idx on public.products (brand_id, published_at desc) where status = 'active';

create index product_variants_product_id_idx on public.product_variants (product_id);
create index inventory_warehouse_id_idx on public.inventory (warehouse_id);
create index product_images_product_position_idx on public.product_images (product_id, position);
create index product_images_variant_id_idx on public.product_images (variant_id);

create index favorites_product_id_idx on public.favorites (product_id);

create unique index carts_one_active_per_user_market on public.carts (user_id, market) where status = 'active';
create index cart_items_variant_id_idx on public.cart_items (variant_id);

create index orders_user_created_idx on public.orders (user_id, created_at desc);
create index orders_status_created_idx on public.orders (status, created_at desc);
create index orders_coupon_id_idx on public.orders (coupon_id);
-- Asociar pedidos de invitado a la cuenta que se crea después con el mismo email.
create index orders_guest_email_idx on public.orders (lower(email)) where user_id is null;
-- Para liberar reservas vencidas (job programado en la fase de checkout).
create index orders_pending_expiry_idx on public.orders (expires_at) where status = 'pending_payment';

create index order_items_order_id_idx on public.order_items (order_id);
create index order_items_variant_id_idx on public.order_items (variant_id);
create index order_items_product_id_idx on public.order_items (product_id);
create index order_items_warehouse_id_idx on public.order_items (warehouse_id);

create index payments_order_id_idx on public.payments (order_id);
create index payments_preference_id_idx on public.payments (provider_preference_id);


-- -----------------------------------------------------------------------------
-- 7a. Integridad: el depósito de cada línea abastece el mercado del pedido
--     No se puede expresar como FK (warehouses.markets es un array), así que lo valida un trigger.
--     Al insertar, además, el depósito tiene que estar activo.
-- -----------------------------------------------------------------------------

create function public.enforce_order_item_warehouse()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.orders o
    join public.warehouses w on w.id = new.warehouse_id
    where o.id = new.order_id
      and o.market = any (w.markets)
      and (w.is_active or tg_op = 'UPDATE')
  ) then
    raise exception 'El depósito % no abastece el mercado del pedido %', new.warehouse_id, new.order_id
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger order_items_warehouse_serves_market
  before insert or update of order_id, warehouse_id on public.order_items
  for each row execute function public.enforce_order_item_warehouse();


-- -----------------------------------------------------------------------------
-- 7b. Estado de stock público
--     Devuelve solo el estado (en stock / últimas unidades / sin stock / por encargo) de hasta
--     200 variantes que se venden en ese mercado (activas, de productos activos y con precio en la
--     moneda del mercado), sumando los depósitos activos que abastecen ese mercado.
--     security definer: lee inventory (solo admin) sin exponer cantidades.
--     El resultado depende solo de en qué banda está el disponible (0 · 1..3 · >3): repetir la
--     consulta no da más información. No lee precios, así que no puede filtrar USD.
-- -----------------------------------------------------------------------------

create function public.get_stock_status(p_market public.market_code, p_variant_ids uuid[])
returns table (variant_id uuid, stock_status public.stock_status)
language sql
stable
security definer
set search_path = ''
as $$
  select
    v.id,
    case
      when coalesce(stock.available, 0) > public.low_stock_threshold() then 'in_stock'::public.stock_status
      when coalesce(stock.available, 0) > 0 then 'low_stock'::public.stock_status
      when v.allow_backorder then 'backorder'::public.stock_status
      else 'out_of_stock'::public.stock_status
    end
  from public.product_variants v
  join public.products p on p.id = v.product_id
  left join lateral (
    select sum(i.quantity_available) as available
    from public.inventory i
    join public.warehouses w on w.id = i.warehouse_id
    where i.variant_id = v.id and w.is_active and p_market = any (w.markets)
  ) stock on true
  where v.id = any (p_variant_ids)
    and cardinality(p_variant_ids) <= 200
    and v.is_active
    and p.status = 'active'
    and exists (
      select 1 from public.variant_prices vp
      where vp.variant_id = v.id and vp.currency = public.market_currency(p_market)
    );
$$;


-- -----------------------------------------------------------------------------
-- 8. Triggers de updated_at
-- -----------------------------------------------------------------------------

create trigger set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.addresses for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.brands for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.categories for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.product_variants for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.variant_prices for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.warehouses for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.inventory for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.carts for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.cart_items for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.coupons for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.orders for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.payments for each row execute function public.set_updated_at();


-- -----------------------------------------------------------------------------
-- 9. Permisos base (defensa en profundidad, además de RLS)
-- -----------------------------------------------------------------------------

-- TRUNCATE no pasa por RLS: nadie fuera de la service_role debe tenerlo.
revoke truncate, references, trigger on all tables in schema public from anon, authenticated;

-- Pedidos y pagos: el cliente nunca escribe; solo la service_role (servidor / Edge Functions).
revoke insert, update, delete on public.orders, public.order_items, public.payments from anon, authenticated;
-- Cupones: nadie los lista desde el cliente (se validan con una función en la fase de checkout).
revoke all on public.coupons from anon;
-- Depósitos y cantidades exactas: nunca para visitantes (el admin entra como authenticated + RLS).
revoke all on public.warehouses, public.inventory from anon;
-- El admin carga y ajusta unidades físicas, pero NO toca las reservas (solo las funciones de checkout).
revoke insert, update on public.inventory from authenticated;
grant insert (variant_id, warehouse_id, quantity_on_hand) on public.inventory to authenticated;
grant update (quantity_on_hand) on public.inventory to authenticated;

-- profiles: el usuario solo puede editar estas columnas. `role` se cambia desde el dashboard/SQL.
revoke update on public.profiles from anon, authenticated;
grant update (full_name, phone, preferred_locale) on public.profiles to authenticated;

-- Funciones internas: no se exponen por la API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.enforce_order_item_warehouse() from public, anon, authenticated;

-- Estado de stock: se puede llamar sin sesión (RPC get_stock_status).
revoke execute on function public.get_stock_status(public.market_code, uuid[]) from public;
grant execute on function public.get_stock_status(public.market_code, uuid[]) to anon, authenticated;


-- -----------------------------------------------------------------------------
-- 10. Row Level Security
--     `(select auth.uid())` y `(select public.is_admin())` se evalúan una vez por consulta
--     (no por fila), recomendación de rendimiento de Supabase.
-- -----------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.brands enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.variant_prices enable row level security;
alter table public.product_images enable row level security;
alter table public.warehouses enable row level security;
alter table public.inventory enable row level security;
alter table public.favorites enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;

-- profiles ---------------------------------------------------------------------
create policy "profiles: ver el propio o admin" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));
create policy "profiles: editar el propio o admin" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()))
  with check (id = (select auth.uid()) or (select public.is_admin()));
-- INSERT: solo el trigger handle_new_user. DELETE: en cascada al borrar el usuario de Auth.

-- addresses --------------------------------------------------------------------
create policy "addresses: ver las propias o admin" on public.addresses
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "addresses: crear propias" on public.addresses
  for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy "addresses: editar propias" on public.addresses
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy "addresses: borrar propias" on public.addresses
  for delete to authenticated
  using (user_id = (select auth.uid()));

-- brands / categories: lectura pública de lo activo; escritura solo admin ---------
create policy "brands: lectura pública de activas" on public.brands
  for select to anon, authenticated
  using (is_active or (select public.is_admin()));
create policy "brands: admin crea" on public.brands
  for insert to authenticated with check ((select public.is_admin()));
create policy "brands: admin edita" on public.brands
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "brands: admin borra" on public.brands
  for delete to authenticated using ((select public.is_admin()));

create policy "categories: lectura pública de activas" on public.categories
  for select to anon, authenticated
  using (is_active or (select public.is_admin()));
create policy "categories: admin crea" on public.categories
  for insert to authenticated with check ((select public.is_admin()));
create policy "categories: admin edita" on public.categories
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "categories: admin borra" on public.categories
  for delete to authenticated using ((select public.is_admin()));

-- products y tablas hijas: público ve solo productos 'active' ----------------------
create policy "products: lectura pública de activos" on public.products
  for select to anon, authenticated
  using (status = 'active' or (select public.is_admin()));
create policy "products: admin crea" on public.products
  for insert to authenticated with check ((select public.is_admin()));
create policy "products: admin edita" on public.products
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "products: admin borra" on public.products
  for delete to authenticated using ((select public.is_admin()));

create policy "product_variants: lectura pública si el producto está activo" on public.product_variants
  for select to anon, authenticated
  using (
    (is_active and exists (select 1 from public.products p where p.id = product_id and p.status = 'active'))
    or (select public.is_admin())
  );
create policy "product_variants: admin crea" on public.product_variants
  for insert to authenticated with check ((select public.is_admin()));
create policy "product_variants: admin edita" on public.product_variants
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "product_variants: admin borra" on public.product_variants
  for delete to authenticated using ((select public.is_admin()));

create policy "variant_prices: lectura pública de precios de venta" on public.variant_prices
  for select to anon, authenticated
  using (
    -- USD es costo interno: solo lo ve el admin.
    (
      currency in ('ARS', 'BRL')
      and exists (
        select 1 from public.product_variants v
        join public.products p on p.id = v.product_id
        where v.id = variant_id and v.is_active and p.status = 'active'
      )
    )
    or (select public.is_admin())
  );
create policy "variant_prices: admin crea" on public.variant_prices
  for insert to authenticated with check ((select public.is_admin()));
create policy "variant_prices: admin edita" on public.variant_prices
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "variant_prices: admin borra" on public.variant_prices
  for delete to authenticated using ((select public.is_admin()));

create policy "product_images: lectura pública si el producto está activo" on public.product_images
  for select to anon, authenticated
  using (
    exists (select 1 from public.products p where p.id = product_id and p.status = 'active')
    or (select public.is_admin())
  );
create policy "product_images: admin crea" on public.product_images
  for insert to authenticated with check ((select public.is_admin()));
create policy "product_images: admin edita" on public.product_images
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "product_images: admin borra" on public.product_images
  for delete to authenticated using ((select public.is_admin()));

-- warehouses e inventory: solo admin. El cliente consulta get_stock_status().
create policy "warehouses: admin ve" on public.warehouses
  for select to authenticated using ((select public.is_admin()));
create policy "warehouses: admin crea" on public.warehouses
  for insert to authenticated with check ((select public.is_admin()));
create policy "warehouses: admin edita" on public.warehouses
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "warehouses: admin borra" on public.warehouses
  for delete to authenticated using ((select public.is_admin()));

create policy "inventory: admin ve" on public.inventory
  for select to authenticated using ((select public.is_admin()));
create policy "inventory: admin crea" on public.inventory
  for insert to authenticated with check ((select public.is_admin()));
-- UPDATE: solo quantity_on_hand (permiso por columna). El CHECK reserved ≤ on_hand impide bajar
-- el stock físico por debajo de lo reservado.
create policy "inventory: admin edita" on public.inventory
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
-- No se puede borrar una fila con unidades reservadas (se perdería la reserva de un pedido).
create policy "inventory: admin borra sin reservas" on public.inventory
  for delete to authenticated using ((select public.is_admin()) and quantity_reserved = 0);

-- favorites --------------------------------------------------------------------
create policy "favorites: ver los propios" on public.favorites
  for select to authenticated using (user_id = (select auth.uid()));
create policy "favorites: agregar propios" on public.favorites
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "favorites: quitar propios" on public.favorites
  for delete to authenticated using (user_id = (select auth.uid()));
-- UPDATE: no aplica (la fila no tiene datos editables).

-- carts / cart_items -------------------------------------------------------------
create policy "carts: ver los propios o admin" on public.carts
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "carts: crear propios" on public.carts
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "carts: editar propios" on public.carts
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy "carts: borrar propios" on public.carts
  for delete to authenticated using (user_id = (select auth.uid()));

create policy "cart_items: ver los del carrito propio o admin" on public.cart_items
  for select to authenticated
  using (
    exists (select 1 from public.carts c where c.id = cart_id and c.user_id = (select auth.uid()))
    or (select public.is_admin())
  );
create policy "cart_items: agregar al carrito propio activo" on public.cart_items
  for insert to authenticated
  with check (
    exists (select 1 from public.carts c where c.id = cart_id and c.user_id = (select auth.uid()) and c.status = 'active')
  );
create policy "cart_items: editar en el carrito propio activo" on public.cart_items
  for update to authenticated
  using (
    exists (select 1 from public.carts c where c.id = cart_id and c.user_id = (select auth.uid()) and c.status = 'active')
  )
  with check (
    exists (select 1 from public.carts c where c.id = cart_id and c.user_id = (select auth.uid()) and c.status = 'active')
  );
create policy "cart_items: quitar del carrito propio activo" on public.cart_items
  for delete to authenticated
  using (
    exists (select 1 from public.carts c where c.id = cart_id and c.user_id = (select auth.uid()) and c.status = 'active')
  );

-- coupons: solo admin (el cliente valida un código con una función, en la fase de checkout)
create policy "coupons: admin ve" on public.coupons
  for select to authenticated using ((select public.is_admin()));
create policy "coupons: admin crea" on public.coupons
  for insert to authenticated with check ((select public.is_admin()));
create policy "coupons: admin edita" on public.coupons
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "coupons: admin borra" on public.coupons
  for delete to authenticated using ((select public.is_admin()));

-- orders / order_items / payments: el cliente solo LEE lo suyo. Escriben la service_role
-- (checkout y webhooks) y, para cambios de estado, el admin vía funciones de la fase de checkout.
create policy "orders: ver los propios o admin" on public.orders
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

create policy "order_items: ver los de pedidos propios o admin" on public.order_items
  for select to authenticated
  using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid()))
    or (select public.is_admin())
  );

create policy "payments: ver los de pedidos propios o admin" on public.payments
  for select to authenticated
  using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid()))
    or (select public.is_admin())
  );


-- -----------------------------------------------------------------------------
-- 11. Storage: bucket público de solo lectura para imágenes del catálogo
--     Estructura: products/{product_id}/{image_id}.webp
--                 brands/{brand_id}/logo.webp
--                 categories/{category_id}/cover.webp
-- -----------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('catalog', 'catalog', true, 5242880, array['image/webp', 'image/avif', 'image/jpeg', 'image/png']);

-- Lectura: al ser un bucket público se sirve por URL pública (CDN) sin políticas de SELECT.
-- Sin política de SELECT tampoco se puede LISTAR el bucket desde el cliente.
create policy "catalog: admin sube" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'catalog'
    and (storage.foldername(name))[1] in ('products', 'brands', 'categories')
    and (select public.is_admin())
  );
create policy "catalog: admin reemplaza" on storage.objects
  for update to authenticated
  using (bucket_id = 'catalog' and (select public.is_admin()))
  with check (
    bucket_id = 'catalog'
    and (storage.foldername(name))[1] in ('products', 'brands', 'categories')
    and (select public.is_admin())
  );
create policy "catalog: admin borra" on storage.objects
  for delete to authenticated
  using (bucket_id = 'catalog' and (select public.is_admin()));
