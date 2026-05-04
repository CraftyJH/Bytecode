import { kotlinBridgeModules } from "./kotlin-bridge-modules";

export interface LessonMeta {
  slug: string;
  title: string;
  order: number;
  duration: number; // minutes
  isPremium: boolean;
  /** Playground language for Judge0. Defaults to Java when omitted. */
  language?: "java" | "kotlin";
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
    tagline: "Interfaces, exceptions, generics, collections, enums, nested classes, and file I/O.",
    modules: [
      // ── Module 1: Interfaces & Abstraction ──────────────────────────
      {
        slug: "module-1",
        title: "Interfaces & Abstraction",
        order: 1,
        isPremium: false,
        lessons: [
          {
            slug: "what-is-an-interface",
            title: "What Is an Interface?",
            order: 1,
            duration: 12,
            isPremium: false,
            starterCode:
`interface Describable {
    String describe();
}

class Product implements Describable {
    private String name;
    private double price;

    Product(String name, double price) {
        this.name = name;
        this.price = price;
    }

    public String describe() {
        // TODO: return name + " costs $" + price
        return "";
    }
}

public class Main {
    public static void main(String[] args) {
        Describable p1 = new Product("Book", 9.99);
        Describable p2 = new Product("Pen", 1.49);
        System.out.println(p1.describe());
        System.out.println(p2.describe());
    }
}`,
            expectedOutput: "Book costs $9.99\nPen costs $1.49",
          },
          {
            slug: "implementing-multiple-interfaces",
            title: "Implementing Multiple Interfaces",
            order: 2,
            duration: 12,
            isPremium: false,
            starterCode:
`interface Printable {
    void print();
}

interface Exportable {
    String export();
}

class Report implements Printable, Exportable {
    private String title;
    private int pages;

    Report(String title, int pages) {
        this.title = title;
        this.pages = pages;
    }

    public void print() {
        // TODO: print "Printing: " + title + " (" + pages + " pages)"
    }

    public String export() {
        // TODO: return "EXPORT:" + title + ":" + pages
        return "";
    }
}

public class Main {
    public static void main(String[] args) {
        Report r = new Report("Q4 Results", 12);
        r.print();
        System.out.println(r.export());

        Printable p = r;
        p.print();
    }
}`,
            expectedOutput: "Printing: Q4 Results (12 pages)\nEXPORT:Q4 Results:12\nPrinting: Q4 Results (12 pages)",
          },
          {
            slug: "abstract-classes",
            title: "Abstract Classes",
            order: 3,
            duration: 14,
            isPremium: false,
            starterCode:
`abstract class Animal {
    protected String name;

    Animal(String name) {
        this.name = name;
    }

    abstract String speak();

    void introduce() {
        System.out.println("I am " + name + " and I say: " + speak());
    }
}

class Dog extends Animal {
    Dog(String name) { super(name); }

    public String speak() {
        // TODO: return "Woof!"
        return "";
    }
}

class Cat extends Animal {
    Cat(String name) { super(name); }

    public String speak() {
        // TODO: return "Meow!"
        return "";
    }
}

public class Main {
    public static void main(String[] args) {
        Animal[] animals = { new Dog("Rex"), new Cat("Whiskers"), new Dog("Buddy") };
        for (Animal a : animals) {
            a.introduce();
        }
    }
}`,
            expectedOutput: "I am Rex and I say: Woof!\nI am Whiskers and I say: Meow!\nI am Buddy and I say: Woof!",
          },
          {
            slug: "interface-vs-abstract-class",
            title: "Interface vs Abstract Class",
            order: 4,
            duration: 12,
            isPremium: false,
            starterCode:
`interface Flyable {
    void fly();
    default String getMode() { return "wings"; }
}

interface Swimmable {
    void swim();
}

abstract class Bird {
    protected String species;
    Bird(String species) { this.species = species; }
    abstract void sing();
}

class Duck extends Bird implements Flyable, Swimmable {
    Duck() { super("Mallard"); }

    public void sing() {
        // TODO: print species + ": Quack!"
    }

    public void fly() {
        // TODO: print species + " flies with " + getMode()
    }

    public void swim() {
        // TODO: print species + " paddles"
    }
}

public class Main {
    public static void main(String[] args) {
        Duck d = new Duck();
        d.sing();
        d.fly();
        d.swim();
    }
}`,
            expectedOutput: "Mallard: Quack!\nMallard flies with wings\nMallard paddles",
          },
          {
            slug: "default-static-interface-methods",
            title: "Default and Static Interface Methods",
            order: 5,
            duration: 12,
            isPremium: false,
            starterCode:
`interface StringTransformer {
    String transform(String input);

    default String transformAndTag(String input) {
        return "[" + transform(input) + "]";
    }

    static StringTransformer upperCase() {
        // TODO: return a StringTransformer that converts input to uppercase
        return null;
    }

    static StringTransformer reverse() {
        // TODO: return a StringTransformer that reverses the string
        return null;
    }
}

public class Main {
    public static void main(String[] args) {
        StringTransformer upper = StringTransformer.upperCase();
        StringTransformer rev   = StringTransformer.reverse();

        System.out.println(upper.transform("hello"));
        System.out.println(upper.transformAndTag("hello"));
        System.out.println(rev.transform("java"));
        System.out.println(rev.transformAndTag("java"));
    }
}`,
            expectedOutput: "HELLO\n[HELLO]\navaj\n[avaj]",
          },
          {
            slug: "functional-interfaces",
            title: "Functional Interfaces — A First Look",
            order: 6,
            duration: 14,
            isPremium: false,
            starterCode:
`import java.util.function.*;
import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Predicate<T>: tests a condition → boolean
        Predicate<String> isLong = s -> s.length() > 5;
        System.out.println(isLong.test("Hi"));
        System.out.println(isLong.test("Hello, World"));

        // Function<T,R>: transforms a value
        Function<Integer, String> toLabel = n -> "Item #" + n;
        System.out.println(toLabel.apply(1));
        System.out.println(toLabel.apply(42));

        // Consumer<T>: acts on a value, returns nothing
        List<String> seen = new ArrayList<>();
        Consumer<String> record = s -> seen.add(s.toUpperCase());
        record.accept("apple");
        record.accept("banana");
        System.out.println(seen);

        // Supplier<T>: produces a value, takes nothing
        Supplier<String> greeting = () -> "Hello, Java!";
        System.out.println(greeting.get());
    }
}`,
            expectedOutput: "false\ntrue\nItem #1\nItem #42\n[APPLE, BANANA]\nHello, Java!",
          },
        ],
      },

      // ── Module 2: Exception Handling ────────────────────────────────
      {
        slug: "module-2",
        title: "Exception Handling",
        order: 2,
        isPremium: false,
        lessons: [
          {
            slug: "what-are-exceptions",
            title: "What Are Exceptions?",
            order: 1,
            duration: 10,
            isPremium: false,
            starterCode:
`public class Main {
    public static void main(String[] args) {
        safeDivide(10, 2);
        safeDivide(5, 0);
        safeDivide(9, 3);
    }

    static void safeDivide(int a, int b) {
        try {
            // TODO: compute and print a + " / " + b + " = " + (a / b)
        } catch (ArithmeticException e) {
            // TODO: print "Cannot divide " + a + " by zero"
        }
    }
}`,
            expectedOutput: "10 / 2 = 5\nCannot divide 5 by zero\n9 / 3 = 3",
          },
          {
            slug: "try-catch-finally",
            title: "try, catch, and finally",
            order: 2,
            duration: 14,
            isPremium: false,
            starterCode:
`public class Main {
    public static void main(String[] args) {
        process("42");
        process("hello");
        process("-7");
        process("100");
    }

    static void process(String input) {
        try {
            int n = Integer.parseInt(input);
            if (n < 0) throw new IllegalArgumentException("negative");
            System.out.println("Accepted: " + n);
        } catch (NumberFormatException e) {
            System.out.println("Not a number: " + input);
        } catch (IllegalArgumentException e) {
            System.out.println("Rejected: " + e.getMessage());
        } finally {
            // TODO: print "Done: " + input
        }
    }
}`,
            expectedOutput: "Accepted: 42\nDone: 42\nNot a number: hello\nDone: hello\nRejected: negative\nDone: -7\nAccepted: 100\nDone: 100",
          },
          {
            slug: "checked-vs-unchecked",
            title: "Checked vs Unchecked Exceptions",
            order: 3,
            duration: 12,
            isPremium: false,
            starterCode:
`import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try {
            String data = fetchData("server.txt");
            System.out.println("Got: " + data);
        } catch (IOException e) {
            System.out.println("IO error: " + e.getMessage());
        }

        validateAge(25);
        validateAge(-3);
    }

    static String fetchData(String source) throws IOException {
        // TODO: throw new IOException("source not found: " + source)
        return "";
    }

    static void validateAge(int age) {
        try {
            if (age < 0) {
                // TODO: throw new IllegalArgumentException("age must be non-negative")
            }
            System.out.println("Valid age: " + age);
        } catch (IllegalArgumentException e) {
            System.out.println("Bad age: " + e.getMessage());
        }
    }
}`,
            expectedOutput: "IO error: source not found: server.txt\nValid age: 25\nBad age: age must be non-negative",
          },
          {
            slug: "throwing-exceptions",
            title: "Throwing Exceptions",
            order: 4,
            duration: 12,
            isPremium: false,
            starterCode:
`public class Main {
    public static void main(String[] args) {
        runTest(() -> System.out.println(safeSqrt(16.0)),   IllegalArgumentException.class);
        runTest(() -> System.out.println(safeSqrt(-4.0)),   IllegalArgumentException.class);
        runTest(() -> System.out.println(getElement(new int[]{10, 20, 30}, 1)), ArrayIndexOutOfBoundsException.class);
        runTest(() -> System.out.println(getElement(new int[]{10, 20, 30}, 5)), ArrayIndexOutOfBoundsException.class);
    }

    static double safeSqrt(double n) {
        if (n < 0) {
            // TODO: throw new IllegalArgumentException("Cannot take sqrt of negative: " + n)
        }
        return Math.sqrt(n);
    }

    static int getElement(int[] arr, int index) {
        if (index < 0 || index >= arr.length) {
            // TODO: throw new ArrayIndexOutOfBoundsException("Index " + index + " out of bounds for length " + arr.length)
        }
        return arr[index];
    }

    static void runTest(Runnable r, Class<? extends RuntimeException> expected) {
        try { r.run(); }
        catch (RuntimeException e) { System.out.println("Error: " + e.getMessage()); }
    }
}`,
            expectedOutput: "4.0\nError: Cannot take sqrt of negative: -4.0\n20\nError: Index 5 out of bounds for length 3",
          },
          {
            slug: "custom-exceptions",
            title: "Creating Custom Exceptions",
            order: 5,
            duration: 12,
            isPremium: false,
            starterCode:
`class ValidationException extends Exception {
    private final String field;

    ValidationException(String field, String message) {
        super(message);
        this.field = field;
    }

    String getField() { return field; }
}

class UserRegistration {
    static void register(String username, String email, int age)
            throws ValidationException {
        if (username == null || username.length() < 3)
            // TODO: throw new ValidationException("username", "Must be at least 3 characters")
            ;
        if (email == null || !email.contains("@"))
            // TODO: throw new ValidationException("email", "Must contain @")
            ;
        if (age < 13)
            // TODO: throw new ValidationException("age", "Must be 13 or older")
            ;
        System.out.println("Registered: " + username);
    }
}

public class Main {
    public static void main(String[] args) {
        attempt("alice", "alice@example.com", 20);
        attempt("ab",    "alice@example.com", 20);
        attempt("alice", "notanemail",        20);
        attempt("alice", "alice@example.com", 10);
    }

    static void attempt(String u, String e, int age) {
        try {
            UserRegistration.register(u, e, age);
        } catch (ValidationException ex) {
            System.out.println("Field '" + ex.getField() + "': " + ex.getMessage());
        }
    }
}`,
            expectedOutput: "Registered: alice\nField 'username': Must be at least 3 characters\nField 'email': Must contain @\nField 'age': Must be 13 or older",
          },
          {
            slug: "exception-best-practices",
            title: "Best Practices and Common Mistakes",
            order: 6,
            duration: 14,
            isPremium: false,
            starterCode:
`public class Main {
    static class Connection implements AutoCloseable {
        private final String host;
        private boolean open = false;

        Connection(String host) throws Exception {
            if (host == null || host.isEmpty())
                throw new IllegalArgumentException("Host required");
            this.host = host;
            this.open = true;
            System.out.println("Connected to " + host);
        }

        String query(String sql) {
            if (!open) throw new IllegalStateException("Connection closed");
            return "result from " + host + ": " + sql;
        }

        public void close() {
            open = false;
            System.out.println("Disconnected from " + host);
        }
    }

    public static void main(String[] args) {
        // TODO: use try-with-resources to open Connection("db.local"),
        //       call query("SELECT 1"), and print the result
        try (Connection c = new Connection("db.local")) {
            System.out.println(c.query("SELECT 1"));
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }

        // TODO: open Connection("") — should print the caught error
        try (Connection c = new Connection("")) {
            System.out.println(c.query("SELECT 1"));
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}`,
            expectedOutput: "Connected to db.local\nresult from db.local: SELECT 1\nDisconnected from db.local\nError: Host required",
          },
        ],
      },

      // ── Module 3: Generics ───────────────────────────────────────────
      {
        slug: "module-3",
        title: "Generics",
        order: 3,
        isPremium: false,
        lessons: [
          {
            slug: "why-generics",
            title: "Why Generics Exist",
            order: 1,
            duration: 12,
            isPremium: false,
            starterCode:
`public class Main {
    static class Pair<A, B> {
        final A first;
        final B second;
        Pair(A first, B second) { this.first = first; this.second = second; }

        @Override
        public String toString() {
            // TODO: return "(" + first + ", " + second + ")"
            return "";
        }
    }

    public static void main(String[] args) {
        Pair<String, Integer> person = new Pair<>("Alice", 30);
        Pair<Integer, Boolean> status = new Pair<>(404, false);
        Pair<String, String>   coords = new Pair<>("40.7N", "74.0W");

        System.out.println(person);
        System.out.println(person.first.toUpperCase());
        System.out.println(status);
        System.out.println(status.second);
        System.out.println(coords);
    }
}`,
            expectedOutput: "(Alice, 30)\nALICE\n(404, false)\nfalse\n(40.7N, 74.0W)",
          },
          {
            slug: "generic-classes",
            title: "Generic Classes",
            order: 2,
            duration: 14,
            isPremium: false,
            starterCode:
`import java.util.*;

public class Main {
    static class Stack<T> {
        private final List<T> items = new ArrayList<>();

        void push(T item) {
            // TODO: add item to items
        }

        T pop() {
            if (items.isEmpty()) throw new NoSuchElementException("Stack is empty");
            // TODO: remove and return the last element
            return null;
        }

        T peek() {
            if (items.isEmpty()) throw new NoSuchElementException("Stack is empty");
            // TODO: return the last element without removing it
            return null;
        }

        int size()      { return items.size(); }
        boolean isEmpty() { return items.isEmpty(); }
    }

    public static void main(String[] args) {
        Stack<Integer> s = new Stack<>();
        s.push(1); s.push(2); s.push(3);
        System.out.println("Size: " + s.size());
        System.out.println("Peek: " + s.peek());
        System.out.println("Pop: "  + s.pop());
        System.out.println("Pop: "  + s.pop());
        System.out.println("Size: " + s.size());
    }
}`,
            expectedOutput: "Size: 3\nPeek: 3\nPop: 3\nPop: 2\nSize: 1",
          },
          {
            slug: "generic-methods",
            title: "Generic Methods",
            order: 3,
            duration: 14,
            isPremium: false,
            starterCode:
`import java.util.*;

public class Main {
    static <T extends Comparable<T>> T min(T a, T b) {
        // TODO: return the smaller of a and b using compareTo
        return null;
    }

    static <T> void reverse(List<T> list) {
        // TODO: reverse list in-place by swapping elements from outside in
    }

    static <T> List<T> repeat(T item, int times) {
        // TODO: return a new List containing item repeated times times
        return null;
    }

    public static void main(String[] args) {
        System.out.println(min(3, 7));
        System.out.println(min("apple", "banana"));

        List<Integer> nums = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
        reverse(nums);
        System.out.println(nums);

        System.out.println(repeat("ha", 3));
    }
}`,
            expectedOutput: "3\napple\n[5, 4, 3, 2, 1]\n[ha, ha, ha]",
          },
          {
            slug: "bounded-type-parameters",
            title: "Bounded Type Parameters",
            order: 4,
            duration: 14,
            isPremium: false,
            starterCode:
`import java.util.*;

public class Main {
    static <T extends Number & Comparable<T>> T clamp(T value, T min, T max) {
        // TODO: return min if value < min, max if value > max, else value
        return null;
    }

    static <T extends Number> double average(List<T> numbers) {
        // TODO: return arithmetic mean; return 0 if list is empty
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(clamp(5, 1, 10));
        System.out.println(clamp(-3, 0, 100));
        System.out.println(clamp(150, 0, 100));

        System.out.println(average(Arrays.asList(2, 4, 6, 8, 10)));
        System.out.println(average(Arrays.asList(1.0, 2.0, 3.0)));
    }
}`,
            expectedOutput: "5\n0\n100\n6.0\n2.0",
          },
          {
            slug: "wildcards",
            title: "Wildcards — ?, ? extends, ? super",
            order: 5,
            duration: 16,
            isPremium: false,
            starterCode:
`import java.util.*;

public class Main {
    // Upper bounded: read Numbers from any List<? extends Number>
    static double sum(List<? extends Number> list) {
        // TODO: return sum of all elements using doubleValue()
        return 0;
    }

    // Lower bounded: add Integers to any List<? super Integer>
    static void fillWith(List<? super Integer> list, int count, int value) {
        // TODO: add 'count' copies of 'value' to list
    }

    // Unbounded: works with any List — print each element
    static void printAll(List<?> list) {
        // TODO: print each element on its own line
    }

    public static void main(String[] args) {
        System.out.println(sum(Arrays.asList(1, 2, 3, 4, 5)));
        System.out.println(sum(Arrays.asList(0.5, 1.5, 2.0)));

        List<Number> numbers = new ArrayList<>();
        fillWith(numbers, 3, 7);
        System.out.println(numbers);

        printAll(Arrays.asList("a", "b", "c"));
    }
}`,
            expectedOutput: "15.0\n4.0\n[7, 7, 7]\na\nb\nc",
          },
        ],
      },

      // ── Module 4: Collections Framework ────────────────────────────
      {
        slug: "module-4",
        title: "The Collections Framework",
        order: 4,
        isPremium: false,
        lessons: [
          {
            slug: "collections-overview",
            title: "Overview — The Collections Landscape",
            order: 1,
            duration: 12,
            isPremium: false,
            starterCode:
`import java.util.*;

public class Main {
    public static void main(String[] args) {
        // List: ordered, allows duplicates, indexed
        List<String> shopping = new ArrayList<>();
        // TODO: add "milk", "eggs", "bread", "eggs"
        System.out.println("Shopping (" + shopping.size() + "): " + shopping);

        // Set: no duplicates — TreeSet keeps sorted order
        Set<String> unique = new TreeSet<>(shopping);
        System.out.println("Unique items: " + unique);

        // Map: key → value pairs
        Map<String, Integer> stock = new TreeMap<>();
        // TODO: put "milk"->12, "eggs"->24, "bread"->8
        System.out.println("Eggs in stock: " + stock.get("eggs"));
    }
}`,
            expectedOutput: "Shopping (4): [milk, eggs, bread, eggs]\nUnique items: [bread, eggs, milk]\nEggs in stock: 24",
          },
          {
            slug: "arraylist",
            title: "ArrayList",
            order: 2,
            duration: 14,
            isPremium: false,
            starterCode:
`import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<Integer> numbers = new ArrayList<>(Arrays.asList(5, 2, 8, 1, 9, 3));
        System.out.println("Original: " + numbers);

        // TODO: add 7 to the list
        // TODO: remove the element at index 2
        // TODO: sort the list with Collections.sort
        System.out.println("Sorted: " + numbers);

        // TODO: print the index of value 9
        System.out.println("Index of 9: " + numbers.indexOf(9));

        // TODO: print subList from index 1 to 4 (exclusive)
        System.out.println("Slice [1,4): " + numbers.subList(1, 4));
    }
}`,
            expectedOutput: "Original: [5, 2, 8, 1, 9, 3]\nSorted: [1, 2, 3, 5, 7, 9]\nIndex of 9: 5\nSlice [1,4): [2, 3, 5]",
          },
          {
            slug: "linkedlist",
            title: "LinkedList and When to Use It",
            order: 3,
            duration: 12,
            isPremium: false,
            starterCode:
`import java.util.*;

public class Main {
    public static void main(String[] args) {
        // LinkedList as a Deque (double-ended stack)
        Deque<String> history = new LinkedList<>();
        // TODO: push "home", then "about", then "contact" onto the front
        System.out.println("Current page: " + history.peek());
        System.out.println("History: " + history);

        // TODO: pop the top page and print what's now on top
        history.pop();
        System.out.println("After back: " + history.peek());

        // LinkedList as a Queue (FIFO)
        Queue<String> tasks = new LinkedList<>();
        // TODO: offer "task1", "task2", "task3"
        System.out.println("Next task: " + tasks.poll());
        System.out.println("Remaining: " + tasks.size());
    }
}`,
            expectedOutput: "Current page: contact\nHistory: [contact, about, home]\nAfter back: about\nNext task: task1\nRemaining: 2",
          },
          {
            slug: "hashset-treeset",
            title: "HashSet and TreeSet",
            order: 4,
            duration: 14,
            isPremium: false,
            starterCode:
`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Set<Integer> primes = new HashSet<>(Arrays.asList(2, 3, 5, 7, 11, 13));
        // TODO: print whether 7 and 9 are in primes
        System.out.println("7 is prime: " + primes.contains(7));
        System.out.println("9 is prime: " + primes.contains(9));

        Set<String> words = new TreeSet<>(
            Arrays.asList("banana", "apple", "cherry", "date", "avocado"));
        System.out.println("Sorted: " + words);

        // TODO: print headSet("cherry") — elements strictly before "cherry"
        TreeSet<String> ts = (TreeSet<String>) words;
        System.out.println("Before cherry: " + ts.headSet("cherry"));

        // TODO: compute intersection of a and b using retainAll, then print via TreeSet
        Set<Integer> a = new HashSet<>(Arrays.asList(1, 2, 3, 4, 5));
        Set<Integer> b = new HashSet<>(Arrays.asList(3, 4, 5, 6, 7));
        a.retainAll(b);
        System.out.println("Intersection: " + new TreeSet<>(a));
    }
}`,
            expectedOutput: "7 is prime: true\n9 is prime: false\nSorted: [apple, avocado, banana, cherry, date]\nBefore cherry: [apple, avocado, banana]\nIntersection: [3, 4, 5]",
          },
          {
            slug: "hashmap",
            title: "HashMap",
            order: 5,
            duration: 16,
            isPremium: false,
            starterCode:
`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Map<String, List<String>> courses = new HashMap<>();
        // TODO: put "Alice"->["Math","Physics"], "Bob"->["English","History","Art"],
        //        "Charlie"->["Math","CS"]

        System.out.println("Students: " + courses.size());

        // TODO: add "Chemistry" to Alice's list, then print Alice's course count
        System.out.println("Alice's courses: " + courses.get("Alice").size());

        // TODO: count total enrolments across all students
        int total = 0;
        for (List<String> c : courses.values()) total += c.size();
        System.out.println("Total enrolments: " + total);

        // TODO: print Diana's course count using getOrDefault (should be 0)
        System.out.println("Diana's courses: " +
            courses.getOrDefault("Diana", Collections.emptyList()).size());

        List<String> names = new ArrayList<>(courses.keySet());
        Collections.sort(names);
        System.out.println("Students (sorted): " + names);
    }
}`,
            expectedOutput: "Students: 3\nAlice's courses: 3\nTotal enrolments: 8\nDiana's courses: 0\nStudents (sorted): [Alice, Bob, Charlie]",
          },
          {
            slug: "treemap-sorted-maps",
            title: "TreeMap and Sorted Maps",
            order: 6,
            duration: 12,
            isPremium: false,
            starterCode:
`import java.util.*;

public class Main {
    public static void main(String[] args) {
        TreeMap<Integer, String> schedule = new TreeMap<>();
        schedule.put(9,  "Standup");
        schedule.put(14, "Code review");
        schedule.put(11, "Design meeting");
        schedule.put(16, "1-1 with manager");
        schedule.put(10, "Pair programming");

        System.out.println("Full schedule: " + schedule);
        System.out.println("First event: " + schedule.firstKey() + ":00");
        System.out.println("Last event: "  + schedule.lastKey()  + ":00");

        // TODO: print events strictly before noon using headMap(12)
        System.out.println("Morning: " + schedule.headMap(12));

        // TODO: use floorEntry(13) to get the event at or before 13:00
        Map.Entry<Integer, String> e = schedule.floorEntry(13);
        System.out.println("Around 13:00: " + e.getKey() + ":00 " + e.getValue());

        // Print keys in reverse
        List<String> rev = new ArrayList<>();
        for (Integer k : schedule.descendingKeySet()) rev.add(k + ":00");
        System.out.println("Reverse: " + String.join(", ", rev));
    }
}`,
            expectedOutput: "Full schedule: {9=Standup, 10=Pair programming, 11=Design meeting, 14=Code review, 16=1-1 with manager}\nFirst event: 9:00\nLast event: 16:00\nMorning: {9=Standup, 10=Pair programming, 11=Design meeting}\nAround 13:00: 11:00 Design meeting\nReverse: 16:00, 14:00, 11:00, 10:00, 9:00",
          },
          {
            slug: "choosing-collection",
            title: "Choosing the Right Collection",
            order: 7,
            duration: 14,
            isPremium: false,
            starterCode:
`import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Scenario 1: fast index access → ArrayList
        List<Double> readings = new ArrayList<>();
        for (int i = 1; i <= 5; i++) readings.add(i * 0.5);
        System.out.println("Reading at index 3: " + readings.get(3));

        // Scenario 2: unique sorted items → TreeSet
        Set<String> tags = new TreeSet<>(
            Arrays.asList("java", "backend", "api", "java", "rest"));
        System.out.println("Unique tags: " + tags);

        // Scenario 3: word frequency → TreeMap (sorted keys)
        Map<String, Integer> freq = new TreeMap<>();
        for (String w : "to be or not to be that is the question".split(" "))
            freq.merge(w, 1, Integer::sum);
        System.out.println("'be' count: " + freq.get("be"));
        System.out.println("Sorted keys: " + freq.keySet());

        // Scenario 4: FIFO task queue → LinkedList as Queue
        Queue<String> requests = new LinkedList<>();
        requests.offer("GET /api/users");
        requests.offer("POST /api/login");
        requests.offer("DELETE /api/session");
        System.out.println("Processing: " + requests.poll());
        System.out.println("Queue size: " + requests.size());
    }
}`,
            expectedOutput: "Reading at index 3: 2.0\nUnique tags: [api, backend, java, rest]\n'be' count: 2\nSorted keys: [be, is, not, or, question, that, the, to]\nProcessing: GET /api/users\nQueue size: 2",
          },
        ],
      },

      // ── Module 5: Iterators & for-each ─────────────────────────────
      {
        slug: "module-5",
        title: "Iterators and the for-each Loop",
        order: 5,
        isPremium: false,
        lessons: [
          {
            slug: "for-each-loop",
            title: "The for-each Loop and Iterable",
            order: 1,
            duration: 10,
            isPremium: false,
            starterCode:
`import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<String> langs = Arrays.asList("Java", "Kotlin", "Scala", "Groovy");
        // TODO: print each language using a for-each loop, prefixed with "- "
        for (String lang : langs) {
            System.out.println("- " + lang);
        }

        int[] nums = {1, 2, 3, 4, 5};
        int sum = 0;
        // TODO: sum the array using for-each
        for (int n : nums) sum += n;
        System.out.println("sum=" + sum);
    }
}`,
            expectedOutput: "- Java\n- Kotlin\n- Scala\n- Groovy\nsum=15",
          },
          {
            slug: "using-iterator",
            title: "Using Iterator Directly",
            order: 2,
            duration: 12,
            isPremium: false,
            starterCode:
`import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<String> tasks = new ArrayList<>(Arrays.asList("eat", "sleep", "code"));
        Iterator<String> it = tasks.iterator();
        // TODO: walk the iterator with hasNext / next, printing "doing: <task>"
        while (it.hasNext()) {
            String task = it.next();
            System.out.println("doing: " + task);
        }
        System.out.println("done");
    }
}`,
            expectedOutput: "doing: eat\ndoing: sleep\ndoing: code\ndone",
          },
          {
            slug: "removing-while-iterating",
            title: "Removing Elements Safely While Iterating",
            order: 3,
            duration: 12,
            isPremium: false,
            starterCode:
`import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<Integer> nums = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6));
        Iterator<Integer> it = nums.iterator();
        // TODO: while iterating, remove all even numbers using it.remove()
        while (it.hasNext()) {
            int n = it.next();
            if (n % 2 == 0) it.remove();
        }
        System.out.println("odd only: " + nums);
    }
}`,
            expectedOutput: "odd only: [1, 3, 5]",
          },
          {
            slug: "custom-iterable",
            title: "Building a Custom Iterable",
            order: 4,
            duration: 14,
            isPremium: false,
            starterCode:
`import java.util.*;

public class Main implements Iterable<Integer> {
    private final int max;
    public Main(int max) { this.max = max; }

    @Override
    public Iterator<Integer> iterator() {
        return new Iterator<Integer>() {
            int n = 1;
            public boolean hasNext() { return n <= max; }
            public Integer next() { return n++; }
        };
    }

    public static void main(String[] args) {
        Main range = new Main(5);
        // TODO: iterate range with a for-each loop, printing each number
        for (int n : range) System.out.println(n);
    }
}`,
            expectedOutput: "1\n2\n3\n4\n5",
          },
          {
            slug: "streams-intro",
            title: "Streams — A First Look",
            order: 5,
            duration: 14,
            isPremium: false,
            starterCode:
`import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        // TODO: use a stream to sum the squares of the even numbers
        int result = nums.stream()
            .filter(n -> n % 2 == 0)
            .mapToInt(n -> n * n)
            .sum();
        System.out.println("result: " + result);

        // TODO: collect odd numbers into a List<Integer>
        List<Integer> odds = nums.stream()
            .filter(n -> n % 2 != 0)
            .collect(Collectors.toList());
        System.out.println("odds: " + odds);
    }
}`,
            expectedOutput: "result: 220\nodds: [1, 3, 5, 7, 9]",
          },
        ],
      },

      // ── Module 6: Enums ────────────────────────────────────────────
      {
        slug: "module-6",
        title: "Enums",
        order: 6,
        isPremium: false,
        lessons: [
          {
            slug: "enum-basics",
            title: "What is an Enum?",
            order: 1,
            duration: 10,
            isPremium: false,
            starterCode:
`public class Main {
    enum TrafficLight { RED, YELLOW, GREEN }

    public static void main(String[] args) {
        TrafficLight light = TrafficLight.GREEN;
        System.out.println("State: " + light);
        System.out.println("Ordinal: " + light.ordinal());
        System.out.println("Total: " + TrafficLight.values().length);
        TrafficLight parsed = TrafficLight.valueOf("RED");
        System.out.println("Parsed: " + parsed);
    }
}`,
            expectedOutput: "State: GREEN\nOrdinal: 2\nTotal: 3\nParsed: RED",
          },
          {
            slug: "enums-with-fields",
            title: "Enum Constructors and Methods",
            order: 2,
            duration: 12,
            isPremium: false,
            starterCode:
`public class Main {
    enum Coin {
        PENNY(1), NICKEL(5), DIME(10), QUARTER(25);

        private final int cents;
        Coin(int cents) { this.cents = cents; }
        public int cents() { return cents; }
    }

    public static void main(String[] args) {
        int total = 0;
        for (Coin c : Coin.values()) {
            System.out.println(c + " = " + c.cents() + " cents");
            total += c.cents();
        }
        System.out.println("Total: " + total + " cents");
    }
}`,
            expectedOutput: "PENNY = 1 cents\nNICKEL = 5 cents\nDIME = 10 cents\nQUARTER = 25 cents\nTotal: 41 cents",
          },
          {
            slug: "enum-abstract-methods",
            title: "Per-Constant Behaviour with Abstract Methods",
            order: 3,
            duration: 14,
            isPremium: false,
            starterCode:
`public class Main {
    enum Op {
        ADD { public int apply(int a, int b) { return a + b; } },
        SUB { public int apply(int a, int b) { return a - b; } },
        MUL { public int apply(int a, int b) { return a * b; } };

        public abstract int apply(int a, int b);
    }

    public static void main(String[] args) {
        for (Op op : Op.values()) {
            System.out.println(op + "(3, 4) = " + op.apply(3, 4));
        }
    }
}`,
            expectedOutput: "ADD(3, 4) = 7\nSUB(3, 4) = -1\nMUL(3, 4) = 12",
          },
          {
            slug: "enums-implement-interface",
            title: "Enums Implementing Interfaces",
            order: 4,
            duration: 12,
            isPremium: false,
            starterCode:
`public class Main {
    interface Greetable { String greet(); }

    enum Lang implements Greetable {
        ENGLISH { public String greet() { return "Hello"; } },
        SPANISH { public String greet() { return "Hola"; } },
        FRENCH  { public String greet() { return "Bonjour"; } };
    }

    public static void main(String[] args) {
        for (Lang l : Lang.values()) {
            System.out.println(l + ": " + l.greet());
        }
    }
}`,
            expectedOutput: "ENGLISH: Hello\nSPANISH: Hola\nFRENCH: Bonjour",
          },
          {
            slug: "enumset-enummap",
            title: "EnumSet and EnumMap",
            order: 5,
            duration: 12,
            isPremium: false,
            starterCode:
`import java.util.*;

public class Main {
    enum Day { MON, TUE, WED, THU, FRI, SAT, SUN }

    public static void main(String[] args) {
        EnumSet<Day> weekend = EnumSet.of(Day.SAT, Day.SUN);
        EnumSet<Day> weekday = EnumSet.complementOf(weekend);
        System.out.println("Weekend: " + weekend);
        System.out.println("Weekday: " + weekday);

        EnumMap<Day, String> mood = new EnumMap<>(Day.class);
        mood.put(Day.MON, "tired");
        mood.put(Day.FRI, "happy");
        mood.put(Day.SAT, "ecstatic");
        for (Map.Entry<Day, String> e : mood.entrySet()) {
            System.out.println(e.getKey() + ": " + e.getValue());
        }
    }
}`,
            expectedOutput: "Weekend: [SAT, SUN]\nWeekday: [MON, TUE, WED, THU, FRI]\nMON: tired\nFRI: happy\nSAT: ecstatic",
          },
        ],
      },

      // ── Module 7: Nested & Inner Classes ───────────────────────────
      {
        slug: "module-7",
        title: "Nested and Inner Classes",
        order: 7,
        isPremium: false,
        lessons: [
          {
            slug: "static-nested",
            title: "Static Nested Classes",
            order: 1,
            duration: 12,
            isPremium: false,
            starterCode:
`public class Main {
    static class Pair {
        final int first;
        final int second;
        Pair(int a, int b) { first = a; second = b; }
        @Override
        public String toString() { return "(" + first + "," + second + ")"; }
    }

    public static void main(String[] args) {
        Pair p = new Pair(3, 7);
        System.out.println("Pair: " + p);
        System.out.println("Sum: " + (p.first + p.second));
    }
}`,
            expectedOutput: "Pair: (3,7)\nSum: 10",
          },
          {
            slug: "inner-classes",
            title: "Inner Classes — Linked to Enclosing Instance",
            order: 2,
            duration: 12,
            isPremium: false,
            starterCode:
`public class Main {
    private int counter = 0;

    class Incrementer {
        void increment() { counter++; }
    }

    public static void main(String[] args) {
        Main outer = new Main();
        Main.Incrementer inc = outer.new Incrementer();
        inc.increment();
        inc.increment();
        inc.increment();
        System.out.println("Counter: " + outer.counter);
    }
}`,
            expectedOutput: "Counter: 3",
          },
          {
            slug: "local-classes",
            title: "Local Classes",
            order: 3,
            duration: 10,
            isPremium: false,
            starterCode:
`public class Main {
    static String greetMaker(String prefix) {
        class Greeter {
            String greet(String name) {
                return prefix + ", " + name + "!";
            }
        }
        return new Greeter().greet("World");
    }

    public static void main(String[] args) {
        System.out.println(greetMaker("Hi"));
        System.out.println(greetMaker("Hello"));
    }
}`,
            expectedOutput: "Hi, World!\nHello, World!",
          },
          {
            slug: "anonymous-classes",
            title: "Anonymous Classes",
            order: 4,
            duration: 12,
            isPremium: false,
            starterCode:
`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Comparator<String> byLength = new Comparator<String>() {
            @Override
            public int compare(String a, String b) {
                return Integer.compare(a.length(), b.length());
            }
        };
        List<String> words = new ArrayList<>(
            Arrays.asList("banana", "fig", "elderberry", "apple"));
        words.sort(byLength);
        System.out.println(words);
    }
}`,
            expectedOutput: "[fig, apple, banana, elderberry]",
          },
          {
            slug: "lambdas-vs-anonymous",
            title: "Lambdas vs Anonymous Classes",
            order: 5,
            duration: 12,
            isPremium: false,
            starterCode:
`import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Anonymous class
        Runnable r1 = new Runnable() {
            public void run() { System.out.println("anon"); }
        };
        // Lambda — same job, much shorter
        Runnable r2 = () -> System.out.println("lambda");

        r1.run();
        r2.run();

        List<String> words = new ArrayList<>(
            Arrays.asList("banana", "fig", "elderberry", "apple"));
        // TODO: sort by length using a lambda Comparator
        words.sort((a, b) -> Integer.compare(a.length(), b.length()));
        System.out.println(words);
    }
}`,
            expectedOutput: "anon\nlambda\n[fig, apple, banana, elderberry]",
          },
        ],
      },

      // ── Module 8: File I/O Basics ──────────────────────────────────
      {
        slug: "module-8",
        title: "File I/O Basics",
        order: 8,
        isPremium: false,
        lessons: [
          {
            slug: "path-and-files-api",
            title: "The Path and Files API",
            order: 1,
            duration: 12,
            isPremium: false,
            starterCode:
`import java.nio.file.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Path p = Paths.get("/tmp/example.txt");
        System.out.println("Path: " + p);
        System.out.println("Filename: " + p.getFileName());
        System.out.println("Parent: " + p.getParent());
        System.out.println("Absolute: " + p.isAbsolute());

        Path resolved = Paths.get("/tmp").resolve("notes/today.md");
        System.out.println("Resolved: " + resolved);
    }
}`,
            expectedOutput: "Path: /tmp/example.txt\nFilename: example.txt\nParent: /tmp\nAbsolute: true\nResolved: /tmp/notes/today.md",
          },
          {
            slug: "reading-text-files",
            title: "Reading Text Files",
            order: 2,
            duration: 12,
            isPremium: false,
            starterCode:
`import java.nio.file.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Path p = Paths.get("/tmp/poem.txt");
        Files.writeString(p, "Roses are red\\nViolets are blue\\nJava is solid\\nKotlin is too\\n");

        // TODO: read the whole file as a single String with Files.readString
        String content = Files.readString(p);
        System.out.println("--- All ---");
        System.out.print(content);

        // TODO: read line-by-line with Files.readAllLines
        List<String> lines = Files.readAllLines(p);
        System.out.println("Lines: " + lines.size());
        System.out.println("First: " + lines.get(0));
    }
}`,
            expectedOutput: "--- All ---\nRoses are red\nViolets are blue\nJava is solid\nKotlin is too\nLines: 4\nFirst: Roses are red",
          },
          {
            slug: "writing-text-files",
            title: "Writing Text Files",
            order: 3,
            duration: 12,
            isPremium: false,
            starterCode:
`import java.nio.file.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Path p = Paths.get("/tmp/numbers.txt");
        // TODO: write three lines: one, two, three (each ending with \\n)
        Files.writeString(p, "one\\ntwo\\nthree\\n");
        System.out.println("Wrote: " + Files.size(p) + " bytes");

        // TODO: append "four\\n" using StandardOpenOption.APPEND
        Files.writeString(p, "four\\n", StandardOpenOption.APPEND);
        System.out.println("After append: " + Files.size(p) + " bytes");

        List<String> all = Files.readAllLines(p);
        System.out.println("Lines: " + all);
    }
}`,
            expectedOutput: "Wrote: 14 bytes\nAfter append: 19 bytes\nLines: [one, two, three, four]",
          },
          {
            slug: "working-with-directories",
            title: "Working with Directories",
            order: 4,
            duration: 12,
            isPremium: false,
            starterCode:
`import java.nio.file.*;
import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Path dir = Paths.get("/tmp/sample-dir");
        Files.createDirectories(dir);
        Files.writeString(dir.resolve("a.txt"), "alpha");
        Files.writeString(dir.resolve("b.txt"), "beta");
        Files.writeString(dir.resolve("c.txt"), "gamma");

        // TODO: list the directory, collect filenames, sorted
        List<String> names = new ArrayList<>();
        try (Stream<Path> stream = Files.list(dir)) {
            stream.map(p -> p.getFileName().toString()).sorted().forEach(names::add);
        }
        System.out.println("Files: " + names);
        System.out.println("Exists: " + Files.exists(dir));
    }
}`,
            expectedOutput: "Files: [a.txt, b.txt, c.txt]\nExists: true",
          },
          {
            slug: "try-with-resources",
            title: "try-with-resources",
            order: 5,
            duration: 12,
            isPremium: false,
            starterCode:
`import java.nio.file.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Path p = Paths.get("/tmp/twr.txt");
        Files.writeString(p, "line 1\\nline 2\\nline 3\\n");

        // TODO: open a BufferedReader inside try-with-resources, print each line numbered
        try (BufferedReader r = Files.newBufferedReader(p)) {
            String line;
            int n = 1;
            while ((line = r.readLine()) != null) {
                System.out.println(n + ": " + line);
                n++;
            }
        }
        System.out.println("done — reader auto-closed");
    }
}`,
            expectedOutput: "1: line 1\n2: line 2\n3: line 3\ndone — reader auto-closed",
          },
          {
            slug: "streams-of-lines",
            title: "Streaming File Lines with Files.lines",
            order: 6,
            duration: 14,
            isPremium: false,
            starterCode:
`import java.nio.file.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Path p = Paths.get("/tmp/log.txt");
        Files.writeString(p, "INFO: started\\nWARN: slow query\\nERROR: timeout\\nINFO: finished\\nERROR: crash\\n");

        // TODO: count ERROR lines using Files.lines + filter + count
        long errorCount;
        try (Stream<String> lines = Files.lines(p)) {
            errorCount = lines.filter(l -> l.startsWith("ERROR")).count();
        }
        System.out.println("Error lines: " + errorCount);

        // TODO: print only INFO lines
        try (Stream<String> lines = Files.lines(p)) {
            lines.filter(l -> l.startsWith("INFO")).forEach(System.out::println);
        }
    }
}`,
            expectedOutput: "Error lines: 2\nINFO: started\nINFO: finished",
          },
        ],
      },
    ],
  },
  {
    slug: "java-advanced",
    title: "Java Advanced",
    order: 3,
    isPremium: true,
    tagline: "Generics, functional Java, concurrency, design patterns, testing, JVM internals.",
    modules: [
      // ── Module 1: Generics In Depth ─────────────────────────────────────
      {
        slug: "module-1",
        title: "Generics In Depth",
        order: 1,
        isPremium: true,
        lessons: [
          {
            slug: "generic-classes",
            title: "Generic Classes & Multiple Type Parameters",
            order: 1, duration: 14, isPremium: true,
            starterCode:
`public class Main {
    static class Pair<A, B> {
        private A first;
        private B second;
        Pair(A first, B second) { this.first = first; this.second = second; }
        // TODO: implement getFirst(), getSecond(), and swap() returning Pair<B,A>
        public A getFirst()    { return null; }
        public B getSecond()   { return null; }
        public Pair<B, A> swap() { return null; }
        public String toString() { return "(" + first + ", " + second + ")"; }
    }
    public static void main(String[] args) {
        Pair<String, Integer> p = new Pair<>("hello", 42);
        System.out.println(p.getFirst());
        System.out.println(p.getSecond());
        System.out.println(p.swap());
    }
}`,
            expectedOutput: "hello\n42\n(42, hello)",
          },
          {
            slug: "bounded-types",
            title: "Bounded Type Parameters",
            order: 2, duration: 14, isPremium: true,
            starterCode:
`import java.util.List;
public class Main {
    // TODO: return the largest element using T extends Comparable<T>
    static <T extends Comparable<T>> T max(List<T> items) {
        T result = items.get(0);
        // complete the loop
        return result;
    }
    // TODO: clamp value to [lo, hi]
    static <T extends Comparable<T>> T clamp(T value, T lo, T hi) {
        return value; // fix this
    }
    public static void main(String[] args) {
        System.out.println(max(List.of(3, 1, 4, 1, 5, 9)));
        System.out.println(max(List.of("mango", "apple", "cherry")));
        System.out.println(clamp(15, 1, 10));
        System.out.println(clamp(5,  1, 10));
    }
}`,
            expectedOutput: "9\nmango\n10\n5",
          },
          {
            slug: "wildcards",
            title: "Wildcards — ? extends, ? super, and Unbounded",
            order: 3, duration: 15, isPremium: true,
            starterCode:
`import java.util.*;
public class Main {
    // TODO: sum any list of numbers using ? extends Number
    static double sum(List<? extends Number> nums) { return 0; }

    // TODO: add integers 1..count to a list using ? super Integer
    static void fill(List<? super Integer> list, int count) {}

    public static void main(String[] args) {
        System.out.println(sum(List.of(1, 2, 3, 4, 5)));
        System.out.println(sum(List.of(1.5, 2.5)));
        List<Number> out = new ArrayList<>();
        fill(out, 4);
        System.out.println(out);
    }
}`,
            expectedOutput: "15.0\n4.0\n[1, 2, 3, 4]",
          },
          {
            slug: "generic-methods",
            title: "Generic Methods & Type Inference",
            order: 4, duration: 13, isPremium: true,
            starterCode:
`import java.util.*;
import java.util.function.*;
public class Main {
    // TODO: return a new list of items satisfying predicate
    static <T> List<T> filter(List<T> list, Predicate<T> test) { return List.of(); }

    // TODO: return a new list with f applied to every element
    static <T, R> List<R> map(List<T> list, Function<T, R> f) { return List.of(); }

    public static void main(String[] args) {
        List<Integer> nums = List.of(1, 2, 3, 4, 5, 6);
        System.out.println(filter(nums, n -> n % 2 == 0));
        System.out.println(map(nums, n -> n * n));
        System.out.println(map(List.of("a", "bb", "ccc"), String::length));
    }
}`,
            expectedOutput: "[2, 4, 6]\n[1, 4, 9, 16, 25, 36]\n[1, 2, 3]",
          },
          {
            slug: "type-erasure",
            title: "Type Erasure, Bridge Methods & Raw Types",
            order: 5, duration: 14, isPremium: true,
            starterCode:
`import java.util.*;
public class Main {
    static class Box<T> {
        private T value;
        Box(T value) { this.value = value; }
        public T get() { return value; }
    }
    // Use Class<T> token because instanceof Box<String> is illegal after erasure
    static <T> boolean holds(Box<?> box, Class<T> type) {
        // TODO: return true if the box's value is an instance of type
        return false;
    }
    public static void main(String[] args) {
        Box<String>  bs = new Box<>("hello");
        Box<Integer> bi = new Box<>(99);
        System.out.println(bs.getClass() == bi.getClass()); // same raw type
        System.out.println(holds(bs, String.class));
        System.out.println(holds(bi, Integer.class));
        System.out.println(holds(bs, Integer.class));
    }
}`,
            expectedOutput: "true\ntrue\ntrue\nfalse",
          },
          {
            slug: "comparable-comparator",
            title: "Comparable vs Comparator — Chaining & Reversal",
            order: 6, duration: 14, isPremium: true,
            starterCode:
`import java.util.*;
public class Main {
    record Employee(String name, String dept, int salary) {}
    public static void main(String[] args) {
        List<Employee> staff = new ArrayList<>(List.of(
            new Employee("Dave",  "Engineering", 90000),
            new Employee("Alice", "Marketing",   70000),
            new Employee("Bob",   "Engineering", 85000),
            new Employee("Carol", "Marketing",   70000)
        ));
        // TODO: sort by dept asc, then salary desc, then name asc
        Comparator<Employee> comp = null; // replace with real comparator
        staff.sort(comp);
        staff.forEach(e -> System.out.println(e.name() + " " + e.dept() + " " + e.salary()));
    }
}`,
            expectedOutput: "Dave Engineering 90000\nBob Engineering 85000\nAlice Marketing 70000\nCarol Marketing 70000",
          },
          {
            slug: "generic-data-structures",
            title: "Building Generic Data Structures",
            order: 7, duration: 16, isPremium: true,
            starterCode:
`public class Main {
    static class Stack<T> {
        @SuppressWarnings("unchecked")
        private T[] data = (T[]) new Object[16];
        private int top = 0;
        public void push(T item) { /* TODO: store at data[top++] */ }
        public T pop() {
            // TODO: decrement top, null out slot, return element
            return null;
        }
        public T peek()       { return top == 0 ? null : data[top - 1]; }
        public boolean isEmpty() { return top == 0; }
        public int size()     { return top; }
    }
    public static void main(String[] args) {
        Stack<String> s = new Stack<>();
        s.push("a"); s.push("b"); s.push("c");
        System.out.println(s.peek());
        System.out.println(s.pop());
        System.out.println(s.size());
        System.out.println(s.isEmpty());
    }
}`,
            expectedOutput: "c\nc\n2\nfalse",
          },
          {
            slug: "generic-algorithms",
            title: "Generic Search & Sort Algorithms",
            order: 8, duration: 14, isPremium: true,
            starterCode:
`import java.util.*;
public class Main {
    // TODO: binary search — return index or -1
    static <T extends Comparable<T>> int binarySearch(List<T> sorted, T target) {
        int lo = 0, hi = sorted.size() - 1;
        // complete the algorithm
        return -1;
    }
    // TODO: merge two sorted lists into one sorted list
    static <T extends Comparable<T>> List<T> merge(List<T> a, List<T> b) {
        return List.of();
    }
    public static void main(String[] args) {
        List<Integer> nums = List.of(2, 5, 8, 12, 16, 23, 38);
        System.out.println(binarySearch(nums, 12));
        System.out.println(binarySearch(nums, 10));
        System.out.println(merge(List.of(1, 3, 5), List.of(2, 4, 6)));
    }
}`,
            expectedOutput: "3\n-1\n[1, 2, 3, 4, 5, 6]",
          },
          {
            slug: "type-tokens",
            title: "Type Tokens — Class<T> as a Runtime Key",
            order: 9, duration: 13, isPremium: true,
            starterCode:
`import java.util.*;
public class Main {
    static class TypedMap {
        private final Map<Class<?>, Object> map = new HashMap<>();
        public <T> void put(Class<T> type, T value) { map.put(type, value); }
        @SuppressWarnings("unchecked")
        public <T> T get(Class<T> type) {
            // TODO: retrieve and cast using type.cast()
            return null;
        }
        public boolean has(Class<?> type) { return map.containsKey(type); }
    }
    public static void main(String[] args) {
        TypedMap tm = new TypedMap();
        tm.put(String.class,  "Bytecode");
        tm.put(Integer.class, 2025);
        System.out.println(tm.get(String.class));
        System.out.println(tm.get(Integer.class));
        System.out.println(tm.has(Double.class));
    }
}`,
            expectedOutput: "Bytecode\n2025\nfalse",
          },
          {
            slug: "generic-event-bus",
            title: "Capstone: Type-Safe Event Bus",
            order: 10, duration: 18, isPremium: true,
            starterCode:
`import java.util.*;
import java.util.function.Consumer;
public class Main {
    static class EventBus {
        private final Map<Class<?>, List<Consumer<Object>>> handlers = new HashMap<>();
        @SuppressWarnings("unchecked")
        public <T> void on(Class<T> type, Consumer<T> handler) {
            // TODO: add (Consumer<Object>) handler to the list for this type
        }
        @SuppressWarnings("unchecked")
        public <T> void emit(T event) {
            // TODO: invoke all handlers registered for event.getClass()
        }
    }
    record Login(String user)  {}
    record Purchase(String item, double price) {}
    public static void main(String[] args) {
        EventBus bus = new EventBus();
        bus.on(Login.class,    e -> System.out.println("LOGIN: "  + e.user()));
        bus.on(Purchase.class, e -> System.out.printf("BUY: %s $%.2f%n", e.item(), e.price()));
        bus.emit(new Login("alice"));
        bus.emit(new Purchase("Java Book", 29.99));
    }
}`,
            expectedOutput: "LOGIN: alice\nBUY: Java Book $29.99",
          },
        ],
      },

      // ── Module 2: Functional Java ────────────────────────────────────────
      {
        slug: "module-2",
        title: "Functional Java",
        order: 2,
        isPremium: true,
        lessons: [
          {
            slug: "lambda-expressions",
            title: "Lambda Expressions — Syntax, Capture & Effectively Final",
            order: 1, duration: 14, isPremium: true,
            starterCode:
`import java.util.*;
import java.util.function.*;
public class Main {
    public static void main(String[] args) {
        // TODO: lambda returning the length of a String
        Function<String, Integer> length = s -> 0; // fix

        // TODO: lambda returning product of two ints
        BiFunction<Integer, Integer, Integer> multiply = (a, b) -> 0; // fix

        // TODO: Predicate returning true if number is positive
        Predicate<Integer> positive = n -> false; // fix

        // TODO: sort by length then alphabetically using a lambda comparator
        List<String> words = new ArrayList<>(List.of("fig", "apple", "kiwi", "pear", "cat"));
        words.sort(null); // fix

        System.out.println(length.apply("Bytecode"));
        System.out.println(multiply.apply(6, 7));
        System.out.println(positive.test(-5) + " " + positive.test(3));
        System.out.println(words);
    }
}`,
            expectedOutput: "8\n42\nfalse true\n[cat, fig, kiwi, pear, apple]",
          },
          {
            slug: "functional-interfaces",
            title: "Functional Interfaces — Function, Predicate, Consumer, Supplier",
            order: 2, duration: 14, isPremium: true,
            starterCode:
`import java.util.function.*;
public class Main {
    static <T, R> void pipeline(T input,
                                 Predicate<T> validate,
                                 Function<T, R> transform,
                                 Consumer<R> consume) {
        // TODO: if validate passes, transform then consume
    }
    public static void main(String[] args) {
        pipeline("  hello  ",
            s -> !s.isBlank(),
            s -> s.trim().toUpperCase(),
            s -> System.out.println("Out: " + s));

        pipeline(7,
            n -> n > 0,
            n -> n * n,
            n -> System.out.println("Squared: " + n));

        // Should print nothing — fails validation
        pipeline("",
            s -> !s.isBlank(),
            s -> s.toUpperCase(),
            s -> System.out.println("SKIP: " + s));
    }
}`,
            expectedOutput: "Out: HELLO\nSquared: 49",
          },
          {
            slug: "method-references",
            title: "Method References — Static, Instance & Constructor",
            order: 3, duration: 13, isPremium: true,
            starterCode:
`import java.util.*;
import java.util.stream.*;
public class Main {
    record Product(String name, double price) {
        String label() { return name + ": $" + price; }
    }
    static double withTax(double p) { return Math.round(p * 1.20 * 100) / 100.0; }

    public static void main(String[] args) {
        // TODO: replace lambdas with method references where possible
        List<String> raw = List.of("  Alice  ", "  Bob  ", "  Carol  ");
        raw.stream().map(s -> s.trim()).forEach(s -> System.out.println(s));

        List<Double> prices = List.of(10.0, 25.0, 50.0);
        prices.stream().map(p -> withTax(p)).forEach(p -> System.out.println(p));

        List<Product> products = List.of(new Product("Book", 15.0), new Product("Pen", 2.5));
        products.stream().map(p -> p.label()).forEach(s -> System.out.println(s));
    }
}`,
            expectedOutput: "Alice\nBob\nCarol\n12.0\n30.0\n60.0\nBook: $15.0\nPen: $2.5",
          },
          {
            slug: "streams-filter-map",
            title: "Streams — filter, map, flatMap, sorted & limit",
            order: 4, duration: 15, isPremium: true,
            starterCode:
`import java.util.*;
import java.util.stream.*;
public class Main {
    record Order(String customer, List<String> items) {}
    public static void main(String[] args) {
        List<Integer> nums = List.of(5, 3, 8, 1, 9, 2, 7, 4, 6);

        // TODO: even numbers, sorted ascending, first 3
        List<Integer> result1 = nums.stream()
            .collect(Collectors.toList()); // fix pipeline
        System.out.println(result1);

        // TODO: squares of odd numbers > 4
        List<Integer> result2 = nums.stream()
            .collect(Collectors.toList()); // fix pipeline
        System.out.println(result2);

        // TODO: flatMap all items from all orders into one sorted list
        List<Order> orders = List.of(
            new Order("Alice", List.of("pen", "book")),
            new Order("Bob",   List.of("desk", "pen"))
        );
        List<String> allItems = orders.stream()
            .collect(Collectors.toList()); // fix pipeline
        System.out.println(allItems);
    }
}`,
            expectedOutput: "[2, 4, 6]\n[49, 81]\n[book, desk, pen, pen]",
          },
          {
            slug: "streams-terminal",
            title: "Streams — collect, reduce, count & matching",
            order: 5, duration: 14, isPremium: true,
            starterCode:
`import java.util.*;
import java.util.stream.*;
public class Main {
    record Student(String name, int score) {}
    public static void main(String[] args) {
        List<Student> students = List.of(
            new Student("Alice", 92),
            new Student("Bob",   78),
            new Student("Carol", 85),
            new Student("Dave",  92),
            new Student("Eve",   60)
        );
        // TODO: count students scoring >= 80
        long highScorers = 0; // fix
        System.out.println(highScorers);

        // TODO: sum all scores using reduce
        int total = 0; // fix
        System.out.println(total);

        // TODO: collect names of students scoring >= 85, sorted
        List<String> topNames = List.of(); // fix
        System.out.println(topNames);

        // TODO: is there any student with score == 100?
        boolean perfect = false; // fix
        System.out.println(perfect);
    }
}`,
            expectedOutput: "3\n407\n[Alice, Carol, Dave]\nfalse",
          },
          {
            slug: "collectors",
            title: "Collectors — groupingBy, partitioningBy, joining & more",
            order: 6, duration: 16, isPremium: true,
            starterCode:
`import java.util.*;
import java.util.stream.*;
public class Main {
    record Product(String category, String name, double price) {}
    public static void main(String[] args) {
        List<Product> products = List.of(
            new Product("Books",     "Clean Code",    35.0),
            new Product("Books",     "Effective Java",45.0),
            new Product("Hardware",  "Keyboard",      80.0),
            new Product("Hardware",  "Mouse",         40.0),
            new Product("Software",  "IntelliJ",     200.0)
        );
        // TODO: group by category, print category -> count
        Map<String, Long> countByCategory = Map.of(); // fix
        new TreeMap<>(countByCategory).forEach((k, v) -> System.out.println(k + ": " + v));

        // TODO: partition into expensive (price > 50) and cheap
        Map<Boolean, List<String>> byPrice = Map.of(); // fix
        System.out.println(byPrice.get(true).stream().sorted().collect(Collectors.toList()));
        System.out.println(byPrice.get(false).stream().sorted().collect(Collectors.toList()));

        // TODO: join all product names, separated by ", "
        String joined = ""; // fix
        System.out.println(joined);
    }
}`,
            expectedOutput: "Books: 2\nHardware: 2\nSoftware: 1\n[IntelliJ, Keyboard]\n[Clean Code, Effective Java, Mouse]\nClean Code, Effective Java, Keyboard, Mouse, IntelliJ",
          },
          {
            slug: "optional",
            title: "Optional — Creating, Chaining & Anti-Patterns",
            order: 7, duration: 14, isPremium: true,
            starterCode:
`import java.util.*;
public class Main {
    record User(String name, String email) {}

    static Optional<User> findByName(List<User> users, String name) {
        // TODO: return first user matching name, or empty
        return Optional.empty();
    }

    public static void main(String[] args) {
        List<User> users = List.of(
            new User("Alice", "alice@example.com"),
            new User("Bob",   null)
        );
        // print email uppercased, or "NO EMAIL" if absent
        findByName(users, "Alice")
            .map(u -> u.email())
            .map(String::toUpperCase)
            .ifPresentOrElse(System.out::println, () -> System.out.println("NO EMAIL"));

        findByName(users, "Bob")
            .map(u -> u.email())
            .map(String::toUpperCase)
            .ifPresentOrElse(System.out::println, () -> System.out.println("NO EMAIL"));

        findByName(users, "Carol")
            .ifPresentOrElse(u -> System.out.println(u.name()), () -> System.out.println("NOT FOUND"));
    }
}`,
            expectedOutput: "ALICE@EXAMPLE.COM\nNO EMAIL\nNOT FOUND",
          },
          {
            slug: "composing-functions",
            title: "Composing Functions — andThen, compose & Predicate Combinators",
            order: 8, duration: 13, isPremium: true,
            starterCode:
`import java.util.function.*;
public class Main {
    public static void main(String[] args) {
        Function<String, String> trim   = String::trim;
        Function<String, String> upper  = String::toUpperCase;
        Function<String, Integer> length = String::length;

        // TODO: compose: trim THEN upper THEN length
        Function<String, Integer> pipeline = null; // fix
        System.out.println(pipeline.apply("  hello world  "));

        Predicate<Integer> positive  = n -> n > 0;
        Predicate<Integer> even      = n -> n % 2 == 0;
        Predicate<Integer> under100  = n -> n < 100;

        // TODO: build predicate: positive AND even AND under100
        Predicate<Integer> combined = null; // fix
        System.out.println(combined.test(42));
        System.out.println(combined.test(-4));
        System.out.println(combined.test(104));

        // TODO: negate combined
        System.out.println(combined.negate().test(42));
    }
}`,
            expectedOutput: "11\ntrue\nfalse\nfalse\nfalse",
          },
          {
            slug: "parallel-streams",
            title: "Parallel Streams — When to Use & Thread Safety",
            order: 9, duration: 14, isPremium: true,
            starterCode:
`import java.util.*;
import java.util.stream.*;
import java.util.concurrent.atomic.AtomicInteger;
public class Main {
    public static void main(String[] args) {
        // Sequential sum
        long seqSum = LongStream.rangeClosed(1, 1_000_000).sum();
        System.out.println(seqSum);

        // Parallel sum — same result
        long parSum = LongStream.rangeClosed(1, 1_000_000).parallel().sum();
        System.out.println(parSum);

        // TODO: use AtomicInteger to safely count even numbers in parallel
        AtomicInteger evenCount = new AtomicInteger(0);
        IntStream.rangeClosed(1, 100).parallel().forEach(n -> {
            // NOTE: do NOT use a plain int counter here — why not?
            if (n % 2 == 0) evenCount.incrementAndGet();
        });
        System.out.println(evenCount.get());
    }
}`,
            expectedOutput: "500000500000\n500000500000\n50",
          },
          {
            slug: "functional-patterns",
            title: "Functional Design Patterns — Strategy, Command & Pipeline",
            order: 10, duration: 16, isPremium: true,
            starterCode:
`import java.util.*;
import java.util.function.*;
public class Main {
    // Strategy pattern via Function
    static double applyDiscount(double price, Function<Double, Double> strategy) {
        return strategy.apply(price);
    }

    // Command pattern via Runnable queue
    static List<Runnable> commandQueue = new ArrayList<>();
    static void enqueue(Runnable cmd) { commandQueue.add(cmd); }
    static void runAll()              { commandQueue.forEach(Runnable::run); }

    public static void main(String[] args) {
        // TODO: create three discount strategies as lambdas:
        // 10% off, 20% off, buy-one-get-one (50% off)
        Function<Double, Double> tenPct  = p -> p;  // fix
        Function<Double, Double> twentyPct = p -> p; // fix
        Function<Double, Double> bogo    = p -> p;  // fix

        System.out.printf("%.2f%n", applyDiscount(100.0, tenPct));
        System.out.printf("%.2f%n", applyDiscount(100.0, twentyPct));
        System.out.printf("%.2f%n", applyDiscount(100.0, bogo));

        // TODO: enqueue 3 print commands then run them
        enqueue(() -> System.out.println("cmd1"));
        enqueue(() -> System.out.println("cmd2"));
        enqueue(() -> System.out.println("cmd3"));
        runAll();
    }
}`,
            expectedOutput: "90.00\n80.00\n50.00\ncmd1\ncmd2\ncmd3",
          },
        ],
      },

      // ── Module 3: Concurrency ────────────────────────────────────────────
      {
        slug: "module-3",
        title: "Concurrency",
        order: 3,
        isPremium: true,
        lessons: [
          {
            slug: "threads-runnable",
            title: "Threads & Runnable — Creating and Joining Threads",
            order: 1, duration: 14, isPremium: true,
            starterCode:
`public class Main {
    public static void main(String[] args) throws InterruptedException {
        // TODO: create and start two threads that each print their name 3 times
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 3; i++) System.out.println("Thread-A: " + i);
        });
        // TODO: create Thread-B similarly
        Thread t2 = null; // fix

        t1.start();
        if (t2 != null) t2.start();
        t1.join();
        if (t2 != null) t2.join();
        System.out.println("Done");
    }
}`,
            expectedOutput: "__any__",
          },
          {
            slug: "synchronisation",
            title: "Synchronisation — synchronized, Monitors & Visibility",
            order: 2, duration: 16, isPremium: true,
            starterCode:
`import java.util.concurrent.*;
public class Main {
    static class Counter {
        private int count = 0;
        // TODO: make increment() thread-safe with synchronized
        public void increment() { count++; }
        public int get() { return count; }
    }
    public static void main(String[] args) throws InterruptedException {
        Counter counter = new Counter();
        int threads = 10, increments = 1000;
        Thread[] ts = new Thread[threads];
        for (int i = 0; i < threads; i++) {
            ts[i] = new Thread(() -> {
                for (int j = 0; j < increments; j++) counter.increment();
            });
            ts[i].start();
        }
        for (Thread t : ts) t.join();
        // Without synchronization this will be < 10000; with it, exactly 10000
        System.out.println(counter.get());
    }
}`,
            expectedOutput: "10000",
          },
          {
            slug: "volatile-atomics",
            title: "volatile & Atomic Types — Visibility Without Locking",
            order: 3, duration: 15, isPremium: true,
            starterCode:
`import java.util.concurrent.atomic.*;
public class Main {
    // TODO: use AtomicLong for a thread-safe hit counter
    static AtomicLong hits   = new AtomicLong(0);
    static AtomicLong misses = new AtomicLong(0);

    public static void main(String[] args) throws InterruptedException {
        Thread[] ts = new Thread[5];
        for (int i = 0; i < ts.length; i++) {
            int id = i;
            ts[i] = new Thread(() -> {
                for (int j = 0; j < 200; j++) {
                    if ((id + j) % 3 == 0) hits.incrementAndGet();
                    else                   misses.incrementAndGet();
                }
            });
            ts[i].start();
        }
        for (Thread t : ts) t.join();
        System.out.println(hits.get() + misses.get()); // must be 1000
        System.out.println(hits.get() > 0);
    }
}`,
            expectedOutput: "1000\ntrue",
          },
          {
            slug: "deadlock",
            title: "Deadlock, Livelock & Starvation — Causes & Avoidance",
            order: 4, duration: 15, isPremium: true,
            starterCode:
`public class Main {
    static final Object LOCK_A = new Object();
    static final Object LOCK_B = new Object();

    // This pair of threads can deadlock if lock order is inconsistent
    static Thread threadAlpha() {
        return new Thread(() -> {
            synchronized (LOCK_A) {
                try { Thread.sleep(10); } catch (InterruptedException e) {}
                synchronized (LOCK_B) { System.out.println("Alpha done"); }
            }
        });
    }
    static Thread threadBeta() {
        // TODO: fix the lock order here so it cannot deadlock with threadAlpha
        return new Thread(() -> {
            synchronized (LOCK_B) { // change this order to fix
                synchronized (LOCK_A) { System.out.println("Beta done"); }
            }
        });
    }
    public static void main(String[] args) throws InterruptedException {
        Thread a = threadAlpha(), b = threadBeta();
        a.start(); b.start(); a.join(); b.join();
        System.out.println("Finished");
    }
}`,
            expectedOutput: "__any__",
          },
          {
            slug: "executor-framework",
            title: "The Executor Framework — Thread Pools & Task Submission",
            order: 5, duration: 16, isPremium: true,
            starterCode:
`import java.util.concurrent.*;
import java.util.*;
public class Main {
    static int expensiveWork(int n) {
        return n * n; // pretend this takes time
    }
    public static void main(String[] args) throws Exception {
        // TODO: create a fixed thread pool of 4 threads
        ExecutorService pool = null; // fix

        // TODO: submit 10 tasks and collect their Future<Integer> results
        List<Future<Integer>> futures = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            final int n = i;
            futures.add(null); // fix — submit callable
        }

        int sum = 0;
        for (Future<Integer> f : futures) sum += f.get();

        System.out.println(sum); // 1+4+9+...+100 = 385
        if (pool != null) pool.shutdown();
    }
}`,
            expectedOutput: "385",
          },
          {
            slug: "callable-future",
            title: "Callable<T> & Future — Results, Cancellation & Timeouts",
            order: 6, duration: 15, isPremium: true,
            starterCode:
`import java.util.concurrent.*;
public class Main {
    static String fetchData(String source) throws InterruptedException {
        Thread.sleep(50); // simulate I/O
        return "data-from-" + source;
    }
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(2);

        // TODO: submit two Callable tasks and retrieve results
        Future<String> f1 = null; // fix
        Future<String> f2 = null; // fix

        System.out.println(f1 != null ? f1.get() : "missing");
        System.out.println(f2 != null ? f2.get() : "missing");

        // TODO: demonstrate isDone() after get()
        System.out.println(f1 != null && f1.isDone());

        pool.shutdown();
    }
}`,
            expectedOutput: "data-from-alpha\ndata-from-beta\ntrue",
          },
          {
            slug: "completable-future-1",
            title: "CompletableFuture I — supplyAsync, thenApply & exceptionally",
            order: 7, duration: 16, isPremium: true,
            starterCode:
`import java.util.concurrent.*;
public class Main {
    static String fetchUser(int id) {
        if (id <= 0) throw new RuntimeException("Invalid id: " + id);
        return "user-" + id;
    }
    public static void main(String[] args) throws Exception {
        // TODO: build a pipeline: fetchUser(1) -> uppercase -> print length
        CompletableFuture<Integer> pipeline = CompletableFuture
            .supplyAsync(() -> fetchUser(1))
            // .thenApply(...)  add steps here
            .thenApply(s -> 0); // fix the final step to return length

        System.out.println(pipeline.get()); // should be 6

        // TODO: handle the error case gracefully
        CompletableFuture<String> withError = CompletableFuture
            .supplyAsync(() -> fetchUser(-1))
            .exceptionally(ex -> "error: " + ex.getMessage());

        System.out.println(withError.get());
    }
}`,
            expectedOutput: "6\nerror: Invalid id: -1",
          },
          {
            slug: "completable-future-2",
            title: "CompletableFuture II — thenCombine, allOf & Complex Pipelines",
            order: 8, duration: 16, isPremium: true,
            starterCode:
`import java.util.concurrent.*;
import java.util.*;
public class Main {
    static CompletableFuture<String> fetchName(int id) {
        return CompletableFuture.supplyAsync(() -> "User-" + id);
    }
    static CompletableFuture<Integer> fetchScore(int id) {
        return CompletableFuture.supplyAsync(() -> id * 10);
    }
    public static void main(String[] args) throws Exception {
        // TODO: combine name and score for user 5 into one string
        CompletableFuture<String> combined = fetchName(5)
            .thenCombine(fetchScore(5), (name, score) -> name + "=" + score); // this one is done
        System.out.println(combined.get());

        // TODO: wait for ALL of three fetches to complete, then print each
        CompletableFuture<String> f1 = fetchName(1);
        CompletableFuture<String> f2 = fetchName(2);
        CompletableFuture<String> f3 = fetchName(3);
        CompletableFuture.allOf(f1, f2, f3).join();
        List<String> names = List.of(f1.get(), f2.get(), f3.get());
        System.out.println(names);
    }
}`,
            expectedOutput: "User-5=50\n[User-1, User-2, User-3]",
          },
          {
            slug: "concurrent-collections",
            title: "Concurrent Collections — ConcurrentHashMap, BlockingQueue & More",
            order: 9, duration: 14, isPremium: true,
            starterCode:
`import java.util.concurrent.*;
import java.util.*;
public class Main {
    public static void main(String[] args) throws InterruptedException {
        // ConcurrentHashMap — safe for concurrent reads/writes
        ConcurrentHashMap<String, Integer> wordCount = new ConcurrentHashMap<>();

        Thread[] writers = new Thread[4];
        String[] words = {"java", "kotlin", "java", "streams", "kotlin", "java"};

        for (int i = 0; i < writers.length; i++) {
            final int start = i;
            writers[i] = new Thread(() -> {
                for (int j = start; j < words.length; j += 4)
                    wordCount.merge(words[j], 1, Integer::sum);
            });
            writers[i].start();
        }
        for (Thread t : writers) t.join();
        new TreeMap<>(wordCount).forEach((k, v) -> System.out.println(k + "=" + v));

        // LinkedBlockingQueue producer-consumer
        BlockingQueue<Integer> queue = new LinkedBlockingQueue<>(10);
        // TODO: enqueue 1-5 then drain and sum
        for (int i = 1; i <= 5; i++) queue.put(i);
        int sum = 0;
        while (!queue.isEmpty()) sum += queue.take();
        System.out.println(sum);
    }
}`,
            expectedOutput: "java=3\nkotlin=2\nstreams=1\n15",
          },
          {
            slug: "locks-conditions",
            title: "ReentrantLock, ReadWriteLock & Conditions",
            order: 10, duration: 16, isPremium: true,
            starterCode:
`import java.util.concurrent.locks.*;
import java.util.*;
public class Main {
    static class BoundedBuffer<T> {
        private final Queue<T> queue = new LinkedList<>();
        private final int capacity;
        private final Lock lock = new ReentrantLock();
        private final Condition notFull  = lock.newCondition();
        private final Condition notEmpty = lock.newCondition();

        BoundedBuffer(int capacity) { this.capacity = capacity; }

        public void put(T item) throws InterruptedException {
            lock.lock();
            try {
                while (queue.size() == capacity) notFull.await();
                queue.add(item);
                notEmpty.signal();
            } finally { lock.unlock(); }
        }

        public T take() throws InterruptedException {
            lock.lock();
            try {
                while (queue.isEmpty()) notEmpty.await();
                T item = queue.poll();
                notFull.signal();
                return item;
            } finally { lock.unlock(); }
        }
    }

    public static void main(String[] args) throws InterruptedException {
        BoundedBuffer<Integer> buf = new BoundedBuffer<>(3);
        Thread producer = new Thread(() -> {
            try { for (int i = 1; i <= 5; i++) buf.put(i); }
            catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        Thread consumer = new Thread(() -> {
            try { for (int i = 0; i < 5; i++) System.out.println(buf.take()); }
            catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        producer.start(); consumer.start();
        producer.join(); consumer.join();
    }
}`,
            expectedOutput: "1\n2\n3\n4\n5",
          },
          {
            slug: "virtual-threads",
            title: "Virtual Threads — Project Loom & Structured Concurrency",
            order: 11, duration: 14, isPremium: true,
            starterCode:
`import java.util.concurrent.*;
import java.util.*;
public class Main {
    static String processRequest(int id) {
        // Simulate I/O by yielding; virtual threads handle this efficiently
        Thread.yield();
        return "response-" + id;
    }

    public static void main(String[] args) throws Exception {
        // TODO: use Thread.ofVirtual() to start 10 virtual threads
        List<Thread> threads = new ArrayList<>();
        List<String> results = Collections.synchronizedList(new ArrayList<>());

        for (int i = 1; i <= 5; i++) {
            final int id = i;
            Thread vt = Thread.ofVirtual().start(() -> results.add(processRequest(id)));
            threads.add(vt);
        }
        for (Thread t : threads) t.join();

        Collections.sort(results); // sort for deterministic output
        results.forEach(System.out::println);
    }
}`,
            expectedOutput: "response-1\nresponse-2\nresponse-3\nresponse-4\nresponse-5",
          },
          {
            slug: "concurrency-patterns",
            title: "Concurrency Patterns — Producer-Consumer & Work-Stealing",
            order: 12, duration: 18, isPremium: true,
            starterCode:
`import java.util.concurrent.*;
import java.util.*;
public class Main {
    public static void main(String[] args) throws Exception {
        // Producer-Consumer with a shared BlockingQueue
        BlockingQueue<Integer> queue = new LinkedBlockingQueue<>();
        List<Integer> processed = Collections.synchronizedList(new ArrayList<>());

        // Producer: enqueues 1-5 then a sentinel (-1)
        Thread producer = new Thread(() -> {
            try {
                for (int i = 1; i <= 5; i++) queue.put(i);
                queue.put(-1); // sentinel
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });

        // TODO: consumer reads until sentinel, squares each value, adds to processed
        Thread consumer = new Thread(() -> {
            try {
                while (true) {
                    int val = queue.take();
                    if (val == -1) break;
                    processed.add(val); // TODO: square val instead
                }
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });

        producer.start(); consumer.start();
        producer.join(); consumer.join();
        System.out.println(processed);
    }
}`,
            expectedOutput: "[1, 4, 9, 16, 25]",
          },
        ],
      },

      // ── Module 4: Design Patterns ────────────────────────────────────────
      {
        slug: "module-4",
        title: "Design Patterns in Java",
        order: 4,
        isPremium: true,
        lessons: [
          {
            slug: "why-patterns",
            title: "Why Design Patterns Exist — GoF, Costs & When Not to Use Them",
            order: 1, duration: 12, isPremium: true,
            starterCode:
`public class Main {
    // Before patterns: tightly coupled, hard-to-change code
    static class ReportGenerator {
        // TODO: refactor this class so output format is swappable
        // (this exercise is conceptual — the lesson provides the starting point)
        void generatePDF()  { System.out.println("PDF report"); }
        void generateCSV()  { System.out.println("CSV report"); }
        void generateHTML() { System.out.println("HTML report"); }
    }
    public static void main(String[] args) {
        ReportGenerator r = new ReportGenerator();
        r.generatePDF();
        r.generateCSV();
        r.generateHTML();
    }
}`,
            expectedOutput: "PDF report\nCSV report\nHTML report",
          },
          {
            slug: "singleton-factory",
            title: "Singleton (Thread-Safe) & Static Factory Methods",
            order: 2, duration: 14, isPremium: true,
            starterCode:
`public class Main {
    // TODO: implement a thread-safe Singleton using the holder idiom
    static class AppConfig {
        private final String env;
        private AppConfig() { this.env = "production"; }

        // Holder idiom — lazy, thread-safe, no synchronisation needed
        private static class Holder {
            // TODO: declare INSTANCE here
        }

        public static AppConfig getInstance() {
            return null; // fix
        }
        public String getEnv() { return env; }
    }

    // TODO: static factory for a Money value object
    static class Money {
        private final long cents;
        private Money(long cents) { this.cents = cents; }
        public static Money ofDollars(double amount) { return null; } // fix
        public String toString() { return "$" + String.format("%.2f", cents / 100.0); }
    }

    public static void main(String[] args) {
        AppConfig a = AppConfig.getInstance();
        AppConfig b = AppConfig.getInstance();
        System.out.println(a == b);          // true — same instance
        System.out.println(a.getEnv());
        System.out.println(Money.ofDollars(9.99));
    }
}`,
            expectedOutput: "true\nproduction\n$9.99",
          },
          {
            slug: "builder",
            title: "Builder Pattern — Fluent APIs vs Telescoping Constructors",
            order: 3, duration: 14, isPremium: true,
            starterCode:
`public class Main {
    static class HttpRequest {
        private final String method;
        private final String url;
        private final String body;
        private final int timeoutMs;
        private HttpRequest(Builder b) {
            this.method    = b.method;
            this.url       = b.url;
            this.body      = b.body;
            this.timeoutMs = b.timeoutMs;
        }
        public String toString() {
            return method + " " + url + " body=" + body + " timeout=" + timeoutMs;
        }
        static class Builder {
            private String method = "GET";
            private String url;
            private String body   = "";
            private int timeoutMs = 5000;
            Builder url(String url)       { this.url = url; return this; }
            // TODO: implement method(), body(), timeout() fluent setters
            HttpRequest build() { return new HttpRequest(this); }
        }
    }
    public static void main(String[] args) {
        HttpRequest req = new HttpRequest.Builder()
            .url("https://api.example.com/users")
            .method("POST")
            .body("{\"name\":\"Alice\"}")
            .timeout(3000)
            .build();
        System.out.println(req);
    }
}`,
            expectedOutput: `POST https://api.example.com/users body={"name":"Alice"} timeout=3000`,
          },
          {
            slug: "adapter-decorator",
            title: "Adapter & Decorator — Wrapping Incompatible and Enhancing APIs",
            order: 4, duration: 15, isPremium: true,
            starterCode:
`public class Main {
    // Existing legacy API
    static class LegacyLogger {
        void writeLog(String severity, String msg) {
            System.out.println("[" + severity + "] " + msg);
        }
    }
    // Modern interface callers expect
    interface Logger {
        void info(String msg);
        void error(String msg);
    }
    // TODO: implement LoggerAdapter that wraps LegacyLogger and implements Logger
    static class LoggerAdapter implements Logger {
        private final LegacyLogger legacy;
        LoggerAdapter(LegacyLogger legacy) { this.legacy = legacy; }
        public void info(String msg)  { /* TODO */ }
        public void error(String msg) { /* TODO */ }
    }
    // TODO: Decorator that adds timestamps (just prefix "[TS]" for simplicity)
    static class TimestampedLogger implements Logger {
        private final Logger wrapped;
        TimestampedLogger(Logger wrapped) { this.wrapped = wrapped; }
        public void info(String msg)  { wrapped.info("[TS] " + msg); }
        public void error(String msg) { wrapped.error("[TS] " + msg); }
    }
    public static void main(String[] args) {
        Logger log = new TimestampedLogger(new LoggerAdapter(new LegacyLogger()));
        log.info("Server started");
        log.error("Connection refused");
    }
}`,
            expectedOutput: "[INFO] [TS] Server started\n[ERROR] [TS] Connection refused",
          },
          {
            slug: "proxy-facade",
            title: "Proxy (Lazy & Logging) & Facade — Simplifying Subsystems",
            order: 5, duration: 15, isPremium: true,
            starterCode:
`public class Main {
    interface DataService {
        String load(String key);
    }
    static class RealDataService implements DataService {
        public String load(String key) {
            System.out.println("LOAD: " + key);
            return "value-of-" + key;
        }
    }
    // TODO: LoggingProxy wraps DataService and prints before/after each load
    static class LoggingProxy implements DataService {
        private final DataService real;
        LoggingProxy(DataService real) { this.real = real; }
        public String load(String key) {
            return real.load(key); // add logging
        }
    }
    // Facade simplifies three subsystems into one call
    static class OrderFacade {
        void placeOrder(String product, int qty) {
            System.out.println("INVENTORY: reserve " + qty + " " + product);
            System.out.println("PAYMENT: charge");
            System.out.println("SHIPPING: dispatch");
        }
    }
    public static void main(String[] args) {
        DataService svc = new LoggingProxy(new RealDataService());
        System.out.println(svc.load("user:42"));
        System.out.println("---");
        new OrderFacade().placeOrder("Book", 2);
    }
}`,
            expectedOutput: "before load: user:42\nLOAD: user:42\nafter load: user:42\nvalue-of-user:42\n---\nINVENTORY: reserve 2 Book\nPAYMENT: charge\nSHIPPING: dispatch",
          },
          {
            slug: "observer",
            title: "Observer Pattern — Event Systems & Publisher-Subscriber",
            order: 6, duration: 16, isPremium: true,
            starterCode:
`import java.util.*;
public class Main {
    interface StockListener {
        void onPriceChange(String ticker, double newPrice);
    }
    static class StockFeed {
        private final Map<String, List<StockListener>> listeners = new HashMap<>();

        public void subscribe(String ticker, StockListener l) {
            listeners.computeIfAbsent(ticker, k -> new ArrayList<>()).add(l);
        }
        public void updatePrice(String ticker, double price) {
            // TODO: notify all listeners for this ticker
        }
    }
    public static void main(String[] args) {
        StockFeed feed = new StockFeed();
        feed.subscribe("JAVA", (t, p) -> System.out.printf("Portfolio A: %s = $%.2f%n", t, p));
        feed.subscribe("JAVA", (t, p) -> System.out.printf("Alert: %s crossed $%.0f%n", t, p));
        feed.subscribe("KOTLIN", (t, p) -> System.out.printf("Portfolio A: %s = $%.2f%n", t, p));
        feed.updatePrice("JAVA",   150.00);
        feed.updatePrice("KOTLIN",  42.50);
    }
}`,
            expectedOutput: "Portfolio A: JAVA = $150.00\nAlert: JAVA crossed $150\nPortfolio A: KOTLIN = $42.50",
          },
          {
            slug: "strategy-command",
            title: "Strategy & Command — Pluggable Algorithms & Undoable Operations",
            order: 7, duration: 15, isPremium: true,
            starterCode:
`import java.util.*;
public class Main {
    // Strategy: sorting algorithm is swappable
    interface SortStrategy {
        void sort(int[] arr);
    }
    static class Sorter {
        private SortStrategy strategy;
        Sorter(SortStrategy s) { this.strategy = s; }
        void setStrategy(SortStrategy s) { this.strategy = s; }
        void sort(int[] arr) { strategy.sort(arr); }
    }
    // Command: undoable text editor operations
    interface Command { void execute(); void undo(); }
    static class TextEditor {
        private StringBuilder text = new StringBuilder();
        private Deque<Command> history = new ArrayDeque<>();
        void execute(Command cmd) { cmd.execute(); history.push(cmd); }
        void undo() { if (!history.isEmpty()) history.pop().undo(); }
        String getText() { return text.toString(); }
        // TODO: implement AppendCommand as an inner class using TextEditor.this
        class AppendCommand implements Command {
            private final String toAdd;
            AppendCommand(String s) { this.toAdd = s; }
            public void execute() { text.append(toAdd); }
            public void undo()    { text.delete(text.length() - toAdd.length(), text.length()); }
        }
    }
    public static void main(String[] args) {
        // Strategy
        Sorter s = new Sorter(arr -> Arrays.sort(arr));
        int[] nums = {5, 2, 8, 1};
        s.sort(nums);
        System.out.println(Arrays.toString(nums));
        // Command
        TextEditor ed = new TextEditor();
        ed.execute(ed.new AppendCommand("Hello"));
        ed.execute(ed.new AppendCommand(", World"));
        System.out.println(ed.getText());
        ed.undo();
        System.out.println(ed.getText());
    }
}`,
            expectedOutput: "[1, 2, 5, 8]\nHello, World\nHello",
          },
          {
            slug: "iterator-template",
            title: "Iterator & Template Method — Custom Iteration & Algorithm Skeletons",
            order: 8, duration: 14, isPremium: true,
            starterCode:
`import java.util.*;
public class Main {
    // Custom Iterable range
    static class Range implements Iterable<Integer> {
        private final int start, end, step;
        Range(int start, int end, int step) { this.start = start; this.end = end; this.step = step; }
        public Iterator<Integer> iterator() {
            return new Iterator<>() {
                int cur = start;
                public boolean hasNext() { return cur < end; }
                public Integer next()    { int v = cur; cur += step; return v; }
            };
        }
    }
    // Template Method: report generation skeleton
    static abstract class ReportTemplate {
        // Template method — defines the algorithm skeleton
        final void generate() {
            fetchData(); formatHeader(); writeBody(); formatFooter();
        }
        abstract void fetchData();
        abstract void writeBody();
        void formatHeader() { System.out.println("=== REPORT ==="); }
        void formatFooter() { System.out.println("=============="); }
    }
    static class SalesReport extends ReportTemplate {
        public void fetchData()  { System.out.println("Fetching sales data"); }
        public void writeBody()  { System.out.println("Q1: $120k, Q2: $145k"); }
    }
    public static void main(String[] args) {
        for (int n : new Range(1, 10, 2)) System.out.print(n + " ");
        System.out.println();
        new SalesReport().generate();
    }
}`,
            expectedOutput: "1 3 5 7 9 \n=== REPORT ===\nFetching sales data\nQ1: $120k, Q2: $145k\n==============",
          },
          {
            slug: "patterns-in-jdk",
            title: "Patterns in the JDK & Spring — Recognising Them in the Wild",
            order: 9, duration: 14, isPremium: true,
            starterCode:
`import java.util.*;
import java.util.stream.*;
public class Main {
    public static void main(String[] args) {
        // Builder: StringBuilder
        String result = new StringBuilder()
            .append("Java ")
            .append("Design ")
            .append("Patterns")
            .toString();
        System.out.println(result);

        // Iterator: for-each over any Iterable
        List<String> items = List.of("one", "two", "three");
        for (String s : items) System.out.println(s);

        // Decorator: Collections.unmodifiableList wraps and restricts
        List<String> mutable   = new ArrayList<>(List.of("a", "b"));
        List<String> immutable = Collections.unmodifiableList(mutable);
        System.out.println(immutable.getClass().getSimpleName());

        // Strategy: Comparator passed to sort
        List<Integer> nums = new ArrayList<>(List.of(5, 2, 8, 1));
        nums.sort(Comparator.reverseOrder());
        System.out.println(nums);
    }
}`,
            expectedOutput: "Java Design Patterns\none\ntwo\nthree\nUnmodifiableRandomAccessList\n[8, 5, 2, 1]",
          },
          {
            slug: "anti-patterns",
            title: "Anti-Patterns — God Class, Magic Numbers & Premature Abstraction",
            order: 10, duration: 14, isPremium: true,
            starterCode:
`public class Main {
    // BEFORE: magic numbers everywhere — refactor using named constants
    static double calculateShipping(double weight, boolean express) {
        if (weight < 0.5)  return express ? 12.99 : 4.99;
        if (weight < 5.0)  return express ? 24.99 : 8.99;
        return express ? 49.99 : 19.99;
    }
    public static void main(String[] args) {
        // TODO: extract named constants for all the magic numbers above
        // then make these assertions pass:
        System.out.println(calculateShipping(0.3, false));
        System.out.println(calculateShipping(0.3, true));
        System.out.println(calculateShipping(2.0, false));
        System.out.println(calculateShipping(10.0, true));
    }
}`,
            expectedOutput: "4.99\n12.99\n8.99\n49.99",
          },
        ],
      },

      // ── Module 5: Testing & Code Quality ────────────────────────────────
      {
        slug: "module-5",
        title: "Testing & Code Quality",
        order: 5,
        isPremium: true,
        lessons: [
          {
            slug: "tdd-philosophy",
            title: "TDD Philosophy — Red-Green-Refactor & the Test Pyramid",
            order: 1, duration: 12, isPremium: true,
            starterCode:
`// TDD: write the test first, then make it pass
// This lesson uses manual assertions since JUnit isn't available in the playground
public class Main {
    // The class under test — start with no implementation
    static class Calculator {
        int add(int a, int b)      { return 0; }   // TODO: implement
        int subtract(int a, int b) { return 0; }   // TODO: implement
        int multiply(int a, int b) { return 0; }   // TODO: implement
    }
    // Minimal test harness
    static int passed = 0, failed = 0;
    static void assertEqual(String label, int expected, int actual) {
        if (expected == actual) { System.out.println("PASS: " + label); passed++; }
        else { System.out.println("FAIL: " + label + " expected=" + expected + " got=" + actual); failed++; }
    }
    public static void main(String[] args) {
        Calculator c = new Calculator();
        assertEqual("2+3=5",   5,   c.add(2, 3));
        assertEqual("0+0=0",   0,   c.add(0, 0));
        assertEqual("10-4=6",  6,   c.subtract(10, 4));
        assertEqual("3*7=21",  21,  c.multiply(3, 7));
        assertEqual("neg mul", -12, c.multiply(-3, 4));
        System.out.println(passed + "/" + (passed + failed) + " passed");
    }
}`,
            expectedOutput: "PASS: 2+3=5\nPASS: 0+0=0\nPASS: 10-4=6\nPASS: 3*7=21\nPASS: neg mul\n5/5 passed",
          },
          {
            slug: "junit5-foundations",
            title: "JUnit 5 — @Test, Lifecycle Hooks & Assertions",
            order: 2, duration: 14, isPremium: true,
            starterCode:
`// In a real project this would use JUnit 5 annotations.
// Here we simulate the same test structure with plain Java.
public class Main {
    static class StringUtils {
        static String reverse(String s) { return ""; }             // TODO
        static boolean isPalindrome(String s) { return false; }    // TODO
        static String titleCase(String s) { return ""; }           // TODO
    }
    static int ok = 0, fail = 0;
    static void test(String name, boolean pass) {
        System.out.println((pass ? "PASS" : "FAIL") + " " + name);
        if (pass) ok++; else fail++;
    }
    public static void main(String[] args) {
        // @BeforeEach equivalent — reset state (none needed here)
        test("reverse hello",       StringUtils.reverse("hello").equals("olleh"));
        test("reverse empty",       StringUtils.reverse("").equals(""));
        test("palindrome racecar",  StringUtils.isPalindrome("racecar"));
        test("not palindrome java", !StringUtils.isPalindrome("java"));
        test("titleCase",           StringUtils.titleCase("hello world").equals("Hello World"));
        System.out.println(ok + "/" + (ok + fail) + " passed");
    }
}`,
            expectedOutput: "PASS reverse hello\nPASS reverse empty\nPASS palindrome racecar\nPASS not palindrome java\nPASS titleCase\n5/5 passed",
          },
          {
            slug: "parameterized-tests",
            title: "Parameterised Tests — @ValueSource, @CsvSource & @MethodSource",
            order: 3, duration: 14, isPremium: true,
            starterCode:
`import java.util.stream.*;
public class Main {
    // Class under test
    static class FizzBuzz {
        static String of(int n) {
            // TODO: return "FizzBuzz" div by 15, "Fizz" by 3, "Buzz" by 5, else n
            return String.valueOf(n);
        }
    }
    // Simulated @CsvSource parameterised test
    static int ok = 0, fail = 0;
    static void test(int input, String expected) {
        String actual = FizzBuzz.of(input);
        boolean pass = expected.equals(actual);
        System.out.println((pass?"PASS":"FAIL") + " of(" + input + ") = " + actual);
        if (pass) ok++; else fail++;
    }
    public static void main(String[] args) {
        // @CsvSource equivalent
        test(1,  "1");    test(3,  "Fizz");  test(5,  "Buzz");
        test(15, "FizzBuzz"); test(30, "FizzBuzz");
        test(9,  "Fizz"); test(10, "Buzz");  test(7,  "7");
        System.out.println(ok + "/" + (ok + fail) + " passed");
    }
}`,
            expectedOutput: "PASS of(1) = 1\nPASS of(3) = Fizz\nPASS of(5) = Buzz\nPASS of(15) = FizzBuzz\nPASS of(30) = FizzBuzz\nPASS of(9) = Fizz\nPASS of(10) = Buzz\nPASS of(7) = 7\n8/8 passed",
          },
          {
            slug: "mockito",
            title: "Mocking with Mockito — Stubs, Verify & ArgumentCaptor",
            order: 4, duration: 16, isPremium: true,
            starterCode:
`// Mockito isn't available in the playground — we hand-roll a mock to learn the concepts
public class Main {
    interface EmailSender { boolean send(String to, String subject, String body); }
    interface UserRepository { String findEmailById(int id); }

    static class NotificationService {
        private final UserRepository repo;
        private final EmailSender sender;
        NotificationService(UserRepository r, EmailSender s) { repo = r; sender = s; }
        boolean notifyUser(int userId, String message) {
            String email = repo.findEmailById(userId);
            if (email == null) return false;
            return sender.send(email, "Notification", message);
        }
    }

    public static void main(String[] args) {
        // Hand-rolled stubs (Mockito does this with @Mock)
        UserRepository stubRepo = id -> id == 1 ? "alice@example.com" : null;

        // Capturing argument (Mockito: ArgumentCaptor)
        String[] captured = new String[1];
        EmailSender spySender = (to, subject, body) -> { captured[0] = to; return true; };

        NotificationService svc = new NotificationService(stubRepo, spySender);

        System.out.println(svc.notifyUser(1, "Hello!"));  // true
        System.out.println(captured[0]);                   // alice@example.com
        System.out.println(svc.notifyUser(99, "Hi"));     // false — user not found
    }
}`,
            expectedOutput: "true\nalice@example.com\nfalse",
          },
          {
            slug: "testing-exceptions",
            title: "Testing Exceptions & Edge Cases — assertThrows & Boundaries",
            order: 5, duration: 14, isPremium: true,
            starterCode:
`public class Main {
    static class BankAccount {
        private double balance;
        BankAccount(double balance) {
            if (balance < 0) throw new IllegalArgumentException("Negative balance: " + balance);
            this.balance = balance;
        }
        void deposit(double amount) {
            if (amount <= 0) throw new IllegalArgumentException("Deposit must be positive");
            balance += amount;
        }
        void withdraw(double amount) {
            if (amount <= 0) throw new IllegalArgumentException("Withdrawal must be positive");
            if (amount > balance) throw new IllegalStateException("Insufficient funds");
            balance -= amount;
        }
        double getBalance() { return balance; }
    }

    static void assertThrows(Class<? extends Exception> type, Runnable action, String label) {
        try { action.run(); System.out.println("FAIL: " + label + " (no exception)"); }
        catch (Exception e) {
            if (type.isInstance(e)) System.out.println("PASS: " + label);
            else System.out.println("FAIL: " + label + " wrong type: " + e.getClass().getSimpleName());
        }
    }

    public static void main(String[] args) {
        BankAccount acc = new BankAccount(100.0);
        acc.deposit(50.0);
        System.out.println(acc.getBalance());
        assertThrows(IllegalArgumentException.class, () -> new BankAccount(-1), "negative initial");
        assertThrows(IllegalArgumentException.class, () -> acc.deposit(-5), "neg deposit");
        assertThrows(IllegalStateException.class,    () -> acc.withdraw(999), "overdraft");
        assertThrows(IllegalArgumentException.class, () -> acc.withdraw(0),  "zero withdraw");
    }
}`,
            expectedOutput: "150.0\nPASS: negative initial\nPASS: neg deposit\nPASS: overdraft\nPASS: zero withdraw",
          },
          {
            slug: "test-structure",
            title: "Test Structure & Naming — AAA Pattern, Conventions & Flakiness",
            order: 6, duration: 13, isPremium: true,
            starterCode:
`import java.util.*;
public class Main {
    // The class under test
    static class ShoppingCart {
        private final List<String> items = new ArrayList<>();
        private final Map<String, Double> prices;
        ShoppingCart(Map<String, Double> prices) { this.prices = prices; }
        void add(String item) { items.add(item); }
        void remove(String item) { items.remove(item); }
        double total() { return items.stream().mapToDouble(i -> prices.getOrDefault(i, 0.0)).sum(); }
        int size() { return items.size(); }
    }

    // Well-named AAA tests
    static int ok = 0, fail = 0;
    static void test(String name, boolean pass) {
        System.out.println((pass ? "PASS" : "FAIL") + " " + name); if (pass) ok++; else fail++;
    }

    public static void main(String[] args) {
        Map<String, Double> catalog = Map.of("apple", 1.0, "bread", 2.5, "milk", 1.8);

        // arrange_act_assert naming pattern
        // given_emptyCart_when_addItem_then_sizeIsOne
        ShoppingCart cart = new ShoppingCart(catalog);
        cart.add("apple");
        test("given_empty_when_addApple_then_sizeIsOne", cart.size() == 1);

        // given_cartWithItems_when_calcTotal_then_returnsSum
        cart.add("bread");
        test("given_appleAndBread_when_total_then_3.50", cart.total() == 3.5);

        // given_cartWithItem_when_remove_then_sizeDecreases
        cart.remove("apple");
        test("given_appleAndBread_when_removeApple_then_sizeIsOne", cart.size() == 1);

        System.out.println(ok + "/" + (ok + fail) + " passed");
    }
}`,
            expectedOutput: "PASS given_empty_when_addApple_then_sizeIsOne\nPASS given_appleAndBread_when_total_then_3.50\nPASS given_appleAndBread_when_removeApple_then_sizeIsOne\n3/3 passed",
          },
          {
            slug: "coverage-quality",
            title: "Code Coverage — What It Measures & What It Misses",
            order: 7, duration: 13, isPremium: true,
            starterCode:
`public class Main {
    // A function with multiple branches — exercise: write tests to hit all paths
    static String classify(int n) {
        if (n < 0)        return "negative";
        if (n == 0)        return "zero";
        if (n % 2 == 0)   return "positive-even";
        return "positive-odd";
    }

    static int ok = 0, fail = 0;
    static void test(String name, boolean pass) {
        System.out.println((pass ? "PASS" : "FAIL") + " " + name); if (pass) ok++; else fail++;
    }

    public static void main(String[] args) {
        // TODO: add tests for every branch (100% branch coverage)
        test("negative",      classify(-5).equals("negative"));
        test("zero",          classify(0).equals("zero"));
        test("positive-even", classify(4).equals("positive-even"));
        test("positive-odd",  classify(7).equals("positive-odd"));
        // Challenge: what edge cases does branch coverage miss?
        test("boundary -1",   classify(-1).equals("negative"));
        test("boundary 1",    classify(1).equals("positive-odd"));
        System.out.println(ok + "/" + (ok + fail) + " passed");
    }
}`,
            expectedOutput: "PASS negative\nPASS zero\nPASS positive-even\nPASS positive-odd\nPASS boundary -1\nPASS boundary 1\n6/6 passed",
          },
          {
            slug: "integration-testing",
            title: "Integration Testing Concepts — Real Dependencies & TestContainers",
            order: 8, duration: 14, isPremium: true,
            starterCode:
`import java.util.*;
public class Main {
    // Simulating an integration test where real components interact
    interface DataStore {
        void save(String key, String value);
        Optional<String> load(String key);
    }

    // Real implementation
    static class InMemoryStore implements DataStore {
        private final Map<String, String> store = new HashMap<>();
        public void save(String k, String v) { store.put(k, v); }
        public Optional<String> load(String k) { return Optional.ofNullable(store.get(k)); }
    }

    static class UserService {
        private final DataStore store;
        UserService(DataStore store) { this.store = store; }
        void createUser(String id, String name) { store.save("user:" + id, name); }
        Optional<String> getUser(String id)     { return store.load("user:" + id); }
    }

    public static void main(String[] args) {
        // Integration test: real InMemoryStore + real UserService
        DataStore realStore = new InMemoryStore();
        UserService svc = new UserService(realStore);
        svc.createUser("1", "Alice");
        svc.createUser("2", "Bob");
        System.out.println(svc.getUser("1").orElse("not found"));
        System.out.println(svc.getUser("2").orElse("not found"));
        System.out.println(svc.getUser("3").orElse("not found"));
    }
}`,
            expectedOutput: "Alice\nBob\nnot found",
          },
        ],
      },

      // ── Module 6: JVM Internals & Performance ────────────────────────────
      {
        slug: "module-6",
        title: "JVM Internals & Performance",
        order: 6,
        isPremium: true,
        lessons: [
          {
            slug: "jvm-architecture",
            title: "JVM Architecture — Classloading, Bytecode & JIT Compilation",
            order: 1, duration: 14, isPremium: true,
            starterCode:
`public class Main {
    public static void main(String[] args) {
        // Classloading: inspect the classloader chain
        Class<?> clazz = String.class;
        System.out.println(clazz.getName());
        System.out.println(clazz.getClassLoader()); // null = bootstrap loader

        // Reflection: inspect methods count (JDK version-dependent, just show it's > 0)
        System.out.println(clazz.getMethods().length > 0);

        // JIT warm-up demonstration: tight loop that JIT will optimise
        long sum = 0;
        for (long i = 0; i < 1_000_000L; i++) sum += i;
        System.out.println(sum);
    }
}`,
            expectedOutput: "java.lang.String\nnull\ntrue\n499999500000",
          },
          {
            slug: "garbage-collection",
            title: "Garbage Collection — G1, ZGC, GC Roots & Tuning",
            order: 2, duration: 16, isPremium: true,
            starterCode:
`public class Main {
    static class Node {
        Node next;
        byte[] data;
        Node(int kb) { data = new byte[kb * 1024]; }
    }

    public static void main(String[] args) {
        // Create objects, some become unreachable (eligible for GC)
        for (int i = 0; i < 100; i++) {
            Node n = new Node(10); // unreachable after iteration — GC candidate
            if (i == 0) System.out.println("Node size approx: " + n.data.length);
        }

        // Request GC (no guarantee it runs, but demonstrates the concept)
        Runtime rt = Runtime.getRuntime();
        long before = rt.totalMemory() - rt.freeMemory();
        System.gc();
        long after = rt.totalMemory() - rt.freeMemory();

        System.out.println("GC ran: " + (after <= before));
        System.out.println("Max memory MB: " + (rt.maxMemory() / 1024 / 1024 > 0));
    }
}`,
            expectedOutput: "Node size approx: 10240\nGC ran: true\nMax memory MB: true",
          },
          {
            slug: "memory-model",
            title: "Java Memory Model — Heap, Stack, Metaspace & Object Headers",
            order: 3, duration: 15, isPremium: true,
            starterCode:
`public class Main {
    // Demonstrating stack vs heap allocation
    static int recursionDepth(int n) {
        if (n <= 0) return 0;
        // Each call frame lives on the stack
        int local = n * 2; // stack variable
        return 1 + recursionDepth(n - 1);
    }

    public static void main(String[] args) {
        // Heap: objects survive method return
        String[] heapArr = new String[3];
        heapArr[0] = "a"; heapArr[1] = "b"; heapArr[2] = "c";

        // Stack: local primitives live in current frame
        int stackVar = 42;

        System.out.println(recursionDepth(10));
        System.out.println(stackVar);
        System.out.println(heapArr[1]);

        // String interning: two literals → same object (string pool in heap)
        String s1 = "hello";
        String s2 = "hello";
        System.out.println(s1 == s2);       // true — interned
        System.out.println(s1 == new String("hello")); // false — new heap object
    }
}`,
            expectedOutput: "10\n42\nb\ntrue\nfalse",
          },
          {
            slug: "profiling-tools",
            title: "Profiling Tools — Reading Flame Graphs & Finding Hotspots",
            order: 4, duration: 14, isPremium: true,
            starterCode:
`public class Main {
    // A deliberately inefficient implementation — profile to find the bottleneck
    static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int i = 2; i < n; i++) { // O(n) — should be O(sqrt(n))
            if (n % i == 0) return false;
        }
        return true;
    }

    // TODO: implement fastIsPrime using sqrt optimisation
    static boolean fastIsPrime(int n) {
        return isPrime(n); // replace with the optimised version
    }

    public static void main(String[] args) {
        // Count primes up to 10000 with both implementations
        long slowCount = 0, fastCount = 0;
        for (int i = 2; i <= 10000; i++) if (isPrime(i))     slowCount++;
        for (int i = 2; i <= 10000; i++) if (fastIsPrime(i)) fastCount++;
        System.out.println(slowCount);
        System.out.println(fastCount);
        System.out.println(slowCount == fastCount); // must be true
    }
}`,
            expectedOutput: "1229\n1229\ntrue",
          },
          {
            slug: "benchmarking-jmh",
            title: "Benchmarking with JMH — Microbenchmarks, Warmup & Pitfalls",
            order: 5, duration: 16, isPremium: true,
            starterCode:
`public class Main {
    // String concatenation: + vs StringBuilder (classic JMH benchmark topic)
    static String concatPlus(int n) {
        String result = "";
        for (int i = 0; i < n; i++) result += i; // O(n²) — creates new String each time
        return result;
    }
    static String concatBuilder(int n) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(i); // O(n)
        return sb.toString();
    }
    public static void main(String[] args) {
        // Correctness check (a real JMH benchmark would measure throughput)
        System.out.println(concatPlus(5).equals(concatBuilder(5)));
        System.out.println(concatPlus(5));

        // Measure relative time
        long t0 = System.nanoTime();
        concatPlus(5000);
        long plusMs = (System.nanoTime() - t0) / 1_000_000;

        t0 = System.nanoTime();
        concatBuilder(5000);
        long sbMs = (System.nanoTime() - t0) / 1_000_000;

        System.out.println("StringBuilder faster: " + (sbMs < plusMs || sbMs == 0));
    }
}`,
            expectedOutput: "true\n01234\nStringBuilder faster: true",
          },
          {
            slug: "performance-traps",
            title: "Common Performance Traps — Autoboxing, Loops & Premature Optimisation",
            order: 6, duration: 15, isPremium: true,
            starterCode:
`import java.util.*;
public class Main {
    // Trap 1: Autoboxing in a tight loop
    static long sumBoxed(int n) {
        Long sum = 0L; // Long, not long — every += triggers unbox+box
        for (int i = 0; i < n; i++) sum += i;
        return sum;
    }
    static long sumPrimitive(int n) {
        long sum = 0L; // TODO: keep this as primitive
        for (int i = 0; i < n; i++) sum += i;
        return sum;
    }

    // Trap 2: indexOf in a loop creating O(n²)
    static int countOccurrences(String text, char target) {
        int count = 0;
        // TODO: iterate with charAt instead of creating substrings
        for (int i = 0; i < text.length(); i++) {
            if (text.charAt(i) == target) count++;
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(sumBoxed(1000) == sumPrimitive(1000));
        System.out.println(sumPrimitive(100));
        System.out.println(countOccurrences("banana", 'a'));
    }
}`,
            expectedOutput: "true\n4950\n3",
          },
          {
            slug: "graalvm",
            title: "GraalVM & Native Image — AOT Compilation & Tradeoffs",
            order: 7, duration: 14, isPremium: true,
            starterCode:
`public class Main {
    // GraalVM can compile this to a native binary with ms startup time
    // This lesson is conceptual — this code demonstrates what native-compatible code looks like
    record Config(String host, int port, boolean tls) {
        static Config defaultConfig() {
            return new Config("localhost", 8080, false);
        }
    }

    public static void main(String[] args) {
        Config cfg = args.length > 0
            ? new Config(args[0], Integer.parseInt(args[1]), Boolean.parseBoolean(args[2]))
            : Config.defaultConfig();

        System.out.println("Host: " + cfg.host());
        System.out.println("Port: " + cfg.port());
        System.out.println("TLS:  " + cfg.tls());
        // Note: reflection-heavy code (like Spring) needs extra GraalVM config
        System.out.println("Reflection-free: " + !cfg.getClass().isAnonymousClass());
    }
}`,
            expectedOutput: "Host: localhost\nPort: 8080\nTLS:  false\nReflection-free: true",
          },
          {
            slug: "profiling-exercise",
            title: "Profile & Fix — Finding and Eliminating a Real Hotspot",
            order: 8, duration: 18, isPremium: true,
            starterCode:
`import java.util.*;
public class Main {
    // A deliberately slow word-frequency counter — profile and optimise
    static Map<String, Integer> countWordsSlow(String[] words) {
        Map<String, Integer> freq = new HashMap<>();
        for (String word : words) {
            // BUG: containsKey + get = two lookups; use getOrDefault or merge
            if (freq.containsKey(word)) freq.put(word, freq.get(word) + 1);
            else freq.put(word, 1);
        }
        return freq;
    }

    // TODO: optimise using Map.merge()
    static Map<String, Integer> countWordsFast(String[] words) {
        Map<String, Integer> freq = new HashMap<>();
        // replace with single-lookup approach
        for (String word : words) {
            if (freq.containsKey(word)) freq.put(word, freq.get(word) + 1);
            else freq.put(word, 1);
        }
        return freq;
    }

    public static void main(String[] args) {
        String[] words = {"java", "kotlin", "java", "jvm", "kotlin", "java"};
        Map<String, Integer> slow = countWordsSlow(words);
        Map<String, Integer> fast = countWordsFast(words);
        System.out.println(slow.equals(fast)); // same result
        new TreeMap<>(fast).forEach((k, v) -> System.out.println(k + "=" + v));
    }
}`,
            expectedOutput: "true\njava=3\njvm=1\nkotlin=2",
          },
        ],
      },

      // ── Module 7: Portfolio Capstone ─────────────────────────────────────
      {
        slug: "module-7",
        title: "Portfolio Capstone — Task Management System",
        order: 7,
        isPremium: true,
        lessons: [
          {
            slug: "project-design",
            title: "Part 1 — Design, Requirements & Package Structure",
            order: 1, duration: 20, isPremium: true,
            starterCode:
`import java.util.*;
public class Main {
    // Domain model for a mini task-management system
    enum Priority { LOW, MEDIUM, HIGH, CRITICAL }
    enum Status   { TODO, IN_PROGRESS, DONE }

    record Task(int id, String title, Priority priority, Status status, String assignee) {
        // TODO: implement a copy-with-new-status helper
        Task withStatus(Status s) { return this; } // fix
    }

    public static void main(String[] args) {
        Task t = new Task(1, "Fix login bug", Priority.HIGH, Status.TODO, "alice");
        System.out.println(t.title());
        System.out.println(t.priority());
        Task inProgress = t.withStatus(Status.IN_PROGRESS);
        System.out.println(inProgress.status());
        System.out.println(inProgress.id()); // same id
    }
}`,
            expectedOutput: "Fix login bug\nHIGH\nIN_PROGRESS\n1",
          },
          {
            slug: "project-data-layer",
            title: "Part 2 — Generic Repository & Optional-Based Lookups",
            order: 2, duration: 20, isPremium: true,
            starterCode:
`import java.util.*;
import java.util.function.*;
public class Main {
    enum Priority { LOW, MEDIUM, HIGH }
    enum Status   { TODO, IN_PROGRESS, DONE }
    record Task(int id, String title, Priority priority, Status status) {}

    static class TaskRepository {
        private final Map<Integer, Task> store = new HashMap<>();
        private int nextId = 1;

        public Task save(String title, Priority p) {
            Task t = new Task(nextId++, title, p, Status.TODO);
            store.put(t.id(), t);
            return t;
        }
        public Optional<Task> findById(int id) {
            return Optional.ofNullable(store.get(id));
        }
        // TODO: findAll(Predicate<Task>) — return matching tasks sorted by id
        public List<Task> findAll(Predicate<Task> filter) {
            return List.of();
        }
        public boolean update(Task updated) {
            if (!store.containsKey(updated.id())) return false;
            store.put(updated.id(), updated);
            return true;
        }
    }

    public static void main(String[] args) {
        TaskRepository repo = new TaskRepository();
        repo.save("Write tests",   Priority.HIGH);
        repo.save("Update docs",   Priority.LOW);
        repo.save("Fix crash",     Priority.HIGH);
        System.out.println(repo.findById(2).map(Task::title).orElse("none"));
        System.out.println(repo.findById(99).isPresent());
        repo.findAll(t -> t.priority() == Priority.HIGH)
            .forEach(t -> System.out.println(t.id() + ": " + t.title()));
    }
}`,
            expectedOutput: "Update docs\nfalse\n1: Write tests\n3: Fix crash",
          },
          {
            slug: "project-business-logic",
            title: "Part 3 — Stream Pipelines & Functional Rule Evaluation",
            order: 3, duration: 20, isPremium: true,
            starterCode:
`import java.util.*;
import java.util.stream.*;
import java.util.function.*;
public class Main {
    enum Priority { LOW, MEDIUM, HIGH }
    enum Status   { TODO, IN_PROGRESS, DONE }
    record Task(int id, String title, Priority priority, Status status, String assignee) {}

    // Business rules expressed as Predicates (Strategy pattern)
    static final Predicate<Task> OVERDUE    = t -> t.status() != Status.DONE && t.priority() == Priority.HIGH;
    static final Predicate<Task> UNASSIGNED = t -> t.assignee() == null || t.assignee().isBlank();

    static Map<String, Long> tasksByAssignee(List<Task> tasks) {
        // TODO: group tasks by assignee, count each
        return Map.of();
    }

    public static void main(String[] args) {
        List<Task> tasks = List.of(
            new Task(1, "Fix crash",   Priority.HIGH,   Status.TODO,        "alice"),
            new Task(2, "Write docs",  Priority.LOW,    Status.IN_PROGRESS, "bob"),
            new Task(3, "Deploy",      Priority.HIGH,   Status.DONE,        "alice"),
            new Task(4, "Code review", Priority.MEDIUM, Status.TODO,        ""),
            new Task(5, "Hotfix",      Priority.HIGH,   Status.TODO,        "bob")
        );

        // Overdue high-priority tasks
        tasks.stream().filter(OVERDUE).map(Task::title).sorted()
            .forEach(System.out::println);

        // Unassigned tasks
        System.out.println(tasks.stream().filter(UNASSIGNED).count());

        // Workload by assignee
        new TreeMap<>(tasksByAssignee(tasks)).forEach((k, v) ->
            System.out.println(k.isBlank() ? "(unassigned)" : k + ": " + v));
    }
}`,
            expectedOutput: "Fix crash\nHotfix\n1\n(unassigned): 1\nalice: 2\nbob: 2",
          },
          {
            slug: "project-concurrency",
            title: "Part 4 — Concurrent Task Processing & CompletableFuture Notifications",
            order: 4, duration: 20, isPremium: true,
            starterCode:
`import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
public class Main {
    enum Priority { LOW, HIGH }
    record Task(int id, String title, Priority priority) {}

    static class TaskProcessor {
        private final ExecutorService pool = Executors.newFixedThreadPool(3);
        private final AtomicInteger processed = new AtomicInteger(0);

        CompletableFuture<String> process(Task task) {
            return CompletableFuture.supplyAsync(() -> {
                processed.incrementAndGet();
                return "DONE: " + task.title();
            }, pool);
        }

        int getProcessed() { return processed.get(); }
        void shutdown()    { pool.shutdown(); }
    }

    public static void main(String[] args) throws Exception {
        TaskProcessor processor = new TaskProcessor();
        List<Task> tasks = List.of(
            new Task(1, "task-a", Priority.HIGH),
            new Task(2, "task-b", Priority.LOW),
            new Task(3, "task-c", Priority.HIGH)
        );

        // TODO: process all tasks concurrently, collect results
        List<CompletableFuture<String>> futures = tasks.stream()
            .map(processor::process)
            .collect(java.util.stream.Collectors.toList());

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        futures.stream().map(f -> {
            try { return f.get(); } catch (Exception e) { return "ERROR"; }
        }).sorted().forEach(System.out::println);

        System.out.println("Processed: " + processor.getProcessed());
        processor.shutdown();
    }
}`,
            expectedOutput: "DONE: task-a\nDONE: task-b\nDONE: task-c\nProcessed: 3",
          },
          {
            slug: "project-tests",
            title: "Part 5 — Writing a Full Test Suite",
            order: 5, duration: 20, isPremium: true,
            starterCode:
`import java.util.*;
public class Main {
    enum Priority { LOW, HIGH }
    enum Status   { TODO, DONE }
    record Task(int id, String title, Priority priority, Status status) {}

    static class TaskService {
        private final Map<Integer, Task> store = new HashMap<>();
        private int seq = 1;
        public Task create(String title, Priority p) {
            Task t = new Task(seq++, title, p, Status.TODO);
            store.put(t.id(), t);
            return t;
        }
        public boolean complete(int id) {
            Task t = store.get(id);
            if (t == null || t.status() == Status.DONE) return false;
            store.put(id, new Task(t.id(), t.title(), t.priority(), Status.DONE));
            return true;
        }
        public long countByStatus(Status s) { return store.values().stream().filter(t -> t.status()==s).count(); }
    }

    // Test harness
    static int ok = 0, fail = 0;
    static void test(String name, boolean pass) {
        System.out.println((pass ? "PASS" : "FAIL") + " " + name); if (pass) ok++; else fail++;
    }
    public static void main(String[] args) {
        TaskService svc = new TaskService();
        Task t1 = svc.create("Alpha", Priority.HIGH);
        Task t2 = svc.create("Beta",  Priority.LOW);

        test("create sets TODO",    t1.status() == Status.TODO);
        test("ids are sequential",  t2.id() == t1.id() + 1);
        test("complete returns true",  svc.complete(t1.id()));
        test("complete marks DONE", svc.countByStatus(Status.DONE) == 1);
        test("double-complete false",  !svc.complete(t1.id()));
        test("complete unknown false", !svc.complete(999));
        test("todo count",          svc.countByStatus(Status.TODO) == 1);
        System.out.println(ok + "/" + (ok + fail) + " passed");
    }
}`,
            expectedOutput: "PASS create sets TODO\nPASS ids are sequential\nPASS complete returns true\nPASS complete marks DONE\nPASS double-complete false\nPASS complete unknown false\nPASS todo count\n7/7 passed",
          },
          {
            slug: "project-polish",
            title: "Part 6 — Polish, Patterns Review & Performance Check",
            order: 6, duration: 20, isPremium: true,
            starterCode:
`import java.util.*;
import java.util.stream.*;
public class Main {
    enum Priority { LOW, MEDIUM, HIGH }
    enum Status   { TODO, IN_PROGRESS, DONE }
    record Task(int id, String title, Priority priority, Status status, String assignee) {}

    // Final integrated demo: repository + streams + patterns + performance check
    static class TaskRepository {
        private final Map<Integer, Task> store = new LinkedHashMap<>();
        private int seq = 1;
        public Task add(String title, Priority p, String assignee) {
            Task t = new Task(seq++, title, p, Status.TODO, assignee);
            store.put(t.id(), t); return t;
        }
        public List<Task> all()          { return List.copyOf(store.values()); }
        public Optional<Task> find(int id) { return Optional.ofNullable(store.get(id)); }
    }

    public static void main(String[] args) {
        TaskRepository repo = new TaskRepository();
        repo.add("Auth service",  Priority.HIGH,   "alice");
        repo.add("Dashboard UI",  Priority.MEDIUM, "bob");
        repo.add("DB migrations", Priority.HIGH,   "alice");
        repo.add("Write tests",   Priority.LOW,    "carol");
        repo.add("Deploy prod",   Priority.CRITICAL, "alice"); // will show as CRITICAL

        // Summary statistics using streams
        Map<Priority, Long> byPriority = repo.all().stream()
            .collect(Collectors.groupingBy(Task::priority, Collectors.counting()));
        new TreeMap<>(byPriority).forEach((p, c) -> System.out.println(p + ": " + c));

        // Workload check
        repo.all().stream()
            .collect(Collectors.groupingBy(Task::assignee, Collectors.counting()))
            .entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .forEach(e -> System.out.println(e.getKey() + " has " + e.getValue() + " tasks"));

        System.out.println("Total: " + repo.all().size());
    }
}`,
            expectedOutput: "CRITICAL: 1\nHIGH: 2\nLOW: 1\nMEDIUM: 1\nalice has 3 tasks\nbob has 1 tasks\ncarol has 1 tasks\nTotal: 5",
          },
        ],
      },
    ],
  },
  {
    slug: "kotlin-bridge",
    title: "Kotlin Bridge",
    order: 4,
    isPremium: true,
    tagline: "Java → Kotlin for experienced developers.",
    modules: kotlinBridgeModules,
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

export function getNextLessonInTrack(trackSlug: string, moduleSlug: string, lessonSlug: string) {
  const track = getTrack(trackSlug);
  if (!track) return null;

  const moduleIdx = track.modules.findIndex((m) => m.slug === moduleSlug);
  if (moduleIdx === -1) return null;

  const mod = track.modules[moduleIdx];
  const lessonIdx = mod.lessons.findIndex((l) => l.slug === lessonSlug);
  if (lessonIdx === -1) return null;

  if (lessonIdx < mod.lessons.length - 1) {
    return {
      moduleSlug: mod.slug,
      lesson: mod.lessons[lessonIdx + 1],
    };
  }

  const nextMod = track.modules[moduleIdx + 1];
  if (!nextMod || nextMod.lessons.length === 0) return null;

  return {
    moduleSlug: nextMod.slug,
    lesson: nextMod.lessons[0],
  };
}
