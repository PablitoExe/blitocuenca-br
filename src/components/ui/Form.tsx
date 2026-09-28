import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react'
import { useId } from 'react'

const controlClass =
  'h-[46px] w-full rounded-[100px] bg-white/10 px-[18px] font-mona text-[14px] text-white placeholder-white/50 outline-none transition-colors focus:bg-white/20 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-400'

interface FieldShellProps {
  id: string
  label: string
  error?: string
  children: ReactNode
}

function FieldShell({ id, label, error, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label htmlFor={id} className="font-mona text-[13px] font-bold text-white/90 uppercase">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="font-mona text-[12px] text-red-300">
          {error}
        </p>
      )}
    </div>
  )
}

type TextFieldProps = ComponentProps<'input'> & { label: string; error?: string }

/** Campo de texto compatible con `register()` de React Hook Form (React 19: `ref` es una prop). */
export function TextField({ label, error, id, ref, ...props }: TextFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  return (
    <FieldShell id={fieldId} label={label} error={error}>
      <input
        ref={ref}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={controlClass}
        {...props}
      />
    </FieldShell>
  )
}

type SelectFieldProps = ComponentProps<'select'> & { label: string; error?: string }

export function SelectField({ label, error, id, children, ref, ...props }: SelectFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  return (
    <FieldShell id={fieldId} label={label} error={error}>
      <select
        ref={ref}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={`${controlClass} cursor-pointer [&>option]:text-ink`}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  )
}

export function PrimaryButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`w-full cursor-pointer rounded-[100px] bg-brand py-[14px] font-audiowide text-[16px] text-white transition-transform duration-150 hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    />
  )
}

export function FormNotice({ children }: { children: ReactNode }) {
  return (
    <p role="status" className="rounded-[16px] bg-white/10 px-[16px] py-[12px] font-mona text-[14px] text-lime">
      {children}
    </p>
  )
}
