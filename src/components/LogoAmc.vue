<template>
    <div>
        <div class="circle_32x">
            <span></span>
            <span></span>
        </div>
        <a class="mysite" href="http://tystrong.me">Check out our telegram group.</a>
    </div>
</template>
<script>

    export default {
        components : {
        },
        data () {
            return {
                name : "That is that",
                description : "The next winner is you!"
            }
        }
    }
</script>
<style>
    @import url(https://fonts.googleapis.com/css?family=Lato:300,400,700);

    .circle_32x {
        position: relative;
        width: 700px;
        height: 412px;
        margin: 50px auto;
        transition: all 1s;
    }

    .circle_32x:hover {
        width: 124px;
        transform: rotate(180deg);
    }

    .circle_32x:active {
        width: 412px;
        transform: rotate(90deg);
    }

    .circle_32x span:nth-child(2) {
        right: 0;
        border: solid 6px #4FC1E9;
    }

    .circle_32x span {
        display: block;
        width: 400px;
        height: 400px;
        position: absolute;
        border: solid 6px #FC6E51;
        border-radius: 50%;
    }

    .mysite {
        font-size: 18px;
        text-decoration: none;
        color: rgba(0, 0, 0, 0.5);
        border-bottom: solid 1px rgba(0, 0, 0, 0.5);
        position: fixed;
        bottom: 10px;
        right: 10px;
    }
</style>