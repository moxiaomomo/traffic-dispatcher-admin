import { interval, Subject, Subscription } from 'rxjs';


export class WSService {
    public msgSubject: Subject<string>;

    private static websocket: WebSocket;
    private static reconnectSubscribe: Subscription;
    private static connected = false;
    private static reconnecting = false;
    // private static checkPeriod = 600 * 1000;
    private static retryPeriod = 5000;
    private static sid: string;

    private static wsURL = "ws://192.168.200.174:8080/ws/AGV/";
    // private wsProtocal = "ws";

    constructor() {
        this.msgSubject = new Subject<string>();

        setInterval(() => {
            // 未建立过连接
            if (!WSService.websocket) {
                return;
            }
            // 正在重连
            if (WSService.reconnecting) {
                return;
            }
            // 连接已经在ready状态
            if (WSService.websocket.readyState == 1) {
                return;
            }
            this.reconnect();
        }, 1000);
    }

    connect(sid: string) {
        if (WSService.websocket && WSService.websocket.readyState == 1) {
            return;
        }
        WSService.sid = sid;
        // WSService.websocket = new WebSocket(this.wsURL, this.wsProtocal);
        WSService.websocket = new WebSocket(WSService.wsURL + sid);
        WSService.websocket.onopen = (e) => this.onOpen(e);
        WSService.websocket.onmessage = (e) => this.onMessage(e);
        WSService.websocket.onclose = (e) => this.onClose(e);
        WSService.websocket.onerror = (e) => this.onError(e);
    }

    onOpen(e: Event) {
        console.log('websocket connected.');
        WSService.connected = true;
        this.msgSubject.next('CONN_OPEN');
        if (WSService.reconnecting) {
            this.stopReconnect();
        }
    }

    onMessage(e: MessageEvent) {
        try {
            const msg = JSON.parse(e.data);
            this.msgSubject.next(msg);
        } catch (e) {
            console.log(e);
        }

    }

    onClose(e: CloseEvent) {
        console.log('websocket disconnected.');
        WSService.connected = false;
        WSService.websocket.close();
        this.reconnect();
    }

    onError(e: Event) {
        console.log('websocket connection error.');
        WSService.connected = false;
    }

    sendMessage(msg: string) {
        WSService.websocket.send(msg);
    }

    reconnect() {
        if (WSService.connected) {
            this.stopReconnect();
            console.log('stop reconnect as websocket connected.')
            return;
        }
        if (WSService.reconnecting) {
            console.log('reconnecting...')
            return;
        }
        WSService.reconnecting = true;
        WSService.reconnectSubscribe = interval(WSService.retryPeriod).subscribe(async (val) => {
            this.connect(WSService.sid);
        });
    }

    stopReconnect() {
        WSService.reconnecting = false;
        if (WSService.reconnectSubscribe) {
            WSService.reconnectSubscribe.unsubscribe();
        }
    }
}