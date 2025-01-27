import { AUTH } from "@/apis/"
export const WS_BASE_URL = `${location.protocol === 'https:' ? 'wss' : 'ws'}://1.95.36.194/ws?${AUTH}=`
