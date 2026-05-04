import type { ModuleMeta } from "./curriculum";

/** Kotlin Bridge — modules aligned with DB migration V3 and MDX under content/lessons/kotlin-bridge/. */
export const kotlinBridgeModules: ModuleMeta[] = [
  {
    slug: "module-1",
    title: "Orientation and First Steps",
    order: 1,
    isPremium: true,
    lessons: [
      {
        slug: "why-kotlin-for-java-devs",
        title: "Why Kotlin for Java Developers?",
        order: 1,
        duration: 14,
        isPremium: true,
        language: "kotlin",
        starterCode: `fun main() {
    // TODO: print exactly:
    // Kotlin Bridge
    // JVM 21 baseline
    println("")
    println("")
}`,
        expectedOutput: "Kotlin Bridge\nJVM 21 baseline",
      },
      {
        slug: "tooling-gradle-and-repl",
        title: "Tooling: Gradle and Running Kotlin",
        order: 2,
        duration: 13,
        isPremium: true,
        language: "kotlin",
        starterCode: `fun main() {
    // TODO: print exactly: Kotlin Gradle plugin
    println("")
}`,
        expectedOutput: "Kotlin Gradle plugin",
      },
      {
        slug: "packages-and-main",
        title: "Packages and the Entry Point",
        order: 3,
        duration: 12,
        isPremium: true,
        language: "kotlin",
        starterCode: `fun main() {
    // TODO: print Hello, Kotlin
    println("")
}`,
        expectedOutput: "Hello, Kotlin",
      },
      {
        slug: "java-to-kotlin-cheatsheet",
        title: "Java to Kotlin Syntax Map",
        order: 4,
        duration: 15,
        isPremium: true,
        language: "kotlin",
        starterCode: `fun main() {
    val a = 10
    val b = 5
    // TODO: first line print a * b, second line print done
    println(0)
    println("")
}`,
        expectedOutput: "50\ndone",
      },
    ],
  },
  {
    slug: "module-2",
    title: "Types, Variables, and Control Flow",
    order: 2,
    isPremium: true,
    lessons: [
      {
        slug: "val-var-and-inference",
        title: "val, var, and Type Inference",
        order: 1,
        duration: 14,
        isPremium: true,
        language: "kotlin",
        starterCode: `fun main() {
    val r = 3
    val pi = 3
    // TODO: print pi * r * r (integer area of the circle)
    println(0)
}`,
        expectedOutput: "27",
      },
      {
        slug: "basic-types-and-strings",
        title: "Basic Types and String Templates",
        order: 2,
        duration: 14,
        isPremium: true,
        language: "kotlin",
        starterCode: `fun main() {
    val label = "Bytecode"
    val code = 42
    // TODO: println using a string template with label and code
    println("")
}`,
        expectedOutput: "Bytecode:42",
      },
      {
        slug: "if-and-when-expressions",
        title: "if and when as Expressions",
        order: 3,
        duration: 15,
        isPremium: true,
        language: "kotlin",
        starterCode: `fun main() {
    val score = 85
    val grade = when {
        score >= 90 -> "A"
        score >= 80 -> "B"
        score >= 70 -> "C"
        else -> "D"
    }
    println(grade)
}`,
        expectedOutput: "B",
      },
      {
        slug: "ranges-and-iteration",
        title: "Ranges and Iteration",
        order: 4,
        duration: 14,
        isPremium: true,
        language: "kotlin",
        starterCode: `fun main() {
    var sum = 0
    // TODO: add integers 1 through 5 inclusive (use a range in for)
    for (i in 1..5) {
        sum += i
    }
    println(sum)
}`,
        expectedOutput: "15",
      },
    ],
  },
  {
    slug: "module-3",
    title: "Functions and Functional Idioms",
    order: 3,
    isPremium: true,
    lessons: [
      {
        slug: "functions-basics",
        title: "Functions: Defaults, Named Arguments, Unit",
        order: 1,
        duration: 14,
        isPremium: true,
        language: "kotlin",
        starterCode: `fun greet(name: String = "World"): String {
    // TODO: return "Hello, " plus the name (use string template)
    return ""
}

fun main() {
    println(greet())
    println(greet("Kotlin"))
}`,
        expectedOutput: "Hello, World\nHello, Kotlin",
      },
      {
        slug: "lambdas-and-sam",
        title: "Lambdas, SAM, and it",
        order: 2,
        duration: 15,
        isPremium: true,
        language: "kotlin",
        starterCode: `fun main() {
    val nums = listOf(1, 2, 3, 4, 5, 6)
    // TODO: sum only even numbers using filter { it % 2 == 0 } and sum()
    println(0)
}`,
        expectedOutput: "12",
      },
      {
        slug: "inline-noinline-crossinline",
        title: "inline, noinline, and crossinline (Essentials)",
        order: 3,
        duration: 13,
        isPremium: true,
        language: "kotlin",
        starterCode: `fun main() {
    val doubleIt: (Int) -> Int = { it * 2 }
    val nums = listOf(1, 2, 3)
    // TODO: apply doubleIt to each element (map), then print the sum
    println(0)
}`,
        expectedOutput: "12",
      },
      {
        slug: "extension-functions",
        title: "Extension Functions",
        order: 4,
        duration: 16,
        isPremium: true,
        language: "kotlin",
        starterCode: `fun String.wordCount(): Int {
    // TODO: trim, split on whitespace (Regex("\\\\s+")), return size
    return 0
}

fun main() {
    println("one two three".wordCount())
}`,
        expectedOutput: "3",
      },
    ],
  },
  {
    slug: "module-4",
    title: "Classes, Objects, and Core OOP",
    order: 4,
    isPremium: true,
    lessons: [
      {
        slug: "classes-and-constructors",
        title: "Classes and Constructors",
        order: 1,
        duration: 15,
        isPremium: true,
        language: "kotlin",
        starterCode: `class User(val name: String, val id: Int)

fun main() {
    val u = User("Ann", 1)
    println(u.name + ":" + u.id)
}`,
        expectedOutput: "Ann:1",
      },
      {
        slug: "properties-and-custom-accessors",
        title: "Properties and Custom Accessors",
        order: 2,
        duration: 14,
        isPremium: true,
        language: "kotlin",
        starterCode: `class Counter(initial: Int) {
    var value: Int = initial
        private set
    fun inc() {
        value++
    }
}

fun main() {
    val c = Counter(0)
    c.inc()
    c.inc()
    println(c.value)
}`,
        expectedOutput: "2",
      },
      {
        slug: "data-classes",
        title: "Data Classes",
        order: 3,
        duration: 14,
        isPremium: true,
        language: "kotlin",
        starterCode: `data class Point(val x: Int, val y: Int)

fun main() {
    val p = Point(3, 4)
    println(p.copy(y = 0))
}`,
        expectedOutput: "Point(x=3, y=0)",
      },
      {
        slug: "object-singleton-and-companion",
        title: "object, Singleton, and companion",
        order: 4,
        duration: 15,
        isPremium: true,
        language: "kotlin",
        starterCode: `object Hits {
    var count: Int = 0
}

fun main() {
    Hits.count++
    Hits.count++
    println(Hits.count)
}`,
        expectedOutput: "2",
      },
      {
        slug: "sealed-types-intro",
        title: "Sealed Classes and Hierarchies",
        order: 5,
        duration: 16,
        isPremium: true,
        language: "kotlin",
        starterCode: `sealed class Outcome
data class Ok(val value: Int) : Outcome()
data class Err(val message: String) : Outcome()

fun describe(o: Outcome): String = when (o) {
    is Ok -> "ok:" + o.value
    is Err -> "err:" + o.message
}

fun main() {
    println(describe(Ok(7)))
}`,
        expectedOutput: "ok:7",
      },
    ],
  },
  {
    slug: "module-5",
    title: "Null Safety and Pragmatics",
    order: 5,
    isPremium: true,
    lessons: [
      {
        slug: "nullable-types",
        title: "Nullable Types and Safe Calls",
        order: 1,
        duration: 14,
        isPremium: true,
        language: "kotlin",
        starterCode: `fun len(s: String?): Int {
    // TODO: use ?. and ?: so null yields 0
    return -1
}

fun main() {
    println(len(null))
    println(len("hi"))
}`,
        expectedOutput: "0\n2",
      },
      {
        slug: "elvis-and-early-return",
        title: "Elvis, Early Return, and Let",
        order: 2,
        duration: 14,
        isPremium: true,
        language: "kotlin",
        starterCode: `fun firstOrQuestion(s: String?): Char {
    // TODO: first character or '?' if null/empty (firstOrNull and elvis)
    return ' '
}

fun main() {
    println(firstOrQuestion(null))
    println(firstOrQuestion("ab"))
}`,
        expectedOutput: "?\na",
      },
      {
        slug: "lateinit-and-lazy",
        title: "lateinit and lazy",
        order: 3,
        duration: 13,
        isPremium: true,
        language: "kotlin",
        starterCode: `class Host {
    lateinit var name: String
    fun ready() {
        name = "up"
    }
}

fun main() {
    val h = Host()
    h.ready()
    println(h.name)
}`,
        expectedOutput: "up",
      },
      {
        slug: "platform-types-from-java",
        title: "Platform Types from Java APIs",
        order: 4,
        duration: 14,
        isPremium: true,
        language: "kotlin",
        starterCode: `fun maybe(): String? = null

fun main() {
    val x = maybe()
    println(x ?: "default")
}`,
        expectedOutput: "default",
      },
    ],
  },
  {
    slug: "module-6",
    title: "Collections and the Standard Library",
    order: 6,
    isPremium: true,
    lessons: [
      {
        slug: "kotlin-collections-overview",
        title: "Kotlin Collections: Read-Only vs Mutable",
        order: 1,
        duration: 14,
        isPremium: true,
        language: "kotlin",
        starterCode: `fun main() {
    val a = mutableListOf(1, 2)
    a.add(3)
    println(a.sum())
}`,
        expectedOutput: "6",
      },
      {
        slug: "transform-and-filter",
        title: "map, filter, and flatMap",
        order: 2,
        duration: 14,
        isPremium: true,
        language: "kotlin",
        starterCode: `fun main() {
    val words = listOf("a", "bb", "ccc")
    // TODO: print the length of the longest string (maxOf)
    println(0)
}`,
        expectedOutput: "3",
      },
      {
        slug: "group-partition-associate",
        title: "groupBy, partition, associate",
        order: 3,
        duration: 15,
        isPremium: true,
        language: "kotlin",
        starterCode: `fun main() {
    val nums = listOf(1, 2, 3, 4, 5, 6)
    val byParity = nums.groupBy { it % 2 }
    // TODO: print count of even numbers (map entry for key 0)
    println(0)
}`,
        expectedOutput: "3",
      },
      {
        slug: "sequences",
        title: "Sequences: Lazy Pipelines",
        order: 4,
        duration: 14,
        isPremium: true,
        language: "kotlin",
        starterCode: `fun main() {
    val sum = (1..1000).asSequence()
        .filter { it % 2 == 0 }
        .take(3)
        .sum()
    println(sum)
}`,
        expectedOutput: "12",
      },
      {
        slug: "java-collections-interop",
        title: "Java Collections in Kotlin",
        order: 5,
        duration: 14,
        isPremium: true,
        language: "kotlin",
        starterCode: `import java.util.ArrayList

fun main() {
    val j = ArrayList<Int>()
    j.add(1)
    j.add(2)
    val k: List<Int> = j
    println(k.size)
}`,
        expectedOutput: "2",
      },
    ],
  },
  {
    slug: "module-7",
    title: "Java and Kotlin Interoperability",
    order: 7,
    isPremium: true,
    lessons: [
      {
        slug: "calling-java-from-kotlin",
        title: "Calling Java from Kotlin",
        order: 1,
        duration: 15,
        isPremium: true,
        language: "kotlin",
        starterCode: `import java.util.Properties

fun main() {
    val p = Properties()
    p.setProperty("key", "value")
    println(p.getProperty("key"))
}`,
        expectedOutput: "value",
      },
      {
        slug: "calling-kotlin-from-java",
        title: "Calling Kotlin from Java",
        order: 2,
        duration: 15,
        isPremium: true,
        language: "kotlin",
        starterCode: `class Util {
    companion object {
        @JvmStatic
        fun tag(): String = "Kotlin"
    }
}

fun main() {
    println(Util.tag())
}`,
        expectedOutput: "Kotlin",
      },
      {
        slug: "jvm-annotations",
        title: "@JvmName, @JvmOverloads, and Friends",
        order: 3,
        duration: 14,
        isPremium: true,
        language: "kotlin",
        starterCode: `@file:JvmName("BridgeDemo")

fun tag(): String = "ok"

fun main() {
    println(tag())
}`,
        expectedOutput: "ok",
      },
      {
        slug: "modules-and-packages-pitfalls",
        title: "Visibility: internal and Java",
        order: 4,
        duration: 13,
        isPremium: true,
        language: "kotlin",
        starterCode: `internal data class Token(val id: Int)

fun main() {
    println(Token(5).id)
}`,
        expectedOutput: "5",
      },
    ],
  },
  {
    slug: "module-8",
    title: "Bridge Capstone",
    order: 8,
    isPremium: true,
    lessons: [
      {
        slug: "bridge-capstone",
        title: "Capstone: Cart Report",
        order: 1,
        duration: 20,
        isPremium: true,
        language: "kotlin",
        starterCode: `data class Line(val sku: String, val qty: Int)

fun List<Line>.totalUnits(): Int {
    // TODO: sum all qty values (hint: sumOf)
    return 0
}

fun main() {
    val cart = listOf(Line("A", 2), Line("B", 3))
    println(cart.totalUnits())
}`,
        expectedOutput: "5",
      },
    ],
  },
];
