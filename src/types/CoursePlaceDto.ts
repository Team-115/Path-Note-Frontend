export interface CoursePlaceDto {
  poi_id: string;
  sequence_index: number;
  place_name: string;
  place_category: string;
  place_address: string;
  place_coordinate_x: string;
  place_coordinate_y: string;
  place_enter_time: string;
  place_leave_time: string;
}

export interface CourseCreateRequestDto {
  user_id: string;
  course_name: string;
  course_category: string;
  course_description: string;
  course_places: CoursePlaceDto[];
}
