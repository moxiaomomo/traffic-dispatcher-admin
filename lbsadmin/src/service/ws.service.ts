import { interval, Subject, Subscription } from 'rxjs';

export class WSService {
  public static msgSubject: Subject<string>;

  private static websocket: WebSocket;
  private static reconnectSubscribe: Subscription;
  private static connected = false;
  private static reconnecting = false;
  // private static checkPeriod = 600 * 1000;
  private static retryPeriod = 5000;
  private static sid: string;

  // private static wsURL = "ws://192.168.200.174:8080/ws/AGV/";
  private static wsProtocal = 'lbs';
  private static wsURL = 'ws://testsvc.keke.com:8082/ws/lbs';

  public static initiate() {
    WSService.msgSubject = new Subject<string>();

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
      WSService.reconnect();
    }, 1000);
  }

  public static connect(sid: string) {
    if (WSService.websocket && WSService.websocket.readyState == 1) {
      return;
    }
    WSService.sid = sid;
    // WSService.websocket = new WebSocket(WSService.wsURL, WSService.wsProtocal);
    WSService.websocket = new WebSocket(
      `${WSService.wsURL}?sid=${sid}`,
      WSService.wsProtocal
    );
    WSService.websocket.onopen = (e) => WSService.onOpen(e);
    WSService.websocket.onmessage = (e) => WSService.onMessage(e);
    WSService.websocket.onclose = (e) => WSService.onClose(e);
    WSService.websocket.onerror = (e) => WSService.onError(e);
  }

  public static onOpen(e: Event) {
    console.log('websocket connected.');
    WSService.connected = true;
    WSService.msgSubject.next('CONN_OPEN');
    if (WSService.reconnecting) {
      WSService.stopReconnect();
    }
  }

  public static onMessage(e: MessageEvent) {
    try {
      const msg = JSON.parse(e.data);
      WSService.msgSubject.next(msg);
    } catch (e) {
      console.log(e);
    }
  }

  public static onClose(e: CloseEvent) {
    console.log('websocket disconnected.');
    WSService.connected = false;
    WSService.websocket.close();
    WSService.reconnect();
  }

  public static onError(e: Event) {
    console.log(e);
    console.log('websocket connection error.');
    WSService.connected = false;
  }

  public static sendMessage(msg: string) {
    WSService.websocket.send(msg);
  }

  public static reconnect() {
    if (WSService.connected) {
      WSService.stopReconnect();
      console.log('stop reconnect as websocket connected.');
      return;
    }
    if (WSService.reconnecting) {
      console.log('reconnecting...');
      return;
    }
    WSService.reconnecting = true;
    WSService.reconnectSubscribe = interval(WSService.retryPeriod).subscribe(
      async (val) => {
        WSService.connect(WSService.sid);
      }
    );
  }

  public static stopReconnect() {
    WSService.reconnecting = false;
    if (WSService.reconnectSubscribe) {
      WSService.reconnectSubscribe.unsubscribe();
    }
  }
}
