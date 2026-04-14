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
  ('00000000-0000-4000-8000-000000000101', 'Nice People and Free Pizza with Agape San Diego', 'A casual lunchtime hangout in Price Center with free pizza and an easy way to meet people.', 'Join friends and meet new people every Tuesday over free pizza in Price Center East. This is a low-pressure drop-in gathering that is especially good for students who want something social without needing a big plan ahead of time.', '2026-04-14', '12:00 PM', '2:00 PM', 'Price Center, 2nd floor, 2.425', 'Social', array['Free Food', 'Drop-In', 'Lunch'], array['Good First Event', 'Come Solo Friendly', 'Low-Pressure'], 'Center for Ethics and Spirituality', null, 'Free food and a familiar central-campus location make this one of the easiest ways to ease into meeting people.', 'https://calendar.ucsd.edu/event/nice-people-and-free-pizza', 28),
  ('00000000-0000-4000-8000-000000000117', 'Showcase QI', 'A self-guided visit through Qualcomm Institute projects, research, and interactive campus tech spaces.', 'Visit Showcase QI on the first floor of Atkinson Hall to explore research, education, and shared facilities from the Qualcomm Institute. It works well as a flexible stop-in event for students who want to get more familiar with innovation spaces on campus.', '2026-04-14', '10:00 AM', '5:00 PM', 'Aktinson Hall, First Floor', 'Academic', array['Self-Guided', 'Campus Research', 'Drop-In'], array['Low-Pressure', 'Beginner-Friendly', 'Drop-In'], 'Qualcomm Institute', null, 'It is an easy way to explore one of UCSD''s major research spaces without needing to show up knowing anyone.', 'https://qi.ucsd.edu/events/showcase-qi/', 14),
  ('00000000-0000-4000-8000-000000000118', 'STI Awareness Week: Reduced & No Cost STI Testing', 'A practical Student Health Services event offering reduced-cost walk-in STI testing during awareness week.', 'Student Health and Well-Being is offering reduced and no-cost STI testing during STI Awareness Week, including a free testing day on April 15. This is a practical campus wellness event with clear next steps for students who want direct support.', '2026-04-14', '8:00 AM', '4:30 PM', 'Student Health Services', 'Workshops', array['Health', 'Walk-In', 'Campus Services'], array['Beginner-Friendly', 'Practical Support', 'Low-Pressure'], 'Student Health and Well-Being', null, 'It helps students learn where Student Health Services is while also connecting them to a real campus resource they may need later.', 'https://calendar.ucsd.edu/event/sti-awareness-week', 12),
  ('00000000-0000-4000-8000-000000000119', 'ERC Health & Wellness Paw-ffice Hours', 'A casual Roosevelt College wellness event with dogs, donuts, and campus support teams on ERC Green.', 'Join ERC student affairs, CAPS, CARE at SARC, Outback Adventures, and Academic Advising for a wellness-focused drop-in on ERC Green. The mix of dogs, donuts, and student support makes this an approachable community event for newer students.', '2026-04-14', '10:00 AM', '12:00 PM', 'ERC Green', 'Social', array['Dogs', 'Donuts', 'Wellness'], array['Good First Event', 'Drop-In', 'Low-Pressure'], 'Eleanor Roosevelt College', null, 'Outdoor drop-in events with a clear setup are one of the easiest ways for transfer students to check out a new part of campus.', 'https://calendar.ucsd.edu/event/copy-of-erc-health-wellness-paw-ffice-hour', 18),
  ('00000000-0000-4000-8000-000000000120', 'ERC Weekly Paw-ffice Hour with Will Songer and Louie', 'A weekly Roosevelt College drop-in with a student support staff member and an easy reason to stop by ERC Green.', 'Stop by ERC Green to meet Will Songer and Louie during this weekly Paw-ffice Hour. Students can ask questions about student life and academics or simply say hello in a relaxed outdoor setting.', '2026-04-14', '10:00 AM', '11:00 AM', 'ERC Green', 'Social', array['Outdoor', 'Community', 'Student Support'], array['Come Solo Friendly', 'Drop-In', 'Low-Pressure'], 'Eleanor Roosevelt College', null, 'It gives newer students a low-stakes reason to explore ERC and talk with someone whose job is to help students get oriented.', 'https://calendar.ucsd.edu/event/copy-of-erc-weekly-paw-ffice-hour-with-will-songer-and-louie', 16)
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
