/* Kod wypełniający połowę „Software” wału w hero. */

export const HERO_CODE = `type Tolerance = { nominal: number; plus: number; minus: number };

export function designToSoftware(problem: EngineeringProblem) {
  const constraints = analyze(problem.requirements);
  const model = prototype(constraints, { typed: true });
  const verified = test(model);
  return ship(verified);
}

// tolerances matter in code too
export const engineer = { experience: "7+ years", mode: "codes" };

// mechanical × software × ai
await automate(repetitiveTasks);`;
