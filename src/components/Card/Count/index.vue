<template>
  <div class="card-count">
    <div class="card-content">
      <div class="card-title">{{ title }}</div>
      <div class="card-today" v-if="today">
        <span>今日新增</span>{{ today }}
      </div>
      <div class="card-total">
        <count-to v-if="totalIsNumber" :startVal="0" :endVal="total" />
        <span v-else>{{ total }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import countTo from "vue-count-to";

export default {
  name: "CardCount",

  components: { countTo },

  props: {
    title: {
      required: true,
      type: String,
    },
    today: {
      type: Number,
      default: 0,
    },
    total: {
      required: true,
    },
  },
  computed: {
    totalIsNumber() {
      return this.total && Number.isInteger(this.total);
    },
  },
};
</script>

<style scoped lang="scss">
.card-count {
  vertical-align: top;
  display: inline-block;
  width: 25%;
  padding: 8px;
  box-sizing: border-box;
  .card-content {
    position: relative;
    padding: 12px;
    height: 100px;
    border-radius: 3px;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 0 6px #f1f1f1;
    .card-title {
      display: inline-block;
      padding: 0 10px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: #fff;
      border-radius: 10px;
      background-color: #20a0ff;
    }
    .card-today {
      position: absolute;
      right: 20px;
      top: 12px;
      color: #67c23a;
      line-height: 20px;
      span {
        margin-right: 5px;
        font-size: 12px;
      }
    }
    .card-total {
      margin-right: 10px;
      font-size: 24px;
      font-style: italic;
      margin-top: 20px;
      text-align: right;
      font-weight: bold;
    }
  }
}
</style>