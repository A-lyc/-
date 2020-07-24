# -Editor.vue：
---
### 具有富文本编辑器和点击上传图片进行裁切，需要element和quill以及vue-cropper组合完成 - 写可以，读的话待完善

需要全局安装
element - npm i element-ui -S
quill - npm install -d vue-quill-editor quill 
vue-cropper - npm install -d vue-cropper

### vue单独导入 - 可能出现dom和win问题 - 百度
import { quillEditor } from "vue-quill-editor";
import { VueCropper } from "vue-cropper";

###  nuxt 需要全局导入，在nuxt.confing,js内
  plugins: [
   '@/plugins/element-ui',
    { src: '@/plugins/vue-quill-editor', ssr: false },
    { src: '@/plugins/vue-cropper', ssr: false },
    ]
###  都需要单独导入css
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

多个的时候需要确定一个id
 - 问题，id需要传入之后提前渲染页面
接收内容 @change - <editor @change="contentEdit" ref="edit" id="quill-input-all"></editor>

# -vueCropperImage.vue
---
安装：
vue-cropper - npm install -d vue-cropper
element - npm i element-ui -S

同上导入方法
父组件传入参数 img是图片地址  uploadImage返回图片地址
<el-dialog :visible.sync="isShowCropper" top="5vh" v-if="isShowCropper">
<vue-cropper-image :cropper-pic="img" @uploadImage="uploadImage" v-if="isShowCropper">
</vue-cropper-image>


时间戳转换时间：new Date(parseInt(item.updated_at) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ').split(' ')[0]
当前时间转换时间戳
let timestamp = Date.parse(new Date())
      //  当前时间的时间戳
let time = timestamp.toString().substr(0, 10)


# map
传输经纬度
 <vue-map-bai-du :map-active="map"></vue-map-bai-du>
 
 mapKey：接收地址，mapMessage：获取地理位置返回值
 <vue-map-baidu-key :mapKey="ruleForm.address" @mapMessage="mapMessage" ></vue-map-baidu-key>
