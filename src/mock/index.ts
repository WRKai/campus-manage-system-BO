// import { mock } from 'mockjs'

// mock('/api-admin/admin/adminLogin', 'post', {
//   "errorMessage": "",
//   "code": 200,
//   "data": {
//     "token": "JWT string",
//     "info": {
//       "id": 1,
//       "sex": '男',
//       "dept": 1,
//       "admin": 1,
//       "entry_date": '2022-09-01',
//       "title": '副教授'
//     }
//   }
// })

// mock('/api-admin/dept/deptMajor', 'get', {
//   "errorMessage": "",
//   "code": 200,
//   "data": [
//     {
//       "id": 1,
//       "name": "计算机系",
//       "majors": [
//         {
//           "id": 1,
//           "name": "软件工程"
//         }
//       ]
//     },
//     {
//       "id": 2,
//       "name": "数学系",
//       "majors": [
//         {
//           "id": 2,
//           "name": "应用数学"
//         }
//       ]
//     }
//   ]
// })

// let deptId = Number.MAX_SAFE_INTEGER
// mock('/api-admin/dept/add', 'post', () => ({
//   "errorMessage": "",
//   "code": 200,
//   "data": --deptId // 该系别的id
// }))

// let majorId = Number.MAX_SAFE_INTEGER
// mock('/api-admin/major/add', 'post', () => ({
//   "errorMessage": "",
//   "code": 200,
//   "data": --majorId // 该专业id
// }))

// mock('/api-admin/user/student', 'post', {
//   "errorMessage": "",
//   "code": 200,
//   "data": null
// })

// mock(/^\/api-admin\/user\/student/, 'get', {
//   "host": null,
//   "code": 200,
//   "errorMessage": "操作成功",
//   "data": {
//     "records": [
//       {
//         "id": 2022102170,
//         "name": "王梅尔",
//         "sex": "男",
//         "grade": 2022,
//         "dept": 1,
//         "major": 1,
//         "credit": 24,
//         "password": null
//       },
//       {
//         "id": 2022102170,
//         "name": "王梅尔",
//         "sex": "男",
//         "grade": 2022,
//         "dept": 1,
//         "major": 1,
//         "credit": 24,
//         "password": null
//       },
//       {
//         "id": 2022102170,
//         "name": "王梅尔",
//         "sex": "男",
//         "grade": 2022,
//         "dept": 1,
//         "major": 1,
//         "credit": 24,
//         "password": null
//       },
//       {
//         "id": 2022102170,
//         "name": "王梅尔",
//         "sex": "男",
//         "grade": 2022,
//         "dept": 1,
//         "major": 1,
//         "credit": 24,
//         "password": null
//       },
//       {
//         "id": 2022102170,
//         "name": "王梅尔",
//         "sex": "男",
//         "grade": 2022,
//         "dept": 1,
//         "major": 1,
//         "credit": 24,
//         "password": null
//       },
//       {
//         "id": 2022102170,
//         "name": "王梅尔",
//         "sex": "男",
//         "grade": 2022,
//         "dept": 1,
//         "major": 1,
//         "credit": 24,
//         "password": null
//       },
//       {
//         "id": 2022102170,
//         "name": "王梅尔",
//         "sex": "男",
//         "grade": 2022,
//         "dept": 1,
//         "major": 1,
//         "credit": 24,
//         "password": null
//       },
//       {
//         "id": 2022102170,
//         "name": "王梅尔",
//         "sex": "男",
//         "grade": 2022,
//         "dept": 1,
//         "major": 1,
//         "credit": 24,
//         "password": null
//       },
//       {
//         "id": 2022102170,
//         "name": "王梅尔",
//         "sex": "男",
//         "grade": 2022,
//         "dept": 1,
//         "major": 1,
//         "credit": 24,
//         "password": null
//       },
//       {
//         "id": 2022102170,
//         "name": "王梅尔",
//         "sex": "男",
//         "grade": 2022,
//         "dept": 1,
//         "major": 1,
//         "credit": 24,
//         "password": null
//       },
//       {
//         "id": 2022102170,
//         "name": "王梅尔",
//         "sex": "男",
//         "grade": 2022,
//         "dept": 1,
//         "major": 1,
//         "credit": 24,
//         "password": null
//       },
//       {
//         "id": 2022102170,
//         "name": "王梅尔",
//         "sex": "男",
//         "grade": 2022,
//         "dept": 1,
//         "major": 1,
//         "credit": 24,
//         "password": null
//       },
//       {
//         "id": 2022102170,
//         "name": "王梅尔",
//         "sex": "男",
//         "grade": 2022,
//         "dept": 1,
//         "major": 1,
//         "credit": 24,
//         "password": null
//       },
//       {
//         "id": 2022102170,
//         "name": "王梅尔",
//         "sex": "男",
//         "grade": 2022,
//         "dept": 1,
//         "major": 1,
//         "credit": 24,
//         "password": null
//       },
//       {
//         "id": 2022102170,
//         "name": "王梅尔",
//         "sex": "男",
//         "grade": 2022,
//         "dept": 1,
//         "major": 1,
//         "credit": 24,
//         "password": null
//       },
//       {
//         "id": 2022102170,
//         "name": "王梅尔",
//         "sex": "男",
//         "grade": 2022,
//         "dept": 1,
//         "major": 1,
//         "credit": 24,
//         "password": null
//       },
//       {
//         "id": 2022102170,
//         "name": "王梅尔",
//         "sex": "男",
//         "grade": 2022,
//         "dept": 1,
//         "major": 1,
//         "credit": 24,
//         "password": null
//       },
//       {
//         "id": 2022102170,
//         "name": "王梅尔",
//         "sex": "男",
//         "grade": 2022,
//         "dept": 1,
//         "major": 1,
//         "credit": 24,
//         "password": null
//       },
//       {
//         "id": 2022102171,
//         "name": "王梅尔",
//         "sex": "男",
//         "grade": 2022,
//         "dept": 1,
//         "major": 1,
//         "credit": 2,
//         "password": null
//       },
//       {
//         "id": 2022102172,
//         "name": "王勾八",
//         "sex": "男",
//         "grade": 2022,
//         "dept": 1,
//         "major": 1,
//         "credit": 2,
//         "password": null
//       },
//       {
//         "id": 2022102174,
//         "name": "郭梅尔",
//         "sex": "女",
//         "grade": 2022,
//         "dept": 7,
//         "major": 4,
//         "credit": 24,
//         "password": null
//       }
//     ],
//     "total": 4,
//     "size": 40,
//     "current": 1,
//     "orders": [],
//     "optimizeCountSql": true,
//     "searchCount": true,
//     "maxLimit": null,
//     "countId": null,
//     "pages": 0
//   }
// })
