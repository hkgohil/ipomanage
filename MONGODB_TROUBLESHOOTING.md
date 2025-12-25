# MongoDB "Not Found" Error - Troubleshooting Guide

## Common Causes & Solutions

### 1. Database Doesn't Exist in MongoDB Atlas

**Problem:** The database name in your connection string doesn't exist.

**Solution:**
- MongoDB Atlas creates databases automatically when you first write data
- However, you need to ensure the connection string is correct
- The database name should be in the connection string: `mongodb+srv://.../ipoapp?retryWrites=true&w=majority`

**Check:**
1. Go to MongoDB Atlas → Browse Collections
2. If you don't see `ipoapp` database, it will be created automatically on first use
3. Make sure `MONGODB_DB=ipoapp` matches the database name in your connection string

### 2. Connection String Format Issues

**Problem:** Incorrect connection string format.

**Correct Format:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ipoapp?retryWrites=true&w=majority
```

**Common Mistakes:**
- ❌ Missing database name: `mongodb+srv://user:pass@cluster.net`
- ✅ Correct: `mongodb+srv://user:pass@cluster.net/ipoapp?retryWrites=true&w=majority`

- ❌ Special characters in password not URL-encoded
- ✅ URL-encode special characters:
  - `@` → `%40`
  - `#` → `%23`
  - `%` → `%25`
  - `&` → `%26`
  - `/` → `%2F`
  - `?` → `%3F`
  - `=` → `%3D`

### 3. Network Access Not Configured

**Problem:** MongoDB Atlas is blocking your connection.

**Solution:**
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. For Vercel deployment: Add `0.0.0.0/0` (allows all IPs)
4. For local development: Add your current IP address
5. Wait 2-3 minutes for changes to take effect

### 4. Database User Permissions

**Problem:** Database user doesn't have proper permissions.

**Solution:**
1. Go to MongoDB Atlas → Database Access
2. Find your database user
3. Ensure they have:
   - **Built-in Role:** `readWrite` or `dbAdmin`
   - Or custom role with read/write permissions

### 5. Environment Variables Not Set

**Problem:** `MONGODB_URI` or `MONGODB_DB` not set correctly.

**Check Locally:**
```bash
# Check if .env.local exists
cat .env.local

# Should contain:
MONGODB_URI="mongodb+srv://..."
MONGODB_DB="ipoapp"
```

**Check on Vercel:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify both `MONGODB_URI` and `MONGODB_DB` are set
3. Make sure they're enabled for the correct environment (Production/Preview)

### 6. Connection String in .env.local

**Example .env.local:**
```bash
MONGODB_URI="mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/ipoapp?retryWrites=true&w=majority"
MONGODB_DB="ipoapp"
MONGODB_DISABLE_SSL="true"
JWT_SECRET="your-jwt-secret-here"
PAN_ENCRYPTION_KEY="your-pan-key-here"
JWT_EXPIRES_IN="7d"
ADMIN_EMAIL="hk@gmail.com"
ADMIN_PASSWORD="your-password"
```

**Important Notes:**
- Use quotes around the connection string
- Database name (`ipoapp`) should be in both:
  - The connection string: `...mongodb.net/ipoapp?...`
  - The `MONGODB_DB` variable: `MONGODB_DB="ipoapp"`

### 7. Test Your Connection String

**Using MongoDB Compass:**
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Paste your connection string
3. Click "Connect"
4. If it works in Compass but not in your app, check environment variables

**Using Node.js:**
```bash
# Create test file: test-mongo.js
const { MongoClient } = require('mongodb');

const uri = "your-connection-string-here";

async function test() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connected successfully!");
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Ping successful!");
    const db = client.db("ipoapp");
    const collections = await db.listCollections().toArray();
    console.log("✅ Collections:", collections);
    await client.close();
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

test();
```

Run: `node test-mongo.js`

## Step-by-Step Fix

### For Local Development:

1. **Check .env.local exists:**
   ```bash
   ls -la .env.local
   ```

2. **Verify connection string format:**
   - Should start with `mongodb+srv://` or `mongodb://`
   - Should include database name: `/ipoapp`
   - Should have query parameters: `?retryWrites=true&w=majority`

3. **Test connection:**
   ```bash
   npm run dev
   ```
   - Check console for MongoDB connection messages
   - Look for any error messages

4. **Check MongoDB Atlas:**
   - Network Access: Should allow your IP or `0.0.0.0/0`
   - Database Access: User should have read/write permissions

### For Vercel Deployment:

1. **Add Environment Variables:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add `MONGODB_URI` with full connection string
   - Add `MONGODB_DB` with value `ipoapp`

2. **Verify MongoDB Atlas Network Access:**
   - Must allow `0.0.0.0/0` for Vercel to connect

3. **Redeploy:**
   - After adding environment variables, click "Redeploy"

4. **Check Deployment Logs:**
   - Go to Vercel Dashboard → Deployments
   - Click on latest deployment
   - Check "Function Logs" for MongoDB connection errors

## Quick Diagnostic Commands

```bash
# Check if environment variables are loaded (locally)
node -e "require('dotenv').config({ path: '.env.local' }); console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set ✅' : 'Not set ❌'); console.log('MONGODB_DB:', process.env.MONGODB_DB ? 'Set ✅' : 'Not set ❌');"
```

## Still Having Issues?

1. **Check the exact error message** in:
   - Browser console (for client-side errors)
   - Terminal (for local dev server)
   - Vercel function logs (for deployment)

2. **Verify MongoDB Atlas Status:**
   - Go to MongoDB Atlas dashboard
   - Check if cluster is running (green status)
   - Check if there are any alerts

3. **Try a simpler connection string:**
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ipoapp
   ```
   (Minimal version without extra parameters)

4. **Check MongoDB driver version:**
   ```bash
   npm list mongodb
   ```
   Should be a recent version (4.x or 5.x)

---

**Need more help?** Check the error message details and share:
- The exact error message
- Whether it's local or Vercel
- Your MongoDB Atlas cluster status
- Your connection string format (with password hidden)

