# Setting Up Docker Client on Local Developer PC



## Objective:

-  Configure Docker client to work with your on-premise Docker registry.


### Steps:


- **Copy Certificate:**

    -  Copy the domain.crt certificate to the Docker certificates directory on your local machine:

    ```
    sudo mkdir -p /etc/docker/cert.d/dhub.aayulogic.io
    sudo cp /path/to/domain.crt /etc/docker/cert.d/dhub.aayulogic.io/

    ```



- **Update Hosts File:**

    - Edit the /etc/hosts file to include an entry for the Docker registry:

    ```

    sudo nano /etc/hosts

    ```



    - Add the following line:

    ```
    192.168.102.249   dhub.aayulogic.io

    ```

- - Save and close the file.




# Building and Pushing Images



## Objective:

-  Build and push Docker images to your on-premise Docker registry.



- **Run Frontend Container:**


    - To run the frontend container and expose it on port 7300:


    ```
    docker run --rm --init -p 0.0.0.0:7300:3000 --env BACKEND_DOMAIN=192.168.102.5:7301 --name fe_stable dhub.aayulogic.io/v2/qaqc/fe_rhrs:fe_stable
    ```




- **Run Backend Container:**


    - To run the backend container, mount the environment file, and expose it on port 7301:


    ```
    docker run --rm -p 0.0.0.0:7301:8000 -v /home/realhr/.env:/app/.env --name test dhub.aayulogic.io/v2/qaqc/be_rhrs:devops-qaqc-ci

    ```



- **Note:**

    - Ensure Docker is properly installed and running on your local machine.
    - Replace /path/to/domain.crt with the actual path to your certificate file.










    








    














