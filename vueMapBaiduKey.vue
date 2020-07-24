<template>
  <div>
    <!--地图模块-->
    <label class="row">
      <slot name="buttom">
        <el-input class="col-6" v-model="keyword"></el-input>
        <el-button @click="centerDialogVisibleClick" plain>查找位置</el-button>
      </slot>
    </label>
    <el-dialog
      title="学校地址"
      :visible.sync="centerDialogVisible"
      width="1000px"
      top="2vh"
      center>
      <!-- getPoint方法，给地图加点击事件，点击地图获取所需要的信息，-->
      <!--scroll-wheel-zoom属性是否可以用鼠标滚轮控制地图缩放-->
      <baidu-map :scroll-wheel-zoom="true" :zoom="zoom" @click="getPoint" center="滨州市" style="width: 100%;height: 400px"
                 class="map" id="mapID">
        <!--地图类型，两种：一种是路线一种是绿的那种 :showAddressBar="true"是否显示默认的弹窗-->
        <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
                     anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
        <!--地图搜索功能，绑定上面的input，-->
        <!--display: none样式很关键，因为下面默认会有地址提示信息很长，很烦，这样搜索会很舒服，-->
        <!--zoom是搜索结果的视图比例，个人觉得12.8很舒服显示-->
        <bm-local-search :auto-viewport="true"
                         :keyword="keyword"
                         :location="location" style="display: none"
                         zoom="12.8"></bm-local-search>
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <!--      信息窗口，show属性是控制显示隐藏，infoWindowClose和infoWindowOpen是控制信息窗口关闭隐藏的方法-->
        <bm-marker :position="postionMap">
          <bm-info-window :show="show" @close="infoWindowClose" @open="infoWindowOpen" style="font-size: 14px">
            <p>学校名称：{{ add.jgName }}</p>
            <p>当前地址：{{ add.site }}</p>
          </bm-info-window>
        </bm-marker>
      </baidu-map>


      <!--      //显示数据-->
      <div slot="footer" class="dialog-footer row">
        <ul class="list-group-flush col-10 row text-left">
          <slot name="schoolName"></slot>
          <li class="map-baidu-xinxi col-6 pr-1">
            <input type="text" class="form-control col-10 border-0 "
                   placeholder="输入学校位置"
                   aria-label="Example text with button addon"
                   aria-describedby="button-addon1"
                   v-model="keyword"></li>
          <li class="map-baidu-xinxi col-3 pr-1">经度：{{add.postionMap.lng}}</li>
          <li class="map-baidu-xinxi col-3 pr-1">维度：{{add.postionMap.lat}}</li>
          <li class="map-baidu-xinxi col-3 pr-1"><b>省：</b>{{add.province}}</li>
          <li class="map-baidu-xinxi col-3 pr-1"><b>市：</b>{{add.city}}</li>
          <li class="map-baidu-xinxi col-3 pr-1"><b>区：</b>{{add.district}}</li>
          <li class="map-baidu-xinxi col-3 pr-1"><b>街：</b>{{add.street}}</li>
        </ul>
        <div class="col-2">
          <el-button class="col-10 ml-0 mb-1" type="primary" @click="centerDialogVisibleOK">确 定</el-button>
          <el-button class="col-10 ml-0" @click="centerDialogVisible = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>


<script>
  export default {
    props:{
      mapKey:{
        type: String,
        default:''
      }
    },
    data() {
      return {
        //显示地图红点上的信息
        show: false,
        //地图坐标
        postionMap: {
          lng: '',
          lat: ''
        },
        //搜索框关键词
        keyword: '',
        //位置
        location: '',
        //放大比例
        zoom: 12.8,
        //位置详细信息
        address: '',
        //加
        add: {

          //站点名称 - 可不要 - 换成学校名
          siteName: '',
          //地址
          site: '',
          //经纬度
          postionMap: {
            lng: '',
            lat: ''
          },
          //备注说明
          desce: '',
          //类型
          type: '',
          //省
          province:'',
          //城市
          city:'',
          //区县
          district:'',
          //街道
          street:'',
        },
        centerDialogVisible: false
      }
    },
    methods: {
      //点击选取地图
      centerDialogVisibleClick() {
        this.centerDialogVisible = true
      },
      //点击确认发出事件
      centerDialogVisibleOK(){
        this.add.address = this.keyword
        this.centerDialogVisible = false
        this.$emit('mapMessage',this.add)
      },
      //点击地图获取一些信息，
      getPoint(e) {
        this.show = true
        this.postionMap.lng = e.point.lng     //通过  e.point.lng获取经度
        this.postionMap.lat = e.point.lat     //通过  e.point.lat获取纬度
        this.add.postionMap.lng = e.point.lng
        this.add.postionMap.lat = e.point.lat

        //创建地址解析器的实例
        let geocoder = new BMap.Geocoder()
        geocoder.getLocation(e.point, rs => {

          this.add.site = rs.address
          this.add.province = rs.addressComponents.province
          this.add.city = rs.addressComponents.city
          this.add.district = rs.addressComponents.district
          this.add.street = rs.addressComponents.street
        })
      },
      infoWindowClose() {
        this.show = false
      },
      infoWindowOpen() {
        //这里有个问题纠结了很久，百度的信息窗口默认有个点击其他地方就消失的事件，我没有找到
        //并且信息窗口点击一次显示，一次消失
        //于是我加了一个100毫秒的定时器，保证每次点击地图都可以展示信息窗口
        setInterval(() => {
          this.show = true
        }, 100)
      }
    },
    mounted() {
      setTimeout(()=> {
        this.keyword = this.mapKey
      },1000)
    }
  }
</script>


<style scoped>
  .map-baidu-xinxi{
    display: block;
    border-bottom: 1px solid rgba(0,0,0,.125);
    line-height: 2.5;
  }
  input:focus{ box-shadow: none }
</style>

