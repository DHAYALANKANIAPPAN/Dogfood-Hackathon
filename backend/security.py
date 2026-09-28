from fastapi import Depends, HTTPException, Request, status
from typing import List
from slowapi import Limiter
from slowapi.util import get_remote_address

import models
from auth import get_current_user

# --- 1. ANTI-ABUSE: Rate Limiting ---
# We use in-memory rate limiting based on IP address to prevent ballot stuffing
# and API scraping. This works completely offline without needing Redis.
limiter = Limiter(key_func=get_remote_address)


# --- 2. ROLE ISOLATION: Strict RBAC ---
# This class acts as a FastAPI dependency. It intercepts the request,
# checks the user's role from the JWT, and blocks unauthorized access instantly.
class RoleChecker:
    def __init__(self, allowed_roles: List[models.RoleEnum]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: models.User = Depends(get_current_user)):
        if user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Security Violation: Operation not permitted for role '{user.role.value}'."
            )
        return user

# Helper variables for easy endpoint decoration
allow_all_authenticated = RoleChecker([
    models.RoleEnum.ADMIN, 
    models.RoleEnum.ORGANIZER, 
    models.RoleEnum.JUDGE, 
    models.RoleEnum.PARTICIPANT
])

allow_judges_and_admins = RoleChecker([
    models.RoleEnum.ADMIN, 
    models.RoleEnum.ORGANIZER, 
    models.RoleEnum.JUDGE
])

allow_admins_only = RoleChecker([
    models.RoleEnum.ADMIN, 
    models.RoleEnum.ORGANIZER
])
