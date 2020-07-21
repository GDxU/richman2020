


<script>
    const canvas = document.getElementById('stars');
    const context = canvas.getContext('2d');
    const bcanvas = document.createElement('canvas');
    const bcontext = bcanvas.getContext('2d');
    bcanvas.height = canvas.height = canvas.parentNode.offsetHeight;
    bcanvas.width = canvas.width = canvas.parentNode.offsetWidth;

    // shitty debounce
    window.addEventListener('resize', (event => {
        const bounce = 100;
        let start = Date.now()
        return event => {
            if( Date.now() - start > bounce ) {
                bcanvas.height = canvas.height = canvas.parentNode.offsetHeight;
                bcanvas.width = canvas.width = canvas.parentNode.offsetWidth;
                start = Date.now()
            }
        }
    })())

    let maxSize = 5;
    let minSize = 3;
    const starmap = Array.from(Array(128), initializr);
    maxSize /= 2;
    minSize /= 2;

    drawBackground();
    canvas.style.backgroundImage = `url(${bcanvas.toDataURL()})`;
    animate();

    function initializr() {
        const seed = Math.random() > 0.1 ?
            Math.floor(Math.random()*15000+3000) :
            Math.floor(Math.random()*3000 + 500) ; // too many red dwarfs look weird.

        const {red, green, blue} = colorTemperature2rgb(seed);
        const properties = {
            x: Math.random()*canvas.width,
            y: Math.random()*canvas.height,
            size: Math.random()*(maxSize-minSize)+minSize
        };
        properties.color = `rgba(${red},${green},${blue},${properties.size/maxSize})`;
        properties.twinkle = Math.random()* + 1;
        return properties;
    }

    function drawBackground() {
        const backgroundmap = Array.from(Array(2000), initializr);
        for( const star of backgroundmap ) {
            bcontext.beginPath();
            bcontext.fillStyle = star.color;
            bcontext.shadowColor = star.color;
            bcontext.shadowBlur = star.twinkle * 10;

            bcontext.arc(star.x, star.y, star.size/2, 0, Math.PI*2);
            bcontext.fill();
            bcontext.closePath();
        }
    }

    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for( const star of starmap ) {
            star.twinkle += (Math.random()*2-1) / 2;
            star.twinkle = Math.max(1, Math.min(8, star.twinkle));

            // so the whole idea was to see if it was faster to draw two squares than
            // one circle. it isn't. kinda looks neat though.

            // this gets me 60fps
            context.beginPath();
            context.fillStyle = star.color;
            context.shadowColor = star.color;
            context.shadowBlur = star.twinkle * 10;

            context.arc(star.x, star.y, star.size/2, 0, Math.PI*2);
            context.fill();
            context.closePath();

            // this gets me like 40fps.
            // context.save();
            // context.beginPath();
            // context.translate(star.x - star.size/2, star.y - star.size/2);
            // context.fillStyle = star.color;
            // context.shadowColor = star.color;
            // context.shadowBlur = star.twinkle * 10;
            // context.fillRect(0, 0, star.size, star.size);
            // context.translate(star.size/2, -star.size/4);
            // context.rotate(45 * Math.PI / 180);
            // context.fillRect(0, 0, star.size, star.size);
            // context.closePath();
            // context.restore();
        }
        requestAnimationFrame(animate);
    }

    // I was too lazy to figure out this on my own.
    // shamelessly stolen from here:
    // https://github.com/neilbartlett/color-temperature/blob/master/index.js
    function colorTemperature2rgb (kelvin) {

        var temperature = kelvin / 100.0;
        var red, green, blue;

        if (temperature < 66.0) {
            red = 255;
        } else {
            // a + b x + c Log[x] /.
            // {a -> 351.97690566805693`,
            // b -> 0.114206453784165`,
            // c -> -40.25366309332127
            //x -> (kelvin/100) - 55}
            red = temperature - 55.0;
            red = 351.97690566805693+ 0.114206453784165 * red - 40.25366309332127 * Math.log(red);
            if (red < 0) red = 0;
            if (red > 255) red = 255;
        }

        /* Calculate green */

        if (temperature < 66.0) {

            // a + b x + c Log[x] /.
            // {a -> -155.25485562709179`,
            // b -> -0.44596950469579133`,
            // c -> 104.49216199393888`,
            // x -> (kelvin/100) - 2}
            green = temperature - 2;
            green = -155.25485562709179 - 0.44596950469579133 * green + 104.49216199393888 * Math.log(green);
            if (green < 0) green = 0;
            if (green > 255) green = 255;

        } else {

            // a + b x + c Log[x] /.
            // {a -> 325.4494125711974`,
            // b -> 0.07943456536662342`,
            // c -> -28.0852963507957`,
            // x -> (kelvin/100) - 50}
            green = temperature - 50.0;
            green = 325.4494125711974 + 0.07943456536662342 * green - 28.0852963507957 * Math.log(green);
            if (green < 0) green = 0;
            if (green > 255) green = 255;

        }

        /* Calculate blue */

        if (temperature >= 66.0) {
            blue = 255;
        } else {

            if (temperature <= 20.0) {
                blue = 0;
            } else {

                // a + b x + c Log[x] /.
                // {a -> -254.76935184120902`,
                // b -> 0.8274096064007395`,
                // c -> 115.67994401066147`,
                // x -> kelvin/100 - 10}
                blue = temperature - 10;
                blue = -254.76935184120902 + 0.8274096064007395 * blue + 115.67994401066147 * Math.log(blue);
                if (blue < 0) blue = 0;
                if (blue > 255) blue = 255;
            }
        }

        return {red: Math.round(red), blue: Math.round(blue), green: Math.round(green)};
    }
</script>