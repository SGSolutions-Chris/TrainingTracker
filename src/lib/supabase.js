import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sgrqyfhofhnqyqcfppdh.supabase.co'
const supabaseKey = 'sb_publishable_0SvgpvdAoQP_rIs8HmcKSA_NU9Pne2X'

export const supabase = createClient(supabaseUrl, supabaseKey)
