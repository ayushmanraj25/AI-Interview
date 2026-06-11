from fastapi import APIRouter, Depends
from app.supabase.queries import save_user_profile

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/profile")
async def save_profile(data: dict):
    res = save_user_profile(
        user_id=data.get("id"),
        email=data.get("email"),
        display_name=data.get("display_name", "Candidate"),
        job_preference=data.get("job_preference", "Developer")
    )
    return {"status": "success", "profile": res}
