export type GetUpdateCourseDto = {
    course_id: number;
    course_name: string;
    course_description: string;
    course_category: { id: number; name: string } | null;
    course_places: {
        poi_id: number;
        sequence_index: number;
        place_name: string;
        place_category: string;
        place_address: string;
        place_coordinate_x: number; // lat
        place_coordinate_y: number; // lng
        place_enter_time?: string | null;
        place_leave_time?: string | null;
    }[];
    center_x?: number | null;
    center_y?: number | null;
}