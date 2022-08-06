import {Notification} from "../common/component/Notification";
import StorageUtil from "../common/utils/StorageUtil";
import ObjectUtil from "../common/utils/ObjectUtil";
import WsResp from "./model/WsResp";

let WsConn: WebSocket
let wsClient: WsClient

export default class WsClient {

    public wsConn: WebSocket
    public send: (targetId: string, msg: string) => void
    public open?: () => void
    public receive?: (msg: string) => void
    private access = true

    constructor() {
        if (ObjectUtil.isNull(WsConn)) {
            const token = StorageUtil.get("auth")
            if (token != null) {
                this.conn(token)
            }
        }
        this.wsConn = WsConn
        this.send = (targetId: string, msg: string) => {
            WsConn.send("{\"targetId\":\"" + targetId + "\", \"msg\":\"" + msg + "\"}");
        }
        // this.open = openFunc
        // this.receive = receiveFunc
    }

    public static Client = () => {
        if (wsClient == null) {
            wsClient = new WsClient()
        }
        return wsClient
    }

    public available = () => {
        return this.access
    }

    public addReceiveListener = (f: (data: WsResp) => void) => {
        WsConn.addEventListener('message', (event) => {
            const resp = new WsResp()
            const data = JSON.parse(event.data as string)
            resp.message = data.message
            resp.senderName = data.sender_name
            resp.senderNick = data.sender_nick
            resp.messageType = data.msg_type
            resp.messageTime = data.msg_time
            f(resp)
        });
    }

    private conn = (token: string) => {
        if (!token) {
            Notification.error("username is null")
            return
        }
        const url = "ws://localhost:8080/im?token="
        // const url = "ws://101.43.168.250:19993/im?username="
        WsConn = new WebSocket(url + token);
        WsConn.addEventListener('open', () => {
            Notification.success("成功建立连接")
            if (this.open)
                this.open()
        });

        // Listen for messages
        WsConn.addEventListener('message', (event) => {
            if (this.receive)
                this.receive(event.data)
        });

        // error
        WsConn.addEventListener('error', () => {
            Notification.error("建立连接失败")
            this.access = false
            return
        })
    }
}