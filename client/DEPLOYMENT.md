# Deployment Guide

This guide covers deploying FoundersNet to various hosting platforms. The application is a static site that can be deployed to any static hosting service.

## Prerequisites

Before deploying, ensure you have:
- Node.js 20+ installed
- Git repository initialized
- Environment variables configured
- Successful local build

## Build Process

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Configure Environment
Create `.env.production` file:
```env
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
VITE_PROGRAM_ID=AkWgeWixTroxjHczNkhRbLmNBFpoP45rP3Zarg25zjg3
VITE_ADMIN_WALLET=78BDAjB4oTdjS4S734Ge2sRWWnHGDDJmPigbp27bSQ7g
```

### 3. Build for Production
```bash
npm run build
```

The build output will be in the `dist/` directory.

### 4. Test Production Build Locally
```bash
npm run preview
```

## Vercel Deployment

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy to Production**
   ```bash
   cd client
   vercel --prod
   ```

4. **Configure Environment Variables**
   - Go to Vercel dashboard → your project → Settings → Environment Variables
   - Add the following:
     ```
     VITE_SOLANA_NETWORK=devnet
     VITE_SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
     VITE_PROGRAM_ID=AkWgeWixTroxjHczNkhRbLmNBFpoP45rP3Zarg25zjg3
     VITE_ADMIN_WALLET=78BDAjB4oTdjS4S734Ge2sRWWnHGDDJmPigbp27bSQ7g
     ```

### Method 2: Vercel Dashboard

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Connect your Git repository
   - Select the `client` directory as root

2. **Configure Build Settings**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Set Environment Variables**
   - In project settings, add all required environment variables
   - Ensure they're marked as available for Production

4. **Deploy**
   - Vercel will automatically deploy on push to main branch
   - Manual deployments available via dashboard

### Vercel Configuration (Optional)

Create `vercel.json` in client directory:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "env": {
    "VITE_SOLANA_NETWORK": "devnet",
    "VITE_SOLANA_RPC_ENDPOINT": "https://api.devnet.solana.com"
  }
}
```

## Netlify Deployment

### Method 1: Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy to Production**
   ```bash
   cd client
   npm run build
   netlify deploy --prod --dir=dist
   ```

### Method 2: Netlify Dashboard

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   Functions directory: (leave empty)
   ```

3. **Set Environment Variables**
   - Go to Site settings → Build & deploy → Environment
   - Add all required environment variables

### Netlify Configuration (Optional)

Create `netlify.toml` in client directory:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  VITE_SOLANA_NETWORK = "devnet"
  VITE_SOLANA_RPC_ENDPOINT = "https://api.devnet.solana.com"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Cloudflare Pages Deployment

### Method 1: Wrangler CLI

1. **Install Wrangler**
   ```bash
   npm i -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Deploy**
   ```bash
   cd client
   npm run build
   wrangler pages publish dist --project-name=foundersnet
   ```

### Method 2: Cloudflare Dashboard

1. **Connect Repository**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Go to Pages → Create a project → Connect to Git
   - Select your repository

2. **Configure Build Settings**
   ```
   Framework preset: Vite
   Build command: npm run build
   Build output directory: dist
   ```

3. **Set Environment Variables**
   - In project settings → Environment variables
   - Add all required environment variables

### Cloudflare Configuration (Optional)

Create `wrangler.toml` in client directory:
```toml
name = "foundersnet"
compatibility_date = "2024-01-01"

[env.production]
vars = { VITE_SOLANA_NETWORK = "devnet", VITE_SOLANA_RPC_ENDPOINT = "https://api.devnet.solana.com" }
```

## GitHub Pages Deployment

### Method 1: GitHub Actions

1. **Create Workflow File**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4
           
         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '20'
             
         - name: Setup Pages
           uses: actions/configure-pages@v4
           
         - name: Install dependencies
           run: cd client && npm ci
           
         - name: Build
           run: cd client && npm run build
           
         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: client/dist

     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       needs: build
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

2. **Configure Repository**
   - Go to repository Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `gh-pages` and `/ (root)`

3. **Set Environment Variables**
   - In repository Settings → Secrets and variables → Actions
   - Add all required environment variables

### Method 2: Manual Deployment

1. **Build and Deploy**
   ```bash
   cd client
   npm run build
   
   # Clone to gh-pages branch
   git checkout gh-pages
   git pull origin gh-pages
   
   # Copy build files
   rm -rf *
   cp -r dist/* .
   
   # Commit and push
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

## AWS S3 Deployment

### Using AWS CLI

1. **Build Application**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to S3**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront** (Optional)
   - Create CloudFront distribution
   - Set origin to S3 bucket
   - Configure error pages for SPA routing

### Using Amplify

1. **Connect Repository**
   - Go to [console.aws.amazon.com/amplify](https://console.aws.amazon.com/amplify)
   - Click "New app" → "Host web app"
   - Connect your Git repository

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Build output directory: dist
   ```

3. **Set Environment Variables**
   - In app settings → Environment variables
   - Add all required environment variables

## Firebase Hosting Deployment

### Using Firebase CLI

1. **Install Firebase CLI**
   ```bash
   npm i -g firebase-tools
   ```

2. **Initialize Firebase**
   ```bash
   firebase init hosting
   # Select: Use an existing project
   # Set public directory: dist
   # Configure as single-page app: Yes
   # Do not overwrite index.html: No
   ```

3. **Deploy**
   ```bash
   cd client
   npm run build
   firebase deploy --only hosting
   ```

### Firebase Configuration

Create `firebase.json`:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## Environment Variables

All deployment platforms require the same environment variables:

### Required Variables
```env
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
VITE_PROGRAM_ID=AkWgeWixTroxjHczNkhRbLmNBFpoP45rP3Zarg25zjg3
VITE_ADMIN_WALLET=78BDAjB4oTdjS4S734Ge2sRWWnHGDDJmPigbp27bSQ7g
```

### Optional Variables
```env
VITE_APP_NAME=FoundersNet
VITE_APP_DESCRIPTION=Decentralized prediction market platform
VITE_APP_URL=https://your-domain.com
```

## Custom Domain Setup

### Vercel
1. Go to project settings → Domains
2. Add custom domain
3. Configure DNS records as instructed
4. Enable automatic HTTPS

### Netlify
1. Go to site settings → Domain management
2. Add custom domain
3. Configure DNS records
4. Enable HTTPS (automatic)

### Cloudflare Pages
1. Go to project → Custom domains
2. Add custom domain
3. Configure DNS records
4. SSL is automatic with Cloudflare

## Performance Optimization

### Build Optimization
The production build includes:
- **Minification**: JavaScript and CSS minified
- **Tree Shaking**: Unused code eliminated
- **Asset Optimization**: Images and fonts optimized
- **Bundle Splitting**: Code split by routes

### CDN Configuration
- Enable Gzip/Brotli compression
- Set appropriate cache headers
- Configure edge caching
- Enable HTTP/2 or HTTP/3

### Monitoring
- Set up uptime monitoring
- Configure error tracking
- Monitor Core Web Vitals
- Set up analytics

## Security Considerations

### HTTPS
- All platforms provide automatic HTTPS
- Redirect HTTP to HTTPS
- Use HSTS headers where possible

### Environment Security
- Never commit `.env` files
- Use platform-specific secret management
- Rotate secrets regularly
- Limit access to production secrets

### Content Security Policy
Consider adding CSP headers:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.devnet.solana.com;">
```

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules dist package-lock.json
npm install
npm run build
```

#### Routing Issues
Ensure SPA routing is configured:
- Vercel: Automatic
- Netlify: Add `_redirects` file
- Cloudflare: Add `_routes.json`
- S3: Configure CloudFront error pages

#### Environment Variables
- Verify variable names (VITE_ prefix required)
- Check for typos in wallet addresses
- Ensure program ID is correct
- Test with different RPC endpoints

#### Wallet Connection Issues
- Ensure wallet extensions are installed
- Check that site is HTTPS (required for wallets)
- Verify wallet is set to Devnet
- Try different wallets

### Debug Mode

Add debug environment variable:
```env
VITE_DEBUG=true
```

This enables additional logging and error details.

## Post-Deployment Checklist

- [ ] Application loads correctly
- [ ] Wallet connection works
- [ ] Environment variables are set
- [ ] All pages load without errors
- [ ] Mobile responsive design works
- [ ] Dark mode functions
- [ ] Real-time updates work
- [ ] Admin features work with admin wallet
- [ ] Error handling works gracefully
- [ ] Performance is acceptable
- [ ] SEO meta tags are correct
- [ ] Analytics are tracking
- [ ] Custom domain works (if configured)

## Support

For deployment issues:
1. Check platform-specific documentation
2. Review build logs for errors
3. Verify environment variables
4. Test with different browsers
5. Check network connectivity
6. Review this troubleshooting section

Remember: FoundersNet is a static application - most issues are related to configuration, not code bugs.