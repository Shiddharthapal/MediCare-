export interface User {
  _id: string;
  userId: string;
  name: string;
  fatherName?: string;
  address?: string;
  age?: number;
  bloodGroup?: string;
  weight?: number;
  height?: number;
  contactNumber?: string;
  lastTreatmentDate?: Date;
  email: string;
  createdAt: Date;
}
