<template>
    <div id="container_ghost">
        <div id="spooky">
            <div id="body">
                <div id="eyes"></div>
                <div id="mouth"></div>
                <div id="feet">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
        <div id="shadow"></div>
    </div>
</template>
<style lang="scss">
    $colorBg: #424F6F;
    $colorMain: #F2FBF1;
    $colorAccent: #252C49;

    #container_ghost {
        width: 100%;
        height: 900px;
        padding: 0;
        position: absolute;
        box-sizing: border-box;
        background: $colorBg;
    }

    #spooky {
        margin: 10% auto;
        width: 80%;
        height: 80%;
        animation: floaty 2s infinite;

        #body {
            position: relative;
            margin: 50px auto 0;
            width: 180px;
            height: 220px;
            background: $colorMain;
            border-top-left-radius: 90px;
            border-top-right-radius: 90px;

            &:before, &:after {
                content: " ";
                position: absolute;
                top: 130px;
                display: inline-block;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: $colorMain;
                animation: floaty .2s infinite;
            }

            &:before {
                left: -18px;
            }

            &:after {
                right: -18px;
            }

            #eyes {
                display: flex;
                justify-content: space-between;
                margin: 0 auto;
                padding: 90px 0 0;
                width: 90px;
                height: 20px;

                &:before, &:after {
                    content: " ";
                    display: block;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: $colorAccent;
                }
            }

            #mouth {
                background: $colorAccent;
                margin: 25px auto 0;
                width: 60px;
                height: 30px;
                border-bottom-left-radius: 30px;
                border-bottom-right-radius: 30px;

                &:before {
                    content: " ";
                    display: block;
                    background: #fff;
                    margin-left: 20px;
                    width: 10px;
                    height: 10px;
                }
            }

            #feet {
                position: absolute;
                display: flex;
                bottom: -18px;
                width: 180px;
                height: 36px;

                > *, &:before, &:after {
                    content: " ";
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: $colorMain;
                }
            }
        }
    }

    #shadow {
        margin: -90px auto 0;
        width: 180px;
        height: 40px;
        border-radius: 50%;
        background: $colorAccent;
        animation: zoomy 2s infinite;
    }

    @keyframes floaty {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-20px);
        }
    }

    @keyframes zoomy {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(.8);
        }
    }
</style>