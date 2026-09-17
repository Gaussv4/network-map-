from flask import Flask, render_template, jsonify
import socket
from scapy.all import ARP, Ether, srp

app = Flask(__name__)

def get_local_ip_range():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()
        s.close()
        return ".".join(local_ip.split(".")[:3]) + ".0/24"
    except:
        return "192.168.1.0/24"

def scan_network():
    ip_range = get_local_ip_range()
    print(f"Scanning target range: {ip_range}")
    
    arp_request = ARP(pdst=ip_range)
    broadcast = Ether(dst="ff:ff:ff:ff:ff:ff")
    packet = broadcast / arp_request
    
    answered_list, _ = srp(packet, timeout=3, verbose=False)

    devices = []
    for sent, received in answered_list:
        mac_address = received.hwsrc
        ip_address = received.psrc
        
        # 1. Default fallback name
        vendor = "Active Client Node"
        
        # 2. Try a network Hostname lookup (Pings the device for its real name)
        try:
            # gethostbyaddr returns a tuple like: ('Coletons-Laptop.local', [], ['192.168.1.50'])
            hostname = socket.gethostbyaddr(ip_address)[0]
            # Clean up trailing network tags if they exist
            vendor = hostname.split('.')[0].upper()
        except:
            # If the device hides its hostname, look for infrastructure defaults
            if ip_address.endswith(".1"):
                vendor = "MASTER GATEWAY ROUTER"

        devices.append({
            "ip": ip_address,
            "mac": mac_address,
            "vendor": vendor
        })
    return devices

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/devices')
def get_devices():
    devices = scan_network()
    return jsonify(devices)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
