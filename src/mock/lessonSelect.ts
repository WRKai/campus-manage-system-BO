import { mock } from "mockjs"

mock('/api-admin/selectLesson/getTime', 'get', {
  "code": 200,
  "errorMessage": "操作成功",
  "data": {
    "beginTime": "2025-01-01 11:22:33",
    "endTime": "2025-01-02 11:22:33"
  }
})

mock('/api-admin/selectLesson/setTime', 'put', {
  "code": 200,
  "errorMessage": "操作成功",
  "data": null
})
