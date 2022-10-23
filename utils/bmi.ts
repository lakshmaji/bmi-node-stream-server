import { bmiChart } from '../config/bmi.config';
import { BMIRecord, Condition, FactOperator } from '../features/persons/models/bmi.model';

export const computeBMI = (height: number, weight: number): number => {
  return weight / height ** 2;
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
