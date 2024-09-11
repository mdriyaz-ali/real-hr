# File Structure
## File Structure for cloud based clients

| Directory name | Details |
| ---------------| --------|
| /etc/opt       | Directory for  backend and frontend |
| /etc/opt/realhrsoft-backend/ | Directory for RealHRsoft Backend |
| /etc/opt/realhrsoft-frontend |  Directory for RealHRsoft Frontend |
| /tmp | Directory for temporary file storage. |
| /etc/nginx/sites-available/ | Directory for nginx configurations and linked to /sites-enabled/ |
| /etc/systemd/system/ | Directory for  unit service configuration for Gunicorn and qcluster |
| /etc/opt/realhrsoft-backend/logs | Directory for realhrsoft logs|
| /etc/opt/realhrsoft-backend/backups/ | Directory for database backup |
| /home/user/repo.git | Directory for realhrsoft bare repo |

## File Structure for On premise  based clients
| Directory name | Details |
| ---------------| --------|
| /home/user/ | Directory for backend and frontend |
| /home/user/realhrsoft-backend/ | Directory for RealHRsoft Backend |
| /home/user/realhrsoft-frontend |  Directory for RealHRsoft Frontend |
| /tmp | Directory for temporary file storage. |
| /etc/nginx/sites-available/ | Directory for nginx configurations and linked to /sites-enabled/ |
| /etc/systemd/system/ | Directory for  unit service configuration for Gunicorn and qcluster |
| /home/user/realhrsoft-backend/logs | Directory for realhrsoft logs|
| /home/user/realhrsoft-backend/backups/ | Directory for database backup |
| /home/user/repo.git | Directory for realhrsoft bare repo |
