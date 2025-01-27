import { Server } from 'mock-socket'
import { WS_BASE_URL } from './consts';
import { useUserStore } from '@/stores/userStore';
const mockSever = new Server(WS_BASE_URL + useUserStore().getToken())
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
  }, 9999)
})
