# 🔐 Refresh Token Authentication System

## Overview

StudySpark uses a **dual-token authentication system** for enhanced security:

- **Access Token** (short-lived: 15 minutes)
- **Refresh Token** (long-lived: 30 days)

This is the industry-standard approach used by Google, Facebook, GitHub, etc.

---

## How It Works

### 1. Login Flow

```
User logs in
    ↓
Backend generates TWO tokens:
    ├── Access Token  (15 min expiry)
    └── Refresh Token (30 days expiry, stored in database)
    ↓
Frontend stores both:
    ├── accessToken  → localStorage
    └── refreshToken → localStorage
```

### 2. Making API Requests

```
Frontend sends request with Access Token
    ↓
Access Token valid? (< 15 min old)
    ├── YES → ✅ Request succeeds
    └── NO  → ❌ 401 Unauthorized
              ↓
        Axios interceptor auto-calls /auth/refresh
              ↓
        Sends Refresh Token to backend
              ↓
        Backend validates & rotates tokens
              ↓
        Returns NEW Access Token + NEW Refresh Token
              ↓
        Frontend stores new tokens
              ↓
        Retry original request automatically
```

### 3. Token Rotation

Every time you use a refresh token, you get:
- New access token
- New refresh token (old one is revoked)

This prevents token reuse attacks!

---

## Security Benefits

| Feature | Before | After |
|---------|--------|-------|
| **Token Lifetime** | 7 days | 15 minutes |
| **If Stolen** | 7 days access | 15 min max access |
| **Revocation** | Hard (need blacklist) | Easy (revoke refresh token) |
| **User Experience** | Logout after 7 days | Never logged out |
| **Security Level** | ⚠️ Medium | ✅ High |

---

## Backend Implementation

### Access Token (JWT)
```javascript
// Short-lived, stateless JWT
jwt.sign({ userId }, SECRET, { expiresIn: '15m' })
```

### Refresh Token (Database)
```javascript
// Long-lived, random string stored in MongoDB
{
  token: crypto.randomBytes(40).toString('hex'),
  userId: ObjectId,
  expiresAt: Date (30 days),
  revokedAt: null,
  createdByIp: '192.168.1.1'
}
```

### Token Rotation
```javascript
// Old refresh token is revoked when used
oldToken.revokedAt = Date.now()
oldToken.replacedByToken = newToken.token
```

---

## Frontend Implementation

### Axios Interceptor
```typescript
// Auto-refresh expired access tokens
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const newTokens = await refreshAccessToken()
      // Retry original request with new token
      return api(originalRequest)
    }
  }
)
```

### Token Storage
```typescript
localStorage.setItem('accessToken', token)    // Used for API calls
localStorage.setItem('refreshToken', token)   // Used for refresh
```

---

## API Endpoints

### POST /api/v1/auth/register
**Response:**
```json
{
  "success": true,
  "user": { ...userdata },
  "accessToken": "eyJhbGc...",   // 15 min
  "refreshToken": "a1b2c3..."     // 30 days
}
```

### POST /api/v1/auth/login
**Response:**
```json
{
  "success": true,
  "user": { ...userdata },
  "accessToken": "eyJhbGc...",
  "refreshToken": "a1b2c3..."
}
```

### POST /api/v1/auth/refresh
**Request:**
```json
{
  "refreshToken": "a1b2c3..."
}
```

**Response:**
```json
{
  "success": true,
  "accessToken": "NEW_TOKEN",      // New 15 min token
  "refreshToken": "NEW_REFRESH"    // New 30 day token
}
```

### POST /api/v1/auth/logout
**Request:**
```json
{
  "refreshToken": "a1b2c3..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Token Revocation

Tokens can be revoked in these scenarios:

1. **User logs out** → Refresh token marked as revoked
2. **Token is used** → Old refresh token revoked, new one issued
3. **Suspicious activity** → Admin can revoke all user tokens
4. **Token expires** → MongoDB TTL index auto-deletes

---

## Testing the Flow

### 1. Register/Login
```bash
curl -X POST https://studysparkbackend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

Response:
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "abc123..."
}
```

### 2. Use Access Token
```bash
curl https://studysparkbackend.onrender.com/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGc..."
```

### 3. Refresh Token (after 15 min)
```bash
curl -X POST https://studysparkbackend.onrender.com/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"abc123..."}'
```

---

## Migration from Old System

**Old System:**
```json
{
  "token": "eyJhbGc..."  // Single 7-day token
}
```

**New System:**
```json
{
  "accessToken": "eyJhbGc...",   // 15 min
  "refreshToken": "abc123..."     // 30 days
}
```

**Breaking Changes:**
- `token` → `accessToken` + `refreshToken`
- Frontend needs to update localStorage keys
- Frontend needs axios interceptor for auto-refresh

---

## Troubleshooting

### "Invalid or expired refresh token"
- Refresh token expired (30 days)
- User needs to login again
- Auto-redirects to /auth/login

### "Token refresh loop"
- Check if refresh endpoint returns NEW tokens
- Ensure old tokens are being replaced

### "User logged out unexpectedly"
- Check if access token is being stored correctly
- Check axios interceptor is configured
- Check browser console for 401 errors

---

## Best Practices

✅ **DO:**
- Store access token in memory/localStorage
- Use refresh token only for /auth/refresh
- Implement token refresh interceptor
- Clear both tokens on logout

❌ **DON'T:**
- Send refresh token with every request
- Store tokens in cookies (CSRF vulnerable)
- Ignore 401 errors without refresh attempt
- Use same token twice after refresh

---

**System Status:** ✅ Fully Implemented
**Security Level:** 🔒 High (Industry Standard)
**User Experience:** ⚡ Seamless (Auto-refresh)
