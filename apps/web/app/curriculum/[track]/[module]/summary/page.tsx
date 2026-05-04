import { notFound } from "next/navigation";
import { getTrack, getModule, curriculum } from "@/lib/curriculum";
import { getCapstoneForModule } from "@/lib/capstones";
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

// ── Summary quiz banks ────────────────────────────────────────────────────────

function getSummaryQuizzes(trackSlug: string, moduleSlug: string): QuizItem[] {
  // ── Java Beginner ────────────────────────────────────────────────────────────

  if (trackSlug === "java-beginner" && moduleSlug === "module-1") {
    return [
      {
        id: "sum-jb1-1",
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
        id: "sum-jb1-2",
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
        id: "sum-jb1-3",
        type: "fill_in_blank",
        difficulty: "medium",
        prompt: "What keyword begins a loop that continues as long as a condition is true?",
        correctAnswers: ["while", "for"],
        caseSensitive: false,
        explanation: "Both while and for can express 'repeat while condition is true'. The while loop is the most direct expression of that idea.",
      },
      {
        id: "sum-jb1-4",
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
        id: "sum-jb2-1",
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
        id: "sum-jb2-2",
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
        c.increment(); c.increment(); c.increment();
        System.out.println(c.get());
    }
}`,
        expectedOutput: "3",
        explanation: "increment() is called three times, each time adding 1 to count which starts at 0.",
      },
      {
        id: "sum-jb2-3",
        type: "fill_in_blank",
        difficulty: "easy",
        prompt: "What keyword is used inside a constructor to refer to the current object's fields?",
        correctAnswers: ["this"],
        caseSensitive: true,
        explanation: "`this` refers to the current instance. It's commonly used in constructors to distinguish `this.name = name` (field vs parameter).",
      },
      {
        id: "sum-jb2-4",
        type: "multiple_choice",
        difficulty: "medium",
        question: "Which access modifier makes a field visible only within its own class?",
        options: [
          { text: "<code>public</code>", correct: false, feedback: "public makes the field accessible from anywhere." },
          { text: "<code>protected</code>", correct: false, feedback: "protected allows access from the same package and subclasses." },
          { text: "<code>private</code>", correct: true },
          { text: "(no modifier)", correct: false, feedback: "Default (package-private) allows access from the same package." },
        ],
        explanation: "private is the most restrictive modifier — only code within the same class can see the field.",
        hint: "Encapsulation best practice: make fields as private as possible.",
      },
    ];
  }

  // ── Java Intermediate ────────────────────────────────────────────────────────

  if (trackSlug === "java-intermediate" && moduleSlug === "module-1") {
    return [
      {
        id: "sum-ji1-1",
        type: "multiple_choice",
        difficulty: "easy",
        question: "What does the <code>interface</code> keyword define in Java?",
        options: [
          { text: "A class that cannot be instantiated directly.", correct: false, feedback: "That describes an abstract class, not an interface." },
          { text: "A contract of method signatures that implementing classes must fulfil.", correct: true },
          { text: "A special type of loop.", correct: false, feedback: "interface has nothing to do with loops." },
          { text: "A built-in collection type.", correct: false, feedback: "Collection types like List and Map are separate from the interface keyword itself." },
        ],
        explanation: "An interface is a pure contract — it lists what a class must be able to do, without specifying how.",
        hint: "Think about the word 'contract' — what does a class promise when it implements an interface?",
      },
      {
        id: "sum-ji1-2",
        type: "predict_output",
        difficulty: "medium",
        code: `interface Greetable {
    String greet();
}
class Formal implements Greetable {
    public String greet() { return "Good day."; }
}
class Casual implements Greetable {
    public String greet() { return "Hey!"; }
}
public class Main {
    public static void main(String[] args) {
        Greetable g = new Casual();
        System.out.println(g.greet());
        g = new Formal();
        System.out.println(g.greet());
    }
}`,
        expectedOutput: "Hey!\nGood day.",
        explanation: "The variable g holds a Greetable reference. First it points to Casual (greet→\"Hey!\"), then to Formal (greet→\"Good day.\").",
      },
      {
        id: "sum-ji1-3",
        type: "multiple_choice",
        difficulty: "medium",
        question: "Which statement about abstract classes is correct?",
        options: [
          { text: "A class can extend multiple abstract classes.", correct: false, feedback: "Java only allows single inheritance — a class can extend at most one class, abstract or not." },
          { text: "An abstract class cannot have any concrete (non-abstract) methods.", correct: false, feedback: "Abstract classes can have both abstract and concrete methods." },
          { text: "An abstract class can have constructors, fields, and concrete methods.", correct: true },
          { text: "Abstract classes are instantiated with new AbstractClass().", correct: false, feedback: "You cannot instantiate an abstract class directly — you must subclass it." },
        ],
        explanation: "Unlike interfaces (before Java 8), abstract classes can contain state (fields), constructors, and fully implemented methods alongside abstract ones.",
        hint: "Abstract classes are real classes — they just forbid direct instantiation.",
      },
      {
        id: "sum-ji1-4",
        type: "fill_in_blank",
        difficulty: "medium",
        prompt: "To add a concrete method to an interface without breaking existing implementations, use the <code>___</code> keyword before the method.",
        correctAnswers: ["default"],
        caseSensitive: true,
        explanation: "Since Java 8, interface default methods let you add new concrete behaviour to an interface without forcing every implementing class to change.",
      },
      {
        id: "sum-ji1-5",
        type: "multiple_choice",
        difficulty: "medium",
        question: "What is a functional interface?",
        options: [
          { text: "An interface that extends java.util.function.Function.", correct: false, feedback: "A functional interface can be any interface with exactly one abstract method." },
          { text: "An interface with exactly one abstract method, usable as a lambda target.", correct: true },
          { text: "An interface with only static methods.", correct: false, feedback: "Only having static methods would make it non-functional in the lambda sense." },
          { text: "An interface that cannot have default methods.", correct: false, feedback: "A functional interface can have default methods — it just must have exactly one abstract method." },
        ],
        explanation: "The @FunctionalInterface annotation enforces the single-abstract-method rule. Common examples: Runnable, Comparator, Predicate.",
        hint: "Lambda expressions work by standing in for the single abstract method.",
      },
      {
        id: "sum-ji1-6",
        type: "multiple_choice",
        difficulty: "hard",
        question: "A class <code>Bird implements Flyable</code> where <code>Flyable</code> declares <code>fly()</code> and <code>land()</code>, but Bird only defines <code>fly()</code>. What happens at compile time?",
        options: [
          { text: "Compiles fine — unimplemented methods default to no-ops.", correct: false, feedback: "Java does not silently provide default implementations for interface methods (unless the interface itself declares them as default)." },
          { text: "Compile error: Bird must implement land() or be declared abstract.", correct: true },
          { text: "Compiles but throws UnsupportedOperationException at runtime.", correct: false, feedback: "The failure is at compile time, not runtime." },
          { text: "Compiles only if Bird extends Object.", correct: false, feedback: "All classes extend Object implicitly; that has no bearing on interface method requirements." },
        ],
        explanation: "When a class implements an interface it must provide a body for every abstract method. The fix: add `public void land() { ... }` to Bird, or declare Bird as abstract.",
      },
    ];
  }

  if (trackSlug === "java-intermediate" && moduleSlug === "module-2") {
    return [
      {
        id: "sum-ji2-1",
        type: "multiple_choice",
        difficulty: "easy",
        question: "What is a Java exception?",
        options: [
          { text: "A syntax error caught by the compiler.", correct: false, feedback: "Syntax errors are compile-time; exceptions are runtime events." },
          { text: "An object that represents an abnormal condition during program execution.", correct: true },
          { text: "A keyword used to end a program.", correct: false, feedback: "return/System.exit end programs; exception is a runtime object." },
          { text: "A type of comment used to disable code.", correct: false, feedback: "Comments don't affect runtime behaviour at all." },
        ],
        explanation: "All Java exceptions are objects — subclasses of Throwable. When something goes wrong at runtime, an exception object is 'thrown' up the call stack.",
      },
      {
        id: "sum-ji2-2",
        type: "predict_output",
        difficulty: "medium",
        code: `public class Main {
    public static void main(String[] args) {
        try {
            System.out.println("A");
            if (true) throw new RuntimeException("boom");
            System.out.println("B");
        } catch (RuntimeException e) {
            System.out.println("C: " + e.getMessage());
        } finally {
            System.out.println("D");
        }
    }
}`,
        expectedOutput: "A\nC: boom\nD",
        explanation: "\"A\" prints, then the exception is thrown (skipping \"B\"), caught (printing \"C: boom\"), and finally always runs (printing \"D\").",
      },
      {
        id: "sum-ji2-3",
        type: "multiple_choice",
        difficulty: "medium",
        question: "What is the key difference between checked and unchecked exceptions?",
        options: [
          { text: "Checked exceptions are faster at runtime than unchecked.", correct: false, feedback: "The check/unchecked distinction is about compile-time enforcement, not runtime speed." },
          { text: "Checked exceptions must be declared or caught at compile time; unchecked exceptions do not.", correct: true },
          { text: "Unchecked exceptions cannot be caught.", correct: false, feedback: "Unchecked exceptions can absolutely be caught — they just don't have to be." },
          { text: "Checked exceptions extend RuntimeException.", correct: false, feedback: "It's the opposite: RuntimeException and its subclasses are unchecked; direct subclasses of Exception are checked." },
        ],
        explanation: "Checked: compiler forces you to handle or declare (e.g., IOException). Unchecked: extend RuntimeException — caller's choice whether to catch (e.g., NullPointerException).",
        hint: "Think about what 'checked at compile time' means for the programmer.",
      },
      {
        id: "sum-ji2-4",
        type: "fill_in_blank",
        difficulty: "easy",
        prompt: "To create and signal an exception you use the <code>___</code> keyword followed by a new exception object.",
        correctAnswers: ["throw"],
        caseSensitive: true,
        explanation: "`throw new IllegalArgumentException(\"message\")` creates and immediately throws an exception. Note: `throws` (with an s) is used in method signatures to declare checked exceptions.",
      },
      {
        id: "sum-ji2-5",
        type: "multiple_choice",
        difficulty: "medium",
        question: "When should you create a custom exception class?",
        options: [
          { text: "Whenever you want a shorter exception name.", correct: false, feedback: "Brevity alone is not a good reason — existing exceptions are well understood by readers." },
          { text: "When a domain-specific error needs a distinct type so callers can catch it selectively.", correct: true },
          { text: "Custom exceptions are always better than built-in ones.", correct: false, feedback: "Prefer standard exceptions when they fit — they communicate intent without extra classes." },
          { text: "Only when the error message would be longer than 20 characters.", correct: false, feedback: "Message length has no bearing on whether a custom exception is appropriate." },
        ],
        explanation: "Custom exceptions shine when callers need to catch a specific failure mode (e.g., InsufficientFundsException) and differentiate it from unrelated errors.",
      },
      {
        id: "sum-ji2-6",
        type: "multiple_choice",
        difficulty: "hard",
        question: "A method <code>divide(10, 0)</code> is called inside a try block. The catch clause is <code>catch (NullPointerException e)</code>. What happens?",
        options: [
          { text: "The catch block runs because NullPointerException is a supertype of ArithmeticException.", correct: false, feedback: "It's the other way around — ArithmeticException does not extend NullPointerException." },
          { text: "Division by zero is silently ignored and the program continues.", correct: false, feedback: "Uncaught exceptions propagate up and, if unhandled, terminate the program with a stack trace." },
          { text: "An ArithmeticException propagates unhandled, crashing the program.", correct: true },
          { text: "Java automatically widens the catch to handle any RuntimeException.", correct: false, feedback: "Java does not auto-widen catch clauses — you catch exactly what you write (or a supertype)." },
        ],
        explanation: "The catch clause only intercepts exceptions that are assignment-compatible with the declared type. Fix: catch ArithmeticException (or Exception) to handle division by zero.",
      },
    ];
  }

  if (trackSlug === "java-intermediate" && moduleSlug === "module-3") {
    return [
      {
        id: "sum-ji3-1",
        type: "multiple_choice",
        difficulty: "easy",
        question: "What problem do generics primarily solve in Java?",
        options: [
          { text: "They make programs run faster by avoiding method calls.", correct: false, feedback: "Generics have no significant runtime performance benefit — they're erased at runtime." },
          { text: "They provide compile-time type safety, eliminating the need for casts and preventing ClassCastException.", correct: true },
          { text: "They allow a class to extend multiple parent classes.", correct: false, feedback: "Multiple inheritance is unrelated to generics; Java still only allows single class inheritance." },
          { text: "They replace the need for interfaces.", correct: false, feedback: "Generics and interfaces solve different problems and work well together." },
        ],
        explanation: "Before generics, collections stored Object, requiring casts everywhere and allowing runtime ClassCastExceptions. Generics move the error to compile time.",
        hint: "Think about what happens when you add a String to a List<Integer>.",
      },
      {
        id: "sum-ji3-2",
        type: "predict_output",
        difficulty: "medium",
        code: `class Box<T> {
    private T value;
    Box(T value) { this.value = value; }
    T get() { return value; }
}
public class Main {
    public static void main(String[] args) {
        Box<Integer> b = new Box<>(42);
        System.out.println(b.get() * 2);
    }
}`,
        expectedOutput: "84",
        explanation: "Box<Integer> stores 42. get() returns 42 (auto-unboxed from Integer). 42 * 2 = 84.",
      },
      {
        id: "sum-ji3-3",
        type: "fill_in_blank",
        difficulty: "medium",
        prompt: "In the declaration <code>class Pair&lt;A, B&gt;</code>, <code>A</code> and <code>B</code> are called type ___.",
        correctAnswers: ["parameters", "parameter"],
        caseSensitive: false,
        explanation: "Type parameters are placeholders declared in angle brackets. They are replaced by actual types (type arguments) when the class is used, e.g., Pair<String, Integer>.",
      },
      {
        id: "sum-ji3-4",
        type: "multiple_choice",
        difficulty: "medium",
        question: "What does <code>&lt;T extends Comparable&lt;T&gt;&gt;</code> mean on a generic method?",
        options: [
          { text: "T must be a subclass of the Comparable class.", correct: false, feedback: "Comparable is an interface, not a class; and the bound means T must implement it." },
          { text: "T is restricted to types that implement the Comparable interface, allowing calls to compareTo.", correct: true },
          { text: "T can only be a primitive type.", correct: false, feedback: "Primitives can't be used as type parameters at all; this bound is about interface implementation." },
          { text: "The method will be called with a cast to Comparable.", correct: false, feedback: "Bounds eliminate casts — the compiler already knows T has compareTo." },
        ],
        explanation: "Upper-bounded type parameters (<T extends X>) restrict the type argument to X or any subtype/implementor of X, making X's methods safely callable on T.",
      },
      {
        id: "sum-ji3-5",
        type: "multiple_choice",
        difficulty: "hard",
        question: "Given <code>List&lt;? extends Number&gt; nums</code>, which operation is allowed?",
        options: [
          { text: "<code>nums.add(42);</code>", correct: false, feedback: "You cannot add to a List<? extends Number> because the compiler can't guarantee which specific Number subtype the list holds." },
          { text: "<code>Number n = nums.get(0);</code>", correct: true },
          { text: "<code>nums.add(null);</code>", correct: false, feedback: "Adding null is a special case that works, but 'adding' in general is forbidden — this is a common misconception." },
          { text: "<code>nums.clear(); nums.add(3.14);</code>", correct: false, feedback: "clear() is fine, but add() is still forbidden for the same reason." },
        ],
        explanation: "Upper-bounded wildcards (? extends T) support reads (safe to read as T) but forbid writes (unsafe since the actual element type is unknown). This is the Producer-Extends rule (PECS).",
        hint: "Ask: can the compiler guarantee the list is a List<Double> at this point? If not, can it allow adding a Double?",
      },
    ];
  }

  if (trackSlug === "java-intermediate" && moduleSlug === "module-4") {
    return [
      {
        id: "sum-ji4-1",
        type: "multiple_choice",
        difficulty: "easy",
        question: "Which interface sits at the top of the Java Collections Framework hierarchy for single-element containers?",
        options: [
          { text: "<code>List</code>", correct: false, feedback: "List extends Collection — it's one level below the root." },
          { text: "<code>Collection</code>", correct: true },
          { text: "<code>Map</code>", correct: false, feedback: "Map is a separate hierarchy — it stores key-value pairs, not single elements." },
          { text: "<code>Iterable</code>", correct: false, feedback: "Iterable is above Collection in the type hierarchy, but Collection is the root of the collections framework specifically." },
        ],
        explanation: "Collection is the root interface for List, Set, and Queue. Map is a separate hierarchy because it stores pairs, not individual elements.",
      },
      {
        id: "sum-ji4-2",
        type: "predict_output",
        difficulty: "easy",
        code: `import java.util.ArrayList;
public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("A"); list.add("B"); list.add("C");
        list.remove(1);
        System.out.println(list);
    }
}`,
        expectedOutput: "[A, C]",
        explanation: "remove(1) removes by index — index 1 is \"B\". The remaining elements are [\"A\", \"C\"]. ArrayList.toString() formats as [A, C].",
      },
      {
        id: "sum-ji4-3",
        type: "multiple_choice",
        difficulty: "medium",
        question: "When should you prefer <code>LinkedList</code> over <code>ArrayList</code>?",
        options: [
          { text: "When you need fast random access by index.", correct: false, feedback: "ArrayList has O(1) random access; LinkedList is O(n) — the opposite of what you want." },
          { text: "When insertions and deletions at the front or middle are frequent and random access is rare.", correct: true },
          { text: "When memory is a concern — LinkedList uses less memory.", correct: false, feedback: "LinkedList uses more memory due to node overhead (two pointers per element)." },
          { text: "LinkedList is always faster, so prefer it by default.", correct: false, feedback: "ArrayList is usually faster in practice due to cache locality." },
        ],
        explanation: "LinkedList shines for queue/deque scenarios (addFirst/addLast/removeFirst) where you don't need index-based access. For general use, ArrayList wins.",
      },
      {
        id: "sum-ji4-4",
        type: "fill_in_blank",
        difficulty: "medium",
        prompt: "A <code>HashSet</code> guarantees ___ duplicate elements.",
        correctAnswers: ["no", "zero"],
        caseSensitive: false,
        explanation: "Sets enforce uniqueness. HashSet uses hashCode() and equals() to detect duplicates — adding an element that already exists is silently ignored.",
        hint: "Think about the mathematical definition of a 'set'.",
      },
      {
        id: "sum-ji4-5",
        type: "predict_output",
        difficulty: "medium",
        code: `import java.util.HashMap;
public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> map = new HashMap<>();
        map.put("a", 1); map.put("b", 2); map.put("a", 99);
        System.out.println(map.get("a"));
        System.out.println(map.size());
    }
}`,
        expectedOutput: "99\n2",
        explanation: "put(\"a\", 99) replaces the value for key \"a\" — the map has 2 entries (\"a\"→99 and \"b\"→2). get(\"a\") returns 99.",
      },
      {
        id: "sum-ji4-6",
        type: "multiple_choice",
        difficulty: "medium",
        question: "How does <code>TreeMap</code> differ from <code>HashMap</code>?",
        options: [
          { text: "TreeMap allows null keys; HashMap does not.", correct: false, feedback: "It's the opposite — HashMap allows one null key; TreeMap does not (it compares keys, and null can't be compared)." },
          { text: "TreeMap stores keys in sorted order; HashMap provides no ordering guarantee.", correct: true },
          { text: "TreeMap has O(1) get/put; HashMap is O(log n).", correct: false, feedback: "The complexities are reversed: HashMap is O(1) average; TreeMap is O(log n) due to the red-black tree." },
          { text: "TreeMap can only hold String keys.", correct: false, feedback: "TreeMap can hold any key type that implements Comparable (or takes a Comparator)." },
        ],
        explanation: "TreeMap is backed by a red-black tree and iterates keys in natural (or custom) sorted order. Use it when sorted iteration matters; use HashMap for fastest lookups.",
      },
      {
        id: "sum-ji4-7",
        type: "multiple_choice",
        difficulty: "medium",
        question: "You need a collection that stores unique course names and lets you instantly check whether a given name exists. Which is the best choice?",
        options: [
          { text: "<code>ArrayList</code>", correct: false, feedback: "ArrayList.contains() is O(n) — it scans the whole list every time." },
          { text: "<code>LinkedList</code>", correct: false, feedback: "LinkedList.contains() is also O(n) and adds node overhead." },
          { text: "<code>HashSet</code>", correct: true },
          { text: "<code>TreeMap</code>", correct: false, feedback: "TreeMap stores key-value pairs; you only need a set of unique names here." },
        ],
        explanation: "HashSet.contains() is O(1) average and automatically rejects duplicates — the ideal combination for this use case.",
      },
    ];
  }

  if (trackSlug === "java-intermediate" && moduleSlug === "module-5") {
    return [
      {
        id: "sum-ji5-1",
        type: "multiple_choice",
        difficulty: "easy",
        question: "Which interface must a class implement so its instances can be used in a for-each loop?",
        options: [
          { text: "<code>Comparable&lt;T&gt;</code>", correct: false, feedback: "Comparable defines compareTo for ordering — it has nothing to do with iteration." },
          { text: "<code>Iterable&lt;T&gt;</code>", correct: true },
          { text: "<code>Iterator&lt;T&gt;</code>", correct: false, feedback: "Iterator describes the cursor itself; classes return an Iterator from Iterable.iterator()." },
          { text: "<code>Collection&lt;T&gt;</code>", correct: false, feedback: "Collection works because it extends Iterable, but Iterable is the minimum requirement." },
        ],
        explanation: "The for-each loop is syntactic sugar for calling iterator() on an Iterable and walking it with hasNext()/next(). Arrays are also supported as a special case.",
      },
      {
        id: "sum-ji5-2",
        type: "predict_output",
        difficulty: "medium",
        code: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        List<Integer> nums = new ArrayList<>(Arrays.asList(1, 2, 3, 4));
        Iterator<Integer> it = nums.iterator();
        while (it.hasNext()) {
            int n = it.next();
            if (n % 2 == 0) it.remove();
        }
        System.out.println(nums);
    }
}`,
        expectedOutput: "[1, 3]",
        explanation: "Iterator.remove() safely deletes the element returned by the most recent next(). Even numbers (2 and 4) are removed, leaving [1, 3].",
      },
      {
        id: "sum-ji5-3",
        type: "multiple_choice",
        difficulty: "medium",
        question: "What happens if you call <code>list.remove(item)</code> directly inside a for-each loop over <code>list</code>?",
        options: [
          { text: "The element is removed and iteration continues normally.", correct: false, feedback: "This would only work for very specific implementations — and even then, it's not guaranteed." },
          { text: "It throws a <code>ConcurrentModificationException</code> on the next iteration.", correct: true },
          { text: "It throws a <code>NoSuchElementException</code> immediately.", correct: false, feedback: "NoSuchElementException is thrown by next() when there are no more elements, not from external modification." },
          { text: "Nothing — the modification is silently ignored.", correct: false, feedback: "Modifications are detected via a modCount counter and the iterator throws when it notices the mismatch." },
        ],
        explanation: "Java's collection iterators are 'fail-fast' — they detect concurrent modification by tracking a modCount field and throw ConcurrentModificationException. Use Iterator.remove() or Collection.removeIf() instead.",
        hint: "The keyword to look up is 'fail-fast iterator'.",
      },
      {
        id: "sum-ji5-4",
        type: "fill_in_blank",
        difficulty: "easy",
        prompt: "<code>Iterable&lt;T&gt;</code> declares a single method, <code>___()</code>, which returns an Iterator&lt;T&gt;.",
        correctAnswers: ["iterator"],
        caseSensitive: true,
        explanation: "iterator() is the only abstract method in Iterable. Implementing it makes your class for-each compatible.",
      },
      {
        id: "sum-ji5-5",
        type: "multiple_choice",
        difficulty: "medium",
        question: "What's a key advantage of <code>Stream</code>-based processing over a classic for-each loop?",
        options: [
          { text: "Streams are always faster.", correct: false, feedback: "Streams have overhead; for simple cases a for-each loop is often faster." },
          { text: "Streams allow declarative pipelines (filter, map, reduce) that read top-to-bottom as the data flows.", correct: true },
          { text: "Streams replace the need for collections.", correct: false, feedback: "Streams operate on collections (and other sources) — they don't replace them." },
          { text: "Streams modify the underlying collection in place.", correct: false, feedback: "Streams are non-destructive — they don't modify the source." },
        ],
        explanation: "Streams shine for chains of operations that would otherwise need temporary collections or nested loops. They also enable lazy evaluation and easy parallelism (parallelStream).",
      },
    ];
  }

  if (trackSlug === "java-intermediate" && moduleSlug === "module-6") {
    return [
      {
        id: "sum-ji6-1",
        type: "multiple_choice",
        difficulty: "easy",
        question: "Why use an enum instead of a set of <code>public static final int</code> constants?",
        options: [
          { text: "Enums use less memory.", correct: false, feedback: "Memory is not the primary concern — type safety is." },
          { text: "Enums provide compile-time type safety, namespacing, and built-in helpers like values() and valueOf().", correct: true },
          { text: "Enums are faster than int constants.", correct: false, feedback: "Performance is comparable; the win is correctness, not speed." },
          { text: "Enums let you change the constants at runtime.", correct: false, feedback: "Enum constants are fixed at compile time — that's the point." },
        ],
        explanation: "Pre-enum 'int constants' allowed nonsense like passing 99 where MONDAY was expected. Enums make such errors impossible at compile time.",
      },
      {
        id: "sum-ji6-2",
        type: "predict_output",
        difficulty: "medium",
        code: `public class Main {
    enum Light { RED, YELLOW, GREEN }
    public static void main(String[] args) {
        Light l = Light.GREEN;
        System.out.println(l.ordinal());
        System.out.println(Light.values().length);
        System.out.println(Light.valueOf("RED"));
    }
}`,
        expectedOutput: "2\n3\nRED",
        explanation: "GREEN is the third constant (ordinal 2, since RED=0, YELLOW=1, GREEN=2). values() has length 3. valueOf(\"RED\") returns the RED constant.",
      },
      {
        id: "sum-ji6-3",
        type: "multiple_choice",
        difficulty: "medium",
        question: "What is the visibility of an enum's constructor?",
        options: [
          { text: "<code>public</code> — anyone can create new constants.", correct: false, feedback: "If anyone could create new constants, enums wouldn't be a fixed set — that contradicts the point of enums." },
          { text: "<code>private</code> (or package-private) — implicitly. You cannot mark it <code>public</code>.", correct: true },
          { text: "<code>protected</code> — only subclasses can call it.", correct: false, feedback: "Enums cannot be subclassed by user code, so protected makes no sense here." },
          { text: "There is no constructor — fields are auto-set.", correct: false, feedback: "Enums absolutely have constructors when you give them fields — the constants pass arguments in their declarations." },
        ],
        explanation: "An enum constructor is implicitly private. Trying to mark it public is a compile error. This guarantees the set of constants is fixed at the enum declaration.",
      },
      {
        id: "sum-ji6-4",
        type: "fill_in_blank",
        difficulty: "easy",
        prompt: "To compare two enum constants, use <code>___</code> (the equality operator), not <code>.equals()</code>.",
        correctAnswers: ["==", "==="],
        caseSensitive: false,
        explanation: "Each enum constant is a singleton, so reference equality (==) is exact, faster, and null-safe (== with null is fine; .equals() throws NullPointerException).",
      },
      {
        id: "sum-ji6-5",
        type: "multiple_choice",
        difficulty: "medium",
        question: "Which is the most appropriate use of an <code>EnumSet</code>?",
        options: [
          { text: "Storing arbitrary user-supplied strings.", correct: false, feedback: "EnumSet only holds enum constants — strings won't work." },
          { text: "Compactly representing which days of the week are 'working days'.", correct: true },
          { text: "Counting how many times each enum constant appears in a list.", correct: false, feedback: "That's a use case for EnumMap<Day, Integer>, not EnumSet." },
          { text: "Mapping a String key to an enum value.", correct: false, feedback: "That's a use case for HashMap<String, Day>." },
        ],
        explanation: "EnumSet is bit-vector backed — extremely fast and compact when you need to track 'which subset of these enum values is active'.",
      },
    ];
  }

  if (trackSlug === "java-intermediate" && moduleSlug === "module-7") {
    return [
      {
        id: "sum-ji7-1",
        type: "multiple_choice",
        difficulty: "easy",
        question: "What is the key difference between a static nested class and an inner class?",
        options: [
          { text: "Static nested classes are faster.", correct: false, feedback: "Performance is comparable; the difference is structural, not runtime." },
          { text: "An inner class holds an implicit reference to an enclosing instance; a static nested class does not.", correct: true },
          { text: "Static nested classes can't have private members.", correct: false, feedback: "Both kinds of nested classes can have private members." },
          { text: "Inner classes can't be instantiated outside their enclosing class.", correct: false, feedback: "They can be — using outer.new Inner() syntax — though it's uncommon." },
        ],
        explanation: "The implicit outer reference is the defining feature of inner classes (and a common source of memory leaks). Static nested classes behave like top-level classes that just happen to be namespaced.",
      },
      {
        id: "sum-ji7-2",
        type: "predict_output",
        difficulty: "medium",
        code: `public class Main {
    private int x = 10;
    class Inner {
        int get() { return x; }
    }
    public static void main(String[] args) {
        Main outer = new Main();
        outer.x = 42;
        Main.Inner inner = outer.new Inner();
        System.out.println(inner.get());
    }
}`,
        expectedOutput: "42",
        explanation: "Inner.get() reads x from the enclosing Main instance. After outer.x = 42, inner.get() returns 42 — the inner instance shares state with its outer instance.",
      },
      {
        id: "sum-ji7-3",
        type: "multiple_choice",
        difficulty: "medium",
        question: "A local class declared inside a method can refer to local variables of the enclosing method only if those variables are…",
        options: [
          { text: "declared <code>volatile</code>.", correct: false, feedback: "volatile is for cross-thread visibility — unrelated to local class capture." },
          { text: "declared <code>final</code> or effectively final (never reassigned after initialization).", correct: true },
          { text: "of primitive type.", correct: false, feedback: "The restriction is about reassignment, not type." },
          { text: "fields of the enclosing class.", correct: false, feedback: "Fields are always accessible. The rule is about local variables specifically." },
        ],
        explanation: "Local classes (and lambdas) capture local variables by value. To prevent confusing 'which version did I capture?' questions, Java requires the variable to never change — the 'effectively final' rule.",
        hint: "Same restriction applies to lambdas — both capture locals.",
      },
      {
        id: "sum-ji7-4",
        type: "fill_in_blank",
        difficulty: "easy",
        prompt: "An anonymous class can either extend exactly one class or implement exactly one ___.",
        correctAnswers: ["interface"],
        caseSensitive: false,
        explanation: "Anonymous class declarations have the form `new Type() { ... }` where Type is either a single class or a single interface. Multiple supertypes aren't supported.",
      },
      {
        id: "sum-ji7-5",
        type: "multiple_choice",
        difficulty: "hard",
        question: "Inside a lambda, what does the keyword <code>this</code> refer to?",
        options: [
          { text: "The lambda object itself.", correct: false, feedback: "Lambdas don't have a 'lambda object' you can refer to with this — that's an anonymous-class-only thing." },
          { text: "The enclosing class instance — the same as in the surrounding code.", correct: true },
          { text: "It throws a compile error — <code>this</code> is forbidden inside lambdas.", correct: false, feedback: "this is allowed; it just doesn't refer to the lambda." },
          { text: "<code>null</code>.", correct: false, feedback: "this is never null in valid Java." },
        ],
        explanation: "This is one of the key differences between lambdas and anonymous classes: anonymous classes shadow `this` (it refers to the anonymous instance), while lambdas don't shadow it (it refers to the surrounding class).",
      },
    ];
  }

  if (trackSlug === "java-intermediate" && moduleSlug === "module-8") {
    return [
      {
        id: "sum-ji8-1",
        type: "multiple_choice",
        difficulty: "easy",
        question: "Which class represents a path in the modern (NIO.2) Java file API?",
        options: [
          { text: "<code>java.io.File</code>", correct: false, feedback: "File is the legacy class. Path (since Java 7) is preferred for new code." },
          { text: "<code>java.nio.file.Path</code>", correct: true },
          { text: "<code>java.lang.String</code>", correct: false, feedback: "String can hold a path-like value, but it's not a path type — operations like resolve and getParent live on Path." },
          { text: "<code>java.nio.file.FileSystem</code>", correct: false, feedback: "FileSystem represents the whole file system; Path represents one location within it." },
        ],
        explanation: "Path is immutable, OS-independent, and has rich helper methods. It replaces the legacy File class for new code.",
      },
      {
        id: "sum-ji8-2",
        type: "fill_in_blank",
        difficulty: "easy",
        prompt: "To read an entire UTF-8 text file into a single String in one call (Java 11+), use <code>Files.___(path)</code>.",
        correctAnswers: ["readString", "readstring"],
        caseSensitive: false,
        explanation: "Files.readString(path) returns the file's contents as a String, decoding with UTF-8 by default. For very large files, prefer Files.lines (a Stream).",
      },
      {
        id: "sum-ji8-3",
        type: "multiple_choice",
        difficulty: "medium",
        question: "By default, <code>Files.writeString(path, content)</code> on an existing file…",
        options: [
          { text: "Appends content to the end of the file.", correct: false, feedback: "Append requires StandardOpenOption.APPEND — it's not the default." },
          { text: "Truncates the file and writes the content from the start.", correct: true },
          { text: "Throws an exception because the file already exists.", correct: false, feedback: "That would require StandardOpenOption.CREATE_NEW — not the default." },
          { text: "Creates a backup .bak file first.", correct: false, feedback: "No file API in the JDK auto-creates backups; you'd write that yourself." },
        ],
        explanation: "Default behavior is CREATE + WRITE + TRUNCATE_EXISTING. Pass StandardOpenOption.APPEND if you want to keep existing content and add to it.",
      },
      {
        id: "sum-ji8-4",
        type: "multiple_choice",
        difficulty: "medium",
        question: "What does <code>try-with-resources</code> guarantee?",
        options: [
          { text: "The try block never throws.", correct: false, feedback: "Exceptions thrown in the try block still propagate normally." },
          { text: "Resources declared in the parens are <code>close()</code>d when the try block exits, even on exception.", correct: true },
          { text: "The resources are flushed but not closed.", correct: false, feedback: "Implementations of close() typically flush and then release the resource — both happen." },
          { text: "Multiple resources can't be declared at once.", correct: false, feedback: "Multiple resources can be declared, separated by semicolons. They close in reverse order." },
        ],
        explanation: "Try-with-resources eliminates the verbose try/finally pattern for AutoCloseable resources, and correctly handles suppressed exceptions when both the try block and close() throw.",
        hint: "Resources implement AutoCloseable.",
      },
      {
        id: "sum-ji8-5",
        type: "fill_in_blank",
        difficulty: "medium",
        prompt: "To create a directory and any missing parent directories in a single call, use <code>Files.___(path)</code>.",
        correctAnswers: ["createDirectories", "createdirectories"],
        caseSensitive: false,
        explanation: "createDirectory creates one directory and fails if a parent is missing; createDirectories creates the whole chain. Compare with mkdir vs mkdir -p in shell.",
      },
      {
        id: "sum-ji8-6",
        type: "predict_output",
        difficulty: "medium",
        code: `import java.nio.file.*;
import java.util.stream.Stream;
public class Main {
    public static void main(String[] args) throws Exception {
        Path p = Paths.get("/tmp/log.txt");
        Files.writeString(p, "INFO ok\nERROR bad\nINFO done\nERROR boom\n");
        long count;
        try (Stream<String> lines = Files.lines(p)) {
            count = lines.filter(l -> l.startsWith("ERROR")).count();
        }
        System.out.println(count);
    }
}`,
        expectedOutput: "2",
        explanation: "Files.lines streams the file lazily, line by line. The filter keeps only lines starting with ERROR, count returns 2 (the two ERROR lines).",
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

// ── What-you-covered highlights ───────────────────────────────────────────────

function getHighlights(trackSlug: string, moduleSlug: string, fallbackLessons: string[]): string[] {
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
  if (trackSlug === "java-intermediate" && moduleSlug === "module-1") {
    return [
      "Defining interfaces and the contract they represent",
      "Implementing multiple interfaces in a single class",
      "Abstract classes — state, constructors, and partial implementation",
      "Choosing between an interface and an abstract class",
      "Extending interfaces with default and static methods (Java 8+)",
      "Functional interfaces as lambda targets",
    ];
  }
  if (trackSlug === "java-intermediate" && moduleSlug === "module-2") {
    return [
      "Understanding exceptions as runtime objects that signal failure",
      "Writing try-catch-finally to handle and clean up after errors",
      "Distinguishing checked exceptions from unchecked (RuntimeException) ones",
      "Throwing exceptions intentionally with throw",
      "Creating domain-specific custom exception classes",
      "Applying best practices: specific catches, meaningful messages, not swallowing errors",
    ];
  }
  if (trackSlug === "java-intermediate" && moduleSlug === "module-3") {
    return [
      "Understanding why generics eliminate unsafe Object casts",
      "Writing generic classes with type parameters",
      "Writing generic methods that infer their type from arguments",
      "Bounding type parameters with extends to unlock interface methods",
      "Using wildcards (?, ? extends T, ? super T) for flexible APIs",
    ];
  }
  if (trackSlug === "java-intermediate" && moduleSlug === "module-4") {
    return [
      "Navigating the Collection / Map interface hierarchy",
      "ArrayList — dynamic arrays with O(1) random access",
      "LinkedList — doubly-linked nodes for efficient front/middle insertions",
      "HashSet and TreeSet — duplicate-free collections (unordered vs sorted)",
      "HashMap — O(1) average key-value lookup",
      "TreeMap — sorted key-value map backed by a red-black tree",
      "Choosing the right collection for access patterns, ordering, and uniqueness needs",
    ];
  }
  if (trackSlug === "java-intermediate" && moduleSlug === "module-5") {
    return [
      "How the for-each loop desugars to Iterable.iterator() + hasNext/next",
      "Driving an Iterator manually with hasNext() and next()",
      "Removing elements safely during iteration via Iterator.remove()",
      "Implementing Iterable<T> to make a custom class for-each compatible",
      "A first taste of Streams: filter, map, collect, and sum",
    ];
  }
  if (trackSlug === "java-intermediate" && moduleSlug === "module-6") {
    return [
      "Defining a fixed set of named constants with the enum keyword",
      "Adding fields, constructors, and methods to enums for richer behavior",
      "Per-constant logic via abstract methods overridden in each constant body",
      "Implementing interfaces from enums to plug into existing APIs",
      "EnumSet and EnumMap — fast, compact collections keyed by enum values",
    ];
  }
  if (trackSlug === "java-intermediate" && moduleSlug === "module-7") {
    return [
      "Static nested classes — namespaced helpers without an outer reference",
      "Inner classes — implicit link to the enclosing instance and its private state",
      "Local classes scoped to a method body, capturing effectively-final locals",
      "Anonymous classes — inline implementations of an interface or class",
      "Lambdas as a concise replacement for single-method anonymous classes",
    ];
  }
  if (trackSlug === "java-intermediate" && moduleSlug === "module-8") {
    return [
      "The modern NIO.2 API: Path, Paths, and Files",
      "Reading whole files into a String or list of lines",
      "Writing and appending text files with StandardOpenOption",
      "Listing, creating, and deleting directories",
      "try-with-resources for automatic, exception-safe cleanup",
      "Streaming a file line-by-line with Files.lines for large inputs",
    ];
  }
  return fallbackLessons;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function SummaryPage({ params }: SummaryPageProps) {
  const { track: trackSlug, module: moduleSlug } = await params;
  const track = getTrack(trackSlug);
  const mod = getModule(trackSlug, moduleSlug);
  if (!track || !mod) notFound();

  const trackModules = track.modules;
  const modIndex = trackModules.findIndex((m) => m.slug === moduleSlug);
  const nextMod = modIndex < trackModules.length - 1 ? trackModules[modIndex + 1] : null;
  const capstone = getCapstoneForModule(trackSlug, moduleSlug);

  const summaryQuizzes = getSummaryQuizzes(trackSlug, moduleSlug);
  const highlights = getHighlights(trackSlug, moduleSlug, mod.lessons.map((l) => l.title));

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
            module{" "}
            <span className="text-accent font-semibold tabular-nums">
              {String(mod.order).padStart(2, "0")}
            </span>{" "}
            complete
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
                  className="text-xs text-accent font-semibold tabular-nums w-5 shrink-0"
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
          {capstone && (
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
                    Capstone — {capstone.title}
                  </p>
                  <p className="text-xs text-prose-faint mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>
                    {capstone.duration} · fully graded · badge &amp; certificate
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
