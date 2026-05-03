-- Run in Supabase SQL Editor to create the posts table and seed the first two blog posts.

CREATE TABLE IF NOT EXISTS posts (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  slug         text        UNIQUE NOT NULL,
  title        text        NOT NULL,
  excerpt      text,
  content      text        NOT NULL,
  author       text        NOT NULL DEFAULT 'Bytecode',
  published_at timestamptz DEFAULT now(),
  created_at   timestamptz DEFAULT now()
);

-- Public read; admins write via service-role key (bypasses RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON posts FOR SELECT USING (true);

-- ─── Seed: Post 1 ─────────────────────────────────────────────────────────────
INSERT INTO posts (slug, title, excerpt, author, published_at, content) VALUES (
'what-is-java',
'What is Java? History, Features & Use Cases',
'Java has powered the internet for nearly thirty years. Here''s where it came from, what makes it tick, and why it still matters.',
'Bytecode',
'2025-04-15 10:00:00+00',
$$
Java is one of the most widely used programming languages in the world. Whether you are building Android apps, powering banking systems, or writing backend services used by billions of people, Java is probably somewhere in the stack.

## A Brief History

Java was born in 1991 at Sun Microsystems, created by a team led by **James Gosling**. Originally called *Oak*, it was designed for interactive television — but the technology was ahead of its time. The team pivoted, renamed the language Java (after the Indonesian island), and released Java 1.0 publicly in **1996**.

The timing was perfect. The web was exploding, and Java's promise of **"Write Once, Run Anywhere"** resonated with developers who were tired of rewriting code for every operating system. Sun Microsystems was acquired by Oracle in 2010, who now steward the language. Despite occasional controversy, Java has remained one of the top three most-used languages globally for over two decades.

## Why "Write Once, Run Anywhere"?

Java does not compile directly to machine code like C or C++. Instead, it compiles to **bytecode** — an intermediate format that runs on the **Java Virtual Machine (JVM)**. Every major platform (Windows, macOS, Linux) has a JVM implementation, which means the same `.class` files run identically everywhere.

This was revolutionary in the 1990s and remains one of Java's core strengths today.

## Key Features

### Object-Oriented by Design

Everything in Java is an object. The language enforces a clean, class-based structure that scales well for large codebases and large teams.

### Strongly Typed

Java catches type errors at compile time rather than at runtime. This makes large codebases more maintainable and bugs easier to find early.

### Automatic Memory Management

Java handles memory allocation and deallocation automatically via its **garbage collector**. You do not manage raw pointers — the JVM cleans up objects that are no longer reachable.

### A Mature Ecosystem

Java has over 25 years of libraries, frameworks, and tooling. Maven and Gradle handle dependency management. Spring Boot powers enterprise backends. JUnit handles testing. Whatever you need, there is a battle-tested solution.

### Long-Term Support Releases

Java releases a new version every six months, with LTS (Long-Term Support) versions every two years. **Java 21** is the current recommended LTS release for production use.

## Where Java Is Used Today

### Android Development

For most of Android's history, Java was the primary language for writing Android apps. While Kotlin has taken over as the preferred language, the Android ecosystem was built on Java — and understanding Java is foundational for any Android developer.

### Enterprise Backends

Large organisations — banks, insurers, retailers, logistics firms — run enormous Java backends. **Spring Boot** is the dominant framework, handling HTTP routing, dependency injection, database access, security, and more. If you have ever booked a flight, checked a bank balance, or processed a payment online, there is a good chance Java was involved.

### Big Data

Apache Hadoop, Kafka, Spark, and Elasticsearch are all JVM-based. Java (and Kotlin/Scala on the JVM) dominate data engineering pipelines at scale.

### Cloud and Microservices

While Go and Node.js have gained ground in the cloud-native world, Java remains a major player. **Quarkus** and **Micronaut** are modern frameworks designed for fast startup times and low memory footprints in containerised environments.

## Java vs the Field

| Language | Speed         | Learning Curve | Primary Use              |
|----------|---------------|----------------|--------------------------|
| Java     | Fast          | Moderate       | Enterprise, Android      |
| Python   | Slower        | Easy           | Data science, scripting  |
| C++      | Fastest       | Steep          | Systems, games           |
| Kotlin   | Fast (JVM)    | Moderate       | Android, server-side     |

Java sits in a sweet spot: fast enough for performance-critical applications, safe enough for large teams, and mature enough for systems that need to run for decades.

## Java in 2025

Java is far from legacy software. The language has modernised considerably:

- **Records** (Java 16) — concise immutable data classes
- **Pattern matching** (Java 21) — cleaner type checks and deconstruction
- **Virtual threads** (Java 21) — lightweight concurrency without async/await complexity
- **Sealed classes** — restrict inheritance for safer type hierarchies

The JVM itself has also evolved. **GraalVM** can compile Java to a native binary that starts in milliseconds with a tiny memory footprint — directly competing with Go for cloud-native workloads.

## Should You Learn Java?

If you are interested in any of the following, the answer is yes:

- Mobile development (Android)
- Backend / server-side engineering
- Working at large companies in finance, e-commerce, or logistics
- Understanding the foundations that Kotlin, Scala, and Clojure are built on

Java is not trendy — and that is a strength. The skills you build with Java are stable, in high demand, and deeply transferable.
$$
);

-- ─── Seed: Post 2 ─────────────────────────────────────────────────────────────
INSERT INTO posts (slug, title, excerpt, author, published_at, content) VALUES (
'kotlin-the-modern-jvm-language',
'Kotlin: The Modern Language Built for the JVM',
'Kotlin took everything developers loved about Java and fixed what they didn''t. Here''s how it happened and why it matters for your career.',
'Bytecode',
'2025-04-22 10:00:00+00',
$$
Kotlin is a modern programming language that runs on the Java Virtual Machine. It was designed to fix the rough edges of Java while remaining fully interoperable with it — meaning existing Java code and libraries work seamlessly in Kotlin, and vice versa.

## Where Kotlin Came From

Kotlin was created by **JetBrains**, the company behind IntelliJ IDEA, PyCharm, and many other developer tools. The first public preview appeared in 2011. **Kotlin 1.0** shipped in February 2016.

The name comes from **Kotlin Island**, near St. Petersburg, Russia — mirroring how Java was named after the Indonesian island of Java.

The turning point came in **2017** when Google announced Kotlin as a first-class language for Android development. Adoption accelerated rapidly, and by 2019 Google declared Kotlin the *preferred* language for Android. Today, the majority of new Android code is written in Kotlin.

## What Makes Kotlin Different?

### Null Safety

In Java, `NullPointerException` is so common it is called the "billion-dollar mistake". Kotlin addresses this at the type-system level. Types are **non-nullable by default**:

```kotlin
val name: String = "Alice"   // cannot be null
val nickname: String? = null // explicitly nullable
```

If you want to call a method on a nullable type, you must handle the null case explicitly. The compiler enforces this — null-related crashes become compile errors, not 3 AM production incidents.

### Conciseness

Kotlin eliminates a significant amount of Java boilerplate. A Java class with fields, constructor, getters, setters, `equals`, `hashCode`, and `toString` might run to 50 lines. In Kotlin:

```kotlin
data class User(val id: Int, val name: String, val email: String)
```

One line. The compiler generates everything else.

### Extension Functions

Kotlin lets you add methods to existing classes without subclassing them:

```kotlin
fun String.isPalindrome(): Boolean = this == this.reversed()

"racecar".isPalindrome() // true
```

This makes APIs feel natural even when working with classes you do not own.

### Coroutines

Asynchronous programming in Java traditionally requires complex callback chains or reactive frameworks. Kotlin's **coroutines** make async code look and feel sequential:

```kotlin
suspend fun loadUserProfile(id: Int): Profile {
    val user = fetchUser(id)   // suspends, doesn't block the thread
    val posts = fetchPosts(user)
    return Profile(user, posts)
}
```

Coroutines are lightweight — you can run thousands of them concurrently without the overhead of OS threads.

### Smart Casts

Java requires explicit casting before using a narrowed type. Kotlin's compiler is smarter:

```kotlin
fun describe(obj: Any) {
    if (obj is String) {
        println(obj.length) // automatically cast to String inside the if
    }
}
```

### When Expressions

Kotlin's `when` is a far more powerful replacement for Java's `switch`:

```kotlin
val label = when (statusCode) {
    200       -> "OK"
    404       -> "Not found"
    in 500..599 -> "Server error"
    else      -> "Unknown"
}
```

It works as an expression (returns a value), handles ranges, and supports arbitrary conditions.

## Kotlin and Java: The Relationship

Kotlin compiles to the same JVM bytecode as Java. This means:

- **Every Java library works in Kotlin.** Spring, Hibernate, JUnit, Jackson — all of it.
- **Java code can call Kotlin code** and vice versa, within the same project.
- **The tooling is identical** — IntelliJ, Gradle, Maven, and all major CI systems support Kotlin natively.

If your team has a large existing Java codebase, you can introduce Kotlin in new files or modules without rewriting anything. Migration is gradual and low-risk.

## Where Kotlin Is Used

### Android

Kotlin is the dominant language for Android development. All new Android Jetpack libraries are Kotlin-first. Google's documentation examples default to Kotlin. If you are learning Android today, Kotlin is the language to learn.

### Server-Side

Kotlin works with Spring Boot (the most popular Java backend framework) and has its own native web framework, **Ktor**. Companies like Gradle, JetBrains, and many European tech companies run Kotlin backends in production.

### Kotlin Multiplatform

Kotlin Multiplatform (KMP) allows sharing business logic between Android, iOS, and web from a single codebase. It is still maturing but represents Kotlin's long-term ambition beyond the JVM.

## When to Use Kotlin vs Java

| Situation                       | Recommendation                     |
|---------------------------------|------------------------------------|
| New Android app                 | Kotlin                             |
| Existing Java Android codebase  | Kotlin for all new code            |
| New Spring Boot backend         | Either — Kotlin increasingly preferred |
| Legacy enterprise system        | Java (stability over novelty)      |
| Learning OOP fundamentals       | Java first, then Kotlin            |

## Why Learn Kotlin After Java?

Kotlin is deliberately built to *feel like Java* in structure while removing its friction. Once you understand classes, inheritance, and interfaces in Java, Kotlin's equivalents are immediately recognisable. The differences — null safety, data classes, extension functions — become quick wins rather than steep learning curves.

At Bytecode, Java comes first for exactly this reason. The concepts you build in the Java modules translate directly to Kotlin. When you reach the Kotlin Bridge module, you are not starting over — you are levelling up.
$$
);
