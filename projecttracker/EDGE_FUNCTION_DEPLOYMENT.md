# Supabase Edge Function Deployment Guide

## Overview

Your `insert-profile` Edge Function is ready for deployment. It uses the correct profiles table structure with columns: `id`, `display_name`, and `role`.

## Prerequisites

✅ All environment variables are properly configured:
- `SUPABASE_SERVICE_ROLE_KEY`: Available
- `VITE_SUPABASE_URL`: Available  
- `VITE_SUPABASE_ANON_KEY`: Available

## Edge Function Structure

```
supabase/functions/insert-profile/index.ts
```

### Function Features:
- ✅ Validates required fields (id, display_name, role)
- ✅ Validates role values (user, admin, super_admin)
- ✅ Uses correct profiles table schema
- ✅ Proper error handling and JSON responses
- ✅ Service role authentication

## Deployment Commands

### 1. Install Supabase CLI (if not already installed)
```bash
npm install -g supabase
```

### 2. Login to Supabase
```bash
supabase login
```

### 3. Link to your project
```bash
supabase link --project-ref eojnpjnlvscxtboimhln
```

### 4. Deploy the function
```bash
supabase functions deploy insert-profile
```

## Testing the Deployed Function

Once deployed, test with:
```bash
node test-edge-function.js
```

## Function URL
After deployment, your function will be available at:
```
https://eojnpjnlvscxtboimhln.supabase.co/functions/v1/insert-profile
```

## Usage Example

```javascript
const response = await fetch('https://eojnpjnlvscxtboimhln.supabase.co/functions/v1/insert-profile', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
  },
  body: JSON.stringify({
    id: crypto.randomUUID(),
    display_name: 'New User',
    role: 'user'
  })
});
```

## Integration with Admin Panel

Your Edge Function can be integrated into the admin invitation system for automated profile creation during user registration.

## Security Notes

- Function requires service role authentication
- Validates role values to prevent unauthorized privilege escalation
- Uses RLS-protected profiles table
- Proper error handling prevents information disclosure