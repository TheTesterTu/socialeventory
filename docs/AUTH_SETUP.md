# Authentication Setup Guide

## Current Implementation ✅

### Features Implemented
- ✅ Email/Password authentication
- ✅ User signup with profile creation
- ✅ User signin with session management
- ✅ Password reset flow
- ✅ Session persistence (localStorage)
- ✅ Auto token refresh
- ✅ Protected routes
- ✅ Role-based access control (Admin)
- ✅ Input validation (client + server)
- ✅ Comprehensive error handling

### Security Features
- ✅ Server-side password validation
- ✅ Email validation
- ✅ Username validation (3-20 chars, alphanumeric + _ -)
- ✅ Password requirements (min 6 chars, will enforce stronger in Supabase)
- ✅ Protection against common attack vectors
- ✅ Secure session management
- ✅ RLS policies on all tables

## Required Supabase Configuration

### 1. Email Settings (CRITICAL)

#### Site URL
Set in: **Authentication > URL Configuration > Site URL**
```
https://your-domain.com
```
OR for development:
```
http://localhost:5173
```

#### Redirect URLs
Set in: **Authentication > URL Configuration > Redirect URLs**

Add ALL of these:
```
http://localhost:5173/**
https://your-preview-url.lovable.app/**
https://your-production-domain.com/**
```

**Why this matters:** Without correct URLs, you'll get `"requested path is invalid"` errors.

### 2. Email Confirmation

For development/testing, you may want to disable email confirmation:

Go to: **Authentication > Providers > Email**
- Uncheck "Confirm email"

**For production:** Always enable email confirmation!

### 3. Password Security

Enable these in: **Authentication > Password**

- ✅ Minimum password length: 12 characters
- ✅ Require uppercase letters
- ✅ Require lowercase letters  
- ✅ Require numbers
- ✅ Require special characters
- ✅ **Enable Leaked Password Protection** (HIBP integration)

### 4. Email Templates

Customize in: **Authentication > Email Templates**

Templates to customize:
- Confirm signup
- Reset password
- Magic link
- Change email address

Add your branding and support information.

## User Flow

### Signup Flow
```
1. User enters: email, username, full name, password
2. Client validates inputs (zod schemas)
3. Server creates auth user + profile entry (via trigger)
4. Email confirmation sent (if enabled)
5. User confirms email
6. User can sign in
```

### Signin Flow
```
1. User enters: email, password
2. Client validates email format
3. Server validates credentials
4. Session created & stored
5. User redirected to /events
```

### Password Reset Flow
```
1. User enters email on forgot password page
2. Reset email sent with secure token
3. User clicks link → redirected to /reset-password
4. User enters new password
5. Password updated
6. User can sign in with new password
```

## Protected Routes

### User Authentication Required
- `/profile` - User profile
- `/profile/edit` - Edit profile
- `/create-event` - Create events
- `/settings` - User settings
- `/notifications` - Notifications

### Admin Only
- `/admin` - Admin dashboard

Protection is enforced by:
1. `ProtectedRoute` component (user auth)
2. `ProtectedAdminRoute` component (admin auth)
3. `useSecureAdmin` hook (server-side role validation)

## Error Handling

### Common Errors & Solutions

**"Invalid login credentials"**
- Wrong email or password
- User-friendly message shown

**"Email not confirmed"**
- User hasn't clicked email confirmation link
- Prompt to check email

**"User already registered"**
- Email already in use
- Prompt to sign in instead

**"requested path is invalid"**
- Site URL or Redirect URL not configured in Supabase
- See configuration section above

## Testing Authentication

### Development Testing
1. Go to `/auth?mode=signup`
2. Create test account
3. If email confirmation disabled, you can immediately sign in
4. If email confirmation enabled, check Supabase logs for magic link

### Production Testing
1. Test full signup flow with real email
2. Verify email confirmation works
3. Test password reset flow
4. Test session persistence (refresh page)
5. Test logout and re-login

## Social Auth (Future)

Placeholder buttons exist for:
- Google OAuth
- GitHub OAuth

To implement:
1. Configure providers in Supabase
2. Add client IDs/secrets
3. Implement OAuth flows
4. Update Auth.tsx to enable buttons

## Best Practices

### Security
- ✅ Never log passwords or tokens
- ✅ Use HTTPS in production
- ✅ Enable email confirmation
- ✅ Enforce strong passwords
- ✅ Use leaked password protection
- ✅ Implement rate limiting (Supabase does this)

### UX
- ✅ Clear error messages
- ✅ Loading states during auth operations
- ✅ Remember redirect after login
- ✅ Auto-redirect authenticated users
- ✅ Password visibility toggle (future)

### Performance
- ✅ Session stored in localStorage
- ✅ Auto token refresh
- ✅ Efficient auth state management
- ✅ No unnecessary re-renders

## Troubleshooting

### Users can't receive emails
- Check Supabase email settings
- Verify email provider configured
- Check spam folder
- Review Supabase logs

### Sessions not persisting
- Check localStorage is enabled
- Verify no AdBlockers interfering
- Check browser console for errors

### Admin access not working
- Verify user has admin role in `user_roles` table
- Check `useSecureAdmin` hook implementation
- Verify RLS policies allow role checking

---

**Status**: Production-ready with manual Supabase configuration required
**Last Updated**: 2025
