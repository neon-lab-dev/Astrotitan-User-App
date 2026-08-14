// components/RaiseKundliRequest/types.ts
export type TKundliType =
  | 'birthChart'
  | 'compatibility'
  | 'career'
  | 'marriage'
  | 'yearly'
  | 'love'
  | 'health'
  | 'finance'
  | 'education'
  | 'business'
  | 'child'
  | 'foreignTravel'
  | 'property'
  | 'doshaAnalysis'
  | 'gemstone';

export type KundliFormData = {
  requestType: 'generateKundli' | 'analyzeKundli';
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  dateOfBirth: Date;
  timeOfBirth: string;
  placeOfBirth: string;
  userGender: 'male' | 'female' | 'other';
  kundliType: TKundliType;
  userNotes?: string;
};