---
outline: deep
---

# Pre-work
### RealHRsoft Backend setup on Local machine
### Pre-requisites
- Linux 22.04 LTS or Later
- Python3.8.10 or Later version
### Procedure
Before cloning git repository using ssh url. Add your ssh public key to your git hub account's setting>>SSH & GPG key 
If you don't have ssh key in your local machine then generate using 
```
ssh-keygen -t rsa -b 4096 -C "your@email address" 

```
- git clone backend repository
```
git clone https://repository@url
```
- Install python3.8.10 or later version
```
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt install python3.8 -y
python3.8 --version
```
- Install python-venv
```
pip install python-venv
```
- Create virtual environment
```
python3.8 -m venv realhrsoft
```
### RealHRsoft Frontend setup on Local machine
### Pre-requisites
- Linux 22.04 LTS or Later
- yarn 14+ version.

### Procedure
- Install curl 
```
sudo apt install curl -y
``` 
- Install nvm 
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```
- Install yarn
``` 
npm install -g yarn

yarn install 
``` 
