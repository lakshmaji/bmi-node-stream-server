export enum Gender {
  Male = 'male',
  Female = 'female',
}

export const GENDER_MAP: Record<'male' | 'female', Gender> = {
  male: Gender.Male,
  female: Gender.Female,
};
