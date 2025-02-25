# Production Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Frontend Deployment](#frontend-deployment)
4. [Backend Deployment](#backend-deployment)
5. [Database Setup](#database-setup)
6. [Security Considerations](#security-considerations)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- SSL certificate for your domain
- Azure AD account for SSO
- SMTP server access with OAuth 2.0 credentials

## Environment Setup

### Frontend Environment Variables
```env
VITE_APP_API_URL=https://api.yourdomain.com
VITE_APP_AZURE_CLIENT_ID=your_azure_client_id
VITE_APP_AZURE_TENANT_ID=your_azure_tenant_id
```

### Backend Environment Variables
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/ticketing
AZURE_CLIENT_ID=your_azure_client_id
AZURE_CLIENT_SECRET=your_azure_client_secret
AZURE_TENANT_ID=your_azure_tenant_id
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your_email@domain.com
SMTP_CLIENT_ID=your_smtp_client_id
SMTP_CLIENT_SECRET=your_smtp_client_secret
JWT_SECRET=your_secure_jwt_secret
CORS_ORIGIN=https://yourdomain.com
```

## Frontend Deployment

1. Build the frontend:
```bash
cd client
npm run build
```

2. The build output will be in the `dist` directory. Deploy these static files to your web server or CDN.

3. Configure your web server (e.g., Nginx) to serve the static files and handle client-side routing:
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Backend Deployment

1. Build the backend:
```bash
cd server
npm run build
```

2. Set up a process manager (PM2):
```bash
npm install -g pm2
pm2 start src/index.js --name "ticketing-api"
```

3. Configure reverse proxy (Nginx):
```nginx
server {
    listen 443 ssl;
    server_name api.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Database Setup

1. Create a production database:
```sql
CREATE DATABASE ticketing;
```

2. Set up database user with limited permissions:
```sql
CREATE USER ticketing_user WITH PASSWORD 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ticketing_user;
```

3. Configure regular backups:
```bash
# Add to crontab
0 0 * * * pg_dump -U postgres ticketing > /backup/ticketing_$(date +%Y%m%d).sql
```

## Security Considerations

1. Enable rate limiting:
```javascript
// Add to server/src/index.js
const rateLimit = require('express-rate-limit');
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));
```

2. Set security headers:
```javascript
const helmet = require('helmet');
app.use(helmet());
```

3. Enable CORS with specific origin:
```javascript
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
```

## Monitoring and Maintenance

1. Set up application monitoring:
```bash
npm install -g pm2
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

2. Configure error tracking (e.g., Sentry):
```javascript
const Sentry = require('@sentry/node');
Sentry.init({
    dsn: 'your-sentry-dsn',
    environment: 'production'
});
```

3. Set up health checks:
```javascript
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});
```

4. Regular maintenance tasks:
- Monitor disk space and logs
- Review and rotate API keys periodically
- Keep dependencies updated
- Monitor database performance
- Review security alerts and patches

## SSL Certificate Setup

1. Install Certbot:
```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
```

2. Obtain SSL certificate:
```bash
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

3. Auto-renewal:
```bash
sudo systemctl status certbot.timer
```

Remember to replace placeholder values (yourdomain.com, passwords, API keys) with your actual production values. Keep all sensitive information secure and never commit them to version control.