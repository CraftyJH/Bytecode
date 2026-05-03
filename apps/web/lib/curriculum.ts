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
    tagline: "Interfaces, generics, collections, and exception handling.",
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
    ],
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
