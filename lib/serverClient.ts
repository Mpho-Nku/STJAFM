// lib/supabaseClient.ts
'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// ✅ No <Database>, no type import needed
export const supabase = createClientComponentClient()
