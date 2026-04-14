-- Direct RSVP data import for existing events
-- Run this after all event batches have been imported
-- This script adds RSVP information to events that match the criteria

INSERT INTO public.event_rsvp_data (
    event_id,
    club_name,
    event_name,
    event_date,
    source_url,
    rsvp_url,
    rsvp_type,
    cost,
    notes
) VALUES
-- UC San Diego Library events
(
    (SELECT id FROM public.events WHERE organizer = 'UC San Diego Library' AND title = 'DeLoss McGraw: Painter-Poet | Exhibition' AND event_date = '2026-04-14' LIMIT 1),
    'UC San Diego Library',
    'DeLoss McGraw: Painter-Poet | Exhibition',
    '2026-04-14',
    'https://calendar.ucsd.edu/event/deloss-mcgraw-painter-poet',
    NULL,
    'no_registration_required',
    'Free',
    NULL
),
(
    (SELECT id FROM public.events WHERE organizer = 'UC San Diego Library' AND title = 'Hallyu (Korean Wave) Before Hallyu: The Artistic Worlds of André Kim, South Korea''s First Male Fashion Designer | Exhibit' AND event_date = '2026-04-14' LIMIT 1),
    'UC San Diego Library',
    'Hallyu (Korean Wave) Before Hallyu: The Artistic Worlds of André Kim, South Korea''s First Male Fashion Designer | Exhibit',
    '2026-04-14',
    'https://calendar.ucsd.edu/event/hallyu-before-hallyu-exhibit',
    NULL,
    'no_registration_required',
    'Free',
    NULL
),
(
    (SELECT id FROM public.events WHERE organizer = 'UC San Diego Library' AND title = 'Rubik''s Cube Mosaics: Turning Library Images into Art | Exhibit' AND event_date = '2026-04-14' LIMIT 1),
    'UC San Diego Library',
    'Rubik''s Cube Mosaics: Turning Library Images into Art | Exhibit',
    '2026-04-14',
    'https://calendar.ucsd.edu/event/rubiks-cube-mosaics',
    NULL,
    'no_registration_required',
    'Free. Registration is not required.',
    NULL
),
-- Qualcomm Institute event
(
    (SELECT id FROM public.events WHERE organizer = 'Qualcomm Institute' AND title = 'Showcase QI' AND event_date = '2026-04-14' LIMIT 1),
    'Qualcomm Institute',
    'Showcase QI',
    '2026-04-14',
    'https://calendar.ucsd.edu/event/showcase-qi',
    'https://qi.ucsd.edu/events/showcase-qi/',
    'external_registration',
    'Free',
    NULL
),
-- Student Health and Well-Being events
(
    (SELECT id FROM public.events WHERE organizer = 'Student Health and Well-Being' AND title = 'STI Awareness Week: Reduced & No Cost STI Testing' AND event_date = '2026-04-14' LIMIT 1),
    'Student Health and Well-Being',
    'STI Awareness Week: Reduced & No Cost STI Testing',
    '2026-04-14',
    'https://calendar.ucsd.edu/event/sti-awareness-week',
    'https://calendar.ucsd.edu/event/sti-awareness-week',
    'calendar_rsvp',
    'Walk-in / reduced cost',
    'Walk-in at Student Health Services (Apr 13-17). No online RSVP — schedule via MyStudentChart if needed.'
),
(
    (SELECT id FROM public.events WHERE organizer = 'Student Health and Well-Being' AND title = 'Pee for Pizza' AND event_date = '2026-04-15' LIMIT 1),
    'Student Health and Well-Being',
    'Pee for Pizza',
    '2026-04-15',
    NULL,
    NULL,
    'no_registration_required',
    'Free pizza',
    'Get no cost urine chlamydia/gonorrhea testing at Student Health Services on April 15 before 2pm and then stop by our table on Library Walk between 10am - 2pm for a free slice of Dirty Birds pizza (cheese or pepperoni). Walk-ins welcome or schedule ahead on MyStudentChart.'
),
(
    (SELECT id FROM public.events WHERE organizer = 'Student Health and Well-Being' AND title = 'Care Fair' AND event_date = '2026-04-15' LIMIT 1),
    'Student Health and Well-Being',
    'Care Fair',
    '2026-04-15',
    NULL,
    'https://lgbt.ucsd.edu/events/out-and-proud/index.html#:~:text=for%20actionable%20assistance.-,Care%20Fair,-Hosted%20by%3A%20STRIDE',
    'external_registration',
    'Free',
    'Join STRIDE (Services for Trans, Intersex, and Gender Diverse Experiences) for the Spring Gender-Affirming Care Fair on Wednesday, April 15, at the Cross-Cultural Center in the Comunidad Room from 11 a.m. to 1 p.m.! Learn about campus resources available and get holistic support through gender-affirming resources. Food will be provided.'
),
(
    (SELECT id FROM public.events WHERE organizer = 'Student Health and Well-Being' AND title = 'Lavender Sachets @ The Zone' AND event_date = '2026-04-14' LIMIT 1),
    'Student Health and Well-Being',
    'Lavender Sachets @ The Zone',
    '2026-04-14',
    NULL,
    NULL,
    'no_registration_required',
    'Free',
    'Looking for a fun activity on campus? Stop by The Zone on Tuesday from 12-3pm to join our Lavender Sachet activity! All supplies will be provided with a valid UCSD student ID so just show up with your ID and creativity.'
),
(
    (SELECT id FROM public.events WHERE organizer = 'Student Health and Well-Being' AND title = 'University Credit Union: Summer Budgeting/Finance Tips Workshop @ The Zone' AND event_date = '2026-04-15' LIMIT 1),
    'Student Health and Well-Being',
    'University Credit Union: Summer Budgeting/Finance Tips Workshop @ The Zone',
    '2026-04-15',
    NULL,
    NULL,
    'no_registration_required',
    'Free',
    'Get ahead of summer expenses this spring. Join our Summer Money Prep: Budgeting Workshop to learn how to plan for travel, housing changes, internships, or reduced income. Explore strategies for forecasting costs, setting short-term savings goals, comparing job options, and preparing for unexpected expenses as the school year ends. Hosted by a University Credit Union advisor.'
),
-- Student Veterans Resource Center
(
    (SELECT id FROM public.events WHERE organizer = 'Student Veterans Resource Center' AND title = 'SVRC: Purple Up Day!' AND event_date = '2026-04-15' LIMIT 1),
    'Student Veterans Resource Center',
    'SVRC: Purple Up Day!',
    '2026-04-15',
    NULL,
    NULL,
    'no_registration_required',
    'Free',
    'Celebrate Purple Up Day with us by creating something colorful! Join us for a tie-dye activity where you can craft your own purple-themed designs to show support for our military-connected students. Connect with the community and express your creativity. All UC San Diego students are welcome!'
)
ON CONFLICT (event_id) DO NOTHING;

-- Verify the import
SELECT
    COUNT(*) as total_rsvp_records,
    COUNT(DISTINCT event_id) as events_with_rsvp
FROM public.event_rsvp_data;

-- Show which events now have RSVP data
SELECT
    e.title,
    e.organizer,
    r.rsvp_type,
    r.cost,
    CASE WHEN r.rsvp_url IS NOT NULL THEN 'Has RSVP URL' ELSE 'No RSVP URL' END as rsvp_status
FROM public.events e
LEFT JOIN public.event_rsvp_data r ON e.id = r.event_id
WHERE r.id IS NOT NULL
ORDER BY e.event_date, e.title;