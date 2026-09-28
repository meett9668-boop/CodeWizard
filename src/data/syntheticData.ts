import {
  Member,
  EventItem,
  ProjectItem,
  AchievementItem,
  AnnouncementItem,
  FacultyMember,
  HistoryMilestone,
  NotificationItem,
  EventRegistration,
  PromotionHistory,
  CommitteeTask,
  CommitteeHandoverRecord,
  ActivityItem
} from '../types';

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm-1',
    name: 'Aarav Sharma',
    role: 'Student Representative',
    department: 'Computer Science & Engineering',
    branch: 'CSE',
    year: '4th Year',
    email: 'aarav.sharma@git.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Lead strategist and liaison between student body and faculty. Passionate about distributed systems.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    status: 'Active',
    joinedDate: '2023-08-15',
    team: 'Operations',
    skills: ['Leadership', 'Strategic Planning', 'Kubernetes', 'Public Speaking'],
    eventsContributed: ['HACKVERSE 2026', 'CodeSprint 2025'],
    projectsContributed: ['GCOS Operating System', 'Autonomous Quadcopter Swarm'],
    tasksCompleted: 24,
    attendanceRate: 98
  },
  {
    id: 'm-2',
    name: 'Ananya Verma',
    role: 'Club Head',
    department: 'Information Science & Engineering',
    branch: 'ISE',
    year: '4th Year',
    email: 'ananya.v@git.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    bio: 'President of GIT Club. Spearheading tech culture, hackathons, and industry outreach.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    status: 'Active',
    joinedDate: '2023-08-15',
    team: 'Technical',
    skills: ['Executive Leadership', 'System Design', 'Event Governance', 'Full Stack'],
    eventsContributed: ['HACKVERSE 2026', 'Generative AI Workshop', 'SIH 2025 Grand Finale'],
    projectsContributed: ['GCOS Operating System'],
    tasksCompleted: 38,
    attendanceRate: 100
  },
  {
    id: 'm-3',
    name: 'Rohan Deshmukh',
    role: 'Committee Head',
    department: 'Computer Science & Engineering',
    branch: 'CSE',
    year: '3rd Year',
    email: 'rohan.d@git.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Technical Lead. Full-stack architect and cloud infrastructure expert.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    status: 'Active',
    joinedDate: '2024-01-10',
    team: 'Technical',
    skills: ['Go', 'TypeScript', 'Docker', 'GraphQL'],
    eventsContributed: ['CodeSprint 2025', 'Generative AI Workshop'],
    projectsContributed: ['GCOS Operating System'],
    tasksCompleted: 19,
    attendanceRate: 95
  },
  {
    id: 'm-4',
    name: 'Priya Kulkarni',
    role: 'Committee Head',
    department: 'Electronics & Communication',
    branch: 'ECE',
    year: '3rd Year',
    email: 'priya.k@git.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Events Lead. Expert in organizing national-level hackathons and bootcamps.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    status: 'Active',
    joinedDate: '2024-01-10',
    team: 'Events',
    skills: ['Event Production', 'Budget Management', 'Sponsorship Relations', 'IoT'],
    eventsContributed: ['HACKVERSE 2026', 'Summer Project Expo'],
    projectsContributed: ['Campus Mesh IoT'],
    tasksCompleted: 31,
    attendanceRate: 97
  },
  {
    id: 'm-5',
    name: 'Ketan Mehta',
    role: 'Committee Head',
    department: 'Computer Science & Engineering',
    branch: 'CSE',
    year: '3rd Year',
    email: 'ketan.m@git.edu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Design & Brand Lead. Crafting pixel-perfect UI/UX and visual identities.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    status: 'Active',
    joinedDate: '2024-02-01',
    team: 'Design & Media',
    skills: ['Figma', 'Design Systems', '3D Blender', 'Motion Graphics'],
    eventsContributed: ['HACKVERSE 2026', 'Generative AI Workshop'],
    projectsContributed: ['OpenCode Benchmarking Suite'],
    tasksCompleted: 22,
    attendanceRate: 91
  },
  {
    id: 'm-6',
    name: 'Sneha Patil',
    role: 'Committee Member',
    department: 'Information Science',
    branch: 'ISE',
    year: '2nd Year',
    email: 'sneha.p@git.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Frontend enthusiast working on React and Tailwind components. Top contributor in 2025 hackathon.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    status: 'Active',
    joinedDate: '2024-09-01',
    team: 'Technical',
    skills: ['React', 'TailwindCSS', 'TypeScript', 'UI Engineering'],
    eventsContributed: ['HACKVERSE 2026'],
    projectsContributed: ['GCOS Operating System'],
    tasksCompleted: 16,
    attendanceRate: 94,
    readyForPromotion: true,
    promotionRecommendation: {
      nextRole: 'Committee Head',
      reason: 'Outstanding performance leading the GIT Hack 2.0 web infrastructure.',
      contributions: ['Built Club Portal v1', 'Mentored 40+ 1st year students', 'Organized Web3 Workshop']
    }
  },
  {
    id: 'm-7',
    name: 'Vikram Joshi',
    role: 'Committee Member',
    department: 'Computer Science & Engineering',
    branch: 'CSE',
    year: '2nd Year',
    email: 'vikram.j@git.edu',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    bio: 'DevOps & Backend practitioner. Managing Kubernetes cluster for internal projects.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    status: 'Active',
    joinedDate: '2024-09-01',
    team: 'Technical',
    skills: ['Rust', 'Docker', 'Linux Kernel', 'CI/CD'],
    eventsContributed: ['Rust & Systems Session'],
    projectsContributed: ['Neural Vision Gate Verification'],
    tasksCompleted: 14,
    attendanceRate: 92,
    readyForPromotion: true,
    promotionRecommendation: {
      nextRole: 'Committee Head',
      reason: 'Demonstrated exceptional leadership in managing cloud deployments for club events.',
      contributions: ['Automated CI/CD deployment', 'Maintained 99.9% uptime during Hackathon', 'Spearheaded Rust session']
    }
  },
  {
    id: 'm-8',
    name: 'Diya Nair',
    role: 'Committee Member',
    department: 'Artificial Intelligence & Data Science',
    branch: 'AI&DS',
    year: '2nd Year',
    email: 'diya.n@git.edu',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    bio: 'AI/ML Researcher. Organizes Deep Learning reading groups and workshops.',
    status: 'Active',
    joinedDate: '2024-10-15',
    team: 'Events',
    skills: ['PyTorch', 'TensorFlow', 'LLMs', 'Computer Vision'],
    eventsContributed: ['Generative AI Workshop'],
    projectsContributed: ['Neural Vision Gate Verification'],
    tasksCompleted: 12,
    attendanceRate: 88
  },
  {
    id: 'm-9',
    name: 'Aditya Rao',
    role: 'Member',
    department: 'CSE',
    branch: 'CSE',
    year: '1st Year',
    email: 'aditya.r@git.edu',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    bio: 'Active participant in competitive programming and algorithmic challenges.',
    status: 'Active',
    joinedDate: '2025-01-20',
    team: 'Technical',
    skills: ['C++', 'Algorithms', 'Data Structures', 'Python'],
    eventsContributed: ['CodeSprint 2025'],
    projectsContributed: ['OpenCode Benchmarking Suite'],
    tasksCompleted: 6,
    attendanceRate: 90
  },
  {
    id: 'm-10',
    name: 'Meera Hegde',
    role: 'Member',
    department: 'ECE',
    branch: 'ECE',
    year: '1st Year',
    email: 'meera.h@git.edu',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bio: 'Hardware-software co-design enthusiast and IoT builder.',
    status: 'Active',
    joinedDate: '2025-02-05',
    team: 'Public Relations',
    skills: ['Arduino', 'Social Media', 'Content Creation', 'Hardware'],
    eventsContributed: ['Summer Project Expo'],
    projectsContributed: ['Campus Mesh IoT'],
    tasksCompleted: 5,
    attendanceRate: 85
  }
];

export const INITIAL_PROMOTIONS_HISTORY: PromotionHistory[] = [
  {
    id: 'ph-1',
    memberId: 'm-3',
    memberName: 'Rohan Deshmukh',
    memberAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    fromRole: 'Committee Member',
    toRole: 'Committee Head',
    reason: 'Exemplary execution of CodeSprint 2025 and technical curriculum development.',
    date: '2025-08-10',
    promotedBy: 'Aarav Sharma'
  },
  {
    id: 'ph-2',
    memberId: 'm-4',
    memberName: 'Priya Kulkarni',
    memberAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    fromRole: 'Committee Member',
    toRole: 'Committee Head',
    reason: 'Successfully managed sponsors and logistics for National TechSummit.',
    date: '2025-08-12',
    promotedBy: 'Ananya Verma'
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'e-1',
    title: 'HACKVERSE 2026: 36-Hour National Hackathon',
    category: 'Hackathon',
    date: '2026-10-15',
    time: '09:00 AM - 09:00 PM',
    venue: 'Main Auditorium & Innovation Lab',
    speaker: 'Industry Mentors from Google & Microsoft',
    organizer: 'GIT Club Core Committee',
    description: 'The flagship hackathon of GIT Club! 36 hours of continuous coding, product design, hardware hacking, and pitching to top VC mentors. Win prizes worth ₹2,50,000.',
    poster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    registeredCount: 385,
    capacity: 400,
    deadline: '2026-10-10',
    status: 'Registration Open',
    facultyApprovalStatus: 'Approved',
    facultyReviewer: 'Dr. Suresh V. Patil',
    facultyReviewDate: '2026-09-18',
    facultyRemarks: 'Auditorium allocated, verified lab network and safety guidelines.',
    featured: true,
    tags: ['Hackathon', 'AI', 'Full Stack', 'Web3', 'Prize Money']
  },
  {
    id: 'e-2',
    title: 'Generative AI & LLM Systems Workshop',
    category: 'Workshop',
    date: '2026-10-02',
    time: '02:00 PM - 06:00 PM',
    venue: 'Computer Center Lab 3',
    speaker: 'Dr. Ramesh K., Senior AI Researcher',
    organizer: 'AI & Technical Wing',
    description: 'Hands-on masterclass building custom RAG pipelines, fine-tuning Llama 3 models, and deploying production AI agents using LangChain.',
    poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    registeredCount: 145,
    capacity: 150,
    deadline: '2026-10-01',
    status: 'Registration Open',
    facultyApprovalStatus: 'Approved',
    facultyReviewer: 'Prof. Radhika Kulkarni',
    facultyReviewDate: '2026-09-22',
    facultyRemarks: 'Lab 3 reservation approved with GPU server allocation.',
    featured: true,
    tags: ['AI', 'Python', 'LLM', 'Hands-on']
  },
  {
    id: 'e-3',
    title: 'Rust & Systems Programming Deep Dive',
    category: 'Technical Session',
    date: '2026-10-22',
    time: '04:00 PM - 06:30 PM',
    venue: 'Seminar Hall B',
    speaker: 'Vikram Joshi (GIT Tech Lead)',
    organizer: 'Technical Wing',
    description: 'Learn memory safety without garbage collection, concurrency primitives, and why tech giants are rewriting core infrastructure in Rust.',
    poster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    registeredCount: 82,
    capacity: 120,
    deadline: '2026-10-20',
    status: 'Faculty Review',
    facultyApprovalStatus: 'Pending',
    facultyRemarks: 'Awaiting syllabus approval and hall availability confirmation.',
    featured: false,
    tags: ['Rust', 'Systems', 'Performance']
  },
  {
    id: 'e-4',
    title: 'Cloud Native & Kubernetes Bootcamp',
    category: 'Workshop',
    date: '2026-09-12',
    time: '10:00 AM - 04:00 PM',
    venue: 'Cloud Computing Lab',
    speaker: 'DevOps Guild Speakers',
    organizer: 'Infrastructure Wing',
    description: 'Deep dive into Docker containerization, Helm charts, ingress controllers, and deploying microservices on GCP.',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    registeredCount: 130,
    capacity: 130,
    deadline: '2026-09-10',
    status: 'Completed',
    facultyApprovalStatus: 'Approved',
    facultyReviewer: 'Dr. Suresh V. Patil',
    facultyReviewDate: '2026-08-30',
    featured: false,
    tags: ['DevOps', 'Docker', 'K8s']
  },
  {
    id: 'e-5',
    title: 'GIT Club Open Source Summer Project Expo',
    category: 'Project Expo',
    date: '2026-08-25',
    time: '11:00 AM - 05:00 PM',
    venue: 'Campus Open Plaza',
    speaker: 'Student Project Leaders',
    organizer: 'Project Management Cell',
    description: 'Exhibition of 12 internal student-led projects built over 3 months, featuring IoT prototypes, SaaS platforms, and ML engines.',
    poster: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    registeredCount: 260,
    capacity: 300,
    deadline: '2026-08-23',
    status: 'Completed',
    facultyApprovalStatus: 'Approved',
    facultyReviewer: 'Prof. Radhika Kulkarni',
    facultyReviewDate: '2026-08-15',
    featured: false,
    tags: ['Expo', 'Projects', 'Showcase']
  }
];

export const INITIAL_REGISTRATIONS: EventRegistration[] = [
  {
    id: 'reg-1',
    eventId: 'e-1',
    eventTitle: 'HACKVERSE 2026: 36-Hour National Hackathon',
    userName: 'Karthik Raja',
    userEmail: 'karthik.r@git.edu',
    branch: 'CSE',
    year: '3rd Year',
    registrationDate: '2026-09-20',
    status: 'Confirmed',
    attendance: 'Pending',
    ticketId: 'GC-GIT-2026-000184',
    ticketStatus: 'Generated',
    ticketGeneratedAt: '2026-09-20 14:32'
  },
  {
    id: 'reg-2',
    eventId: 'e-1',
    eventTitle: 'HACKVERSE 2026: 36-Hour National Hackathon',
    userName: 'Anishka Sengupta',
    userEmail: 'anishka.s@git.edu',
    branch: 'ISE',
    year: '2nd Year',
    registrationDate: '2026-09-22',
    status: 'Confirmed',
    attendance: 'Pending',
    ticketId: 'GC-GIT-2026-000185',
    ticketStatus: 'Generated',
    ticketGeneratedAt: '2026-09-22 10:14'
  },
  {
    id: 'reg-3',
    eventId: 'e-2',
    eventTitle: 'Generative AI & LLM Systems Workshop',
    userName: 'Sameer Rao',
    userEmail: 'sameer.r@git.edu',
    branch: 'AI&DS',
    year: '3rd Year',
    registrationDate: '2026-09-25',
    status: 'Confirmed',
    attendance: 'Pending',
    ticketId: 'GC-GIT-2026-000186',
    ticketStatus: 'Generated',
    ticketGeneratedAt: '2026-09-25 16:45'
  },
  {
    id: 'reg-4',
    eventId: 'e-4',
    eventTitle: 'Cloud Native & Kubernetes Bootcamp',
    userName: 'Rahul Bhat',
    userEmail: 'rahul.b@git.edu',
    branch: 'CSE',
    year: '4th Year',
    registrationDate: '2026-09-01',
    status: 'Confirmed',
    attendance: 'Attended',
    ticketId: 'GC-GIT-2026-000140',
    ticketStatus: 'Generated',
    ticketGeneratedAt: '2026-09-01 09:20'
  }
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'p-1',
    title: 'GIT Club Operating System (GCOS)',
    description: 'Unified digital command center, event registration engine, and member credentials manager built for campus technical clubs.',
    team: ['Aarav Sharma', 'Rohan Deshmukh', 'Sneha Patil'],
    lead: 'Rohan Deshmukh',
    technologies: ['React', 'TypeScript', 'Tailwind', 'Recharts'],
    year: '2026',
    status: 'Development',
    progress: 88,
    githubUrl: 'https://github.com/gitclub/gcos-platform',
    demoUrl: 'https://gitclub.app',
    featured: true,
    deadline: '2026-10-30',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-2',
    title: 'Campus Mesh IoT Environmental Sensor',
    description: 'Solar-powered IoT node cluster transmitting real-time air quality, noise levels, and room occupancy across campus over LoRaWAN.',
    team: ['Priya Kulkarni', 'Meera Hegde'],
    lead: 'Priya Kulkarni',
    technologies: ['ESP32', 'LoRaWAN', 'C++', 'Grafana', 'InfluxDB'],
    year: '2025',
    status: 'Completed',
    progress: 100,
    githubUrl: 'https://github.com/gitclub/lora-mesh-sensors',
    demoUrl: 'https://sensors.git.edu',
    featured: true,
    deadline: '2025-11-15',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-3',
    title: 'Neural Vision Automated Gate Verification',
    description: 'Edge-AI computer vision model using OpenCV and TensorRT to scan campus vehicle passes and verify student QR badges in <150ms.',
    team: ['Vikram Joshi', 'Diya Nair'],
    lead: 'Diya Nair',
    technologies: ['Python', 'YOLOv8', 'OpenCV', 'TensorRT', 'Raspberry Pi'],
    year: '2026',
    status: 'Development',
    progress: 65,
    githubUrl: 'https://github.com/gitclub/vision-gate-keeper',
    featured: false,
    deadline: '2026-11-20',
    image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-4',
    title: 'OpenCode Algorithmic Benchmarking Suite',
    description: 'Automated test suite and execution sandbox for evaluating student code submissions during competitive programming contests.',
    team: ['Ketan Mehta', 'Aditya Rao'],
    lead: 'Ketan Mehta',
    technologies: ['Go', 'Docker', 'Redis', 'WebSockets'],
    year: '2025',
    status: 'Completed',
    progress: 100,
    githubUrl: 'https://github.com/gitclub/opencode-evaluator',
    featured: false,
    deadline: '2025-05-10',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-5',
    title: 'Autonomous Quadcopter Swarm Mapping',
    description: 'Swarm drone mapping system creating 3D point-cloud topologies of architectural structures.',
    team: ['Aarav Sharma', 'Aditya Rao'],
    lead: 'Aarav Sharma',
    technologies: ['ROS2', 'C++', 'PX4', 'Gazebo'],
    year: '2026',
    status: 'Planning',
    progress: 20,
    githubUrl: 'https://github.com/gitclub/drone-swarm-ros',
    featured: false,
    deadline: '2027-02-15',
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_TASKS: CommitteeTask[] = [
  {
    id: 'tsk-1',
    title: 'Finalize venue and backup audio-visual cables in Auditorium',
    assignee: 'Priya Kulkarni',
    assigneeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    relatedType: 'Event',
    relatedId: 'e-1',
    relatedName: 'HACKVERSE 2026',
    priority: 'Critical',
    deadline: '2026-10-05',
    status: 'In Progress'
  },
  {
    id: 'tsk-2',
    title: 'Print official lanyard badges and speaker appreciation mementos',
    assignee: 'Ketan Mehta',
    assigneeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    relatedType: 'Event',
    relatedId: 'e-1',
    relatedName: 'HACKVERSE 2026',
    priority: 'High',
    deadline: '2026-10-08',
    status: 'To Do'
  },
  {
    id: 'tsk-3',
    title: 'Deploy edge container registry for participant project submissions',
    assignee: 'Vikram Joshi',
    assigneeAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    relatedType: 'Project',
    relatedId: 'p-1',
    relatedName: 'GCOS Platform',
    priority: 'Medium',
    deadline: '2026-10-14',
    status: 'In Progress'
  },
  {
    id: 'tsk-4',
    title: 'Submit workshop room clearance form to Dean of Academics',
    assignee: 'Ananya Verma',
    assigneeAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    relatedType: 'Event',
    relatedId: 'e-2',
    relatedName: 'Generative AI Workshop',
    priority: 'Critical',
    deadline: '2026-09-29',
    status: 'Done'
  },
  {
    id: 'tsk-5',
    title: 'Send reminder email to waitlisted participants',
    assignee: 'Sneha Patil',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    relatedType: 'Event',
    relatedId: 'e-1',
    relatedName: 'HACKVERSE 2026',
    priority: 'High',
    deadline: '2026-10-09',
    status: 'To Do'
  }
];

export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'REGISTRATIONS OPEN: HACKVERSE 2026 National Hackathon',
    category: 'Event',
    shortDescription: 'Form your teams of 3-4 members and register before Oct 10th to reserve hardware kits and early bird swags.',
    fullContent: 'We are thrilled to announce that HACKVERSE 2026 registration is officially live! This year features Tracks in AI/ML, Web3 & Decentralized Tech, Cloud Systems, and Hardware/IoT. Hardware kits will be provided on-site.',
    date: '2026-09-26',
    author: 'Priya Kulkarni',
    authorRole: 'Events Lead',
    targetAudience: 'Everyone',
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'ann-2',
    title: 'Annual Committee Recruitment Drive 2026-27 Announced',
    category: 'Recruitment',
    shortDescription: 'Applications open for 1st & 2nd year students for Technical, Design, Operations, and PR Wings.',
    fullContent: 'Are you eager to build real-world products, manage large-scale hackathons, and level up your leadership skills? GIT Club is recruiting new core members.',
    date: '2026-09-20',
    author: 'Ananya Verma',
    authorRole: 'Club Head',
    targetAudience: 'Club Members',
    status: 'Published'
  },
  {
    id: 'ann-3',
    title: 'New High-Performance AI GPU Cluster Live in Lab 3',
    category: 'General',
    shortDescription: 'Students can now request access tokens for dual NVIDIA RTX 4090 servers for deep learning model training.',
    fullContent: 'Thanks to faculty sponsorship, GIT Club members can schedule compute jobs on our local AI rig. Contact Vikram Joshi for credentials.',
    date: '2026-09-15',
    author: 'Vikram Joshi',
    authorRole: 'Committee Member',
    targetAudience: 'Club Members',
    status: 'Published'
  }
];

export const INITIAL_HANDOVER_RECORDS: CommitteeHandoverRecord[] = [
  {
    year: '2025-2026',
    previousCommittee: '2024-2025 Core Team (Lead: Rahul Sharma)',
    incomingCommittee: '2025-2026 Core Team (Lead: Ananya Verma & Aarav Sharma)',
    leadershipChanges: [
      'Ananya Verma promoted to Club Head from Technical Lead',
      'Aarav Sharma appointed Student Representative',
      'Rohan Deshmukh elevated to Technical Committee Head'
    ],
    completedEvents: 14,
    completedProjects: 8,
    archivedRecordsCount: 240,
    importantNotes: [
      'Auditorium booking must be requested at least 30 days prior through Dean of Student Affairs.',
      'Sponsor funds must be deposited into the verified college club bank ledger account with GST invoice.',
      'AWS credits renewed for Academic Year 2026-27 with $5,000 allotment.'
    ],
    pendingTasks: [
      'Handover root domain DNS control for gitclub.edu to new DevOps lead',
      'Audit hardware sensors in Lab 4 before Spring recruitment'
    ],
    signedOffBy: 'Aarav Sharma & Dr. Suresh V. Patil',
    signOffDate: '2025-08-30'
  }
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    action: 'New Registration Received',
    details: 'Sameer Rao registered for Generative AI & LLM Systems Workshop',
    timestamp: '15 minutes ago',
    user: 'Sameer Rao',
    category: 'registration'
  },
  {
    id: 'act-2',
    action: 'Event Approved by Faculty',
    details: 'Generative AI Workshop approved by Prof. Radhika Kulkarni',
    timestamp: '2 hours ago',
    user: 'Prof. Radhika Kulkarni',
    category: 'approval'
  },
  {
    id: 'act-3',
    action: 'Member Promotion Recommended',
    details: 'Sneha Patil recommended for Committee Head promotion',
    timestamp: '5 hours ago',
    user: 'Ananya Verma',
    category: 'promotion'
  },
  {
    id: 'act-4',
    action: 'Project Progress Updated',
    details: 'GCOS Operating System milestone pushed to 88%',
    timestamp: '1 day ago',
    user: 'Rohan Deshmukh',
    category: 'project'
  },
  {
    id: 'act-5',
    action: 'Announcement Published',
    details: 'HACKVERSE 2026 Registrations published to campus public feed',
    timestamp: '2 days ago',
    user: 'Priya Kulkarni',
    category: 'announcement'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Registration Milestone',
    message: 'HACKVERSE 2026 reached 96% seat capacity (385/400). Consider expanding venue space.',
    timestamp: '10 minutes ago',
    read: false,
    type: 'event'
  },
  {
    id: 'n-2',
    title: 'Member Promotion Ready',
    message: 'Sneha Patil has been recommended for promotion to Committee Head by Ananya Verma.',
    timestamp: '1 hour ago',
    read: false,
    type: 'promotion'
  },
  {
    id: 'n-3',
    title: 'Faculty Approval Pending',
    message: 'Rust & Systems Programming Deep Dive is awaiting Faculty Coordinator review.',
    timestamp: '2 hours ago',
    read: false,
    type: 'approval'
  },
  {
    id: 'n-4',
    title: 'Task Due Soon',
    message: 'Finalize venue cables in Auditorium deadline is approaching.',
    timestamp: '5 hours ago',
    read: false,
    type: 'task'
  },
  {
    id: 'n-5',
    title: 'Project Milestone Reached',
    message: 'GIT Club Operating System (GCOS) reached 88% completion milestone.',
    timestamp: 'Yesterday',
    read: true,
    type: 'project'
  }
];

export const FACULTY_MEMBERS: FacultyMember[] = [
  {
    id: 'fac-1',
    name: 'Dr. Suresh V. Patil',
    role: 'Faculty Coordinator',
    department: 'Department of Computer Science & Engineering',
    email: 'coordinator.gitclub@git.edu',
    office: 'Academic Block A, Room 304',
    bio: 'Professor & Head of Research with 20+ years of academia and industry experience in Distributed Systems and Cloud Computing.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'fac-2',
    name: 'Prof. Radhika Kulkarni',
    role: 'Faculty Mentor',
    department: 'Department of Information Science',
    email: 'mentor.is@git.edu',
    office: 'Academic Block B, Room 112',
    bio: 'Associate Professor specializing in AI ethics, natural language processing, and guiding student innovative research publications.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
];

export const HISTORY_MILESTONES: HistoryMilestone[] = [
  {
    year: '2024',
    title: 'Club Genesis & Foundation',
    description: 'GIT Club founded by a group of 10 passionate computer science students aiming to bridge academic theory and real-world software engineering.',
    stats: '10 Founders • 3 Initial Workshops',
    icon: 'Rocket'
  },
  {
    year: '2025',
    title: 'Expansion & First Major Hackathon',
    description: 'Organized CodeSprint 2025 with 250+ participants across 15 colleges. Established 4 specialized technical wings.',
    stats: '150+ Members • ₹1 Lakh Prize Pool',
    icon: 'Award'
  },
  {
    year: '2025',
    title: 'National SIH Triumph',
    description: 'GIT Club team bagged 1st Rank in Smart India Hackathon. Established industry mentorship tie-ups.',
    stats: 'National Winner • 5 Research Papers',
    icon: 'Trophy'
  },
  {
    year: '2026',
    title: 'Launch of GCOS Platform',
    description: 'Surpassed 500+ active student participants across campus. Released GCOS Command Center digital platform.',
    stats: '500+ Participants • 25+ Annual Events',
    icon: 'Cpu'
  }
];

export const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'ach-1',
    title: '1st Place Winners — Smart India Hackathon 2025',
    category: 'Hackathon',
    event: 'Smart India Hackathon Grand Finale',
    position: '1st Rank out of 1,200 teams',
    teamMembers: ['Aarav Sharma', 'Rohan Deshmukh', 'Sneha Patil', 'Ananya Verma'],
    date: '2025-12-18',
    description: 'Developed an AI-driven disaster response dispatch portal that optimized emergency vehicle routing by 34% under zero cell signal using mesh radio.',
    badge: '🏆 National Champions',
    image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'ach-2',
    title: 'Best Open Source Contribution Award',
    category: 'Award',
    event: 'Global Open Source Summit 2025',
    position: 'Top Technical Club Project',
    teamMembers: ['Rohan Deshmukh', 'Vikram Joshi'],
    date: '2025-09-05',
    description: 'Awarded for maintaining GCOS and contributing over 150 pull requests to core Linux kernel & CNCF ecosystem repositories.',
    badge: '⭐ Open Source Excellence',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'ach-3',
    title: 'Top 3 Finalists — Google AI Solution Challenge',
    category: 'Competition',
    event: 'Google Student Developer Competition',
    position: 'Regional Runner-Up',
    teamMembers: ['Diya Nair', 'Ketan Mehta'],
    date: '2025-05-14',
    description: 'Recognized for creating an accessible computer vision application helping visually impaired students navigate lab instruments.',
    badge: '🥈 Regional Medalist',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80'
  }
];
