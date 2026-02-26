export const cnMcqs = [
    // Basics & Topology
    {
        q: "What does a computer network represent?",
        options: [
            "A single computer with multiple monitors",
            "An interconnection of multiple devices known as hosts to share data",
            "A network of cables without devices",
            "A standalone printer"
        ],
        ans: 1
    },
    {
        q: "In which topology are all nodes connected to a single central device?",
        options: ["Star topology", "Ring topology", "Bus topology", "Mesh topology"],
        ans: 0
    },
    {
        q: "Which topology connects every node individually to every other node?",
        options: ["Bus topology", "Mesh topology", "Star topology", "Ring topology"],
        ans: 1
    },
    {
        q: "What is Bandwidth in the context of computer networks?",
        options: [
            "The weight of the network cable",
            "The time taken to ping a server",
            "The data carrying capacity of the transmission medium",
            "The number of devices in a network"
        ],
        ans: 2
    },
    {
        q: "Which of the following describes a LAN?",
        options: [
            "A network spanning a large geographical area like a continent",
            "A private network that operates within a single building like a home or office",
            "A network built over the internet",
            "A network connecting multiple cities"
        ],
        ans: 1
    },
    {
        q: "What does VPN stand for?",
        options: [
            "Virtual Personal Network",
            "Visual Public Network",
            "Virtual Private Network",
            "Verified Protocol Network"
        ],
        ans: 2
    },
    {
        q: "What is an advantage of using a VPN?",
        options: [
            "It completely avoids the use of the internet.",
            "It encrypts the internet traffic and disguises online identity.",
            "It provides a physical connection to the remote office.",
            "It replaces the need for an ISP."
        ],
        ans: 1
    },

    // IP Addressing & DNS
    {
        q: "How many bits are in an IPv4 address?",
        options: ["16-bit", "32-bit", "64-bit", "128-bit"],
        ans: 1
    },
    {
        q: "Which of the following is true regarding IPv6?",
        options: [
            "IPv6 has a 32-bit address length.",
            "IPv6 address representation is in decimal.",
            "IPv6 has a 128-bit address length and is represented in hexadecimal.",
            "IPv6 does not provide encryption and authentication."
        ],
        ans: 2
    },
    {
        q: "What is a MAC address?",
        options: [
            "A unique 48-bit hardware number of a computer embedded in the NIC",
            "A logical address obtained from the network",
            "A protocol used to translate domain names",
            "An email address"
        ],
        ans: 0
    },
    {
        q: "Which of the following is a private IPv4 address?",
        options: ["8.8.8.8", "192.168.1.1", "172.64.0.1", "200.1.1.1"],
        ans: 1
    },
    {
        q: "What is the loopback address in IPv4?",
        options: ["10.0.0.1", "127.0.0.1", "192.168.0.1", "255.255.255.255"],
        ans: 1
    },
    {
        q: "What is the primary purpose of DNS?",
        options: [
            "To translate domain names to IP addresses",
            "To assign dynamic IP addresses to hosts",
            "To transfer files between clients",
            "To encrypt network traffic"
        ],
        ans: 0
    },

    // Protocols (HTTP, DHCP, ARP, etc.)
    {
        q: "Which application layer protocol helps web browsers and servers communicate over the WWW?",
        options: ["FTP", "SMTP", "HTTP", "DNS"],
        ans: 2
    },
    {
        q: "What is the default port for HTTPS?",
        options: ["21", "25", "80", "443"],
        ans: 3
    },
    {
        q: "What does the DHCP protocol do?",
        options: [
            "Encrypts web traffic",
            "Maps IP addresses to MAC addresses",
            "Auto-attributes IP addresses and network configurations to devices",
            "Transfers emails across servers"
        ],
        ans: 2
    },
    {
        q: "What is the function of the ARP protocol?",
        options: [
            "Auto-assigns IP addresses",
            "Converts logical IP addresses into physical MAC addresses",
            "Transfers files between clients",
            "Routes packets across different networks"
        ],
        ans: 1
    },
    {
        q: "Which protocol is primarily used to send emails?",
        options: ["HTTP", "FTP", "SMTP", "Telnet"],
        ans: 2
    },
    {
        q: "Which protocol is used for securely transferring files between a client and a server?",
        options: ["SFTP", "TFTP", "SNMP", "BOOTP"],
        ans: 0
    },
    {
        q: "What does ICMP do in a computer network?",
        options: [
            "Assigns IP addresses",
            "Handles error reporting and diagnostic tasks (like Ping)",
            "Translates URLs to IP addresses",
            "Transmits video streams"
        ],
        ans: 1
    },

    // OSI & TCP/IP Models
    {
        q: "How many layers are there in the OSI reference model?",
        options: ["4", "5", "6", "7"],
        ans: 3
    },
    {
        q: "Which layer in the OSI model is responsible for transferring raw bits over a communication channel?",
        options: ["Data Link Layer", "Physical Layer", "Network Layer", "Transport Layer"],
        ans: 1
    },
    {
        q: "Which layer transforms a raw transmission facility into a line that appears free of undetected transmission errors using frames?",
        options: ["Physical Layer", "Network Layer", "Data Link Layer", "Session Layer"],
        ans: 2
    },
    {
        q: "Which device operates primarily at the Network layer of the OSI model?",
        options: ["Hub", "Switch", "Router", "Repeater"],
        ans: 2
    },
    {
        q: "Which layer in the OSI model is responsible for end-to-end communication, segmentation, and reassembly?",
        options: ["Network Layer", "Transport Layer", "Presentation Layer", "Application Layer"],
        ans: 1
    },
    {
        q: "What is the main function of the Presentation layer?",
        options: [
            "Routing packets",
            "Establishing sessions",
            "Data translation, encryption, and compression",
            "Accessing the network media"
        ],
        ans: 2
    },
    {
        q: "The TCP/IP model consists of how many layers?",
        options: ["4", "5", "6", "7"],
        ans: 0
    },

    // Transport Layer & TCP/UDP
    {
        q: "Which of the following is true about TCP (Transmission Control Protocol)?",
        options: [
            "It is a connectionless protocol.",
            "It is a connection-oriented, reliable protocol.",
            "It does not perform error checking.",
            "It is faster than UDP for streaming media."
        ],
        ans: 1
    },
    {
        q: "How does TCP establish a reliable connection?",
        options: [
            "Through a 2-way handshake",
            "Through a 3-way handshake (SYN, SYN-ACK, ACK)",
            "Through a 4-way termination process",
            "By broadcasting connection requests"
        ],
        ans: 1
    },
    {
        q: "Which transport protocol is considered connectionless, faster, but less reliable?",
        options: ["TCP", "IP", "UDP", "ARP"],
        ans: 2
    },
    {
        q: "What happens in the third step of a TCP 3-way handshake?",
        options: [
            "The client sends a SYN packet to the server.",
            "The server sends a SYN-ACK packet to the client.",
            "The client sends an ACK packet back to the server.",
            "The server tears down the connection."
        ],
        ans: 2
    },
    {
        q: "Which protocol is mostly used for real-time video streaming or online gaming?",
        options: ["TCP", "UDP", "HTTP", "FTP"],
        ans: 1
    },

    // Networking Devices
    {
        q: "What is the difference between a hub and a switch?",
        options: [
            "A hub operates at the Network Layer, a switch at the Physical Layer.",
            "A hub acts as a multiport repeater sending traffic everywhere; a switch intelligently forwards frames to specific ports.",
            "A hub is wireless, a switch is wired.",
            "There is no difference between them."
        ],
        ans: 1
    },
    {
        q: "What is the primary function of a Router?",
        options: [
            "To translate digital signals to analog",
            "To connect two or more network segments and determine the best path for data transfer",
            "To provide power to network cables",
            "To convert domain names to IP addresses"
        ],
        ans: 1
    },
    {
        q: "What is the purpose of a Firewall?",
        options: [
            "To accelerate network speed",
            "To act as a physical barrier against fire in data centers",
            "To monitor and control incoming and outgoing network traffic based on security rules",
            "To assign IP addresses to new devices"
        ],
        ans: 2
    },
    {
        q: "What is a gateway?",
        options: [
            "A cable that connects to the internet",
            "A node configured to connect different networks, often serving as an entrance to another network",
            "A type of wireless router",
            "An antivirus software"
        ],
        ans: 1
    },

    // Subnetting, MAC, & Concepts
    {
        q: "What is a subnet mask used for?",
        options: [
            "To hide the IP address from hackers",
            "To determine what subnet an IP address belongs to by dividing the IP into network and host parts",
            "To encrypt the data payload",
            "To increase the bandwidth of the network"
        ],
        ans: 1
    },
    {
        q: "What is the difference between Unicasting and Multicasting?",
        options: [
            "Unicasting is 1-to-1 communication; Multicasting is sending to a specific subset of nodes (1-to-Many).",
            "Multicasting is 1-to-1 communication; Unicasting is sending to all nodes.",
            "Both mean sending data to all devices on the network.",
            "Unicasting requires cables; Multicasting requires wireless."
        ],
        ans: 0
    },
    {
        q: "What command-line tool traces the route taken by data from the router to the destination network?",
        options: ["ping", "ipconfig", "tracert / traceroute", "netstat"],
        ans: 2
    },
    {
        q: "What is the utility of the 'ping' command?",
        options: [
            "To download files",
            "To check connectivity between network devices using ICMP echo requests",
            "To resolve DNS names securely",
            "To view the routing table"
        ],
        ans: 1
    },
    {
        q: "What does NAT (Network Address Translation) do?",
        options: [
            "Translates MAC addresses into IP addresses",
            "Translates Domain Names into IP addresses",
            "Allows multiple computers on a private network to share a single public IP connection",
            "Secures a computer from viruses"
        ],
        ans: 2
    },
    {
        q: "What is 'IP spoofing'?",
        options: [
            "A technique to increase internet speed",
            "A technique to change the subnet mask dynamically",
            "A hacking technique where IP packets are created with a forged source IP address to conceal identity",
            "A method of compressing IP packets"
        ],
        ans: 2
    },
    {
        q: "What does 'Jitter' refer to in networking?",
        options: [
            "A consistent delay in packet delivery",
            "A variance in packet delay, meaning packets face different delays arriving out of order",
            "A type of physical layer cable",
            "A routing protocol error"
        ],
        ans: 1
    },

    // Security & Wi-Fi
    {
        q: "Which triad defines the core principles of information security?",
        options: [
            "Confidentiality, Integrity, & Availability (CIA)",
            "Authentication, Authorization, & Accounting (AAA)",
            "Privacy, Security, & Trust (PST)",
            "TCP, UDP, & IP"
        ],
        ans: 0
    },
    {
        q: "What is the difference between Symmetric and Asymmetric encryption?",
        options: [
            "Symmetric encryption uses different keys; Asymmetric uses the same key.",
            "Symmetric encryption uses the same key to encrypt and decrypt; Asymmetric uses a public-private key pair.",
            "There is no difference between the two.",
            "Symmetric is only for text; Asymmetric is for images."
        ],
        ans: 1
    },
    {
        q: "What specifies the difference between a straight-through and crossover cable?",
        options: [
            "Straight-through connects similar devices (PC to PC); crossover connects PC to Switch.",
            "Straight-through connects devices like PC to Switch; crossover connects similar devices like PC to PC.",
            "Straight-through is fiber optic; crossover is copper.",
            "Crossover is much faster than straight-through."
        ],
        ans: 1
    },
    {
        q: "What is a major advantage of Fiber Optic cables over copper twisted-pair cables?",
        options: [
            "They are much heavier and cheaper.",
            "They are extremely susceptible to electromagnetic interference.",
            "They support much higher bandwidth over longer distances and are resistant to electromagnetic interference.",
            "They carry electricity much better."
        ],
        ans: 2
    },
    {
        q: "What does Wi-Fi stand for?",
        options: ["Wireless Fiber", "Wireless Fidelity", "Wide Firewall", "Wired Filter"],
        ans: 1
    },
    {
        q: "What is the standard data termination rate for UTP (Unshielded Twisted Pair) cables?",
        options: ["10 ohms", "50 ohms", "100 ohms", "150 ohms"],
        ans: 2
    },
    {
        q: "Which of the following describes a 'Socket' in networking?",
        options: [
            "The physical wall port where you plug in a LAN cable",
            "One endpoint of a two-way communication link between two programs, bound to a port number",
            "A type of routing protocol",
            "The CPU of a router"
        ],
        ans: 1
    }
];
