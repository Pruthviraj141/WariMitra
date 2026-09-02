# 🚀 Visava Deployment Masterclass (Zero to Production)

> [!IMPORTANT]
> **READ THIS BEFORE TOUCHING THE SERVERS.** 
> This document is the ultimate, end-to-end guide to the Visava deployment infrastructure. It explains exactly how we transformed a local development environment into a production-grade, highly scalable cloud architecture on AWS using Docker and GitHub Actions. Do not waste time watching tutorials—everything a DevOps engineer needs to know is documented right here.

---

## 1. Preparing for Production (The "Env" Trick)

To make an application deployable anywhere without changing the code, it must follow the **12-Factor App methodology**. This means **zero hardcoded URLs**.

### The Development vs. Deployment Problem
Locally, your backend runs on `http://localhost:3000`. In production, it runs on `http://65.2.142.103:3000`. If you hardcode `localhost` in your React components, the production build will break because users' browsers will try to search their *own* computers for the backend!

### The Solution: Environment Variables & Docker Build Args
We solved this by dynamically pulling URLs at runtime and build time:
1. **React Code**: Replaced hardcoded strings with `import.meta.env.VITE_API_URL`.
2. **Dockerfile (`frontend/Dockerfile`)**: Added `ARG VITE_API_URL` and `ENV VITE_API_URL=$VITE_API_URL` before the `npm run build` step. This allows Docker to "bake" the production URL into the final HTML/JS files.
3. **Docker Compose (`docker-compose.yml`)**: Used the `args:` key under the frontend build section to pass the variables into the Dockerfile.

> [!TIP]
> **The Docker Compose Secret**: Docker Compose looks for variables in a `.env` file located in the **ROOT** directory when running `docker compose build`. We use this behavior in our CI/CD pipeline to seamlessly inject production keys into the frontend build process without touching the code.

---

## 2. Infrastructure Setup (AWS EC2)

When you boot up a fresh Ubuntu server on AWS EC2, it is completely empty. 

> [!WARNING]
> **The "Command Not Found" Error**
> If you try to run GitHub Actions immediately, you will get the error: `sudo: 'docker': command not found`. This happens because raw EC2 instances do not come with Docker pre-installed.

### Step-by-Step EC2 Initialization

SSH into your raw EC2 server using your `.pem` key:
```bash
chmod 400 WariEC2.pem
ssh -i "WariEC2.pem" ubuntu@<YOUR_EC2_IP>
```

Run these exact commands to install Docker, Docker Compose, and configure the user permissions:
```bash
# 1. Update the system and install prerequisites
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# 2. Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 3. Set up the Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. Install Docker Engine and Docker Compose
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 5. Start Docker and grant the 'ubuntu' user permissions
sudo systemctl enable --now docker
sudo usermod -aG docker ubuntu
```

Finally, perform the one-time clone of the repository so the folder structure exists for the CI/CD pipeline:
```bash
git clone https://github.com/Pruthviraj141/WariMitra.git Visava
```

---

## 3. Continuous Integration & Deployment (GitHub Actions)

Our CI/CD pipeline (`.github/workflows/deploy.yml`) is the heart of the deployment. It entirely eliminates manual server maintenance.

### How the Pipeline Works:
1. **Trigger**: Activates automatically whenever code is pushed to the `main` branch.
2. **Connect**: Uses `appleboy/ssh-action` to securely log into the EC2 instance using the `EC2_SSH_KEY` GitHub Secret.
3. **Pull**: Runs `git pull origin main` to download the fresh code.
4. **Inject (The Magic Step)**: The script dynamically runs `echo "KEY=VALUE" >> .env` commands. It pulls passwords and API keys from GitHub Secrets and writes them directly into the EC2 server's `.env` files. **This means `.env` files are never tracked in Git, keeping the repo 100% secure.**
5. **Deploy**: Runs `sudo docker compose up -d --build`. Docker safely tears down the old containers, builds the new ones with the freshly injected `.env` files, and spins them up with zero downtime.

### The 17 Required GitHub Secrets
To make the pipeline function, these exact keys must be added to **Settings -> Secrets and variables -> Actions**:

| Secret Name | Description / Example |
|-------------|-----------------------|
| `EC2_HOST` | `65.2.142.103` (Server Public IP) |
| `EC2_USERNAME` | `ubuntu` |
| `EC2_SSH_KEY` | Raw text of `WariEC2.pem` |
| `PROD_PUBLIC_URL` | `http://65.2.142.103` |
| `PROD_VITE_API_URL` | `http://65.2.142.103:3000/api/v1` |
| `PROD_CORS_ORIGINS` | `http://65.2.142.103,http://localhost:5173` |
| `PROD_MONGODB_URI` | MongoDB Atlas Connection String |
| `PROD_JWT_SECRET` | Secure random string |
| `PROD_INTERNAL_API_KEY` | Secure token shared between microservices |
| `PROD_VAPI_PUBLIC_KEY` | Vapi Dashboard Public Key |
| `PROD_VAPI_PRIVATE_KEY` | Vapi Dashboard Private Key |
| `PROD_CLOUDINARY_CLOUD_NAME`| Cloudinary Cloud Name |
| `PROD_CLOUDINARY_API_KEY` | Cloudinary API Key |
| `PROD_CLOUDINARY_API_SECRET`| Cloudinary API Secret |
| `PROD_GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `PROD_GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `PROD_CARTO_API_TOKEN` | Carto Maps API Token |

---

## 4. Key DevOps Insights & Golden Rules

> [!CAUTION]
> **1. NEVER Commit `.env` files to Git.** 
> If you commit an `.env` file containing AWS or database credentials, bots will scrape them in seconds. Rely completely on `.env.example` for documentation, and GitHub Secrets for deployment.

> [!TIP]
> **2. Root `.env` vs Subfolder `.env`**
> Notice how the deployment script writes backend secrets to `core-api/.env` but writes frontend build arguments to the root `.env`. Docker Compose expects build arguments (like `VITE_API_URL`) to exist in the same directory where `docker-compose.yml` is run.

> [!NOTE]
> **3. Nginx Reverse Proxying**
> The `frontend` container is actually an Nginx web server. It serves the React static files, but it also listens for `/api` requests and silently proxies them internally to the `core-api` container on port 3000. This prevents CORS issues and keeps the architecture clean!

> [!TIP]
> **4. Disk Space Management**
> Over time, Docker builds accumulate dangling images. Our CI/CD pipeline automatically runs `sudo docker image prune -f` at the end of every deployment to keep the EC2 hard drive from filling up.
