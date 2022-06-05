export default {

  install(Vue) {

    // 表格类数据初始化
    Vue.prototype.$defaults = function () {
      return {
        loading: false,
        form: {
          keyword: ''
        },
        list: [],
        sort: {
          sortby: '',
          order: '',
        },
        pagination: {
          page: 1,
          per_page: 20,
          total: 0,
        },
      }
    }

    /**
     * @desc 表格类获取数据 
     * @param { Promise } http    请求接口方法
     * @param { Object }  vm      Vue 实例
     * @param { Boolean } isReset 是否重置页面
     * @param { Number } id       请求接口id参数
     * @param { Number } sub_id   请求接口子id参数
     */
    Vue.prototype.$getData = async function (http, vm, isReset = false, ...args) {
      if(vm.loading) return;

      isReset ? vm.pagination.page = 1 : '';

      let params = Object.assign({}, vm.form, vm.sort, vm.pagination);

      vm.loading = true;
      const res = await http(...args, params);
      vm.$tableScrollReset();
      vm.loading = false;

      if (res.code === 200) {
        vm.list = res.data;
        vm.pagination.total = res.total;
      }

      return res;
    }

    // el-table 滚动到顶部
    Vue.prototype.$tableScrollReset = (el = '.el-table__body-wrapper') => {
      let oEl = document.querySelector(el);
      if (oEl) {
        oEl.scrollTop = 0;
        // oEl.scrollLeft = 0
      }
    }
  }
}