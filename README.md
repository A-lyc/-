# -Editor.vue：
---
### 具有富文本编辑器和点击上传图片进行裁切，需要element和quill以及vue-cropper组合完成

需要全局安装
element - npm i element-ui -S
quill - npm install -d vue-quill-editor quill 
vue-cropper - npm install -d vue-cropper

### vue单独导入 - 可能出现dem和win问题 - 百度
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

接收内容 @change - <editor @change="contentEdit" ref="edit"></editor>
