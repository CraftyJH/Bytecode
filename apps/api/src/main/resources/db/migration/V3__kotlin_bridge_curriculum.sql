-- Kotlin Bridge: modules and lessons (slugs must match apps/web/lib/kotlin-bridge-modules.ts)

INSERT INTO modules (track_id, slug, title, "order", is_premium)
SELECT t.id, x.slug, x.title, x.ord, TRUE
FROM tracks t
CROSS JOIN (VALUES
    ('module-1', 'Orientation and First Steps', 1),
    ('module-2', 'Types, Variables, and Control Flow', 2),
    ('module-3', 'Functions and Functional Idioms', 3),
    ('module-4', 'Classes, Objects, and Core OOP', 4),
    ('module-5', 'Null Safety and Pragmatics', 5),
    ('module-6', 'Collections and the Standard Library', 6),
    ('module-7', 'Java and Kotlin Interoperability', 7),
    ('module-8', 'Bridge Capstone', 8)
) AS x(slug, title, ord)
WHERE t.slug = 'kotlin-bridge'
ON CONFLICT (track_id, slug) DO NOTHING;

INSERT INTO lessons (module_id, slug, title, "order", is_premium, estimated_minutes)
SELECT m.id, l.slug, l.title, l.ord, TRUE, l.mins
FROM modules m
JOIN tracks t ON t.id = m.track_id
CROSS JOIN (VALUES
    ('module-1', 'why-kotlin-for-java-devs', 'Why Kotlin for Java Developers?', 1, 14),
    ('module-1', 'tooling-gradle-and-repl', 'Tooling: Gradle and Running Kotlin', 2, 13),
    ('module-1', 'packages-and-main', 'Packages and the Entry Point', 3, 12),
    ('module-1', 'java-to-kotlin-cheatsheet', 'Java to Kotlin Syntax Map', 4, 15),
    ('module-2', 'val-var-and-inference', 'val, var, and Type Inference', 1, 14),
    ('module-2', 'basic-types-and-strings', 'Basic Types and String Templates', 2, 14),
    ('module-2', 'if-and-when-expressions', 'if and when as Expressions', 3, 15),
    ('module-2', 'ranges-and-iteration', 'Ranges and Iteration', 4, 14),
    ('module-3', 'functions-basics', 'Functions: Defaults, Named Arguments, Unit', 1, 14),
    ('module-3', 'lambdas-and-sam', 'Lambdas, SAM, and it', 2, 15),
    ('module-3', 'inline-noinline-crossinline', 'inline, noinline, and crossinline (Essentials)', 3, 13),
    ('module-3', 'extension-functions', 'Extension Functions', 4, 16),
    ('module-4', 'classes-and-constructors', 'Classes and Constructors', 1, 15),
    ('module-4', 'properties-and-custom-accessors', 'Properties and Custom Accessors', 2, 14),
    ('module-4', 'data-classes', 'Data Classes', 3, 14),
    ('module-4', 'object-singleton-and-companion', 'object, Singleton, and companion', 4, 15),
    ('module-4', 'sealed-types-intro', 'Sealed Classes and Hierarchies', 5, 16),
    ('module-5', 'nullable-types', 'Nullable Types and Safe Calls', 1, 14),
    ('module-5', 'elvis-and-early-return', 'Elvis, Early Return, and Let', 2, 14),
    ('module-5', 'lateinit-and-lazy', 'lateinit and lazy', 3, 13),
    ('module-5', 'platform-types-from-java', 'Platform Types from Java APIs', 4, 14),
    ('module-6', 'kotlin-collections-overview', 'Kotlin Collections: Read-Only vs Mutable', 1, 14),
    ('module-6', 'transform-and-filter', 'map, filter, and flatMap', 2, 14),
    ('module-6', 'group-partition-associate', 'groupBy, partition, associate', 3, 15),
    ('module-6', 'sequences', 'Sequences: Lazy Pipelines', 4, 14),
    ('module-6', 'java-collections-interop', 'Java Collections in Kotlin', 5, 14),
    ('module-7', 'calling-java-from-kotlin', 'Calling Java from Kotlin', 1, 15),
    ('module-7', 'calling-kotlin-from-java', 'Calling Kotlin from Java', 2, 15),
    ('module-7', 'jvm-annotations', '@JvmName, @JvmOverloads, and Friends', 3, 14),
    ('module-7', 'modules-and-packages-pitfalls', 'Visibility: internal and Java', 4, 13),
    ('module-8', 'bridge-capstone', 'Capstone: Cart Report', 1, 20)
) AS l(mod_slug, slug, title, ord, mins)
WHERE t.slug = 'kotlin-bridge' AND m.slug = l.mod_slug
ON CONFLICT (slug) DO NOTHING;
