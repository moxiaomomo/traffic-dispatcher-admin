<template>
  <div style="width:100%;height:100%;position:relative;">
    <baidu-map
      id="bdmapCanvas"
      :center="center"
      :zoom="zoom"
      @ready="onBMapReady"
      @click="getClickInfo"
      :scroll-wheel-zoom="true"
    ></baidu-map>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { WSService } from "@/service/ws.service";
// import { particles } from "@/utils/bgparticles";

export interface GeoLocation {
  lng: number;
  lat: number;
}

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
  // private sid = "testagv"; // new Date().getTime();
  // private wsSvc!: WSService;
  @Prop() locs!: GeoLocation[];
  private bmapData = null;

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
    const canvas = document.getElementById("bdmapCanvas") as HTMLElement;
    canvas.style.height = `${window.innerHeight - 150}px`;

    const point = new data.BMap.Point(116.404, 39.915);
    data.map.centerAndZoom(point, 15);

    this.bmapData = data;
  }

  @Watch("locs")
  public updateFlags() {
    if (!this.bmapData) {
      return;
    }
    for (let tmpPoint of this.locs) {
      // 创建标注
      const marker = new this.bmapData.BMap.Marker(tmpPoint);
      this.bmapData.map.addOverlay(marker);
      // 将标注添加到地图中
      const circle = new this.bmapData.BMap.Circle(tmpPoint, 8, {
        strokeColor: "Blue",
        strokeWeight: 8,
        strokeOpacity: 1,
        Color: "Red",
        fillColor: "#dd2233"
      });
      this.bmapData.map.addOverlay(circle);
    }
  }

  public getClickInfo(e: any) {
    console.log(e.point.lng);
    console.log(e.point.lat);
  }

  async initWsSvc() {
    //     this.sid = "testagv";
    //     this.wsSvc = new WSService();
    // this.wsSvc.connect(this.sid);
    // this.wsSvc.msgSubject.subscribe(async data => {
    //   console.log(data);
    // });
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
