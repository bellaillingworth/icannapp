import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://baturiecnalyujasvcsw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhdHVyaWVjbmFseXVqYXN2Y3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NDI3MDUsImV4cCI6MjA2NjAxODcwNX0.rNCocivLZDGraQEsWzdrUPaiNJZOqBRri7XaPDXexY4';
 
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); 