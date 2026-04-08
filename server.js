const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, './')));

const pricingData = {
    "1": {
        title: "Server Maintenance",
        icon: "fa-server",
        shortDesc: "Ensure 24/7 uptime and peak performance for your business-critical servers with our proactive monitoring and rapid-response support.",
        detailedDesc: "Your infrastructure is the backbone of your business. Our server maintenance services provide comprehensive oversight, including security patching, performance optimization, and hardware health checks to prevent downtime before it occurs. We handle both on-premise and cloud environments (AWS, Google Cloud) with enterprise-grade reliability.",
        inclusions: [
            "24/7 Real-time Monitoring & Alerting",
            "Security Patching & Kernel Updates",
            "Performance Tuning & Optimization",
            "Automated Backup & Disaster Recovery",
            "Hardware Health Diagnostics"
        ],
        pricing: [
            { label: "Basic Support", value: "Rs. 5,000 / mo" },
            { label: "Enterprise Managed", value: "Rs. 25,000+ / mo" }
        ],
        whyUs: [
            "Certified Infrastructure Experts",
            "Proactive Threat Prevention",
            "Guaranteed 99.9% Uptime SLA"
        ],
        specialOffer: "🔥 FREE Infrastructure Audit and Security Scan for first-time monthly subscribers.",
        isMainIncome: true,
        phones: ["0701505427", "0777271735"]
    },
    "2": {
        title: "Backend Support",
        icon: "fa-database",
        shortDesc: "Scale your applications with robust backend architecture, database optimization, and secure API management solutions.",
        detailedDesc: "We specialize in building and maintaining the invisible engine that powers your frontend. From MongoDB/MySQL optimization to complex server-side logic in Node.js or Python, we ensure your backend is fast, secure, and ready to handle thousands of concurrent users.",
        inclusions: [
            "API Architecture & Development",
            "Database Design & Optimization",
            "Server-side Logic Implementation",
            "Legacy System Migration",
            "Middleware & Integration Services"
        ],
        pricing: [
            { label: "Small Projects", value: "Rs. 15,000 – 35,000" },
            { label: "Monthly Maintenance", value: "Rs. 8,000 / mo" }
        ],
        whyUs: [
            "Security-First Coding Standards",
            "Expertise in High-Traffic Systems",
            "Seamless Third-party Integrations"
        ],
        specialOffer: "🔥 20% Discount on first API integration for new business clients.",
        isMainIncome: false,
        phones: ["0701505427", "0777271735"]
    },
    "3": {
        title: "Web Development",
        icon: "fa-code",
        shortDesc: "Transform your digital presence with modern, responsive, and SEO-ready websites designed to convert visitors into customers.",
        detailedDesc: "We build more than just websites; we build business tools. Our web development team focuses on creating high-performance digital experiences using the latest frameworks like Next.js and MERN stack. Every site we build is mobile-responsive, lightning-fast, and optimized for search engine visibility.",
        inclusions: [
            "Custom Corporate Websites",
            "Full E-commerce (Shopify/WooCommerce)",
            "Responsive UI/UX Design",
            "Progressive Web Apps (PWA)",
            "CMS Integration (WordPress/Ghost)"
        ],
        pricing: [
            { label: "Startup Package", value: "Rs. 25,000 – 50,000" },
            { label: "Business Pro", value: "Rs. 50,000 – 120,000" },
            { label: "Custom Enterprise", value: "Rs. 150,000+" }
        ],
        whyUs: [
            "Modern Framework Expertise",
            "SEO-ready from day one",
            "Dedicated Post-launch Support"
        ],
        specialOffer: "🔥 FREE 1-Year Premium Hosting & SSL certificate with every Business Pro package launch.",
        isMainIncome: true,
        phones: ["0701505427", "0777271735"]
    },
    "4": {
        title: "Mobile App Development",
        icon: "fa-mobile-alt",
        shortDesc: "Reach your audience anywhere with feature-rich native and cross-platform mobile applications for iOS and Android.",
        detailedDesc: "From ideation to App Store launch, we handle the entire mobile lifecycle. Our developers use Flutter and React Native to deliver apps that feel native and perform perfectly on both iOS and Android platforms. We focus on intuitive navigation and seamless user experiences.",
        inclusions: [
            "Native iOS & Android Development",
            "Cross-Platform Solutions (Flutter)",
            "Intuitive Mobile UX Design",
            "App Store & Play Store Publishing",
            "Push Notification Integration"
        ],
        pricing: [
            { label: "MVP MVP (Single Platform)", value: "Rs. 100,000+" },
            { label: "Full Cross-Platform App", value: "Rs. 250,000+" }
        ],
        whyUs: [
            "Expert User-Centric Design",
            "High-Performance Native Speed",
            "Maintenance & Update Support"
        ],
        specialOffer: "🔥 Get a FREE Mobile UI Prototype for your app idea this month.",
        isMainIncome: false,
        phones: ["0701505427", "0777271735"]
    },
    "5": {
        title: "UI/UX Design",
        icon: "fa-paint-brush",
        shortDesc: "Craft intuitive user experiences and stunning visual interfaces that delight your users and elevate your brand.",
        detailedDesc: "Design is not just how it looks; it is how it works. Our UI/UX team conducts user research and wireframing to create layouts that are both beautiful and functional. We ensure every interaction is meaningful and every screen drive user action.",
        inclusions: [
            "User Research & Wireframing",
            "High-Fidelity UI Mockups",
            "Interactive Prototypes",
            "Brand Identity & Logo Design",
            "Usability Testing"
        ],
        pricing: [
            { label: "Per Screen Design", value: "Rs. 3,500" },
            { label: "Full Project Design", value: "Rs. 35,000+" }
        ],
        whyUs: [
            "Design-Thinking Methodology",
            "Modern Minimalist Aesthetics",
            "Developer-Ready Assets"
        ],
        specialOffer: "🔥 FREE Homepage UI Redesign consultation for existing businesses.",
        isMainIncome: false,
        phones: ["0701505427", "0777271735"]
    },
    "6": {
        title: "Software Development",
        icon: "fa-cogs",
        shortDesc: "Solve complex business challenges with custom-built software solutions tailored specifically to your operational needs.",
        detailedDesc: "Whether it is an ERP system, a CRM, or a unique automation tool, we develop custom software that integrates perfectly with your business processes. Our goal is to improve efficiency and ROI through intelligent software architecture and reliable performance.",
        inclusions: [
            "Custom Business Automation",
            "ERP & CRM Development",
            "Desktop Application (Windows/Mac)",
            "Legacy Software Modernization",
            "Quality Assurance & Testing"
        ],
        pricing: [
            { label: "Consultation & Requirement Analysis", value: "FREE" },
            { label: "Custom Project Development", value: "Request Quote" }
        ],
        whyUs: [
            "Custom-Tailored Solutions",
            "Agile Development Process",
            "Lifetime Security Support"
        ],
        specialOffer: "🔥 FREE Technology Roadmap & Strategy Document for all new enterprise software queries.",
        isMainIncome: false,
        phones: ["0701505427", "0777271735"]
    },
    "7": {
        title: "Digital Marketing",
        icon: "fa-megaphone",
        shortDesc: "Grow your brand and increase your sales with data-driven marketing strategies that reach the right audience at the right time.",
        detailedDesc: "Our digital marketing services are focused on measurable results. We combine Social Media Management, Content Strategy, and Search Engine Marketing to put your brand in front of potential customers and drive conversion through targeted campaigns.",
        inclusions: [
            "Social Media Management",
            "Facebook & Instagram Ads",
            "Content Marketing & Copywriting",
            "Email Marketing Campaigns",
            "Brand Positioning Strategy"
        ],
        pricing: [
            { label: "Ad Campaign Management", value: "Starting Rs. 15,000 / mo" },
            { label: "Full Growth Package", value: "Starting Rs. 45,000 / mo" }
        ],
        whyUs: [
            "Data-Driven ROI Focus",
            "Targeted Local Reach",
            "Creative Campaign Content"
        ],
        specialOffer: "🔥 FREE Social Media Audit and 30-Day Content Plan for new annual clients.",
        isMainIncome: false,
        phones: ["0701505427", "0777271735"]
    },
    "8": {
        title: "Cloud Solutions",
        icon: "fa-cloud",
        shortDesc: "Future-proof your business by migrating to secure, scalable, and cost-effective cloud infrastructure on AWS, Azure, or Google Cloud.",
        detailedDesc: "Cloud technology allows for unprecedented flexibility. We help you move your data and applications to the cloud, ensuring high availability and robust security. Our specialists optimize your cloud spending so you only pay for what you truly need.",
        inclusions: [
            "Cloud Migration Strategy",
            "Serverless Architecture (Lambda)",
            "Cloud Security Audits",
            "Automated Cloud Backups",
            "Multi-cloud Management"
        ],
        pricing: [
            { label: "Migration Assessment", value: "Rs. 8,000" },
            { label: "Full Infrastructure Setup", value: "Starting Rs. 35,000" }
        ],
        whyUs: [
            "Certified Cloud Architects",
            "Cost-Optimization Experts",
            "Seamless Zero-Downtime Migrations"
        ],
        specialOffer: "🔥 FREE Cloud Cost Analysis Report - save up to 30% on your monthly bill.",
        isMainIncome: false,
        phones: ["0701505427", "0777271735"]
    },
    "9": {
        title: "IT Support",
        icon: "fa-headset",
        shortDesc: "End-to-end technical assistance for your daily business operations, ensuring your technology never slows you down.",
        detailedDesc: "Our IT support team is your extended IT department. We provide quick troubleshooting, helpdesk support, and onsite/remote maintenance for all your hardware and software issues, allowing your team to focus on their core work.",
        inclusions: [
            "Remote & On-site Helpdesk",
            "Hardware Repair & Procurement",
            "Network Setup & Maintenance",
            "Software Installation & Troubleshooting",
            "Staff Technical Training"
        ],
        pricing: [
            { label: "Single Incident Support", value: "Rs. 2,500" },
            { label: "Monthly Per-Node Plan", value: "Rs. 4,000 / node" }
        ],
        whyUs: [
            "Rapid Response Guarantee",
            "Experienced Support Engineers",
            "Comprehensive 360 Troubleshooting"
        ],
        specialOffer: "🔥 10% Discount on annual IT Support contracts for local NGOs and Startups.",
        isMainIncome: false,
        phones: ["0701505427", "0777271735"]
    },
    "10": {
        title: "E-Commerce Services",
        icon: "fa-shopping-cart",
        shortDesc: "Launch and scale your online store with professional setups, payment integrations, and conversion-optimized designs.",
        detailedDesc: "We specialize in both custom e-commerce builds and platform-based solutions (Shopify, WooCommerce). We ensure your store is secure, fast, and provides a frictionless checkout experience for your customers, directly boosting your online revenue.",
        inclusions: [
            "Shopify & WooCommerce Setup",
            "Inventory Management Integration",
            "LKR Payment Gateway Setup",
            "Order Automation Systems",
            "Customer Retention Tools"
        ],
        pricing: [
            { label: "Basic Store Launch", value: "Rs. 65,000" },
            { label: "Custom Marketplace", value: "Rs. 200,000+" }
        ],
        whyUs: [
            "Conversion-Optimized Layouts",
            "Secure Lankan Payment Expertise",
            "Training for Inventory Staff"
        ],
        specialOffer: "🔥 FREE Payment Gateway Integration setup for all new e-commerce launches.",
        isMainIncome: false,
        phones: ["0701505427", "0777271735"]
    },
    "11": {
        title: "SEO Services",
        icon: "fa-search",
        shortDesc: "Rank higher on Google and drive organic traffic to your website with our advanced technical and content SEO strategies.",
        detailedDesc: "SEO is a long-term investment that pays off. We conduct deep keyword research and technical audits to ensure search engines love your site as much as your users do. We focus on ranking you for the terms that actually lead to business sales.",
        inclusions: [
            "Technical SEO Audit",
            "On-page Keyword Optimization",
            "High-Quality Backlink Building",
            "Local SEO (Google Maps Setup)",
            "Performance SEO Reporting"
        ],
        pricing: [
            { label: "Local SEO Setup", value: "Rs. 25,000" },
            { label: "Monthly Growth SEO", value: "Rs. 15,000 / mo" }
        ],
        whyUs: [
            "Proven Ranking Results",
            "Whitelisted Ethical Strategies",
            "Transparent Monthly Reporting"
        ],
        specialOffer: "🔥 FREE Website Speed & SEO Performance Report - instant insights.",
        isMainIncome: false,
        phones: ["0701505427", "0777271735"]
    },
    "12": {
        title: "Custom Business Solutions",
        icon: "fa-cube",
        shortDesc: "Tailored digital tools and process automations designed to simplify your operations and maximize productivity.",
        detailedDesc: "Every business is unique. We build specialized solutions like automated reporting tools, custom dashboards, and workflow trackers that traditional software doesn't provide. We bridge the gap between your needs and existing technologies.",
        inclusions: [
            "Workflow Automation Scripts",
            "Custom Dashboard Development",
            "Data Analysis Tools",
            "Integration of Disconnected Apps",
            "Legacy Data Import/Export"
        ],
        pricing: [
            { label: "Initial Analysis", value: "FREE" },
            { label: "Solution Implementation", value: "By Quote" }
        ],
        whyUs: [
            "Problem-Solving Focused",
            "Agile Delivery Model",
            "Seamless Integration Priority"
        ],
        specialOffer: "🔥 15% OFF for multi-process automation clusters.",
        isMainIncome: false,
        phones: ["0701505427", "0777271735"]
    },
    "13": {
        title: "POS System",
        icon: "fa-calculator",
        shortDesc: "Modernify your retail or restaurant business with our advanced, user-friendly Point-of-Sale software with cloud sync.",
        detailedDesc: "Manage your sales, inventory, and staff all from one integrated system. Our POS solutions are designed for Sri Lankan retail and F&B businesses, with offline capabilities, mobile management, and detailed financial reporting.",
        inclusions: [
            "Inventory & Stock Management",
            "Multi-Terminal Cloud Sync",
            "Sales & Revenue Reporting",
            "Barcode & Printer Integration",
            "Staff Access Control"
        ],
        pricing: [
            { label: "Basic Standalone", value: "Rs. 25,000" },
            { label: "Cloud Multi-Store", value: "Rs. 65,000+" }
        ],
        whyUs: [
            "Offline Mode Reliability",
            "Sri Lankan Tax (VAT/SVAT) Readiness",
            "Mobile Management App Included"
        ],
        specialOffer: "🔥 Get a FREE Employee Performance module with any Cloud POS setup.",
        isMainIncome: false,
        phones: ["0701505427", "0777271735"]
    }
};

app.get('/api/pricing', (req, res) => {
    res.json(pricingData);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Node.js Server is running on http://localhost:${PORT}`);
});
