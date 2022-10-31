export interface Condition {
  operator: FactOperator;
  value: number;
}
export enum FactOperator {
  LessThanOrEqual = 'LessThanOrEqual',
  GreaterThanOrEqual = 'GreaterThanOrEqual',
}

export type BmiRange = string;
export type BmiHealthRisk = string;
export type BmiCategory = string;

export interface BMIRecord {
  healthRisk: BmiHealthRisk;
  category: BmiCategory;
  range: BmiRange;
  rangeFacts: Condition[];
}

export interface BMIStat {
  range: string;
  count: number;
}

export type BMIStats = Record<string, BMIStat>;
