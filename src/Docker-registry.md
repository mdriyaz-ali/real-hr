# Docker Registry Setup


## Objective:

  -  Set up a Docker on-premise registry with the domain dhub.aayulogic.io.



## Folder Structure:

- Ensure you have the following folder structure on your machine:

```
/home/ubuntu
├── certs
│   ├── client.cert
│   └── client.key
├── registry
│   ├── auth
│   │   └── registry.passwd
│   ├── nginx
│   │   ├── conf.d
│   │   │   ├── registry.conf
│   │   │   └── additional.conf
│   │   └── ssl
│   │       ├── domain.crt
│   │       └── domain.key
│   └── docker-compose.yml


```


### Steps:


- **Copy Required Files:**


    - Copy the certificate files and Docker Compose files to the /home/ubuntu/registry directory on your machine.



- **Run Docker Compose:**


    - Navigate to the /home/ubuntu/registry directory:


    ```
    cd /home/ubuntu/registry

    ```


- **Run the Docker Compose file:**

```
docker-compose up
 ```


- This command will spin up the Docker registry image and Nginx image from Docker Hub.




- **Docker Compose Configuration (docker-compose.yml):**

```
version: '3'
services:
  # Registry Service
  registry:
    image: registry:2
    restart: always
    ports:
      - "5000:5000"
    environment:
      REGISTRY_AUTH: htpasswd
      REGISTRY_AUTH_HTPASSWD_REALM: Registry-Realm
      REGISTRY_AUTH_HTPASSWD_PATH: /auth/registry.passwd
      REGISTRY_STORAGE_FILESYSTEM_ROOTDIRECTORY: /data
      REGISTRY_STORAGE_DELETE_ENABLED: "yes"
    volumes:
      - registrydata:/data
      - ./auth:/auth
    networks:
      - mynet

  # Nginx Service
  nginx:
    image: nginx:alpine
    container_name: nginx
    restart: unless-stopped
    tty: true
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d/:/etc/nginx/conf.d/
      - ./nginx/ssl/:/etc/nginx/ssl/
    networks:
      - mynet

# Docker Networks
networks:
  mynet:
    driver: bridge

# Volumes
volumes:
  registrydata:
    driver: local

```



- **Nginx Configuration (nginx/conf.d/registry.conf):**

```
upstream docker-registry {
    server registry:5000;
}

server {
    listen 80;
    server_name dhub.aayulogic.io;
    return 301 https://dhub.aayulogic.io$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dhub.aayulogic.io;

    ssl_certificate /etc/nginx/ssl/domain.crt;
    ssl_certificate_key /etc/nginx/ssl/domain.key;

    # Log files for Debug
    error_log  /var/log/nginx/error.log;
    access_log /var/log/nginx/access.log;

    location / {
        # Do not allow connections from docker 1.5 and earlier
        if ($http_user_agent ~ "^(docker\/1\.(3|4|5(?!\.[0-9]-dev))|Go ).*$" )  {
            return 404;
        }

        proxy_pass                          http://docker-registry;
        proxy_set_header  Host              $http_host;
        proxy_set_header  X-Real-IP         $remote_addr;
        proxy_set_header  X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header  X-Forwarded-Proto $scheme;
        proxy_read_timeout                  900;
    }
}
```



### Ensure you have the following prerequisites before starting the setup:



- Docker and Docker Compose installed on your machine.
- Proper network configuration to allow access to the Docker registry.












