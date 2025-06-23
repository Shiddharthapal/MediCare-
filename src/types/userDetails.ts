export interface User {
  _id: string;
  userId: string;
  email: string;
  name: string;
  fatherName?: string;
  address: string;
  contactNumber: number;
  age: number;
  bloodGroup: string;
  weight: number;
  height?: number;
  lastTreatmentDate?: Date;
  createdAt: Date;
}
