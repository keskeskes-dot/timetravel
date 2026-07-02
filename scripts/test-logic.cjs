/*
 * Teste la logique PURE du quiz (lib/quiz.ts) sans passer par le serveur Next.
 * On transpile le vrai code source TypeScript en mémoire puis on l'exécute.
 * Utile pour valider le scoring, le départage des égalités et la garde
 * "quiz incomplet" de façon déterministe.
 */
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const root = path.join(__dirname, "..");

function transpile(relPath) {
  const source = fs.readFileSync(path.join(root, relPath), "utf8");
  return ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 },
  }).outputText;
}

function loadModule(code, requireFn) {
  const module = { exports: {} };
  // eslint-disable-next-line no-new-func
  const fn = new Function("module", "exports", "require", code);
  fn(module, module.exports, requireFn);
  return module.exports;
}

const destinations = loadModule(transpile("lib/destinations.ts"), require);
const quiz = loadModule(transpile("lib/quiz.ts"), (spec) =>
  spec.includes("destinations") ? destinations : require(spec),
);

const { recommendDestination, isQuizComplete } = quiz;

let pass = 0;
let fail = 0;
function check(name, cond, detail) {
  if (cond) {
    pass++;
    console.log(`✅ ${name}`);
  } else {
    fail++;
    console.log(`❌ ${name} — ${detail}`);
  }
}

// 1. Profils "purs"
{
  const r = recommendDestination({ experience: "exp-culture", periode: "per-renaissance", ambiance: "amb-art", activite: "act-musees" });
  check("Culture pure → florence-1504 (score 4)", r.destination.slug === "florence-1504" && r.score === 4, JSON.stringify(r.scores));
}
{
  const r = recommendDestination({ experience: "exp-aventure", periode: "per-anciens", ambiance: "amb-nature", activite: "act-faune" });
  check("Nature pure → cretace (score 4)", r.destination.slug === "cretace" && r.score === 4, JSON.stringify(r.scores));
}
{
  const r = recommendDestination({ experience: "exp-elegance", periode: "per-moderne", ambiance: "amb-urbaine", activite: "act-monuments" });
  check("Raffinement pur → paris-1889 (score 4)", r.destination.slug === "paris-1889" && r.score === 4, JSON.stringify(r.scores));
}

// 2. Majorité simple
{
  const r = recommendDestination({ experience: "exp-elegance", periode: "per-moderne", ambiance: "amb-art", activite: "act-monuments" });
  check("Majorité 3/1 → paris-1889", r.destination.slug === "paris-1889" && r.scores["paris-1889"] === 3, JSON.stringify(r.scores));
}

// 3. Vraie égalité 2-2-0 : départage déterministe par ordre du catalogue (paris avant florence)
{
  const r = recommendDestination({ experience: "exp-culture", periode: "per-moderne", ambiance: "amb-art", activite: "act-monuments" });
  // florence: exp-culture + amb-art = 2 ; paris: per-moderne + act-monuments = 2
  check("Égalité 2-2 paris/florence → paris-1889 (ordre catalogue)", r.destination.slug === "paris-1889", `slug=${r.destination.slug} scores=${JSON.stringify(r.scores)}`);
}

// 4. Cohérence : même entrée => même sortie (déterministe)
{
  const a = { experience: "exp-culture", periode: "per-renaissance", ambiance: "amb-art", activite: "act-musees" };
  const r1 = recommendDestination(a);
  const r2 = recommendDestination(a);
  check("Déterminisme (même entrée → même sortie)", r1.destination.slug === r2.destination.slug, "résultats divergents");
}

// 5. Complétude
check("isQuizComplete = false si incomplet", isQuizComplete({ experience: "exp-culture" }) === false, "devrait être false");
check("isQuizComplete = false si option invalide", isQuizComplete({ experience: "xxx", periode: "per-anciens", ambiance: "amb-nature", activite: "act-faune" }) === false, "devrait être false");
check("isQuizComplete = true si complet", isQuizComplete({ experience: "exp-culture", periode: "per-renaissance", ambiance: "amb-art", activite: "act-musees" }) === true, "devrait être true");

console.log(`\n──────────\nRésultat logique: ${pass} réussis, ${fail} échoués`);
process.exit(fail === 0 ? 0 : 1);
