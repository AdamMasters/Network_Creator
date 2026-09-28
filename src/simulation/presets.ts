import type { NetNode, NetEdge, NodeData, DeviceType, Level } from '../types'

function mac(s: string): string { return s } // fixed MACs for presets

function node(
  id: string,
  deviceType: DeviceType,
  label: string,
  ip: string,
  position: { x: number; y: number },
  extra: Partial<NodeData> = {},
): NetNode {
  return {
    id,
    type: 'device',
    position,
    data: {
      label,
      deviceType,
      ip,
      wanIp: '',
      subnet: ['switch', 'hub', 'cloud'].includes(deviceType) ? '' : '255.255.255.0',
      gateway: ['switch', 'hub', 'cloud', 'router', 'gateway'].includes(deviceType) ? '' : ip.replace(/\.\d+$/, '.1'),
      mac: mac(`aa:bb:cc:dd:${id.slice(-2).padStart(2, '0')}:01`),
      isOn: true,
      routingTable: [],
      dhcpEnabled: false,
      dhcpPool: '100-200',
      macTable: [],
      ssid: 'NetworX-WiFi',
      wpaKey: 'password123',
      band: '2.4GHz',
      rules: [],
      dnsRecords: [],
      pageContent: deviceType === 'web'
        ? `<!DOCTYPE html>\n<html>\n<head>\n  <title>${label}</title>\n</head>\n<body>\n  <h1>Welcome to ${label}</h1>\n  <p>This page is served from <strong>${ip}</strong>.</p>\n  <p>Edit this content in the Configure panel &rarr; Page tab.</p>\n</body>\n</html>`
        : '',
      termHistory: [],
      notes: '',
      ...extra,
    },
  }
}

function edge(id: string, source: string, target: string, wireless = false): NetEdge {
  return {
    id,
    source,
    target,
    animated: wireless,
    style: wireless
      ? { stroke: '#6366f1', strokeDasharray: '6 3' }
      : { stroke: '#374151' },
    label: wireless ? 'Wi-Fi' : undefined,
  }
}

export interface Preset {
  id: string
  name: string
  description: string
  level: Level
  focus: string[]
  nodes: NetNode[]
  edges: NetEdge[]
}

// ─── 1. Simple Star (LAN only) ───────────────────────────────────────────────

const starLan: Preset = {
  id: 'star-lan',
  name: 'Star Topology (LAN)',
  description: 'Classic star topology: a central switch connecting four workstations. Good for exploring LAN basics, switch MAC tables, and ping.',
  level: 'ks3',
  focus: ['LAN', 'switching', 'Ethernet'],
  nodes: [
    node('sw1',  'switch', 'Switch',  '',              { x: 320, y: 240 }),
    node('pc1',  'pc',     'PC 1',    '192.168.1.11',  { x: 120, y: 80  }),
    node('pc2',  'pc',     'PC 2',    '192.168.1.12',  { x: 520, y: 80  }),
    node('pc3',  'pc',     'PC 3',    '192.168.1.13',  { x: 120, y: 380 }),
    node('pc4',  'pc',     'PC 4',    '192.168.1.14',  { x: 520, y: 380 }),
  ],
  edges: [
    edge('e1', 'sw1', 'pc1'),
    edge('e2', 'sw1', 'pc2'),
    edge('e3', 'sw1', 'pc3'),
    edge('e4', 'sw1', 'pc4'),
  ],
}

// ─── 2. Home Network ─────────────────────────────────────────────────────────

const homeNetwork: Preset = {
  id: 'home-network',
  name: 'Home Network',
  description: 'Typical home broadband setup: ISP → Domestic Gateway (combined router, switch, WAP and firewall) → wired PCs and wireless laptop.',
  level: 'ks4',
  focus: ['WLAN', 'DHCP', 'gateway'],
  nodes: [
    node('cloud1',   'cloud',    'Internet',       '0.0.0.0',       { x: 20,  y: 230 },
      { notes: 'Represents your ISP and the public internet.' }),
    node('gw1',      'gateway',  'Home Gateway',   '192.168.1.1',   { x: 240, y: 230 },
      { wanIp: '82.1.2.3',
        routingTable: [
          { destination: '0.0.0.0',     subnet: '0.0.0.0',       gateway: '0.0.0.0', iface: 'eth0', metric: 0 },
          { destination: '192.168.1.0', subnet: '255.255.255.0', gateway: '0.0.0.0', iface: 'eth1', metric: 0 },
        ],
        dhcpEnabled: true,
        dhcpPool: '100-200',
        ssid: 'HomeNet-5G',
        wpaKey: 'supersecret',
        band: '5GHz',
        rules: [
          { id: 'r1', direction: 'in', protocol: 'TCP', srcIp: '*', dstIp: '*', port: '80',  action: 'allow' },
          { id: 'r2', direction: 'in', protocol: 'ANY', srcIp: '*', dstIp: '*', port: '*',   action: 'deny'  },
        ],
        notes: 'The box from your ISP. Combines router (NAT), switch (wired ports), Wi-Fi access point, and basic firewall in one unit. DHCP assigns IPs 192.168.1.100–200 to clients.' }),
    node('pc1',      'pc',       'Desktop PC',     '192.168.1.11',  { x: 500, y: 100 }),
    node('pc2',      'pc',       'Work PC',        '192.168.1.12',  { x: 500, y: 260 }),
    node('laptop1',  'laptop',   'Laptop',         '192.168.1.20',  { x: 500, y: 400 },
      { notes: 'Connected wirelessly to HomeNet-5G' }),
  ],
  edges: [
    edge('e1', 'cloud1', 'gw1'),
    edge('e2', 'gw1',    'pc1'),
    edge('e3', 'gw1',    'pc2'),
    edge('e4', 'gw1',    'laptop1', true),
  ],
}

// ─── 3. School Network ───────────────────────────────────────────────────────

const schoolNetwork: Preset = {
  id: 'school-network',
  name: 'School Network',
  description: 'School infrastructure: Internet → Firewall → Router → Core switch → servers + classroom switch + WAP. Demonstrates network segmentation and security.',
  level: 'ks4',
  focus: ['firewall', 'servers', 'segmentation'],
  nodes: [
    node('cloud1',  'cloud',    'Internet',       '0.0.0.0',        { x: 20,  y: 330 }),
    node('fw1',     'firewall', 'Firewall',       '10.0.0.1',       { x: 200, y: 330 },
      { rules: [
          { id: 'r1', direction: 'in', protocol: 'TCP', srcIp: '*', dstIp: '*', port: '80',  action: 'allow' },
          { id: 'r2', direction: 'in', protocol: 'TCP', srcIp: '*', dstIp: '*', port: '443', action: 'allow' },
          { id: 'r3', direction: 'in', protocol: 'TCP', srcIp: '*', dstIp: '*', port: '22',  action: 'deny'  },
          { id: 'r4', direction: 'in', protocol: 'ANY', srcIp: '*', dstIp: '*', port: '*',   action: 'deny'  },
        ] }),
    node('router1', 'router',   'Core Router',    '192.168.0.1',    { x: 390, y: 330 },
      { wanIp: '10.0.0.2',
        routingTable: [
          { destination: '0.0.0.0',     subnet: '0.0.0.0',       gateway: '10.0.0.1',    iface: 'eth0', metric: 0 },
          { destination: '192.168.0.0', subnet: '255.255.255.0', gateway: '0.0.0.0',     iface: 'eth1', metric: 0 },
        ],
        dhcpEnabled: true,
        dhcpPool: '100-200' }),
    node('sw-core', 'switch',   'Core Switch',    '',               { x: 580, y: 330 }),
    node('srv1',    'server',   'File Server',    '192.168.0.10',   { x: 780, y: 120 },
      { notes: 'Central file storage for the school. Accessible to all on the LAN.' }),
    node('dns1',    'dns',      'DNS Server',     '192.168.0.53',   { x: 780, y: 230 },
      { dnsRecords: [
          { id: 'dr1', hostname: 'www.school.local',      ip: '192.168.0.80'  },
          { id: 'dr2', hostname: 'files.school.local',    ip: '192.168.0.10'  },
          { id: 'dr3', hostname: 'intranet.school.local', ip: '192.168.0.80'  },
        ] }),
    node('web1',    'web',      'Web Server',     '192.168.0.80',   { x: 780, y: 340 }),
    node('sw-cls',  'switch',   'Classroom Switch','',              { x: 780, y: 460 }),
    node('wap1',    'wap',      'Wi-Fi AP',       '192.168.0.200',  { x: 780, y: 570 },
      { ssid: 'School-WiFi', wpaKey: 'education2024', band: '5GHz' }),
    node('pc1',     'pc',       'Teacher PC',     '192.168.0.101',  { x: 990, y: 400 }),
    node('pc2',     'pc',       'Student PC 1',   '192.168.0.102',  { x: 990, y: 500 }),
    node('laptop1', 'laptop',   'Student Laptop', '192.168.0.151',  { x: 990, y: 600 },
      { notes: 'Connects wirelessly to School-WiFi' }),
  ],
  edges: [
    edge('e1',  'cloud1',  'fw1'),
    edge('e2',  'fw1',     'router1'),
    edge('e3',  'router1', 'sw-core'),
    edge('e4',  'sw-core', 'srv1'),
    edge('e5',  'sw-core', 'dns1'),
    edge('e6',  'sw-core', 'web1'),
    edge('e7',  'sw-core', 'sw-cls'),
    edge('e8',  'sw-cls',  'wap1'),
    edge('e9',  'sw-cls',  'pc1'),
    edge('e10', 'sw-cls',  'pc2'),
    edge('e11', 'wap1',    'laptop1', true),
  ],
}

// ─── 4. Client-Server ────────────────────────────────────────────────────────

const clientServer: Preset = {
  id: 'client-server',
  name: 'Client-Server Model',
  description: 'A web server and DNS server on a LAN, with three client PCs. Try nslookup and curl from a PC terminal.',
  level: 'ks4',
  focus: ['client-server', 'DNS', 'WWW'],
  nodes: [
    node('sw1',   'switch', 'Switch',      '',              { x: 320, y: 280 }),
    node('dns1',  'dns',    'DNS Server',  '192.168.1.53',  { x: 100, y: 100 },
      { notes: 'Resolves domain names to IP addresses. Try: nslookup www.local',
        dnsRecords: [
          { id: 'dr1', hostname: 'www.local',  ip: '192.168.1.80' },
          { id: 'dr2', hostname: 'web.local',  ip: '192.168.1.80' },
        ] }),
    node('web1',  'web',    'Web Server',  '192.168.1.80',  { x: 540, y: 100 },
      { notes: 'Serves HTTP pages on port 80. Try: curl www.local from a PC terminal.' }),
    node('pc1',   'pc',     'Client 1',   '192.168.1.11',  { x: 100, y: 420 }),
    node('pc2',   'pc',     'Client 2',   '192.168.1.12',  { x: 320, y: 460 }),
    node('pc3',   'pc',     'Client 3',   '192.168.1.13',  { x: 540, y: 420 }),
  ],
  edges: [
    edge('e1', 'sw1', 'dns1'),
    edge('e2', 'sw1', 'web1'),
    edge('e3', 'sw1', 'pc1'),
    edge('e4', 'sw1', 'pc2'),
    edge('e5', 'sw1', 'pc3'),
  ],
}

// ─── 5. Mesh / Internet backbone ─────────────────────────────────────────────

const meshNetwork: Preset = {
  id: 'mesh-network',
  name: 'Mesh / WAN Topology',
  description: 'Three sites connected via routers with redundant paths — like the internet backbone. Shows how packets can take multiple routes.',
  level: 'ks5',
  focus: ['WAN', 'routing', 'redundancy'],
  nodes: [
    node('cloud1',   'cloud',  'Internet',       '0.0.0.0',       { x: 320, y: 30  }),
    // Site A
    node('routerA',  'router', 'Router A',       '10.1.0.1',      { x: 80,  y: 200 },
      { wanIp: '172.16.0.1', notes: 'Site A gateway. Connected to Site B and C routers, and to the internet.' }),
    node('swA',      'switch', 'Switch A',       '',              { x: 80,  y: 360 }),
    node('pcA1',     'pc',     'PC A1',          '10.1.0.11',     { x: -80, y: 460 }),
    node('pcA2',     'pc',     'PC A2',          '10.1.0.12',     { x: 80,  y: 480 }),
    // Site B
    node('routerB',  'router', 'Router B',       '10.2.0.1',      { x: 320, y: 200 },
      { wanIp: '172.16.0.2', notes: 'Site B gateway — central hub. Connected to all other routers.' }),
    node('swB',      'switch', 'Switch B',       '',              { x: 320, y: 360 }),
    node('srvB',     'server', 'Server B',       '10.2.0.10',     { x: 220, y: 480 }),
    node('pcB1',     'pc',     'PC B1',          '10.2.0.11',     { x: 420, y: 480 }),
    // Site C
    node('routerC',  'router', 'Router C',       '10.3.0.1',      { x: 560, y: 200 },
      { wanIp: '172.16.0.3', notes: 'Site C gateway. Multiple paths to reach other sites — demonstrates redundancy.' }),
    node('swC',      'switch', 'Switch C',       '',              { x: 560, y: 360 }),
    node('pcC1',     'pc',     'PC C1',          '10.3.0.11',     { x: 460, y: 480 }),
    node('pcC2',     'pc',     'PC C2',          '10.3.0.12',     { x: 660, y: 480 }),
  ],
  edges: [
    // Internet links
    edge('ei1', 'cloud1',  'routerA'),
    edge('ei2', 'cloud1',  'routerB'),
    edge('ei3', 'cloud1',  'routerC'),
    // Inter-router (mesh) links
    edge('er1', 'routerA', 'routerB'),
    edge('er2', 'routerB', 'routerC'),
    edge('er3', 'routerA', 'routerC'),
    // LAN links
    edge('ea1', 'routerA', 'swA'),
    edge('ea2', 'swA',     'pcA1'),
    edge('ea3', 'swA',     'pcA2'),
    edge('eb1', 'routerB', 'swB'),
    edge('eb2', 'swB',     'srvB'),
    edge('eb3', 'swB',     'pcB1'),
    edge('ec1', 'routerC', 'swC'),
    edge('ec2', 'swC',     'pcC1'),
    edge('ec3', 'swC',     'pcC2'),
  ],
}

// ─── 6. Shopping centre / multi-area infrastructure ────────────────────────────

const shoppingCentreNetwork: Preset = {
  id: 'shopping-centre-network',
  name: 'Shopping Centre Infrastructure',
  description: 'A multi-area retail network linking management offices, shops, guest Wi-Fi, CCTV, and an internet-facing portal. Useful for recommending and justifying hardware across a larger site.',
  level: 'ks5',
  focus: ['hardware roles', 'LAN/WAN', 'wireless'],
  nodes: [
    node('cloud1',   'cloud',    'Internet / Cloud',      '0.0.0.0',      { x: 20,  y: 320 },
      { notes: 'Represents the ISP, internet services, and cloud-hosted platforms. Use it to discuss WAN access, cloud advantages, and the difference between the internet and the web.' }),
    node('fw1',      'firewall', 'Perimeter Firewall',    '172.20.0.1',   { x: 190, y: 320 },
      { rules: [
          { id: 'r1', direction: 'in', protocol: 'TCP', srcIp: '*', dstIp: '*', port: '80',  action: 'allow' },
          { id: 'r2', direction: 'in', protocol: 'TCP', srcIp: '*', dstIp: '*', port: '443', action: 'allow' },
          { id: 'r3', direction: 'in', protocol: 'ANY', srcIp: '*', dstIp: '*', port: '*',   action: 'deny' },
        ],
        notes: 'Filters public traffic before it reaches the centre. A realistic design would often place public services behind stricter DMZ controls.' }),
    node('router1',  'router',   'Centre Router',         '10.50.0.1',    { x: 370, y: 320 },
      { wanIp: '172.20.0.2',
        routingTable: [
          { destination: '0.0.0.0',     subnet: '0.0.0.0',       gateway: '172.20.0.1', iface: 'eth0', metric: 0 },
          { destination: '10.50.0.0',   subnet: '255.255.255.0', gateway: '0.0.0.0',    iface: 'eth1', metric: 0 },
          { destination: '10.50.10.0',  subnet: '255.255.255.0', gateway: '0.0.0.0',    iface: 'eth2', metric: 1 },
          { destination: '10.50.20.0',  subnet: '255.255.255.0', gateway: '0.0.0.0',    iface: 'eth3', metric: 1 },
        ],
        dhcpEnabled: true,
        dhcpPool: '100-200',
        notes: 'Acts as the default gateway between local LANs and the WAN. Learners can justify routers here because traffic must move between different network areas and out to the internet.' }),
    node('sw-core',  'switch',   'Core Switch',           '',             { x: 560, y: 320 },
      { notes: 'High-capacity wired backbone for the shopping centre. Good for discussing why switches suit fast local LAN links.' }),
    node('dns1',     'dns',      'DNS Server',            '10.50.0.53',   { x: 780, y: 100 },
      { dnsRecords: [
          { id: 'dr1', hostname: 'portal.mall.local',    ip: '10.50.0.80' },
          { id: 'dr2', hostname: 'stock.mall.local',     ip: '10.50.0.20' },
          { id: 'dr3', hostname: 'helpdesk.mall.local',  ip: '10.50.0.30' },
        ],
        notes: 'Internal DNS helps staff reach services by name. Use this node to explain hostname-to-IP resolution and the difference between IPs, URLs, and MAC addresses.' }),
    node('web1',     'web',      'Mall Portal',           '10.50.0.80',   { x: 980, y: 100 },
      { notes: 'Represents a web platform used for public information or tenant services. Useful for discussing the WWW as one service that runs over the wider internet.' }),
    node('srv1',     'server',   'Stock Server',          '10.50.0.20',   { x: 780, y: 220 },
      { notes: 'Central stock and reporting system used by staff and shop systems. A dedicated server demonstrates client-server networking and why reliable wired links matter.' }),
    node('pc-mgr',   'pc',       'Management PC',         '10.50.0.101',  { x: 980, y: 220 },
      { notes: 'Office client for management staff. A good place to run ping, nslookup, curl, and discuss client-server access to shared services.' }),
    node('sw-retail','switch',   'Retail Switch',         '',             { x: 780, y: 390 },
      { notes: 'Local switch for shop tills and service desks. Wired links suit payment and stock devices because they are reliable and low-latency.' }),
    node('pc-pos1',  'pc',       'Shop POS 1',            '10.50.10.11',  { x: 980, y: 340 },
      { notes: 'Represents a point-of-sale terminal. Learners can justify wired Ethernet for payment devices where stability matters more than mobility.' }),
    node('pc-pos2',  'pc',       'Shop POS 2',            '10.50.10.12',  { x: 980, y: 430 },
      { notes: 'A second POS terminal for comparing client needs in different retail areas.' }),
    node('wap1',     'wap',      'Guest Wi-Fi AP',        '10.50.20.2',   { x: 780, y: 560 },
      { ssid: 'Mall-Guest',
        wpaKey: 'visit-the-mall',
        band: '5GHz',
        notes: 'Provides WLAN access for visitors and roaming staff devices. Use it to compare Ethernet with Wi-Fi and discuss interference, congestion, and range.' }),
    node('laptop1',  'laptop',   'Guest Laptop',          '10.50.20.51',  { x: 980, y: 560 },
      { notes: 'Mobile client for exploring WLAN use, URL browsing, and the trade-offs of wireless access.' }),
  ],
  edges: [
    edge('e1',  'cloud1',    'fw1'),
    edge('e2',  'fw1',       'router1'),
    edge('e3',  'router1',   'sw-core'),
    edge('e4',  'sw-core',   'dns1'),
    edge('e5',  'sw-core',   'web1'),
    edge('e6',  'sw-core',   'srv1'),
    edge('e7',  'sw-core',   'pc-mgr'),
    edge('e8',  'sw-core',   'sw-retail'),
    edge('e9',  'sw-retail', 'pc-pos1'),
    edge('e10', 'sw-retail', 'pc-pos2'),
    edge('e11', 'sw-core',   'wap1'),
    edge('e12', 'wap1',      'laptop1', true),
  ],
}

export const PRESETS: Preset[] = [
  starLan,
  homeNetwork,
  schoolNetwork,
  clientServer,
  meshNetwork,
  shoppingCentreNetwork,
]
