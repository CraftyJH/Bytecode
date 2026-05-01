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
            starterCode: `public class Main {
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
            starterCode: `public class Main {
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
            starterCode: `public class Main {
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
            starterCode: `public class Main {
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
            starterCode: `public class Main {
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
            starterCode: `public class Main {
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
            starterCode: `public class Main {
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
            starterCode: `public class Main {
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
      {
        slug: "module-2",
        title: "Object-Oriented Programming",
        order: 2,
        isPremium: false,
        lessons: [
          {
            slug: "classes-objects",
            title: "Your First Class",
            order: 1,
            duration: 12,
            isPremium: false,
            starterCode: `public class Main {
    public static void main(String[] args) {
        // Create a Dog, set its name to "Rex" and age to 4
        // Print: Rex is 4
    }
}

class Dog {
    String name;
    int age;
}`,
            expectedOutput: "Rex is 4",
          },
          {
            slug: "constructors",
            title: "Constructors and this",
            order: 2,
            duration: 12,
            isPremium: false,
            starterCode: `public class Main {
    public static void main(String[] args) {
        Dog d = new Dog("Rex", 4);
        System.out.println(d.name + " is " + d.age);
    }
}

class Dog {
    String name;
    int age;

    // Write a constructor that takes name and age and assigns them to the fields
}`,
            expectedOutput: "Rex is 4",
          },
          {
            slug: "instance-methods",
            title: "Methods That Use Object State",
            order: 3,
            duration: 12,
            isPremium: false,
            starterCode: `public class Main {
    public static void main(String[] args) {
        Dog d = new Dog("Rex", 4);
        d.bark();
        d.birthday();
        System.out.println(d.name + " is now " + d.age);
    }
}

class Dog {
    String name;
    int age;

    Dog(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // Write bark() — prints "<name> says woof!"
    // Write birthday() — increments age by 1
}`,
            expectedOutput: "Rex says woof!\nRex is now 5",
          },
          {
            slug: "encapsulation",
            title: "Private Fields and Accessors",
            order: 4,
            duration: 14,
            isPremium: false,
            starterCode: `public class Main {
    public static void main(String[] args) {
        BankAccount a = new BankAccount();
        a.deposit(100);
        a.deposit(-50);  // should be ignored
        a.deposit(25);
        System.out.println("Balance: " + a.getBalance());
    }
}

class BankAccount {
    // 1. Make balance private
    // 2. Add getBalance() that returns balance
    // 3. Add deposit(int amount) that adds amount only if amount > 0
    int balance = 0;
}`,
            expectedOutput: "Balance: 125",
          },
          {
            slug: "static-members",
            title: "Static Fields and Methods",
            order: 5,
            duration: 12,
            isPremium: false,
            starterCode: `public class Main {
    public static void main(String[] args) {
        new User("Ada");
        new User("Linus");
        new User("Grace");
        System.out.println("Users created: " + User.count);
    }
}

class User {
    String name;
    // 1. Add a static int field "count" starting at 0
    // 2. Write a constructor that takes a name, assigns it,
    //    and increments count
}`,
            expectedOutput: "Users created: 3",
          },
          {
            slug: "inheritance",
            title: "Extending Classes",
            order: 6,
            duration: 14,
            isPremium: false,
            starterCode: `public class Main {
    public static void main(String[] args) {
        Animal a = new Animal("Generic");
        Dog d = new Dog("Rex");
        a.speak();
        d.speak();
    }
}

class Animal {
    String name;
    Animal(String name) { this.name = name; }
    void speak() { System.out.println(name + " makes a sound"); }
}

// Write a Dog class that extends Animal and overrides speak()
// to print "<name> says woof!"`,
            expectedOutput: "Generic makes a sound\nRex says woof!",
          },
          {
            slug: "polymorphism",
            title: "One Reference, Many Forms",
            order: 7,
            duration: 14,
            isPremium: false,
            starterCode: `public class Main {
    public static void main(String[] args) {
        Animal[] zoo = { new Dog(), new Cat(), new Animal() };
        // Loop through zoo and call speak() on each
    }
}

class Animal {
    void speak() { System.out.println("Some sound"); }
}

class Dog extends Animal {
    @Override void speak() { System.out.println("Woof"); }
}

class Cat extends Animal {
    @Override void speak() { System.out.println("Meow"); }
}`,
            expectedOutput: "Woof\nMeow\nSome sound",
          },
          {
            slug: "object-methods",
            title: "toString, equals, and hashCode",
            order: 8,
            duration: 12,
            isPremium: false,
            starterCode: `public class Main {
    public static void main(String[] args) {
        Point a = new Point(1, 2);
        Point b = new Point(1, 2);
        Point c = new Point(3, 4);
        System.out.println(a);
        System.out.println(a.equals(b));
        System.out.println(a.equals(c));
    }
}

class Point {
    int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }

    // Override toString() to return "(x, y)"
    // Override equals(Object o) so two Points are equal when their x and y match
}`,
            expectedOutput: "(1, 2)\ntrue\nfalse",
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
