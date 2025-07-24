export interface Doctor {
  _id: string;
  userId: string;
  name: string;
  specialist: string;
  areasofexpertise: string[];
  hospital: string;
  fees: number;
  rating?: number;
  experience: string;
  education: string;
  degree: string;
  about: string;
  availableSlots: string[];
  createdAt: Date;
}
