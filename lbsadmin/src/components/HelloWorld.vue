<template>
  <div style="width:100%;height:100%;position:relative;">
    <baidu-map
      :center="center"
      :zoom="zoom"
      @ready="onBMapReady"
      style="height:800px"
      @click="getClickInfo"
      :scroll-wheel-zoom="true"
    ></baidu-map>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { WSService } from "@/service/ws.service";
// import { particles } from "@/utils/bgparticles";

@Component({
  data: () => {
    return {
      center: { lng: 109.45744048529967, lat: 36.49771311230842 },
      zoom: 13
    };
  }
})
export default class HelloWorld extends Vue {
  //   @Prop() private center!: { lng: number; lat: number };
  //   @Prop() private zoom!: number;
  private sid = "testagv"; // new Date().getTime();
  private wsSvc!: WSService;

  constructor() {
    super();
    console.log("constructed.");
    // this.initWsSvc();
  }

  public created(): void {
    console.log("created.");
  }

  public mounted(): void {
    console.log("mounted.");
  }

  public onBMapReady(data: any) {
    const point = new data.BMap.Point(109.49926175379778, 36.60449676862417);
    data.map.centerAndZoom(point, 13);
    const marker = new data.BMap.Marker(point); // 创建标注
    data.map.addOverlay(marker); // 将标注添加到地图中
    const circle = new data.BMap.Circle(point, 8, {
      strokeColor: "Blue",
      strokeWeight: 8,
      strokeOpacity: 1,
      Color: "Red",
      fillColor: "#dd2233"
    });
    data.map.addOverlay(circle);
  }

  public getClickInfo(e: any) {
    console.log(e.point.lng);
    console.log(e.point.lat);
  }

  async initWsSvc() {
    this.sid = "testagv";
    this.wsSvc = new WSService();
    this.wsSvc.connect(this.sid);
    this.wsSvc.msgSubject.subscribe(async data => {
      console.log(data);
    });
  }

  public processRemoteEvent(data: any) {
    let jdata = data;
    if (typeof data == "string") {
      jdata = JSON.parse(data);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
