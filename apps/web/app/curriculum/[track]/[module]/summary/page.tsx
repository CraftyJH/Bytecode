import { notFound } from "next/navigation";
import { getTrack, getModule, curriculum } from "@/lib/curriculum";
import { Pill } from "@/components/ui/Pill";
import { ChevronRight, Trophy, CheckCircle2, BookOpen, Sparkles } from "lucide-react";
import { FinalQuizSection, FeedbackButton } from "./SummaryClient";
import type { QuizItem } from "@/lib/quiz";

interface SummaryPageProps {
  params: Promise<{ track: string; module: string }>;
}

export async function generateStaticParams() {
  const params: { track: string; module: string }[] = [];
  for (const track of curriculum) {
    for (const mod of track.modules) {
      params.push({ track: track.slug, module: mod.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: SummaryPageProps) {
  const { track: trackSlug, module: moduleSlug } = await params;
  const mod = getModule(trackSlug, moduleSlug);
  if (!mod) return {};
  return { title: `${mod.title} — Summary — Bytecode` };
}

// Module-specific summary quizzes. Generic fallback if no override.
function getSummaryQuizzes(trackSlug: string, moduleSlug: string): QuizItem[] {
  if (trackSlug === "java-beginner" && moduleSlug === "module-1") {
    return [
      {
        id: "sum-m1-1",
        type: "multiple_choice",
        difficulty: "easy",
        question: "Which primitive type holds a whole number between roughly −2 billion and +2 billion?",
        options: [
          { text: "<code>double</code>", correct: false, feedback: "double holds decimal numbers, not whole numbers." },
          { text: "<code>int</code>", correct: true },
          { text: "<code>boolean</code>", correct: false, feedback: "boolean holds only true or false." },
          { text: "<code>char</code>", correct: false, feedback: "char holds a single Unicode character." },
        ],
        explanation: "int is the default integer type in Java — 32 bits, range −2,147,483,648 to 2,147,483,647.",
        hint: "Think about what type you use in a for-loop counter.",
      },
      {
        id: "sum-m1-2",
        type: "predict_output",
        difficulty: "easy",
        code: `int x = 10;
x += 5;
x *= 2;
System.out.println(x);`,
        expectedOutput: "30",
        explanation: "x starts at 10, += 5 makes it 15, *=2 makes it 30.",
      },
      {
        id: "sum-m1-3",
        type: "fill_in_blank",
        difficulty: "medium",
        prompt: "What keyword begins a loop that continues as long as a condition is true?",
        correctAnswers: ["while", "for"],
        caseSensitive: false,
        explanation: "Both while and for can express 'repeat while condition is true'. The while loop is the most direct expression of that idea.",
      },
      {
        id: "sum-m1-4",
        type: "multiple_choice",
        difficulty: "medium",
        question: "What does an array's <code>.length</code> property return for <code>int[] a = new int[5];</code>?",
        options: [
          { text: "4 (the last valid index)", correct: false, feedback: "The last valid index is 4 (length−1), but .length returns the total size." },
          { text: "5 (the number of elements)", correct: true },
          { text: "0 (arrays start empty)", correct: false, feedback: "new int[5] creates 5 slots; .length reports how many slots exist." },
          { text: "It throws an exception.", correct: false, feedback: ".length is a field, not a method, and it never throws." },
        ],
        explanation: "array.length is always the total number of slots the array was created with — never the last index.",
        hint: "Remember: valid indices are 0 through length-1.",
      },
    ];
  }

  if (trackSlug === "java-beginner" && moduleSlug === "module-2") {
    return [
      {
        id: "sum-m2-1",
        type: "multiple_choice",
        difficulty: "easy",
        question: "What is the difference between a class and an object?",
        options: [
          { text: "They are the same thing.", correct: false, feedback: "A class is a definition; an object is a live instance in memory." },
          { text: "A class is the blueprint; an object is one instance built from it.", correct: true },
          { text: "An object contains many classes.", correct: false, feedback: "It's the other way — a class defines many potential objects." },
          { text: "A class only exists at runtime.", correct: false, feedback: "Classes are compile-time definitions; objects are runtime instances." },
        ],
        explanation: "The class defines structure and behavior; new creates an object (instance) following that definition.",
      },
      {
        id: "sum-m2-2",
        type: "predict_output",
        difficulty: "medium",
        code: `class Counter {
    private int count = 0;
    void increment() { count++; }
    int get() { return count; }
}

public class Main {
    public static void main(String[] args) {
        Counter c = new Counter();
        c.increment();
        c.increment();
        c.increment();
        System.out.println(c.get());
    }
}`,
        expectedOutput: "3",
        explanation: "increment() is called three times, each time adding 1 to count which starts at 0.",
      },
      {
        id: "sum-m2-3",
        type: "fill_in_blank",
        difficulty: "easy",
        prompt: "What keyword is used inside a constructor to refer to the current object's fields?",
        correctAnswers: ["this"],
        caseSensitive: true,
        explanation: "`this` refers to the current instance. It's commonly used in constructors to distinguish `this.name = name` (field vs parameter).",
      },
      {
        id: "sum-m2-4",
        type: "multiple_choice",
        difficulty: "medium",
        question: "Which access modifier makes a field visible only within its own class?",
        options: [
          { text: "<code>public</code>", correct: false, feedback: "public makes the field accessible from anywhere." },
          { text: "<code>protected</code>", correct: false, feedback: "protected allows access from the same package and subclasses." },
          { text: "<code>private</code>", correct: true },
          { text: "<code>default</code> (no modifier)", correct: false, feedback: "Default (package-private) allows access from the same package." },
        ],
        explanation: "private is the most restrictive modifier — only code within the same class can see the field.",
        hint: "Encapsulation best practice: make fields as private as possible.",
      },
    ];
  }

  // Generic fallback
  return [
    {
      id: `sum-${moduleSlug}-generic`,
      type: "multiple_choice",
      difficulty: "easy",
      question: "Which of these is a key benefit of breaking code into methods?",
      options: [
        { text: "It makes programs run faster.", correct: false, feedback: "Methods have minimal runtime overhead — performance is not the main benefit." },
        { text: "It avoids the need for variables.", correct: false, feedback: "Methods still use variables internally." },
        { text: "It lets you reuse logic and name it, making code easier to read.", correct: true },
        { text: "It is required by the Java compiler.", correct: false, feedback: "You can write valid Java without any methods beyond main." },
      ],
      explanation: "Methods give a name to a block of logic so you can understand it, test it, and reuse it without copy-pasting.",
    },
  ];
}

export default async function SummaryPage({ params }: SummaryPageProps) {
  const { track: trackSlug, module: moduleSlug } = await params;
  const track = getTrack(trackSlug);
  const mod = getModule(trackSlug, moduleSlug);
  if (!track || !mod) notFound();

  const trackModules = track.modules;
  const modIndex = trackModules.findIndex((m) => m.slug === moduleSlug);
  const nextMod = modIndex < trackModules.length - 1 ? trackModules[modIndex + 1] : null;
  const hasCapstone = trackSlug === "java-beginner" && moduleSlug === "module-1";

  const summaryQuizzes = getSummaryQuizzes(trackSlug, moduleSlug);

  // Build what-you-covered bullets by module
  const highlights: string[] = (() => {
    if (trackSlug === "java-beginner" && moduleSlug === "module-1") {
      return [
        "Setting up and running your first Java program",
        "Primitive types: int, double, boolean, char, and String",
        "Arithmetic, comparison, and logical operators",
        "Making decisions with if / else if / else",
        "Repeating code with for and while loops",
        "Organising logic into reusable methods",
        "Storing and iterating over fixed-size data with arrays",
        "Working with text using String methods",
      ];
    }
    if (trackSlug === "java-beginner" && moduleSlug === "module-2") {
      return [
        "Defining classes and creating objects with new",
        "Writing constructors and using this to initialise fields",
        "Instance methods that read and modify object state",
        "Encapsulating data with private fields and getters/setters",
        "Sharing state across all instances with static fields and methods",
        "Reusing code through inheritance and super",
        "Writing flexible code with polymorphism and dynamic dispatch",
        "Overriding toString, equals, and hashCode correctly",
      ];
    }
    return mod.lessons.map((l) => l.title);
  })();

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-10">
      {/* Breadcrumb */}
      <nav
        className="mb-8 flex items-center gap-1.5 text-xs text-prose-faint"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <a href="/curriculum" className="hover:text-prose-muted transition-colors">curriculum</a>
        <span>/</span>
        <a href={`/curriculum/${trackSlug}`} className="hover:text-prose-muted transition-colors">{track.title}</a>
        <span>/</span>
        <a href={`/curriculum/${trackSlug}/${moduleSlug}`} className="hover:text-prose-muted transition-colors">{mod.title}</a>
        <span>/</span>
        <span className="text-prose-muted">Summary</span>
      </nav>

      {/* ── Celebration header ───────────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-accent" />
          <span
            className="text-xs text-prose-faint"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            module {String(mod.order).padStart(2, "0")} complete
          </span>
        </div>
        <h1 className="text-3xl font-semibold text-prose tracking-tight mb-4">
          {mod.title} — Summary
        </h1>
        <p className="text-prose-muted leading-relaxed max-w-2xl">
          You made it through {mod.lessons.length} lesson{mod.lessons.length !== 1 ? "s" : ""} and picked up a solid set of skills along the way. Before you move on, here&rsquo;s a recap of what you covered — and an optional final quiz to check how much stuck.
        </p>
      </div>

      {/* ── What you covered ────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-prose mb-4 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-accent" />
          What you covered
        </h2>
        <div
          className="p-5 rounded-lg border"
          style={{
            backgroundColor: "var(--color-elevated)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <ul className="space-y-2.5">
            {highlights.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-prose-muted">
                <CheckCircle2 size={13} className="text-ok shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Lesson list ─────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-prose mb-4 flex items-center gap-2">
          <BookOpen size={16} className="text-accent" />
          Lessons in this module
        </h2>
        <div className="space-y-2">
          {mod.lessons.map((lesson) => (
            <a
              key={lesson.slug}
              href={`/curriculum/${trackSlug}/${moduleSlug}/lesson/${lesson.slug}`}
              className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg border transition-colors duration-100 hover:border-[var(--border-default)] group"
              style={{
                backgroundColor: "var(--color-elevated)",
                borderColor: "var(--border-subtle)",
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-xs text-prose-faint w-5 shrink-0"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {String(lesson.order).padStart(2, "0")}
                </span>
                <span className="text-sm text-prose-muted group-hover:text-prose transition-colors duration-100">
                  {lesson.title}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Pill variant={lesson.isPremium ? "premium" : "free"} />
                <ChevronRight size={13} className="text-prose-faint group-hover:text-prose-muted transition-colors duration-100" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Final quiz (collapsible) ─────────────────────────────────── */}
      <FinalQuizSection quizzes={summaryQuizzes} />

      {/* ── Feedback ────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-prose mb-3">How was this module?</h2>
        <p className="text-sm text-prose-muted mb-4">
          Your feedback helps improve the course for everyone. It takes about 30 seconds.
        </p>
        <FeedbackButton moduleTitle={mod.title} />
      </section>

      {/* ── Next steps ──────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-prose mb-4">Next steps</h2>
        <div className="space-y-3">
          {hasCapstone && (
            <a
              href={`/curriculum/${trackSlug}/${moduleSlug}/capstone`}
              className="flex items-center justify-between gap-4 px-5 py-4 rounded-lg border transition-colors duration-100 hover:border-[var(--border-default)] group"
              style={{
                backgroundColor: "var(--color-elevated)",
                borderColor: "rgba(199,123,58,0.3)",
              }}
            >
              <div className="flex items-center gap-3">
                <Trophy size={15} className="text-accent shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-prose-muted group-hover:text-prose transition-colors duration-100">
                    Capstone — Number Guessing Game
                  </p>
                  <p className="text-xs text-prose-faint mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>
                    ~30 min · fully graded · badge &amp; certificate
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Pill variant="premium" />
                <ChevronRight size={14} className="text-prose-faint group-hover:text-prose-muted transition-colors duration-100" />
              </div>
            </a>
          )}

          {nextMod && (
            <a
              href={`/curriculum/${trackSlug}/${nextMod.slug}`}
              className="flex items-center justify-between gap-4 px-5 py-4 rounded-lg border transition-colors duration-100 hover:border-[var(--border-default)] group"
              style={{
                backgroundColor: "var(--color-elevated)",
                borderColor: "var(--border-subtle)",
              }}
            >
              <div className="flex items-center gap-3">
                <BookOpen size={14} className="text-accent shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-prose-muted group-hover:text-prose transition-colors duration-100">
                    Next: {nextMod.title}
                  </p>
                  <p className="text-xs text-prose-faint mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>
                    {nextMod.lessons.length} lessons · module {String(nextMod.order).padStart(2, "0")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Pill variant={nextMod.isPremium ? "premium" : "free"} />
                <ChevronRight size={14} className="text-prose-faint group-hover:text-prose-muted transition-colors duration-100" />
              </div>
            </a>
          )}

          <a
            href={`/curriculum/${trackSlug}/${moduleSlug}`}
            className="flex items-center gap-2 text-sm text-prose-faint hover:text-prose-muted transition-colors duration-100"
          >
            ← Back to module overview
          </a>
        </div>
      </section>
    </div>
  );
}
