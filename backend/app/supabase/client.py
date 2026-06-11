import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "your-supabase-key")

# Client is initialized lazily so it doesn't crash if keys are invalid
supabase: Client = None
try:
    if SUPABASE_URL and SUPABASE_KEY and "your-project" not in SUPABASE_URL:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as e:
    print("Warning: Supabase client initialization failed:", str(e))
