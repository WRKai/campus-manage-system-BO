import { getCourses, type Course } from "@/apis/course";
import { defineStore } from "pinia";

type PartCourse = Omit<Course, 'id'>
export type CourseMap = Map<number, PartCourse>

export const useCourseStore = defineStore('course', () => {
  const courseMap: CourseMap = new Map()

  async function fetchCourseMap() {
    const res = await getCourses()
    for (const course of res)
      courseMap.set(course.id, course)
  }

  async function getCourseMap() {
    await fetchCourseMap()
    return courseMap
  }

  return {
    getCourseMap
  }
})
