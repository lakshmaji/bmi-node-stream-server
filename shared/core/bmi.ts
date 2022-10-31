import { PersonBMIMetric, PersonInput } from '../models';
import { Person } from '../../features/persons/models/person.model';
import { getBMIAnalysis } from '../../utils/bmi';

export function getBMIMetric(inputRow: PersonInput): PersonBMIMetric | undefined {
  const person = new Person(inputRow.height_cm, inputRow.weight_kg, inputRow.gender);

  const stats = getBMIAnalysis(person.bmi);
  if (stats) {
    return {
      height_cm: person.height_cm,
      weight_kg: person.weight_kg,
      gender: person.gender,
      health_risk: stats.healthRisk,
      category: stats.category,
      bmi_range: stats.range,
    };
  }
  return undefined;
}
