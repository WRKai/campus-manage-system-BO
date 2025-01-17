import { req } from "./req";

export interface Student {
  id: number; // 学号，类型为 long，对应 TypeScript 的 number
  name: string; // 姓名，类型为 varchar(255)，对应 TypeScript 的 string
  sex?: string; // 性别，类型为 varchar(3)，对应 TypeScript 的 string，且为可选字段
  grade: number; // 年级，类型为 smallint，对应 TypeScript 的 number
  dept?: number; // 系别，类型为 long，对应 TypeScript 的 number
  major?: number; // 专业，类型为 long，对应 TypeScript 的 number
  credit: number; // 学分，类型为 int，对应 TypeScript 的 number
  password: string; // 密码，类型为 varchar(255)，对应 TypeScript 的 string
}

export const postAddStudent = (data: Omit<Student, 'password'>): Promise<void> =>
  req({ url: '/user/student', method: 'POST', data })

interface StudentQueryParams {
  page?: number; // 页码，默认值为 1
  pageSize?: number; // 每页大小，默认值为 40
  dept?: number | null; // 系别，可为 null
  major?: number | null; // 专业，可为 null
  grade?: number | null; // 年级，可为 null
  id?: number | null; // 学号，可为 null
}

export const pageStudents = (params: StudentQueryParams = {}): Promise<{ records: Student[], total: number }> =>
  req({ url: `/user/student`, params })
