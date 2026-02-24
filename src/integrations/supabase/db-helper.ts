/**
 * Helper to bypass empty Supabase generated types.
 * The Database types are auto-generated and currently have no tables defined,
 * but the actual database has all the tables. This helper provides untyped
 * access to supabase.from() to avoid build errors.
 */
import { supabase } from './client';

/**
 * Untyped wrapper around supabase.from() that bypasses type checking.
 * Use this until the generated types are in sync with the actual database schema.
 */
export function fromTable(table: string) {
  return (supabase as any).from(table);
}

export { supabase };
