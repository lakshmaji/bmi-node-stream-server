import { BMIValue, Gender } from '../../../shared/models';
import { HasStreamProperties } from '../../../types';
import { computeBMI } from '../../../utils/bmi';

export interface PersonModel {
  height_cm: number;
  weight_kg: number;
  gender: Gender;
}

export class Person implements BMIValue, HasStreamProperties {
  private _height: number;
  private _weight: number;
  private _gender: Gender;

  constructor(height_cm: string, weight_kg: string, gender: Gender) {
    this._height = +height_cm;
    this._weight = +weight_kg;
    this._gender = gender;
  }

  get length(): number {
    return Object.getOwnPropertyNames(this).length;
  }

  get height_cm(): number {
    return this._height;
  }

  get weight_kg(): number {
    return this._weight;
  }

  get gender(): Gender {
    return this._gender;
  }

  get bmi(): number {
    return computeBMI(this._height, this._weight);
  }
}
