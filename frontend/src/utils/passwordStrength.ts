export type Strength = { score: 0 | 1 | 2 | 3 | 4; label: string; color: string };

export function passwordStrength(pw: string): Strength {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map: Record<number, Strength> = {
    0: { score: 0, label: "Too short", color: "#ef4444" },
    1: { score: 1, label: "Weak", color: "#f59e0b" },
    2: { score: 2, label: "Fair", color: "#eab308" },
    3: { score: 3, label: "Good", color: "#22c55e" },
    4: { score: 4, label: "Strong", color: "#16a34a" },
  };
  return map[score as 0 | 1 | 2 | 3 | 4];
}
