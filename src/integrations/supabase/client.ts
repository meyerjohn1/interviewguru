// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://igppmjsyrhuahpxsrrpo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlncHBtanN5cmh1YWhweHNycnBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwNzE4NjMsImV4cCI6MjA1MDY0Nzg2M30.PA5o22c6-FxO81Apusk3IA8r6yyZAD-un11L5aKeLY0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);