import type { DeviceType } from '../types'

export interface LearningSnapshot {
  summary: string
  keyIdeas: string[]
  compare: string[]
  caveat?: string
}

const DEVICE_LEARNING: Record<DeviceType, LearningSnapshot> = {
  pc: {
    summary: 'A client device used to test LAN, WLAN, client-server, and peer-to-peer ideas.',
    keyIdeas: [
      'Uses a MAC address on the local link and an IP address for end-to-end communication.',
      'When browsing the web, the browser uses a URL, extracts the hostname, and DNS resolves that hostname to an IP address.',
      'Performance depends on device capability, bandwidth, latency, congestion, and whether the connection is wired or wireless.',
    ],
    compare: [
      'Compare with a server, which provides services to many clients.',
      'Compare with peer-to-peer sharing, where clients can also offer files or services directly.',
    ],
  },
  laptop: {
    summary: 'A portable client that is useful for comparing wired LAN links with wireless WLAN access.',
    keyIdeas: [
      'Usually connects over Wi-Fi, so signal strength, interference, and distance matter more than on Ethernet.',
      'Still needs MAC, IP, gateway, and DNS settings just like any other host.',
      'Good for demonstrating mobility, roaming, and the trade-off between convenience and consistent throughput.',
    ],
    compare: [
      'Compare Wi-Fi range and interference with more stable wired Ethernet links.',
      'Compare local WLAN use with WAN/mobile access, which usually has higher latency.',
    ],
  },
  server: {
    summary: 'A server provides shared resources, making client-server models easier to visualise.',
    keyIdeas: [
      'Common roles include file, application, authentication, or cloud-hosted services.',
      'Servers need reliable addressing and usually benefit from wired links, redundancy, and stronger hardware.',
      'Can support centralised management, backups, and security, but may become a single point of failure.',
    ],
    compare: [
      'Compare with peer-to-peer, where no dedicated central server is required.',
      'Compare local servers with cloud services, which trade control for scalability and internet dependence.',
    ],
  },
  router: {
    summary: 'Routers connect networks and are the key device for LAN-to-WAN communication.',
    keyIdeas: [
      'Uses IP addresses and routing tables to move packets between different networks.',
      'Often provides the default gateway that sends traffic from a LAN towards a WAN or the internet.',
      'Network performance is affected by routing choices, bandwidth, latency, congestion, and path redundancy.',
    ],
    compare: [
      'Compare with a switch, which forwards frames inside one LAN using MAC addresses.',
      'Compare with a firewall, which filters traffic rather than simply forwarding it.',
    ],
  },
  switch: {
    summary: 'A switch connects devices inside a LAN and learns where MAC addresses are located.',
    keyIdeas: [
      'Forwards Ethernet frames using a MAC address table instead of flooding every port like a hub.',
      'Supports fast local communication, so switches are common in LANs where high throughput is needed.',
      'Useful for explaining why LAN traffic is usually faster and lower-latency than WAN traffic.',
    ],
    compare: [
      'Compare with a hub, which broadcasts traffic to all ports.',
      'Compare with a router, which connects different networks rather than just one LAN.',
    ],
  },
  hub: {
    summary: 'A hub is an older shared-media device used mainly for contrast with modern switches.',
    keyIdeas: [
      'Repeats incoming traffic to every port instead of making a forwarding decision.',
      'Creates more unnecessary traffic, so congestion and collisions are more likely.',
      'Useful as a teaching contrast when explaining why switched Ethernet performs better.',
    ],
    compare: [
      'Compare with a switch, which learns MAC addresses and forwards more efficiently.',
      'Compare with wireless broadcast media, where shared airtime can also reduce performance.',
    ],
  },
  wap: {
    summary: 'A wireless access point joins wireless clients to the rest of the network.',
    keyIdeas: [
      'Creates a WLAN using Wi-Fi standards and forwards traffic into the wired LAN.',
      '2.4 GHz usually offers longer range but more interference; 5 GHz is often faster but shorter range.',
      'Performance depends on interference, distance, shared airtime, client capability, and channel congestion.',
    ],
    compare: [
      'Compare a WLAN with a wired LAN for mobility versus predictable speed and latency.',
      'Compare Wi-Fi with Bluetooth, which is usually shorter-range and lower-throughput.',
    ],
  },
  firewall: {
    summary: 'A firewall filters traffic between network areas using rules based on addresses, ports, and protocols.',
    keyIdeas: [
      'Helps protect internal devices when traffic moves between trusted and untrusted networks.',
      'Can permit services such as HTTP/HTTPS while denying unnecessary inbound access.',
      'Good for discussing security, segmentation, and why public WAN links need stronger filtering than a small LAN.',
    ],
    compare: [
      'Compare with a router, which decides where packets go.',
      'Compare with application security, which protects software after traffic is allowed through.',
    ],
  },
  gateway: {
    summary: 'A home or small-site gateway combines several hardware roles into one device.',
    keyIdeas: [
      'Typically combines modem/ONT handoff, router, switch, Wi-Fi access point, DHCP, and basic firewall functions.',
      'Useful for comparing integrated small-network hardware with separate enterprise devices.',
      'Shows how one box can connect a local LAN/WLAN to an external WAN or fibre service.',
    ],
    compare: [
      'Compare with a router-only device in a larger managed network.',
      'Compare with a dedicated modem or ONT, which handles the physical ISP connection but not all local services.',
    ],
    caveat: 'This emulator treats the gateway conceptually as a combined edge device rather than modelling every physical ISP component separately.',
  },
  dns: {
    summary: 'A DNS server translates hostnames into IP addresses so people do not need to remember numeric addresses.',
    keyIdeas: [
      'Browsers use URLs, but DNS resolves only the hostname part of a URL, not the whole page path.',
      'Shows the difference between a MAC address (local link), an IP address (end-to-end routing), and a hostname or URL (human-friendly naming).',
      'Supports client-server networking because many clients can find services through stable names.',
    ],
    compare: [
      'Compare DNS with routing: DNS finds a destination IP, while routers decide how to reach it.',
      'Compare a local DNS server with public internet DNS infrastructure.',
    ],
  },
  web: {
    summary: 'A web server helps learners distinguish the World Wide Web from the wider internet.',
    keyIdeas: [
      'The WWW is an application-layer service that usually uses HTTP or HTTPS on top of the internet.',
      'Users request a web page by URL; DNS resolves the hostname, then TCP/IP carries the traffic.',
      'A web service can run on a local LAN server or on a remote cloud-hosted system across a WAN.',
    ],
    compare: [
      'Compare the WWW with the broader internet, which also carries email, DNS, SSH, and many other services.',
      'Compare local intranet pages with public internet websites.',
    ],
  },
  cloud: {
    summary: 'The cloud/internet node represents WAN and internet connectivity beyond the local site.',
    keyIdeas: [
      'Useful for contrasting local LAN/WLAN traffic with wider-area WAN traffic that is usually slower and higher-latency.',
      'Can represent internet services such as DNS resolvers, public web platforms, or cloud-hosted applications.',
      'Supports discussion of cloud advantages such as scalability and remote access, and disadvantages such as latency, subscription cost, and internet dependence.',
    ],
    compare: [
      'Compare the internet as the transport network with the WWW as one service running over it.',
      'Compare local on-site servers with cloud services reached across a WAN.',
    ],
    caveat: 'This is a teaching abstraction for an ISP/public network rather than a full simulation of carrier infrastructure.',
  },
}

export function getLearningSnapshot(deviceType: DeviceType): LearningSnapshot {
  return DEVICE_LEARNING[deviceType]
}
