import { mock } from "mockjs"

mock('/api-admin/user/student', 'post', {
  "errorMessage": "",
  "code": 200,
  "data": null
})

mock(/^\/api-admin\/user\/student/, 'get', {
  "code": 200,
  "errorMessage": "操作成功",
  "data": {
    "records": new Array(21).fill(0).map(() => ({
      "id": 2022102170,
      "name": "王梅尔",
      "sex": "男",
      "grade": 2022,
      "dept": 1,
      "major": 1,
      "credit": 24,
      "password": null
    })),
    "total": 21,
    "size": 40,
    "current": 1,
    "orders": [],
    "optimizeCountSql": true,
    "searchCount": true,
    "maxLimit": null,
    "countId": null,
    "pages": 0
  }
})
