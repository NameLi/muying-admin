import * as echarts from "echarts";

export const barChart = (el, xData, yData, type = "bar", zoom = false) => {
    const chart = echarts.init(document.getElementById(el));

    let options = {
        grid: {
            borderWidth: 0,
            y: 40,
            x: 60,
            x2: 40,
            y2: 30,
        },
        toolbox: {
            show: true,
            x: "right",
            y: 0,
            padding: 10,
            feature: {
                restore: {
                    show: true,
                },
                magicType: {
                    type: ["line", "bar"],
                },
            },
        },
        tooltip: {
            trigger: "axis",
        },
        // color: ["#41aeff"],
        xAxis: [
            {
                type: "category",
                data: xData,
                axisTick: {
                    alignWithLabel: true,
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#2798d2",
                        width: 2,
                    },
                },
                axisLabel: {
                    interval: 0, //横轴信息全部显示
                    // rotate:-20,//-30度角倾斜显示
                },
            },
        ],
        yAxis: [
            {
                type: "value",
                minInterval: 1,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#2798d2",
                        width: 2,
                    },
                },
            },
        ],

        series: [
            {
                type: type,
                barWidth: 20,
                smooth: true,
                // lineStyle: {
                //     width: 2,
                //     shadowColor: "#f5f5f5",
                //     shadowBlur: 2,
                //     shadowOffsetY: 12,
                // },
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: "top",
                            formatter: "{c}",
                        }
                    },
                },
                data: yData,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                            [
                                {
                                    offset: 0,
                                    color: "rgba(65, 174, 255, 0.38)",
                                },
                                {
                                    offset: 1,
                                    color: "rgba(65, 174, 255, 0)",
                                },
                            ],
                            false
                        ),
                    },
                },
            },
        ],
    };

    if (zoom) {
        options.grid.y2 = 50
        options.dataZoom = [
            {
                type: 'inside',
                start: 0,
                end: 20
            },
            {
                zoomLock: true,
                start: 0,
                end: 20,
                height: 16,
                bottom: 10
            }
        ]
    }

    chart.setOption(options);

    return chart;
}