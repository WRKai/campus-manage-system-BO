import ReconnectingWebSocket from "reconnecting-websocket"
import { WS_BASE_URL } from "./consts"
import eventEmitter from "@/utils/EventEmitter"
import { useUserStore } from "@/stores/userStore"

let ws: ReconnectingWebSocket | null = null

export function createWs() {
  if (ws)
    return
  ws = new ReconnectingWebSocket(WS_BASE_URL + useUserStore().getToken(), [], { maxRetries: 5 })
  ws.onopen = () => {
    console.log("ws open!")
  }
  ws.onmessage = e => {
    const data = JSON.parse(e.data) as {
      "errorMessage": string,
      "code": number,
      "data": any
    }
    switch (data.code) {
      case 1:
        eventEmitter.emit('new-add-course-apply')
        break;
      case 2:
        eventEmitter.emit('new-add-lesson-apply')
    }
  }
  ws.onclose = () => {
    console.log("ws close!")
  }
  ws.onerror = e => {
    console.error(e.error)
  }
}

export function closeWs() {
  ws?.close()
  ws = null
}
