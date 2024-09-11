# Monitoring of RealHRSoft with Prometheus, Grafana, and Loki


This guide covers the setup for monitoring RealHRSoft using Prometheus for metrics collection, Grafana for data visualization, and Loki with Promtail for log aggregation.



## 1. Prometheus


### Objective

- Collect and store metrics from various sources and integrate with Grafana for visualization.



### Binary Installation


- **Create System User for Prometheus:**

```
sudo groupadd --system prometheus
sudo useradd -s /sbin/nologin --system -g prometheus prometheus
```



- **Create Required Directories:**

```
sudo mkdir /etc/prometheus
sudo mkdir /var/lib/prometheus
```


- **Download Prometheus Binary:**

```
wget https://github.com/prometheus/prometheus/releases/download/v2.43.0/prometheus-2.43.0.linux-amd64.tar.gz
```


- **Extract and Move Binaries:**

```
tar vxf prometheus*.tar.gz
cd prometheus*/
sudo mv prometheus /usr/local/bin
sudo mv promtool /usr/local/bin
sudo chown prometheus:prometheus /usr/local/bin/prometheus
sudo chown prometheus:prometheus /usr/local/bin/promtool
```



- **Move Configuration Files:**

```
sudo mv consoles /etc/prometheus
sudo mv console_libraries /etc/prometheus
sudo mv prometheus.yml /etc/prometheus
sudo chown prometheus:prometheus /etc/prometheus
sudo chown -R prometheus:prometheus /etc/prometheus/consoles
sudo chown -R prometheus:prometheus /etc/prometheus/console_libraries
sudo chown -R prometheus:prometheus /var/lib/prometheus
```



- **Default Configuration for prometheus.yml:**

```
# Prometheus global config
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]
  - job_name: "Build Server Data"
    static_configs:
      - targets: ["localhost:9100"]
  - job_name: "QAQC Data"
    static_configs:
      - targets: ["103.191.130.35:9100"]
  - job_name: "Demo node-exporter"
    static_configs:
      - targets: ["46.137.193.118:9200"]
```



- **Create Systemd Service for Prometheus:**

```
sudo vi /etc/systemd/system/prometheus.service
```


- Add the following content:

```
[Unit]
Description=Prometheus
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
ExecStart=/usr/local/bin/prometheus \
    --config.file /etc/prometheus/prometheus.yml \
    --storage.tsdb.path /var/lib/prometheus/ \
    --web.console.templates=/etc/prometheus/consoles \
    --web.console.libraries=/etc/prometheus/console_libraries

[Install]
WantedBy=multi-user.target
```



- **Reload System Service:**


```
sudo systemctl daemon-reload
sudo systemctl enable prometheus
sudo systemctl start prometheus
```



- **Allow Port 9090:**

```
sudo ufw status
sudo ufw enable # if disabled
sudo ufw allow 9090/tcp
sudo ufw reload
```



## 2. Node Exporter



### Objective:

- Collect system metrics from the server and send them to Prometheus.




### Setup Node Exporter Using Docker Image



- **Create Docker Compose File for Node Exporter:**


```
version: "3"
services:
  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    restart: unless-stopped
    security_opt:
      - apparmor=unconfined
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
      - /run/systemd/journal:/run/systemd/journal:ro
      - /var/run/dbus:/var/run/dbus:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
      - '--collector.systemd'
    ports:
      - 9100:9100
    networks:
      - monitoring

networks:
  monitoring:
    driver: bridge
```



- **Allow Port 9100:**

```
sudo ufw enable # if not enabled
sudo ufw allow 9100/tcp
sudo ufw reload
```



## 3. Loki and Promtail


### Objective:

- Aggregate and monitor logs using Loki and Promtail.




### Setup Loki and Promtail Using Docker Compose


- **Create Docker Compose File for Loki and Promtail:**

```
version: "3"
services:
  loki:
    container_name: loki_log_monitor
    image: grafana/loki:latest
    restart: always
    ports:
      - 3100:3100
    command: -config.file=/etc/loki/local-config.yaml
    networks:
      - monitoring
  promtail:
    container_name: promtail_log_monitor
    restart: always
    image: grafana/promtail:latest
    volumes:
      - /etc/opt/demo-realhrsoft-backend/irealhrsoft-backend/logs/:/var/log
    command: -config.file=/etc/promtail/config.yml
    networks:
      - monitoring

networks:
  monitoring:
    driver: bridge
volumes:
  prometheus_data: {}
```



- **Adjust Log File Monitoring:**

    - Modify the volumes section to point to the log files you want to monitor.


- **Allow Port 3100:**

```
sudo ufw enable # if not enabled
sudo ufw allow 3100/tcp
sudo ufw reload
```




## 4. Grafana


### Objective:

- Visualize data collected by Prometheus and Loki.




### Install Grafana Using Docker Compose



- **Create Docker Compose File for Grafana:**

```
version: '3'

services:
  grafana:
    container_name: grafana_dashboard
    restart: always
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    volumes:
      - grafana_data:/var/lib/grafana
    environment:
      - GF_SMTP_ENABLED=true
      - GF_SMTP_HOST=smtp.gmail.com:587
      - GF_SMTP_USER=abc@gmail.com
      - GF_SMTP_PASSWORD=pass
      - GF_SMTP_FROM_ADDRESS=abc@gmail.com
      - GF_SMTP_STARTTLS_MODE=enabled
      - GF_SMTP_SKIP_VERIFY=false

volumes:
  grafana_data:
```


- **Allow Port 3000:**
```
sudo ufw enable # if not enabled
sudo ufw allow 3000/tcp
sudo ufw reload
```




## 5. Security Best Practices


- Since you need to open the following ports:

    - 9090 (Prometheus)
    - 9100 (Node Exporter)
    - 3100 (Loki)
    - 3000 (Grafana)


### Recommendation: 
- Allow access to these ports only from a specific public IP address from which you access the Grafana dashboard. This limits exposure and enhances security.



### Example Setup:

- Build Server IP: 192.168.1.53
- Public IP Access: Restrict access to the monitoring ports to this public IP only.































































