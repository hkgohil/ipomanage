# Quick Deployment Checklist

Use this checklist to ensure a smooth deployment to Vercel.

## Pre-Deployment Checklist

- [ ] Code is working locally (`npm run dev`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] All environment variables documented
- [ ] MongoDB Atlas cluster is set up
- [ ] MongoDB Atlas network access allows `0.0.0.0/0`
- [ ] MongoDB database user created with read/write permissions
- [ ] Connection string ready (with password replaced)
- [ ] JWT_SECRET generated (64 characters)
- [ ] PAN_ENCRYPTION_KEY generated (32 characters)
- [ ] Code pushed to GitHub
- [ ] `.env.local` is in `.gitignore` (should be by default)

## Vercel Deployment Checklist

- [ ] Vercel account created
- [ ] GitHub repository imported to Vercel
- [ ] Framework preset: Next.js (auto-detected)
- [ ] Environment variables added:
  - [ ] `MONGODB_URI`
  - [ ] `MONGODB_DB`
  - [ ] `JWT_SECRET`
  - [ ] `PAN_ENCRYPTION_KEY`
  - [ ] `JWT_EXPIRES_IN`
  - [ ] `ADMIN_EMAIL`
  - [ ] `ADMIN_PASSWORD`
- [ ] All environment variables set for "Production" environment
- [ ] Deploy button clicked
- [ ] Build completed successfully
- [ ] Deployment URL received

## Post-Deployment Checklist

- [ ] Visited deployed URL
- [ ] Sign up page loads
- [ ] Created admin account (using ADMIN_EMAIL)
- [ ] Can sign in
- [ ] Can view IPOs page
- [ ] Can add PAN card
- [ ] Can add application (if user)
- [ ] Can add IPO (if admin)
- [ ] All pages load without errors
- [ ] No console errors in browser

## Environment Variables Reference

Copy this list when adding variables to Vercel:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ipoapp?retryWrites=true&w=majority
MONGODB_DB=ipoapp
JWT_SECRET=your-64-character-hex-string-here
PAN_ENCRYPTION_KEY=your-32-character-hex-string-here
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password
```

## Quick Commands

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate PAN_ENCRYPTION_KEY
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"

# Test build locally
npm run build

# Run locally
npm run dev
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Build fails: "MONGODB_URI is not set" | Add environment variables in Vercel and redeploy |
| MongoDB connection error | Check Network Access in MongoDB Atlas (allow 0.0.0.0/0) |
| JWT errors | Verify JWT_SECRET is set correctly |
| PAN encryption errors | Verify PAN_ENCRYPTION_KEY is exactly 32 characters |
| Environment variables not working | Redeploy after adding variables |

---

**Ready to deploy?** Follow the detailed guide in `VERCEL_DEPLOYMENT.md`

