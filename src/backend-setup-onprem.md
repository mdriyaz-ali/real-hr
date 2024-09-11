# Deployment of RealHRsoft Backend 
Deployment of RealHRsoft Backend is done using Dpahne,Cirus and Gunicorn,Uvicorn method.
  - Circus,Daphne method.( Currently using for on-premises clients )
    - Here circus is used for process manager.
    - Daphne is used for running python backend.
  - Gunicorn and Uvicorn method. ( Currently using for cloud based clients )
    - Unit service file is used for process manager.
    - Gunicorn and Uvicorn is used running python backend.

## App based Deployment of RealHRsoft Backend.
In App based deployment of clone the whole git hub repo into the server.
### Prerequisites
- Linux Ubuntu server with 22.04 LTS or Later version.
- python3.8.10 or later version.
- postgresql.
- pip.
- python3.8-virtualenv.
- nginx.
- Let's Encrypt (certbot).

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
python3.8 -m venv realhrsoft
```
- **Clonning irealhrsoft-backend**
```
git clone https://github.com/aayulogic/irealhrsoft-backend.git
#renaming into app
mv irealhrsoft-backend app
```
- **Installing requirements**
```
source ~/realhrsoft/bin/activate
pip install -r ~/app/requirements/production.txt
```
- **Create Essential directories**
At home directory
```
cd ~/
mkdir -p media
mkdir -p logs
mkdir -p backups
mkdir -p conf
```
- **Configuring Circus Process Manager**
>[!IMPORTANT]
> Make Changes at
> - Machine user name accordingly 
> - Edit virual environment path accordingly
> - Edit app path accordingly.
```
vim ~/conf/circus.ini

[watcher:webapp]
cmd = daphne --access-log $(circus.env.LOGS_DIR)/access.log  config.asgi:application --fd $(circus.sockets.webapp)
#Edit username accordingly 
uid=ubuntu  		  #Change this user name accordingly.	
endpoint_owner=rhs
numprocesses = 1  #change this number of processes accordingly.
#Adjust username of your machine and app accordingly
working_dir = /home/ubuntu/app/
use_sockets = True
copy_env = True
copy_path = True
virtualenv = /home/ubuntu/realhrsoft/
stdout_stream.class = FileStream
stdout_stream.filename = /home/ubuntu/logs/webapp.log
stderr_stream.class = FileStream
stderr_stream.filename = /home/ubuntulogs/webapp_err.log
#hooks.after_start = config.hooks.run_raven
# optionally rotate the log file when it reaches 1 gb
# and save 5 copied of rotated files
stdout_stream.max_bytes = 1073741824
stdout_stream.backup_count = 3
stderr_stream.max_bytes = 1073741824
stderr_stream.backup_count = 3
#This will allow to run python backend at localhost 8085 port.
[socket:webapp]
host = 127.0.0.1
port = 8085
[env:webapp]
LOGS_DIR = /home/ubuntu/logs
PYTHONPATH=/home/ubuntu/app/
#NEW_RELIC_CONFIG_FILE=newrelic.ini
#This run django q cluster
[watcher:webapp_q]
cmd = python manage.py qcluster
numprocesses = 1
working_dir = /home/ubuntu/app/
virtualenv = /home/ubuntu/realhrsoft/
copy_env = True
copy_path = True
stdout_stream.class = FileStream
stdout_stream.filename = /home/ubuntu/logs/webapp_q.log
stderr_stream.class = FileStream
stderr_stream.filename = /home/ubuntu/logs/webapp_q_err.log
[env:webapp_q]
PYTHONPATH=/home/ubuntu/app/
```
- **Demonize circus.ini file**
```
circusd --daemon ~/conf/circus.ini 
circusctl reloadconfig 
circusctl reload
```
- **Configuring Nginx**
>[!IMPORTANT]
> - Edit server_name accordingly, replace with your domain name or ip address.
> - Edit  Frontend folder accordingly, replace with dist or  frontend.
> - Edit user name www-data to  ubuntu at /etc/nginx/nginx.conf 

```
cd ~/conf
vim nginx.conf
```
Copy and paste this
```
upstream irhrs-backend {
    # Nodejs app upstream
    server localhost:8085;
    keepalive 100;
}
server {
    # Edit Domain Name
    server_name domain.com;
    charset     utf-8;
    # max upload size
    client_max_body_size 75M;   # adjust to taste
    root /home/ubuntu/dist/; 
    index index.html index.htm;
    #access_log /home/ubuntu/logs/nginx_access.log;
    #error_log /home/ubuntu/logs/nginx_error.log;
    # Django media
    location /media  {
        alias /home/ubuntu/media;  # your Django project's media files - amend as required
    }
    location /static {
        alias /home/ubuntu/static; # your Django project's static files - amend as required
    }
    location ~^/((api/v1)|(o[^ffer\-letter]+)|(api/root)|global|permission|api-auth|dj-admin|(a/portal)) {
        # add_header 'Access-Control-Allow-Origin' '*';
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-NginX-Proxy true;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_redirect off;
        proxy_pass http://irhrs-backend/;
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

- Place the .env file at ~/app/. 
- ***Edit Database name, user and password accordingly.***
- Edit frontend and backend url accordingly, replace with your domain name or ip address.
- Edit Allowed host accordingly. Replace with your domain name or ip address.
> [!IMPORTANT]
> - For multiple clients in the same vm edit redis db as 0,1,2 4,5,6 ..since db on redis is represented in integer value.
> - If multiple app or clients are on the same vm then Change django secret key.

- **Make key-files**

```
cd ~/app
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
## App-compile Based Deployment of RealHRsoft Backend.
In app-compile based deployment the code is build/compiled at our end and send it to server.
This is done due to security reason,where the code is compiled into **.so** format.

### Prerequisites
- Linux Ubuntu server with 22.04 LTS or Later version.
- python3.8.10 or later version.
- postgresql.
- pip.
- python3.8-virtualenv.
- nginx.
- Let's Encrypt (certbot).

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
python3.8 -m venv realhrsoft
```
- **Sending app-compile to server**
```
scp -r ./app-compile user@ip_addr:/home/ubuntu
```
- **Installing requirements**
```
source ~/realhrsoft/bin/activate
pip install -r ~/app/requirements/production.txt
```
- **Create Essential directories**
At home directory
```
cd ~/
mkdir -p media
mkdir -p logs
mkdir -p backups
mkdir -p conf
```
- **Configuring Circus Process Manager**
>[!IMPORTANT]
> Make Changes at
> - Machine user name accordingly 
> - Edit virual environment path accordingly
> - Edit app path accordingly.
```
vim ~/conf/circus.ini

[watcher:webapp]
cmd = daphne --access-log $(circus.env.LOGS_DIR)/access.log  config.asgi:application --fd $(circus.sockets.webapp)
#Edit username accordingly 
uid=ubuntu  		  #Change this user name accordingly.	
endpoint_owner=rhs
numprocesses = 1  #change this number of processes accordingly.
#Adjust username of your machine and app accordingly
working_dir = /home/ubuntu/app/
use_sockets = True
copy_env = True
copy_path = True
virtualenv = /home/ubuntu/realhrsoft/
stdout_stream.class = FileStream
stdout_stream.filename = /home/ubuntu/logs/webapp.log
stderr_stream.class = FileStream
stderr_stream.filename = /home/ubuntulogs/webapp_err.log
#hooks.after_start = config.hooks.run_raven
# optionally rotate the log file when it reaches 1 gb
# and save 5 copied of rotated files
stdout_stream.max_bytes = 1073741824
stdout_stream.backup_count = 3
stderr_stream.max_bytes = 1073741824
stderr_stream.backup_count = 3
#This will allow to run python backend at localhost 8085 port.
[socket:webapp]
host = 127.0.0.1
port = 8085
[env:webapp]
LOGS_DIR = /home/ubuntu/logs
PYTHONPATH=/home/ubuntu/app/
#NEW_RELIC_CONFIG_FILE=newrelic.ini
#This run django q cluster
[watcher:webapp_q]
cmd = python manage.py qcluster
numprocesses = 1
working_dir = /home/ubuntu/app/
virtualenv = /home/ubuntu/realhrsoft/
copy_env = True
copy_path = True
stdout_stream.class = FileStream
stdout_stream.filename = /home/ubuntu/logs/webapp_q.log
stderr_stream.class = FileStream
stderr_stream.filename = /home/ubuntu/logs/webapp_q_err.log
[env:webapp_q]
PYTHONPATH=/home/ubuntu/app/
```
- **Demonize circus.ini file**
```
circusd --daemon ~/conf/circus.ini 
circusctl reloadconfig 
circusctl reload
```
- **Configuring Nginx**
>[!IMPORTANT]
> - Edit server_name accordingly, replace with your domain name or ip address.
> - Edit  Frontend folder accordingly, replace with dist or  frontend.
> - Edit user name www-data to  ubuntu at /etc/nginx/nginx.conf 

```
cd ~/conf
vim nginx.conf
```
Copy and paste this
```
upstream irhrs-backend {
    # Nodejs app upstream
    server localhost:8085;
    keepalive 100;
}
server {
    # Edit Domain Name
    server_name domain.com;
    charset     utf-8;
    # max upload size
    client_max_body_size 75M;   # adjust to taste
    root /home/ubuntu/dist/; 
    index index.html index.htm;
    #access_log /home/ubuntu/logs/nginx_access.log;
    #error_log /home/ubuntu/logs/nginx_error.log;
    # Django media
    location /media  {
        alias /home/ubuntu/media;  # your Django project's media files - amend as required
    }
    location /static {
        alias /home/ubuntu/static; # your Django project's static files - amend as required
    }
    location ~^/((api/v1)|(o[^ffer\-letter]+)|(api/root)|global|permission|api-auth|dj-admin|(a/portal)) {
        # add_header 'Access-Control-Allow-Origin' '*';
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-NginX-Proxy true;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_redirect off;
        proxy_pass http://irhrs-backend/;
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

- Place the .env file at ~/app/. 
- ***Edit Database name, user and password accordingly.***
- Edit frontend and backend url accordingly, replace with your domain name or ip address.
- Edit Allowed host accordingly. Replace with your domain name or ip address.
> [!IMPORTANT]
> - For multiple clients in the same vm edit redis db as 0,1,2 4,5,6 ..since db on redis is represented in integer value.
> - If multiple app or clients are on the same vm then Change django secret key.

- **Make key-files**

```
cd ~/app
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