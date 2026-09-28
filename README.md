# Networx

A browser-based network emulator for teaching computer networking concepts at GCSE and/or A Level courses.

**[Live demo →](https://milesberry.net/networx)**

![Classroom network](classroom.png)

## What it does

Networx lets you build virtual networks by dragging hardware components onto a canvas and connecting them with wired or wireless links. Once built, you can:

- **Run terminal commands** on PCs, laptops, and servers — `ping`, `traceroute`, `ipconfig`, `nslookup`, `curl`, `ssh`, and more
- **Browse the web** — a built-in browser on PC/Laptop/Server nodes renders pages served by Web Server nodes, resolves hostnames via local DNS, and simulates internet access through a Cloud node
- **SSH between nodes** — `ssh <ip>` opens a persistent session; all subsequent commands run on the remote device until you type `exit`
- **Assign IPs with DHCP** — routers run a DHCP server; clients request leases with `dhclient` (Linux) or `ipconfig /renew` (Windows), animating the full four-way handshake
- **Configure DNS records** — DNS Server nodes hold A records that resolve hostnames across the network
- **Ping domain names** — `ping google.com` resolves via DNS and routes through the internet node
- **Inspect switch MAC tables** — tables populate as traffic flows, showing which MAC address was learned on which port
- **Configure routers** — add static routing table entries
- **Set firewall rules** — allow/deny by protocol, port, and IP
- **Configure wireless access points** — SSID, WPA key, 2.4/5 GHz band
- **Inspect device learning notes** — each device now includes a learner-facing explanation of its role, comparisons, and key ideas
- **Use the in-app concepts panel** — searchable guides cover LAN/WLAN/WAN, DNS, cloud, protocols, addressing, transmission media, performance factors, and more
- **Load preset scenarios** — six built-in topologies covering LANs, WLANs, WANs, client-server systems, security, and infrastructure planning
- **Save and share** — export your network as a `.json` file and import it elsewhere

## Preset scenarios

| Scenario | Main coverage |
|---|---|
| Star Topology (LAN) | LAN basics, Ethernet switching, MAC learning, ping |
| Home Network | Home gateway, WLAN, DHCP, internet access, wired vs wireless trade-offs |
| School Network | Firewall rules, DNS, servers, segmentation, classroom Wi-Fi |
| Client-Server Model | Client-server architecture, WWW vs internet discussion, DNS resolution, `nslookup`, `curl` |
| Mesh / WAN Topology | WAN concepts, routing, redundancy, multiple paths, internet-backbone style links |
| Shopping Centre Infrastructure | Multi-area network planning, hardware justification, guest Wi‑Fi, POS/client devices, public portal, cloud/WAN access |

## Educational coverage

Where practical, Networx now supports or highlights:

- **LAN, WLAN, and WAN** distinctions, common uses, and typical speed/latency differences
- **Client-server and peer-to-peer** models
- **Network performance factors** such as bandwidth, latency, congestion, interference, device capability, protocols, topology, and redundancy
- **Hardware roles** including PCs/clients, servers, switches, routers, wireless access points, firewalls, gateways, DNS servers, web servers, and cloud/internet connections
- **Shopping-centre style infrastructure planning** through the new preset scenario
- **WWW vs internet**
- **IP, URL, and MAC address** distinctions
- **DNS operation and name resolution**
- **Cloud computing** advantages and disadvantages
- **Connection modes and transmission media** including wired Ethernet, fibre concepts (FTTC/FTTP), Wi‑Fi, Bluetooth, microwave, satellite, and infrared at a teaching level
- **Protocols and standards** such as Ethernet, Wi‑Fi, Bluetooth, TCP/IP, DNS, HTTP, HTTPS, SMTP, POP3, and IMAP through the concept panel and existing simulator behaviour
- **Mobile generations 2G / 2.5G / 3G / 4G / 5G** at a conceptual level in the learning content

## Educational limitations

Networx is a teaching emulator, not a full packet-accurate network simulator. In particular:

- **Performance values are illustrative** rather than measured against real hardware
- **Mobile generations** are explained conceptually; radio cells, spectrum, and carrier infrastructure are not simulated
- **Transmission media** comparisons are educational summaries; the app models links as wired or wireless abstractions
- **Cloud/internet behaviour** is simplified into a learner-friendly WAN/public-network model
- **Security and routing** features are simplified for classroom exploration rather than enterprise-grade accuracy

## Curriculum / learning-objective links

Networx is suitable for teaching or revising topics such as:

- **LAN / WLAN / WAN** structure, uses, and relative performance
- **Client-server vs peer-to-peer** networking
- **Hardware roles** in local and wider-area networks
- **IP, URL, MAC, DNS, and TCP/IP**
- **WWW vs internet**
- **Cloud computing**
- **Connection methods and transmission media**
- **Ethernet, Wi‑Fi, Bluetooth, and common network/application protocols**
- **Mobile networking generations** at an introductory conceptual level

The interactive presets, terminal commands, browser, configuration panels, and concepts library are designed to support learners exploring these objectives through practical examples.

## Running locally

```bash
npm install
npm run dev
```

Requires Node 18+.

## Build

```bash
npm run build
```

## Tech stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [React Flow (@xyflow/react)](https://reactflow.dev/) — canvas and graph rendering
- [Zustand](https://zustand-demo.pmnd.rs/) — state management
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [Lucide React](https://lucide.dev/) — icons
- [Vite](https://vitejs.dev/) — build tool

## License

MIT — see [LICENSE](LICENSE).
