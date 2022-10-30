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

export interface PersonBMIMetric {
  height_cm: number;
  weight_kg: number;
  gender: 'male' | 'female';
  health_risk: string;
  category: string;
  bmi_range: string;
}

export interface BMIValue {
  bmi: number;
}

export interface BMIStat {
  range: string;
  count: number;
}

export type BMIStats = Record<string, BMIStat>;
