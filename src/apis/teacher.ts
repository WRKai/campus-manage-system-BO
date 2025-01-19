import type { User } from "@/stores/userStore";
import { req } from "./req";
import type { PagePromise } from "@/utils";

export type Teacher = Omit<User, 'password'>

export const postAddTeacher = (data: Teacher): Promise<void> =>
  req({ url: '/teacher/add', method: 'POST', data })

export const putAdminTeacher = (id: number, admin: number) =>
  req({ url: `/admin/update`, method: 'PUT', data: { id, admin }, showLoading: false })

interface TeacherQueryParams {
  page?: number; // 页码，默认值为 1
  pageSize?: number; // 每页大小，默认值为 40
  dept?: number | null; // 系别，可为 null
  id?: number | null; // 学号，可为 null
  admin?: number | null; // 是否为管理员，可为 null
  name?: string | null; // 姓名，可为 null
  sex?: string | null; // 性别，可为 null
  title?: string | null; // 职称，可为 null
}

export const pageTeachers = (params: TeacherQueryParams): PagePromise<Teacher> =>
  req({ url: '/teacher/page', method: 'GET', params })

