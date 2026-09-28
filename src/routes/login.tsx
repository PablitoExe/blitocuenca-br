import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { Seo } from '~/components/seo/Seo'
import { FormNotice, PrimaryButton, TextField } from '~/components/ui/Form'
import { PageShell, Panel } from '~/components/ui/PageShell'
import { loginSchema, type LoginValues } from '~/lib/validation'

export default function Login() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  // Fase 2: supabase.auth.signInWithPassword
  const onSubmit = () => setSubmitted(true)

  return (
    <>
      <Seo title="Iniciar sesión" path="/login" noindex />
      <PageShell title="Iniciar sesión">
        <Panel className="max-w-[440px]">
          <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[16px]">
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
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />
            {submitted && <FormNotice>El inicio de sesión se habilita en la próxima fase.</FormNotice>}
            <PrimaryButton type="submit" disabled={isSubmitting}>
              Entrar
            </PrimaryButton>
            <p className="text-center font-mona text-[14px] text-white/70">
              ¿No tenés cuenta?{' '}
              <Link to="/registro" className="text-lime underline">
                Registrate
              </Link>
            </p>
          </form>
        </Panel>
      </PageShell>
    </>
  )
}
