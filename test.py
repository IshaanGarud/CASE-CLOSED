
from pathlib import Path
import re

files = sorted(Path("supabase/migrations").glob("*.sql"))

for file in files:
    sql = file.read_text(encoding="utf-8")
    upper = sql.upper()

    print("\n" + "=" * 65)
    print(file.name)
    print("=" * 65)

    checks = {
        "Room capacity constrained to 2-4":
            "MAX_PLAYERS BETWEEN 2 AND 4" in upper,

        "One verdict per room":
            "UNIQUE (ROOM_ID)" in upper,

        "Shared evidence uniqueness":
            "PRIMARY KEY (ROOM_ID, EVIDENCE_ID)" in upper,

        "Shared task uniqueness":
            "PRIMARY KEY (ROOM_ID, TASK_ID)" in upper,

        "Cross-case room protection":
            "FOREIGN KEY (ROOM_ID, CASE_ID)" in upper,

        "Password hash column":
            "PASSWORD_HASH" in upper,

        "Private solution storage":
            "PRIVATE.CASE_SOLUTIONS" in upper,

        "Updated timestamp automation":
            "CREATE TRIGGER" in upper,

        "RLS enabled":
            "ENABLE ROW LEVEL SECURITY" in upper,
    }

    for name, result in checks.items():
        print(f"{'PASS' if result else 'REVIEW'} | {name}")

    if "ROOM_PLAYERS" in upper:
        print("Room player references:", upper.count("ROOM_PLAYERS"))

print("\nAUDIT COMPLETE")
