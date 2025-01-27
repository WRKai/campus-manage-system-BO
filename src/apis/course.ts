import { req } from "./req";

interface GetCoursesParams {
  name?: string
  credit?: number
}

export interface Course {
  id: number
  name: string
  credit: number
}

export const getCourses = (params: GetCoursesParams = {}): Promise<Course[]> =>
  req({ url: '/course/list', params })


interface CourseApply {
  uid: string;
  name: string;
  credit: number;
  preIds: number[]; // 先修课程序号
  majors: {
    majorId: number;
    required: number;
  }[];
}


export const getCourseApply = (): Promise<CourseApply[]> =>
  req('/course/check')


interface HandleCourseApplyReq {
  uid: string
  apply: number
}

export const putHandleCourseApply = (data: HandleCourseApplyReq): Promise<void> =>
  req({ url: '/course/apply', method: 'PUT', data })
