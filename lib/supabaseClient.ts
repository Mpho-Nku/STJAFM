'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase' // optional if you generated types

// If you don’t have generated types, you can omit <Database>
export const supabase = createClientComponentClient<Database>()
