import { milesConfig } from '../data/mockData';

export function validateMiles(stage, prevStage, lastTruckMiles, config = milesConfig) {
  const violations = [];

  // Rule 001: First stage — |milesStart - lastTruckMiles| ≤ tolerance
  if (!prevStage && stage.milesStart != null && lastTruckMiles != null) {
    const gap = Math.abs(stage.milesStart - lastTruckMiles);
    if (gap > config['001']) {
      violations.push({
        rule: '001',
        message: `First stage gap: ${gap} km exceeds tolerance of ${config['001']} km`,
        value: gap,
        threshold: config['001'],
      });
    }
  }

  // Rule 002: Stage gap — |prevEnd - currStart| ≤ tolerance
  if (prevStage && prevStage.milesEnd != null && stage.milesStart != null) {
    const gap = Math.abs(stage.milesStart - prevStage.milesEnd);
    if (gap > config['002']) {
      violations.push({
        rule: '002',
        message: `Stage gap: ${gap} km exceeds tolerance of ${config['002']} km`,
        value: gap,
        threshold: config['002'],
      });
    }
  }

  // Rule 003: Distance variance — |actual - std| ≤ tolerance (km)
  if (stage.stdDistance && stage.stdDistance > 0) {
    const actual = stage.milesEnd != null && stage.milesStart != null
      ? stage.milesEnd - stage.milesStart
      : null;
    if (actual != null) {
      const variance = Math.abs(actual - stage.stdDistance);
      if (variance > config['003']) {
        violations.push({
          rule: '003',
          message: `Distance variance: ${variance} km exceeds tolerance of ${config['003']} km`,
          value: variance,
          threshold: config['003'],
        });
      }
    }
  }

  // Rule 004: Dummy route — if stdDistance is 0, tolerance check
  if (stage.stdDistance === 0) {
    const actual = stage.milesEnd != null && stage.milesStart != null
      ? stage.milesEnd - stage.milesStart
      : null;
    if (actual != null && actual > config['004']) {
      violations.push({
        rule: '004',
        message: `Dummy route distance: ${actual} km exceeds tolerance of ${config['004']} km`,
        value: actual,
        threshold: config['004'],
      });
    }
  }

  // Rule 005: Broken miles bypass
  const passed = violations.length === 0 || config['005'];

  return { passed, violations, bypassed: config['005'] && violations.length > 0 };
}
