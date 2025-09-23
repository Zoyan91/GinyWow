# GinyWow Website - Hostinger Deployment Guide

## 🚀 Two Deployment Options Available

### Option 1: Full-Stack Deployment (VPS) - **RECOMMENDED for GinyWow**
Your GinyWow website has backend functionality (URL shortening, API endpoints), so VPS hosting is required.

### Option 2: Static Frontend Only (Shared Hosting) 
If you only want the frontend without backend functionality (no URL generation, no database).

---

## 🔧 Option 1: Full-Stack VPS Deployment (RECOMMENDED)

### Step 1: Get Hostinger VPS
1. Go to **Hostinger.com** → Choose **VPS Hosting**
2. Select any VPS plan (KVM 1 or higher recommended)
3. Choose **"Ubuntu 22.04 64bit with Node.js and OpenLiteSpeed"** template
4. Complete purchase and wait for setup

### Step 2: Access Your VPS
1. Check your email for VPS details (IP address, root password)
2. Use SSH to connect:
   ```bash
   ssh root@your-vps-ip-address
   ```
3. Enter the password when prompted

### Step 3: Upload Your Files
**Method A: Using File Manager**
1. Login to **Hostinger Control Panel**
2. Go to **VPS** → **Manage** → **File Manager**
3. Upload the entire zip file you downloaded
4. Extract it in `/var/www/html/` or `/home/` directory

**Method B: Using SCP (from your computer)**
```bash
scp ginywow-production.zip root@your-vps-ip:/var/www/html/
```

### Step 4: Setup the Application
```bash
# Navigate to your app directory
cd /var/www/html/ginywow-production

# Install dependencies
npm install

# Install PM2 for process management
npm install -g pm2

# Start your application
pm2 start index.js --name "ginywow"

# Enable PM2 startup
pm2 startup
pm2 save
```

### Step 5: Configure Web Server (OpenLiteSpeed)
1. Go to **Hostinger Control Panel** → **VPS** → **Manage**
2. Click **"Access Web Admin Panel"** (OpenLiteSpeed)
3. Login with admin credentials
4. Configure Virtual Host:
   - **Domain**: your-domain.com
   - **Document Root**: `/var/www/html/ginywow-production/dist/public`
   - **Port**: 80, 443
   - **Proxy to**: `http://localhost:5000`

### Step 6: Domain Setup
1. Point your domain's **A Record** to your VPS IP address
2. In Hostinger DNS settings:
   - **Type**: A
   - **Name**: @ (or subdomain)
   - **Content**: your-vps-ip-address
   - **TTL**: 3600

### Step 7: SSL Certificate
1. In OpenLiteSpeed Admin:
2. Go to **SSL** → **SSL Certificates**
3. Add **Let's Encrypt** certificate for your domain
4. Enable **Force HTTPS**

### Step 8: Environment Setup
Create `.env` file in your app directory:
```bash
nano /var/www/html/ginywow-production/.env
```
Add these variables:
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=your-database-connection-string
SESSION_SECRET=your-long-random-secret-key
OPENAI_API_KEY=your-openai-api-key-if-needed
```

### Step 9: Test Your Website
1. Visit `http://your-domain.com`
2. Test URL generation functionality
3. Check all pages load correctly

---

## 🌐 Option 2: Static Frontend Only (Shared Hosting)

**⚠️ Warning: This removes all backend functionality (no URL generation)**

### Step 1: Get Shared Hosting
1. Choose any **Hostinger Shared Hosting** plan
2. Complete purchase and setup

### Step 2: Prepare Static Files
From the zip file, you only need:
- `dist/public/index.html`
- `dist/public/assets/` folder (CSS, JS, images)

### Step 3: Upload to Shared Hosting
1. Login to **Hostinger Control Panel**
2. Go to **File Manager**
3. Navigate to `public_html` folder
4. Upload **contents** of `dist/public/` folder directly into `public_html/`
   - `index.html` should be at `public_html/index.html`
   - Assets folder at `public_html/assets/`

### Step 4: Configure React Routing
Create `.htaccess` file in `public_html/`:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d  
RewriteRule . /index.html [L]
```

### Step 5: Test Your Website
Visit your domain - the frontend will work but no URL generation features.

---

## 🔍 Troubleshooting

### VPS Issues
- **App not starting**: Check `pm2 logs ginywow`
- **Domain not working**: Verify DNS propagation (24-48 hours)
- **Port issues**: Ensure port 5000 is not blocked by firewall
- **SSL problems**: Wait for domain propagation before adding SSL

### Shared Hosting Issues  
- **Pages not loading**: Check `.htaccess` file exists
- **Assets not loading**: Verify file paths in `public_html/`
- **Blank page**: Check browser console for JavaScript errors

---

## 📞 Need Help?
1. Check **Hostinger Knowledge Base**
2. Contact **Hostinger Support** (24/7 chat)
3. Review server logs: `pm2 logs` (VPS only)

## 🎉 Success!
Your GinyWow website should now be live and fully functional on Hostinger!

**VPS Result**: Full website with URL generation at `http://your-domain.com`
**Shared Result**: Frontend-only at `http://your-domain.com` (no backend features)