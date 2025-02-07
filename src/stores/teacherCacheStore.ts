import { defineStore } from "pinia";
import { set as DBSet, entries } from 'idb-keyval'
import { pageTeachers } from "@/apis/teacher";

let first = true
export const useTeacherCacheStore = defineStore("teacherCache", () => {
  let cacheMap: Map<any, any>
  async function init() {
    if (!first) return
    first = true
    cacheMap = new Map(await entries())
  }

  async function get(id: number): Promise<string> {
    if (first) await init()
    if (await has(id)) return cacheMap.get('T' + id)
    const res = await pageTeachers({ id })
    const { name } = res.records[0]
    await set(id, name)
    return name
  }

  async function set(id: number, name: string) {
    if (first) await init()
    cacheMap.set('T' + id, name)
    DBSet('T' + id, name)
  }

  async function has(id: number) {
    if (first) await init()
    return cacheMap.has('T' + id)
  }

  return {
    get,
    set,
    has
  }
})
