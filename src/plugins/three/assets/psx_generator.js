function rand (max, min, is_int) {
    let a_max = (max - 1 || 0) + 1;
    let a_min = min || 0;
    let gen = min + (a_max - a_min) * Math.random ();
    return (is_int === 1) ? Math.round (gen) : gen;
}

function random (min, max) {
    if (arguments.length < 2) {
        max = min;
        min = 0;
    }
    if (min > max) {
        const hold = max;
        max = min;
        min = hold;
    }
    return Math.floor (Math.random () * (max - min + 1)) + min;
}

function σ (c) {
    return (Math.random () < (c || .5)) ? -1 : 1;
}

const PolygonExPs3 = function (n, R, o, wid, hue, v, af, wix) {
    //  console.log ("xxx1");

    this.n = n || rand (7, 3, 1);
    this.α = 2 * Math.PI / this.n;
    this.R = R || rand (16, 8);
    // console.log ("xxx2");
    this.o = o || null;
    this.wid = wid || rand (Math.PI / 2, 0, 0);
    this.hue = hue || rand (360, 0, 1);
    // console.log ("xxx3");
    this.c = 'hsl(' + this.hue + ',100%,80%)';
    this.v = v || null;
    this.af = af || (25 - this.R) / 250 - 1;

    this.wix = wix || σ () * rand (2, .25) * Math.PI / 180;
    /*console.log ("wix", this.wix);
    console.log ("af", this.af);
    console.log ("wid", this.wid);*/
    this.vertices = [];
    /**
     * the init place is in here now
     */
    this.init = function ({ w, h }) {
        let θ = 0;
        // console.log ("rect", rect);
        if (!this.o) {
            this.o = {
                'x' : rand (w - this.R, this.R, 1),
                'y' : rand (h - this.R, this.R, 1)
            };
        }

        if (!this.v) {
            this.v = {
                'x' : σ () * rand (2, .5, 0),
                'y' : σ () * rand (2, .5, 0)
            };
        }

        for (let i = 0; i < this.n; i++) {
            θ = i * this.α + this.wid;

            this.vertices.push ({
                'x' : this.o.x + this.R * Math.cos (θ),
                'y' : this.o.y + this.R * Math.sin (θ)
            });
        }
    };
    /**
     *
     * @param polygons
     * @param rep_pt
     * @param N_POLY
     * @param rect
     */
    this.move = function (polygons, rep_pt, N_POLY, rect) {
        this.v.x += ~~(2 / (this.o.x - rep_pt.x));
        this.v.y += ~~(2 / (this.o.y - rep_pt.y));

        if (this.v.x > 4) {
            this.v.x = 4;
        }
        if (this.v.y > 4) {
            this.v.y = 4;
        }
        if (this.v.x < -4) {
            this.v.x = -4;
        }
        if (this.v.y < -4) {
            this.v.y = -4;
        }

        this.o.x += this.v.x;
        this.o.y += this.v.y;

        this.wid += this.wix;
        this.hue += σ (.8) * rand (5, 1, 1);
        this.c = 'hsl(' + this.hue + ',100%,80%)';

        if (this.o.x < this.R) {
            this.o.x = this.R;
            this.v.x *= this.af;
        }
        if (this.o.x > rect.w - this.R) {
            this.o.x = rect.w - this.R;
            this.v.x *= this.af;
        }
        if (this.o.y < this.R) {
            this.o.y = this.R;
            this.v.y *= this.af;
        }
        if (this.o.y > rect.h - this.R) {
            this.o.y = rect.h - this.R;
            this.v.y *= this.af;
        }

        for (let i = 0; i < N_POLY; i++) {
            if (polygons[i] !== this) {
                if (Math.abs (this.o.x - polygons[i].o.x) < (this.R + polygons[i].R) &&
                    Math.abs (this.o.y - polygons[i].o.y) < (this.R + polygons[i].R)) {
                    this.o.x -= this.v.x;
                    polygons[i].o.x -= polygons[i].v.x;
                    this.v.x *= -1;
                    polygons[i].v.x *= -1;
                    this.o.y -= this.v.y;
                    polygons[i].o.y -= polygons[i].v.y;
                    this.v.y *= -1;
                    polygons[i].v.y *= -1;
                }
            }
        }

        for (let i = 0; i < this.n; i++) {
            let θ = i * this.α + this.wid;
            this.vertices[i] = {
                'x' : this.o.x + this.R * Math.cos (θ),
                'y' : this.o.y + this.R * Math.sin (θ)
            };
        }
    };
    /**
     *
     * @param ctxt
     */
    this.draw = function (ctxt) {
        ctxt.lineWidth = 3;
        ctxt.strokeStyle = this.c;
        ctxt.beginPath ();

        for (let i = 0; i < this.n; i++) {
            if (i === 0) {
                ctxt.moveTo (this.vertices[i].x, this.vertices[i].y);
            } else {
                ctxt.lineTo (this.vertices[i].x, this.vertices[i].y);
            }
        }

        ctxt.closePath ();
        ctxt.stroke ();
    };
    /**
     *
     * @param ctxt canvas context
     * @param poly ploygon
     * @param cutoff_d int
     */
    this.connectTo = function (ctxt, poly, cutoff_d, { w, h }) {
        let min_d = Math.max (w, h), conn_i, conn_j,
            curr_d, dx, dy,
            c0, c1, g, la;

        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < poly.n; j++) {
                dx = this.vertices[i].x - poly.vertices[j].x;
                dy = this.vertices[i].y - poly.vertices[j].y;
                curr_d = Math.sqrt (Math.pow (dx, 2) + Math.pow (dy, 2));
                if (min_d > curr_d) {
                    min_d = curr_d;
                    conn_i = i;
                    conn_j = j;
                }
            }
        }

        if (min_d < cutoff_d) {
            la = (1 - min_d / cutoff_d);
            c0 = 'hsla(' + this.hue + ',100%,80%,' + la + ')';
            c1 = 'hsla(' + poly.hue + ',100%,80%,' + la + ')';
            g = ctxt.createLinearGradient (
                this.vertices[conn_i].x,
                this.vertices[conn_i].y,
                poly.vertices[conn_j].x,
                poly.vertices[conn_j].y
            );
            g.addColorStop (0, c0);
            g.addColorStop (1, c1);

            ctxt.strokeStyle = g;
            ctxt.beginPath ();
            ctxt.moveTo (this.vertices[conn_i].x, this.vertices[conn_i].y);
            ctxt.lineTo (poly.vertices[conn_j].x, poly.vertices[conn_j].y);
            ctxt.closePath ();
            ctxt.stroke ()
        }
    };
};


export const Poly = PolygonExPs3;