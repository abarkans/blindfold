# Blindfold - Deployment Setup Guide

## Quick Overview

This app uses:
- **Vercel** for hosting (frontend + serverless API)
- **Supabase** for database + authentication

---

## Step 1: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (pick a region close to you)
3. Wait for the project to finish provisioning (~2 min)

### Enable Email Auth
1. Go to **Authentication** > **Providers**
2. Enable **Email** provider
3. (Optional) Disable email confirmation if you want instant signups during dev

### Run the Database Schema
1. Go to **SQL Editor** in Supabase
2. Click **New Query**
3. Copy the contents of `supabase-schema.sql` from this repo
4. Paste and click **Run**

### Get Your Credentials
1. Go to **Settings** > **API**
2. Copy these values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

---

## Step 2: Local Development

1. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Paste your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Run the dev server:
   ```bash
   npm run dev
   ```

---

## Step 3: Deploy to Vercel

### Option A: Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```
   - First time: Follow the setup prompts
   - Set environment variables when prompted

4. Production deploy:
   ```bash
   vercel --prod
   ```

### Option B: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **Add New Project**
4. Import your GitHub repo
5. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **Deploy**

---

## Step 4: Configure Production URL

1. In Supabase, go to **Authentication** > **URL Configuration**
2. Add your Vercel production URL to **Site URL**
3. Add `https://your-vercel-url.com/auth/callback` to **Redirect URLs**

---

## Environment Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase > Settings > API |
| `VITE_SUPABASE_ANON_KEY` | Public anon key | Supabase > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Service key for API routes (Vercel only) | Supabase > Settings > API |

---

## Testing Locally

1. Run `npm run dev`
2. Go to `/auth` to create an account
3. Complete onboarding
4. Check Supabase **Database** table to see synced data

---

## Troubleshooting

**"Failed to get user data"**
- Check that you ran the SQL schema in Supabase
- Verify environment variables are set correctly

**Auth not working**
- Make sure you added your Vercel URL to Supabase redirect URLs
- Check that Email auth is enabled in Supabase

**Data not syncing**
- Open browser console for errors
- Check Supabase logs under **Database** > **Logs**

---

## Costs

- **Supabase Free Tier**: 500MB database, 50k monthly active users
- **Vercel Free Tier**: Unlimited deployments, 100GB bandwidth/month

Both are generous enough for personal/small production use.
