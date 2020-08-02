<template>
  <div class="home-container">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <LBSStat style="width:100%;height:100%;" :locs="locs" />
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import LBSStat from "@/components/LBSStat/LBSStat.vue";
import { Component, Vue, Prop } from "vue-property-decorator";
import { WSService } from "../service/ws.service";
import { GeoLocation } from "../components/LBSStat/LBSStat.vue";

@Component({
  components: {
    LBSStat,
  },
})
export default class Home extends Vue {
  private locs: GeoLocation[] = [];
  private sidPrefix = "lbsclient_";
  public mounted(): void {
    WSService.initiate();
    WSService.connect(this.sidPrefix + new Date().getDate());
    WSService.msgSubject.subscribe((data: any) => {
      if (!(data instanceof Array)) {
        console.log("Unknown message:" + data);
        return;
      }
      this.locs = [];
      for (const ele of data) {
        const geo = ele.geoinfo.coordinates;
        if (geo instanceof Array && geo.length == 2) {
          this.locs.push({ lng: geo[0], lat: geo[1] });
        }
      }
    });
    setInterval(() => {
      WSService.sendMessage(JSON.stringify({ lng: 116.404, lat: 39.915 }));
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
