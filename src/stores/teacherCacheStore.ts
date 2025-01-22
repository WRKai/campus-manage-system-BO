import { defineStore } from "pinia";


export const useTeacherCacheStore = defineStore("teacherCache", () => {
  const cacheMap = new Map<number, string>()

  function get(id: number) {
    return cacheMap.get(id)
  }

  function set(id: number, name: string) {
    cacheMap.set(id, name)
  }

  function has(id: number) {
    return cacheMap.has(id)
  }

  return {
    get,
    set,
    has
  }
})
