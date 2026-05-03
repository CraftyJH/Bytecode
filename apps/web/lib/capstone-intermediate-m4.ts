export const SENTINEL = "// ── DO NOT MODIFY BELOW THIS LINE ──";

export const CAPSTONE_STARTER_CODE = `import java.util.HashMap;

public class Main {

    static class Item {
        String name;
        double price;
        int quantity;

        Item(String name, double price, int quantity) {
            this.name     = name;
            this.price    = price;
            this.quantity = quantity;
        }
    }

    private HashMap<String, Item> items = new HashMap<>();

    /**
     * Adds an item to the inventory.  If an item with the same name already
     * exists, replace its price and quantity with the new values.
     */
    public void addItem(String name, double price, int quantity) {
        // Your code here
    }

    /**
     * Removes the item with the given name from the inventory.
     * Returns true if the item was found and removed, false otherwise.
     */
    public boolean removeItem(String name) {
        // Your code here
        return false;
    }

    /**
     * Returns the name of the item with the highest unit price.
     * Returns null if the inventory is empty.
     * If two items share the maximum price, returning either name is acceptable.
     */
    public String getMostExpensive() {
        // Your code here
        return null;
    }

    /**
     * Returns the total inventory value: sum of (price × quantity) for every item.
     * Returns 0.0 if the inventory is empty.
     */
    public double getTotalValue() {
        // Your code here
        return 0.0;
    }

    // ── DO NOT MODIFY BELOW THIS LINE ──
    public static void main(String[] args) {
        Main inv = new Main();
        inv.addItem("Apple",  0.50, 100);
        inv.addItem("Laptop", 999.99,  5);
        inv.addItem("Pen",    1.25,  200);

        System.out.println(inv.getMostExpensive());        // Laptop
        System.out.printf("%.2f%n", inv.getTotalValue());  // 5299.95
        System.out.println(inv.removeItem("Pen"));         // true
        System.out.println(inv.removeItem("Desk"));        // false
        System.out.printf("%.2f%n", inv.getTotalValue());  // 5049.95
    }
}`;

export const TEST_HARNESS = `    // ── AUTO-GRADER ─────────────────────────────────────────────
    public static void main(String[] args) {
        int pass = 0;

        // 1 ─ getMostExpensive: single item
        { Main inv = new Main(); inv.addItem("Laptop", 999.99, 5);
          pass += check("getMostExpensive: single item", "Laptop", inv.getMostExpensive()); }

        // 2 ─ getTotalValue: single item  (999.99 × 5 = 4999.95)
        { Main inv = new Main(); inv.addItem("Laptop", 999.99, 5);
          pass += checkD("getTotalValue: single item", 4999.95, inv.getTotalValue()); }

        // 3 ─ getMostExpensive: three items, highest priced wins
        { Main inv = new Main();
          inv.addItem("Apple", 0.50, 100); inv.addItem("Laptop", 999.99, 5); inv.addItem("Pen", 1.25, 200);
          pass += check("getMostExpensive: three items", "Laptop", inv.getMostExpensive()); }

        // 4 ─ getTotalValue: three items  (50.00 + 4999.95 + 250.00 = 5299.95)
        { Main inv = new Main();
          inv.addItem("Apple", 0.50, 100); inv.addItem("Laptop", 999.99, 5); inv.addItem("Pen", 1.25, 200);
          pass += checkD("getTotalValue: three items", 5299.95, inv.getTotalValue()); }

        // 5 ─ removeItem: existing item returns true
        { Main inv = new Main(); inv.addItem("Pen", 1.25, 200);
          pass += checkB("removeItem: existing item", true, inv.removeItem("Pen")); }

        // 6 ─ removeItem: missing item returns false
        { Main inv = new Main();
          pass += checkB("removeItem: non-existent item", false, inv.removeItem("Desk")); }

        // 7 ─ getMostExpensive: empty inventory returns null
        { Main inv = new Main();
          pass += checkNull("getMostExpensive: empty inventory", inv.getMostExpensive()); }

        // 8 ─ getTotalValue: empty inventory returns 0.0
        { Main inv = new Main();
          pass += checkD("getTotalValue: empty inventory", 0.0, inv.getTotalValue()); }

        // 9 ─ addItem: duplicate name overwrites; Widget($10,5)→Widget($12,8) → 96.00
        { Main inv = new Main();
          inv.addItem("Widget", 10.00, 5); inv.addItem("Widget", 12.00, 8);
          pass += checkD("addItem: duplicate updates value", 96.00, inv.getTotalValue()); }

        // 10 ─ getTotalValue recalculates after removeItem
        { Main inv = new Main();
          inv.addItem("Apple", 0.50, 100); inv.addItem("Laptop", 999.99, 5);
          inv.removeItem("Apple");
          pass += checkD("getTotalValue: after remove", 4999.95, inv.getTotalValue()); }

        // 11 ─ getMostExpensive updates after removing the current max
        { Main inv = new Main();
          inv.addItem("Apple", 0.50, 100); inv.addItem("Laptop", 999.99, 5);
          inv.removeItem("Laptop");
          pass += check("getMostExpensive: after removing max", "Apple", inv.getMostExpensive()); }

        // 12 ─ complex: add 3, remove 1, getMostExpensive of remainder
        { Main inv = new Main();
          inv.addItem("Book", 25.00, 10); inv.addItem("Chair", 150.00, 4); inv.addItem("Mug", 8.00, 20);
          inv.removeItem("Mug");
          pass += check("complex: getMostExpensive after remove", "Chair", inv.getMostExpensive()); }

        System.out.println("---");
        System.out.println("SCORE:" + pass + "/12");
    }
    static int check(String name, String e, String a) {
        String got = (a == null) ? "null" : a;
        boolean ok = e.equals(got);
        System.out.println((ok ? "PASS" : "FAIL") + ":" + name + (ok ? "" : "|expected:" + e + "|got:" + got));
        return ok ? 1 : 0;
    }
    static int checkD(String name, double e, double a) {
        boolean ok = Math.abs(e - a) < 0.001;
        String es = String.format("%.2f", e);
        String as = String.format("%.2f", a);
        System.out.println((ok ? "PASS" : "FAIL") + ":" + name + (ok ? "" : "|expected:" + es + "|got:" + as));
        return ok ? 1 : 0;
    }
    static int checkB(String name, boolean e, boolean a) {
        boolean ok = e == a;
        System.out.println((ok ? "PASS" : "FAIL") + ":" + name + (ok ? "" : "|expected:" + e + "|got:" + a));
        return ok ? 1 : 0;
    }
    static int checkNull(String name, String a) {
        boolean ok = a == null;
        System.out.println((ok ? "PASS" : "FAIL") + ":" + name + (ok ? "" : "|expected:null|got:" + a));
        return ok ? 1 : 0;
    }
}`;

export const TOTAL_TESTS = 12;

export const HINTS = [
  "All four methods work with the `items` HashMap. `addItem` uses `put` (which replaces if the key exists); `removeItem` uses `remove` (returns the old value or `null`); `getMostExpensive` and `getTotalValue` both iterate with `for (Item item : items.values())`.",
  "For `addItem`, a single `items.put(name, new Item(name, price, quantity))` handles both the \"add\" and the \"update\" case — `HashMap.put` replaces an existing entry when the key matches.",
  "For `removeItem`, call `items.remove(name)`. It returns the value that was removed, or `null` if the key wasn't in the map. Compare the return value to `null` to decide what boolean to return.",
  "For `getMostExpensive`, keep a local `String bestName = null; double bestPrice = Double.NEGATIVE_INFINITY;` and update them inside the loop whenever `item.price > bestPrice`. Return `bestName` — it stays `null` if the map is empty.",
  "For `getTotalValue`, declare `double total = 0.0;` before the loop and accumulate `total += item.price * item.quantity;`. Returning `total` after an empty loop naturally gives `0.0`, so no special empty-check is needed.",
];

export const REFERENCE_SOLUTION = `public void addItem(String name, double price, int quantity) {
    items.put(name, new Item(name, price, quantity));
}

public boolean removeItem(String name) {
    return items.remove(name) != null;
}

public String getMostExpensive() {
    String best = null;
    double max = Double.NEGATIVE_INFINITY;
    for (Item item : items.values()) {
        if (item.price > max) {
            max = item.price;
            best = item.name;
        }
    }
    return best;
}

public double getTotalValue() {
    double total = 0.0;
    for (Item item : items.values()) {
        total += item.price * item.quantity;
    }
    return total;
}`;
