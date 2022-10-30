import { Gender } from './constants';

export interface PersonInput {
  height_cm: string;
  weight_kg: string;
  gender: Gender;
}
