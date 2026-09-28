import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { Seo } from '~/components/seo/Seo'
import { FormNotice, PrimaryButton, TextField } from '~/components/ui/Form'
import { PageShell, Panel } from '~/components/ui/PageShell'
import { registerSchema, type RegisterValues } from '~/lib/validation'

export default function Registro() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) })

  // Fase 2: supabase.auth.signUp
  const onSubmit = () => setSubmitted(true)

  return (
    <>
      <Seo title="Crear cuenta" path="/registro" noindex />
      <PageShell title="Crear cuenta">
        <Panel className="max-w-[440px]">
          <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[16px]">
            <TextField label="Nombre" autoComplete="name" error={errors.name?.message} {...register('name')} />
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <TextField
              label="Contraseña"
              type="password"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <TextField
              label="Repetir contraseña"
              type="password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            {submitted && <FormNotice>El registro se habilita en la próxima fase.</FormNotice>}
            <PrimaryButton type="submit" disabled={isSubmitting}>
              Crear cuenta
            </PrimaryButton>
            <p className="text-center font-mona text-[14px] text-white/70">
              ¿Ya tenés cuenta?{' '}
              <Link to="/login" className="text-lime underline">
                Iniciá sesión
              </Link>
            </p>
          </form>
        </Panel>
      </PageShell>
    </>
  )
}
