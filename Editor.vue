<template>
  <div style="height: 500px">
    <!-- 图片上传组件-->
    <el-upload
      id="quill-input-all"
      :before-upload="beforeUpload"
      :show-file-list="false"
      accept="image/*"
      action=""
      class="avatar-uploader"
      hidden
      name="file"
      type='file'>
      <el-button size="small" type="primary">点击上传图片 到 文本编辑器</el-button>
    </el-upload>
    <!-- 编辑器组件-->
    <quill-editor
      style="height: 400px"
      :options="editorOption"
      @change="onEditorChange($event)"
      class="editor"
      ref="myQuillEditor"
      v-model="content">
    </quill-editor>
    <!-- 图片裁剪组件-->
    <el-dialog :visible.sync="isShowCropper" top="5vh" width="1260px"  :close-on-press-escape="false" :close-on-click-modal="false">
        <VueCropper
          :autoCrop="option.autoCrop"
          :autoCropHeight="option.autoCropHeight"
          :autoCropWidth="option.autoCropWidth"
          :canScale="option.canScale"
          :fixed="option.fixed"
          :fixedNumber="option.fixedNumber"
          :img="option.img"
          :info="option.info"
          :outputSize="option.outputSize"
          :outputType="option.outputType"
          ref="cropper"
          :full="option.full"
          style="height:600px;margin:20px 0;"
        >
        </VueCropper>
      <br/>

      <el-button @click="onCubeImg()" type="primary">生成图片</el-button>
      <el-button @click="isShowCropper = false">取消</el-button>
    </el-dialog>
  </div>
</template>
<script>
  // 富文本工具栏配置
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
    // ['blockquote', 'code-block'], // 引用  代码块
    // [{ header: 1 }, { header: 2 }], // 1、2 级标题
    [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
    // [{ script: 'sub' }, { script: 'super' }], // 上标/下标
    [{ indent: '-1' }, { indent: '+1' }], // 缩进
    // [{'direction': 'rtl'}],                         // 文本方向
    [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
    [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
    // [{ font: [] }], // 字体种类
    [{ align: [] }], // 对齐方式
    ['clean'], // 清除文本格式
    ['image', 'video'] // 链接 - link、图片、视频
  ]


  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  //导入上传图片的api
  import { uImage } from '@/api/uploadImage.js'

  export default {
    name: 'textEditor',
    props: {

      /*图片大小*/
      maxSize: {
        type: Number,
        default: 2000 //kb
      },
      /*编辑器的内容*/
      aboutActive:{
        type:String
      }

    },
    data() {
      return {
        token:this.$store.state.access_token,
        // 富文本数据
        content: this.aboutActive,
        quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
        editorOption: {
          theme: 'snow', // or 'bubble'
          placeholder: '请输入您想输入的内容',
          modules: {
            toolbar: {
              container: toolbarOptions,
              // 和上传按钮进行绑定
              handlers: {
                image: function(value) {
                  //console.log(value)
                  if (value) {
                    // 触发input框选择图片文件
                    document.querySelector(`#quill-input-all input`).click()
                  } else {
                    this.quill.format('image', false)
                  }
                }
              }
            }
          }
        },
        // 切图器数据
        option: {
          img: '',                         // 裁剪图片的地址
          info: true,                      // 裁剪框的大小信息
          outputSize: 1,                   // 裁剪生成图片的质量
          outputType: 'png',               // 裁剪生成图片的格式
          canScale: true,                 // 图片是否允许滚轮缩放
          autoCrop: true,                  // 是否默认生成截图框
          autoCropWidth: 150,              // 默认生成截图框宽度
          autoCropHeight: 150,             // 默认生成截图框高度
          fixedNumber: [4, 4],             // 截图框的宽高比例
          full:true                       //是否输出原图比例的截图
        },
        isShowCropper: false,
        isClient: true,
        width: '300px',
        height: '400px'
      }
    },
    methods: {
      // 上传切图前调用
      beforeUpload(file) {
        /**
         * URL.createObjectURL(file)生成本地的url
         * 返回false终止了自动上传
         * */
        this.option.img = URL.createObjectURL(file)
        this.option.autoCropWidth = this.width
        this.option.autoCropHeight = this.height
        this.isShowCropper = true
        return false
      },
      // 确定裁剪图片
      onCubeImg() {
        // 获取cropper的截图的base64 数据data
        this.$refs.cropper.getCropData(data => {
          //截取bas64 截取base64的格式 和 图片的后缀名
          let baseSplit= data.split(',')
          let format = baseSplit[0].split('/')[1].split(';')[0]
          //获取base64格式的信息
          let base = ''
          if (process.client) {
            base = window.atob(baseSplit[1])
          }
          //转格式：base64转图片
          /**
           *格式为：File
           * lastModified: 1593134876792
           * lastModifiedDate: Fri Jun 26 2020 09:27:56 GMT+0800 (中国标准时间) {}
           * name: "img.png"
           * size: 15407
           * type: "image/png"
           * webkitRelativePath: ""
           * */
          let index = base.length
          let u8arr = new Uint8Array(index)
          while (index--) {
            u8arr[index] = base.charCodeAt(index)
          }
          let blods = new File([u8arr],'img.' + format,{type: 'image/' + format })

          /**
           * 建立一个formData表单，之后把上面的base64转换后的格式使用append传递给FormData
           * */
          let fromData = new FormData()
          fromData.append('file',blods)

          this.$notify({
            title: '成功',
            message: '正在上传中',
            type: 'success'
          });
          //发出网络请求
          this.$api.uImage(fromData,this.token).then(res => {
            this.$notify({
              title: '成功',
              message: '图片上传成功',
              type: 'success'
            });
            // 获取富文本组件实例
            let quill = this.$refs.myQuillEditor.quill
            //console.log(quill)
            if(res.code === 200){
              // 获取光标所在位置
              /**
               *  quill.insertEmbed(length, 'image', res.data.url)
               *  图片显示的位置，根据length后的位置显示
               * */
              if (quill.getSelection() && quill.getSelection().index) {
                let length = quill.getSelection().index
                quill.insertEmbed(length, 'image', res.data.url)
              } else {
                let length = 0
                quill.insertEmbed(length, 'image', res.data.url)
              }
              // 调整光标到最后
              quill.setSelection(length + 1)
            }else {
              //console.log(res.code)
              this.$notify({
                title: '警告',
                message: '图片上传失败',
                type: 'warning'
              });
            }
            this.isShowCropper = false
            // 先将显示图片地址清空，防止重复显示
            this.option.img = ''
          })
        })
      },
      onEditorChange() {
        //console.log(this.content)
        //富文本内容改变事件 发送给父级元素 @change事件
        this.$emit('change', this.content)
      }
    },
    mounted() {
      //console.log(this.aboutActive)
      setTimeout(() => {
        this.content = this.value
      }, 500)
    },
    created(){
      setTimeout(() => {
        this.content = this.aboutActive
        //console.log(this.aboutActive)
      }, 1000)
    }
  }
</script>
<style lang="scss">

</style>

