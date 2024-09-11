# [RealHRsoft](https://realhrsoft.com) Deployment Documentation

This page demonstrates complete Deployment procedure of RealHRsoft website for DevOps Engineers.

## Production Stack
  
  **Frontend**
   - *vue.js*
  
  **Backend**
  - Circus,Daphne method.( Currently using for on-premises clients )
    - Here circus is used for process manager.
    - Daphne is used for running python backend.
  - Gunicorn and Uvicorn method. ( Currently using for cloud based clients )
    - Unit service file is used for process manager.
    - Gunicorn and Uvicorn is used running python backend.
  
  **Database**
  - postgresql

  **Caching**
  - *Redis*
  
  **Web-Server reverse proxy**
  - *nginx*
  
  **DNS**
  - cloud-flare
  
  **SSL Certificate**
  - Let's Encrypt (Certbot)



