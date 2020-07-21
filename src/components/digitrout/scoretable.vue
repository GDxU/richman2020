<template>
    <div class="score_scrap_table">
        <div class="container_ex_ta">
            <header>
                <h1>SHIP船员积分英雄榜</h1>
                <h3>（2016.7月始）</h3>
            </header>
            <div class="wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>名次</th>
                        <th>大名</th>
                        <th>小红花</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr :key="n" v-for="(ditem, n) in sample_data">
                        <td class="rank">{{n+1}}</td>
                        <td class="name"><img src={{ditem.img}}>
                            <p>{{ditem.englishname}}</p>
                            <p>{{ditem.chinesename}}</p></td>
                        <td class="points">{{ditem.score}}<span>✿</span></td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <footer>
                <h3>以下是积分规则：</h3>
                <ol>会议
                    <li>每次会议，演讲积2分，角色积1分</li>
                    <li>参加每次table topic, 积1分</li>
                    <li>会议获奖best, 积1分</li>
                </ol>
                <ol>比赛
                    <li>参加比赛，积3分</li>
                    <li>参加比赛组织工作，积1分</li>
                </ol>
                <ol>俱乐部发展
                    <li>非官员会员投稿会议纪要或其他头马相关资料，积1分</li>
                </ol>
            </footer>
        </div>
    </div>
</template>

<script>
    export default {
        name : "scoretable",
        data () {
            return {
                sample_data : [
                    {
                        englishname : "Erica Chi ",
                        chinesename : "迟佩珊",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a1.jpg",
                        score : 33,
                    },
                    {
                        englishname : "Shanney Chen",
                        chinesename : "陈艳",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a2.jpg",

                        score : 29,
                    },
                    {
                        englishname : "Lynn Xiaoyun ",
                        chinesename : "林晓芸",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a3.jpg",
                        score : 4,
                    },
                    {
                        englishname : "Ethan Yin ",
                        chinesename : "尹鹏",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a4.jpg",
                        score : 17,
                    },
                    {
                        englishname : "Frank He ",
                        chinesename : "贺育权",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a5.jpg",
                        score : 8,
                    },
                    {
                        englishname : "Ruby Qiu",
                        chinesename : "邱雅艳",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a6.jpg",
                        score : 19,
                    },
                    {
                        englishname : "Lynn Lin ",
                        chinesename : "林素兰",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a7.jpg",
                        score : 24,
                    }, {
                        englishname : "Alex Xiao ",
                        chinesename : "肖辉",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a8.jpg",
                        score : 22,
                    }, {
                        englishname : "Andy He ",
                        chinesename : "何亮",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a9.jpg",
                        score : 28,
                    }, {
                        englishname : "Sunrise Sun",
                        chinesename : "孙云浩",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a10.jpg",
                        score : 22,
                    },
                    {
                        englishname : "Shirley Xie ",
                        chinesename : "谢雪莲",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a11.jpg",
                        score : 8,
                    },
                    {
                        englishname : "Zizheng Wang",
                        chinesename : "王自正",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a12.jpg",
                        score : 28,
                    },
                    {
                        englishname : "Kiko Li ",
                        chinesename : "李翠丽",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a13.jpg",
                        score : 17,
                    },
                    {
                        englishname : "Adam Zhong ",
                        chinesename : "钟景志",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a14.jpg",
                        score : 19,
                    },
                    {
                        englishname : "Phoebe Pan",
                        chinesename : "潘兰香",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a15.jpg",
                        score : 14,
                    },
                    {
                        englishname : "Portia Ning ",
                        chinesename : "宁钿",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a16.jpg",
                        score : 30,
                    },
                    {
                        englishname : "Sophie Liao ",
                        chinesename : "廖文凤",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a17.jpg",
                        score : 5,
                    },
                    {
                        englishname : "Grace Xian ",
                        chinesename : "鲜洁",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a18.jpg",
                        score : 22,
                    },
                    {
                        englishname : "Shelly Lu ",
                        chinesename : "陆玲",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a19.jpg",
                        score : 6,
                    },
                    {
                        englishname : "Gloria Zhou ",
                        chinesename : "周梅英",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a20.jpg",
                        score : 4,
                    },
                    {
                        englishname : "Joanne Zhang ",
                        chinesename : "张彩燕",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a21.jpg",
                        score : 19,
                    },
                    {
                        englishname : "Raphael Li",
                        chinesename : "李远韬",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a22.jpg",
                        score : 2,
                    },
                    {
                        englishname : "Grady Chen",
                        chinesename : "陈贤亭",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a23.jpg",
                        score : 8,
                    },
                    {
                        englishname : "Taylor Zhang ",
                        chinesename : "张春林",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a24.jpg",
                        score : 2,
                    },
                    {
                        englishname : "Jessica Wu ",
                        chinesename : "伍珺",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a25.jpg",
                        score : 1,
                    },
                    {
                        englishname : "Warren Jiang ",
                        chinesename : "姜宇泽",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a26.jpg",
                        score : 2,
                    },
                    {
                        englishname : "Erica Huang ",
                        chinesename : "黄卓",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a27.jpg",
                        score : 10,
                    },
                    {
                        englishname : "Lily Wen ",
                        chinesename : "温自丽",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a28.jpg",
                        score : 17,
                    },
                    {
                        englishname : "Helen Zhao  ",
                        chinesename : "赵含利",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a29.jpg",
                        score : 4,
                    },
                    {
                        englishname : "Jason Wang",
                        chinesename : "王晓杰",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a30.jpg",
                        score : 17,
                    },
                    {
                        englishname : "Annie Han ",
                        chinesename : "韩成英",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a31.jpg",
                        score : 5,
                    },
                    {
                        englishname : "James Wang ",
                        chinesename : "	王念贤",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a32.jpg",
                        score : 2,
                    },
                    {
                        englishname : "Katlin Xiao ",
                        chinesename : "	",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/webwxgeticon.jpg",
                        score : 2,
                    }, {
                        englishname : "Wizard Zhou ",
                        chinesename : "周凇	",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/webwxgeticon2.jpg",
                        score : 5,
                    }, {
                        englishname : "Seb ",
                        chinesename : "	",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/a33.jpg",
                        score : 2,
                    }, {
                        englishname : "Stefanie Wu ",
                        chinesename : "	",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/webwxgeticon1.jpg",
                        score : 1,
                    }, {
                        englishname : "Sarah He ",
                        chinesename : "何景华",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/webwxgeticon-8.jpg",
                        score : 5,
                    }, {
                        englishname : "Alan Wang ",
                        chinesename : "王君",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/webwxgeticon-6.jpg",
                        score : 5,
                    }, {
                        englishname : "Meggie Wang ",
                        chinesename : "王倩	",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/webwxgeticon-7.jpg",
                        score : 2,
                    }, {
                        englishname : "Lavender He",
                        chinesename : "何晓嫩	",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/webwxgeticon-5.jpg",
                        score : 2,
                    }, {
                        englishname : "Tina Tian",
                        chinesename : "田婷",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/webwxgeticon-4.jpg",
                        score : 3,
                    }, {
                        englishname : "Sean Xiao",
                        chinesename : "肖艳军",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/webwxgeticon-2.jpg",
                        score : 11,
                    }, {
                        englishname : "Bruce Wang",
                        chinesename : "",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/webwxgeticon-1.jpg",
                        score : 7,
                    }, {
                        englishname : "Lily Lin",
                        chinesename : "",
                        img : "http://7xte3v.com1.z0.glb.clouddn.com/webwxgeticon-3.jpg",
                        score : 4,
                    }, {
                        englishname : "Haydn",
                        chinesename : "",
                        img : "",
                        score : 6,
                    }, {
                        englishname : "Mei Wang",
                        chinesename : "王腊梅",
                        img : "",
                        score : 1,
                    }, {
                        englishname : "Lagrange",
                        chinesename : "齐升升",
                        img : "",
                        score : 2,
                    },
                ]
            }
        }
    }
</script>

<style lang="scss">
    .score_scrap_table {
        font-family: 'Lato', Arial, sans-serif;
        color: #989c9b;

        .container_ex_ta > header {
            margin: 0 auto;
            padding: 3%;
            padding-bottom: 0;
            text-align: center;
        }

        .container_ex_ta > header h1 {
            font-weight: 600;
            font-size: 24px;
            margin: 0;
        }

        h3 {
            margin: 0;
        }
        footer {
            text-align: center;
        }
        ol {
            text-align: left;
        }

        .wrapper {
            line-height: 1.5em;
            margin: 0 auto;
            padding: 5% 0 5%;
            width: 100%;
            max-width: 2000px;
            overflow: hidden;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            background: #fff;
        }

        th {
            background-color: #30A9D9;
            font-weight: bold;
            color: #fff;
            white-space: nowrap;
        }

        td, th {
            padding: 3%;
            text-align: left;
        }

        tbody th {
            background-color: #2ea879;
        }
        tbody tr:nth-child(2n-1) {
            background-color: #f5f5f5;
            transition: all .125s ease-in-out;
        }
        tbody tr:hover {
            background-color: rgba(50, 98, 149, .3);
        }

        .name img {
            float: left;
            margin-right: 10px;
            width: 40px;
            height: 40px;
        }

        .name {
            position: relative;
            overflow: hidden;
            width: 75%;

        }

        .name p {
            margin: 0;
        }

        .points span {
            color: #f94e66;
            font-size: 18px;
            margin-left: 3px;
        }
    }

</style>