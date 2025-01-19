// // import { mock } from 'mockjs'

// import Mock, { mock } from "mockjs";
// Mock.setup({
//   timeout: "600-900",
// })
// // mock('/api-admin/admin/adminLogin', 'post', {
// //   "errorMessage": "",
// //   "code": 200,
// //   "data": {
// //     "token": "JWT string",
// //     "info": {
// //       "id": 1,
// //       "sex": '男',
// //       "dept": 1,
// //       "admin": 1,
// //       "entry_date": '2022-09-01',
// //       "title": '副教授'
// //     }
// //   }
// // })

// // mock('/api-admin/dept/deptMajor', 'get', {
// //   "errorMessage": "",
// //   "code": 200,
// //   "data": [
// //     {
// //       "id": 1,
// //       "name": "计算机系",
// //       "majors": [
// //         {
// //           "id": 1,
// //           "name": "软件工程"
// //         }
// //       ]
// //     },
// //     {
// //       "id": 2,
// //       "name": "数学系",
// //       "majors": [
// //         {
// //           "id": 2,
// //           "name": "应用数学"
// //         }
// //       ]
// //     }
// //   ]
// // })

// // let deptId = Number.MAX_SAFE_INTEGER
// // mock('/api-admin/dept/add', 'post', () => ({
// //   "errorMessage": "",
// //   "code": 200,
// //   "data": --deptId // 该系别的id
// // }))

// // let majorId = Number.MAX_SAFE_INTEGER
// // mock('/api-admin/major/add', 'post', () => ({
// //   "errorMessage": "",
// //   "code": 200,
// //   "data": --majorId // 该专业id
// // }))

// // mock('/api-admin/user/student', 'post', {
// //   "errorMessage": "",
// //   "code": 200,
// //   "data": null
// // })

// // mock(/^\/api-admin\/user\/student/, 'get', {
// //   "code": 200,
// //   "errorMessage": "操作成功",
// //   "data": {
// //     "records": [
// //       {
// //         "id": 2022102170,
// //         "name": "王梅尔",
// //         "sex": "男",
// //         "grade": 2022,
// //         "dept": 1,
// //         "major": 1,
// //         "credit": 24,
// //         "password": null
// //       },
// //       {
// //         "id": 2022102170,
// //         "name": "王梅尔",
// //         "sex": "男",
// //         "grade": 2022,
// //         "dept": 1,
// //         "major": 1,
// //         "credit": 24,
// //         "password": null
// //       },
// //       {
// //         "id": 2022102170,
// //         "name": "王梅尔",
// //         "sex": "男",
// //         "grade": 2022,
// //         "dept": 1,
// //         "major": 1,
// //         "credit": 24,
// //         "password": null
// //       },
// //       {
// //         "id": 2022102170,
// //         "name": "王梅尔",
// //         "sex": "男",
// //         "grade": 2022,
// //         "dept": 1,
// //         "major": 1,
// //         "credit": 24,
// //         "password": null
// //       },
// //       {
// //         "id": 2022102170,
// //         "name": "王梅尔",
// //         "sex": "男",
// //         "grade": 2022,
// //         "dept": 1,
// //         "major": 1,
// //         "credit": 24,
// //         "password": null
// //       },
// //       {
// //         "id": 2022102170,
// //         "name": "王梅尔",
// //         "sex": "男",
// //         "grade": 2022,
// //         "dept": 1,
// //         "major": 1,
// //         "credit": 24,
// //         "password": null
// //       },
// //       {
// //         "id": 2022102170,
// //         "name": "王梅尔",
// //         "sex": "男",
// //         "grade": 2022,
// //         "dept": 1,
// //         "major": 1,
// //         "credit": 24,
// //         "password": null
// //       },
// //       {
// //         "id": 2022102170,
// //         "name": "王梅尔",
// //         "sex": "男",
// //         "grade": 2022,
// //         "dept": 1,
// //         "major": 1,
// //         "credit": 24,
// //         "password": null
// //       },
// //       {
// //         "id": 2022102170,
// //         "name": "王梅尔",
// //         "sex": "男",
// //         "grade": 2022,
// //         "dept": 1,
// //         "major": 1,
// //         "credit": 24,
// //         "password": null
// //       },
// //       {
// //         "id": 2022102170,
// //         "name": "王梅尔",
// //         "sex": "男",
// //         "grade": 2022,
// //         "dept": 1,
// //         "major": 1,
// //         "credit": 24,
// //         "password": null
// //       },
// //       {
// //         "id": 2022102170,
// //         "name": "王梅尔",
// //         "sex": "男",
// //         "grade": 2022,
// //         "dept": 1,
// //         "major": 1,
// //         "credit": 24,
// //         "password": null
// //       },
// //       {
// //         "id": 2022102170,
// //         "name": "王梅尔",
// //         "sex": "男",
// //         "grade": 2022,
// //         "dept": 1,
// //         "major": 1,
// //         "credit": 24,
// //         "password": null
// //       },
// //       {
// //         "id": 2022102170,
// //         "name": "王梅尔",
// //         "sex": "男",
// //         "grade": 2022,
// //         "dept": 1,
// //         "major": 1,
// //         "credit": 24,
// //         "password": null
// //       },
// //       {
// //         "id": 2022102170,
// //         "name": "王梅尔",
// //         "sex": "男",
// //         "grade": 2022,
// //         "dept": 1,
// //         "major": 1,
// //         "credit": 24,
// //         "password": null
// //       },
// //       {
// //         "id": 2022102170,
// //         "name": "王梅尔",
// //         "sex": "男",
// //         "grade": 2022,
// //         "dept": 1,
// //         "major": 1,
// //         "credit": 24,
// //         "password": null
// //       },
// //       {
// //         "id": 2022102170,
// //         "name": "王梅尔",
// //         "sex": "男",
// //         "grade": 2022,
// //         "dept": 1,
// //         "major": 1,
// //         "credit": 24,
// //         "password": null
// //       },
// //       {
// //         "id": 2022102170,
// //         "name": "王梅尔",
// //         "sex": "男",
// //         "grade": 2022,
// //         "dept": 1,
// //         "major": 1,
// //         "credit": 24,
// //         "password": null
// //       },
// //       {
// //         "id": 2022102170,
// //         "name": "王梅尔",
// //         "sex": "男",
// //         "grade": 2022,
// //         "dept": 1,
// //         "major": 1,
// //         "credit": 24,
// //         "password": null
// //       },
// //       {
// //         "id": 2022102171,
// //         "name": "王梅尔",
// //         "sex": "男",
// //         "grade": 2022,
// //         "dept": 1,
// //         "major": 1,
// //         "credit": 2,
// //         "password": null
// //       },
// //       {
// //         "id": 2022102172,
// //         "name": "王勾八",
// //         "sex": "男",
// //         "grade": 2022,
// //         "dept": 1,
// //         "major": 1,
// //         "credit": 2,
// //         "password": null
// //       },
// //       {
// //         "id": 2022102174,
// //         "name": "郭梅尔",
// //         "sex": "女",
// //         "grade": 2022,
// //         "dept": 7,
// //         "major": 4,
// //         "credit": 24,
// //         "password": null
// //       }
// //     ],
// //     "total": 4,
// //     "size": 40,
// //     "current": 1,
// //     "orders": [],
// //     "optimizeCountSql": true,
// //     "searchCount": true,
// //     "maxLimit": null,
// //     "countId": null,
// //     "pages": 0
// //   }
// // })

// mock('/api-admin/teacher/add', 'post', {
//   "errorMessage": "",
//   "code": 200,
//   "data": null
// })

// mock('/api-admin/admin/update', 'put', {
//   "errorMessage": "",
//   "code": 200,
//   "data": null
// })

// mock(/^\/api-admin\/admin\/page/, 'get', {
//   "code": 200,
//   "errorMessage": "操作成功",
//   "data": {
//     "records": [
//       {
//         "id": 2022102170,
//         "sex": "男",
//         "name": "王梅尔",
//         "dept": 1,
//         "admin": 0,
//         "entryDate": '2022-10-17',
//         "title": null,
//       },
//       {
//         "id": 1,
//         "sex": "男",
//         "name": "王梅尔",
//         "dept": 1,
//         "admin": 1,
//         "entryDate": '2022-10-17',
//         "title": '副教授',
//       },
//       {
//         "id": 2022102170,
//         "sex": "男",
//         "name": "王梅尔",
//         "dept": 1,
//         "admin": 0,
//         "entryDate": '2022-10-17',
//         "title": '副教授',
//       },
//       {
//         "id": 2022102170,
//         "sex": "男",
//         "name": "王梅尔",
//         "dept": 1,
//         "admin": 0,
//         "entryDate": '2022-10-17',
//         "title": '副教授',
//       },
//       {
//         "id": 2022102170,
//         "sex": "男",
//         "name": "王梅尔",
//         "dept": 1,
//         "admin": 0,
//         "entryDate": '2022-10-17',
//         "title": '副教授',
//       },
//       {
//         "id": 2022102170,
//         "sex": "男",
//         "name": "王梅尔",
//         "dept": 1,
//         "admin": 0,
//         "entryDate": '2022-10-17',
//         "title": '副教授',
//       },
//       {
//         "id": 2022102170,
//         "sex": "男",
//         "name": "王梅尔",
//         "dept": 1,
//         "admin": 0,
//         "entryDate": '2022-10-17',
//         "title": '副教授',
//       },
//       {
//         "id": 2022102170,
//         "sex": "男",
//         "name": "王梅尔",
//         "dept": 1,
//         "admin": 0,
//         "entryDate": '2022-10-17',
//         "title": '副教授',
//       },
//       {
//         "id": 2022102170,
//         "sex": "男",
//         "name": "王梅尔",
//         "dept": 1,
//         "admin": 0,
//         "entryDate": '2022-10-17',
//         "title": '副教授',
//       },
//       {
//         "id": 2022102170,
//         "sex": "男",
//         "name": "王梅尔",
//         "dept": 1,
//         "admin": 0,
//         "entryDate": '2022-10-17',
//         "title": '副教授',
//       },
//       {
//         "id": 2022102170,
//         "sex": "男",
//         "name": "王梅尔",
//         "dept": 1,
//         "admin": 0,
//         "entryDate": '2022-10-17',
//         "title": '副教授',
//       },
//       {
//         "id": 2022102170,
//         "sex": "男",
//         "name": "王梅尔",
//         "dept": 1,
//         "admin": 0,
//         "entryDate": '2022-10-17',
//         "title": '副教授',
//       },
//       {
//         "id": 2022102170,
//         "sex": "男",
//         "name": "王梅尔",
//         "dept": 1,
//         "admin": 0,
//         "entryDate": '2022-10-17',
//         "title": '副教授',
//       },
//       {
//         "id": 2022102170,
//         "sex": "男",
//         "name": "王梅尔",
//         "dept": 1,
//         "admin": 0,
//         "entryDate": '2022-10-17',
//         "title": '副教授',
//       },
//       {
//         "id": 2022102170,
//         "sex": "男",
//         "name": "王梅尔",
//         "dept": 1,
//         "admin": 0,
//         "entryDate": '2022-10-17',
//         "title": '副教授',
//       },
//     ],
//     total: 15,
//   }
// })
