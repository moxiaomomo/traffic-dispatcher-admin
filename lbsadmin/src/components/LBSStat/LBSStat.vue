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

export interface GeoLocation {
  lng: number;
  lat: number;
}

interface BMapData {
  BMap: any;
  map: any;
}

@Component({
  data: () => {
    return {
      center: { lng: 109.45744048529967, lat: 36.49771311230842 },
      zoom: 13,
    };
  },
})
export default class LBSStat extends Vue {
  @Prop() locs!: GeoLocation[];
  private bmData!: BMapData;

  constructor() {
    super();
    console.log("constructed.");
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

    this.bmData = data;
  }

  @Watch("locs")
  public updateFlags() {
    if (!this.bmData) {
      return;
    }

    // 需要先清除overlay
    this.bmData.map.clearOverlays();

    for (const tmpPoint of this.locs) {
      // 创建底部标注
      const circle2 = new this.bmData.BMap.Circle(tmpPoint, 32, {
        strokeColor: "#ee1111", // "#11ee11",
        strokeWeight: 32,
        strokeOpacity: 0.5,
      });
      this.bmData.map.addOverlay(circle2);
      // const circle1 = new this.bmData.BMap.Circle(tmpPoint, 28, {
      //   strokeColor: "#ee1111",
      //   strokeWeight: 28,
      //   strokeOpacity: 1,
      // });
      // this.bmData.map.addOverlay(circle1);
      // 创建小车图标
      const myIcon = new this.bmData.BMap.Icon(
        "/image/car-15-2.png",
        new this.bmData.BMap.Size(32, 32)
      );
      const marker = new this.bmData.BMap.Marker(tmpPoint, {
        icon: myIcon,
      });
      this.bmData.map.addOverlay(marker);
    }
  }

  public getClickInfo(e: any) {
    console.log(e.point.lng);
    console.log(e.point.lat);
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
