<template>
  <div class="wang-editor">
    <!-- <div class="subject-card-item">
      <i class="subject-card-delete el-icon-close"></i>
      <div class="subject-card-poster">
        <img
          src="http://img1.doubanio.com/view/photo/s_ratio_poster/public/p1085107162.jpg"
        />
      </div>
      <div class="subject-card-info">
        <div class="subject-card-info-title"><a href="">2012:冰河时期</a></div>
        <div class="subject-card-info-list">
          <div class="subject-card-info-rating">评分：3.2</div>
          <div class="subject-card-info-item">2012 / 美国 / 奇幻</div>
        </div>
      </div>
    </div> -->

    <div id="editor" :style="`width: ${width};`"></div>

    <mix-search ref="searchModal" @on-check="cardCheckHandle" />
  </div>
</template>
<script>
import E from "wangeditor";
import MixSearch from "./MixSearch";
import { getQiniuUpToken } from "@/api/api";
import * as qiniu from "qiniu-js";

export default {
  name: "WangEditor",
  components: {
    MixSearch,
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "650px",
    },
    id: {
      type: Number,
      default: null,
    },
    category: {
      type: String,
      required: true,
    },
    // 允许类型
    acceptType: {
      type: Array,
      default: () => ["image/png", "image/jpeg", "image/gif"],
    },
  },

  data() {
    return {
      visible: false,
      movie: "",
      editor: null,
      uploadProgress: 0,
      isUploading: false,
    };
  },

  model: {
    prop: "value",
    event: "change",
  },

  watch: {
    value(val) {
      this.editor.txt.html(val);
    },
  },

  mounted() {
    const _this = this;

    document
      .querySelector("#editor")
      .addEventListener("keydown", function (event) {
        const curElem = _this.editor.selection.getSelectionEndElem().elems[0]; // 当前操作元素
        const prevElem = curElem.previousSibling; // 上一个兄弟节点
        const nextElem = curElem.nextSibling; // 下一个兄弟节点
        const curText = curElem.innerText; // 当前元素文本
        /**
         * @desc 删除时校验
         * @step 1.当前节点是否为信息卡片插入的节点，且文本是否为空
         * @step 2.当前节点上一个兄弟节点是否为信息卡片
         * @step 3.当前节点下一个兄弟节点是否为信息卡片
         */

        // keyCode 8:backspace  46:delete

        // 删除时并前面存在节点
        if (event.keyCode === 8 && prevElem) {
          // 上一个节点为信息卡
          if (prevElem.className.includes("subject-card-item")) {
            if (_this.getCursortPosition(curElem) !== 0) {
              return;
            }

            // 已为选中状态，则删除该信息卡
            if (prevElem.className.includes("is-focus")) {
              prevElem.parentNode.removeChild(prevElem);
            } else {
              prevElem.classList.add("is-focus");

              event.stopPropagation(); // 阻止事件冒泡传递
              event.preventDefault(); // 阻止浏览器默认事件的发生
            }
          }
        } else if (event.keyCode === 46 && nextElem) {
          // 上一个节点为信息卡
          if (nextElem.className.includes("subject-card-item")) {
            if (_this.getCursortPosition(curElem) !== curText.length) {
              return;
            }

            // 已为选中状态，则删除该信息卡
            if (nextElem.className.includes("is-focus")) {
              nextElem.parentNode.removeChild(nextElem);
            } else {
              nextElem.classList.add("is-focus");

              event.stopPropagation(); // 阻止事件冒泡传递
              event.preventDefault(); // 阻止浏览器默认事件的发生
            }
          }
        } else {
          if (prevElem && prevElem.className.includes("is-focus")) {
            prevElem.classList.remove("is-focus");
          } else if (nextElem && nextElem.className.includes("is-focus")) {
            nextElem.classList.remove("is-focus");
          }
        }
      });

    document
      .querySelector("#editor")
      .addEventListener("click", function (event) {
        if (event.target.className.includes("subject-card-delete")) {
          event.target.parentNode.parentNode.removeChild(
            event.target.parentNode
          );
        }
      });

    this.initEditor();
  },

  methods: {
    // 获取光标位置
    getCursortPosition(element) {
      var caretOffset = 0;
      var doc = element.ownerDocument || element.document;
      var win = doc.defaultView || doc.parentWindow;
      var sel;
      if (typeof win.getSelection != "undefined") {
        //谷歌、火狐
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
          //选中的区域
          var range = win.getSelection().getRangeAt(0);
          var preCaretRange = range.cloneRange(); //克隆一个选中区域
          preCaretRange.selectNodeContents(element); //设置选中区域的节点内容为当前节点
          preCaretRange.setEnd(range.endContainer, range.endOffset); //重置选中区域的结束位置
          caretOffset = preCaretRange.toString().length;
        }
      } else if ((sel = doc.selection) && sel.type != "Control") {
        //IE
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
      }
      return caretOffset;
    },

    // 初始化编辑器并增加插入信息卡按钮
    initEditor() {
      let _this = this;
      let editor = new E("#editor");

      editor.config.onchange = (html) => {
        this.$emit("change", html);
      };

      editor.config.showFullScreen = false; // 关闭全屏按钮

      const { $, BtnMenu } = E;

      // 增加添加 影视/影人/角色 等引用按钮
      class InsertCardMenu extends BtnMenu {
        constructor(editor) {
          const $elem = E.$(
            `<div class="w-e-menu">
              <i class="iconfont icon-card"></i>
            </div>`
          );
          super($elem, editor);
        }

        // 菜单点击事件
        clickHandler() {
          _this.showCardSearchModal();
        }

        // 菜单激活状态
        tryChangeActive() {}
      }

      // 注册菜单
      editor.menus.extend("card", InsertCardMenu);

      // 配置菜单
      editor.config.menus = [
        "head",
        "bold",
        // 'fontSize',
        // 'fontName',
        // 'italic',
        // 'underline',
        "strikeThrough",
        // 'indent',
        // 'lineHeight',
        // 'foreColor',
        // 'backColor',
        // 'list',
        // 'justify',
        "quote",
        // 'emoticon',
        "link",
        "image",
        "video",
        "table",
        // 'code',
        "splitLine",
        // 'undo',
        // 'redo',
        "card",
      ];

      // 限制上传图片尺寸
      editor.config.uploadImgMaxSize = 5 * 1024 * 1024; // 5M
      editor.config.uploadImgAccept = ["jpg", "jpeg", "png", "gif", "bmp"];
      editor.config.uploadImgMaxLength = 1; // 单次上传图片数
      editor.config.showLinkImg = false; // 禁用网络图片

      // 自定义图片上传到云服务
      // resultFiles 是 input 中选中的文件列表
      // insertImgFn 是获取图片 url 后，插入到编辑器的方法
      editor.config.customUploadImg = function (files, insertImgFn) {
        _this.handleImageUpload(files[0], insertImgFn);
      };

      editor.create();

      this.editor = editor;
    },

    async handleImageUpload(file, insertImgFn) {
      console.log(file)

      // 获取上传token
      let params = {
        category: this.category,
        type: "poster",
      };
      const { code, data } = await getQiniuUpToken(params);

      if (code === 200) {
        this.isUploading = true;

        const token = data;

        const key = null;

        // 额外参数
        const putExtra = {
          fname: "",
          params: {
            "x:union_id": this.id, // 所属父类id
            "x:category": this.category,
            "x:type": "poster",
            "x:subtype": "",
          },
          mimeType: this.acceptType, // 允许文件类型
        };


        const config = {
          useCdnDomain: false, // 使用cdn加速
          disableStatisticsReport: true, // 是否禁用日志报告
          region: qiniu.region.z0, // 上传域名区域
        };

        const observable = qiniu.upload(file, key, token, putExtra, config);

        observable.subscribe({
          // 上传进度
          next: (res) => {
            console.log(res)
            this.uploadProgress = Math.floor(res.total.percent);
            // this.$emit("on-progress", res);
          },

          // 上传失败
          error: (err) => {
            console.log(err)
            // this.isUploading = false;
            // this.$emit("on-error", err);
            this.$message.error(err.code + " 上传失败");
          },

          // 上传完成
          complete: (res) => {
            console.log(res)
            // this.isUploading = false;
            insertImgFn(res.url);
          },
        });
      }
    },

    // 获取编辑器内容
    getContent() {
      const content = this.editor.txt.html();
      this.$emit("change", content);
    },

    // 显示信息卡搜索模态框
    showCardSearchModal() {
      // let html = `<p class="card-input"><br></p><div class="subject-card-item" contenteditable="false">
      //       <i class="subject-card-delete el-icon-close"></i>
      //       <div class="subject-card-poster">

      //       </div>
      //       <div class="subject-card-info">
      //         <div class="subject-card-info-title"><a href="">123</a></div>
      //         <div class="subject-card-info-list">

      //         </div>
      //       </div>
      //     </div><p class="card-input"><br></p>`;
      // this.cardCheckHandle(html);

      this.$refs["searchModal"].open();
    },

    // 将信息卡dom片段插入编辑器
    cardCheckHandle(html) {
      this.editor.cmd.do("insertHTML", html);
    },
  },
};
</script>

<style lang="scss">
.subject-card-item {
  margin: 10px;
  position: relative;
  padding: 10px;
  border: 1px solid #dfdfdf;
  background-color: #fcfcfc;
  white-space: normal;
  user-select: none;
  display: flex;
  &.is-focus {
    box-shadow: 0 0 0 2px #2ab88d;
  }
  &:hover {
    .subject-card-delete {
      display: block;
    }
  }
  .subject-card-delete {
    display: none;
    z-index: 1;
    position: absolute;
    right: -9px;
    top: -9px;
    width: 18px;
    height: 18px;
    color: #fff;
    border-radius: 50%;
    line-height: 18px;
    text-align: center;
    cursor: pointer;
    background-color: #ccc;
    &:hover {
      background-color: red;
    }
  }
  .subject-card-poster {
    width: 68px;
    height: 90px;
    line-height: 90px;
    overflow: hidden;
    img {
      max-width: 68px;
      min-height: 90px;
    }
  }
  .subject-card-info {
    margin-left: 12px;
    flex: 1;
    .subject-card-info-title {
      font-size: 16px;
      margin-bottom: 8px;
      color: #494949;
    }
    .subject-card-info-list {
      .subject-card-info-rating {
        margin-bottom: 5px;
        height: 20px;
      }
      .subject-card-info-item {
        color: #999;
        font-size: 13px;
        line-height: 1.6;
      }
    }
  }
}

#editor {
  z-index: 0;
  position: relative;
  min-height: 70vh;
  // .w-e-toolbar .w-e-menu {
  //   padding: 0 10px;
  // }
  .w-e-text-container {
    height: 100% !important;
  }
}
</style>