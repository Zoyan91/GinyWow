# GinyWow Website - Hosting Server Deployment Guide

## आपके अपने Server पर GinyWow Website Deploy करने का Complete Guide

### 📋 Requirements

**Server Requirements:**
- Node.js 18+ installed
- npm या yarn package manager
- 2GB+ RAM recommended
- Domain name (optional)

**Supported Hosting Providers:**
- VPS (DigitalOcean, AWS EC2, Linode)
- Cloud hosting (Vercel, Netlify, Railway)
- Shared hosting with Node.js support

### 🚀 Step-by-Step Deployment Process

#### Step 1: Server Setup

**For VPS/Dedicated Server:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm nginx

# CentOS/RHEL
sudo yum install nodejs npm nginx
```

#### Step 2: Upload Website Files

1. **Upload tar.gz file** to your server
2. **Extract files:**
   ```bash
   tar -xzf ginywow-website-complete.tar.gz
   cd ginywow-website-complete
   ```

#### Step 3: Install Dependencies

```bash
# Install all dependencies
npm install

# Build production files
npm run build
```

#### Step 4: Environment Setup

1. **Create `.env` file:**
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=your_database_url_here
   ```

2. **Database Setup** (if using PostgreSQL):
   ```bash
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib
   
   # Create database and user
   sudo -u postgres createdb ginywow_production
   sudo -u postgres createuser ginywow_user
   ```

#### Step 5: Start Application

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
# Start with PM2 (recommended)
npm install -g pm2
pm2 start dist/index.js --name "ginywow"
pm2 startup
pm2 save

# Or start directly
node dist/index.js
```

#### Step 6: Setup Reverse Proxy (Nginx)

**Create Nginx config:**
```bash
sudo nano /etc/nginx/sites-available/ginywow
```

**Add this configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/ginywow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Step 7: SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 🌐 Cloud Platform Deployment

#### **Vercel (Recommended for Frontend)**
1. Upload your project to GitHub
2. Connect Vercel to your GitHub repo
3. Deploy automatically

#### **Railway**
1. Connect GitHub repo to Railway
2. Set environment variables
3. Deploy with one click

#### **Netlify**
1. Drag & drop the `dist/public` folder
2. Configure redirects for SPA routing

### 📁 Important Files Structure

```
ginywow-website/
├── dist/                  # Built files (production ready)
│   ├── public/           # Frontend static files
│   └── index.js          # Server file
├── client/               # Frontend source code
├── server/               # Backend source code
├── shared/               # Shared types and schemas
├── package.json          # Dependencies
├── .env.example          # Environment variables template
└── DEPLOYMENT_GUIDE.md   # This guide
```

### 🔧 Troubleshooting

**Port Already in Use:**
```bash
sudo lsof -i :3000
sudo kill -9 PID_NUMBER
```

**Permission Issues:**
```bash
sudo chown -R $USER:$USER /path/to/ginywow-website
chmod -R 755 /path/to/ginywow-website
```

**Database Connection Issues:**
- Check DATABASE_URL in .env file
- Ensure PostgreSQL is running
- Verify database credentials

### 📞 Support

अगर कोई problem आए तो:
1. Check logs: `pm2 logs ginywow`
2. Server status: `pm2 status`
3. Nginx errors: `sudo tail -f /var/log/nginx/error.log`

### 🎯 Quick Deploy Commands Summary

```bash
# Complete deployment in one go
tar -xzf ginywow-website-complete.tar.gz
cd ginywow-website-complete
npm install
npm run build
npm install -g pm2
pm2 start dist/index.js --name "ginywow"
pm2 startup
pm2 save
```

**Your GinyWow website is now live! 🎉**

Visit: `http://your-server-ip:3000` or `https://yourdomain.com`

### 🔄 Updates

Future updates के लिए:
```bash
# Stop application
pm2 stop ginywow

# Update files
# Replace files with new version

# Restart
npm install
npm run build
pm2 restart ginywow
```

---

**Made with ❤️ for GinyWow - Convert Social Media Visitors into Subscribers**