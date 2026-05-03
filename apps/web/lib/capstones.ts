import {
  SENTINEL,
  CAPSTONE_STARTER_CODE as BEGINNER_M1_STARTER,
  TEST_HARNESS as BEGINNER_M1_HARNESS,
  TOTAL_TESTS as BEGINNER_M1_TOTAL,
  HINTS as BEGINNER_M1_HINTS,
  REFERENCE_SOLUTION as BEGINNER_M1_REF,
} from "./capstone";

import {
  SENTINEL as INTERMEDIATE_M4_SENTINEL,
  CAPSTONE_STARTER_CODE as INTERMEDIATE_M4_STARTER,
  TEST_HARNESS as INTERMEDIATE_M4_HARNESS,
  TOTAL_TESTS as INTERMEDIATE_M4_TOTAL,
  HINTS as INTERMEDIATE_M4_HINTS,
  REFERENCE_SOLUTION as INTERMEDIATE_M4_REF,
} from "./capstone-intermediate-m4";

export type { GradeResult, TestResult } from "./capstone";
export { parseGradeOutput } from "./capstone";

export interface CapstoneMethod {
  signature: string;
  description: string;
}

export interface CapstoneMeta {
  id: string;
  trackSlug: string;
  moduleSlug: string;
  title: string;
  duration: string;
  sentinel: string;
  testHarness: string;
  totalTests: number;
  starterCode: string;
  hints: string[];
  referenceSolution: string;
  description: string;
  methods: CapstoneMethod[];
  whyBullets: string[];
  badgeTitle: string;
  badgeSubtitle: string;
}

const REGISTRY: CapstoneMeta[] = [
  {
    id: "capstone-java-beginner-1",
    trackSlug: "java-beginner",
    moduleSlug: "module-1",
    title: "Number Guessing Game",
    duration: "~30 min",
    sentinel: SENTINEL,
    testHarness: BEGINNER_M1_HARNESS,
    totalTests: BEGINNER_M1_TOTAL,
    starterCode: BEGINNER_M1_STARTER,
    hints: BEGINNER_M1_HINTS,
    referenceSolution: BEGINNER_M1_REF,
    description: "A classic number guessing game engine. You'll write two static methods:",
    methods: [
      {
        signature: "getHint(int guess, int secret)",
        description: 'Returns "Too low!", "Too high!", or "Correct!" based on how the guess compares to the secret.',
      },
      {
        signature: "countGuesses(int[] guesses, int secret)",
        description: "Returns the 1-indexed position of the first guess that equals the secret, or -1 if never found.",
      },
    ],
    whyBullets: [
      "Methods with parameters and return values",
      "Conditionals to decide the hint",
      "Loops to walk the array of guesses",
      "Arrays as method inputs",
      "Strings as return values",
    ],
    badgeTitle: "Java Beginner — Module 1 Mastery",
    badgeSubtitle: "Badge · Certificate · Unlocks Module 2",
  },
  {
    id: "capstone-java-intermediate-4",
    trackSlug: "java-intermediate",
    moduleSlug: "module-4",
    title: "Inventory System",
    duration: "~40 min",
    sentinel: INTERMEDIATE_M4_SENTINEL,
    testHarness: INTERMEDIATE_M4_HARNESS,
    totalTests: INTERMEDIATE_M4_TOTAL,
    starterCode: INTERMEDIATE_M4_STARTER,
    hints: INTERMEDIATE_M4_HINTS,
    referenceSolution: INTERMEDIATE_M4_REF,
    description:
      "Build an in-memory inventory manager backed by a HashMap. You'll implement four instance methods on a provided skeleton class:",
    methods: [
      {
        signature: "addItem(String name, double price, int quantity)",
        description: "Adds a new item or replaces price and quantity if an item with that name already exists.",
      },
      {
        signature: "removeItem(String name)",
        description: "Removes the item by name. Returns true if removed, false if not found.",
      },
      {
        signature: "getMostExpensive()",
        description: "Returns the name of the highest-priced item, or null if the inventory is empty.",
      },
      {
        signature: "getTotalValue()",
        description: "Returns total inventory value — sum of (price × quantity) for every item. Returns 0.0 if empty.",
      },
    ],
    whyBullets: [
      "HashMap for O(1) add, remove, and lookup by name",
      "Iterating a Map's entry set with for-each",
      "Tracking a running maximum across all entries",
      "Accumulating a running sum across all entries",
      "Handling the empty-collection edge case correctly",
    ],
    badgeTitle: "Java Intermediate — Module 4 Mastery",
    badgeSubtitle: "Badge · Certificate · Unlocks Module 5",
  },
];

export function getCapstone(id: string): CapstoneMeta | undefined {
  return REGISTRY.find((c) => c.id === id);
}

export function getCapstoneForModule(
  trackSlug: string,
  moduleSlug: string
): CapstoneMeta | undefined {
  return REGISTRY.find(
    (c) => c.trackSlug === trackSlug && c.moduleSlug === moduleSlug
  );
}
