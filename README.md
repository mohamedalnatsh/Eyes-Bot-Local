# 🏥 Eye Hospital Support & Automation WhatsApp Bot

An automated, lightweight WhatsApp assistant developed using `whatsapp-web.js` and `Node.js`. This bot is containerized with Docker to assist hospital administrative staff and security personnel in quickly fetching Standard Operating Procedures (SOPs), sterilization instructions, duty schedules, and encrypted document retrieval (PDFs).

---

## ⚠️ Important Notice (Demo Version)
> **NOTE:** This repository contains a **Demo / Proof of Concept (PoC)** version of the application. All sensitive hospital infrastructure details, real medical personnel data, custom workflows, and production API tokens have been stripped out or mocked to maintain institutional security and privacy compliance. This code serves as public evidence of the bot's architectural design and core features.

---

## ✨ Features
* **Automated Menu Navigation:** Intuitive numerical and keyword-based triage menu (e.g., handling variations like "تعقيم", "استقبال", "اس").
* **Network-Aware Resilience:** Custom initialization guard (`checkInternetAndStart()`) that pings reliable servers to hold client runtime until network state changes stabilize.
* **Media Handling Support:** Direct buffer pipelines utilizing `MessageMedia` to deliver documents (such as security shift tables) asynchronously over WhatsApp.
* **Containerized Deployment:** Bundled via Docker using an optimized Puppeteer base image to handle underlying headless Chromium dependencies out-of-the-box.
* **Lightweight Web Hook integration:** Built-in Express handler configured to bind cleanly to any container port mapping (e.g., Port `8080`).

---

## 🛠️ Architecture & Tech Stack
* **Deployment OS:** Ubuntu Server (Optimized for headless LTS environments)
* **Runtime Environment:** Node.js (v18+)
* **Core Library:** whatsapp-web.js
* **Web Framework:** Express.js
* **Process Automation:** Native Child Processes for networking fallbacks.
* **Containerization:** Docker (Headless Chromium Environment)

---

## 🚀 Ubuntu Server Deployment & Installation

### 1. Prerequisites
Update your Ubuntu package index and ensure Docker is active on your server:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install docker.io -y
sudo systemctl enable --now docker
---
2. Environment Setup
Clone this repository to your active production directory and add your public-facing files (like security.pdf) into the project root:

Bash
cd /path/to/your/app
---
3. Build & Run Container
Execute the following commands to spin up the containerized instance:

Bash
# Build the Docker image
sudo docker build -t eye-hospital-bot .

# Run the container isolated on port 8080
sudo docker run -d --name hospital-bot-instance -p 8080:8080 eye-hospital-bot
---
4. Link WhatsApp (QR Generation)
Check the Ubuntu container logs to scan the terminal-generated QR code directly from your SSH session:

Bash
sudo docker logs hospital-bot-instance
Open WhatsApp on your mobile device -> Linked Devices -> Scan the terminal QR Code
---
📂 Source File Structure
index.js - Main entry point handling logic routing, automated responses, and network validation.

Dockerfile - Customized configuration based on puppeteer/puppeteer ensuring all Chromium sandboxing configurations work safely under root contexts inside isolated Linux environments.

package.json - Declares production standard dependencies.

🔒 Security Compliance
⚠️This bot uses LocalAuth strategies ensuring authentication tokens remain safely inside internal system folders, preventing cross-session credential leaks.
