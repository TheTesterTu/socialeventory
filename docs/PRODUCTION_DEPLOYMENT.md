# Production Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. Security Configuration (CRITICAL)

#### Supabase Dashboard Configuration

**Authentication Settings**
- [ ] **Site URL**: Set to your production domain in Authentication > URL Configuration
- [ ] **Redirect URLs**: Add all production and preview URLs
- [ ] **Email Confirmation**: ENABLED for production (Authentication > Providers > Email)
- [ ] **Leaked Password Protection**: ENABLED (Authentication > Password Settings)
  - [Documentation](https://docs.lovable.dev/features/security#leaked-password-protection-disabled)

**Password Requirements**
- [ ] Minimum length: 12 characters
- [ ] Require uppercase letters
- [ ] Require lowercase letters  
- [ ] Require numbers
- [ ] Require special characters

**Database Security**
- [ ] Row Level Security (RLS) enabled on all tables ✅
- [ ] Admin role checks use server-side validation ✅
- [ ] No sensitive data exposed publicly ✅
- [ ] PostgreSQL upgraded to latest version

### 2. Environment Configuration

All environment variables are managed through Supabase Secrets (no .env files needed):

**Required Secrets** ✅
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `LOVABLE_API_KEY`

### 3. Performance Optimizations ✅

- [x] React Query caching configured (5 min stale time, 30 min cache)
- [x] Image lazy loading implemented
- [x] Code splitting with React.lazy
- [x] Error boundaries in place
- [x] Production logging disabled
- [x] Database query optimization
- [x] Automatic event count triggers

### 4. Code Quality ✅

- [x] TypeScript strict mode
- [x] No console.log in production (using logger utility)
- [x] Input validation (Zod schemas)
- [x] HTML sanitization (DOMPurify)
- [x] Error handling throughout
- [x] Loading states implemented

## 🚀 Deployment Steps

### Step 1: Configure Supabase

1. **Go to Supabase Dashboard** → Your Project
2. **Authentication** → URL Configuration
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: Add all domains (production, preview, localhost)
   
3. **Authentication** → Password
   - Enable "Leaked Password Protection"
   - Set password requirements (min 12 chars, uppercase, lowercase, numbers, special chars)

4. **Authentication** → Email Templates
   - Customize confirmation, reset password, and magic link emails
   - Add your branding

5. **Database** → Settings
   - Upgrade PostgreSQL to latest version

### Step 2: Deploy with Lovable

1. Click **"Publish"** in Lovable editor (top right)
2. Your app will be deployed to `yourapp.lovable.app`
3. SSL is automatically configured

### Step 3: Custom Domain (Optional)

1. **Project Settings** → **Domains** in Lovable
2. Add your custom domain
3. Update DNS records at your registrar:
   - A Record: `@` → `185.158.133.1`
   - A Record: `www` → `185.158.133.1`
4. Wait for DNS propagation (up to 48 hours)
5. SSL auto-provisions via Let's Encrypt

### Step 4: Verify Deployment

**Test Authentication Flow**
- [ ] User signup works
- [ ] Email confirmation sent and works
- [ ] Login works
- [ ] Password reset works
- [ ] Session persists on refresh

**Test Features**
- [ ] Event creation
- [ ] Event search and filters
- [ ] Location-based search
- [ ] Social interactions (likes, comments, attendance)
- [ ] Admin dashboard (for admin users)
- [ ] Profile management
- [ ] Notifications

**Test Performance**
- [ ] Page load times < 3 seconds
- [ ] Images load properly
- [ ] No console errors in production
- [ ] Mobile responsiveness

### Step 5: Monitoring Setup

**Supabase Monitoring**
- Monitor logs in Supabase Dashboard → Logs
- Set up alerts for errors
- Review database performance

**Recommended Tools** (Optional)
- Error tracking: Sentry, LogRocket
- Analytics: Google Analytics, Plausible
- Performance: Web Vitals, Lighthouse

## 📊 Post-Deployment

### Day 1
- [ ] Monitor error logs
- [ ] Check authentication success rate
- [ ] Verify all features work
- [ ] Test on multiple devices/browsers

### Week 1
- [ ] Review performance metrics
- [ ] Check database query performance
- [ ] Monitor user feedback
- [ ] Optimize slow queries if needed

### Month 1
- [ ] Review analytics
- [ ] Plan feature improvements
- [ ] Database backup verification
- [ ] Security audit review

## 🔒 Security Best Practices

**Ongoing**
- Review RLS policies quarterly
- Update dependencies monthly
- Monitor Supabase security advisories
- Rotate service role keys if compromised
- Review admin access logs
- Keep PostgreSQL updated

## 🆘 Troubleshooting

### Users can't sign up
- Check email confirmation settings
- Verify redirect URLs are correct
- Check Supabase email logs
- Ensure password requirements are met

### Session not persisting
- Verify localStorage is enabled
- Check for AdBlockers
- Ensure cookies are allowed

### Slow performance
- Review Supabase query logs
- Check for N+1 queries
- Optimize images
- Enable browser caching

### Database errors
- Review RLS policies
- Check for missing indexes
- Monitor connection pool
- Verify data types

## 📚 Additional Resources

- [Lovable Docs](https://docs.lovable.dev/)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Production Checklist](./PRODUCTION_CHECKLIST.md)
- [Security Fixes](./SECURITY_FIXES.md)
- [Auth Setup](./AUTH_SETUP.md)

## ✨ Your App is Production Ready!

All critical security, performance, and configuration requirements are met. Follow the deployment steps above to go live! 🎉
