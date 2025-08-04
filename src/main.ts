import './assets/css/main.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';
import VueApexCharts from 'vue3-apexcharts'
import globalComponent from '@/helpers/import-global-components';

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import Editor from "@tinymce/tinymce-vue";

const app = createApp(App)

Object.entries(globalComponent).forEach(([name, component]) => {
    app.component(name, component);
})

app.directive('click-outside', {
    mounted(el, binding) {
    el.__ClickOutsideHandler__ = (event:any) => {
      if (!(el === event.target || el.contains(event.target))) {
        if (typeof binding.value === 'function') {
        }
      }
    };
    document.addEventListener('click', el.__ClickOutsideHandler__);
  },
  unmounted(el) {
    document.removeEventListener('click', el.__ClickOutsideHandler__);
    delete el.__ClickOutsideHandler__; // Xóa tham chiếu để tránh rò rỉ bộ nhớ
    }
});

app.component('Cropper', Cropper);
app.component('QuillEditor', QuillEditor)
app.component('Editor', Editor)
app.use(createPinia())
app.use(router)

app.mount('#app')
