/**
 * Tipos de la base de datos de Supabase.
 *
 * Este archivo es un placeholder hasta la Fase 2. Se va a reemplazar entero con el
 * resultado de `npm run db:types` (supabase gen types typescript), así que no hay que
 * editarlo a mano.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
