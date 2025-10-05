import { Match } from '../components/types';

export const SKILLS = [
  'React', 'Node.js', 'Python', 'Java', 'TypeScript', 'Go',
  'Rust', 'C++', 'Swift', 'Kotlin', 'Vue.js', 'Angular',
  'Django', 'Flask', 'Spring', 'Docker', 'Kubernetes', 'AWS'
];

export const INTERESTS = [
  'Web Development', 'Mobile Apps', 'Machine Learning', 'Blockchain',
  'Cybersecurity', 'Game Development', 'IoT', 'Cloud Computing',
  'DevOps', 'Data Science', 'AR/VR', 'FinTech'
];

export const MOCK_MATCHES: Match[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    skills: ['React', 'Node.js', 'AWS'],
    interests: ['Web Development', 'Cloud Computing'],
    matchScore: 95,
    avatar: '👩‍💻',
    githubUrl: 'https://github.com/sarachen',
    linkedinUrl: 'https://linkedin.com/in/sarachen'
  },
  {
    id: '2',
    name: 'Alex Kumar',
    skills: ['Python', 'Machine Learning', 'Docker'],
    interests: ['Machine Learning', 'Data Science'],
    matchScore: 88,
    avatar: '👨‍💻',
    githubUrl: 'https://github.com/alexkumar',
    linkedinUrl: 'https://linkedin.com/in/alexkumar'
  },
  {
    id: '3',
    name: 'Jordan Lee',
    skills: ['TypeScript', 'React', 'Go'],
    interests: ['Web Development', 'DevOps'],
    matchScore: 82,
    avatar: '🧑‍💻',
    githubUrl: 'https://github.com/jordanlee',
    linkedinUrl: 'https://linkedin.com/in/jordanlee'
  }
];