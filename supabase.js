
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://bajyvwmbfjdxqoqgdoga.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhanl2d21iZmpkeHFvcWdkb2dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMDExOTcsImV4cCI6MjEwNjg3NzE5N30.tOpNx2Ds2UkkpDDsmko32N43wwC1-4qj14Z0E4zNaqM";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
