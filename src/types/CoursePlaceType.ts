export interface CoursePlaceType {
  id: number;
  poiId: string;
  name: string;
  address: string;
  category?: string;
  lat?: number;
  lng?: number;
  arrivalTime?: string;
  departureTime?: string; 
}