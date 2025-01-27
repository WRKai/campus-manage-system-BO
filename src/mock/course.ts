import { mock } from "mockjs"

mock(/^\/api-admin\/course\/list/, 'get', {
  "errorMessage": "",
  "code": 200,
  data: [
    { id: 1, name: '计算机网络', credit: 60 },
    { id: 2, name: '计算机牛魔', credit: 60 },
    { id: 3, name: '一门不存在的课程', credit: 60 },
  ]
})

mock('/api-admin/course/check', 'get', {
  "errorMessage": "",
  "code": 200,
  data: [
    {
      uid: '1', name: 'Web前端入门', credit: 3, preIds: [1, 2], majors: [
        { majorId: 1, required: 1 }
      ]
    },
    {
      uid: '2', name: '苏炳添田径训练', credit: 1, preIds: [3], majors: [
        { majorId: 1, required: 0 },
        { majorId: 2, required: 0 }
      ]
    },
    {
      uid: '3', name: '默心的无畏契约课堂', credit: 1, preIds: [], majors: [
        { majorId: 1, required: 0 },
        { majorId: 2, required: 0 }
      ]
    },
  ]
})

mock(/^\/api-admin\/course\/apply/, 'put', {
  "errorMessage": "",
  "code": 200,
  data: null
})
