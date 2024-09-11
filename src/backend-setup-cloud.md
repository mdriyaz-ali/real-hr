# Deployment of RealHRsoft Backend 
Deployment of RealHRsoft Backend is done using Dpahne,Cirus and Gunicorn,Uvicorn method.
  - Circus,Daphne method.( Currently using for on-premises clients )
    - Here circus is used for process manager.
    - Daphne is used for running python backend.
  - Gunicorn and Uvicorn method. ( Currently using for cloud based clients )
    - Unit service file is used for process manager.
    - Gunicorn and Uvicorn is used running python backend.


## Cloud Based Deployment of RealHRsoft Backend
### Prerequisites
- Linux based server with 22.04 LTS or Later version.
- Minimum 2 GB RAM with 2 core processors with 4GB Swap on.
- python3.8.10 or later version.
- postgresql.
- pip.
- python3.8-virtualenv.
- nginx.
- Let's Encrypt (certbot).

## Swap file creation.

```
sudo fallocate -l 4G /swapfile #edit swap size accordingly
ls -lh /swapfile
sudo chmod 600 /swapfile
ls -lh /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
sudo swapon --show
#make permanent swap 
sudo cp /etc/fstab /etc/fstab.bak
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
cat /proc/sys/vm/swappiness
sudo nano /etc/sysctl.conf
vm.swappiness=10
vm.vfs_cache_pressure = 50
sudo sysctl vm.vfs_cache_pressure=50
```
## Procedure

- **Installing system dependencies**
  
  Nginx,Postgresql,Redis,libjpeg-dev,zlib1g-dev,p7zip-full,build-essential,libssl-dev,libffi-dev,libxml2-dev,libxslt1-dev, python3.8-venv, chaussette
```
sudo apt install nginx postgresql postgresql-contrib redis-server libjpeg-dev zlib1g-dev p7zip-full build-essential libssl-dev libffi-dev libxml2-dev libxslt1-dev python3-pip chausette -y
```
- **Installing python3.8 version**
```
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt install python3.8 -y
sudo apt-get install build-essential libssl-dev libffi-dev python3.8-dev -y
python3.8 —version
```
- **Creating python3.8 virtual environment**
```
python3.8 -m venv realhrsoft-backend
```
- **Clonning irealhrsoft-backend**
```
cd /etc/opt/realhrsoft-backend/
git clone https://github.com/aayulogic/irealhrsoft-backend.git
```
- **Installing requirements**
clone irealhrsoft-backend repo at /etc/opt/realhrsoft-backend

```
source /etc/opt/realhrsoft-backend/bin/activate
pip install -r /etc/opt/realhrsoft-backend/irealhrsoft-backend/requirements/production.txt
```
- **Create Essential directories**
```
mkdir -p /etc/opt/realhrsoft-backend/media
mkdir -p /etc/opt/realhrsoft-backend/logs
mkdir -p /etc/opt/realhrsoft-backend/backups
```
- **Configuring System Service.**

system service are created at ***/etc/systemd/system/*** location
  - Gunicorn system service for backend.service
  

>[!IMPORTANT] 
>Edit worker number accordingly
```
[Unit]
Description=Realhrsoft  Backend
After=network.target
[Service]
User=root
Group=root
WorkingDirectory=/etc/opt/realhrsoft-backend/irealhrsoft-backend
ExecStart=/etc/opt/realhrsoft-backend/bin/gunicorn \
          --access-logfile - \
          -k uvicorn.workers.UvicornWorker \
          --workers 2 \                           #edit worker accordingly
          --bind unix:/etc/opt/realhrsoft-backend/realhrsoft-backend.sock \
          config.asgi:application
StandardOutput=/etc/opt/realhrsoft-backend/irealhrsoft-backend/logs/gunicorn_output.log
StandardError=/etc/opt/realhrsoft-backend/irealhrsoft-backend/logs/gunicorn_error.log
[Install]
WantedBy=multi-user.target
```
- **System service for qcluster.**
```
[Unit]
Description=Realhrsoft Demo Backend Qcluster
After=network.target
[Service]
User=root
Group=root
WorkingDirectory=/etc/opt/realhrsoft-backend/irealhrsoft-backend
ExecStart=/etc/opt/realhrsoft-backend/bin/python manage.py qcluster
StandardOutput=/etc/opt/realhrsoft-backend/irealhrsoft-backend/logs/qcluster_output.log
StandardError=/etc/opt/realhrsoft-backend/irealhrsoft-backend/logs/qcluster_error.log
[Install]
WantedBy=multi-user.target
```
- **Start, Enable and Reload Service**
```
sudo systemctl daemon-reload
sudo systemctl  start realhrsoft-backend.service
sudo systemctl enable realhrsoft-backend.service
sudo systemctl  start realhrsoft-qcluster.service
sudo systemctl enable realhrsoft-qcluster.service
```
- **Configure Nginx service file.**

Nginx configuration is configured at ***/etc/nginx/sites-available*** and linked to ***/etc/nginx/sites-enabled***.

>[!IMPORTANT] 
> - Edit server_name accordingly, replace with your domain name or ip address.
> - Edit  Frontend folder accordingly, replace with dist or  frontend.
> - Edit user name www-data to  ubuntu at /etc/nginx/nginx.conf 

Edit realhrsoft.conf file
```
cd /etc/nginx/sites-available
vi realhrsoft
```
Copy and paste this

```
server {
    server_name domain.name; 
    charset     utf-8;
    # max upload size
    client_max_body_size 75M;   # adjust to taste
    root /etc/opt/realhrsoft-frontend;
    index index.html index.htm;
    access_log /etc/opt/realhrsoft-backend/logs/nginx_access.log;
    error_log /etc/opt/realhrsoft-backend/logs/nginx_error.log;
    # Django media
    location /media  {
        alias /etc/opt/realhrsoft-backend/media;     }
    location /static {
        alias /etc/opt/realhrsoft-backend/static;     }
location       ~^/((api/v1)|(o[^ffer\-letter]+)|(api/root)|global|permission|api-auth|dj-admin|(a/portal)) {
        # add_header 'Access-Control-Allow-Origin' '*';
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-NginX-Proxy true;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_redirect off;
Proxy_pass http://unix:/etc/opt/realhrsoft-backend/realhrsoft-backend.sock;
    }
    error_page 404 /error/404/index.html;
    error_page 500 /error/500/index.html;
    location / {
        try_files $uri $uri/ /index.html ;
    }
  }
```
- **Enable Nginx Configuration**
```
cd /etc/nginx/sites-enabled
ln -s ../sites-available realhrsoft-backend
```
```
sudo nginx -t
sudo systemctl restart nginx
```
- **Generating SSL using Let's Encrypt**
>[!IMPORTANT]
>Adjust domain_name accordingly
```
sudo apt install certbot python3-certbot-nginx
sudo cerbot –nginx -d domain_name
```
- **Database Configuration**

Relational Database Postgresql is used for realhrsoft system.
>[IMPORTANT]
>Adjust db_name,db_user and db_password accordingly.
```
sudo su postgres
psql
createuser db_user with password ‘user_password’;
create database db_name; 
alter database db_name owner to db_user;
GRANT ALL PRIVILEGES ON DATABASE "db" TO db_user;
Alter role db_user login;
```
>[!NOTICE]
> This task is done if client is existing client and migrating from one server to another.
- **Restoring Database**
```
Copy database at /tmp/file 
psql -U db_user -d db_name -f /tmp/backup_db.psql
OR
sudo su postgres
psql -d db_name < /tmp/backup_db.psql 
```
- **Edit .env file**

Edit .env.sample file as .env and adjust setting accordingly.
**Adjustments:**

- Place the .env file at irealhrsoft-backend of /etc/opt/realhrsoft-backend/irealhrsoft-backend. 
- ***Edit Database name, user and password accordingly.***
- Edit frontend and backend url accordingly, replace with your domain name or ip address.
- Edit Allowed host accordingly. Replace with your domain name or ip address.
> [!IMPORTANT]
> - For multiple clients in the same vm edit redis db as 0,1,2 4,5,6 ..since db on redis is represented in integer value.
> - If multiple app or clients are on the same vm then Change django secret key.


- **Make key-files**

```
cd /etc/opt/realhrsoft-backend/irealhrsoft-backend
mkdir key-files
```
- **Generate rsa keys**
```
python manage.py generate_rsa_keys --skip-checks
```
- **Collect static and Migrate**
```
python manage.py collectstatic
python manage.py migrate
```
- **Perform Initial Setup** 
```
python manage.py initial_setup
```







