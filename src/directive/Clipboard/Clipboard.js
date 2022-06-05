// Inspired by https://github.com/Inndy/vue-clipboard2
import Clipboard from "clipboard";
import { Message } from 'element-ui'

export default {
  bind(el, binding = {}, vnode) {

    el.style.cursor = 'copy'

    const clipboard = new Clipboard(el, {
      text: () => binding.value
    })

    clipboard.on('success', e => {
      Message.success("已复制到剪切板");
    })

    clipboard.on('error', e => {
      Message.success("复制失败");
    })
  },

  update(el, binding) {
    el.__clipboard__.text = () => binding.value
  },

  unbind(el, binding) {
    el.__clipboard__.destroy();
    delete el.__clipboard__;
  }
}
