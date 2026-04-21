import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from fastapi import APIRouter
from database import get_monthly_usage

router = APIRouter()

MONTHLY_LIMIT = 1000

@router.get("/usage")
async def get_usage():
    """今月のAPI使用料を返すエンドポイント"""
    used = get_monthly_usage()
    remaining = MONTHLY_LIMIT - used
    return{
        "used": used,
        "remaining": remaining,
        "limit": MONTHLY_LIMIT,
        "percentage": round(used / MONTHLY_LIMIT * 100,1),
        "warning": used>= 900,
        "blocked": used >= MONTHLY_LIMIT,
    }
    