<template>
  <div class="avatar-cropper">
    <div v-if="dataUrl" class="avatar-cropper-overlay">
      <div class="avatar-cropper-mark"></div>
      <div class="avatar-cropper-container">
        <!-- <a href="javascript:;" class="avatar-cropper-close" @click="destroy">&times;</a> -->
        <div class="avatar-cropper-image-container">
          <img ref="img" :src="dataUrl" alt="" @load.stop="createCropper" />
        </div>
        <div class="avatar-cropper-footer">
          <button class="avatar-cropper-btn" @click="destroy" v-text="labels.cancel">Cancel</button>
          <button class="avatar-cropper-btn" @click="submit" v-text="labels.submit">Submit</button>
        </div>
      </div>
    </div>
    <input ref="input" type="file" class="avatar-cropper-img-input" :accept="mimes">
  </div>
</template>

<script>
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import { getStore } from "src/config/mUtils";
export default {
  props: {
    trigger: {
      type: [String, Element],
      required: true
    },
    uploadHandler: {
      type: Function
    },
    file_path:{
      type:String
    },
    uploadUrl: {
      type: String
    },
    uploadHeaders: {
      type: Object
    },
    uploadFormName: {
      type: String,
      default: "file"
    },
    uploadFormData: {
      type: Object,
      default() {
        return {};
      }
    },
    cropperOptions: {
      type: Object,
      default() {
        return {
          aspectRatio: 1,
          autoCropArea: 1,
          dragMode: "move",
          guides: false,
          viewMode: 0,
          movable: true,
          zoomable: true,
          scalable: true
        };
      }
    },
    outputOptions: {
      type: Object,
      default() {
        return {
          width: 512,
          height: 512
        };
      }
    },
    outputMime: {
      type: String,
      default: "image/jpeg"
    },
    outputQuality: {
      type: Number,
      default: 0.9
    },
    mimes: {
      type: String,
      default: "image/*"
    },
    labels: {
      type: Object,
      default() {
        return {
          submit: "提交",
          cancel: "取消"
        };
      }
    },
    showCropper: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      cropper: undefined,
      dataUrl: undefined,
      filename: undefined
    };
  },
  methods: {
    destroy() {
      this.cropper.destroy();
      this.$refs.input.value = "";
      this.dataUrl = undefined;
    },
    submit() {
      this.$emit("submit");
      if (this.uploadUrl) {
        this.uploadImage();
      } else if (this.uploadHandler) {
        this.uploadHandler(this.cropper);
      } else {
        this.$emit("error", "No upload handler found.", "user");
      }
      this.destroy();
    },
    pickImage() {
      if (this.$refs.input.click) this.$refs.input.click();
    },
    createCropper() {
      this.cropper = new Cropper(this.$refs.img, this.cropperOptions);
    },
    uploadImage() {
      this.cropper.getCroppedCanvas(this.outputOptions).toBlob(
        blob => {
          this.uploadImageForm(blob);
        },
        this.outputMime,
        this.outputQuality
      );
    },
    uploadImageForm(blob) {
      console.log(blob);
      var _self = this;
      var newBlob;
      this.blobToDataURL(blob, function(dataurl) {
        // console.log(dataurl);
        _self.$vux.loading.show({
          text: "正在上传..."
        });
        _self.compressImg(dataurl, blob.type, { size: 1, scale: 0.8 }, function(
          base64
        ) {
          newBlob = _self.dataURLtoBlob(base64);
          console.log(newBlob);
          let form = new FormData();
          let xhr = new XMLHttpRequest();
          let data = Object.assign({}, _self.uploadFormData);
          for (let key in data) {
            form.append(key, data[key]);
          }
           var path=_self.file_path?_self.file_path:'temp';
          form.append('file_path','upload/'+path)

          form.append(_self.uploadFormName, newBlob, _self.filename);

          _self.$emit("uploading", form, xhr);

          xhr.open("POST", _self.uploadUrl, true);

          for (let header in _self.uploadHeaders) {
            xhr.setRequestHeader(header, _self.uploadHeaders[header]);
          }
          xhr.setRequestHeader("Device-Type", getStore("device_type"));
          xhr.setRequestHeader("Token", getStore("token"));
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              _self.$vux.loading.hide();
              let response = "";
              try {
                response = JSON.parse(xhr.responseText);
              } catch (err) {
                response = xhr.responseText;
              }
              _self.$emit("completed", response, form, xhr);

              if ([200, 201, 204].indexOf(xhr.status) > -1) {
                _self.$emit("uploaded", response, form, xhr);
              } else {
                _self.$emit("error", "Image upload fail.", "upload", xhr);
              }
            }
          };

          xhr.send(form);
        });
      });
    },
    compressImg(base64, type, options, callback) {
      console.log(type);
      var newBlob;
      var imgtype = type;
      var img = new Image();
      // 用图片对象加载读入的base64
      img.src = base64;
      img.onload = function() {
        var that = this,
          canvas = document.createElement("canvas"),
          ctx = canvas.getContext("2d");
        canvas.setAttribute("width", that.width);
        canvas.setAttribute("height", that.height);
        // 将图片画入canvas
        ctx.drawImage(that, 0, 0, that.width, that.height);

        // 压缩到指定体积以下（M）
        if (base64.length / 1024 / 1024 > options.size) {
          var scale = 0.9;
          (function f(scale) {
            if (base64.length / 1024 / 1024 > options.size && scale > 0) {
              base64 = canvas.toDataURL(imgtype, scale);
              scale = scale - 0.02;
              f(scale);
            } else {
              callback(base64);
            }
          })(scale);
        } else {
          // 按比率压缩
          console.log(base64.length);
          base64 = canvas.toDataURL(imgtype, options.scale);
          callback(base64);
        }
      };
    },
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },

    //**blob to dataURL**
    blobToDataURL(blob, callback) {
      var a = new FileReader();
      a.onload = function(e) {
        callback(e.target.result);
      };
      a.readAsDataURL(blob);
    }
  },
  mounted() {
    // listen for click event on trigger
    let trigger =
      typeof this.trigger == "object"
        ? this.trigger
        : document.querySelector(this.trigger);
    if (!trigger) {
      this.$emit("error", "No avatar make trigger found.", "user");
    } else {
      trigger.addEventListener("touchend", this.pickImage);
    }

    // listen for input file changes
    let fileInput = this.$refs.input;
    fileInput.addEventListener("change", () => {
      if (fileInput.files != null && fileInput.files[0] != null) {
        let reader = new FileReader();

        reader.onload = e => {
          if (!this.showCropper) {
            this.uploadImageForm(fileInput.files[0]);
            return;
          } else {
            this.dataUrl = e.target.result;
          }
        };

        reader.readAsDataURL(fileInput.files[0]);

        this.filename = fileInput.files[0].name || "unknown";
        this.$emit("changed", fileInput.files[0], reader);
      }
    });
  }
};
</script>

<style lang="scss">
.avatar-cropper {
  .cropper-view-box,
  .cropper-face {
    border-radius: 50%;
  }
  .avatar-cropper-overlay {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
  }

  .avatar-cropper-img-input {
    display: none;
  }

  .avatar-cropper-close {
    float: right;
    position: relative;
    top: -1rem;
    right: -0.6rem;
    padding: 20px;
    font-size: 1rem;
    color: #fff;
    font-weight: 100;
    text-shadow: 0px 1px rgba(40, 40, 40, 0.3);
    z-index: 9999;
  }

  .avatar-cropper-mark {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
  }

  .avatar-cropper-container {
    width: 70%;
    height: 70%;
    background: #fff;
    z-index: 999;
    box-shadow: 1px 1px 5px rgba(100, 100, 100, 0.14);

    margin: auto 0.3rem;
    .avatar-cropper-image-container {
      position: relative;
      width: 100%;
      height: 90%;
    }
    img {
      max-width: 100%;
      height: 100%;
    }

    .avatar-cropper-footer {
      display: flex;
      align-items: stretch;
      align-content: stretch;
      justify-content: space-between;
      height: 10%;

      .avatar-cropper-btn {
        width: 50%;
        padding: 15px 0;
        font-size: 0.28rem;
        cursor: pointer;
        border: none;
        background: transparent;
        outline: none;
        &:hover {
          background-color: #2aabd2;
          color: #fff;
        }
      }
    }
  }
}
</style>
