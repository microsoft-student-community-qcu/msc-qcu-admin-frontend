export interface Applicant {
  id: string;
  studentId: string;
  name: string;
  email: string;
  department: string;
  corUrl: string;
  cvUrl: string;
  submissionDate: string;
  status: "APPROVED" | "PENDING_REVIEW" | "REJECTED" | "CANCELLED";
  idCardUrl: string;
  // New fields from the application form
  college: string;
  program: string;
  section: string;
  campus: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: string;
  houseAddress: string;
  cellphone: string;
  interests: string;
  pastOrganizations: string;
  // Optional fields
  portfolioUrl?: string;
  githubUrl?: string;
  facebookUrl?: string;
  previousWorks?: string;
}

export const mockApplicants: Applicant[] = [
  {
    id: "APP-001",
    studentId: "22-0102",
    name: "Juan Dela Cruz",
    email: "delacruz.juan@qcu.edu.ph",
    department: "Engineering & Dev",
    corUrl: "/dummy.pdf",
    cvUrl: "/dummy.pdf",
    submissionDate: "2026-07-13T10:30:00Z",
    status: "PENDING_REVIEW",
    idCardUrl:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
    college: "College of Computer Studies",
    program: "BS Information Technology",
    section: "3A",
    campus: "San Bartolome",
    dateOfBirth: "2004-05-15",
    placeOfBirth: "Quezon City, Metro Manila",
    gender: "Male",
    houseAddress: "123 Mabuhay St, Barangay Holy Spirit, Quezon City",
    cellphone: "09123456789",
    interests: "Passionate about full-stack web development, specifically React, Node.js, and TypeScript. I enjoy building useful tools that solve school problems, playing basketball on weekends, and contributing to open-source UI libraries.",
    pastOrganizations: "Active member of the QCU IT Student Society (ITSS) since 2024. Helped organize the local CCS Web Dev Boot Camp last semester as a technical assistant.",
    portfolioUrl: "https://juandelacruz.dev",
    githubUrl: "https://github.com/juandelacruz-dev",
    facebookUrl: "https://facebook.com/juan.delacruz.qcu",
    previousWorks: "Developed a class scheduling web app using Next.js that helped classmates coordinate their schedules. Won 2nd place in the QCU local Hackathon 2025.",
  },
  {
    id: "APP-002",
    studentId: "23-0245",
    name: "Maria Santos",
    email: "santos.maria@qcu.edu.ph",
    department: "Design & Creatives",
    corUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
    cvUrl: "/dummy.pdf",
    submissionDate: "2026-07-13T09:15:00Z",
    status: "APPROVED",
    idCardUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80",
    college: "College of Computer Studies",
    program: "BS Information Technology",
    section: "2B",
    campus: "San Bartolome",
    dateOfBirth: "2005-08-22",
    placeOfBirth: "Novaliches, Quezon City",
    gender: "Female",
    houseAddress: "456 Quirino Highway, Novaliches, Quezon City",
    cellphone: "09987654321",
    interests: "Fascinated by UI/UX design, illustration, and graphic layout. I love creating color palettes, wireframes, and high-fidelity mockups. Outside of design, I do digital painting and video editing.",
    pastOrganizations: "N/A - This would be my first official student organization, and I am very eager to learn and contribute design assets for community events.",
    portfolioUrl: "https://behance.net/mariasantos-design",
    facebookUrl: "https://facebook.com/maria.santos.qcu",
    // No github, no previousWorks — skipped Chapter 7 partially
  },
  {
    id: "APP-003",
    studentId: "22-1893",
    name: "Pedro Penduko",
    email: "penduko.pedro@qcu.edu.ph",
    department: "Engineering & Dev",
    corUrl: "/dummy.pdf",
    cvUrl: "/dummy.pdf",
    submissionDate: "2026-07-12T14:20:00Z",
    status: "REJECTED",
    idCardUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    college: "College of Engineering",
    program: "BS Industrial Engineering",
    section: "4C",
    campus: "San Francisco",
    dateOfBirth: "2003-11-30",
    placeOfBirth: "Manila, Metro Manila",
    gender: "Male",
    houseAddress: "789 Kalayaan St, Diliman, Quezon City",
    cellphone: "09151234567",
    interests: "Interests lie in data analysis, systems optimization, and cloud solutions. I like automating repetitive tasks using Python, reading tech blogs, and setting up home servers.",
    pastOrganizations: "Served as the Public Relations Officer for the QCU Industrial Engineering Association (QCU-IEA) during the academic year 2024-2025.",
    githubUrl: "https://github.com/pedropenduko-code",
    facebookUrl: "https://facebook.com/pedro.penduko.official",
    // No portfolio, no previousWorks — skipped those optional fields
  },
  {
    id: "APP-004",
    studentId: "24-0812",
    name: "Ana Reyes",
    email: "reyes.ana@qcu.edu.ph",
    department: "Marketing & Comms",
    corUrl: "/dummy.pdf",
    cvUrl: "/dummy.pdf",
    submissionDate: "2026-07-12T11:05:00Z",
    status: "PENDING_REVIEW",
    idCardUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    college: "College of Business Administration",
    program: "BS Entrepreneurship",
    section: "1A",
    campus: "Batasan",
    dateOfBirth: "2006-01-10",
    placeOfBirth: "Caloocan City",
    gender: "Female",
    houseAddress: "12 Payatas Rd, Batasan Hills, Quezon City",
    cellphone: "09224567890",
    interests: "Social media management, copy writing, content creation, and public speaking. I love keeping up with digital marketing trends, editing TikTok videos, and organizing creative outreach campaigns.",
    pastOrganizations: "N/A - Highly active in high school student council as the Secretary, where I managed official announcements and social media posting.",
    facebookUrl: "https://facebook.com/ana.reyes.marketing",
    // No portfolio, no github, no previousWorks — entire Chapter 7 skipped
  },
  {
    id: "APP-005",
    studentId: "23-0991",
    name: "Mark Villanueva",
    email: "villanueva.mark@qcu.edu.ph",
    department: "Operations & Logistics",
    corUrl: "/dummy.pdf",
    cvUrl: "/dummy.pdf",
    submissionDate: "2026-07-13T08:45:00Z",
    status: "PENDING_REVIEW",
    idCardUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
    college: "College of Computer Studies",
    program: "BS Information Technology",
    section: "3A",
    campus: "San Bartolome",
    dateOfBirth: "2004-12-05",
    placeOfBirth: "Quezon City, Metro Manila",
    gender: "Male",
    houseAddress: "88 Katipunan Ave, Quezon City",
    cellphone: "09339876543",
    interests: "Passionate about event coordination, network administration, and Linux system engineering. I love hosting local tech events, organizing logistics tables, and configuring routers and switches.",
    pastOrganizations: "Active Volunteer for the QCU Computer Club since 2024. Coordinated room reservation and guest relations for the CCS Expo 2025.",
    portfolioUrl: "https://github.com/markvillanueva",
    githubUrl: "https://github.com/markvillanueva/logistics-planner",
    facebookUrl: "https://facebook.com/mark.villanueva.ops",
    previousWorks: "Designed and self-hosted a Docker-based event check-in system that was pilot tested during our department's general assembly.",
  },
  {
    id: "APP-006",
    studentId: "22-2481",
    name: "Sarah Geronimo",
    email: "geronimo.sarah@qcu.edu.ph",
    department: "Research & Curriculum",
    corUrl: "/dummy.pdf",
    cvUrl: "/dummy.pdf",
    submissionDate: "2026-07-11T16:30:00Z",
    status: "APPROVED",
    idCardUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
    college: "College of Computer Studies",
    program: "BS Information Systems",
    section: "3B",
    campus: "San Bartolome",
    dateOfBirth: "2004-07-25",
    placeOfBirth: "Bulacan",
    gender: "Female",
    houseAddress: "246 Commonwealth Ave, Quezon City",
    cellphone: "09441234567",
    interests: "I enjoy systems analysis, technical documentation, database design, and academic research. I am eager to help develop learning guides, structure workshops, and compile tech community curricula.",
    pastOrganizations: "Junior Officer for the QCU Research Society. Contributed to documentation and indexing for the annual student research journal.",
    portfolioUrl: "https://github.com/sarahgeronimo",
    githubUrl: "https://github.com/sarahgeronimo/curriculum-docs",
    facebookUrl: "https://facebook.com/sarahgeronimo.research",
    previousWorks: "Co-authored a research paper on the adoption of online learning tools among QCU freshmen, presented at the local department seminar.",
  },
  {
    id: "APP-007",
    studentId: "23-1394",
    name: "Jose Rizal",
    email: "rizal.jose@qcu.edu.ph",
    department: "Research & Curriculum",
    corUrl: "/dummy.pdf",
    cvUrl: "/dummy.pdf",
    submissionDate: "2026-07-13T12:00:00Z",
    status: "PENDING_REVIEW",
    idCardUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
    college: "College of Education",
    program: "BSEd English",
    section: "2A",
    campus: "San Bartolome",
    dateOfBirth: "2005-06-19",
    placeOfBirth: "Calamba, Laguna",
    gender: "Male",
    houseAddress: "1861 Bagumbayan St, Quezon City",
    cellphone: "09081234567",
    interests: "Creative writing, literature, Philippine history, and developing instructional materials. I am eager to help design training outlines, review slide decks, and formulate clear copy for research initiatives.",
    pastOrganizations: "Associate Editor for 'The Clarion', the official QCU student publication, overseeing opinion and editorial pieces since 2024.",
    portfolioUrl: "https://joserizal.me",
    githubUrl: "https://github.com/joserizal-pub",
    facebookUrl: "https://facebook.com/pepe.rizal.qcu",
    previousWorks: "Published three essays on modern educational methodologies and curated the instructional slide decks used by high school teacher interns.",
  },
  {
    id: "APP-008",
    studentId: "23-2115",
    name: "Gabriela Silang",
    email: "silang.gabriela@qcu.edu.ph",
    department: "Marketing & Comms",
    corUrl: "/dummy.pdf",
    cvUrl: "/dummy.pdf",
    submissionDate: "2026-07-12T09:30:00Z",
    status: "PENDING_REVIEW",
    idCardUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&auto=format&fit=crop&q=80",
    college: "College of Business Administration",
    program: "BS Entrepreneurship",
    section: "2A",
    campus: "San Bartolome",
    dateOfBirth: "2005-03-19",
    placeOfBirth: "Ilocos Sur",
    gender: "Female",
    houseAddress: "55 Mabini St, Quezon City",
    cellphone: "09099876543",
    interests: "Community organizing, visual marketing, public outreach, and event branding. I enjoy creating promotional graphics, writing scripts for video ads, and engaging with students on social media channels.",
    pastOrganizations: "Lead Volunteer for the local Red Cross Youth - QCU Chapter. Managed logistics and branding for two community blood donation drives.",
    facebookUrl: "https://facebook.com/gabriela.silang.msc",
    // No portfolio, no github, no previousWorks — entire Chapter 7 skipped
  },
];
