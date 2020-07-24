<template>
  <div style="height:450px;overflow: hidden">
    <baidu-map :center="{lng: mapActive.lng, lat: mapActive.lat }"
               :zoom="15" style="height:600px">
      <bm-marker :dragging="true" :position="{lng: mapActive.lng, lat: mapActive.lat}">
        <bm-info-window :show="show" class="map-info-win" style="font-size: 12px">
          <b>{{mapActive.name}}</b>
          <img class="mt-2 mb-2" src="~/static/image/map-bg.jpg">
          <b>学校地址：</b><br /><span>{{mapActive.address}}</span>
        </bm-info-window>
      </bm-marker>
    </baidu-map>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        jump_path: '',
        show: true,  //显示标签
        scroll: true,  //地图缩放
        dragging: true  //地图拖拽
      }
    },
    props: {
      mapActive: {
        type: Object,
        default() {
          return {
          }
        }
      }
    },
    methods: {

    },
  }
</script>
<style>
  .map-info-win {
    width: 300px;
  }
</style>
