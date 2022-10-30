import { bmiChart } from '../config/bmi.config';
import { BMIRecord, Condition, FactOperator } from '../features/persons/models/bmi.model';

const cmToMeters = (cm: number): number => {
  return cm / 100;
};

export const computeBMI = (height_cm: number, weight_kg: number): number => {
  const height_m = cmToMeters(height_cm);
  return weight_kg / height_m ** 2;
};

export const getBMIAnalysis = (bmi: number): BMIRecord | void => {
  const isValid = isValidFact.bind(null, bmi);
  return bmiChart.find((chart) => !!chart.rangeFacts.every(isValid));
};

const isValidFact = (bmi: number, condition: Condition): boolean => {
  let isValid: boolean;
  switch (condition.operator) {
    case FactOperator.GreaterThanOrEqual:
      isValid = bmi >= condition.value;
      break;
    case FactOperator.LessThanOrEqual:
      isValid = bmi <= condition.value;
      break;
  }
  return isValid;
};
