export interface LessonMeta {
  slug: string;
  title: string;
  order: number;
  duration: number; // minutes
  isPremium: boolean;
  starterCode?: string;
  expectedOutput?: string; // used for auto-grading; undefined = no grading
}

export interface ModuleMeta {
  slug: string;
  title: string;
  order: number;
  isPremium: boolean;
  lessons: LessonMeta[];
}

export interface TrackMeta {
  slug: string;
  title: string;
  order: number;
  isPremium: boolean;
  tagline: string;
  modules: ModuleMeta[];
}

export const curriculum: TrackMeta[] = [
  {
    slug: "java-beginner",
    title: "Java Beginner",
    order: 1,
    isPremium: false,
    tagline: "From Hello World to arrays and strings.",
    modules: [
      {
        slug: "module-1",
        title: "Java Foundations",
        order: 1,
        isPremium: false,
        lessons: [
          {
            slug: "hello-java",
            title: "Hello, Java",
            order: 1,
            duration: 10,
            isPremium: false,
            starterCode: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, Java");
        // Your code here
    }
}`,
            // First line must be "Hello, Java"; second line must be non-empty
            expectedOutput: "Hello, Java\n__any__",
          },
          {
            slug: "variables-primitives",
            title: "Variables and Primitives",
            order: 2,
            duration: 12,
            isPremium: false,
            starterCode: `public class Constants {
    public static void main(String[] args) {
        // Declare GRAVITY here
        // Print GRAVITY here
    }
}`,
            expectedOutput: "9.81",
          },
          {
            slug: "operators-expressions",
            title: "Operators and Expressions",
            order: 3,
            duration: 12,
            isPremium: false,
            starterCode: `public class WeeksAndDays {
    public static void main(String[] args) {
        int totalDays = 100;
        // Calculate whole weeks and leftover days
        // Print: "Weeks: X, Days: Y"
    }
}`,
            expectedOutput: "Weeks: 14, Days: 2",
          },
          {
            slug: "control-flow",
            title: "Control Flow",
            order: 4,
            duration: 14,
            isPremium: false,
            starterCode: `public class Greeting {
    public static void main(String[] args) {
        int hour = 14;
        // Write your if/else-if/else chain here
    }
}`,
            expectedOutput: "Good afternoon",
          },
          {
            slug: "loops",
            title: "Loops",
            order: 5,
            duration: 14,
            isPremium: false,
            starterCode: `public class Multiples {
    public static void main(String[] args) {
        int total = 0;
        // Your loop here
        System.out.println("Total: " + total);
    }
}`,
            expectedOutput: "3\n6\n9\n12\n15\n18\n21\n24\n27\n30\nTotal: 165",
          },
          {
            slug: "methods-scope",
            title: "Methods and Scope",
            order: 6,
            duration: 14,
            isPremium: false,
            starterCode: `public class MaxFinder {
    // Write max(int a, int b) here

    // Write max(int a, int b, int c) here

    public static void main(String[] args) {
        System.out.println(max(3, 7));       // 7
        System.out.println(max(4, 9, 2));    // 9
    }
}`,
            expectedOutput: "7\n9",
          },
          {
            slug: "arrays",
            title: "Arrays",
            order: 7,
            duration: 13,
            isPremium: false,
            starterCode: `public class FindMax {
    public static void main(String[] args) {
        int[] numbers = {34, 7, 23, 32, 5, 62};
        int max = numbers[0];
        // Loop through the array and update max when you find a larger value
        System.out.println("Max: " + max);
    }
}`,
            expectedOutput: "Max: 62",
          },
          {
            slug: "strings",
            title: "Strings",
            order: 8,
            duration: 13,
            isPremium: false,
            starterCode: `public class Palindrome {
    static boolean isPalindrome(String s) {
        String clean = s.toLowerCase();
        // Hint: compare clean to its reverse
        return false; // replace this
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("racecar")); // true
        System.out.println(isPalindrome("hello"));   // false
        System.out.println(isPalindrome("Level"));   // true
    }
}`,
            expectedOutput: "true\nfalse\ntrue",
          },
        ],
      },
    ],
  },
  {
    slug: "java-intermediate",
    title: "Java Intermediate",
    order: 2,
    isPremium: false,
    tagline: "Classes, OOP, generics, and collections.",
    modules: [],
  },
  {
    slug: "java-advanced",
    title: "Java Advanced",
    order: 3,
    isPremium: true,
    tagline: "Lambdas, streams, concurrency, JVM internals.",
    modules: [],
  },
  {
    slug: "kotlin-bridge",
    title: "Kotlin Bridge",
    order: 4,
    isPremium: true,
    tagline: "Java → Kotlin for experienced developers.",
    modules: [],
  },
  {
    slug: "kotlin-advanced",
    title: "Kotlin Advanced",
    order: 5,
    isPremium: true,
    tagline: "Coroutines, DSLs, extension functions.",
    modules: [],
  },
  {
    slug: "projects",
    title: "Projects",
    order: 6,
    isPremium: false,
    tagline: "Spring Boot, Android, multi-threaded applications.",
    modules: [],
  },
];

// ── Lookup helpers ──────────────────────────────────────────────────────────

export function getTrack(trackSlug: string) {
  return curriculum.find((t) => t.slug === trackSlug) ?? null;
}

export function getModule(trackSlug: string, moduleSlug: string) {
  const track = getTrack(trackSlug);
  return track?.modules.find((m) => m.slug === moduleSlug) ?? null;
}

export function getLesson(trackSlug: string, moduleSlug: string, lessonSlug: string) {
  const mod = getModule(trackSlug, moduleSlug);
  return mod?.lessons.find((l) => l.slug === lessonSlug) ?? null;
}

export function getPrevNext(trackSlug: string, moduleSlug: string, lessonSlug: string) {
  const mod = getModule(trackSlug, moduleSlug);
  if (!mod) return { prev: null, next: null };
  const idx = mod.lessons.findIndex((l) => l.slug === lessonSlug);
  return {
    prev: idx > 0 ? mod.lessons[idx - 1] : null,
    next: idx < mod.lessons.length - 1 ? mod.lessons[idx + 1] : null,
  };
}
