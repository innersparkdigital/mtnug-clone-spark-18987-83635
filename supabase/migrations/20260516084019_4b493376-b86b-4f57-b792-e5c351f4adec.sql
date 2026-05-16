INSERT INTO public.site_sections (section_key, is_visible, data) VALUES
('hero_section', true, '{}'::jsonb),
('how_it_works_simple', true, '{}'::jsonb),
('concerns_section', true, '{}'::jsonb),
('why_innerspark', true, '{}'::jsonb),
('built_for_africa', true, '{}'::jsonb),
('who5_banner', true, '{}'::jsonb),
('therapist_showcase', true, '{}'::jsonb),
('testimonials', true, '{}'::jsonb),
('how_it_works_detailed', true, '{}'::jsonb),
('whisper_teaser', true, '{}'::jsonb),
('sdg_alignment', true, '{}'::jsonb),
('partners', true, '{}'::jsonb),
('events_section', true, '{}'::jsonb)
ON CONFLICT (section_key) DO NOTHING;