# IPO Tracker - Setup Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB instance)
- npm or pnpm package manager

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Set Up MongoDB

#### Option A: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string from "Connect" → "Connect your application"

#### Option B: Local MongoDB (No SSL Required)

1. Install MongoDB Community Server
2. Start MongoDB service
3. Use connection string: `mongodb://127.0.0.1:27017/ipoapp`
   - SSL/TLS is automatically disabled for local connections
   - Format: `mongodb://host:port/database`

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
MONGODB_URI="your-mongodb-connection-string"
MONGODB_DB="ipoapp"
MONGODB_DISABLE_SSL="true"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-admin-password"
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"
JWT_EXPIRES_IN="7d"
PAN_ENCRYPTION_KEY="your-32-character-encryption-key-for-pan-cards"
```

**Important:**
- `ADMIN_EMAIL`: The email address that will get admin role when signing up
- `ADMIN_PASSWORD`: The password for the admin account (you'll use this when signing up)
- Only the email specified in `ADMIN_EMAIL` will get admin role
- All other signups will automatically get user role

**Note:** If you're using MongoDB Atlas (`mongodb+srv://`), set `MONGODB_DISABLE_SSL="true"` to disable SSL validation (for development only). For production, use proper SSL certificates.

**Important Security Notes:**
- `JWT_SECRET`: Use a strong, random string (at least 32 characters)
- `PAN_ENCRYPTION_KEY`: Use a 32-character random string for encrypting PAN cards
- Never commit `.env.local` to version control

### 4. Generate Secure Keys

You can generate secure keys using:

```bash
# Generate JWT_SECRET (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate PAN_ENCRYPTION_KEY (32 characters)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### 5. Create Admin User

Admin role is automatically assigned based on the email in your `.env.local`:

1. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your `.env.local` file
2. Sign up using the admin email address
3. You will automatically get admin role
4. All other signups will get user role

**Example:**
- Set `ADMIN_EMAIL="admin@example.com"` in `.env.local`
- Sign up with email: `admin@example.com` and your chosen password
- You'll automatically have admin access to add/edit/delete IPOs

### 6. Run the Application

```bash
npm run dev
# or
pnpm dev
```

The app will be available at `http://localhost:3000`

## Features

### Admin Features
- Add, edit, and delete IPOs
- Manage IPO details (dates, GMP, recommendations, etc.)
- Protected admin routes

### User Features
- View all IPOs
- Track personal IPO applications
- Add multiple PAN cards (encrypted)
- View investment summary
- Check allotment status

## Security Features

- ✅ JWT-based authentication
- ✅ Bcrypt password hashing
- ✅ PAN card encryption (AES-256-GCM)
- ✅ Role-based access control
- ✅ Protected API routes
- ✅ Secure token storage

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

**Required Environment Variables for Production:**
- `MONGODB_URI`
- `MONGODB_DB`
- `JWT_SECRET`
- `PAN_ENCRYPTION_KEY`

## Troubleshooting

### MongoDB Connection Issues

**SSL/TLS Connection Errors:**

If you see errors like `ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR` or `MongoServerSelectionError`:

1. **Check Connection String Format:**
   - Ensure your connection string includes the database name: `mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority`
   - If your password contains special characters, URL encode them:
     - `@` → `%40`
     - `#` → `%23`
     - `%` → `%25`
     - `&` → `%26`
     - etc.

2. **Verify MongoDB Atlas Settings:**
   - Go to MongoDB Atlas → Network Access
   - Add your IP address (or use `0.0.0.0/0` for development)
   - Wait a few minutes for changes to propagate

3. **Check Database User:**
   - Ensure the database user has read/write permissions
   - Verify username and password are correct

4. **Connection String Example:**
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ipoapp?retryWrites=true&w=majority&appName=Cluster0
   ```

5. **For Local MongoDB:**
   - Use: `mongodb://127.0.0.1:27017/ipoapp`
   - Ensure MongoDB service is running
   - No SSL required for local connections

6. **Test Connection:**
   - Try connecting from MongoDB Compass or MongoDB shell
   - If it works there but not in the app, check environment variables

### Authentication Errors
- Verify JWT_SECRET is set correctly
- Check token expiration settings
- Clear browser localStorage if needed

### PAN Card Encryption Errors
- Ensure PAN_ENCRYPTION_KEY is exactly 32 characters
- Don't change encryption key after data is stored (data will be unreadable)

## Support

For issues or questions, check the codebase documentation or create an issue.

