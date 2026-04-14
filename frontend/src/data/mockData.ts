export interface Event {
  id: string
  title: string
  description: string
  summary: string
  date: string
  time: string
  location: string
  category: string
  tags: string[]
  confidenceTags: string[]
  imageUrl: string
  rsvpCount: number
  organizer: string
  whyRecommended?: string
  externalRsvpUrl?: string | null
  rsvpData?: {
    rsvpUrl: string | null
    rsvpType: 'no_registration_required' | 'external_registration' | 'calendar_rsvp'
    cost: string | null
    notes: string | null
    sourceUrl: string | null
  }
}

export const categories = [
  'All', 'Social', 'Academic', 'Career', 'Sports & Fitness',
  'Arts & Culture', 'Workshops', 'Networking', 'Food & Drink',
] as const

export type Category = typeof categories[number]

export const mockEvents: Event[] = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    title: 'Transfer Student Welcome Mixer',
    description: 'Join us for a relaxed evening of mingling, snacks, and conversation designed specifically for new transfer students. Whether you\'re from a community college across the state or just transferred campuses, this is your chance to meet others who are navigating the same exciting and sometimes overwhelming transition. Grab a name tag, grab some food, and let\'s make UCSD feel like home. Hosted by the Transfer Student Association, this event happens every quarter and has helped hundreds of transfers find their people.',
    summary: 'A relaxed welcome event for transfer students to meet peers, enjoy snacks, and feel at home at UCSD.',
    date: '2026-04-15',
    time: '5:00 PM – 7:00 PM',
    location: 'Price Center East Ballroom',
    category: 'Social',
    tags: ['Transfer-Focused', 'Free Food', 'Name Tags'],
    confidenceTags: ['Good First Event', 'Beginner-Friendly', 'Low-Pressure'],
    imageUrl: '',
    rsvpCount: 47,
    organizer: 'Transfer Student Association (TSA)',
    whyRecommended: 'This event is specifically designed for transfer students like you. It\'s low-pressure, everyone is in the same boat, and there\'s free food to break the ice.',
    externalRsvpUrl: 'https://forms.gle/example-rsvp-form',
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    title: 'Resume Workshop: Tech Edition',
    description: 'Stand out in the competitive tech job market with a polished, recruiter-ready resume. This workshop covers everything from formatting and action verbs to tailoring your resume for specific roles at companies like Google, Meta, and local startups. Career advisors and peer mentors from top tech companies will review your resume in small groups and offer personalized feedback. Bring a printed copy or pull it up on your laptop — we\'ll make it shine.',
    summary: 'Level up your tech resume with expert feedback from career advisors and peer mentors from top companies.',
    date: '2026-04-16',
    time: '3:00 PM – 5:00 PM',
    location: 'Career Services Center, Room 210',
    category: 'Career',
    tags: ['Hands-On', 'Materials Provided', 'Peer Mentors'],
    confidenceTags: ['Beginner-Friendly', 'Small Group'],
    imageUrl: '',
    rsvpCount: 23,
    organizer: 'Career Services Center',
    whyRecommended: 'Building a strong resume early gives you a huge advantage when internship season hits. Small group format means personalized attention.',
    externalRsvpUrl: 'https://forms.gle/example-rsvp-form',
  },
  {
    id: '00000000-0000-4000-8000-000000000003',
    title: 'Sunset Yoga at Scripps Pier',
    description: 'Unwind and reset with a guided sunset yoga session overlooking the iconic Scripps Pier. No experience needed — our certified instructor will walk you through every pose from the ground up. This outdoor session is a perfect antidote to midterm stress. Bring a mat if you have one (we have extras), wear comfortable clothes, and prepare to leave feeling lighter. The session ends with a five-minute meditation as the sun dips below the horizon.',
    summary: 'Outdoor yoga session at sunset by Scripps Pier. Guided for all levels — bring a mat or borrow one.',
    date: '2026-04-17',
    time: '6:00 PM – 7:30 PM',
    location: 'Scripps Pier Lawn',
    category: 'Sports & Fitness',
    tags: ['Outdoors', 'Equipment Provided', 'All Skill Levels'],
    confidenceTags: ['Low-Pressure', 'No Experience Needed'],
    imageUrl: '',
    rsvpCount: 31,
    organizer: 'UCSD Wellness Center',
    whyRecommended: 'A peaceful way to decompress and meet people outside of a classroom setting. The ocean view alone is worth it.',
    externalRsvpUrl: 'https://forms.gle/example-rsvp-form',
  },
  {
    id: '00000000-0000-4000-8000-000000000004',
    title: 'Triton Gaming Night',
    description: 'Whether you\'re a casual player or a hardcore gamer, Triton Gaming Night is the place to be. The Gaming Lounge transforms into an arena of friendly competition with stations set up for everything from Mario Kart to Street Fighter to competitive Valorant scrimmages. It\'s a laid-back environment where you can jump in and play, spectate, or just vibe with fellow gamers. Pizza and snacks provided. Cosplay welcome but not required.',
    summary: 'Casual gaming event with consoles, PC stations, snacks, and fellow gamers. Jump in or just spectate.',
    date: '2026-04-18',
    time: '7:00 PM – 11:00 PM',
    location: 'Student Center, Gaming Lounge',
    category: 'Social',
    tags: ['Free Food', 'Casual', 'All Welcome'],
    confidenceTags: ['Good First Event', 'Come Solo Friendly'],
    imageUrl: '',
    rsvpCount: 62,
    organizer: 'Triton Gaming',
    externalRsvpUrl: 'https://forms.gle/example-rsvp-form',
  },
  {
    id: '00000000-0000-4000-8000-000000000005',
    title: 'Introduction to Machine Learning',
    description: 'Curious about AI but don\'t know where to start? This beginner-friendly workshop breaks down the fundamentals of machine learning without drowning you in math. Led by ACM UCSD members, the session covers what ML actually is, real-world applications, and a hands-on demo using Python and scikit-learn. Laptops encouraged but not required — you can follow along on a projected screen. Q&A at the end with students who\'ve interned at AI-focused companies.',
    summary: 'Friendly intro to ML concepts with a live Python demo. No prior experience required — just curiosity.',
    date: '2026-04-19',
    time: '2:00 PM – 4:00 PM',
    location: 'CSE Building, Room 1202',
    category: 'Academic',
    tags: ['Tech', 'Hands-On Demo', 'Laptop Optional'],
    confidenceTags: ['Beginner-Friendly', 'No Experience Needed'],
    imageUrl: '',
    rsvpCount: 55,
    organizer: 'ACM UCSD',
    whyRecommended: 'ML is one of the most in-demand skills in tech right now. Starting here gives you a foundation that will pay off across your academic and professional career.',
    externalRsvpUrl: 'https://forms.gle/example-rsvp-form',
  },
  {
    id: '00000000-0000-4000-8000-000000000006',
    title: 'Food Truck Friday',
    description: 'Every Friday, Library Walk transforms into a street food festival with rotating food trucks serving everything from gourmet tacos to Korean BBQ bowls to artisan ice cream. It\'s a social experience as much as a culinary one — grab food, find a table, and inevitably end up in a conversation with someone new. This is probably UCSD\'s most popular ongoing tradition. No tickets needed, just show up.',
    summary: 'Weekly food truck gathering on Library Walk. Rotating vendors, open to all, no RSVP needed.',
    date: '2026-04-18',
    time: '11:00 AM – 2:00 PM',
    location: 'Library Walk',
    category: 'Food & Drink',
    tags: ['Weekly', 'No RSVP', 'Outdoors'],
    confidenceTags: ['Low-Pressure', 'Drop-In'],
    imageUrl: '',
    rsvpCount: 200,
    organizer: 'AS UCSD',
    externalRsvpUrl: 'https://forms.gle/example-rsvp-form',
  },
  {
    id: '00000000-0000-4000-8000-000000000007',
    title: 'Coffee & Conversation: Transfer Edition',
    description: 'A structured but relaxed conversation series exclusively for transfer students. Each session has a theme — this week\'s topic is "What I Wish I Knew Before Transferring." You\'ll be seated in small groups of 4–6 people with a student facilitator to keep things flowing. Coffee, tea, and light pastries provided. The format ensures nobody feels lost or left out, making it one of the highest-rated social events on campus for transfers who want to make real connections, not just small talk.',
    summary: 'Small-group coffee chat with a structured topic, just for transfer students. Facilitators keep it warm and flowing.',
    date: '2026-04-20',
    time: '10:00 AM – 11:30 AM',
    location: 'Sixth College Living Room',
    category: 'Social',
    tags: ['Transfer-Focused', 'Free Coffee', 'Structured'],
    confidenceTags: ['Good First Event', 'Structured Activity', 'Small Group'],
    imageUrl: '',
    rsvpCount: 18,
    organizer: 'Transfer Student Association (TSA)',
    whyRecommended: 'The structured format takes the awkwardness out of meeting people. You\'ll leave with 4–6 new connections who truly get the transfer experience.',
    externalRsvpUrl: 'https://forms.gle/example-rsvp-form',
  },
  {
    id: '00000000-0000-4000-8000-000000000008',
    title: 'Startup Pitch Night',
    description: 'Watch UCSD students pitch their startup ideas to a panel of local investors, alumni entrepreneurs, and faculty judges. The energy is electric — part Shark Tank, part pep rally. After the pitches, the floor opens up for networking between attendees, founders, and judges. Whether you\'re interested in entrepreneurship, investing, or just want to see what your fellow students are building, this is a fascinating peek into the startup world. Free entry, light refreshments provided.',
    summary: 'Watch student startups pitch to investors and mingle with founders and judges afterward. Buzzy atmosphere.',
    date: '2026-04-21',
    time: '6:00 PM – 9:00 PM',
    location: 'The Basement (Entrepreneurship Center)',
    category: 'Networking',
    tags: ['Entrepreneurship', 'Networking', 'Free Entry'],
    confidenceTags: ['Come Solo Friendly'],
    imageUrl: '',
    rsvpCount: 84,
    organizer: 'Triton Consulting Group',
    externalRsvpUrl: 'https://forms.gle/example-rsvp-form',
  },
]

export interface StudentOrg {
  id: string
  name: string
  abbreviation: string
  description: string
  website: string | null
  instagram: string | null
}

export const studentOrgs: StudentOrg[] = [
  {
    id: '1',
    name: 'Transfer Student Association',
    abbreviation: 'TSA',
    description: 'The official voice of transfer students at UCSD. We advocate for transfer resources, host social events, and build community for students navigating the transfer experience.',
    website: 'https://tsa.ucsd.edu',
    instagram: '@ucsd_tsa',
  },
  {
    id: '2',
    name: 'ACM at UC San Diego',
    abbreviation: 'ACM',
    description: 'The largest computer science organization at UCSD. We run workshops, hackathons, and industry panels to help students grow technically and professionally.',
    website: 'https://acmucsd.com',
    instagram: '@acmucsd',
  },
  {
    id: '3',
    name: 'Triton Gaming',
    abbreviation: 'TG',
    description: 'UCSD\'s premier gaming community. We host weekly gaming nights, esports tournaments, and casual hangout sessions for gamers of all types.',
    website: null,
    instagram: '@tritongaming_ucsd',
  },
  {
    id: '4',
    name: 'Society of Women Engineers',
    abbreviation: 'SWE',
    description: 'Empowering women and allies in engineering. We connect students with mentors, host professional development workshops, and advocate for inclusion in tech.',
    website: 'https://swe.ucsd.edu',
    instagram: '@swe_ucsd',
  },
  {
    id: '5',
    name: 'UCSD Salsa Club',
    abbreviation: 'Salsa',
    description: 'Learn salsa, bachata, and other Latin dances in a welcoming environment. No partner or experience required. Free lessons every week.',
    website: null,
    instagram: '@ucsd_salsa',
  },
  {
    id: '6',
    name: 'Triton Consulting Group',
    abbreviation: 'TCG',
    description: 'A student-run consulting organization providing pro-bono consulting services to local nonprofits and startups while developing business skills.',
    website: 'https://tcg.ucsd.edu',
    instagram: '@tcg_ucsd',
  },
  {
    id: '7',
    name: 'International Student Association',
    abbreviation: 'ISA',
    description: 'Celebrating the rich diversity of UCSD\'s international community. We host cultural events, provide resources, and build bridges across nationalities.',
    website: null,
    instagram: '@isa_ucsd',
  },
  {
    id: '8',
    name: 'Design Co',
    abbreviation: 'DCo',
    description: 'UCSD\'s premier design organization, connecting students passionate about UX, product design, and visual communication through workshops and speaker events.',
    website: 'https://designco.ucsd.edu',
    instagram: '@designco_ucsd',
  },
]
