# Kheder App – Deployment Guide

## 1. Before Uploading To GitHub

- Keep the repository private.
- Do not upload:
  - `kheder_app.db`
  - `backups/`
  - `.env`
- Confirm `.gitignore` includes those paths.

## 2. Create Git Repository Locally

```bash
cd "/Users/familjenkheder/Desktop/Min App/Mobile/Kheder App"
git init
git add .
git commit -m "Initial Kheder App release"
```

## 3. Create A Private GitHub Repository

- Create a new private repository on GitHub.
- Copy the repository URL.

## 4. Connect Local Repository To GitHub

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

## 5. Prepare Ubuntu Server

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-venv python3-pip nginx git ufw
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 6. Create Application User

```bash
sudo adduser kheder
sudo usermod -aG sudo kheder
su - kheder
```

## 7. Clone Project On Server

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git app
cd app
python3 -m venv .venv
source .venv/bin/activate
```

## 8. Test Server Startup

```bash
python3 -m py_compile server.py
python3 server.py
```

- Stop with `Ctrl + C` after confirming it starts.

## 9. Run As A Service

Create:

`/etc/systemd/system/kheder-app.service`

```ini
[Unit]
Description=Kheder App
After=network.target

[Service]
User=kheder
WorkingDirectory=/home/kheder/app
ExecStart=/home/kheder/app/.venv/bin/python3 /home/kheder/app/server.py
Restart=always
RestartSec=3
Environment=PYTHONUNBUFFERED=1
Environment=PORT=8000

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable kheder-app
sudo systemctl start kheder-app
sudo systemctl status kheder-app
```

## 10. Configure Nginx

Create:

`/etc/nginx/sites-available/kheder-app`

```nginx
server {
    listen 80;
    server_name app.example.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then:

```bash
sudo ln -s /etc/nginx/sites-available/kheder-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 11. Add HTTPS

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d app.example.com
```

## 12. First Admin Tasks

- Log in as Admin.
- Create driver accounts.
- Fill in all required driver document details.
- Create a first backup from Admin tools.

## 13. Backup Routine

- Create a backup before every major update.
- Keep external copies of the `backups/` folder.
- Test restore regularly.

## 14. Update Procedure

```bash
cd /home/kheder/app
git pull origin main
sudo systemctl restart kheder-app
sudo systemctl status kheder-app
```

## 15. Verification Checklist

- Admin login works
- Driver login works
- Arbete starts and switches correctly
- Förarstatus updates correctly
- Körning saves and edits correctly
- Ersättning opens for selected driver
- Backup / restore tools open
- Hjälp page is visible
