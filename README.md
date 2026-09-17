# Local Network Scanner & Mapper

A lightweight, web-based network discovery tool built with **Python**, **Flask**, and **Scapy**. This application dynamically auto-detects whatever local network (subnet) your computer is currently connected to, broadcasts ARP requests to map active devices, and displays their IP addresses, MAC addresses, and hostnames via a web interface.

## 🚀 Features
* **Auto-Network Detection:** Dynamically calculates your current subnet (e.g., `192.168.1.0/24`) every time a scan runs. No hardcoded IP addresses.
* **Layer 2 Scan:** Utilizes raw ARP packets via Scapy for rapid, reliable local device discovery.
* **Hostname Lookup:** Attempts reverse DNS lookups to identify friendly names (e.g., `COLETONS-LAPTOP`) for devices on the network.
* **Web API:** Serves data via a clean JSON endpoint (`/api/devices`).

---

## 🛠️ Prerequisites & Installation

Before running the application, you must install the required Python dependencies and system network utilities.

### 1. Install Dependencies
Open your terminal and install Flask and Scapy:
```bash
pip install flask scapy
```

### 2. System Level Requirements
Because Scapy interacts with raw network packets at Layer 2, your operating system may require packet capture libraries:
* **macOS:** Native utilities are supported, but you must grant your terminal application **Full Disk Access** in system privacy settings.
* **Linux (Ubuntu/Debian/Kali):** Ensure `libpcap` is installed:
  ```bash
  sudo apt update && sudo apt install libpcap-dev
  ```
* **Windows:** You must download and install **Npcap** (ensure you check the box to *"Install Npcap in WinPcap API-compatible Mode"* during setup).

---

## 💻 How to Run

1. Place your Python script (`app.py`) and your template folder (containing `index.html`) in the same directory:
   ```text
   ├── app.py
   └── templates/
       └── index.html
   ```

2. **Crucial Step:** Because the script creates and broadcasts raw ARP packets, it **requires administrative/root privileges** to execute. Run the app using `sudo` (or an Administrator command prompt on Windows):

   ```bash
   sudo python app.py
   ```

3. Open your web browser and navigate to:
   ```text
   http://localhost:5000/
   ```

To access the scanner interface from *another device* on your test network, replace `localhost` with your host computer's local IP address (e.g., `http://192.168.1`).

---

## 🛑 Troubleshooting

### 1. Permission Errors (`PermissionError: [Errno 1]`)
* **Fix:** You forgot to use `sudo`. Ensure you launch the application with `sudo python app.py`. On macOS, ensure your terminal application has full disk/network accessibility permissions.

### 2. Zero Devices Found on Public Wi-Fi
* **Reason:** Public networks (like schools, coffee shops, or hotels) usually enforce **AP Isolation (Access Point Isolation)**. The router blocks devices on the same Wi-Fi from talking to or seeing one another. 
* **Fix:** Use a private home lab router or a smartphone mobile hotspot for testing.

---

## 📝 License
This project is intended strictly for educational research, local network troubleshooting, and authorized home lab administration.
