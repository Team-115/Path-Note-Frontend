import type { CoursePlaceType } from "./CoursePlaceType";

export type UpdateStateType = {
    openPanels?: boolean;
    courseId: number;
    prefill?: {places?: CoursePlaceType[];} | null;
}

export type UpdateCourseStateType = {
    name: string;
    description: string;
    categoryName: string;
}