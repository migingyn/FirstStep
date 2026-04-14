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
  ('00000000-0000-4000-8000-000000000113', 'Black Connections', 'A welcoming wellness space centered on connection, self-care, and academic success for Black students and allies.', 'Black Connections offers a welcoming environment for discussing Black health, wellness, and academic success. Students can join self-care activities, collective problem solving, and supportive conversation in the Black Resource Center.', '2026-04-14', '2:00 PM', '3:00 PM', 'Black Resource Center (BRC)', 'Social', array['Community', 'Wellness', 'Light Snacks'], array['Small Group', 'Come Solo Friendly', 'Low-Pressure'], 'Student Health and Well-Being', null, 'This gives students a clear path into one of UCSD''s community resource spaces with a supportive, conversation-based format.', null, 15),
  ('00000000-0000-4000-8000-000000000114', 'Water Beads @ The Zone', 'A quick hands-on break in Price Center with a low-pressure creative activity and a familiar student space.', 'Come to The Zone and make your own water bead creation during a flexible drop-in window. Materials are provided for active UC San Diego students with a valid student ID, making it an easy between-classes event in a central campus location.', '2026-04-16', '11:00 AM', '2:00 PM', 'Price Center, The Zone', 'Workshops', array['Creative', 'Drop-In', 'Student ID Required'], array['Low-Pressure', 'Drop-In', 'Beginner-Friendly'], 'Student Health and Well-Being', null, 'It is a simple way to get comfortable with Price Center and The Zone without needing to commit to a formal meeting.', null, 18),
  ('00000000-0000-4000-8000-000000000115', 'Pitch Perfect Movie Series @ PC', 'A free Price Center movie night with student energy, a clear meetup point, and an easy social script.', 'University Centers is hosting a free student movie night for Pitch Perfect at Price Center Theater. Doors open at 6:30 p.m., the screening starts at 7 p.m., and UC San Diego students can attend free with ID. Swag is available for superfans.', '2026-04-16', '6:30 PM', '9:00 PM', 'Price Center, Price Center Theater, PC West Plaza', 'Social', array['Free', 'Evening', 'Campus Tradition'], array['Good First Event', 'Come Solo Friendly', 'Low-Pressure'], 'University Centers (Price Center and Student Center)', null, 'Movie nights are easy to understand, easy to find, and work well for students who want a social outing without a lot of pressure.', 'https://universitycenters.ucsd.edu/', 34),
  ('00000000-0000-4000-8000-000000000116', 'Climate Cafe - Native Seed Balls w/ CAPS @ The Zone', 'A student-friendly conversation on climate anxiety with refreshments and a simple hands-on activity in The Zone.', 'Stop by The Zone for Climate Cafe to make native seed balls, talk about climate justice, and learn practical tools for handling climate anxiety with CAPS. Catered pastries and refreshments are included, and participants are entered to win a gift card.', '2026-04-17', '2:30 PM', '3:30 PM', 'Price Center, The Zone', 'Workshops', array['Climate', 'Refreshments', 'Hands-On'], array['Structured Activity', 'Come Solo Friendly', 'Low-Pressure'], 'Student Health and Well-Being', null, 'It combines a clear activity, food, and a familiar campus location with a topic many students care about but may not know how to approach.', null, 20)
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
