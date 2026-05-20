# Deployment Guide - Deinxel Digital Studio

This guide outlines the steps to deploy the Deinxel Digital Studio application and set up the necessary infrastructure.

## 1. Supabase Setup (Database & Auth)

The application relies on Supabase for data storage, authentication, and file management.

### Database Initialization
1. Create a new project in the [Supabase Dashboard](https://app.supabase.com).
2. Go to the **SQL Editor**.
3. Copy the contents of `supabase_schema.sql` from this repository and run it. This will create:
   - `profiles` table
   - `contact_messages` table (Inquiries)
   - `bookings` table
   - `assets` table
   - `chat_messages` table
   - Necessary RLS (Row Level Security) policies.

### Authentication
1. Go to **Authentication > Providers**.
2. Enable the **Email** provider.
3. (Optional) Set up Google OAuth for easy access.

### Storage
1. Go to **Storage**.
2. Create a public bucket named `clients`.
3. Ensure the security policies allow users to upload and view files (these should be created by the SQL script).

## 2. Environment Variables

Configure your deployment platform (e.g., Vercel, Netlify, Cloud Run) with the following variables:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase Anonymous Key |
| `SUPABASE_URL` | Also supported for local/server deployments |
| `SUPABASE_ANON_KEY` | Also supported for local/server deployments |

## 3. Deploying to Hosting Platforms

### Vercel / Netlify
1. Connect your GitHub repository to the platform.
2. The build command should be `npm run build`.
3. The output directory should be `dist`.
4. Add the environment variables mentioned above.

### Manual Deployment (Static Hosting)
1. Run `npm run build`.
2. Upload the contents of the `dist/` folder to your static hosting provider (e.g., AWS S3 + CloudFront, GitHub Pages).

## 4. Admin Access

To access the **Agency Console**:
1. Sign up as a regular user through the application's "Access" portal.
2. In the Supabase Dashboard, go to **Table Editor > profiles**.
3. Find your user row and change the `role` from `user` to `admin`.
4. Refresh the application, and the "Agency Console" button will appear in the Portal navigation.

## 5. Security Recommendations

- **RLS Policies**: Regularly review the Row Level Security policies in Supabase to ensure data isolation.
- **API Keys**: Never expose your `service_role` key on the client side. Only use the `anon` key.
- **Validation**: Ensure all forms have proper client-side and server-side (via Postgres constraints) validation.
