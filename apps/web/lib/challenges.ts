export interface TestCase {
  id: string;
  visible: boolean;
  call: string;
  expected: string;
}

export interface VisibleExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface StaticChallenge {
  id: string;
  title: string;
  difficulty: "easy" | "intermediate" | "hard";
  language: string;
  description: string;
  starterCode: string;
  visibleExamples: VisibleExample[];
  baseXp: number;
  languageId: number;
  preamble: string;
  testCases: TestCase[];
}

export const STATIC_CHALLENGES: StaticChallenge[] = [
  {
    id: "sample-easy-java",
    title: "Reverse a String",
    difficulty: "easy",
    language: "java",
    description: 'Given a string, return it reversed. For example, "hello" becomes "olleh".',
    starterCode:
      'class Solution {\n    public String reverse(String s) {\n        // Your code here\n        return "";\n    }\n}',
    visibleExamples: [
      { input: '"hello"', output: '"olleh"' },
      { input: '"world"', output: '"dlrow"' },
      { input: '"a"', output: '"a"' },
    ],
    baseXp: 10,
    languageId: 62,
    preamble: "",
    testCases: [
      { id: "tc1", visible: true, call: 'new Solution().reverse("hello")', expected: "olleh" },
      { id: "tc2", visible: true, call: 'new Solution().reverse("world")', expected: "dlrow" },
      { id: "tc3", visible: true, call: 'new Solution().reverse("a")', expected: "a" },
      { id: "tc4", visible: false, call: 'new Solution().reverse("")', expected: "" },
      { id: "tc5", visible: false, call: 'new Solution().reverse("racecar")', expected: "racecar" },
      { id: "tc6", visible: false, call: 'new Solution().reverse("abcde")', expected: "edcba" },
    ],
  },
  {
    id: "sample-intermediate-java",
    title: "Fibonacci Number",
    difficulty: "intermediate",
    language: "java",
    description:
      "Return the nth Fibonacci number (0-indexed). fib(0)=0, fib(1)=1, fib(2)=1, fib(3)=2, etc.",
    starterCode:
      "class Solution {\n    public int fib(int n) {\n        // Your code here\n        return 0;\n    }\n}",
    visibleExamples: [
      { input: "0", output: "0" },
      { input: "1", output: "1" },
      { input: "5", output: "5", explanation: "0,1,1,2,3,5" },
    ],
    baseXp: 15,
    languageId: 62,
    preamble: "",
    testCases: [
      { id: "tc1", visible: true, call: "new Solution().fib(0)", expected: "0" },
      { id: "tc2", visible: true, call: "new Solution().fib(1)", expected: "1" },
      { id: "tc3", visible: true, call: "new Solution().fib(5)", expected: "5" },
      { id: "tc4", visible: false, call: "new Solution().fib(2)", expected: "1" },
      { id: "tc5", visible: false, call: "new Solution().fib(10)", expected: "55" },
      { id: "tc6", visible: false, call: "new Solution().fib(15)", expected: "610" },
    ],
  },
  {
    id: "sample-hard-java",
    title: "Valid Parentheses",
    difficulty: "hard",
    language: "java",
    description:
      "Given a string of '(', ')', '{', '}', '[', ']', return true if every opener is closed in the correct order.",
    starterCode:
      "import java.util.Stack;\n\nclass Solution {\n    public boolean isValid(String s) {\n        // Your code here\n        return false;\n    }\n}",
    visibleExamples: [
      { input: '"()"', output: "true" },
      { input: '"()[{}]"', output: "true" },
      { input: '"(]"', output: "false" },
      { input: '"([)]"', output: "false" },
    ],
    baseXp: 25,
    languageId: 62,
    preamble: "import java.util.Stack;",
    testCases: [
      { id: "tc1", visible: true, call: 'new Solution().isValid("()")', expected: "true" },
      { id: "tc2", visible: true, call: 'new Solution().isValid("()[{}]")', expected: "true" },
      { id: "tc3", visible: true, call: 'new Solution().isValid("(]")', expected: "false" },
      { id: "tc4", visible: true, call: 'new Solution().isValid("([)]")', expected: "false" },
      { id: "tc5", visible: false, call: 'new Solution().isValid("")', expected: "true" },
      { id: "tc6", visible: false, call: 'new Solution().isValid("{[]}")', expected: "true" },
      { id: "tc7", visible: false, call: 'new Solution().isValid("((")', expected: "false" },
    ],
  },
];

export function getStaticChallenge(id: string): StaticChallenge | undefined {
  return STATIC_CHALLENGES.find((c) => c.id === id);
}

export function toApiDto(c: StaticChallenge) {
  return {
    id: c.id,
    title: c.title,
    difficulty: c.difficulty,
    language: c.language,
    description: c.description,
    starterCode: c.starterCode,
    visibleExamples: c.visibleExamples,
    baseXp: c.baseXp,
    releaseDate: new Date().toISOString().slice(0, 10),
  };
}

export function getStaticDaily() {
  return {
    easy: toApiDto(STATIC_CHALLENGES.find((c) => c.difficulty === "easy")!),
    intermediate: toApiDto(STATIC_CHALLENGES.find((c) => c.difficulty === "intermediate")!),
    hard: toApiDto(STATIC_CHALLENGES.find((c) => c.difficulty === "hard")!),
  };
}
