import {Notification} from "../common/component/Notification";
import StorageUtil from "../common/utils/StorageUtil";
import ObjectUtil from "../common/utils/ObjectUtil";

let WsConn: WebSocket

export default class WsClient {

    public wsConn: WebSocket
    public send: (targetId: string, msg: string) => void
    private readonly open: () => void
    private readonly receive: (msg: string) => void
    private access = true

    constructor(openFunc: () => void, receiveFunc: (msg: string) => void) {
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
        this.open = openFunc
        this.receive = receiveFunc
    }

    public static Client = (openFunc: () => void, receiveFunc: (msg: string) => void) => {
        return new WsClient(openFunc, receiveFunc)
    }

    public available = () => {
        return this.access
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