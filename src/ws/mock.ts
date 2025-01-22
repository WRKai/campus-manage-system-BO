import { Server } from 'mock-socket'
import { WS_URL } from './consts';
const mockSever = new Server(WS_URL)
mockSever.on('connection', socket => {
  console.log('mockSever connected!');
  let codeNum = false
  setInterval(() => {
    codeNum = !codeNum
    socket.send(JSON.stringify({
      "errorMessage": "",
      "code": +codeNum + 1,
      "data": null
    }))
  }, 55555)
})
