import { req } from "./req";

export const getSelectTime = (): Promise<{ beginTime: string, endTime: string }> =>
  req('/selectLesson/getTime')

export const setSelectTime = (beginTime: string, endTime: string): Promise<void> =>
  req({ url: '/selectLesson/setTime', data: { beginTime, endTime }, method: 'PUT' })
