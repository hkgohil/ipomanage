# Vercel Deployment Guide for IPO Tracker

This guide will walk you through deploying your IPO Tracker application to Vercel.

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- MongoDB Atlas account (or your MongoDB connection string)
- All environment variables ready

## Step 1: Prepare Your Code

### 1.1 Ensure Your Code is Ready

Make sure your code is working locally:

```bash
# Test the build locally
npm run build

# If build succeeds, you're good to go!
```

### 1.2 Commit and Push to GitHub

If you haven't already, initialize git and push to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for Vercel deployment"

# Create a repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**Important:** Make sure `.env.local` is in your `.gitignore` (it should be by default).

## Step 2: Set Up MongoDB Atlas (If Not Already Done)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster (if you don't have one)
3. Create a database user:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a strong password (save it!)
   - Set privileges to "Read and write to any database"
4. Whitelist IP addresses:
   - Go to "Network Access"
   - Click "Add IP Address"
   - For Vercel, add `0.0.0.0/0` (allows all IPs - required for Vercel)
   - Click "Confirm"
5. Get your connection string:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `ipoapp` (or your preferred database name)

**Example connection string:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ipoapp?retryWrites=true&w=majority
```

## Step 3: Generate Secure Keys

Before deploying, generate secure keys for production:

```bash
# Generate JWT_SECRET (64 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate PAN_ENCRYPTION_KEY (32 characters)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

**Save these values** - you'll need them in the next step!

## Step 4: Deploy to Vercel

### 4.1 Import Your Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select your repository and click "Import"

### 4.2 Configure Project Settings

Vercel will auto-detect Next.js. Verify these settings:

- **Framework Preset:** Next.js
- **Root Directory:** `./` (root)
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

### 4.3 Add Environment Variables

**CRITICAL:** Add all these environment variables in Vercel before deploying:

1. In the "Environment Variables" section, add each variable:

   | Variable Name | Value | Notes |
   |--------------|-------|-------|
   | `MONGODB_URI` | Your MongoDB connection string | Full connection string with password |
   | `MONGODB_DB` | `ipoapp` | Your database name |
   | `JWT_SECRET` | Generated 64-char hex string | Use the key you generated in Step 3 |
   | `PAN_ENCRYPTION_KEY` | Generated 32-char hex string | Use the key you generated in Step 3 |
   | `JWT_EXPIRES_IN` | `7d` | Token expiration time |
   | `ADMIN_EMAIL` | Your admin email | Email that gets admin role on signup |
   | `ADMIN_PASSWORD` | Your admin password | Password for admin account |

2. For each variable:
   - Click "Add"
   - Enter the variable name
   - Enter the value
   - Select environments: **Production, Preview, and Development** (or just Production if you prefer)
   - Click "Save"

**Important Notes:**
- **MONGODB_URI:** Make sure to URL-encode special characters in your password:
  - `@` → `%40`
  - `#` → `%23`
  - `%` → `%25`
  - `&` → `%26`
  - `/` → `%2F`
  - `?` → `%3F`
  - `=` → `%3D`

- **MONGODB_DISABLE_SSL:** You can add this as `true` if you're having SSL issues, but for production, it's better to use proper SSL certificates.

### 4.4 Deploy

1. Click "Deploy" button
2. Wait for the build to complete (usually 2-5 minutes)
3. Once deployed, you'll get a URL like: `https://your-app-name.vercel.app`

## Step 5: Post-Deployment Setup

### 5.1 Create Admin Account

1. Visit your deployed app URL
2. Click "Sign Up"
3. Use the email you set in `ADMIN_EMAIL`
4. Use the password you set in `ADMIN_PASSWORD`
5. You'll automatically get admin role

### 5.2 Verify Everything Works

- ✅ Sign up/Sign in works
- ✅ Can view IPOs
- ✅ Can add PAN cards
- ✅ Can add applications
- ✅ Admin can add/edit IPOs (if you signed up with admin email)

## Step 6: Custom Domain (Optional)

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow Vercel's instructions to configure DNS

## Troubleshooting

### Build Fails

**Error: "MONGODB_URI is not set"**
- Make sure you added all environment variables in Vercel
- Redeploy after adding variables

**Error: MongoDB connection fails**
- Check your MongoDB Atlas Network Access (must allow `0.0.0.0/0` for Vercel)
- Verify connection string is correct
- Check if password has special characters that need URL encoding

**Error: Build timeout**
- Vercel free tier has build time limits
- Check your build logs for specific errors
- Make sure all dependencies are in `package.json`

### Runtime Errors

**Error: "JWT_SECRET is not set"**
- Verify environment variables are set in Vercel
- Make sure they're set for "Production" environment
- Redeploy after adding

**Error: "PAN_ENCRYPTION_KEY is not set"**
- Same as above - check environment variables

**MongoDB Connection Issues**
- Verify MongoDB Atlas allows connections from `0.0.0.0/0`
- Check connection string format
- Ensure database user has correct permissions

### Environment Variables Not Working

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify all variables are added
3. Make sure they're enabled for the correct environment (Production/Preview/Development)
4. **Redeploy** after adding/updating environment variables

## Important Security Notes

1. **Never commit `.env.local`** to git
2. **Use strong, random keys** for JWT_SECRET and PAN_ENCRYPTION_KEY
3. **Don't share** your environment variables
4. **Rotate keys** if they're ever exposed
5. **Use MongoDB Atlas IP whitelist** properly (only allow necessary IPs in production)

## Updating Your Deployment

After making code changes:

1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```

2. Vercel will automatically:
   - Detect the push
   - Start a new deployment
   - Deploy to preview URL first
   - Promote to production (if auto-deploy is enabled)

Or manually trigger deployment:
1. Go to Vercel Dashboard
2. Click "Deployments"
3. Click "Redeploy" on the latest deployment

## Monitoring

- Check deployment logs in Vercel Dashboard
- Monitor function logs for API route errors
- Use Vercel Analytics (already integrated) to track usage

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check MongoDB Atlas connection status
3. Verify all environment variables are set correctly
4. Review the SETUP.md file for local setup troubleshooting

---

**Congratulations!** Your IPO Tracker app is now live on Vercel! 🚀

