# Quick Start: Deploy to Vercel in 5 Minutes

## 🚀 Fast Track Deployment

### Step 1: Push to GitHub (2 min)
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Generate Keys (1 min)
```bash
# JWT_SECRET (copy this)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# PAN_ENCRYPTION_KEY (copy this)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### Step 3: Set Up MongoDB Atlas (2 min)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create cluster → Create database user → Whitelist IP `0.0.0.0/0`
3. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/ipoapp`

### Step 4: Deploy to Vercel (5 min)
1. Go to [vercel.com](https://vercel.com) → "Add New Project"
2. Import your GitHub repo
3. Add these environment variables:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ipoapp
   MONGODB_DB=ipoapp
   JWT_SECRET=<paste-generated-key>
   PAN_ENCRYPTION_KEY=<paste-generated-key>
   JWT_EXPIRES_IN=7d
   ADMIN_EMAIL=your@email.com
   ADMIN_PASSWORD=your-password
   ```
4. Click "Deploy"

### Step 5: Test (1 min)
1. Visit your Vercel URL
2. Sign up with `ADMIN_EMAIL`
3. You're done! 🎉

---

**Need detailed instructions?** See `VERCEL_DEPLOYMENT.md`

**Want a checklist?** See `DEPLOYMENT_CHECKLIST.md`

