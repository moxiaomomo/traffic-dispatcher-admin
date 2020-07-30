import Vue, { DirectiveOptions } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import { AppModule } from '@/store/modules/app';
import i18n from '@/lang';
import SvgIcon from 'vue-svgicon';
import ElementUI from 'element-ui';
import * as directives from '@/directives';
import * as filters from '@/filters';
import '@/permission';
import 'normalize.css';
import '@/styles/element-variables.scss';
import '@/styles/index.scss';
import '@/icons/components';

import BaiduMap from 'vue-baidu-map';

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key /
  ak: 'gCuNjb9QKbzQvpKsNGafij4GbI1fmkfL',
});

// Vue.use(antv);
Vue.use(ElementUI, {
  size: AppModule.size, // Set element-ui default size
  i18n: (key: string, value: string) => i18n.t(key, value),
});

Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em',
});

// Register global directives
Object.keys(directives).forEach((key) => {
  Vue.directive(key, (directives as { [key: string]: DirectiveOptions })[key]);
});

// Register global filter functions
Object.keys(filters).forEach((key) => {
  Vue.filter(key, (filters as { [key: string]: Function })[key]);
});

Vue.config.productionTip = false;
// Vue.prototype.$antMessage = message;
// Vue.prototype.$antNotification = notification;
// message.config({
//   duration: 2,
// });

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
