export interface CoursePlaceType {
  id: number;
  name: string;
  address: string;
  category?: string;
  lat?: number;
  lng?: number;
  arrivalTime?: string;
  departureTime?: string; 
}