import { req } from "./req";

interface LessonApply {
  uid: number;
  courseId: number; // 这个课次对应的课程
  targetGrade: number;
  teacherId: number;
}

export const getLessonApply = (): Promise<LessonApply[]> =>
  req('/lesson/check')

export interface Schedule {
  ban: {
    beginTime: string;
    endTime: string;
    dayOfWeek: number;
  }[];
  notRequired: {
    beginTime: string;
    endTime: string;
    dayOfWeek: number;
  }[];
}

export const getTimes = (params: { uid: string, status: number }): Promise<Schedule> =>
  req({ url: '/lessonTime', params })

interface HandleLessonApplyReq {
  uid: string;
  courseId?: number; // 有uid了，真的要courseId吗？可以从【申请添加课次API】参数得到
  teacherId?: number; // 有uid了，真的要teacherId吗？可以从【申请添加课次API】token得到
  startWeek: number;
  endWeek: number;
  capacity: number;
  term: string;
  targetGrade?: number; // 有uid了，真的要targetGrade吗？可以从【申请添加课次API】参数得到
  time: {
    beginTime: string;
    endTime: string;
    dayOfWeek: number;
    status: number;
  }[];
}


export const postHandleLessonApply = (data: HandleLessonApplyReq): Promise<number> =>
  req({ url: '/lesson/add', method: 'POST', data })
