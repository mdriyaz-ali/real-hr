# Deployment and Version Update Automation with Ansible


RealHrSoft uses Ansible for automating deployment and version updates. This process is divided into two scenarios: completely new onboarding and migration of a client with an existing database.


## 1. Deployment Automation


### Objective:

- Automate the deployment for a new client or an existing client with a fresh setup.



## Completely New Onboarding


### Pre-works:


- **Install Ansible:**

    - Ensure Ansible is installed on your machine.


- **Swap Memory:**

    - If needed, create a swap file for additional memory.


- **Prepare Deployment Files:**

    - Create zip files for the backend (irealhrsoft-backend) and frontend (irhrs-frontend)
    - Copy these zip files to the directory where the Ansible files will be executed.
    - Copy the .env file and runtineConfig.json files for backend and frontend environments


- **Configuration:**

    - Ensure the PostgreSQL database variables in the .env file match the database configuration.
    - Edit the .env and runtineConfig.json files as required.


- **Setup Git:**

    - Add a remote Git origin from your local irealhrsoft backend code to the server for bare repository push.


- **Edit Inventory and Redis Configuration:**


    - Update the inventory file as needed.
    - Configure Redis DB index (e.g., ‘0’, ‘1’, ‘2’) if multiple clients are hosted on a single VM.



### Steps:


- **Clone Deployment Code:**

    - Clone the deployment-realhrsoft repository to your local machine.


- **Create Swap File:**

    - Use the following command to create a swap file:

    ```
    sudo fallocate -l 1G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    ```


- **Run Ansible Playbook:**

    - Execute the playbook with:


    ```
   ansible-playbook deploy.yml -i inventory --extra-vars '{"host":"inhouse","client_name":"khajuri","domain_name":""}'
    ```



- **Parameters:**


    - host: The host to deploy, mapped from the Ansible inventory file.
    - client_name: The name of the client.
    - domain_name: The client's domain name (e.g., abc.realhrsoft.com).



## Migration of Client with Existing Database



### Objective:

- Migrate an existing client from one server to another with their existing data.



### Pre-works:



- **Prepare Backup:**

    - Create a zip file of media and the latest database backup for the client.
    - Copy media.zip to the directory where the Ansible code will be deployed.
    - Copy the client’s database file to the new server’s /tmp directory and extract it.


- **Repeat Deployment Preparation:**

    - Follow the same steps as the new onboarding for preparing irealhrsoft-backend and irhrs-frontend zip files.
    - Ensure the .env file and runtineConfig.json files are updated.
    - Set up Git origin and update the inventory and Redis configuration.



### Steps:


- **Clone Deployment Code:**

    - Clone the deployment-realhrsoft repository to your local machine.




- **Create Swap File:**

    - Use the same swap file creation command as described above.



- **Run Ansible Playbook:**

    - Execute the playbook with:


    ```
    ansible-playbook deploy.yml -i inventory --extra-vars '{"host":"mapped from inventory","client_name":"realhr","db_file":"extracted db file at /tmp/ dir "}'
    ```


- **Parameters:**

    - host: The host to deploy, mapped from the Ansible inventory file.
    - client_name: The name of the client.
    - db_file: The path to the extracted database file on the server’s /tmp directory.





## Version Update of Client


### Objective:

- Update the version of RealHrSoft after every sprint closing.


    - Follow the same deployment steps but with updated versions of the backend and frontend zip files.














































