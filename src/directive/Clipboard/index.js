import Clipboard from './Clipboard'

export default {
  install (Vue) {
    Vue.directive('copy', Clipboard)
  }
}