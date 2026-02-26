import { ShieldCheck, Cpu, Code2, Cloud, Database, Smartphone, Brain, Settings } from 'lucide-react';

export const domainDetails = {
    'Web Development': {
        icon: <Code2 size={40} color="#60A5FA" />,
        gradient: 'linear-gradient(135deg, rgba(96,165,250,0.1) 0%, rgba(96,165,250,0) 100%)',
        color: '#60A5FA',
        description: "Master the full stack from pixel-perfect frontends to robust cloud infrastructure. Follow a professional roadmap from HTML/CSS to AWS and DevOps.",
        difficulty: "Intermediate to Advanced",
        salary: "₹6L - ₹25L+ / Year",
        topics: [
            "Frontend Foundation (HTML, CSS, JS)",
            "Modern CSS & Frameworks (Tailwind, React)",
            "Version Control & Packages (Git, npm)",
            "Backend Mastery (Node.js, PostgreSQL)",
            "APIs & Security (REST, JWT Auth)",
            "Scalable Systems (Redis, Linux Basics)",
            "Cloud & DevOps (AWS, CI/CD, Terraform)"
        ],
        roles: ["Frontend Engineer", "Backend Developer", "Full Stack Developer", "DevOps Engineer"]
    },
    'Data Science': {
        icon: <Database size={40} color="#34D399" />,
        gradient: 'linear-gradient(135deg, rgba(52,211,153,0.1) 0%, rgba(52,211,153,0) 100%)',
        color: '#34D399',
        description: "Master the full spectrum of data intelligence. Follow an industry-standard path from advanced mathematics and statistics to elite machine learning, deep learning, and MLOps.",
        difficulty: "Advanced to Expert",
        salary: "₹8L - ₹30L+ / Year",
        topics: [
            "Mathematics (Linear Algebra, Calculus)",
            "Statistics (Probability, Hypothesis Testing)",
            "Econometrics (Regression, Time Series)",
            "Coding Mastery (Python, DSA, SQL)",
            "Exploratory Data Analysis (Pandas, Seaborn)",
            "Machine Learning (Classic & Advanced ML)",
            "Deep Learning (Transformers, Neural Nets)",
            "MLOps (Deployment & CI/CD)"
        ],
        roles: ["Data Scientist", "ML Engineer", "Data Engineer", "AI Researcher"]
    },
    'Cyber Security': {
        icon: <ShieldCheck size={40} color="#F87171" />,
        gradient: 'linear-gradient(135deg, rgba(248,113,113,0.1) 0%, rgba(248,113,113,0) 100%)',
        color: '#F87171',
        description: "Master the art of defense and penetration. Follow an industry-standard path from IT fundamentals and networking to elite ethical hacking and cloud security.",
        difficulty: "Advanced",
        salary: "₹7L - ₹25L+ / Year",
        topics: [
            "Fundamental IT Skills",
            "Operating Systems",
            "Virtualization",
            "Networking",
            "Security Skills & Concepts",
            "Cryptography",
            "Attacks & Exploits",
            "Incident Response",
            "Security Tools",
            "Digital Forensics",
            "SIEM / SOC",
            "Cloud Security",
            "Security Programming"
        ],
        roles: ["Security Analyst", "Penetration Tester", "Security Engineer", "Forensics Expert"]
    },
    'Mobile App Development': {
        icon: <Smartphone size={40} color="#FBBF24" />,
        gradient: 'linear-gradient(135deg, rgba(251,191,36,0.1) 0%, rgba(251,191,36,0) 100%)',
        color: '#FBBF24',
        description: "Master the art of building high-performance mobile experiences. Follow an elite Android-centric roadmap from Kotlin fundamentals to Jetpack Compose, MVVM architecture, and Play Store distribution.",
        difficulty: "Intermediate",
        salary: "₹6L - ₹20L+ / Year",
        topics: [
            "Android Fundamentals",
            "Version Control",
            "App Components",
            "Intents & Lifecycle",
            "Layouts & UI",
            "Navigation & Compose",
            "Storage & Databases",
            "Firebase & Services",
            "Architecture Patterns",
            "Networking",
            "Async Programming",
            "Testing & Debugging",
            "Dependency Injection",
            "Distribution & Play Store"
        ],
        roles: ["Android Developer", "Mobile Engineer", "App Architect", "Product Developer"]
    },
    'Artificial Intelligence': {
        icon: <Cpu size={40} color="#F472B6" />,
        gradient: 'linear-gradient(135deg, rgba(244,114,182,0.1) 0%, rgba(244,114,182,0) 100%)',
        color: '#F472B6',
        description: "Transition from a traditional developer to an elite AI Engineer. Master the art of building production-ready apps using LLMs, Prompt Engineering, Vector Databases, and RAG architectures.",
        difficulty: "Advanced",
        salary: "₹10L - ₹35L+ / Year",
        topics: [
            "Introduction to AI Engineering",
            "Using Pre-trained Models",
            "OpenAI Platform & API",
            "Other AI Model Providers",
            "Open Source AI & Hugging Face",
            "AI Safety & Ethics",
            "Embeddings",
            "Vector Databases",
            "Retrieval Augmented Generation (RAG)",
            "AI Agent Architectures (LangChain, LlamaIndex)",
            "Model Context Protocol (MCP)",
            "Multimodal AI"
        ],
        roles: ["AI Engineer", "LLM Specialist", "AI Solutions Architect", "RAG Developer"]
    },
    'AI & Data Science': {
        icon: <Brain size={40} color="#8B5CF6" />,
        gradient: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(139,92,246,0) 100%)',
        color: '#8B5CF6',
        description: "Comprehensive path combining the power of Data Science with Advanced AI architectures. Master the math, algorithms, and deployment of intelligent systems.",
        difficulty: "Intermediate to Advanced",
        salary: "₹7L - ₹30L+ / Year",
        topics: [
            "Mathematics",
            "Statistics",
            "Econometrics",
            "Python Coding",
            "Exploratory Data Analysis",
            "Machine Learning",
            "Deep Learning",
            "MLOps",
            "Natural Language Processing",
            "Computer Vision Basics"
        ],
        roles: ["AI Data Scientist", "ML Engineer", "Data Analyst", "AI Researcher"]
    },
    'DevOps': {
        icon: <Settings size={40} color="#818cf8" />,
        gradient: 'linear-gradient(135deg, rgba(129, 140, 248,0.1) 0%, rgba(129, 140, 248,0) 100%)',
        color: '#818cf8',
        description: "Master the bridge between development and operations. Learn CI/CD, Infrastructure as Code, Containers, and Cloud automation.",
        difficulty: "Professional",
        salary: "₹8L - ₹28L+ / Year",
        topics: [
            "Introduction to DevOps",
            "Operating Systems",
            "Linux Deep Dive",
            "Terminal & Bash Scripting",
            "Networking & Protocols",
            "Version Control & Git (Deep Dive)",
            "CI/CD Pipelines (Jenkins, GitHub Actions)",
            "Containerization with Docker",
            "Orchestration with Kubernetes",
            "Infrastructure as Code (Terraform, Ansible)",
            "Cloud Computing & Providers",
            "Monitoring & Logging (Prometheus, ELK)",
            "Advanced DevOps Concepts",
            "DevOps Interview Prep",
            "DevOps Real-World Projects",
            "DevSecOps"
        ],
        roles: ["DevOps Engineer", "SRE (Site Reliability Engineer)", "Cloud Architect", "Platform Engineer"]
    }
};

export const defaultDomain = {
    icon: <Code2 size={40} color="#818CF8" />,
    gradient: 'linear-gradient(135deg, rgba(129,140,248,0.1) 0%, rgba(129,140,248,0) 100%)',
    color: '#818CF8',
    description: "An excellent track chosen to elevate your career. Dive deep into specialized curriculum to master this field.",
    difficulty: "Varies",
    salary: "Industry Competitive",
    topics: ["Core Fundamentals", "Advanced Concepts", "Practical Application", "Project Building", "Interview Prep"],
    roles: ["Specialist", "Engineer", "Developer", "Consultant"]
};
