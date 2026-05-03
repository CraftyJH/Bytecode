export interface TestResult {
  name: string;
  passed: boolean;
  expected?: string;
  got?: string;
}

export interface GradeResult {
  results: TestResult[];
  passed: number;
  total: number;
  allPassed: boolean;
  compileError?: string;
}

// Marker that splits student methods from the demo main — must match the starter code exactly
export const SENTINEL = "// ── DO NOT MODIFY BELOW THIS LINE ──";

export const CAPSTONE_STARTER_CODE = `public class Main {

    /**
     * Returns a hint based on how the guess compares to the secret.
     *   guess < secret  →  "Too low!"
     *   guess > secret  →  "Too high!"
     *   guess == secret →  "Correct!"
     */
    public static String getHint(int guess, int secret) {
        // Your code here
        return "";
    }

    /**
     * Walks through the guesses array and returns the 1-indexed position
     * of the first guess that equals the secret. Returns -1 if not found.
     *
     *   countGuesses(new int[]{50, 80, 70, 73}, 73)  →  4
     *   countGuesses(new int[]{50, 80, 70},     73)  →  -1
     *   countGuesses(new int[]{73},             73)  →  1
     */
    public static int countGuesses(int[] guesses, int secret) {
        // Your code here
        return -1;
    }

    // ── DO NOT MODIFY BELOW THIS LINE ──────────────────────────
    public static void main(String[] args) {
        // Quick demo — click Run to verify your methods before submitting:
        System.out.println(getHint(42, 73));                               // Too low!
        System.out.println(getHint(90, 73));                               // Too high!
        System.out.println(getHint(73, 73));                               // Correct!
        System.out.println(countGuesses(new int[]{50, 80, 70, 73}, 73));  // 4
        System.out.println(countGuesses(new int[]{50, 80, 70}, 73));      // -1
    }
}`;

// Injected in place of the sentinel block when grading — replaces the demo main with the full test runner
export const TEST_HARNESS = `    // ── AUTO-GRADER ─────────────────────────────────────────────
    public static void main(String[] args) {
        int pass = 0;
        pass += check("getHint: guess too low",    "Too low!",  getHint(42, 73));
        pass += check("getHint: guess too high",   "Too high!", getHint(90, 73));
        pass += check("getHint: exact match",      "Correct!",  getHint(73, 73));
        pass += check("getHint: one off (low)",    "Too low!",  getHint(72, 73));
        pass += check("getHint: one off (high)",   "Too high!", getHint(74, 73));
        pass += check("getHint: edge at 1",        "Correct!",  getHint(1, 1));
        pass += check("getHint: edge at 100",      "Correct!",  getHint(100, 100));
        pass += checkI("countGuesses: found at end",          4,  countGuesses(new int[]{50,80,70,73}, 73));
        pass += checkI("countGuesses: never found",          -1,  countGuesses(new int[]{50,80,70}, 73));
        pass += checkI("countGuesses: first guess",           1,  countGuesses(new int[]{73}, 73));
        pass += checkI("countGuesses: found in middle",       3,  countGuesses(new int[]{10,50,73,90,100}, 73));
        pass += checkI("countGuesses: empty array",          -1,  countGuesses(new int[]{}, 73));
        pass += checkI("countGuesses: multiple occurrences",  2,  countGuesses(new int[]{50,73,80,73}, 73));
        pass += checkI("countGuesses: only wrong guesses",   -1,  countGuesses(new int[]{1,2,3,4,5}, 73));
        System.out.println("---");
        System.out.println("SCORE:" + pass + "/14");
    }
    static int check(String name, String e, String a) {
        boolean ok = e.equals(a);
        System.out.println((ok?"PASS":"FAIL") + ":" + name + (ok?"":"|expected:"+e+"|got:"+a));
        return ok ? 1 : 0;
    }
    static int checkI(String name, int e, int a) {
        boolean ok = e == a;
        System.out.println((ok?"PASS":"FAIL") + ":" + name + (ok?"":"|expected:"+e+"|got:"+a));
        return ok ? 1 : 0;
    }
}`;

export const TOTAL_TESTS = 14;

export const HINTS = [
  "Both methods are about *comparing values*. For `getHint`, compare `guess` to `secret` using `<`, `>`, and `==`. For `countGuesses`, you'll need to walk the array and check each element.",
  "For `getHint`, you have three cases — use `if/else if/else`. For `countGuesses`, a classic `for` loop with the index works well, because you need to return the 1-indexed position.",
  "For `countGuesses`, return as soon as you find a match — don't keep looping. If you reach the end without returning, that means the secret wasn't found: return `-1` after the loop.",
  "Watch the \"first guess\" test: `countGuesses(new int[]{73}, 73)` should return `1`, not `0`. Position is 1-indexed but Java arrays are 0-indexed — return `i + 1`, not `i`.",
  "Empty array edge case: if `guesses.length == 0`, the loop body never runs, so the function falls through to whatever comes after the loop. Make sure that's `return -1;`.",
];

export const REFERENCE_SOLUTION = `public static String getHint(int guess, int secret) {
    if (guess < secret) return "Too low!";
    if (guess > secret) return "Too high!";
    return "Correct!";
}

public static int countGuesses(int[] guesses, int secret) {
    for (int i = 0; i < guesses.length; i++) {
        if (guesses[i] == secret) {
            return i + 1;
        }
    }
    return -1;
}`;

/** Parse Judge0 stdout into structured test results */
export function parseGradeOutput(stdout: string, totalTests?: number): GradeResult {
  const total = totalTests ?? TOTAL_TESTS;
  const lines = stdout.trim().split("\n");
  const results: TestResult[] = [];
  let passed = 0;

  for (const line of lines) {
    if (line.startsWith("PASS:")) {
      const name = line.slice(5);
      results.push({ name, passed: true });
      passed++;
    } else if (line.startsWith("FAIL:")) {
      const rest = line.slice(5);
      const [name, ...parts] = rest.split("|");
      const expectedPart = parts.find((p) => p.startsWith("expected:"));
      const gotPart = parts.find((p) => p.startsWith("got:"));
      results.push({
        name,
        passed: false,
        expected: expectedPart?.slice(9),
        got: gotPart?.slice(4),
      });
    }
  }

  return {
    results,
    passed,
    total,
    allPassed: passed === total,
  };
}
