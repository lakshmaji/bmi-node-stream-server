import { HasStreamProperties } from '../../../types';
import { computeBMI } from '../../../utils/bmi';
import { BMIValue } from './bmi.model';
import { Gender, GENDER_MAP } from './constants';

export interface PersonModel {
  height: number;
  weight: number;
  gender: Gender;
}

export class Person implements BMIValue, HasStreamProperties {
  private _height: number;
  private _weight: number;
  private _gender: Gender;

  constructor(height: string, weight: string, gender: 'male' | 'female') {
    this._height = +height;
    this._weight = +weight;
    this._gender = GENDER_MAP[gender];
  }

  get length(): number {
    return Object.getOwnPropertyNames(this).length;
  }

  get height(): number {
    return this._height;
  }

  get weight(): number {
    return this._weight;
  }

  get gender(): Gender {
    return this._gender;
  }

  get bmi(): number {
    return computeBMI(this._height, this._weight);
  }
}
