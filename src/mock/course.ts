import { mock } from "mockjs"

mock(/^\/api-admin\/courses\/all/, 'get', {
  "errorMessage": "",
  "code": 200,
  data: [
    { id: 1, name: '计算机网络', credit: 3 },
    { id: 2, name: '计算机网络实验', credit: 0.5 },
    { id: 3, name: '体育', credit: 1 },
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
