<template>
  <div class="home-container">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <HelloWorld style="width:100%;height:100%;" :locs="locs" />
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import HelloWorld, { GeoLocation } from "@/components/HelloWorld.vue";
import { Component, Vue, Prop } from "vue-property-decorator";
import { WSService } from "../service/ws.service";

// export default {
//   name: "Home",
//   components: {
//     HelloWorld
//   }
// };

@Component({
  components: {
    HelloWorld
  }
})
export default class Home extends Vue {
  private locs: GeoLocation[] = [];
  private sidPrefix = "lbsclient_";
  public mounted(): void {
    WSService.initiate();
    WSService.connect(this.sidPrefix + new Date().getDate());
    const that = this;
    WSService.msgSubject.subscribe((data: any) => {
      if (!(data instanceof Array)) {
        console.log("Unknown message:" + data);
        return;
      }
      that.locs = [];
      for (let ele of data) {
        const geo = ele.geoinfo.coordinates;
        if (geo instanceof Array && geo.length == 2) {
          that.locs.push({ lng: geo[0], lat: geo[1] });
        }
      }
    });
    setInterval(() => {
      WSService.sendMessage(JSON.stringify({ lon: 116.404, lat: 39.915 }));
    }, 5000);
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  padding: 32px;
  height: 100%;
  background-color: rgb(240, 242, 245, 0.8);
  position: relative;
}
</style>
