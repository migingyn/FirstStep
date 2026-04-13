insert into public.clubs (
  id,
  slug,
  name,
  abbreviation,
  description,
  website,
  instagram,
  category
)
values
  ('10000000-0000-4000-8000-000000000001', 'transfer-student-association', 'Transfer Student Association', 'TSA', 'The official voice of transfer students at UCSD. We advocate for transfer resources, host social events, and build community for students navigating the transfer experience.', 'https://tsa.ucsd.edu', '@ucsd_tsa', 'Transfer'),
  ('10000000-0000-4000-8000-000000000002', 'acm-at-uc-san-diego', 'ACM at UC San Diego', 'ACM', 'The largest computer science organization at UCSD. We run workshops, hackathons, and industry panels to help students grow technically and professionally.', 'https://acmucsd.com', '@acmucsd', 'Academic'),
  ('10000000-0000-4000-8000-000000000003', 'triton-gaming', 'Triton Gaming', 'TG', 'UCSD''s premier gaming community. We host weekly gaming nights, esports tournaments, and casual hangout sessions for gamers of all types.', null, '@tritongaming_ucsd', 'Social'),
  ('10000000-0000-4000-8000-000000000004', 'society-of-women-engineers', 'Society of Women Engineers', 'SWE', 'Empowering women and allies in engineering. We connect students with mentors, host professional development workshops, and advocate for inclusion in tech.', 'https://swe.ucsd.edu', '@swe_ucsd', 'Professional'),
  ('10000000-0000-4000-8000-000000000005', 'ucsd-salsa-club', 'UCSD Salsa Club', 'Salsa', 'Learn salsa, bachata, and other Latin dances in a welcoming environment. No partner or experience required. Free lessons every week.', null, '@ucsd_salsa', 'Arts & Culture'),
  ('10000000-0000-4000-8000-000000000006', 'triton-consulting-group', 'Triton Consulting Group', 'TCG', 'A student-run consulting organization providing pro-bono consulting services to local nonprofits and startups while developing business skills.', 'https://tcg.ucsd.edu', '@tcg_ucsd', 'Professional'),
  ('10000000-0000-4000-8000-000000000007', 'international-student-association', 'International Student Association', 'ISA', 'Celebrating the rich diversity of UCSD''s international community. We host cultural events, provide resources, and build bridges across nationalities.', null, '@isa_ucsd', 'Cultural'),
  ('10000000-0000-4000-8000-000000000008', 'design-co', 'Design Co', 'DCo', 'UCSD''s premier design organization, connecting students passionate about UX, product design, and visual communication through workshops and speaker events.', 'https://designco.ucsd.edu', '@designco_ucsd', 'Creative')
on conflict (slug) do update
set
  name = excluded.name,
  abbreviation = excluded.abbreviation,
  description = excluded.description,
  website = excluded.website,
  instagram = excluded.instagram,
  category = excluded.category,
  updated_at = timezone('utc', now());
