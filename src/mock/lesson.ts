import { mock } from "mockjs"

mock('/api-admin/lesson/check', 'get', {
  "errorMessage": "",
  "code": 200,
  "data": [
    {
      "uid": "1",
      "courseId": 1, // 这个课次对应的课程
      "targetGrade": 2022,
      "teacherId": 1,
    },
    {
      "uid": "2",
      "courseId": 2, // 这个课次对应的课程
      "targetGrade": 2023,
      "teacherId": 2022102170,
    },
  ]
})
