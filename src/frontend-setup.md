# Deployment of RealHRsoft Frontend

## App based Deployment of RealHRsoft Backend.
In App based deployment of clone the whole git hub repo into the server.

### Prerequisites
- Get required permissions from the repo owner.
- Linux 22.04 LTS 
- yarn 14.+ version installed


### Frontend Folders
- Cloud-related clients: Use the frontend folder.
- On-premises: Use the compiled dist folder.

## Procedure

- **Clone the Repository**

    git clone < repo url >

- NOTE:
    - For SSH URL setup you have to copy your local pc ssh public key id_rsa.pub to your git profile.


- **Generate SSH Key with email**

    ssh-keygen -t rsa -b 4096 -C “your email address”



- **Installing node**

    - - Install curl if not already installed:

        sudo apt install curl && curl --version



- **Install Node.js using NVM** 

    ```
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
    source ~/.bashrc
    nvm list-remote
    nvm install v16.18.0

   ```


- **Install Yarn**
    ```
    npm install --global yarn
     yarn

     ```



## Important !! 

- Before building frontend change the client name in “.env” file. For Laxmi bank change it to “laxmi” because Laxmi has its own color code.

- Each client has it’s own 

##

