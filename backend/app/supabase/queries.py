from app.supabase.client import supabase

def save_user_profile(user_id: str, email: str, display_name: str, job_preference: str):
    if not supabase:
        return {"id": user_id, "email": email, "display_name": display_name}
    try:
        data = {
            "id": user_id,
            "email": email,
            "display_name": display_name,
            "job_preference": job_preference
        }
        res = supabase.table("profiles").upsert(data).execute()
        return res.data
    except Exception as e:
        print("Supabase profile save warning:", str(e))
        return {"id": user_id, "email": email}

def save_interview_report(report_data: dict):
    if not supabase:
        return report_data
    try:
        res = supabase.table("reports").insert(report_data).execute()
        return res.data
    except Exception as e:
        print("Supabase report save warning:", str(e))
        return report_data
