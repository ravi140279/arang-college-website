Step 1: Push Code to Git (GitHub / GitLab)
Ensure your code (including Dockerfile, .dockerignore, app/, lib/, data/, etc.) is pushed to a Git repository (e.g., GitHub or GitLab).

bash
git add .
git commit -m "Prepare project for Dokploy deployment"
git push origin main
Step 2: Create Application in Dokploy
Open your Dokploy Dashboard in your browser.
Select your Project (or create a new one).
Click Create Application.
Choose Git as the source and select your repository & branch (main).
Step 3: Configure Build Settings
In your Dokploy Application settings under General / Build:

Build Type: Dockerfile
Dockerfile Path: ./Dockerfile (default)
Container Port: 3000
Step 4: Add Environment Variables
Go to the Environment tab in Dokploy and paste your environment variables:

env
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2b$10$lcfJRuo6aTSVdGjyg4u8KuT4bGqYj74jHm4hoUrWmyMwysnWDCXyu
JWT_SECRET=your-random-production-secret-key-change-this
NEXT_PUBLIC_BASE_URL=https://your-domain.com
PAYTM_MID=YOUR_LIVE_OR_STAGING_MID
PAYTM_MERCHANT_KEY=YOUR_LIVE_OR_STAGING_KEY
PAYTM_WEBSITE=DEFAULT
PAYTM_CHANNEL_ID=WEB
PAYTM_ENV=production
COLLEGE_NAME="Badri Prasad Lodhi PG Govt. College, Arang"
COLLEGE_ACCOUNT_LABEL="State Bank of India Current Account"
CURRENCY=INR
TIP

Make sure NEXT_PUBLIC_BASE_URL matches your actual domain (https://...) so Paytm callbacks work correctly.

Step 5: Mount Persistent Volume for Data (Crucial)
Because fee payment records (fee_payments.db) and CMS JSON files live in /app/data, you must mount a volume so data persists across app rebuilds:

In Dokploy, go to the Volumes tab.
Click Add Volume.
Volume Type: Persistent Volume
Mount Path / Destination: /app/data
Save changes.
Step 6: Configure Domain & SSL
In Dokploy, go to the Domains tab.
Add your domain name (e.g., arangcollege.ac.in or college.yourdomain.com).
Set Container Port: 3000.
Enable HTTPS / SSL (Let's Encrypt).
In your DNS provider (Cloudflare, GoDaddy, Namecheap, etc.), point an A Record for your domain to your Ubuntu VPS IP Address.
Step 7: Click Deploy!
Click Deploy in Dokploy. Dokploy will pull your Git repository, build the Docker container using your multi-stage Dockerfile, attach the persistent /app/data volume, configure Traefik reverse proxy with SSL, and launch the site.











How Dokploy Routing Works with Port 8080
Host Port 3000: Used exclusively by your Dokploy Admin Dashboard.
Container Port 8080: The Next.js app in the Docker container will now listen on internal port 8080.
Traefik Reverse Proxy: When a visitor accesses your domain (e.g. https://college.yourdomain.com), Dokploy’s built-in Traefik proxy receives port 80/443 traffic and routes it directly into your container's port 8080.
Updated Settings in Dokploy
When setting up your Application in Dokploy:

General / Build Tab:
Build Type: Dockerfile
Container Port: 8080
Environment Tab:
Add PORT=8080 (along with ADMIN_USERNAME, ADMIN_PASSWORD_HASH, JWT_SECRET, NEXT_PUBLIC_BASE_URL, PAYTM_*, etc.)
Domains Tab:
Add your domain and set the target Container Port to 8080 with HTTPS enabled.
Volumes Tab:
Mount Container Path: /app/data for SQLite persistent storage.