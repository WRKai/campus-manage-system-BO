import { req } from "./req";

interface LessonApply {
  uid: number;
  courseId: number; // 这个课次对应的课程
  targetGrade: number;
  teacherId: number;
}

export const getLessonApply = (): Promise<LessonApply[]> =>
  req('/lesson/check')
