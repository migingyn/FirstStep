insert into public.events (
  id,
  title,
  summary,
  description,
  event_date,
  start_time,
  end_time,
  location,
  category,
  tags,
  confidence_tags,
  organizer,
  image_url,
  why_recommended,
  external_rsvp_url,
  rsvp_count
)
values
  ('00000000-0000-4000-8000-000000000001', 'Transfer Student Welcome Mixer', 'A relaxed welcome event for transfer students to meet peers, enjoy snacks, and feel at home at UCSD.', 'Join us for a relaxed evening of mingling, snacks, and conversation designed specifically for new transfer students. Whether you''re from a community college across the state or just transferred campuses, this is your chance to meet others who are navigating the same exciting and sometimes overwhelming transition. Grab a name tag, grab some food, and let''s make UCSD feel like home. Hosted by the Transfer Student Association, this event happens every quarter and has helped hundreds of transfers find their people.', '2026-04-15', '5:00 PM', '7:00 PM', 'Price Center East Ballroom', 'Social', array['Transfer-Focused', 'Free Food', 'Name Tags'], array['Good First Event', 'Beginner-Friendly', 'Low-Pressure'], 'Transfer Student Association (TSA)', null, 'This event is specifically designed for transfer students like you. It''s low-pressure, everyone is in the same boat, and there''s free food to break the ice.', 'https://forms.gle/example-rsvp-form', 47),
  ('00000000-0000-4000-8000-000000000002', 'Resume Workshop: Tech Edition', 'Level up your tech resume with expert feedback from career advisors and peer mentors from top companies.', 'Stand out in the competitive tech job market with a polished, recruiter-ready resume. This workshop covers everything from formatting and action verbs to tailoring your resume for specific roles at companies like Google, Meta, and local startups. Career advisors and peer mentors from top tech companies will review your resume in small groups and offer personalized feedback. Bring a printed copy or pull it up on your laptop - we''ll make it shine.', '2026-04-16', '3:00 PM', '5:00 PM', 'Career Services Center, Room 210', 'Career', array['Hands-On', 'Materials Provided', 'Peer Mentors'], array['Beginner-Friendly', 'Small Group'], 'Career Services Center', null, 'Building a strong resume early gives you a huge advantage when internship season hits. Small group format means personalized attention.', 'https://forms.gle/example-rsvp-form', 23),
  ('00000000-0000-4000-8000-000000000003', 'Sunset Yoga at Scripps Pier', 'Outdoor yoga session at sunset by Scripps Pier. Guided for all levels - bring a mat or borrow one.', 'Unwind and reset with a guided sunset yoga session overlooking the iconic Scripps Pier. No experience needed - our certified instructor will walk you through every pose from the ground up. This outdoor session is a perfect antidote to midterm stress. Bring a mat if you have one (we have extras), wear comfortable clothes, and prepare to leave feeling lighter. The session ends with a five-minute meditation as the sun dips below the horizon.', '2026-04-17', '6:00 PM', '7:30 PM', 'Scripps Pier Lawn', 'Sports & Fitness', array['Outdoors', 'Equipment Provided', 'All Skill Levels'], array['Low-Pressure', 'No Experience Needed'], 'UCSD Wellness Center', null, 'A peaceful way to decompress and meet people outside of a classroom setting. The ocean view alone is worth it.', 'https://forms.gle/example-rsvp-form', 31),
  ('00000000-0000-4000-8000-000000000004', 'Triton Gaming Night', 'Casual gaming event with consoles, PC stations, snacks, and fellow gamers. Jump in or just spectate.', 'Whether you''re a casual player or a hardcore gamer, Triton Gaming Night is the place to be. The Gaming Lounge transforms into an arena of friendly competition with stations set up for everything from Mario Kart to Street Fighter to competitive Valorant scrimmages. It''s a laid-back environment where you can jump in and play, spectate, or just vibe with fellow gamers. Pizza and snacks provided. Cosplay welcome but not required.', '2026-04-18', '7:00 PM', '11:00 PM', 'Student Center, Gaming Lounge', 'Social', array['Free Food', 'Casual', 'All Welcome'], array['Good First Event', 'Come Solo Friendly'], 'Triton Gaming', null, null, 'https://forms.gle/example-rsvp-form', 62),
  ('00000000-0000-4000-8000-000000000005', 'Introduction to Machine Learning', 'Friendly intro to ML concepts with a live Python demo. No prior experience required - just curiosity.', 'Curious about AI but don''t know where to start? This beginner-friendly workshop breaks down the fundamentals of machine learning without drowning you in math. Led by ACM UCSD members, the session covers what ML actually is, real-world applications, and a hands-on demo using Python and scikit-learn. Laptops encouraged but not required - you can follow along on a projected screen. Q&A at the end with students who''ve interned at AI-focused companies.', '2026-04-19', '2:00 PM', '4:00 PM', 'CSE Building, Room 1202', 'Academic', array['Tech', 'Hands-On Demo', 'Laptop Optional'], array['Beginner-Friendly', 'No Experience Needed'], 'ACM UCSD', null, 'ML is one of the most in-demand skills in tech right now. Starting here gives you a foundation that will pay off across your academic and professional career.', 'https://forms.gle/example-rsvp-form', 55),
  ('00000000-0000-4000-8000-000000000006', 'Food Truck Friday', 'Weekly food truck gathering on Library Walk. Rotating vendors, open to all, no RSVP needed.', 'Every Friday, Library Walk transforms into a street food festival with rotating food trucks serving everything from gourmet tacos to Korean BBQ bowls to artisan ice cream. It''s a social experience as much as a culinary one - grab food, find a table, and inevitably end up in a conversation with someone new. This is probably UCSD''s most popular ongoing tradition. No tickets needed, just show up.', '2026-04-18', '11:00 AM', '2:00 PM', 'Library Walk', 'Food & Drink', array['Weekly', 'No RSVP', 'Outdoors'], array['Low-Pressure', 'Drop-In'], 'AS UCSD', null, null, 'https://forms.gle/example-rsvp-form', 200),
  ('00000000-0000-4000-8000-000000000007', 'Coffee & Conversation: Transfer Edition', 'Small-group coffee chat with a structured topic, just for transfer students. Facilitators keep it warm and flowing.', 'A structured but relaxed conversation series exclusively for transfer students. Each session has a theme - this week''s topic is "What I Wish I Knew Before Transferring." You''ll be seated in small groups of 4-6 people with a student facilitator to keep things flowing. Coffee, tea, and light pastries provided. The format ensures nobody feels lost or left out, making it one of the highest-rated social events on campus for transfers who want to make real connections, not just small talk.', '2026-04-20', '10:00 AM', '11:30 AM', 'Sixth College Living Room', 'Social', array['Transfer-Focused', 'Free Coffee', 'Structured'], array['Good First Event', 'Structured Activity', 'Small Group'], 'Transfer Student Association (TSA)', null, 'The structured format takes the awkwardness out of meeting people. You''ll leave with 4-6 new connections who truly get the transfer experience.', 'https://forms.gle/example-rsvp-form', 18),
  ('00000000-0000-4000-8000-000000000008', 'Startup Pitch Night', 'Watch student startups pitch to investors and mingle with founders and judges afterward. Buzzy atmosphere.', 'Watch UCSD students pitch their startup ideas to a panel of local investors, alumni entrepreneurs, and faculty judges. The energy is electric - part Shark Tank, part pep rally. After the pitches, the floor opens up for networking between attendees, founders, and judges. Whether you''re interested in entrepreneurship, investing, or just want to see what your fellow students are building, this is a fascinating peek into the startup world. Free entry, light refreshments provided.', '2026-04-21', '6:00 PM', '9:00 PM', 'The Basement (Entrepreneurship Center)', 'Networking', array['Entrepreneurship', 'Networking', 'Free Entry'], array['Come Solo Friendly'], 'Triton Consulting Group', null, null, 'https://forms.gle/example-rsvp-form', 84)
on conflict (id) do update
set
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  event_date = excluded.event_date,
  start_time = excluded.start_time,
  end_time = excluded.end_time,
  location = excluded.location,
  category = excluded.category,
  tags = excluded.tags,
  confidence_tags = excluded.confidence_tags,
  organizer = excluded.organizer,
  image_url = excluded.image_url,
  why_recommended = excluded.why_recommended,
  external_rsvp_url = excluded.external_rsvp_url,
  rsvp_count = excluded.rsvp_count;
