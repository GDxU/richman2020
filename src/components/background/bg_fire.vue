<template>
    <v-chart :options="opt" :autoResize="true"/>
</template>
<script>
    import "echarts/lib/chart/line"
    import "echarts/lib/component/polar"
    import "echarts/lib/component/graphic"
    import ECharts from "vue-echarts/components/ECharts"
    import Skeleton from "../../plugins/mixins/mixinbb/bbGameAnimationSkeleton"

    export default {
        name : "fire_expo",
        mixins : [Skeleton],
        methods : {
            clearData () {
                this.data_a = [];
                this.data_b = [];
            },
            pushFactor (a, b) {
                this.data_a.push (a);
                if (this.data_a.length > 88) {
                    this.data_a.shift ();
                }
            },
            startJump () {
                this.lineColor = this.list_color[2];
                this.areaColor = this.list_color[6];
            },
            kill () {
                this.lineColor = this.list_color[5];
                this.areaColor = this.list_color[7];
            },
        },
        computed : {
            opt () {
                let that = this;
                return {
                    legend : {
                        data : ["Plane GAIA"],
                        x : "right"
                    },
                    color : this.lineColor,
                    xAxis : {
                        name : "->> unlimited",
                        type : "category",
                        boundaryGap : 51,
                        axisLine : {
                            onZero : true,
                            lineStyle : {
                                color : this.conf_option.x_line_color
                            }
                        },
                        axisLabel : {
                            show : false
                        },
                        axisTick : {
                            show : false
                        },
                        splitLine : {
                            lineStyle : {
                                color : this.conf_option.split_line_color,
                                width : 1,
                                type : "solid"
                            }
                        }
                    },
                    yAxis : {
                        name : "Dist Height.",
                        type : "value",
                        scale : true,
                        axisLabel : {
                            textStyle : {
                                color : this.conf_option.y_font_color,
                                fontSize : "12px"
                            }
                        },
                        axisLine : {
                            lineStyle : {
                                color : this.conf_option.y_line_color,
                            }
                        },
                        splitLine : {
                            show : false
                        }
                    },
                    toolbox : {
                        show : false,
                    },
                    series : [{
                        name : "",
                        type : "line",
                        showSymbol : false,
                        hoverAnimation : false,
                        animationDelay : 500,
                        animationDuration : 1000,
                        markPoint : {
                            // symbol: "image://url",
                            data : [
                                { type : "max", name : "最大值" }
                            ],
                            animationDelay : 300,
                            animationDuration : 1000
                        },
                        lineStyle : {
                            normal : {
                                width : 1,
                                color : {
                                    type : "linear",
                                    x : 0,
                                    y : 0,
                                    x2 : 1,
                                    y2 : 0,
                                    colorStops : [{
                                        offset : 0, color : "red" // 0% 处的颜色
                                    }, {
                                        offset : 1, color : this.lineColor // 100% 处的颜色
                                    }],
                                    globalCoord : true // 缺省为 false
                                },
                                opacity : 0.9
                            }
                        },
                        areaStyle : {
                            normal : {
                                color : new ECharts.graphic.LinearGradient (0, 0, 0, 1, [{
                                    offset : 0,
                                    color : this.areaColor
                                }, {
                                    offset : 0.911,
                                    color : "rgba(137, 189, 27, 0)"
                                }], false),
                                shadowColor : "rgba(0, 0, 0, 0.1)",
                                shadowBlur : 50
                            }
                        },
                        itemStyle : {
                            normal : {
                                color : "rgb(137,189,27)",
                                borderColor : "rgba(137,189,2,0.27)",
                                borderWidth : 12
                            }
                        },
                        data : that.data_a
                    }]
                };
            },
            type () {
                if (this.typePick === "数值") {
                    return "numeric";
                } else if (this.typePick === "百分比") {
                    return "percent";
                } else {
                    return "numeric";
                }
            },

        },
        data () {
            return {
                conf_option : {
                    y_font_color : "#60F194",
                    x_font_color : "#fff",
                    y_line_color : "#184483",
                    x_line_color : "#184483",
                    split_line_color : "rgba(0,53,115,0.6)"
                },
                lineColor : "#8DDA00",
                areaColor : "rgba(137, 189, 27, 0.7)",
                list_color : [
                    "#26CEFB",
                    "#FEE99A",
                    "#8DDA00",
                    "#5CE690",
                    "#98ADFE",
                    "#e71d13",
                    "rgba(137, 189, 27, 0.7)",
                    "rgba(231, 29, 19, 0.7)",
                ],
                data_a : [],
                data_b : [],
                // myChart实例
                myChart : {},
                typePick : "数值",
                typeList : [
                    {
                        name : "数值"
                    },
                    {
                        name : "百分比"
                    }
                ],
                pagePick : 0,
                percent : {
                    label : {
                        normal : {
                            show : true,
                            position : "inside",
                            formatter : "{c}%"
                        }
                    }
                },
                numeric : {
                    label : {
                        normal : {
                            show : true,
                            position : "inside",
                            formatter : "{c}"
                        }
                    }
                }
            }
        },
    }

</script>
<style lang="scss" scoped>
    .echarts {
        margin-top: 150px;
        width: 100vw !important;
        height: 300px !important;
    }
</style>
