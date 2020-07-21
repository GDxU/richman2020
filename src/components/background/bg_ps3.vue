<template>
    <canvas ref="draw_panel"></canvas>
</template>
<script>
    import { Poly } from '../../plugins/three/assets/psx_generator';

    export default {
        name : "bg_ps3",
        data () {
            return {
                polygons : [],
                t : 0,
                r_id : null,
                rep_pt : { x : 0, y : 0 },
                cutoff_d : 169,
                ctx2d : null,
                N_POLY : 32,
                r : {
                    w : 0,
                    h : 0
                }
            }
        },
        methods : {
            init (c) {
                let s = getComputedStyle (c);
                // console.log (c);
                this.ctx2d = c.getContext ('2d');
                //  console.log (this.ctx2d);
                if (this.r_id) {
                    cancelAnimationFrame (this.r_id);
                }
                const w = c.width = ~~s.width.split ('px')[0];
                const h = c.height = ~~s.height.split ('px')[0];
                // console.log (w, h);
                this.rep_pt.x = w / 2;
                this.rep_pt.y = h / 2;
                this.r.w = w;
                this.r.h = h;
                //  console.log ("xrx1");
                for (let i = 0; i < this.N_POLY; i++) {
                    //    console.log ("xrx-p", i);

                    this.polygons.push (new Poly ());
                    this.polygons[i].init (this.r);
                }
                this.draw ();
            },
            draw () {
                let hue_diff;
                this.ctx2d.clearRect (0, 0, this.r.w, this.r.h);
                for (let i = 0; i < this.N_POLY; i++) {
                    this.polygons[i].move (this.polygons, this.rep_pt, this.N_POLY, this.r);
                    this.polygons[i].draw (this.ctx2d);
                    for (let j = 0; j < i; j++) {
                        hue_diff = Math.abs (this.polygons[i].hue - this.polygons[j].hue);
                        if (hue_diff < 32 || hue_diff > 328) {
                            this.polygons[i].connectTo (this.ctx2d, this.polygons[j], this.cutoff_d, this.r);
                        }
                    }
                }
                this.t++;
                this.r_id = requestAnimationFrame (this.draw);
            }
        },
        mounted () {
            this.$nextTick (() => {
                const { draw_panel } = this.$refs;


                draw_panel.addEventListener ('mousemove', function (e) {
                    this.rep_pt.x = e.clientX;
                    this.rep_pt.y = e.clientY;
                }, false);

                this.init (draw_panel);

                if (window != undefined) {
                    window.addEventListener ('resize', (e) => {
                        this.init (draw_panel);
                    }, false);
                }

            })
        }
    }
</script>
<style scoped>

    canvas {
        display: block;
        width: 100%;
        height: 100%;
        background: #163651;
    }

</style>