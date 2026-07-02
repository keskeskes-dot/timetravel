// Test de cohérence de l'API /api/quiz sur plusieurs scénarios.
// Usage : node scripts/test-quiz.mjs [baseUrl]
const base = process.argv[2] ?? "http://localhost:3210";

const scenarios = [
  {
    name: "Profil 100% culture → Florence",
    answers: {
      experience: "exp-culture",
      periode: "per-renaissance",
      ambiance: "amb-art",
      activite: "act-musees",
    },
    expect: "florence-1504",
  },
  {
    name: "Profil 100% nature → Crétacé",
    answers: {
      experience: "exp-aventure",
      periode: "per-anciens",
      ambiance: "amb-nature",
      activite: "act-faune",
    },
    expect: "cretace",
  },
  {
    name: "Profil 100% raffinement → Paris",
    answers: {
      experience: "exp-elegance",
      periode: "per-moderne",
      ambiance: "amb-urbaine",
      activite: "act-monuments",
    },
    expect: "paris-1889",
  },
  {
    name: "Profil mixte majorité Paris (3/1) → Paris",
    answers: {
      experience: "exp-elegance", // paris
      periode: "per-moderne", // paris
      ambiance: "amb-art", // florence
      activite: "act-monuments", // paris
    },
    expect: "paris-1889",
  },
  {
    name: "Égalité 2-1-1, départage déterministe → Paris (ordre catalogue)",
    answers: {
      experience: "exp-culture", // florence
      periode: "per-moderne", // paris
      ambiance: "amb-nature", // cretace
      activite: "act-monuments", // paris
    },
    expect: "paris-1889",
  },
];

let pass = 0;
let fail = 0;

for (const s of scenarios) {
  try {
    const res = await fetch(`${base}/api/quiz`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: s.answers }),
    });
    const data = await res.json();
    const ok = res.ok && data.slug === s.expect;
    console.log(`\n${ok ? "✅" : "❌"} ${s.name}`);
    console.log(`   attendu: ${s.expect} | obtenu: ${data.slug} | scores: ${JSON.stringify(data.scores)} | source: ${data.source}`);
    console.log(`   explication: ${String(data.explanation).slice(0, 160)}...`);
    ok ? pass++ : fail++;
  } catch (e) {
    console.log(`\n❌ ${s.name} — erreur réseau: ${e.message}`);
    fail++;
  }
}

// Scénario d'erreur : quiz incomplet doit renvoyer 400.
try {
  const res = await fetch(`${base}/api/quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers: { experience: "exp-culture" } }),
  });
  const ok = res.status === 400;
  console.log(`\n${ok ? "✅" : "❌"} Quiz incomplet → 400 (obtenu: ${res.status})`);
  ok ? pass++ : fail++;
} catch (e) {
  console.log(`\n❌ Quiz incomplet — erreur réseau: ${e.message}`);
  fail++;
}

console.log(`\n──────────\nRésultat: ${pass} réussis, ${fail} échoués`);
process.exit(fail === 0 ? 0 : 1);
