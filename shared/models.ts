export enum Gender {
  Male = 'male',
  Female = 'female',
}

export interface PersonBMIMetric {
  height_cm: number;
  weight_kg: number;
  gender: 'male' | 'female';
  health_risk: string;
  category: string;
  bmi_range: string;
}

export interface PersonInput {
  height_cm: string;
  weight_kg: string;
  gender: Gender;
}

export interface BMIValue {
  bmi: number;
}
