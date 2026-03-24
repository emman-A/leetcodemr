#!/usr/bin/env python3
"""
Audit and fix starter_python fields in questions_full.json.

Rules:
1. Design questions (non-Solution standalone class at top level) must NOT be wrapped in Solution.
   They need a '# ── Test ──' section with commented example usage.
2. Regular questions must have 'class Solution:' wrapping, and a '# ── Examples ──' section
   with real _check() calls parsed from description.
3. Fix cases where 'class Solution' wrongly wraps a design class.
"""

import json
import re
import textwrap
from pathlib import Path

FILE = Path("/Users/oppongemmanuel/code/leetcodemr/public/questions_full.json")

# ── helpers ──────────────────────────────────────────────────────────────────

CHECK_HELPER = """\
# ── Examples ──
def _check(label, got, expected):
    g, e = str(got).replace(" ", ""), str(expected).replace(" ", "")
    if g == e: print(f"✅ {label}: PASS (output: {got})")
    else: print(f"❌ {label}: FAIL\\n   expected: {expected}\\n   got:      {got}")
"""

def top_level_classes(code: str) -> list[str]:
    """Return names of all classes defined at the top level (no leading whitespace)."""
    names = []
    for line in code.splitlines():
        m = re.match(r'^class\s+(\w+)', line)
        if m:
            names.append(m.group(1))
    return names


def is_design_question(code: str) -> bool:
    """True if there's a top-level class that is NOT Solution."""
    return any(c != "Solution" for c in top_level_classes(code))


def get_primary_design_class(code: str) -> str | None:
    """Return the first non-Solution top-level class name."""
    for c in top_level_classes(code):
        if c != "Solution":
            return c
    return None


def strip_existing_test_section(code: str) -> str:
    """Remove any existing '# ── Examples ──' or '# ── Test ──' section and everything after."""
    # Find the marker line
    for marker in ["# ── Examples ──", "# ── Test ──", "# ──Examples──", "# ──Test──"]:
        idx = code.find(marker)
        if idx != -1:
            return code[:idx].rstrip()
    # Also strip standalone sol = Solution() lines and _check lines that are bare
    lines = code.splitlines()
    cut = len(lines)
    for i, line in enumerate(lines):
        stripped = line.strip()
        if (stripped.startswith("sol = Solution()") or
            stripped.startswith("_check(") or
            stripped.startswith("def _check(") or
            stripped.startswith("print(f\"Example") or
            stripped.startswith("# obj") or
            stripped.startswith("obj =")):
            cut = i
            break
    return "\n".join(lines[:cut]).rstrip()


# ── Description parsing ──────────────────────────────────────────────────────

def parse_examples_from_description(desc: str) -> list[dict]:
    """
    Parse Input/Output examples from LeetCode-style description text.
    Returns list of {"label": str, "input": str, "output": str}.
    """
    examples = []

    # Pattern: "Example N:" followed by Input/Output blocks
    # The description text uses literal newlines
    # Split by "Example N:" markers
    example_blocks = re.split(r'Example\s+(\d+)\s*:', desc)
    # example_blocks[0] = text before first example
    # example_blocks[1] = "1", example_blocks[2] = block text, ...

    i = 1
    while i < len(example_blocks) - 1:
        num = example_blocks[i]
        block = example_blocks[i + 1]
        i += 2

        # Extract Input line
        inp_m = re.search(r'Input\s*\n+(.*?)(?:\n+Output|\Z)', block, re.DOTALL)
        out_m = re.search(r'Output\s*\n+(.*?)(?:\n+Explanation|\n+Example|\n+Constraints|\Z)', block, re.DOTALL)

        if inp_m and out_m:
            inp_raw = inp_m.group(1).strip()
            out_raw = out_m.group(1).strip()
            examples.append({
                "label": f"Example {num}",
                "input": inp_raw,
                "output": out_raw,
            })

    return examples


def format_value(raw: str) -> str:
    """
    Turn a raw description value string into a Python literal for _check calls.
    Handles common patterns like [1,2,3], "string", true/false/null, numbers.
    """
    raw = raw.strip()
    # Multi-line: join all lines
    raw = " ".join(raw.split())

    # Replace JSON booleans/null
    raw = re.sub(r'\bnull\b', 'None', raw)
    raw = re.sub(r'\btrue\b', 'True', raw)
    raw = re.sub(r'\bfalse\b', 'False', raw)

    # If it starts with [ or { or " or a digit or - it's likely a valid literal
    return raw


def build_check_call(label: str, method_call: str, output_raw: str) -> str:
    expected = format_value(output_raw)
    return f'_check("{label}", {method_call}, {expected})'


def get_method_name(code: str) -> str | None:
    """Get the first method inside class Solution."""
    in_solution = False
    for line in code.splitlines():
        if re.match(r'^class\s+Solution', line):
            in_solution = True
            continue
        if in_solution:
            m = re.match(r'    def\s+(\w+)\s*\(self', line)
            if m and m.group(1) != '__init__':
                return m.group(1)
    return None


def get_method_params(code: str, method_name: str) -> list[str]:
    """Return parameter names (excluding self) for the given method in Solution."""
    for line in code.splitlines():
        m = re.match(rf'\s+def\s+{re.escape(method_name)}\s*\((.*?)\)', line)
        if m:
            params = [p.strip().split(':')[0].strip().split('=')[0].strip()
                      for p in m.group(1).split(',')]
            params = [p for p in params if p and p != 'self']
            return params
    return []


def build_regular_test_section(code: str, desc: str, q_id: int, title: str) -> str:
    """Build the _check test section for a regular (non-design) question."""
    method = get_method_name(code)
    examples = parse_examples_from_description(desc)

    lines = [CHECK_HELPER, "sol = Solution()"]

    if not examples or not method:
        lines.append(f'# TODO: Add _check examples for {title}')
        return "\n".join(lines)

    for ex in examples:
        inp = format_value(ex["input"])
        out = format_value(ex["output"])
        label = ex["label"]

        # Try to figure out the call
        # inp might be "nums = [2,7,11,15], target = 9"
        # or just "[2,7,11,15]\n9"
        # Build: sol.method(arg1, arg2)
        params = get_method_params(code, method)

        # Try named-param style: "param = value, param2 = value2"
        named = re.findall(r'(\w+)\s*=\s*(.+?)(?:,\s*\w+\s*=|\Z)', inp)
        if named and len(named) >= 1:
            # Check if param names match
            named_names = [n[0] for n in named]
            if set(named_names) & set(params):
                # Use positional order matching params
                arg_map = {}
                # Re-parse more carefully
                # Pattern: word = value (value can be complex)
                matches = list(re.finditer(r'(\w+)\s*=\s*', inp))
                args_ordered = []
                for idx2, match in enumerate(matches):
                    start = match.end()
                    end = matches[idx2 + 1].start() if idx2 + 1 < len(matches) else len(inp)
                    val = inp[start:end].rstrip(', ')
                    arg_map[match.group(1)] = val.strip()
                arg_vals = [format_value(arg_map.get(p, '?')) for p in params if p in arg_map]
                if not arg_vals:
                    arg_vals = [format_value(v) for _, v in named]
                call = f"sol.{method}({', '.join(arg_vals)})"
            else:
                # Just pass inp as-is if it's a single value
                call = f"sol.{method}({format_value(inp)})"
        else:
            # Multiple lines or no named params — treat as positional args separated by newlines
            parts = [p.strip() for p in inp.split('\n') if p.strip()]
            if len(parts) == 1:
                call = f"sol.{method}({format_value(parts[0])})"
            else:
                args = ", ".join(format_value(p) for p in parts)
                call = f"sol.{method}({args})"

        lines.append(build_check_call(label, call, out))

    return "\n".join(lines)


# ── Design question helpers ───────────────────────────────────────────────────

def parse_design_examples(desc: str, class_name: str) -> list[str]:
    """
    Parse the design-question example (op list + args list) and return
    a list of commented Python lines showing usage.
    """
    # Look for Input section with ["ClassName", "method", ...] pattern
    inp_m = re.search(
        r'Input\s*\n+\["' + re.escape(class_name) + r'"[^\]]*\]\s*\n+(\[.*?\])',
        desc, re.DOTALL
    )
    # Alternative: just find an Input block that has the class name
    if not inp_m:
        inp_m = re.search(
            r'Input\s*\n+(.*?)(?:\n+Output)', desc, re.DOTALL
        )

    out_m = re.search(r'Output\s*\n+(.*?)(?:\n+Explanation|\n+Example|\n+Constraints|\Z)', desc, re.DOTALL)

    if not inp_m:
        return []

    inp_text = inp_m.group(1).strip() if inp_m.lastindex else inp_m.group(0)
    out_text = out_m.group(1).strip() if out_m else ""

    # Try to parse the two lines (ops list, args list)
    lines_raw = [l.strip() for l in inp_text.strip().splitlines() if l.strip()]

    ops = None
    args = None
    for line in lines_raw:
        if re.match(r'^\[.*\]$', line):
            try:
                parsed = eval(line.replace('null', 'None').replace('true', 'True').replace('false', 'False'))
                if isinstance(parsed, list):
                    if ops is None:
                        ops = parsed
                    elif args is None:
                        args = parsed
            except Exception:
                pass

    if ops is None or args is None:
        return []

    # Get output list
    outputs = []
    if out_text:
        try:
            outputs = eval(out_text.replace('null', 'None').replace('true', 'True').replace('false', 'False'))
        except Exception:
            outputs = []

    result_lines = []
    for i, (op, arg) in enumerate(zip(ops, args)):
        expected = outputs[i] if i < len(outputs) else None
        arg_str = ", ".join(repr(a) for a in arg) if isinstance(arg, list) else repr(arg)

        if op == class_name:
            result_lines.append(f"obj = {class_name}({arg_str})")
        else:
            if expected is not None and expected != "null":
                exp_repr = repr(expected)
                result_lines.append(f"# obj.{op}({arg_str})  # Expected: {exp_repr}")
            else:
                result_lines.append(f"# obj.{op}({arg_str})")

    return result_lines


def build_design_test_section(code: str, desc: str, class_name: str) -> str:
    """Build the commented test section for a design question."""
    comment_lines = parse_design_examples(desc, class_name)

    lines = ["# ── Test ──"]
    if comment_lines:
        lines.extend(comment_lines)
    else:
        lines.append(f"obj = {class_name}()")
        lines.append(f"# Call methods on obj based on the examples in the description")

    return "\n".join(lines)


# ── Core fix logic ────────────────────────────────────────────────────────────

def fix_regular_question(code: str, desc: str, q_id: int, title: str) -> tuple[str, list[str]]:
    """Fix a regular question's starter code. Returns (fixed_code, changes)."""
    changes = []
    original = code

    # Step 1: Ensure class Solution wraps the method
    tl_classes = top_level_classes(code)
    if 'Solution' not in tl_classes:
        # Check if there's a bare def at top level
        lines = code.splitlines()
        new_lines = []
        imports = []
        bare_defs_start = None
        i = 0
        while i < len(lines):
            line = lines[i]
            if line.startswith('from ') or line.startswith('import '):
                imports.append(line)
            elif re.match(r'^def\s+', line):
                bare_defs_start = i
                break
            else:
                new_lines.append(line)
            i += 1

        if bare_defs_start is not None:
            remaining = lines[bare_defs_start:]
            # Wrap in class Solution
            indented = ["class Solution:"] + ["    " + l for l in remaining]
            code = "\n".join(imports) + "\n\n" + "\n".join(indented)
            changes.append("Wrapped bare function in class Solution")

    # Step 2: Strip existing test section
    code_stripped = strip_existing_test_section(code)

    # Step 3: Check if _check is already there or if sol = Solution() exists
    if '_check(' in code_stripped:
        # Already has it inline, just ensure helper is there
        pass

    # Step 4: Build new test section
    test_section = build_regular_test_section(code_stripped, desc, q_id, title)

    fixed = code_stripped + "\n\n" + test_section + "\n"

    if fixed.strip() != original.strip():
        if '_check(' not in original:
            changes.append("Added _check test section")
        elif test_section not in original:
            changes.append("Updated/normalized test section")

    return fixed, changes


def fix_design_question(code: str, desc: str, class_name: str) -> tuple[str, list[str]]:
    """Fix a design question's starter code. Returns (fixed_code, changes)."""
    changes = []
    original = code

    # Step 1: Remove Solution wrapper if design class is inside it
    tl_classes = top_level_classes(code)
    if 'Solution' in tl_classes and class_name in tl_classes:
        # Both exist at top level - Solution wraps something? Or they're siblings?
        # Check if the design class is inside Solution
        in_solution = False
        solution_content = []
        rest = []
        code_lines = code.splitlines()
        for line in code_lines:
            if re.match(r'^class\s+Solution', line):
                in_solution = True
                continue
            if in_solution and re.match(r'^class\s+', line):
                in_solution = False
            if in_solution:
                solution_content.append(line)
            else:
                rest.append(line)

        # They're actually siblings at top level - need to remove Solution class
        # that shouldn't be there
        new_lines = []
        skip_solution = False
        i = 0
        code_lines2 = code.splitlines()
        while i < len(code_lines2):
            line = code_lines2[i]
            if re.match(r'^class\s+Solution\s*:', line):
                skip_solution = True
                # Collect indented content and de-indent it
                i += 1
                while i < len(code_lines2):
                    inner = code_lines2[i]
                    if inner == '' or inner.startswith('    '):
                        if inner.startswith('    '):
                            new_lines.append(inner[4:])
                        else:
                            new_lines.append(inner)
                        i += 1
                    else:
                        break
                skip_solution = False
                continue
            new_lines.append(line)
            i += 1

        code = "\n".join(new_lines)
        changes.append(f"Removed Solution wrapper from design question (class {class_name})")

    # Step 2: Strip existing test section
    code_stripped = strip_existing_test_section(code)

    # Step 3: Build design test section
    test_section = build_design_test_section(code_stripped, desc, class_name)

    fixed = code_stripped + "\n\n" + test_section + "\n"

    if fixed.strip() != original.strip():
        if '# ── Test ──' not in original:
            changes.append("Added commented test section")
        else:
            changes.append("Updated test section")

    return fixed, changes


def fix_question(q: dict) -> tuple[dict, list[str]]:
    """Fix a single question dict. Returns (updated_q, list_of_changes)."""
    code = q.get('starter_python', '') or ''
    desc = q.get('description', '') or ''
    q_id = q['id']
    title = q.get('title', f'Q{q_id}')

    if not code.strip():
        return q, ["SKIP: empty starter"]

    all_changes = []

    if is_design_question(code):
        class_name = get_primary_design_class(code)
        fixed_code, changes = fix_design_question(code, desc, class_name)
        all_changes.extend(changes)
    else:
        fixed_code, changes = fix_regular_question(code, desc, q_id, title)
        all_changes.extend(changes)

    q2 = dict(q)
    q2['starter_python'] = fixed_code
    return q2, all_changes


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print("=" * 70)
    print("AUDIT & FIX: questions_full.json starter_python fields")
    print("=" * 70)

    with open(FILE) as f:
        data = json.load(f)

    total = len(data)
    print(f"\nTotal questions: {total}")

    # --- INITIAL STATS ---
    print("\n--- INITIAL STATE ---")
    init_design = 0
    init_has_check = 0
    init_missing_check = 0
    init_wrong_wrap = 0
    init_missing_starter = 0

    missing_check_list = []
    wrong_wrap_list = []
    design_list = []

    for q in data:
        code = q.get('starter_python', '') or ''
        if not code.strip():
            init_missing_starter += 1
            continue

        tl = top_level_classes(code)
        non_sol = [c for c in tl if c != 'Solution']
        is_design = bool(non_sol)

        if is_design:
            init_design += 1
            design_list.append((q['id'], q['title'], non_sol[0]))
            if 'Solution' in tl:
                init_wrong_wrap += 1
                wrong_wrap_list.append((q['id'], q['title']))

        if '_check(' in code:
            init_has_check += 1
        else:
            init_missing_check += 1
            missing_check_list.append((q['id'], q['title']))

    init_regular = total - init_design - init_missing_starter

    print(f"  Missing starter_python:         {init_missing_starter}")
    print(f"  Regular questions:              {init_regular}")
    print(f"  Design questions:               {init_design}")
    print(f"    → with Solution wrongly:      {init_wrong_wrap}")
    print(f"  Has _check calls:               {init_has_check}")
    print(f"  Missing _check calls:           {init_missing_check}")

    print(f"\n  Design questions:")
    for qid, title, cls in design_list:
        print(f"    [{qid:4d}] {title} (class {cls})")

    if wrong_wrap_list:
        print(f"\n  WRONG WRAP (Solution wrapping design class):")
        for qid, title in wrong_wrap_list:
            print(f"    [{qid:4d}] {title}")

    if missing_check_list:
        print(f"\n  Missing _check:")
        for qid, title in missing_check_list:
            print(f"    [{qid:4d}] {title}")

    # --- FIX ---
    print("\n--- APPLYING FIXES ---")
    fixed_data = []
    change_log = []
    total_changed = 0

    for q in data:
        q_fixed, changes = fix_question(q)
        fixed_data.append(q_fixed)
        real_changes = [c for c in changes if not c.startswith("SKIP")]
        if real_changes:
            total_changed += 1
            change_log.append((q['id'], q['title'], real_changes))

    for qid, title, changes in change_log:
        print(f"  [{qid:4d}] {title}")
        for c in changes:
            print(f"         → {c}")

    # --- WRITE ---
    print(f"\n--- WRITING FILE ---")
    with open(FILE, 'w') as f:
        json.dump(fixed_data, f, indent=2, ensure_ascii=False)
    print(f"  Written to: {FILE}")

    # --- VERIFICATION ---
    print("\n--- POST-FIX VERIFICATION ---")
    with open(FILE) as f:
        verify_data = json.load(f)

    post_design = 0
    post_has_check = 0
    post_missing_check = 0
    post_missing_starter = 0
    post_wrong_wrap = 0
    post_missing_check_list = []

    for q in verify_data:
        code = q.get('starter_python', '') or ''
        if not code.strip():
            post_missing_starter += 1
            continue

        tl = top_level_classes(code)
        non_sol = [c for c in tl if c != 'Solution']
        is_design = bool(non_sol)

        if is_design:
            post_design += 1
            if 'Solution' in tl:
                post_wrong_wrap += 1

        if '_check(' in code or '# ── Test ──' in code:
            post_has_check += 1
        else:
            post_missing_check += 1
            post_missing_check_list.append((q['id'], q['title']))

    post_regular = total - post_design - post_missing_starter

    print(f"  Missing starter_python:         {post_missing_starter}")
    print(f"  Regular questions:              {post_regular}")
    print(f"  Design questions:               {post_design}")
    print(f"    → with Solution wrongly:      {post_wrong_wrap}")
    print(f"  Has _check/Test section:        {post_has_check}")
    print(f"  Still missing _check/Test:      {post_missing_check}")

    if post_missing_check_list:
        print(f"\n  Still missing (manual review needed):")
        for qid, title in post_missing_check_list:
            print(f"    [{qid:4d}] {title}")

    print(f"\n=== SUMMARY ===")
    print(f"  Questions fixed:    {total_changed}")
    print(f"  Wrong wraps fixed:  {init_wrong_wrap - post_wrong_wrap}")
    print(f"  _check added:       {(init_missing_check) - post_missing_check}")
    print(f"  Remaining issues:   {post_missing_check}")
    print("Done.")


if __name__ == "__main__":
    main()
