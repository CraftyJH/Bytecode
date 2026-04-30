-- Seed Module 1 (Java Foundations) lessons
INSERT INTO lessons (module_id, slug, title, "order", is_premium, estimated_minutes)
SELECT
    m.id,
    l.slug,
    l.title,
    l."order",
    FALSE,
    l.estimated_minutes
FROM modules m
JOIN tracks t ON t.id = m.track_id
CROSS JOIN (VALUES
    ('hello-java',            'Hello, Java',              1, 10),
    ('variables-primitives',  'Variables and Primitives',  2, 12),
    ('operators-expressions', 'Operators and Expressions', 3, 12),
    ('control-flow',          'Control Flow',              4, 14),
    ('loops',                 'Loops',                     5, 14),
    ('methods-scope',         'Methods and Scope',         6, 14),
    ('arrays',                'Arrays',                    7, 13),
    ('strings',               'Strings',                   8, 13)
) AS l(slug, title, "order", estimated_minutes)
WHERE t.slug = 'java-beginner'
  AND m.slug = 'module-1'
ON CONFLICT (slug) DO NOTHING;
