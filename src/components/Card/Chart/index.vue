<template>
  <div class="card-chart">
    <div class="card-content">
      <div class="card-title">{{ title }}</div>
      <div class="chart-content" :id="id"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardChart",
  props: {
    id: {
      required: true,
      type: String,
    },
    title: {
      required: true,
      type: String,
    },
  },
};
</script>

<style scoped lang="scss">
.card-chart {
	display: inline-block;
	vertical-align: top;
	width: 100%;
  padding: 8px;
  box-sizing: border-box;
  .card-content {
    padding: 12px;
    height: 300px;
    border-radius: 3px;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 0 6px #f1f1f1;
    .card-title {
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      font-weight: bold;
    }
    .chart-content {
      width: 100%;
      height: 260px;
    }
  }
}
</style>