import ReconnectingWebSocket from "reconnecting-websocket"
import { WS_URL } from "./consts"
import eventEmitter from "@/utils/EventEmitter"

let ws: ReconnectingWebSocket | null = null

export function createWs() {
  if (ws)
    return
  ws = new ReconnectingWebSocket(WS_URL, [], { maxRetries: 5 })
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
  ws.onerror = err => {
    console.error("ws error:", err)
  }
}

export function closeWs() {
  ws?.close()
  ws = null
}
