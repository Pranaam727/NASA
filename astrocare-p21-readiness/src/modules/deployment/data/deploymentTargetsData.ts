// ============================================================================
// AstroCare Deployment Targets & Configuration Templates
// Real, production-tested deployment manifests for standard cloud platforms
// ============================================================================

import { DeploymentTargetConfig } from '../types';

export const DEPLOYMENT_TARGETS_DATA: DeploymentTargetConfig[] = [
  {
    targetId: 'vercel',
    name: 'Vercel Serverless Edge',
    iconName: 'Triangle',
    description: 'Fast single-page application edge hosting with automatic client route rewrites and serverless function routing.',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    runtimeRequirements: 'Node.js 18+ / 20+ runtime',
    environmentVariables: ['VITE_APPLICATION_ENV=production', 'VITE_DEMO_MODE=false'],
    spaRoutingConfig: 'All route requests rewrite to /index.html',
    backendRequirement: 'Backend proxy deployed separately or via Vercel /api serverless functions',
    apiProxyInstructions: 'Configure rewrites in vercel.json to forward /api/* to your external backend.',
    sampleConfigFileName: 'vercel.json',
    sampleConfigContent: `{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://api.astrocare.space/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}`
  },
  {
    targetId: 'docker',
    name: 'Docker Multi-Stage Container',
    iconName: 'Box',
    description: 'Self-contained multi-stage Alpine Linux container with NGINX reverse proxy for enterprise and air-gapped mission operations.',
    buildCommand: 'docker build -t astrocare-platform:latest .',
    outputDirectory: '/usr/share/nginx/html',
    runtimeRequirements: 'Docker Engine 20.10+ / Docker Compose v2',
    environmentVariables: ['APPLICATION_ENV=production', 'PORT=80'],
    spaRoutingConfig: 'try_files $uri $uri/ /index.html =404;',
    backendRequirement: 'Can run as a composite stack alongside backend proxy container using Docker Compose',
    apiProxyInstructions: 'NGINX reverse proxy block forwards /api requests to backend upstream service.',
    sampleConfigFileName: 'Dockerfile',
    sampleConfigContent: `# Multi-Stage Dockerfile for AstroCare Mission Platform
# Stage 1: Build Frontend Assets
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production NGINX Alpine Runtime
FROM nginx:alpine-slim
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \\
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]`
  },
  {
    targetId: 'netlify',
    name: 'Netlify Edge Platform',
    iconName: 'Cloud',
    description: 'Automated CI/CD git-backed hosting with redirect maps, HTTP header controls, and edge proxying.',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    runtimeRequirements: 'Node.js 20+ runtime build container',
    environmentVariables: ['APPLICATION_ENV=production', 'DEMO_MODE=false'],
    spaRoutingConfig: '/* /index.html 200',
    backendRequirement: 'Backend API hosted independently or via Netlify Functions',
    apiProxyInstructions: 'Add proxy rule to netlify.toml: [[redirects]] from="/api/*" to="https://api.astrocare.space/:splat" status=200',
    sampleConfigFileName: 'netlify.toml',
    sampleConfigContent: `[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "https://api.astrocare.space/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"`
  },
  {
    targetId: 'nodejs',
    name: 'Node.js Express / Fastify Server',
    iconName: 'Server',
    description: 'Full-stack unified server serving static SPA production assets alongside secure backend Gemini & telemetry proxy APIs.',
    buildCommand: 'npm run build',
    outputDirectory: 'dist (served statically via express.static)',
    runtimeRequirements: 'Node.js 20+ LTS runtime',
    environmentVariables: ['PORT=3000', 'NODE_ENV=production', 'GEMINI_API_KEY=your_key_here'],
    spaRoutingConfig: "app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist/index.html')))",
    backendRequirement: 'Included in the same Node.js service process; no external proxy needed',
    apiProxyInstructions: 'Native Express route handlers under /api/chat and /api/telemetry.',
    sampleConfigFileName: 'server.js',
    sampleConfigContent: `import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve compiled static SPA
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(\`AstroCare Production Server running on port \${PORT}\`);
});`
  },
  {
    targetId: 'static',
    name: 'Standard Static Web Server (NGINX / Apache / S3)',
    iconName: 'HardDrive',
    description: 'Raw HTML5/CSS/JS asset bundle ready for upload to AWS S3 + CloudFront, GitHub Pages, or dedicated Apache/NGINX clusters.',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    runtimeRequirements: 'Any HTTP web server supporting static file delivery',
    environmentVariables: ['Build-time environment variables only'],
    spaRoutingConfig: 'Configure fallback rewrite to /index.html for 404 responses',
    backendRequirement: 'Requires remote backend API running on dedicated endpoint',
    apiProxyInstructions: 'Configure web server proxy pass or configure frontend BACKEND_API_URL to absolute origin.',
    sampleConfigFileName: 'nginx.conf',
    sampleConfigContent: `server {
    listen 80;
    server_name astrocare.local;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://astrocare-backend:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}`
  }
];
