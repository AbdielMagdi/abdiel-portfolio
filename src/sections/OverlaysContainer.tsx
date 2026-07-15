import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Download, Mail, ExternalLink, Sparkles, BookOpen, CheckCircle, Terminal, Layers, Trophy, Palette, Grid3X3, LayoutList, Maximize2, Minimize2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { audio } from '../utils/audio';
import confetti from 'canvas-confetti';
import { fetchGitHubRepo, type GitHubRepoData } from '../utils/github';

// ==================== FIGMA PROJECTS DATA ====================
interface FigmaProject {
  id: string;
  title: string;
  category: string;
  tags: string[];
  figmaUrl: string;
  embedUrl: string;
  description: string;
  colors: string[];
  fonts: string[];
  tools: string[];
  problem: string;
  targetUsers: string;
  designOverview: string;
  outcome: string;
  keyLearnings: string[];
  caseStudySections: { title: string; content: string; placeholder?: boolean }[];
}

const figmaProjects: FigmaProject[] = [
  {
    id: 'website-design',
    title: 'Website Design',
    category: 'Landing Page / Website UI',
    tags: ['Landing Page', 'Website', 'UI Design'],
    figmaUrl: 'https://www.figma.com/design/cpwZMiFyTGzZOuuo7aPktG/Website-Design?node-id=0-1&t=mYJWjOaJy7tIO33G-1',
    embedUrl: 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/cpwZMiFyTGzZOuuo7aPktG/Website-Design?node-id=0-1',
    description: 'A premium, modern website design showcasing clean layout principles, responsive grids, and contemporary UI patterns.',
    colors: ['#00f0ff', '#a855f7', '#050505', '#ffffff'],
    fonts: ['Inter', 'Outfit'],
    tools: ['Figma'],
    problem: 'Existing website templates lack personality and fail to communicate brand identity effectively to visitors.',
    targetUsers: 'Businesses, startups, and personal brands seeking a modern web presence.',
    designOverview: 'A full website design system featuring hero sections, feature grids, testimonials, and conversion-optimized CTAs.',
    outcome: 'Created a complete website design system with reusable components and responsive breakpoints.',
    keyLearnings: ['Responsive grid systems', 'Typography hierarchy in web', 'Conversion-focused CTA design', 'Brand consistency across pages'],
    caseStudySections: [
      { title: 'User Research', content: 'Research pending — will include competitor analysis and user surveys.', placeholder: true },
      { title: 'User Personas', content: 'Personas pending — will define primary and secondary user archetypes.', placeholder: true },
      { title: 'User Journey', content: 'Journey mapping pending — will trace the visitor flow from landing to conversion.', placeholder: true },
      { title: 'Information Architecture', content: 'IA pending — will include sitemap and navigation hierarchy.', placeholder: true },
      { title: 'Wireframes', content: 'Low-fidelity wireframes pending — will show initial layout explorations.', placeholder: true },
      { title: 'Components', content: 'Component library pending — will document all reusable design tokens.', placeholder: true },
    ]
  },
  {
    id: 'hrms-dashboard',
    title: 'HRMS Dashboard',
    category: 'Enterprise Dashboard',
    tags: ['Dashboard', 'Enterprise', 'SaaS'],
    figmaUrl: 'https://www.figma.com/design/0ys8niM9Bggbp9ofu70Ylr/HRMS-Webpage?node-id=0-1&t=z3eafL1QNnRrcLqX-1',
    embedUrl: 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/0ys8niM9Bggbp9ofu70Ylr/HRMS-Webpage?node-id=0-1',
    description: 'A comprehensive Human Resource Management System dashboard with employee analytics, attendance tracking, and payroll modules.',
    colors: ['#0077ff', '#00ff99', '#111111', '#ffffff'],
    fonts: ['Inter', 'Outfit'],
    tools: ['Figma'],
    problem: 'HR teams juggle multiple disconnected tools for attendance, payroll, and employee management.',
    targetUsers: 'HR managers, administrators, and enterprise teams managing 50-500 employees.',
    designOverview: 'A unified dashboard consolidating employee records, attendance logs, leave management, and payroll into one clean interface.',
    outcome: 'Designed a complete enterprise-grade HRMS dashboard with data visualization charts and filter systems.',
    keyLearnings: ['Enterprise dashboard UX patterns', 'Data-heavy interface design', 'Filter and search system design', 'Accessibility in enterprise apps'],
    caseStudySections: [
      { title: 'User Research', content: 'Research pending — will interview HR professionals for pain point analysis.', placeholder: true },
      { title: 'User Personas', content: 'Personas pending — HR Manager, Payroll Admin, and Employee archetypes.', placeholder: true },
      { title: 'User Journey', content: 'Journey pending — will map common HR workflows.', placeholder: true },
      { title: 'Information Architecture', content: 'IA pending — dashboard module hierarchy and navigation structure.', placeholder: true },
      { title: 'Wireframes', content: 'Wireframes pending — initial layout explorations for key modules.', placeholder: true },
      { title: 'Components', content: 'Component library pending — charts, tables, cards, and form elements.', placeholder: true },
    ]
  },
  {
    id: 'abinew',
    title: 'Abinew',
    category: 'Mobile Application',
    tags: ['Mobile App', 'UI/UX', 'Product Design'],
    figmaUrl: 'https://www.figma.com/design/w0s9jyjOm6eLtT0eAjTjPU/Untitled?node-id=0-1&t=4l6XqKVf4mB3nkrk-1',
    embedUrl: 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/w0s9jyjOm6eLtT0eAjTjPU/Untitled?node-id=0-1',
    description: 'A modern mobile application design exploring intuitive navigation patterns, gesture-based interactions, and clean visual hierarchy.',
    colors: ['#00ff99', '#a855f7', '#0a0a0a', '#ffffff'],
    fonts: ['SF Pro', 'Outfit'],
    tools: ['Figma'],
    problem: 'Mobile users expect intuitive, gesture-driven experiences that traditional app designs fail to deliver.',
    targetUsers: 'Mobile-first users seeking streamlined, modern app experiences.',
    designOverview: 'A complete mobile app design featuring onboarding flows, dashboard screens, and interactive components optimized for thumb-zone navigation.',
    outcome: 'Created a polished mobile prototype demonstrating modern interaction patterns.',
    keyLearnings: ['Mobile-first design thinking', 'Thumb-zone optimization', 'Gesture-based navigation design', 'iOS and Android design systems'],
    caseStudySections: [
      { title: 'User Research', content: 'Research pending — will conduct user testing sessions.', placeholder: true },
      { title: 'User Personas', content: 'Personas pending — will define mobile user archetypes.', placeholder: true },
      { title: 'User Journey', content: 'Journey pending — will trace app usage flow.', placeholder: true },
      { title: 'Information Architecture', content: 'IA pending — app screen hierarchy.', placeholder: true },
      { title: 'Wireframes', content: 'Wireframes pending — mobile layout explorations.', placeholder: true },
      { title: 'Components', content: 'Component library pending — mobile UI kit.', placeholder: true },
    ]
  },
  {
    id: 'plants-tracker',
    title: 'Plants Health Tracker',
    category: 'Healthcare / Plant Monitoring App',
    tags: ['Healthcare', 'Mobile App', 'IoT'],
    figmaUrl: 'https://www.figma.com/design/1aUHivePnL1ekFMBJQByet/Plants-Health-Tracker?node-id=0-1&t=jfI2ZoX4WqTAtmDv-1',
    embedUrl: 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/1aUHivePnL1ekFMBJQByet/Plants-Health-Tracker?node-id=0-1',
    description: 'A plant health monitoring application that tracks growth metrics, watering schedules, and environmental conditions for indoor gardens.',
    colors: ['#00ff99', '#ff8800', '#0f0f0f', '#ffffff'],
    fonts: ['Inter', 'Outfit'],
    tools: ['Figma'],
    problem: 'Plant owners struggle to maintain consistent care schedules and often miss critical health indicators.',
    targetUsers: 'Indoor plant enthusiasts, urban gardeners, and smart home users.',
    designOverview: 'A monitoring dashboard with plant profiles, health metrics visualization, watering reminders, and environmental sensor data.',
    outcome: 'Designed a complete plant care companion app with data visualization and notification systems.',
    keyLearnings: ['Healthcare UX patterns', 'Data visualization for monitoring', 'Notification system design', 'Nature-inspired UI aesthetics'],
    caseStudySections: [
      { title: 'User Research', content: 'Research pending — will survey plant care enthusiasts.', placeholder: true },
      { title: 'User Personas', content: 'Personas pending — casual gardener vs. serious botanist.', placeholder: true },
      { title: 'User Journey', content: 'Journey pending — daily plant care workflow.', placeholder: true },
      { title: 'Information Architecture', content: 'IA pending — app structure and sensor data flow.', placeholder: true },
      { title: 'Wireframes', content: 'Wireframes pending — monitoring dashboard layouts.', placeholder: true },
      { title: 'Components', content: 'Component library pending — charts, cards, and notification elements.', placeholder: true },
    ]
  },
];

interface Project {
  id: string;
  title: string;
  category: string;
  desc: string;
  tags: string[];
  problem: string;
  solution: string;
  challenges: string;
  architecture: string[];
  github: string;
  live: string;
  figmaUrl?: string;
}

interface CommunityOrg {
  id: string;
  name: string;
  position: string;
  duration: string;
  responsibilities: string[];
  events: string[];
  metrics: string;
  colors: string[];
}

interface AchievementItem {
  id: string;
  name: string;
  subtitle: string;
  detail: string;
  metrics: string;
  credentialUrl?: string;
}

interface DesignItem {
  id: string;
  title: string;
  category: 'UI/UX' | 'Branding' | 'Posters' | 'Social Media' | 'Web Design' | 'Marketing';
  org: string;
  objective: string;
  process: string[];
  colors: string[];
  fonts: string[];
  tools: string[];
  outcome: string;
}

const projectsData: Project[] = [
  {
    id: 'shopsphere',
    title: 'ShopSphere',
    category: 'AI Powered Full Stack E-Commerce Platform',
    desc: 'AI Powered Full Stack E-Commerce Platform featuring intelligent product recommendations, secure checkout, and real-time inventory management.',
    tags: ['React', 'Node.js', 'Express', 'MySQL', 'Redis', 'JWT'],
    problem: 'E-commerce sites often struggle with static product sorting, sluggish cart updates, and poorly customized user dashboards.',
    solution: 'Designed a responsive React-based client with an Express API, integrating a MySQL catalog database, a Redis cart state store, and JWT user authentication.',
    challenges: 'Ensuring state consistency during simultaneous multiple cart item updates and maintaining sub-100ms API response latency.',
    architecture: ['React UI', 'Express Gateway', 'MySQL & Redis Cache', 'Stripe Payments'],
    github: 'https://github.com/abinayaramothil/shopsphere',
    live: 'https://shopsphere-demo.onrender.com',
    figmaUrl: 'https://www.figma.com/design/cpwZMiFyTGzZOuuo7aPktG/Website-Design?node-id=0-1&t=mYJWjOaJy7tIO33G-1'
  },
  {
    id: 'medisync',
    title: 'MediSync',
    category: 'Intelligent Hospital & Blood Bank Management Platform',
    desc: 'Intelligent Hospital & Blood Bank Management Platform designed to optimize emergency donor tracking and blood inventory safe dispatching.',
    tags: ['React', 'Spring Boot', 'Spring Security', 'MongoDB', 'JWT', 'Docker', 'Render', 'JavaMail'],
    problem: 'Hospitals fail to coordinate vacant blood supply stores and emergency donor matches quickly, endangering high-priority patients.',
    solution: 'Created a Java Spring Boot microservice stack integrated with a React patient dashboard, automated matching filters, and JavaMail alerts.',
    challenges: 'Ensuring secure HIPAA-compliant user role filters and containerizing the multiple modules using Docker.',
    architecture: ['React Portal', 'Spring Boot Controller', 'MongoDB logs', 'JavaMail alerts', 'Docker Engine'],
    github: 'https://github.com/abinayaramothil/BloodBank',
    live: 'https://medisync-portal.onrender.com',
    figmaUrl: 'https://www.figma.com/design/1aUHivePnL1ekFMBJQByet/Plants-Health-Tracker?node-id=0-1&t=jfI2ZoX4WqTAtmDv-1'
  },
  {
    id: 'aero',
    title: 'AeroControl Drone UI',
    category: 'UI/UX Design',
    desc: 'Advanced ground-control dashboard and telemetry UI for unmanned drones, developed during Codoid internship.',
    tags: ['Figma', 'Prototyping', 'User Research', 'Design Systems'],
    problem: 'Drone operators struggled with clustered telemetry information, causing navigation delays and high mental load.',
    solution: 'Designed a clean HUD displaying attitude, battery lifecycle, flight vectors, and map telemetry using high-contrast glassmorphism.',
    challenges: 'Balancing real-time data visual frequency without overloading screen space or distracting from live video feeds.',
    architecture: ['User Personas', 'Wireframe Flow', 'High-Fidelity Mockups', 'Interactive Prototypes'],
    github: 'https://github.com/abdiel-samuel',
    live: 'https://figma.com',
    figmaUrl: 'https://www.figma.com/design/w0s9jyjOm6eLtT0eAjTjPU/Untitled?node-id=0-1&t=4l6XqKVf4mB3nkrk-1'
  },
  {
    id: 'careflow',
    title: 'CareFlow Hospital Portal',
    category: 'Web Application',
    desc: 'Modern hospital administrative platform and patient care coordination engine with real-time room status trackers.',
    tags: ['React', 'Node.js', 'MongoDB', 'TailwindCSS'],
    problem: 'Hospital administrative teams faced extreme delays tracking patient transfers and vacant emergency beds.',
    solution: 'Built a collaborative dashboard featuring Socket.io updates, instant chat integration, and automated scheduler alerts.',
    challenges: 'Handling concurrent state syncing for multiple administrators editing patient records simultaneously.',
    architecture: ['React Client', 'Express REST API', 'MongoDB Atlas', 'WebSockets Sync'],
    github: 'https://github.com/abdiel-samuel',
    live: 'https://careflow-hospital.netlify.app'
  },
  {
    id: 'rag-llm',
    title: 'CognitiveDoc RAG Engine',
    category: 'AI / ML Tool',
    desc: 'Retrieval-Augmented Generation chatbot pipeline optimized for parsing mathematical textbooks and research documents.',
    tags: ['Python', 'LangChain', 'OpenAI API', 'ChromaDB'],
    problem: 'Students spent hours manually searching through 800+ page textbooks to locate specific theorems and steps.',
    solution: 'Created an intelligent query agent that chunked mathematical notation, vector indexed it, and synthesized precise answers with citations.',
    challenges: 'Mathematical LaTeX notation often formatted poorly when split by standard text parsers.',
    architecture: ['Document Parser', 'Recursive Chunking', 'Chroma DB Vector Store', 'GPT-4 Response Agent'],
    github: 'https://github.com/abdiel-samuel',
    live: 'https://huggingface.co'
  },
  {
    id: 'visual-grid',
    title: 'NeuraPaint AI Canvas',
    category: 'AI / ML Tool',
    desc: 'Interactive drawing board that predicts stroke patterns and generates complete stylized vector shapes in real-time.',
    tags: ['Scikit-learn', 'React', 'HTML Canvas', 'Flask'],
    problem: 'Non-designers struggled to draw proportional layouts and standard icons during wireframing.',
    solution: 'Trained a SVM classifier on hand-drawn shapes dataset and linked it to a web canvas for auto-completion.',
    challenges: 'Optimizing response latency of Flask backend to render predictions dynamically under 50ms.',
    architecture: ['React Canvas Listener', 'Flask Classifier API', 'Scikit-Learn Model', 'SVG Renderer'],
    github: 'https://github.com/abdiel-samuel',
    live: 'https://neurapaint.onrender.com'
  }
];

const communitiesData: CommunityOrg[] = [
  {
    id: 'csi',
    name: 'SSN CSI (Computer Society of India)',
    position: 'Design Team Member',
    duration: '2024 - Present',
    responsibilities: [
      'Designed posters and social assets for annual hackathons and tech symposiums.',
      'Guided the wireframe formatting of event registration pages.',
      'Created aesthetic event posters representing high-tech system paradigms.'
    ],
    events: ['CSI Hack Summit', 'TechBytes Tech Talks', 'CodersArena V2'],
    metrics: 'Reached 1,200+ students across zonal colleges',
    colors: ['#00f0ff', '#101010']
  },
  {
    id: 'aisc',
    name: 'SSN AiSC (AI Student Chapter)',
    position: 'Design Team Core',
    duration: '2024 - Present',
    responsibilities: [
      'Curated aesthetic layouts and generative-art style background visual cards.',
      'Created marketing carousels on LinkedIn explaining deep learning pipelines.',
      'Designed certificates and awards slides for RAG LLM seminars.'
    ],
    events: ['PromptCraft Hackathon', 'RAG LLM Engine Seminar', 'Intro to PyTorch'],
    metrics: 'Boosted club social engagements by 45%',
    colors: ['#a855f7', '#151515']
  },
  {
    id: 'ace-design',
    name: 'SSN ACE (Association of Computer Engineers)',
    position: 'Design Team Member',
    duration: '2025 - Present',
    responsibilities: [
      'Engineered brand graphics and layout guidelines for computer engineering chapter.',
      'Collaborated on high-fidelity web page designs for college cultural symposiums.',
      'Developed vector UI assets for engineering magazines.'
    ],
    events: ['Symposium UI Launch', 'CSE Zonal Hackathon'],
    metrics: 'Standardized design system for CSE cultural assets',
    colors: ['#00ff99', '#111']
  },
  {
    id: 'ace-coord',
    name: 'SSN ACE event coordination division',
    position: 'Joint Event Coordinator',
    duration: '2025 - Present',
    responsibilities: [
      'Coordinated technical events, scheduling halls, and booking speakers.',
      'Bridged communication parameters between tech leads and design teams.',
      'Led registration operations and participant logistics panels.'
    ],
    events: ['CodeQuest 2025', 'UI/UX DesignJam Session'],
    metrics: 'Coordinated logistics for 450+ participants',
    colors: ['#ff8800', '#0a0a0a']
  },
  {
    id: 'ieee-design',
    name: 'SSN IEEE Computer Society (CS)',
    position: 'Design Team Specialist',
    duration: '2024 - Present',
    responsibilities: [
      'Crafted vector posters representing quantum networking and computing principles.',
      'Styled certificate layouts and event credential systems.',
      'Engineered responsive web panels for tech chapters.'
    ],
    events: ['QuantumComputing Talks', 'IEEE CS DevFest'],
    metrics: '50+ certified documents issued',
    colors: ['#ff0055', '#161616']
  },
  {
    id: 'ieee-mkt',
    name: 'SSN IEEE CS marketing division',
    position: 'Digital Marketing Lead',
    duration: '2025 - Present',
    responsibilities: [
      'Designed Instagram and LinkedIn social campaign grids.',
      'Tracked participant registration telemetry using campaign UTM tags.',
      'Drafted copy scripts highlighting design meetings.'
    ],
    events: ['CloudSpecialization Bootcamp', 'IEEE Membership Drive'],
    metrics: 'Secured 200+ new chapter registrations',
    colors: ['#0077ff', '#101010']
  },
  {
    id: 'gdsc',
    name: 'SSN Google Developers Student Club',
    position: 'Design Core Member',
    duration: '2025 - Present',
    responsibilities: [
      'Aligned Google developer branding guidelines with local club layouts.',
      'Designed UI mockups for community open source hackathons.',
      'Guided design sprint systems for student developers.'
    ],
    events: ['GDSC Solution Challenge Intro', 'Android Development Jam'],
    metrics: 'Managed design systems across 3 hackathon teams',
    colors: ['#ffffff', '#0f0f0f']
  },
  {
    id: 'spotium',
    name: 'Spotium platform systems',
    position: 'Digital Marketing & Design Head',
    duration: '2025 (1 Month Project)',
    responsibilities: [
      'Led the digital branding system including logos, hex palettes, and grids.',
      'Designed wireframe structures for Spotium SaaS landing dashboards.',
      'Spearheaded creative campaigns and motion graphic sequences.'
    ],
    events: ['Spotium SaaS Launch Camp', 'Alpha UI Testing Phase'],
    metrics: 'Acquired 150+ early testing accounts',
    colors: ['#ffff00', '#050505']
  }
];

const achievementsData: AchievementItem[] = [
  {
    id: 'internships',
    name: 'Industry Internships',
    subtitle: 'YesPanchi & Codoid',
    detail: 'Completed full stack web development at YesPanchi (trading tools) and UI/UX design research at Codoid (drones, HRMS).',
    metrics: '2 Professional Roles Completed'
  },
  {
    id: 'leadership',
    name: 'Campus Leadership',
    subtitle: '8 Student Clubs',
    detail: 'Elected Lead designer and event coordinator across major college tech cells (ACM, IEEE CS, CSI, GDSC, ACE).',
    metrics: '8 Active club leadership positions'
  },
  {
    id: 'designs',
    name: 'Design Contributions',
    subtitle: '50+ Creative Assets',
    detail: 'Developed premium event posters, digital marketing templates, social creatives, and vector decals.',
    metrics: '50+ High fidelity creative assets built'
  },
  {
    id: 'hackathons',
    name: 'Hackathon Contributor',
    subtitle: 'SSN & Zonal Hacks',
    detail: 'Won and participated in engineering contests, presenting working UI solutions and machine learning scripts.',
    metrics: 'Top Tier selections'
  },
  {
    id: 'workshops',
    name: 'Workshops Lead',
    subtitle: 'RAG LLM & UX',
    detail: 'Organized and participated in technical seminars on vector index databases and human computer interaction methods.',
    metrics: '4 Major workshops led'
  },
  {
    id: 'certs',
    name: 'Certifications',
    subtitle: 'Python & AI Foundations',
    detail: 'Acquired credentials in data structure optimizations, machine learning architectures, and deep neural nets.',
    metrics: 'Python & RAG LLM certified'
  },
  {
    id: 'impact',
    name: 'Community Impact',
    subtitle: 'Zonal Outreach',
    detail: 'Provided design resources and hosted technical learning events for computer science enthusiasts.',
    metrics: 'Helped educate 1,500+ peers'
  },
  {
    id: 'projects',
    name: 'Technical Projects',
    subtitle: 'Full Stack & ML Builds',
    detail: 'Built medical trackers, drone ground controller layouts, and handwritten vector completions classifiers.',
    metrics: '4 Core developer projects'
  }
];

const designsData: DesignItem[] = [
  {
    id: 'csi-poster',
    title: 'CSI Code Arena Decal',
    category: 'Posters',
    org: 'SSN CSI',
    objective: 'Create a high-impact tech poster to drive registrations for the CSI zonal code challenge.',
    process: ['Vector Grid Layout', 'Contrast Typography Block', 'Neon Color Overlay', 'Decal Accents'],
    colors: ['#00f0ff', '#a855f7', '#050505'],
    fonts: ['Orbitron', 'Outfit'],
    tools: ['Figma', 'Photoshop'],
    outcome: 'Increased hackathon registrations by 35% compared to the previous year.'
  },
  {
    id: 'aisc-inst',
    title: 'Neural Net Explainer Grid',
    category: 'Social Media',
    org: 'SSN AiSC',
    objective: 'Design a highly engaging, visual 5-slide carousel explaining Backpropagation simply.',
    process: ['Grid Sketching', 'Vector Node Diagrams', 'Gradient Pathways', 'Brief Text Copy'],
    colors: ['#a855f7', '#00ff99', '#101010'],
    fonts: ['Outfit'],
    tools: ['Figma', 'Illustrator'],
    outcome: 'Received 800+ impressions and 50+ shares on LinkedIn.'
  },
  {
    id: 'ace-brand',
    title: 'ACE Identity Guideline',
    category: 'Branding',
    org: 'SSN ACE',
    objective: 'Revamp the visual branding guidelines of the computer engineering chapter for a modern tech feel.',
    process: ['Logo Decal Redesign', 'Hex Palette Formulation', 'Font Pairings Selection', 'Slide Pitch Templates'],
    colors: ['#00ff99', '#ffffff', '#151515'],
    fonts: ['Orbitron', 'Outfit'],
    tools: ['Figma', 'Illustrator'],
    outcome: 'Standardized branding across 12 different event divisions.'
  },
  {
    id: 'gdsc-web',
    title: 'Solution Challenge Portal',
    category: 'Web Design',
    org: 'SSN GDSC',
    objective: 'Design a high-fidelity landing page for developers submitting solutions to the Google Challenge.',
    process: ['Low-fi Wireframes', 'Grid Spacings Config', 'Interactive Components', 'Dark Mode Styling'],
    colors: ['#0077ff', '#ff0055', '#0f0f0f'],
    fonts: ['Product Sans', 'Outfit'],
    tools: ['Figma'],
    outcome: 'Created design mockups for 3 team project pitches.'
  },
  {
    id: 'spot-app',
    title: 'Spotium SaaS Dashboard',
    category: 'UI/UX',
    org: 'Spotium',
    objective: 'Design the alpha dashboard for monitoring SaaS telemetry and marketing grids.',
    process: ['UX Analytics Flow', 'Information Hierarchy', 'Interactive Glass Cards', 'Chart Components'],
    colors: ['#ffff00', '#a855f7', '#050505'],
    fonts: ['Orbitron', 'Outfit'],
    tools: ['Figma', 'After Effects'],
    outcome: 'Completed high-fidelity prototyping validated in alpha test phase.'
  }
];

const GitHubRepoSection: React.FC<{ repoUrl: string }> = ({ repoUrl }) => {
  const [data, setData] = useState<GitHubRepoData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const match = repoUrl.match(/github\.com\/([^/]+\/[^/]+)/);
    if (!match) return;
    const repoPath = match[1].replace(/\.git$/, '');

    setLoading(true);
    fetchGitHubRepo(repoPath).then((res) => {
      setData(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [repoUrl]);

  if (loading) {
    return (
      <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/3 border border-white/5 animate-pulse text-xs text-white/40 font-orbitron">
        <span>LOADING GITHUB DETAILS...</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-black/60 border border-cyan-500/20 text-xs text-white/80 shadow-[0_0_15px_rgba(0,240,255,0.05)]">
      <div className="flex justify-between items-start border-b border-white/10 pb-3">
        <div>
          <h4 className="text-sm font-bold font-orbitron text-cyan-400">
            💻 {data.name}
          </h4>
          <p className="text-[10px] text-white/40 mt-1">
            Last Updated: {new Date(data.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-3 text-[10px] font-orbitron font-semibold">
          <span className="text-amber-400">★ {data.stars} stars</span>
          <span className="text-purple-400">⌥ {data.forks} forks</span>
        </div>
      </div>

      <p className="text-xs text-white/70 leading-relaxed">
        {data.description}
      </p>

      <div>
        <h5 className="font-bold text-white font-orbitron text-[9px] tracking-wider mb-2">LANGUAGES</h5>
        <div className="flex flex-wrap gap-2">
          {Object.entries(data.languages).map(([lang, pct]) => (
            <div key={lang} className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full" style={{
                backgroundColor: lang === 'TypeScript' ? '#3178c6' : lang === 'React' ? '#61dafb' : lang === 'Java' ? '#b07219' : lang === 'Node.js' ? '#339933' : '#a855f7'
              }} />
              <span className="text-[9px] font-orbitron text-white/70">{lang} ({pct}%)</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h5 className="font-bold text-white font-orbitron text-[9px] tracking-wider mb-2">README OVERVIEW</h5>
        <div className="p-3 rounded-xl bg-white/3 border border-white/5 max-h-40 overflow-y-auto custom-scrollbar select-text text-white/60 font-mono text-[9px] leading-relaxed whitespace-pre-wrap">
          {data.readme}
        </div>
      </div>

      {data.activity && data.activity.length > 0 && (
        <div>
          <h5 className="font-bold text-white font-orbitron text-[9px] tracking-wider mb-2">REPOSITORY ACTIVITY</h5>
          <div className="flex items-end gap-1 p-2 rounded-xl bg-white/3 border border-white/5 w-fit">
            {data.activity.map((act, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div 
                  className="w-4 rounded-sm transition-all duration-300"
                  style={{
                    height: `${Math.max(act.count * 4, 4)}px`,
                    backgroundColor: act.count > 5 ? '#00ff99' : act.count > 2 ? '#00f0ff' : '#0077ff',
                    opacity: 0.8
                  }}
                  title={`${act.date}: ${act.count} commits`}
                />
                <span className="text-[6px] text-white/30 font-orbitron">{act.date.split('-')[2]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const OverlaysContainer: React.FC = () => {
  const { 
    activeOverlay, 
    setActiveOverlay, 
    setCurrentZone, 
    showSecretMode,
    selectedCommunityOrg,
    setSelectedCommunityOrg,
    selectedAchievement,
    setSelectedAchievement,
    selectedFigmaProject,
    setSelectedFigmaProject
  } = usePortfolio();
  
  // Projects overlay local states
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectFilter, setProjectFilter] = useState<'All' | 'Web' | 'AI' | 'ML' | 'UI/UX'>('All');
  
  // Projects Overlay Category Tab (Developer Projects vs Design Showcase)
  const [activeProjectsTab, setActiveProjectsTab] = useState<'dev' | 'design'>('dev');
  
  // Design gallery filter states
  const [designFilter, setDesignFilter] = useState<'All' | 'UI/UX' | 'Branding' | 'Posters' | 'Social Media' | 'Web Design' | 'Marketing'>('All');
  const [selectedDesign, setSelectedDesign] = useState<DesignItem | null>(null);

  // Contact form state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // UI/UX Studio states
  const [figmaFilter, setFigmaFilter] = useState<string>('All');
  const [figmaViewMode, setFigmaViewMode] = useState<'grid' | 'list'>('grid');
  const [figmaViewState, setFigmaViewState] = useState<'gallery' | 'detail' | 'embed' | 'casestudy'>('gallery');
  const [figmaFullscreen, setFigmaFullscreen] = useState(false);
  const activeFigma = figmaProjects.find(p => p.id === selectedFigmaProject) || null;

  // Sync internal selected items with props when overlay opens
  useEffect(() => {
    if (activeOverlay === 'communities' && !selectedCommunityOrg) {
      setSelectedCommunityOrg(communitiesData[0].id);
    }
    if (activeOverlay === 'achievements' && !selectedAchievement) {
      setSelectedAchievement(achievementsData[0].id);
    }
    if (activeOverlay === 'uiux') {
      setFigmaViewState('gallery');
    }
  }, [activeOverlay, selectedCommunityOrg, selectedAchievement]);

  const handleClose = () => {
    audio.playClick();
    setActiveOverlay(null);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audio.playSuccess();
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.7 }
    });
    setFormSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  };

  if (!activeOverlay) return null;

  return (
    <div className="fixed inset-0 z-30 pointer-events-none flex items-center justify-end p-4 md:p-8 select-text">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeOverlay}
          initial={{ opacity: 0, x: 100, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-xl h-[80vh] rounded-3xl glass-panel pointer-events-auto flex flex-col relative overflow-hidden border-glow-blue"
        >
          {/* Neon Header glow bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600" />
          
          {/* Card Close Button */}
          <button
            onClick={handleClose}
            onMouseEnter={() => audio.playHover()}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400/40 hover:text-cyan-400 transition-all z-20 cursor-pointer"
          >
            <X size={16} />
          </button>

          {/* Scrollable Container */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
            
            {/* ==================== HOME OVERLAY ==================== */}
            {activeOverlay === 'home' && (
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-xs font-semibold tracking-[0.2em] text-cyan-400 font-orbitron">WHERE DESIGN MEETS ENGINEERING</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-orbitron mt-2 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    Abdiel Samuel
                  </h2>
                  <p className="text-sm text-white/50 tracking-wider font-orbitron mt-1">Computer Science Engineer & UI/UX Specialist</p>
                </div>

                <blockquote className="border-l-2 border-cyan-500 pl-4 py-1 italic text-white/80 text-sm md:text-base">
                  "I don't just build applications. I design experiences that people love using."
                </blockquote>

                <div className="flex flex-col gap-4 text-white/70 text-sm leading-relaxed">
                  <p>
                    I am a Computer Science Engineering undergraduate student (2024–2028) at SSN, combining software engineering foundations with a passion for clean human-computer interaction designs, modern WebGL layouts, and generative AI systems.
                  </p>
                  <p>
                    From researching UI structures to fabricating physical drone control interfaces and training ML pipelines, I thrive on translating abstract engineering problems into fluid, interactive experiences.
                  </p>
                </div>

                {/* Grid details (Design, Dev, Innovation) */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {[
                    { title: "Design Mindset", text: "Figma master, glassmorphism, responsive systems." },
                    { title: "Full Stack Engineering", text: "React, TS, Node, MongoDB, RESTful API design." },
                    { title: "AI Exploration", text: "RAG pipelines, LangChain, PyTorch modeling." },
                    { title: "SSN Core Leadership", text: "Technical Lead, hackathons, team developer." }
                  ].map((feat, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white/3 border border-white/5">
                      <h4 className="text-xs font-bold text-cyan-400 font-orbitron tracking-wider">{feat.title}</h4>
                      <p className="text-[11px] text-white/50 mt-1 leading-normal">{feat.text}</p>
                    </div>
                  ))}
                </div>

                {/* Quick actions buttons */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={() => setCurrentZone('projects')}
                    onMouseEnter={() => audio.playHover()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-semibold text-xs tracking-wider font-orbitron flex items-center gap-2 cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(0,240,255,0.2)]"
                  >
                    <span>EXPLORE PROJECTS</span>
                    <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => {
                      audio.playSuccess();
                      alert("Downloading Resume (Mockup PDF link)...");
                    }}
                    onMouseEnter={() => audio.playHover()}
                    className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-semibold text-xs tracking-wider font-orbitron flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Download size={14} />
                    <span>DOWNLOAD RESUME</span>
                  </button>
                  <button
                    onClick={() => setCurrentZone('contact')}
                    onMouseEnter={() => audio.playHover()}
                    className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-cyan-400 font-semibold text-xs tracking-wider font-orbitron flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Mail size={14} />
                    <span>CONNECT</span>
                  </button>
                </div>
              </div>
            )}

            {/* ==================== PROJECTS & DESIGN SHOWCASE OVERLAY ==================== */}
            {activeOverlay === 'projects' && (
              <div className="flex flex-col gap-6">
                {/* Header with selector tabs */}
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-semibold tracking-[0.2em] text-cyan-400 font-orbitron">THE DISTRICT</span>
                    <h2 className="text-3xl font-extrabold tracking-tight font-orbitron mt-1">Featured Work</h2>
                  </div>
                  <div className="flex rounded-lg bg-white/5 p-1 border border-white/5">
                    <button
                      onClick={() => { audio.playClick(); setActiveProjectsTab('dev'); setSelectedDesign(null); }}
                      className={`px-3 py-1.5 rounded-md text-[10px] tracking-[0.1em] font-bold font-orbitron transition-all ${
                        activeProjectsTab === 'dev' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20' : 'text-white/40'
                      }`}
                    >
                      CODE BUILDS
                    </button>
                    <button
                      onClick={() => { audio.playClick(); setActiveProjectsTab('design'); setSelectedProject(null); }}
                      className={`px-3 py-1.5 rounded-md text-[10px] tracking-[0.1em] font-bold font-orbitron transition-all ${
                        activeProjectsTab === 'design' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20' : 'text-white/40'
                      }`}
                    >
                      DESIGN SHOWCASE
                    </button>
                  </div>
                </div>

                {/* Developer code builds list */}
                {activeProjectsTab === 'dev' && (
                  <>
                    {!selectedProject ? (
                      <>
                        {/* Filters */}
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                          {(['All', 'Web', 'AI', 'ML', 'UI/UX'] as const).map((filter) => (
                            <button
                              key={filter}
                              onClick={() => {
                                audio.playClick();
                                setProjectFilter(filter);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-orbitron tracking-wider cursor-pointer border ${
                                projectFilter === filter
                                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                                  : 'bg-white/3 border-white/5 text-white/50 hover:text-white hover:border-white/20'
                              }`}
                            >
                              {filter}
                            </button>
                          ))}
                        </div>

                        <div className="flex flex-col gap-4">
                          {projectsData
                            .filter(p => projectFilter === 'All' || p.category === projectFilter)
                            .map((project) => (
                              <div
                                key={project.id}
                                onClick={() => {
                                  audio.playClick();
                                  setSelectedProject(project);
                                }}
                                onMouseEnter={() => audio.playHover()}
                                className="p-5 rounded-2xl bg-white/3 border border-white/5 hover:border-cyan-500/30 hover:bg-white/6 transition-all duration-300 cursor-pointer relative group flex flex-col gap-3"
                              >
                                <div className="flex justify-between items-start">
                                  <h3 className="text-lg font-bold font-orbitron text-white group-hover:text-cyan-400 transition-colors">
                                    {project.title}
                                  </h3>
                                  <span className="px-2 py-0.5 text-[9px] font-semibold tracking-wider font-orbitron text-cyan-400 bg-cyan-950/20 border border-cyan-500/30 rounded-md">
                                    {project.category}
                                  </span>
                                </div>
                                
                                <p className="text-xs text-white/60 leading-relaxed">
                                  {project.desc}
                                </p>

                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {project.tags.map((t) => (
                                    <span key={t} className="text-[9px] px-2 py-1 rounded bg-white/5 text-white/40">
                                      {t}
                                    </span>
                                  ))}
                                </div>

                                <div className="absolute right-4 bottom-4 text-white/20 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300">
                                  <ArrowRight size={16} />
                                </div>
                              </div>
                            ))}
                        </div>
                      </>
                    ) : (
                      // Project Case Study Details
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-5"
                      >
                        <button
                          onClick={() => {
                            audio.playClick();
                            setSelectedProject(null);
                          }}
                          className="text-xs font-orbitron font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 mb-2 cursor-pointer"
                        >
                          <ArrowRight size={14} className="rotate-180" />
                          <span>BACK TO PROJECTS</span>
                        </button>

                        <div>
                          <span className="px-2.5 py-0.5 text-[10px] font-semibold tracking-widest font-orbitron text-cyan-400 bg-cyan-950/20 border border-cyan-500/30 rounded-md">
                            {selectedProject.category}
                          </span>
                          <h3 className="text-2xl md:text-3xl font-extrabold font-orbitron mt-2">{selectedProject.title}</h3>
                        </div>

                        <div className="flex flex-col gap-4 text-xs text-white/70">
                          <div>
                            <h4 className="font-bold text-white font-orbitron tracking-wider flex items-center gap-1.5 text-cyan-400 mb-1">
                              <Terminal size={14} />
                              PROBLEM STATEMENT
                            </h4>
                            <p className="leading-relaxed pl-5 border-l border-white/10">{selectedProject.problem}</p>
                          </div>

                          <div>
                            <h4 className="font-bold text-white font-orbitron tracking-wider flex items-center gap-1.5 text-cyan-400 mb-1">
                              <Layers size={14} />
                              PROPOSED SOLUTION
                            </h4>
                            <p className="leading-relaxed pl-5 border-l border-white/10">{selectedProject.solution}</p>
                          </div>

                          <div>
                            <h4 className="font-bold text-white font-orbitron tracking-wider flex items-center gap-1.5 text-cyan-400 mb-1">
                              <BookOpen size={14} />
                              DEVELOPMENT & CHALLENGES
                            </h4>
                            <p className="leading-relaxed pl-5 border-l border-white/10">
                              <strong>Challenge:</strong> {selectedProject.challenges}
                            </p>
                          </div>

                          <div className="p-4 rounded-xl bg-white/3 border border-white/5 mt-2">
                            <h4 className="font-bold text-white font-orbitron tracking-wider text-[10px] mb-2.5">PROCESS ARCHITECTURE</h4>
                            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                              {selectedProject.architecture.map((node, index) => (
                                <React.Fragment key={index}>
                                  <div className="px-2.5 py-1.5 rounded-lg bg-[#101010] border border-cyan-500/20 text-[10px] font-orbitron text-white/80 font-bold whitespace-nowrap">
                                    {node}
                                  </div>
                                  {index < selectedProject.architecture.length - 1 && (
                                    <ArrowRight size={10} className="text-cyan-400 flex-shrink-0" />
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        </div>

                        {selectedProject.github && (
                          <GitHubRepoSection repoUrl={selectedProject.github} />
                        )}

                        <div className="flex gap-3 mt-4">
                          <a
                            href={selectedProject.github}
                            target="_blank"
                            rel="noreferrer"
                            onMouseEnter={() => audio.playHover()}
                            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs tracking-wider font-orbitron flex items-center gap-2 cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.579 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            <span>GITHUB REPO</span>
                            <ExternalLink size={12} />
                          </a>
                          {selectedProject.figmaUrl && (
                            <a
                              href={selectedProject.figmaUrl}
                              target="_blank"
                              rel="noreferrer"
                              onMouseEnter={() => audio.playHover()}
                              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-[#18181b] hover:border-cyan-400/50 text-white font-semibold text-xs tracking-wider font-orbitron flex items-center gap-2 cursor-pointer"
                            >
                              <span>FIGMA DESIGN</span>
                              <ExternalLink size={12} />
                            </a>
                          )}
                          <a
                            href={selectedProject.live}
                            target="_blank"
                            rel="noreferrer"
                            onMouseEnter={() => audio.playHover()}
                            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-semibold text-xs tracking-wider font-orbitron flex items-center gap-2 cursor-pointer"
                          >
                            <span>LIVE DEPLOY</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}

                {/* DESIGN SHOWCASE GALLERY GRID */}
                {activeProjectsTab === 'design' && (
                  <>
                    {!selectedDesign ? (
                      <>
                        {/* Filters */}
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                          {(['All', 'UI/UX', 'Branding', 'Posters', 'Social Media', 'Web Design', 'Marketing'] as const).map((filter) => (
                            <button
                              key={filter}
                              onClick={() => {
                                audio.playClick();
                                setDesignFilter(filter);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-orbitron tracking-wider cursor-pointer border ${
                                designFilter === filter
                                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                                  : 'bg-white/3 border-white/5 text-white/50 hover:text-white hover:border-white/20'
                              }`}
                            >
                              {filter}
                            </button>
                          ))}
                        </div>

                        {/* Design Showcase grid */}
                        <div className="grid grid-cols-2 gap-4">
                          {designsData
                            .filter(d => designFilter === 'All' || d.category === designFilter)
                            .map((design) => (
                              <div
                                key={design.id}
                                onClick={() => {
                                  audio.playClick();
                                  setSelectedDesign(design);
                                }}
                                onMouseEnter={() => audio.playHover()}
                                className="p-4 rounded-xl bg-white/3 border border-white/5 hover:border-cyan-500/30 hover:bg-white/6 transition-all duration-300 cursor-pointer flex flex-col gap-2 relative group"
                              >
                                {/* Vector Placeholder Box representing design item */}
                                <div 
                                  className="w-full aspect-[4/3] rounded-lg relative overflow-hidden flex items-center justify-center border border-white/5"
                                  style={{
                                    background: `linear-gradient(135deg, ${design.colors[0]}22, ${design.colors[1]}22)`,
                                  }}
                                >
                                  {/* Grid background effect */}
                                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px] opacity-60" />
                                  <Sparkles size={24} className="text-white/20 group-hover:scale-110 group-hover:text-cyan-400/80 transition-all duration-300" style={{ color: design.colors[0] }} />
                                </div>

                                <div className="flex justify-between items-start mt-1">
                                  <h4 className="text-xs font-bold font-orbitron text-white leading-normal group-hover:text-cyan-400 transition-colors">
                                    {design.title}
                                  </h4>
                                </div>
                                <div className="flex justify-between text-[8px] font-orbitron text-white/40 tracking-wider">
                                  <span>{design.org.toUpperCase()}</span>
                                  <span className="text-cyan-400">{design.category}</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </>
                    ) : (
                      // Premium Design Case Study overlay
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-5"
                      >
                        <button
                          onClick={() => {
                            audio.playClick();
                            setSelectedDesign(null);
                          }}
                          className="text-xs font-orbitron font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 mb-2 cursor-pointer"
                        >
                          <ArrowRight size={14} className="rotate-180" />
                          <span>BACK TO GALLERY</span>
                        </button>

                        <div>
                          <span className="px-2 py-0.5 text-[9px] font-semibold tracking-wider font-orbitron text-cyan-400 bg-cyan-950/20 border border-cyan-500/30 rounded-md">
                            {selectedDesign.category} • {selectedDesign.org}
                          </span>
                          <h3 className="text-xl md:text-2xl font-extrabold font-orbitron mt-2">{selectedDesign.title}</h3>
                        </div>

                        <div className="flex flex-col gap-4 text-xs text-white/70">
                          <div>
                            <h4 className="font-bold text-white font-orbitron tracking-wider flex items-center gap-1.5 text-cyan-400 mb-1">
                              DESIGN OBJECTIVE
                            </h4>
                            <p className="leading-relaxed pl-4 border-l border-white/10">{selectedDesign.objective}</p>
                          </div>

                          {/* Color Palette Indicators */}
                          <div>
                            <h4 className="font-bold text-white font-orbitron tracking-wider text-[10px] mb-2">COLOR PALETTE</h4>
                            <div className="flex gap-2">
                              {selectedDesign.colors.map((color) => (
                                <div key={color} className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#101010] border border-white/5 w-fit">
                                  <span className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: color }} />
                                  <span className="font-orbitron text-[9px] font-semibold text-white/60">{color.toUpperCase()}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Typography Specimen */}
                          <div>
                            <h4 className="font-bold text-white font-orbitron tracking-wider text-[10px] mb-2">TYPOGRAPHY SYSTEM</h4>
                            <div className="flex gap-2 text-[10px] font-orbitron">
                              {selectedDesign.fonts.map((f) => (
                                <span key={f} className="px-2 py-1 rounded border border-white/5 bg-[#101010] text-white/60">
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Process stages */}
                          <div>
                            <h4 className="font-bold text-white font-orbitron tracking-wider text-[10px] mb-2">CREATIVE WORKFLOW</h4>
                            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                              {selectedDesign.process.map((node, index) => (
                                <React.Fragment key={index}>
                                  <div className="px-2.5 py-1.5 rounded-lg bg-[#101010] border border-cyan-500/20 text-[9px] font-orbitron text-white/80 whitespace-nowrap">
                                    {node}
                                  </div>
                                  {index < selectedDesign.process.length - 1 && (
                                    <ArrowRight size={10} className="text-cyan-400 flex-shrink-0" />
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-bold text-white font-orbitron tracking-wider flex items-center gap-1.5 text-cyan-400 mb-1">
                              OUTCOME & METRICS
                            </h4>
                            <p className="leading-relaxed pl-4 border-l border-white/10">{selectedDesign.outcome}</p>
                          </div>
                        </div>

                        {/* Design tools */}
                        <div className="flex gap-1.5 items-center flex-wrap mt-2">
                          <span className="text-[10px] text-white/40 tracking-wider font-orbitron mr-2">TOOLS USED:</span>
                          {selectedDesign.tools.map((tool) => (
                            <span key={tool} className="px-2.5 py-1 bg-cyan-950/20 border border-cyan-500/20 text-[9px] font-bold text-cyan-400 font-orbitron rounded-full">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ==================== SKILLS OVERLAY ==================== */}
            {activeOverlay === 'skills' && (
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-xs font-semibold tracking-[0.2em] text-cyan-400 font-orbitron">THE UNIVERSE</span>
                  <h2 className="text-3xl font-extrabold tracking-tight font-orbitron mt-1">Skill Matrix</h2>
                  <p className="text-xs text-white/40 mt-1">Core proficiencies plotted across planetary categories. Click planetary sectors to expand.</p>
                </div>

                {[
                  {
                    category: "PROGRAMMING",
                    skills: [
                      { name: "Java", level: 90 },
                      { name: "Python", level: 85 },
                      { name: "JavaScript/TypeScript", level: 92 },
                      { name: "C Programming", level: 75 }
                    ]
                  },
                  {
                    category: "FRONTEND FRAMEWORKS",
                    skills: [
                      { name: "React / Vite / Next.js", level: 93 },
                      { name: "TailwindCSS v3/v4", level: 90 },
                      { name: "Three.js / React Three Fiber", level: 78 }
                    ]
                  },
                  {
                    category: "BACKEND & DATABASES",
                    skills: [
                      { name: "Node.js (Express)", level: 88 },
                      { name: "Spring Boot", level: 82 },
                      { name: "Flask / FastAPI", level: 75 },
                      { name: "MongoDB & SQL (MySQL/SQLite)", level: 85 }
                    ]
                  },
                  {
                    category: "AI & ENGINEERING TOOLS",
                    skills: [
                      { name: "Vector Search / ChromaDB / RAG", level: 80 },
                      { name: "Figma (UI/UX Case Systems)", level: 92 },
                      { name: "Docker & Git Versioning", level: 85 }
                    ]
                  }
                ].map((sec, idx) => (
                  <div key={idx} className="flex flex-col gap-3">
                    <h3 className="text-xs font-bold text-cyan-400 font-orbitron tracking-wider">{sec.category}</h3>
                    
                    <div className="flex flex-col gap-2.5">
                      {sec.skills.map((skill) => (
                        <div key={skill.name} className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs font-orbitron text-white/70">
                            <span>{skill.name}</span>
                            <span>{skill.level}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ==================== COMMUNITIES OVERLAY ("Building Communities Through Design") ==================== */}
            {activeOverlay === 'communities' && (
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-xs font-semibold tracking-[0.2em] text-cyan-400 font-orbitron">BUILDING COMMUNITIES THROUGH DESIGN</span>
                  <h2 className="text-3xl font-extrabold tracking-tight font-orbitron mt-1">Campus Hub</h2>
                  <p className="text-xs text-white/40 mt-1">Timeline of my creative contributions across student organizations.</p>
                </div>

                <div className="flex gap-4">
                  {/* Left Side Quick select tabs */}
                  <div className="flex flex-col gap-1.5 w-1/3 border-r border-white/5 pr-3">
                    <span className="text-[8px] font-bold text-white/30 font-orbitron tracking-widest mb-1">CHAPTERS</span>
                    {communitiesData.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => { audio.playClick(); setSelectedCommunityOrg(c.id); }}
                        className={`text-[9px] text-left px-2 py-2 rounded-lg font-orbitron tracking-wider truncate cursor-pointer border ${
                          selectedCommunityOrg === c.id 
                            ? 'bg-white/5 text-cyan-400 border-cyan-500/20 font-bold' 
                            : 'text-white/40 border-transparent hover:text-white'
                        }`}
                      >
                        {c.name.split(' (')[0].replace('SSN ', '')}
                      </button>
                    ))}
                  </div>

                  {/* Right Side Organization Card details */}
                  <div className="flex-1 flex flex-col gap-4">
                    {communitiesData.map((c) => {
                      if (c.id !== selectedCommunityOrg) return null;
                      return (
                        <motion.div
                          key={c.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex flex-col gap-4"
                        >
                          <div className="flex justify-between items-start border-b border-white/5 pb-2">
                            <div>
                              <h3 className="text-base font-bold font-orbitron text-white leading-snug">{c.name}</h3>
                              <p className="text-[10px] text-cyan-400 font-orbitron mt-0.5">{c.position}</p>
                            </div>
                            <span className="text-[8px] font-orbitron px-2 py-0.5 rounded border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 whitespace-nowrap">
                              {c.duration}
                            </span>
                          </div>

                          <div className="flex flex-col gap-2">
                            <h4 className="text-[10px] font-bold font-orbitron text-white/60 tracking-wider">RESPONSIBILITIES</h4>
                            <ul className="text-xs text-white/70 pl-4 list-disc flex flex-col gap-1.5">
                              {c.responsibilities.map((r, idx) => (
                                <li key={idx}>{r}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex flex-col gap-2">
                            <h4 className="text-[10px] font-bold font-orbitron text-white/60 tracking-wider">KEY EVENTS & PITCHES</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {c.events.map((e) => (
                                <span key={e} className="px-2 py-1 rounded bg-[#101010] border border-white/5 text-[9px] font-orbitron text-white/75">
                                  {e}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Impact Metrics banner */}
                          <div className="p-3.5 rounded-xl border border-cyan-500/20 bg-cyan-950/10 flex items-center gap-3">
                            <Sparkles size={16} className="text-cyan-400 flex-shrink-0 animate-pulse" />
                            <div>
                              <h5 className="text-[9px] font-bold font-orbitron text-cyan-300 tracking-wider">CAMPUS OUTCOME IMPACT</h5>
                              <p className="text-[10px] text-white/60 mt-0.5 leading-snug">{c.metrics}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ==================== INTERNSHIP OVERLAY ==================== */}
            {activeOverlay === 'internship' && (
              <div className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <span className="text-xs font-semibold tracking-[0.2em] text-cyan-400 font-orbitron">PROFESSIONAL EXPERIENCE</span>
                  <h2 className="text-3xl font-extrabold tracking-tight font-orbitron mt-1">Work History</h2>
                  <p className="text-xs text-white/40 mt-1">Timeline of my engineering & design roles</p>
                </div>

                {/* YesPanchi Internship */}
                <div className="p-5 rounded-2xl bg-white/3 border border-white/5 flex flex-col gap-4 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold font-orbitron text-white group-hover:text-cyan-400 transition-colors">
                        Full Stack Web Development Intern
                      </h3>
                      <p className="text-xs text-cyan-400 font-orbitron mt-0.5">YesPanchi</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded bg-cyan-950/20 text-cyan-300 border border-cyan-500/20 font-orbitron font-semibold">
                      MAY 2026 – JUNE 2026
                    </span>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed">
                    Contributed to full stack application development, building scalable frontend components and implementing complex features for trading and public portals.
                  </p>

                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-bold font-orbitron text-white tracking-wider">PROJECT HIGHLIGHTS</h4>
                    <ul className="flex flex-col gap-2 text-xs text-white/70 list-disc pl-4">
                      <li>
                        <strong>Stock Trading Platform (Zerodha Kite-inspired):</strong> Developed responsive trading dashboards, designed interactive watchlists, and built portfolio management interfaces.
                      </li>
                      <li>
                        <strong>Company Official Website Redesign:</strong> Re-architected navigation structure and responsiveness across all devices, optimizing loading speed.
                      </li>
                      <li>
                        <strong>Full Stack Engineering:</strong> Collaborated closely with the dev team to build modular, scalable frontend components and REST APIs.
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-white/3 border border-white/5 mt-2">
                    <h4 className="text-[10px] font-bold font-orbitron tracking-wider text-white mb-2">SPECIALIZATIONS</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {['React', 'Node.js', 'REST APIs', 'Dashboard Development', 'Responsive Design', 'Full Stack Development', 'UI/UX Improvements', 'Trading Platform', 'GitHub Integration'].map(spec => (
                        <span key={spec} className="text-[9px] font-orbitron px-2 py-0.5 rounded bg-cyan-950/20 border border-cyan-500/20 text-cyan-400">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Codoid Internship */}
                <div className="p-5 rounded-2xl bg-white/3 border border-white/5 flex flex-col gap-4 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold font-orbitron text-white group-hover:text-amber-400 transition-colors">
                        UI/UX Design Intern
                      </h3>
                      <p className="text-xs text-amber-400 font-orbitron mt-0.5">Codoid Innovations</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded bg-amber-950/20 text-amber-300 border border-amber-500/20 font-orbitron font-semibold">
                      MAY 2025 – JUNE 2025
                    </span>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed">
                    Fabricated digital user experiences, mapped wireframe architectures, and conducted comprehensive research on industrial and commercial website design criteria.
                  </p>

                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-bold font-orbitron text-white tracking-wider">PROJECT HIGHLIGHTS</h4>
                    <ul className="flex flex-col gap-2 text-xs text-white/70 list-disc pl-4">
                      <li>
                        <strong>Drone Telemetry HUD UI:</strong> Conducted system mockups and structural UI wireframe layout grids representing flight altitude, GPS pitch vectors, and coordinates layout maps.
                      </li>
                      <li>
                        <strong>Hospital Coordination Portal & HRMS:</strong> Researched UI systems for emergency rooms, bed allocation trackers, and patient management portal configurations.
                      </li>
                      <li>
                        <strong>Modern Design Systems:</strong> Standardized typography guidelines, modular cards grids, button states, and color systems for Codoid internal templates.
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-white/3 border border-white/5 mt-2">
                    <h4 className="text-[10px] font-bold font-orbitron tracking-wider text-white mb-2">SPECIALIZATIONS</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {['UI/UX Design', 'Figma', 'Drone Simulator Project', 'HRMS Design', 'Healthcare UI', 'Wireframing', 'Design Systems'].map(spec => (
                        <span key={spec} className="text-[9px] font-orbitron px-2 py-0.5 rounded bg-amber-950/20 border border-amber-500/20 text-amber-400">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== EDUCATION OVERLAY ==================== */}
            {activeOverlay === 'education' && (
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-xs font-semibold tracking-[0.2em] text-cyan-400 font-orbitron">ACADEMIC JOURNEY</span>
                  <h2 className="text-3xl font-extrabold tracking-tight font-orbitron mt-1">Education Campus</h2>
                  <p className="text-xs text-white/40 mt-1">Undergraduate Timeline & Achievements</p>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="p-5 rounded-2xl bg-white/3 border border-white/5 flex flex-col gap-4 relative">
                    <div className="absolute top-5 right-5 text-cyan-400 opacity-20">
                      <BookOpen size={48} />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold font-orbitron text-white">SSN College of Engineering</h3>
                      <p className="text-xs text-cyan-400 font-orbitron mt-0.5">B.E. Computer Science Engineering</p>
                      <p className="text-[10px] text-white/40 font-orbitron mt-1">2024 – 2028 (Undergraduate)</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/50">Current Cumulative GPA:</span>
                      <span className="text-sm font-bold font-orbitron text-cyan-400">8.33 / 10.0</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <h4 className="text-xs font-bold font-orbitron text-white tracking-wider">ACADEMIC HIGHLIGHTS</h4>
                      <ul className="text-xs text-white/60 leading-relaxed list-disc pl-4 flex flex-col gap-1.5">
                        <li>Active member of the SSN ACM Student Chapter technical division.</li>
                        <li>Selected to contribute to design team templates and competitive developer hackathons.</li>
                        <li>Coursework: Data Structures, Advanced Algorithms, Digital Electronics, AI Fundamentals.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== ACHIEVEMENTS HALL OF FAME OVERLAY ==================== */}
            {activeOverlay === 'achievements' && (
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-xs font-semibold tracking-[0.2em] text-cyan-400 font-orbitron">THE MUSEUM</span>
                  <h2 className="text-3xl font-extrabold tracking-tight font-orbitron mt-1">Hall of Achievements</h2>
                  <p className="text-xs text-white/40 mt-1">Overview of credentials, hackathons, and design credentials.</p>
                </div>

                <div className="flex gap-4">
                  {/* Left Side Pedestal lists */}
                  <div className="flex flex-col gap-1.5 w-1/3 border-r border-white/5 pr-3">
                    <span className="text-[8px] font-bold text-white/30 font-orbitron tracking-widest mb-1">PEDESTALS</span>
                    {achievementsData.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => { audio.playClick(); setSelectedAchievement(a.id); }}
                        className={`text-[9.5px] text-left px-2 py-2 rounded-lg font-orbitron tracking-wider truncate cursor-pointer border ${
                          selectedAchievement === a.id 
                            ? 'bg-white/5 text-cyan-400 border-cyan-500/20 font-bold' 
                            : 'text-white/40 border-transparent hover:text-white'
                        }`}
                      >
                        {a.name}
                      </button>
                    ))}
                  </div>

                  {/* Right Side Pedestal Detail */}
                  <div className="flex-1 flex flex-col gap-4">
                    {achievementsData.map((a) => {
                      if (a.id !== selectedAchievement) return null;
                      return (
                        <motion.div
                          key={a.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex flex-col gap-4"
                        >
                          <div className="p-4 rounded-xl border border-white/5 bg-[#101010] relative overflow-hidden flex flex-col gap-3">
                            <div className="absolute top-4 right-4 text-cyan-400/20">
                              <Trophy size={40} />
                            </div>

                            <div>
                              <span className="text-[8px] font-bold font-orbitron text-cyan-400/80 tracking-widest">TROPHY CORE</span>
                              <h3 className="text-base font-extrabold font-orbitron text-white leading-normal mt-1">{a.name}</h3>
                              <p className="text-[10px] text-white/40 font-orbitron">{a.subtitle}</p>
                            </div>

                            <p className="text-xs text-white/60 leading-relaxed">
                              {a.detail}
                            </p>

                            <div className="p-3 rounded-lg bg-cyan-950/10 border border-cyan-500/20 flex justify-between items-center text-[10px] font-orbitron">
                              <span className="text-cyan-300">METRIC Telemetry</span>
                              <span className="font-bold text-white">{a.metrics}</span>
                            </div>

                            {/* Link to showcase if clicking Design Contributions */}
                            {a.id === 'designs' && (
                              <button
                                onClick={() => {
                                  audio.playClick();
                                  setCurrentZone('projects');
                                  setActiveProjectsTab('design');
                                }}
                                className="mt-2 w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-[10px] tracking-widest font-bold font-orbitron rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <ExternalLink size={12} />
                                <span>OPEN DESIGN SHOWCASE GALLERY</span>
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ==================== CONTACT OVERLAY ==================== */}
            {activeOverlay === 'contact' && (
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-xs font-semibold tracking-[0.2em] text-cyan-400 font-orbitron">THE OBSERVATORY</span>
                  <h2 className="text-3xl font-extrabold tracking-tight font-orbitron mt-1">Get In Touch</h2>
                  <p className="text-xs text-white/40 mt-1">Submit your parameters. Direct pipeline open for partnerships, projects, or feedback.</p>
                </div>

                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-2xl bg-cyan-950/10 border border-cyan-500/30 flex flex-col items-center text-center gap-3 mt-4"
                  >
                    <CheckCircle size={44} className="text-cyan-400 animate-pulse" />
                    <h3 className="text-lg font-bold font-orbitron text-white">TRANSMISSION SECURED</h3>
                    <p className="text-xs text-white/50 leading-relaxed max-w-sm">
                      Thank you for contacting, your message parameters have been routed successfully. Abdiel will align shortly!
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold font-orbitron tracking-wider text-white/60">YOUR NAME</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="px-4 py-3 rounded-xl bg-white/3 border border-white/8 focus:border-cyan-400 focus:bg-white/6 text-white text-xs outline-none transition-all font-orbitron"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold font-orbitron tracking-wider text-white/60">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-4 py-3 rounded-xl bg-white/3 border border-white/8 focus:border-cyan-400 focus:bg-white/6 text-white text-xs outline-none transition-all font-orbitron"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold font-orbitron tracking-wider text-white/60">MESSAGE DETAILS</label>
                      <textarea
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        className="px-4 py-3 rounded-xl bg-white/3 border border-white/8 focus:border-cyan-400 focus:bg-white/6 text-white text-xs outline-none transition-all font-orbitron resize-none"
                        placeholder="Briefly detail your proposal..."
                      />
                    </div>

                    <button
                      type="submit"
                      onMouseEnter={() => audio.playHover()}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs tracking-widest font-orbitron flex items-center justify-center gap-2 cursor-pointer transition-all mt-2 shadow-[0_4px_15px_rgba(0,240,255,0.2)]"
                    >
                      <Sparkles size={14} />
                      <span>LAUNCH TRANSMISSION</span>
                    </button>
                  </form>
                )}

                {/* Social links */}
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
                  <h4 className="text-[9px] font-bold font-orbitron tracking-widest text-white/40">DIRECT NETWORK LINKS</h4>
                  
                  <div className="flex gap-4">
                    {[
                      { icon: (
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.579 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      ), href: "https://github.com/abdiel-samuel", label: "GitHub" },
                      { icon: <Mail size={16} />, href: "mailto:abdiel.samuel.magdi@gmail.com", label: "Email" },
                      { icon: <ExternalLink size={16} />, href: "https://linkedin.com", label: "LinkedIn" }
                    ].map((soc, idx) => (
                      <a
                        key={idx}
                        href={soc.href}
                        target="_blank"
                        rel="noreferrer"
                        onMouseEnter={() => audio.playHover()}
                        className="flex items-center gap-1.5 text-xs text-white/50 hover:text-cyan-400 transition-colors"
                        title={soc.label}
                      >
                        {soc.icon}
                        <span className="font-orbitron text-[10px]">{soc.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* ==================== SECRET DEVELOPER JOKE OVERLAY ==================== */}
            {activeOverlay === 'achievements' && showSecretMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-purple-300 text-xs flex flex-col gap-3"
              >
                <div className="flex items-center gap-2 text-purple-400 font-bold font-orbitron">
                  <Sparkles size={16} className="animate-spin" />
                  <span>DEVELOPER JOKE UNLOCKED (3 GEMS FOUND)</span>
                </div>
                <p className="italic leading-relaxed font-orbitron">
                  "There are 10 types of people in the world: those who understand binary, those who don't, and those who didn't expect this joke to be base-3."
                </p>
                <div className="text-[10px] text-purple-400/60">
                  Congratulations on exploring every corner of Abdiel's digital city! Feel free to toggle secret mode by clicking the HUD badges anytime.
                </div>
              </motion.div>
            )}

            {/* ==================== UI/UX STUDIO OVERLAY ==================== */}
            {activeOverlay === 'uiux' && (
              <div className="flex flex-col gap-6">
                {/* Header */}
                <div>
                  <span className="text-xs font-semibold tracking-[0.2em] text-purple-400 font-orbitron">INTERACTIVE DESIGN LAB</span>
                  <h2 className="text-3xl font-extrabold tracking-tight font-orbitron mt-1">UI/UX Studio</h2>
                  <p className="text-xs text-white/40 mt-1">Explore interactive Figma prototypes and design case studies.</p>
                </div>

                {/* Gallery Mode */}
                {figmaViewState === 'gallery' && (
                  <>
                    {/* Filter + View Toggle */}
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                        {['All', 'Website', 'Dashboard', 'Mobile App', 'Healthcare', 'Enterprise', 'Landing Page'].map((f) => (
                          <button
                            key={f}
                            onClick={() => { audio.playClick(); setFigmaFilter(f); }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-orbitron tracking-wider cursor-pointer border whitespace-nowrap ${
                              figmaFilter === f
                                ? 'bg-purple-500/20 border-purple-400 text-purple-400'
                                : 'bg-white/3 border-white/5 text-white/50 hover:text-white hover:border-white/20'
                            }`}
                          >
                            {f.toUpperCase()}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-1 ml-2 flex-shrink-0">
                        <button
                          onClick={() => setFigmaViewMode('grid')}
                          className={`p-1.5 rounded-lg border transition-all ${figmaViewMode === 'grid' ? 'border-purple-400/30 text-purple-400' : 'border-white/5 text-white/30'}`}
                        >
                          <Grid3X3 size={14} />
                        </button>
                        <button
                          onClick={() => setFigmaViewMode('list')}
                          className={`p-1.5 rounded-lg border transition-all ${figmaViewMode === 'list' ? 'border-purple-400/30 text-purple-400' : 'border-white/5 text-white/30'}`}
                        >
                          <LayoutList size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Project Cards */}
                    <div className={figmaViewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'flex flex-col gap-3'}>
                      {figmaProjects
                        .filter(p => figmaFilter === 'All' || p.category.includes(figmaFilter) || p.tags.some(t => t.includes(figmaFilter)))
                        .map((project) => (
                          <div
                            key={project.id}
                            onMouseEnter={() => audio.playHover()}
                            className={`rounded-xl bg-white/3 border border-white/5 hover:border-purple-500/30 hover:bg-white/6 transition-all duration-300 cursor-pointer group overflow-hidden ${
                              figmaViewMode === 'list' ? 'flex items-center gap-4 p-4' : 'flex flex-col'
                            }`}
                          >
                            {/* Preview Box */}
                            <div
                              className={`relative overflow-hidden flex items-center justify-center border-b border-white/5 ${
                                figmaViewMode === 'list' ? 'w-20 h-16 rounded-lg border' : 'w-full aspect-[16/10]'
                              }`}
                              style={{ background: `linear-gradient(135deg, ${project.colors[0]}15, ${project.colors[1]}15)` }}
                              onClick={() => { audio.playClick(); setSelectedFigmaProject(project.id); setFigmaViewState('detail'); }}
                            >
                              <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:10px_10px]" />
                              <Palette size={figmaViewMode === 'list' ? 16 : 28} className="text-white/15 group-hover:text-purple-400/50 transition-all" />
                            </div>

                            {/* Info */}
                            <div className={figmaViewMode === 'list' ? 'flex-1 min-w-0' : 'p-4'}>
                              <div className="flex justify-between items-start gap-2">
                                <h4
                                  className="text-xs font-bold font-orbitron text-white group-hover:text-purple-400 transition-colors cursor-pointer truncate"
                                  onClick={() => { audio.playClick(); setSelectedFigmaProject(project.id); setFigmaViewState('detail'); }}
                                >
                                  {project.title}
                                </h4>
                                <span className="px-1.5 py-0.5 text-[7px] font-bold tracking-wider font-orbitron text-purple-400 bg-purple-950/20 border border-purple-500/20 rounded whitespace-nowrap flex-shrink-0">
                                  {project.tags[0]}
                                </span>
                              </div>
                              <p className="text-[10px] text-white/40 mt-1 line-clamp-2">{project.description}</p>
                              
                              {/* Action buttons */}
                              <div className="flex gap-2 mt-3">
                                <button
                                  onClick={() => { audio.playClick(); setSelectedFigmaProject(project.id); setFigmaViewState('embed'); }}
                                  className="px-2 py-1 rounded text-[8px] font-bold font-orbitron tracking-wider bg-purple-500/20 border border-purple-500/20 text-purple-300 hover:text-purple-200 transition-all"
                                >
                                  VIEW DESIGN
                                </button>
                                <a
                                  href={project.figmaUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-2 py-1 rounded text-[8px] font-bold font-orbitron tracking-wider bg-white/5 border border-white/5 text-white/50 hover:text-white transition-all flex items-center gap-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  FIGMA <ExternalLink size={8} />
                                </a>
                                <button
                                  onClick={() => { audio.playClick(); setSelectedFigmaProject(project.id); setFigmaViewState('casestudy'); }}
                                  className="px-2 py-1 rounded text-[8px] font-bold font-orbitron tracking-wider bg-white/5 border border-white/5 text-white/50 hover:text-white transition-all"
                                >
                                  CASE STUDY
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </>
                )}

                {/* Detail View */}
                {figmaViewState === 'detail' && activeFigma && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
                    <button onClick={() => { audio.playClick(); setFigmaViewState('gallery'); }} className="text-xs font-orbitron font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 cursor-pointer">
                      <ArrowRight size={14} className="rotate-180" /> BACK TO GALLERY
                    </button>

                    <div>
                      <span className="px-2 py-0.5 text-[9px] font-semibold tracking-wider font-orbitron text-purple-400 bg-purple-950/20 border border-purple-500/30 rounded-md">{activeFigma.category}</span>
                      <h3 className="text-2xl font-extrabold font-orbitron mt-2">{activeFigma.title}</h3>
                      <p className="text-xs text-white/60 mt-2 leading-relaxed">{activeFigma.description}</p>
                    </div>

                    {/* Figma Embed Preview */}
                    <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border border-white/10 relative bg-[#101010]">
                      <iframe
                        src={activeFigma.embedUrl}
                        className="w-full h-full border-0"
                        allowFullScreen
                        title={activeFigma.title}
                      />
                      <button
                        onClick={() => { setFigmaViewState('embed'); setFigmaFullscreen(true); }}
                        className="absolute top-3 right-3 p-2 rounded-lg bg-black/60 border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all cursor-pointer"
                      >
                        <Maximize2 size={14} />
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button onClick={() => { audio.playClick(); setFigmaViewState('embed'); }} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-400 hover:to-blue-500 font-semibold text-xs tracking-wider font-orbitron flex items-center gap-2 cursor-pointer">
                        <Palette size={14} /> VIEW INTERACTIVE DESIGN
                      </button>
                      <a href={activeFigma.figmaUrl} target="_blank" rel="noreferrer" className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs tracking-wider font-orbitron flex items-center gap-2 cursor-pointer">
                        OPEN IN FIGMA <ExternalLink size={12} />
                      </a>
                      <button onClick={() => { audio.playClick(); setFigmaViewState('casestudy'); }} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs tracking-wider font-orbitron flex items-center gap-2 cursor-pointer">
                        <BookOpen size={14} /> CASE STUDY
                      </button>
                    </div>

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-white/3 border border-white/5">
                        <h5 className="text-[9px] font-bold font-orbitron text-purple-400 tracking-wider mb-1.5">COLOR PALETTE</h5>
                        <div className="flex gap-1.5">
                          {activeFigma.colors.map(c => (
                            <div key={c} className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#101010] border border-white/5">
                              <span className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: c }} />
                              <span className="text-[7px] font-orbitron text-white/50">{c.toUpperCase()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/3 border border-white/5">
                        <h5 className="text-[9px] font-bold font-orbitron text-purple-400 tracking-wider mb-1.5">TOOLS & FONTS</h5>
                        <div className="flex gap-1 flex-wrap">
                          {[...activeFigma.tools, ...activeFigma.fonts].map(t => (
                            <span key={t} className="px-1.5 py-0.5 rounded text-[8px] font-orbitron bg-[#101010] border border-white/5 text-white/50">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Figma Embed Fullscreen */}
                {figmaViewState === 'embed' && activeFigma && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <button onClick={() => { audio.playClick(); setFigmaViewState('detail'); setFigmaFullscreen(false); }} className="text-xs font-orbitron font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 cursor-pointer">
                        <ArrowRight size={14} className="rotate-180" /> BACK
                      </button>
                      <div className="flex items-center gap-2">
                        <a href={activeFigma.figmaUrl} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-bold font-orbitron text-white/50 hover:text-white flex items-center gap-1">
                          OPEN IN FIGMA <ExternalLink size={10} />
                        </a>
                        <button
                          onClick={() => setFigmaFullscreen(!figmaFullscreen)}
                          className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-white/50 hover:text-white transition-all"
                        >
                          {figmaFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                        </button>
                      </div>
                    </div>
                    <div className={`w-full rounded-xl overflow-hidden border border-white/10 bg-[#101010] transition-all ${figmaFullscreen ? 'aspect-[16/9]' : 'aspect-[16/10]'}`}>
                      <iframe src={activeFigma.embedUrl} className="w-full h-full border-0" allowFullScreen title={activeFigma.title} />
                    </div>
                    <p className="text-[10px] text-white/30 text-center font-orbitron tracking-wider">INTERACTIVE FIGMA PREVIEW — {activeFigma.title.toUpperCase()}</p>
                  </motion.div>
                )}

                {/* Premium Case Study */}
                {figmaViewState === 'casestudy' && activeFigma && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
                    <button onClick={() => { audio.playClick(); setFigmaViewState('detail'); }} className="text-xs font-orbitron font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 cursor-pointer">
                      <ArrowRight size={14} className="rotate-180" /> BACK TO PROJECT
                    </button>

                    {/* Hero Banner */}
                    <div className="w-full aspect-[3/1] rounded-xl overflow-hidden relative flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${activeFigma.colors[0]}30, ${activeFigma.colors[1]}30)` }}>
                      <div className="absolute inset-0 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] [background-size:14px_14px]" />
                      <div className="text-center relative z-10">
                        <span className="text-[9px] font-bold tracking-[0.3em] font-orbitron text-purple-400">CASE STUDY</span>
                        <h3 className="text-xl font-extrabold font-orbitron text-white mt-1">{activeFigma.title}</h3>
                        <p className="text-[10px] text-white/50 mt-1">{activeFigma.category}</p>
                      </div>
                    </div>

                    {/* Design Overview */}
                    <div className="flex flex-col gap-2">
                      <h4 className="text-[10px] font-bold font-orbitron text-purple-400 tracking-wider">DESIGN OVERVIEW</h4>
                      <p className="text-xs text-white/70 leading-relaxed pl-4 border-l border-white/10">{activeFigma.designOverview}</p>
                    </div>

                    {/* Problem Statement */}
                    <div className="flex flex-col gap-2">
                      <h4 className="text-[10px] font-bold font-orbitron text-purple-400 tracking-wider flex items-center gap-1.5"><Terminal size={12} /> PROBLEM STATEMENT</h4>
                      <p className="text-xs text-white/70 leading-relaxed pl-4 border-l border-white/10">{activeFigma.problem}</p>
                    </div>

                    {/* Target Users */}
                    <div className="flex flex-col gap-2">
                      <h4 className="text-[10px] font-bold font-orbitron text-purple-400 tracking-wider">TARGET USERS</h4>
                      <p className="text-xs text-white/70 leading-relaxed pl-4 border-l border-white/10">{activeFigma.targetUsers}</p>
                    </div>

                    {/* Placeholder Sections */}
                    {activeFigma.caseStudySections.map((sec, idx) => (
                      <div key={idx} className="flex flex-col gap-2">
                        <h4 className="text-[10px] font-bold font-orbitron text-purple-400 tracking-wider">{sec.title.toUpperCase()}</h4>
                        <div className={`text-xs leading-relaxed pl-4 border-l ${sec.placeholder ? 'border-amber-500/30 text-amber-300/60 italic' : 'border-white/10 text-white/70'}`}>
                          {sec.content}
                          {sec.placeholder && <span className="ml-2 px-1.5 py-0.5 text-[7px] font-orbitron bg-amber-950/20 border border-amber-500/20 rounded text-amber-400">PLACEHOLDER</span>}
                        </div>
                      </div>
                    ))}

                    {/* Design System */}
                    <div className="p-4 rounded-xl bg-white/3 border border-white/5">
                      <h4 className="text-[10px] font-bold font-orbitron text-purple-400 tracking-wider mb-3">DESIGN SYSTEM</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <h5 className="text-[8px] font-bold font-orbitron text-white/40 tracking-wider mb-1.5">PALETTE</h5>
                          <div className="flex gap-1.5 flex-wrap">
                            {activeFigma.colors.map(c => (
                              <div key={c} className="flex items-center gap-1 px-1.5 py-1 rounded bg-[#0a0a0a] border border-white/5">
                                <span className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: c }} />
                                <span className="text-[7px] font-orbitron text-white/50">{c}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="text-[8px] font-bold font-orbitron text-white/40 tracking-wider mb-1.5">TYPOGRAPHY</h5>
                          <div className="flex gap-1 flex-wrap">
                            {activeFigma.fonts.map(f => (
                              <span key={f} className="px-2 py-1 rounded bg-[#0a0a0a] border border-white/5 text-[8px] font-orbitron text-white/60">{f}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Prototype Embed */}
                    <div className="flex flex-col gap-2">
                      <h4 className="text-[10px] font-bold font-orbitron text-purple-400 tracking-wider">INTERACTIVE PROTOTYPE</h4>
                      <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border border-white/10 bg-[#101010]">
                        <iframe src={activeFigma.embedUrl} className="w-full h-full border-0" allowFullScreen title={activeFigma.title} />
                      </div>
                      <a href={activeFigma.figmaUrl} target="_blank" rel="noreferrer" className="self-center px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/20 text-purple-300 text-[9px] font-bold font-orbitron tracking-wider flex items-center gap-1.5 hover:text-purple-200 transition-all">
                        OPEN IN FIGMA <ExternalLink size={10} />
                      </a>
                    </div>

                    {/* Final Outcome */}
                    <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-950/10">
                      <h4 className="text-[10px] font-bold font-orbitron text-purple-300 tracking-wider mb-2">FINAL OUTCOME</h4>
                      <p className="text-xs text-white/70 leading-relaxed">{activeFigma.outcome}</p>
                    </div>

                    {/* Key Learnings */}
                    <div className="flex flex-col gap-2">
                      <h4 className="text-[10px] font-bold font-orbitron text-purple-400 tracking-wider">KEY LEARNINGS</h4>
                      <ul className="text-xs text-white/70 pl-4 list-disc flex flex-col gap-1.5">
                        {activeFigma.keyLearnings.map((l, idx) => (
                          <li key={idx}>{l}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

          </div>

          {/* Footer details */}
          <div className="px-6 py-4 bg-[#0a0a0a] border-t border-white/5 flex justify-between items-center text-[9px] text-white/30 tracking-[0.2em] font-orbitron">
            <span>SECURE_DATA_TRANSMISSION</span>
            <span>SAMUEL_MAGDI_PORTFOLIO</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
export default OverlaysContainer;
