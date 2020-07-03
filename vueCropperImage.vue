<template>
  <el-dialog :visible.sync="isShowCropper" top="5vh">
    <VueCropper
      :autoCrop="option.autoCrop"
      :autoCropHeight="option.autoCropHeight"
      :autoCropWidth="option.autoCropWidth"
      :canScale="option.canScale"
      :fixed="option.fixed"
      :fixedNumber="option.fixedNumber"
      :img="cropperPic"
      :info="option.info"
      :outputSize="option.outputSize"
      :outputType="option.outputType"
      ref="cropper"
      style="height:600px;margin:20px 0"
    >
    </VueCropper>
    <br/>
    <el-button @click="onCubeImg()" type="primary">生成图片</el-button>
    <el-button @click="isShowCropper = false">取消</el-button>
  </el-dialog>
</template>

<script>
  import { uImage } from '@/api/uploadImage.js'

  export default {
    name: 'vueCropperImage',
    props:{
      isShowCropper:{
        type:Boolean,
        default:false
      },
      cropperPic:''

    },
    data(){
      return {
        option: {
          img: '',                         // 裁剪图片的地址
          info: true,                      // 裁剪框的大小信息
          outputSize: 1,                   // 裁剪生成图片的质量
          outputType: 'png',               // 裁剪生成图片的格式
          canScale: true,                 // 图片是否允许滚轮缩放
          autoCrop: true,                  // 是否默认生成截图框
          autoCropWidth: 240,              // 默认生成截图框宽度
          autoCropHeight: 120,             // 默认生成截图框高度
          fixed: true,                    // 是否开启截图框宽高固定比例
          fixedNumber: [2, 1]             // 截图框的宽高比例
        },
        isShowCropper: false,
        isClient: true,
        width: '240px',
        height: '120px'
      }
    },
    methods:{
      onCubeImg() {
        this.$refs.cropper.getCropData(data => {
          //截取bas64 截取base64的格式 和 图片的后缀名
          let baseSplit = data.split(',')
          let format = baseSplit[0].split('/')[1].split(';')[0]
          //获取base64格式的信息
          let base = ''
          if (process.client) {
            base = window.atob(baseSplit[1])
          }
          //转格式：base64转图片
          let index = base.length
          let u8arr = new Uint8Array(index)
          while (index--) {
            u8arr[index] = base.charCodeAt(index)
          }
          let blods = new File([u8arr], 'img.' + format, { type: 'image/' + format })
          let fromData = new FormData()
          fromData.append('file', blods)

          this.$notify({
            title: '成功',
            message: '正在上传中',
            type: 'success'
          })
          uImage(fromData).then(res => {
            console.log(res)
            if (res.code === 200) {
              this.$notify({
                title: '成功',
                message: '图片上传成功',
                type: 'success'
              })
              // this.ruleForm.imageUrlLogo = res.data.url
              this.$emit("uploadImage",res.data.url)
            } else {
              this.$notify({
                title: '警告',
                message: '图片上传失败',
                type: 'warning'
              })
            }
            //无论成功失败都要关闭
            this.isShowCropper = false
            // 先将显示图片地址清空，防止重复显示
            this.option.img = ''
          })
        })
      },
    }
  }
</script>

<style scoped>

</style>
