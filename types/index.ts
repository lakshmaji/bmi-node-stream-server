export enum Gender {
  Male= "male",
  Female= "female",
}

export interface Person {
    height: number;
    weight: number;
    gender: Gender;
}


export interface Condition {
    operator: FactOperator;
    value: number;
  }
  export enum FactOperator {
    LessThanOrEqual = "LessThanOrEqual",
    GreaterThanOrEqual = "GreaterThanOrEqual",
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

export   interface Config {
    bmiChart: BMIRecord[];
  }
  

  export type BMIMetrics = [BmiRange, BmiHealthRisk, BmiCategory]



  export interface PersonBMIMetric {
height: number;
weight: number;
gender: 'male' | 'female'
health_risk: string;
category: string;
bmi_range: string;
  }


export type Noop = () => void;
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop: Noop = () => {}
