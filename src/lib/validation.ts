import { z } from 'zod'

const email = z.email({ error: 'Ingresá un email válido.' })
const requiredText = (label: string) =>
  z
    .string()
    .trim()
    .min(1, { error: `${label} es obligatorio.` })

export const loginSchema = z.object({
  email,
  password: z.string().min(1, { error: 'Ingresá tu contraseña.' }),
})
export type LoginValues = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    name: requiredText('El nombre'),
    email,
    password: z.string().min(8, { error: 'La contraseña debe tener al menos 8 caracteres.' }),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    error: 'Las contraseñas no coinciden.',
  })
export type RegisterValues = z.infer<typeof registerSchema>

export const COUNTRIES = [
  { code: 'AR', label: 'Argentina' },
  { code: 'BR', label: 'Brasil' },
] as const

export const checkoutSchema = z.object({
  name: requiredText('El nombre'),
  email,
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{8,20}$/, { error: 'Ingresá un teléfono válido.' }),
  country: z.enum(['AR', 'BR'], { error: 'Elegí un país.' }),
  address: requiredText('La dirección'),
  city: requiredText('La ciudad'),
  postalCode: requiredText('El código postal'),
})
export type CheckoutValues = z.infer<typeof checkoutSchema>
