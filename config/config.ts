import { BMIRecord, FactOperator } from "../types";



export const bmiChart: BMIRecord[] = [
  {
    healthRisk: "Malnutrition",
    category: "Underweight",
    range: "18.4 and below",
    rangeFacts: [
      {
        operator: FactOperator.LessThanOrEqual,
        value: 18.4,
      },
    ],
  },

  {
    healthRisk: "Low",
    category: "Normal weight",
    range: "18.5-24.9",
    rangeFacts: [
      {
        operator: FactOperator.GreaterThanOrEqual,
        value: 18.5,
      },
      {
        operator: FactOperator.LessThanOrEqual,
        value: 24.9,
      },
    ],
  },

  {
    healthRisk: "Enhanced",
    category: "Overweight",
    range: "25-29.9",

    rangeFacts: [
      {
        operator: FactOperator.GreaterThanOrEqual,
        value: 25,
      },
      {
        operator: FactOperator.LessThanOrEqual,
        value: 29.9,
      },
    ],
  },

  {
    healthRisk: "Medium",
    category: "Moderately obese",
    range: "30-34.9",

    rangeFacts: [
      {
        operator: FactOperator.GreaterThanOrEqual,
        value: 30,
      },
      {
        operator: FactOperator.LessThanOrEqual,
        value: 34.9,
      },
    ],
  },

  {
    healthRisk: "High",
    category: "Severely obese",
    range: "35-39.9",
    rangeFacts: [
      {
        operator: FactOperator.GreaterThanOrEqual,
        value: 35,
      },
      {
        operator: FactOperator.LessThanOrEqual,
        value: 39.9,
      },
    ],
  },

  {
    healthRisk: "Very high",
    category: "Very severely obese",
    range: "40 and above",
    rangeFacts: [
      {
        operator: FactOperator.GreaterThanOrEqual,
        value: 40,
      },
    ],
  },
];

