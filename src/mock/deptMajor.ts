import { mock } from "mockjs"

mock('/api-admin/dept/deptMajor', 'get', {
  "errorMessage": "",
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "计算机系",
      "majors": [
        {
          "id": 1,
          "name": "软件工程"
        }
      ]
    },
    {
      "id": 2,
      "name": "数学系",
      "majors": [
        {
          "id": 2,
          "name": "应用数学"
        }
      ]
    }
  ]
})

let deptId = Number.MAX_SAFE_INTEGER
mock('/api-admin/dept/add', 'post', () => ({
  "errorMessage": "",
  "code": 200,
  "data": --deptId // 该系别的id
}))

let majorId = Number.MAX_SAFE_INTEGER
mock('/api-admin/major/add', 'post', () => ({
  "errorMessage": "",
  "code": 200,
  "data": --majorId // 该专业id
}))
