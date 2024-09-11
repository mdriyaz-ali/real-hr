# Attendance Sync Methods in RealHrSoft

## RealHrSoft supports five primary methods for syncing attendance data:

-  Advanced Distribution Management System (ADMS)
- Direct Sync
- External Sync
- Do Not Sync
- Web Attendance


## 1. Advanced Distribution Management System (ADMS)

### Overview


- ADMS is a cloud-based, real-time data sync method.
- This feature requires a paid subscription.
- Compatible devices: ZKotecho models including IN 01, IN 31, IN 360, K40/pro.



### Configuration

- **Required Details:**

    - Device Serial Number
    - IP address assigned to the attendance device


### Steps:

- **Access ADMS Control Panel:**

   - Internal: http://192.168.102.235:8081/iclock/data/iclock/
   - Public: http://202.79.34.197:1293




- **Add and Configure New Device:**

   - Log in to the client's RealHrSoft account and switch to the organization.
   - Navigate to Attendance > Settings > Device Settings > Create New.
   - Choose the sync method as ADMS.


- **Client Device Configuration:**

   - Ensure ADMS compatibility.
   - Set the ADMS IP to 202.79.34.197 and port to 1293.
   - Configuration format: 202.79.34.197:1293




## 2. Direct Sync


### Overview:

- Direct sync requires the client to provide their public IP address, port forwarding details, and device serial number.



### Configuration


- **Required Details:**

   - Device Serial Number
   - IP address assigned to the attendance device
   - Port number: 4370



### Steps:

- **Log in to RealHrSoft:**
    - Switch to the organization.
    - Navigate to Attendance > Settings > Device Settings > Create New.
    - Choose the sync method as Direct Sync.


- **Client-side NAT Configuration:**
    - Src.address: Public IP of the AWS instance where the client's system is deployed.
    - Dst.address: Public IP address of the client.
    - Protocol: 6 (TCP)
    - Dest.port: Assign any port.
    - Action: Destination NAT.
    - To address: Internal IP of the attendance device.
    - Port: 4370




## 3. External Sync



### Overview:

   - External sync is performed on the client’s on-premises Windows-based computer by installing attendance sync software via AnyDesk.



### Prerequisites:


  - Attendance Server ZIP file.
  - AnyDesk software.
  - PC with internet connection.
  - ZKotecho device Serial Number, IP address, and Port number


### Configuration Procedure:


- **Connect to Client Device via AnyDesk.**



- **Install Python 3.8:**


    - Download and install Python 3.8 on the client’s device.
    - Ensure to check the "Add to Path" option during installation.



- **Setup Attendance Server:**

    - Copy the Attendance Server ZIP file to the client’s device.
    - Unzip the project in the local directory {Document/attendance_server}.



- **Install Django:**


    - Open PowerShell on the client’s computer.

    - Install Django:
   ```
    pip install django
    ```

    - Install and create a virtual environment:
    ```
     pip install virtualenv
     python -m venv realhrsoft
    ```


    - Activate the virtual environment:
    ```
     realhrsoft\Scripts\activate.ps1
    ```



    - If not executed, grant execution policy:
    ```
     set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
    ```



    - Install dependencies:
    ```
    pip install -r requirements.txt
    ```


    - Edit settings in env.sample.py or env.py:
    ```
    TIME_ZONE = 'Asia/Kathmandu'
    SERVER_DOMAIN = 'ewc.realhrsoft.com'
    PROTOCOL = 'https'
    ATTENDANCE_API_KEY = 'ewcattendance'
    IGNORE_TIMESTAMPS_BEFORE = date(2023, 7, 16)
    ```



    - Make data migrations:
    ```
    python manage.py migrate
    ```


    - Create a superuser:
    ```
   python manage.py createsuperuser
   Username: ubuntu
   Email: hr@ewc.com
   Password: ewcrealhrsoft
    ```



    - Run the Django server:

    ```
    python manage.py runserver
    ```


### Sync Data:

- **Run the sync script:**

    ```
    python sync_data.py
    ```



### Login and Configure Device:


  - Access localhost 127.0.0.1:8000 with superuser credentials.
  - Add attendance device with the Serial Number, IP address, Port number, and select Zone as Asia/Kathmandu.
 - Create a device profile with the sync method as External Sync.



 ## Possible Errors:



- If the device is not connected, check if the device IP can be pinged from the PC:

    ```
  ping <ip_address>

    ```




## Task Scheduler Setup:



### Setup Task Scheduler:

- Install requirements.txt without activating the environment.
- Open Task Scheduler and create a new task.



- **Trigger:**

    - Daily.
    - Repeat every 10 minutes indefinitely.


- **Action:**


    - Action: Start a program.
    - Program/Script: Browse and select the sync.bat file.
    - Start in: Copy the directory path of the sync.bat file.



### Edit sync.bat file:


- Example:

    ```
    @echo off "C:\Users\staff\AppData\Local\Programs\Python\Python39\python.exe" "C:\Users\staff\Documents\attendance_server\attendance-server-master\attendance-server\sync_data.py" 
    goto :eof

    ```



- **Note: Adjust the Python installation directory and file locations accordingly.**



### Best Practice:


- If all attendance devices are on the same VLAN or can be pinged from one PC, set up RealHrSoft on that PC and add all devices.

- Setup task schedules for PC power on/off actions, using the "On Power On" option in the Trigger section.











