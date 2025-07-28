export interface User {
  _id: string;
  userId: string;
  email: string;
  name: string;
  fatherName?: string;
  address: string;
  contactNumber: string;
  age: number;
  bloodGroup: string;
  weight: number;
  height?: number;
  appoinments: string[];
  lastTreatmentDate?: Date;
  createdAt: Date;
}
