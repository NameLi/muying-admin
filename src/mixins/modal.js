export const modal = {
  data() {
    return {
      id: null,
      loading: false,
      submitLoading: false,
      visible: false,
      isEdit: false,
      form: {}
    }
  },

  created() {
    try {
      this.id = parseInt(this.$route.params.id)
    } catch (err) {

    }
  },

  methods: {
    // 父级调用打开模态框
    open(row) {
      if (row) {
        this.isEdit = true
        this.form = Object.assign(this.form, row)
      }
      this.visible = true

      this.$nextTick(() => {
        this.$refs['form'] && this.$refs['form'].clearValidate()
      })
    },

    // 关闭前回调，若未处理完成，禁止关闭
    beforeClose(done) {
      if (this.submitLoading) {
        this.$message.warning('请等待操作完成后关闭')
      } else {
        done()
      }
    },

    // 关闭模态框
    close() {
      this.$refs['form'] && this.$refs['form'].resetFields()
      this.form = this.$options.data().form
      this.isEdit = false
      this.visible = false
    },

    // 保存/更新
    submitForm() {
      if (this.$refs['form']) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this._submitForm()
          } else {
            return false;
          }
        });
      } else {
        this._submitForm()
      }
    },

    async _submitForm() {
      this.submitLoading = true;
      const res = await this.submit()
      this.submitLoading = false;

      if (res && res.code === 200) {
        this.$emit("on-success");
        this.visible = false;
      }
    }
  },
}