import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRoutesStub } from 'react-router'
import { describe, expect, it } from 'vitest'
import Login from './login'

describe('Login', () => {
  it('valida el formulario con Zod antes de enviar', async () => {
    const Stub = createRoutesStub([{ path: '/login', Component: Login }])
    render(<Stub initialEntries={['/login']} />)

    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(await screen.findByText('Ingresá un email válido.')).toBeInTheDocument()
    expect(screen.getByText('Ingresá tu contraseña.')).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Email'), 'pablo@example.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'secreto123')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(await screen.findByText(/se habilita en la próxima fase/)).toBeInTheDocument()
  })
})
