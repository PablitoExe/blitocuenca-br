import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { Seo } from '~/components/seo/Seo'
import { FormNotice, PrimaryButton, SelectField, TextField } from '~/components/ui/Form'
import { PageShell, Panel } from '~/components/ui/PageShell'
import { checkoutSchema, COUNTRIES, type CheckoutValues } from '~/lib/validation'
import { useCartStore } from '~/stores/cart'

export default function Checkout() {
  const itemCount = useCartStore((state) => state.items.length)
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({ resolver: zodResolver(checkoutSchema), defaultValues: { country: 'AR' } })

  // Fase 2: crear la orden y la preferencia de Mercado Pago desde una Edge Function.
  const onSubmit = () => setSubmitted(true)

  return (
    <>
      <Seo title="Checkout" path="/checkout" noindex />
      <PageShell title="Checkout" description="Completá tus datos de envío.">
        {itemCount === 0 ? (
          <Panel className="max-w-[640px]">
            <p className="font-mona text-[15px] text-white/70">
              Tu carrito está vacío.{' '}
              <Link to="/productos" className="text-lime underline">
                Ver productos
              </Link>
            </p>
          </Panel>
        ) : (
          <Panel className="max-w-[760px]">
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-[16px] sm:grid-cols-2">
              <TextField
                label="Nombre y apellido"
                autoComplete="name"
                error={errors.name?.message}
                {...register('name')}
              />
              <TextField
                label="Email"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />
              <TextField
                label="Teléfono"
                type="tel"
                autoComplete="tel"
                error={errors.phone?.message}
                {...register('phone')}
              />
              <SelectField label="País" autoComplete="country" error={errors.country?.message} {...register('country')}>
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.label}
                  </option>
                ))}
              </SelectField>
              <div className="sm:col-span-2">
                <TextField
                  label="Dirección"
                  autoComplete="street-address"
                  error={errors.address?.message}
                  {...register('address')}
                />
              </div>
              <TextField
                label="Ciudad"
                autoComplete="address-level2"
                error={errors.city?.message}
                {...register('city')}
              />
              <TextField
                label="Código postal"
                autoComplete="postal-code"
                error={errors.postalCode?.message}
                {...register('postalCode')}
              />
              <div className="flex flex-col gap-[12px] sm:col-span-2">
                {submitted && (
                  <FormNotice>Datos válidos. El pago con Mercado Pago y Pix se habilita en la próxima fase.</FormNotice>
                )}
                <PrimaryButton type="submit" disabled={isSubmitting}>
                  Continuar al pago
                </PrimaryButton>
              </div>
            </form>
          </Panel>
        )}
      </PageShell>
    </>
  )
}
