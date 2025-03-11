import { AUTH } from "@/apis/"
export const WS_BASE_URL = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws?${AUTH}=`
