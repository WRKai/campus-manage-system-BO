import { mock } from "mockjs"

mock('/api-admin/teacher/add', 'post', {
  "errorMessage": "",
  "code": 200,
  "data": null
})

mock('/api-admin/admin/update', 'put', {
  "errorMessage": "",
  "code": 200,
  "data": null
})

mock(/^\/api-admin\/teacher\/page/, 'get', {
  "code": 200,
  "errorMessage": "操作成功",
  "data": {
    "records": new Array(21).fill(0).map((_, i) => ({
      "id": i + 1,
      "sex": "男",
      "name": "王梅尔",
      "dept": 1,
      "admin": 0,
      "entryDate": '2022-10-17',
      "title": null,
    })),
    total: 21,
  }
})
