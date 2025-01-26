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

mock(/^\/api-admin\/lessonTime/, 'get', {
  "host": null,
  "code": 200,
  "errorMessage": "操作成功",
  "data": {
    "ban": [
      {
        "beginTime": "14:00:00",
        "endTime": "15:40:00",
        "dayOfWeek": 1
      }
    ],
    "notRequired": [
      {
        "beginTime": "08:30:00",
        "endTime": "10:10:00",
        "dayOfWeek": 1
      }
    ]
  }
})

mock('/api-admin/lesson/add', 'post', {
  "errorMessage": "",
  "code": 200,
  "data": 1
})
