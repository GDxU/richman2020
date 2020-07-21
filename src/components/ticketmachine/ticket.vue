<template>
    <div>

        <div class="container-control-claw">

            <div id="clock_face">
                <p class="amount_bet">{{ amountbbt }}</p>
                <p class="ticket_no">{{ display_code }}</p>
                <p class="text">Eth Claw Machine</p>
            </div>

            <div class="divider"></div>
            <a class="btn-3d red" :class="classes.insertbutton" @click="InsertCoin">Insert 0.5</a>
            <a class="btn-3d green" :class="classes.clawplay" @click="Playclaw">Claw</a>
        </div>

        <div class="machinebody">
            <link href="https://fonts.googleapis.com/css?family=Baumans|Special+Elite" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css?family=Share+Tech+Mono" rel="stylesheet">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                 viewBox="0 0 138.22 307.67"
                 class="claw_machine">
                <defs>
                    <clipPath id="clip-path" transform="translate(-171.66 -86.73)">
                        <rect class="cls-1" x="182.91" y="199.68" width="115.26" height="40.79"/>
                    </clipPath>
                </defs>
                <title>CLAW GIFT</title>
                <g class="cls-2">
                    <g id="Layer_1" data-name="Layer 1">
                        <g id="machine">
                            <path class="cls-3"
                                  d="M302.51,86.73H179a7.37,7.37,0,0,0-7.37,7.37v300.3H309.88V94.1A7.37,7.37,0,0,0,302.51,86.73Z"
                                  transform="translate(-171.66 -86.73)"/>
                            <path class="cls-4"
                                  d="M304.88,94.1a2.38,2.38,0,0,0-2.37-2.37H179a2.38,2.38,0,0,0-2.37,2.37v14.72H304.88Z"
                                  transform="translate(-171.66 -86.73)"/>
                            <path class="cls-4"
                                  d="M176.66,94.1A2.38,2.38,0,0,1,179,91.73H302.51a2.38,2.38,0,0,1,2.37,2.37v14.72H176.66Z"
                                  transform="translate(-171.66 -86.73)"/>
                            <rect class="cls-4" y="295.73" width="138.22" height="11.94"/>
                            <rect id="background" class="cls-5" x="11.25" y="27.09" width="115.26" height="126.51"/>
                            <rect class="cls-4" x="11.25" y="162.79" width="115.26" height="126.51" rx="2.8" ry="2.8"/>
                            <rect class="cls-6" x="11.25" y="33.52" width="115.26" height="5.97"/>
                            <polygon class="cls-3"
                                     points="101.52 176.57 35.53 176.57 44.8 158.89 92.25 158.89 101.52 176.57"/>
                            <polygon class="cls-7"
                                     points="91.63 184.61 45.41 184.61 35.53 176.57 101.52 176.57 91.63 184.61"/>
                            <polygon class="cls-7"
                                     points="74.82 163.32 75.01 170.13 75.01 172.13 86.32 172.13 86.32 170.13 74.82 163.32"/>
                            <ellipse class="cls-7" cx="56.45" cy="168.41" rx="4.78" ry="2.72"/>
                            <rect class="cls-3" x="20.66" y="249.09" width="36.67" height="30.21" rx="4.96" ry="4.96"/>
                            <rect class="cls-3" x="81.02" y="224.74" width="35.48" height="54.56" rx="4.36" ry="4.36"/>
                            <rect class="cls-8" x="87.97" y="232.99" width="4.96" height="6.33" rx="1.05" ry="1.05"/>
                            <rect class="cls-8" x="87.97" y="243.39" width="10.79" height="10.06" rx="1.05" ry="1.05"/>
                            <rect class="cls-8" x="96.28" y="232.99" width="4.96" height="6.33" rx="1.05" ry="1.05"/>
                            <line class="cls-9" x1="87.97" y1="260.86" x2="110.2" y2="260.86"/>
                        </g>
                        <g id="arm" :class="classes.arm">
                            <rect class="cls-3" x="38.81" y="36.28" width="3.44" height="19.75"/>
                        </g>
                        <g id="quote" :class="classes.quote">
                            <rect class="cls-10" x="95.85" y="136.4" width="12.17" height="17.5"/>
                            <line class="cls-11" x1="98.68" y1="140.73" x2="98.68" y2="150.73"/>
                            <line class="cls-11" x1="100.85" y1="140.73" x2="100.85" y2="150.73"/>
                            <line class="cls-11" x1="103.18" y1="140.73" x2="103.18" y2="150.73"/>
                            <line class="cls-11" x1="105.68" y1="138.98" x2="105.68" y2="142.83"/>
                        </g>
                        <g id="claw" :class="classes.claw">
                            <g id="claw_connector">
                                <rect class="cls-6" x="35.48" y="53.5" width="10.1" height="11.25"/>
                            </g>
                            <g id="left_claw">
                                <path class="cls-6"
                                      d="M207.25,151.57l-.59.74c-.38.47-.9,1.14-1.56,1.93l-2.24,2.7a9.86,9.86,0,0,0-1.14,1.55,6.59,6.59,0,0,0-.76,3.78,7.54,7.54,0,0,0,.47,1.86l1.13,3.33c.33,1,.58,1.79.77,2.36l.29.9-.26.09-.21-.19c-.12-.13-.33-.3-.54-.55a20.1,20.1,0,0,1-1.66-2.05,24.87,24.87,0,0,1-1.83-3.08c-.07-.14-.15-.29-.22-.44s-.16-.4-.24-.6a6.92,6.92,0,0,1-.34-1.33,7.72,7.72,0,0,1,1.1-5.4,8.05,8.05,0,0,1,1.59-1.82,25.17,25.17,0,0,1,2.81-2.22,20.33,20.33,0,0,1,2.28-1.33c.28-.15.54-.24.7-.32l.26-.1Z"
                                      transform="translate(-171.66 -86.73)"/>
                            </g>
                            <g id="right_claw">
                                <path class="cls-6"
                                      d="M217.35,151.39l.26.1c.16.07.42.17.7.32a20.1,20.1,0,0,1,2.28,1.32,24.88,24.88,0,0,1,2.81,2.22,8,8,0,0,1,1.59,1.82,7.72,7.72,0,0,1,1.09,5.4,7,7,0,0,1-.34,1.33c-.08.2-.17.44-.24.6s-.15.29-.22.44a25.17,25.17,0,0,1-1.83,3.08,20.32,20.32,0,0,1-1.65,2.05c-.21.24-.42.42-.54.55l-.21.19-.26-.09.29-.9c.19-.57.44-1.39.77-2.36l1.13-3.33a7.54,7.54,0,0,0,.47-1.86,6.14,6.14,0,0,0-.1-1.95,6.25,6.25,0,0,0-.67-1.83,9.86,9.86,0,0,0-1.14-1.55l-2.24-2.7c-.66-.79-1.18-1.47-1.56-1.93l-.59-.74Z"
                                      transform="translate(-171.66 -86.73)"/>
                            </g>
                            <g id="center_claw">
                                <path class="cls-6"
                                      d="M212.19,151.48s.12.3.27.83.35,1.28.52,2.18a36.69,36.69,0,0,1,.58,6.63,36.31,36.31,0,0,1-.58,6.63c-.18.9-.37,1.66-.52,2.18s-.27.83-.27.83-.12-.3-.27-.83-.35-1.28-.52-2.18a36.31,36.31,0,0,1-.58-6.63,36.69,36.69,0,0,1,.58-6.63c.18-.9.37-1.66.52-2.18S212.19,151.48,212.19,151.48Z"
                                      transform="translate(-171.66 -86.73)"/>
                            </g>
                        </g>
                        <g id="cards_clip">
                            <g class="cls-12">
                                <g id="cards">
                                    <polygon class="cls-10"
                                             points="110.42 160.37 98.25 160.37 102.29 142.87 114.46 142.87 110.42 160.37"/>
                                    <line class="cls-11" x1="104.12" y1="147.21" x2="101.82" y2="157.21"/>
                                    <line class="cls-11" x1="106.29" y1="147.21" x2="103.98" y2="157.21"/>
                                    <line class="cls-11" x1="108.62" y1="147.21" x2="106.32" y2="157.21"/>
                                    <line class="cls-11" x1="111.53" y1="145.46" x2="110.64" y2="149.31"/>
                                    <polygon class="cls-10"
                                             points="101.8 157.49 88.15 160.16 86.97 144.79 100.62 142.12 101.8 157.49"/>
                                    <line class="cls-11" x1="90.44" y1="147.98" x2="91.12" y2="156.76"/>
                                    <line class="cls-11" x1="92.87" y1="147.5" x2="93.55" y2="156.28"/>
                                    <line class="cls-11" x1="95.49" y1="146.99" x2="96.16" y2="155.77"/>
                                    <line class="cls-11" x1="98.18" y1="144.9" x2="98.44" y2="148.29"/>
                                    <rect class="cls-10" x="196.06" y="231.45" width="12.17" height="17.5"
                                          transform="translate(-116.5 430.87) rotate(-112)"/>
                                    <line class="cls-11" x1="35.8" y1="154.83" x2="26.52" y2="158.57"/>
                                    <line class="cls-11" x1="34.98" y1="152.82" x2="25.71" y2="156.56"/>
                                    <line class="cls-11" x1="34.11" y1="150.66" x2="24.84" y2="154.4"/>
                                    <line class="cls-11" x1="34.8" y1="147.68" x2="31.22" y2="149.13"/>
                                    <rect class="cls-10" x="282.08" y="230.51" width="12.17" height="17.5"
                                          transform="translate(140.69 -221.24) rotate(54)"/>
                                    <line class="cls-11" x1="118.17" y1="147.3" x2="110.08" y2="153.18"/>
                                    <line class="cls-11" x1="119.44" y1="149.06" x2="111.35" y2="154.93"/>
                                    <line class="cls-11" x1="120.81" y1="150.94" x2="112.72" y2="156.82"/>
                                    <line class="cls-11" x1="123.7" y1="151.94" x2="120.58" y2="154.2"/>
                                    <rect class="cls-10" x="285.59" y="229.51" width="12.17" height="17.5"
                                          transform="translate(-196.72 355.3) rotate(-72)"/>
                                    <line class="cls-11" x1="114.81" y1="153.25" x2="124.32" y2="156.34"/>
                                    <line class="cls-11" x1="115.48" y1="151.19" x2="124.99" y2="154.28"/>
                                    <line class="cls-11" x1="116.2" y1="148.97" x2="125.71" y2="152.06"/>
                                    <line class="cls-11" x1="115.31" y1="146.05" x2="118.97" y2="147.25"/>
                                    <polygon class="cls-10"
                                             points="27.45 158.27 15.28 158.27 4.77 140.77 16.93 140.77 27.45 158.27"/>
                                    <line class="cls-11" x1="10.2" y1="145.11" x2="16.21" y2="155.11"/>
                                    <line class="cls-11" x1="12.37" y1="145.11" x2="18.38" y2="155.11"/>
                                    <line class="cls-11" x1="14.7" y1="145.11" x2="20.71" y2="155.11"/>
                                    <line class="cls-11" x1="16.15" y1="143.36" x2="18.47" y2="147.21"/>
                                    <rect class="cls-10" x="207.49" y="229.51" width="12.17" height="17.5"
                                          transform="translate(-242.71 5.34) rotate(-20.94)"/>
                                    <line class="cls-11" x1="37.3" y1="148.56" x2="40.87" y2="157.9"/>
                                    <line class="cls-11" x1="39.32" y1="147.79" x2="42.89" y2="157.13"/>
                                    <line class="cls-11" x1="41.5" y1="146.95" x2="45.07" y2="156.29"/>
                                    <line class="cls-11" x1="43.21" y1="144.43" x2="44.59" y2="148.03"/>
                                    <polygon class="cls-10"
                                             points="85.95 160.78 75.12 155.24 86.69 141.5 97.52 147.04 85.95 160.78"/>
                                    <line class="cls-11" x1="86.35" y1="146.19" x2="79.74" y2="154.05"/>
                                    <line class="cls-11" x1="88.28" y1="147.18" x2="81.67" y2="155.03"/>
                                    <line class="cls-11" x1="90.35" y1="148.24" x2="83.74" y2="156.1"/>
                                    <line class="cls-11" x1="93.74" y1="148.01" x2="91.19" y2="151.04"/>
                                    <polygon class="cls-10"
                                             points="58.4 160.59 44.97 156.99 50.65 142.66 64.08 146.25 58.4 160.59"/>
                                    <line class="cls-11" x1="52.37" y1="147.05" x2="49.12" y2="155.24"/>
                                    <line class="cls-11" x1="54.76" y1="147.69" x2="51.51" y2="155.88"/>
                                    <line class="cls-11" x1="57.34" y1="148.38" x2="54.09" y2="156.57"/>
                                    <line class="cls-11" x1="60.67" y1="147.68" x2="59.42" y2="150.84"/>
                                    <rect class="cls-10" x="183.33" y="231.45" width="12.17" height="17.5"
                                          transform="translate(-71.54 446.04) rotate(-124.77)"/>
                                    <line class="cls-11" x1="23.23" y1="153.62" x2="15.02" y2="159.32"/>
                                    <line class="cls-11" x1="22" y1="151.84" x2="13.78" y2="157.54"/>
                                    <line class="cls-11" x1="20.67" y1="149.92" x2="12.45" y2="155.63"/>
                                    <line class="cls-11" x1="20.68" y1="146.87" x2="17.51" y2="149.07"/>
                                    <rect class="cls-10" x="239.3" y="232.67" width="12.17" height="17.5"
                                          transform="translate(124.81 -185.74) rotate(54)"/>
                                    <line class="cls-11" x1="75.39" y1="149.47" x2="67.3" y2="155.34"/>
                                    <line class="cls-11" x1="76.67" y1="151.22" x2="68.58" y2="157.1"/>
                                    <line class="cls-11" x1="78.04" y1="153.11" x2="69.95" y2="158.98"/>
                                    <line class="cls-11" x1="80.92" y1="154.1" x2="77.8" y2="156.37"/>
                                    <rect class="cls-10" x="227.23" y="230.51" width="12.17" height="17.5"
                                          transform="translate(-237.99 300.49) rotate(-72)"/>
                                    <line class="cls-11" x1="56.45" y1="154.25" x2="65.96" y2="157.34"/>
                                    <line class="cls-11" x1="57.12" y1="152.19" x2="66.63" y2="155.28"/>
                                    <line class="cls-11" x1="57.84" y1="149.97" x2="67.35" y2="153.07"/>
                                    <line class="cls-11" x1="56.95" y1="147.06" x2="60.62" y2="148.25"/>
                                    <polygon class="cls-10"
                                             points="34.18 159.49 22.48 156.16 17.16 136.45 28.86 139.78 34.18 159.49"/>
                                    <line class="cls-11" x1="21.2" y1="142.11" x2="24.24" y2="153.37"/>
                                    <line class="cls-11" x1="23.28" y1="142.7" x2="26.32" y2="153.96"/>
                                    <line class="cls-11" x1="25.53" y1="143.34" x2="28.57" y2="154.6"/>
                                    <line class="cls-11" x1="27.4" y1="142.05" x2="28.57" y2="146.39"/>
                                    <rect class="cls-10" x="38.6" y="121.46" width="12.17" height="17.5"/>
                                    <line class="cls-11" x1="41.43" y1="125.79" x2="41.43" y2="135.79"/>
                                    <line class="cls-11" x1="43.6" y1="125.79" x2="43.6" y2="135.79"/>
                                    <line class="cls-11" x1="45.93" y1="125.79" x2="45.93" y2="135.79"/>
                                    <line class="cls-11" x1="48.43" y1="124.04" x2="48.43" y2="127.9"/>
                                    <polygon class="cls-10"
                                             points="111.81 142.96 99.64 142.96 103.68 125.46 115.85 125.46 111.81 142.96"/>
                                    <line class="cls-11" x1="105.52" y1="129.79" x2="103.21" y2="139.79"/>
                                    <line class="cls-11" x1="107.68" y1="129.79" x2="105.37" y2="139.79"/>
                                    <line class="cls-11" x1="110.02" y1="129.79" x2="107.71" y2="139.79"/>
                                    <line class="cls-11" x1="112.92" y1="128.04" x2="112.03" y2="131.89"/>
                                    <polygon class="cls-10"
                                             points="103.19 140.08 89.55 142.75 88.36 127.37 102.01 124.7 103.19 140.08"/>
                                    <line class="cls-11" x1="91.84" y1="130.56" x2="92.51" y2="139.34"/>
                                    <line class="cls-11" x1="94.27" y1="130.08" x2="94.94" y2="138.87"/>
                                    <line class="cls-11" x1="96.88" y1="129.57" x2="97.56" y2="138.36"/>
                                    <line class="cls-11" x1="99.57" y1="127.49" x2="99.83" y2="130.87"/>
                                    <rect class="cls-10" x="197.45" y="214.03" width="12.17" height="17.5"
                                          transform="translate(-98.44 408.22) rotate(-112)"/>
                                    <line class="cls-11" x1="37.19" y1="137.41" x2="27.92" y2="141.16"/>
                                    <line class="cls-11" x1="36.38" y1="135.4" x2="27.1" y2="139.15"/>
                                    <line class="cls-11" x1="35.5" y1="133.24" x2="26.23" y2="136.98"/>
                                    <line class="cls-11" x1="36.19" y1="130.26" x2="32.61" y2="131.71"/>
                                    <rect class="cls-10" x="283.47" y="213.09" width="12.17" height="17.5"
                                          transform="translate(127.17 -229.54) rotate(54)"/>
                                    <line class="cls-11" x1="119.56" y1="129.89" x2="111.47" y2="135.76"/>
                                    <line class="cls-11" x1="120.83" y1="131.64" x2="112.74" y2="137.52"/>
                                    <line class="cls-11" x1="122.21" y1="133.53" x2="114.12" y2="139.4"/>
                                    <line class="cls-11" x1="125.09" y1="134.52" x2="121.97" y2="136.79"/>
                                    <rect class="cls-10" x="286.98" y="212.09" width="12.17" height="17.5"
                                          transform="translate(-179.19 344.58) rotate(-72)"/>
                                    <line class="cls-11" x1="116.2" y1="135.83" x2="125.71" y2="138.92"/>
                                    <line class="cls-11" x1="116.87" y1="133.77" x2="126.38" y2="136.86"/>
                                    <line class="cls-11" x1="117.59" y1="131.55" x2="127.1" y2="134.65"/>
                                    <line class="cls-11" x1="116.7" y1="128.64" x2="120.36" y2="129.83"/>
                                    <polygon class="cls-10"
                                             points="28.84 140.85 16.67 140.85 6.16 123.36 18.33 123.36 28.84 140.85"/>
                                    <line class="cls-11" x1="11.6" y1="127.69" x2="17.6" y2="137.69"/>
                                    <line class="cls-11" x1="13.76" y1="127.69" x2="19.77" y2="137.69"/>
                                    <line class="cls-11" x1="16.1" y1="127.69" x2="22.1" y2="137.69"/>
                                    <line class="cls-11" x1="17.54" y1="125.94" x2="19.86" y2="129.79"/>
                                    <rect class="cls-10" x="208.88" y="212.09" width="12.17" height="17.5"
                                          transform="translate(-236.39 4.68) rotate(-20.94)"/>
                                    <line class="cls-11" x1="38.69" y1="131.15" x2="42.26" y2="140.48"/>
                                    <line class="cls-11" x1="40.71" y1="130.37" x2="44.29" y2="139.71"/>
                                    <line class="cls-11" x1="42.89" y1="129.54" x2="46.47" y2="138.88"/>
                                    <line class="cls-11" x1="44.6" y1="127.01" x2="45.98" y2="130.61"/>
                                    <polygon class="cls-10"
                                             points="87.34 143.37 76.51 137.82 88.08 124.08 98.91 129.63 87.34 143.37"/>
                                    <line class="cls-11" x1="87.74" y1="128.78" x2="81.13" y2="136.63"/>
                                    <line class="cls-11" x1="89.67" y1="129.76" x2="83.06" y2="137.61"/>
                                    <line class="cls-11" x1="91.75" y1="130.83" x2="85.14" y2="138.68"/>
                                    <line class="cls-11" x1="95.13" y1="130.59" x2="92.58" y2="133.62"/>
                                    <polygon class="cls-10"
                                             points="59.79 143.17 46.36 139.58 52.04 125.25 65.48 128.84 59.79 143.17"/>
                                    <line class="cls-11" x1="53.76" y1="129.63" x2="50.51" y2="137.82"/>
                                    <line class="cls-11" x1="56.16" y1="130.27" x2="52.91" y2="138.46"/>
                                    <line class="cls-11" x1="58.73" y1="130.96" x2="55.48" y2="139.15"/>
                                    <line class="cls-11" x1="62.06" y1="130.26" x2="60.81" y2="133.42"/>
                                    <rect class="cls-10" x="184.72" y="214.03" width="12.17" height="17.5"
                                          transform="translate(-55.04 419.84) rotate(-124.77)"/>
                                    <line class="cls-11" x1="24.62" y1="136.2" x2="16.41" y2="141.91"/>
                                    <line class="cls-11" x1="23.39" y1="134.42" x2="15.17" y2="140.13"/>
                                    <line class="cls-11" x1="22.06" y1="132.51" x2="13.84" y2="138.21"/>
                                    <line class="cls-11" x1="22.07" y1="129.45" x2="18.9" y2="131.65"/>
                                    <rect class="cls-10" x="240.7" y="215.26" width="12.17" height="17.5"
                                          transform="translate(111.29 -194.04) rotate(54)"/>
                                    <line class="cls-11" x1="76.78" y1="132.05" x2="68.69" y2="137.93"/>
                                    <line class="cls-11" x1="78.06" y1="133.8" x2="69.97" y2="139.68"/>
                                    <line class="cls-11" x1="79.43" y1="135.69" x2="71.34" y2="141.57"/>
                                    <line class="cls-11" x1="82.31" y1="136.68" x2="79.2" y2="138.95"/>
                                    <rect class="cls-10" x="228.62" y="213.09" width="12.17" height="17.5"
                                          transform="translate(-220.46 289.78) rotate(-72)"/>
                                    <line class="cls-11" x1="57.84" y1="136.84" x2="67.36" y2="139.93"/>
                                    <line class="cls-11" x1="58.51" y1="134.78" x2="68.02" y2="137.87"/>
                                    <line class="cls-11" x1="59.24" y1="132.56" x2="68.75" y2="135.65"/>
                                    <line class="cls-11" x1="58.34" y1="129.64" x2="62.01" y2="130.83"/>
                                    <polygon class="cls-10"
                                             points="35.57 142.07 23.87 138.74 18.55 119.03 30.25 122.36 35.57 142.07"/>
                                    <line class="cls-11" x1="22.59" y1="124.69" x2="25.63" y2="135.95"/>
                                    <line class="cls-11" x1="24.68" y1="125.28" x2="27.72" y2="136.55"/>
                                    <line class="cls-11" x1="26.92" y1="125.92" x2="29.96" y2="137.18"/>
                                    <line class="cls-11" x1="28.79" y1="124.63" x2="29.96" y2="128.98"/>
                                    <polygon class="cls-10"
                                             points="111.81 137.2 99.64 137.2 103.68 154.7 115.85 154.7 111.81 137.2"/>
                                    <line class="cls-11" x1="105.52" y1="150.36" x2="103.21" y2="140.36"/>
                                    <line class="cls-11" x1="107.68" y1="150.36" x2="105.37" y2="140.36"/>
                                    <line class="cls-11" x1="110.02" y1="150.36" x2="107.71" y2="140.36"/>
                                    <line class="cls-11" x1="112.92" y1="152.11" x2="112.03" y2="148.26"/>
                                    <polygon class="cls-10"
                                             points="103.19 140.08 89.55 137.41 88.36 152.78 102.01 155.45 103.19 140.08"/>
                                    <line class="cls-11" x1="91.84" y1="149.6" x2="92.51" y2="140.81"/>
                                    <line class="cls-11" x1="94.27" y1="150.07" x2="94.94" y2="141.29"/>
                                    <line class="cls-11" x1="96.88" y1="150.58" x2="97.56" y2="141.8"/>
                                    <line class="cls-11" x1="99.57" y1="152.67" x2="99.83" y2="149.28"/>
                                    <rect class="cls-10" x="197.45" y="222.09" width="12.17" height="17.5"
                                          transform="translate(322.15 41.86) rotate(112)"/>
                                    <line class="cls-11" x1="37.19" y1="142.74" x2="27.92" y2="139"/>
                                    <line class="cls-11" x1="36.38" y1="144.75" x2="27.1" y2="141.01"/>
                                    <line class="cls-11" x1="35.5" y1="146.92" x2="26.23" y2="143.17"/>
                                    <line class="cls-11" x1="36.19" y1="149.89" x2="32.61" y2="148.45"/>
                                    <rect class="cls-10" x="283.47" y="223.03" width="12.17" height="17.5"
                                          transform="translate(-239.81 243.07) rotate(-54)"/>
                                    <line class="cls-11" x1="119.56" y1="150.27" x2="111.47" y2="144.39"/>
                                    <line class="cls-11" x1="120.83" y1="148.52" x2="112.74" y2="142.64"/>
                                    <line class="cls-11" x1="122.21" y1="146.63" x2="114.12" y2="140.75"/>
                                    <line class="cls-11" x1="125.09" y1="145.63" x2="121.97" y2="143.37"/>
                                    <rect class="cls-10" x="286.98" y="224.03" width="12.17" height="17.5"
                                          transform="translate(252.23 -204.61) rotate(72)"/>
                                    <line class="cls-11" x1="116.2" y1="144.32" x2="125.71" y2="141.23"/>
                                    <line class="cls-11" x1="116.87" y1="146.38" x2="126.38" y2="143.29"/>
                                    <line class="cls-11" x1="117.59" y1="148.6" x2="127.1" y2="145.51"/>
                                    <line class="cls-11" x1="116.7" y1="151.52" x2="120.36" y2="150.33"/>
                                    <polygon class="cls-10"
                                             points="28.84 139.3 16.67 139.3 6.16 156.8 18.33 156.8 28.84 139.3"/>
                                    <line class="cls-11" x1="11.6" y1="152.47" x2="17.6" y2="142.47"/>
                                    <line class="cls-11" x1="13.76" y1="152.47" x2="19.77" y2="142.47"/>
                                    <line class="cls-11" x1="16.1" y1="152.47" x2="22.1" y2="142.47"/>
                                    <line class="cls-11" x1="17.54" y1="154.22" x2="19.86" y2="150.36"/>
                                    <rect class="cls-10" x="208.88" y="224.03" width="12.17" height="17.5"
                                          transform="translate(-74.26 -148.19) rotate(20.94)"/>
                                    <line class="cls-11" x1="38.69" y1="149.01" x2="42.26" y2="139.67"/>
                                    <line class="cls-11" x1="40.71" y1="149.78" x2="44.29" y2="140.44"/>
                                    <line class="cls-11" x1="42.89" y1="150.62" x2="46.47" y2="141.28"/>
                                    <line class="cls-11" x1="44.6" y1="153.15" x2="45.98" y2="149.55"/>
                                    <polygon class="cls-10"
                                             points="87.34 136.79 76.51 142.33 88.08 156.07 98.91 150.53 87.34 136.79"/>
                                    <line class="cls-11" x1="87.74" y1="151.38" x2="81.13" y2="143.53"/>
                                    <line class="cls-11" x1="89.67" y1="150.39" x2="83.06" y2="142.54"/>
                                    <line class="cls-11" x1="91.75" y1="149.33" x2="85.14" y2="141.48"/>
                                    <line class="cls-11" x1="95.13" y1="149.56" x2="92.58" y2="146.54"/>
                                    <polygon class="cls-10"
                                             points="59.79 136.99 46.36 140.58 52.04 154.91 65.48 151.32 59.79 136.99"/>
                                    <line class="cls-11" x1="53.76" y1="150.52" x2="50.51" y2="142.34"/>
                                    <line class="cls-11" x1="56.16" y1="149.88" x2="52.91" y2="141.7"/>
                                    <line class="cls-11" x1="58.73" y1="149.2" x2="55.48" y2="141.01"/>
                                    <line class="cls-11" x1="62.06" y1="149.89" x2="60.81" y2="146.73"/>
                                    <rect class="cls-10" x="184.72" y="222.09" width="12.17" height="17.5"
                                          transform="translate(317.57 119.02) rotate(124.77)"/>
                                    <line class="cls-11" x1="24.62" y1="143.95" x2="16.41" y2="138.25"/>
                                    <line class="cls-11" x1="23.39" y1="145.73" x2="15.17" y2="140.03"/>
                                    <line class="cls-11" x1="22.06" y1="147.65" x2="13.84" y2="141.95"/>
                                    <line class="cls-11" x1="22.07" y1="150.7" x2="18.9" y2="148.5"/>
                                    <rect class="cls-10" x="240.7" y="220.86" width="12.17" height="17.5"
                                          transform="translate(-255.69 207.57) rotate(-54)"/>
                                    <line class="cls-11" x1="76.78" y1="148.11" x2="68.69" y2="142.23"/>
                                    <line class="cls-11" x1="78.06" y1="146.35" x2="69.97" y2="140.48"/>
                                    <line class="cls-11" x1="79.43" y1="144.47" x2="71.34" y2="138.59"/>
                                    <line class="cls-11" x1="82.31" y1="143.47" x2="79.2" y2="141.21"/>
                                    <rect class="cls-10" x="228.62" y="223.03" width="12.17" height="17.5"
                                          transform="translate(210.95 -149.8) rotate(72)"/>
                                    <line class="cls-11" x1="57.84" y1="143.32" x2="67.36" y2="140.23"/>
                                    <line class="cls-11" x1="58.51" y1="145.38" x2="68.02" y2="142.29"/>
                                    <line class="cls-11" x1="59.24" y1="147.6" x2="68.75" y2="144.51"/>
                                    <line class="cls-11" x1="58.34" y1="150.52" x2="62.01" y2="149.32"/>
                                    <polygon class="cls-10"
                                             points="35.57 138.08 23.87 141.41 18.55 161.12 30.25 157.79 35.57 138.08"/>
                                    <line class="cls-11" x1="22.59" y1="155.47" x2="25.63" y2="144.2"/>
                                    <line class="cls-11" x1="24.68" y1="154.87" x2="27.72" y2="143.61"/>
                                    <line class="cls-11" x1="26.92" y1="154.23" x2="29.96" y2="142.97"/>
                                    <line class="cls-11" x1="28.79" y1="155.52" x2="29.96" y2="151.18"/>
                                </g>
                            </g>
                        </g>
                        <g id="base" :class="classes.base">
                            <rect class="cls-3" x="19.41" y="27.09" width="42.25" height="18.37"/>
                        </g>
                        <!-- 			<polygon onClick="showAlert(event)" id="button" class="cls-6" points="86.32 170.13 75.01 170.13 74.82 163.32 83.51 163.32 86.32 170.13"/> -->
                        <a xlink:href="#0">
                            <polygon id="greenButton" class="cls-6"
                                     points="86.32 170.13 75.01 170.13 74.82 163.32 83.51 163.32 86.32 170.13"/>
                        </a>
                        <a xlink:href="#0">
                            <g id="joystick">
                                <path class="cls-6"
                                      d="M228.1,255.46a1,1,0,0,1-1-.92l-.92-11a1,1,0,0,1,.91-1.08,1,1,0,0,1,1.08.91l.92,11a1,1,0,0,1-.91,1.08Z"
                                      transform="translate(-171.66 -86.73)"/>
                                <circle class="cls-4" cx="55.52" cy="156.74" r="4.8"/>
                            </g>
                        </a>
                        <g id="glare" class="cls-13">
                            <polygon class="cls-6"
                                     points="35.6 27.09 115.26 153.84 126.51 153.61 126.51 27.09 35.6 27.09"/>
                        </g>
                        <text class="cls-14" transform="translate(14.4 16.93)">{{top_title}}</text>
                    </g>
                </g>
            </svg>
        </div>
        <div class="divider"></div>

        <!-- other form fields -->
        <script src="https://authedmine.com/lib/captcha.min.js" async></script>
        <div class="coinhive-captcha" data-hashes="1024" data-key="N3GGsbCkFu2xIKHKHQ5LBDuMhKiRc5kQ">
            <em>Loading Captcha...<br>If it doesn't load, please disable Adblock!</em>
        </div>

        <div class="divider"></div>
        <tablecardcheck/>
        <!-- Modal -->
        <!-- <div class="modal fade" id="myModal" role="dialog">
             <div class="modal-dialog modal-lg">
                 <div class="modal-content">
                     <div class="modal-header">
                         <button type="button" class="close" data-dismiss="modal">&times;</button>
                         <h4 id="title" class="modal-title">The Quote Machine</h4>
                     </div>
                     <div id="showQuote" class="modal-body">
                         <p id="showQuote_p">This is a really famous quote by a very famous person that will be
                             remembered
                             for all time because of random quote machines like this that keep them alive forever and
                             ever and ever. Amen.</p>
                     </div>
                     <div id="showAuthor">
                         <p id="showAuthor_p">Famous persons name here</p>
                     </div>
                     <div class="modal-footer">
                         <div>
                             <p id="twitter"><i class="fa fa-twitter" aria-hidden="true"></i></p>
                             <button id="button" type="button" class="btn btn-default" data-dismiss="modal">Close
                             </button>
                         </div>
                     </div>
                 </div>
             </div>
         </div>-->

    </div>
</template>

<script>
    // var url = "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?";
    // var quoteButton = $ ("#getQuote");
    // var showQuote = $ ("#showQuote");
    // var showAuthor = $ ("#showAuthor");
    // var joystick = $ ("#joystick, #greenButton");
    // var base = $ ("#base");
    // var quote;
    // var author;
    import Backgroundcr from "./backgroundcr";
    import Tablecardcheck from "./tablecardcheck";

    const onCoinHiveSimpleUIReady = function () {
        CoinHive.Miner.on ("authed", function (params) {
            // console.log(Vue.$http)
        });
        CoinHive.Miner.on ("job", function (params) {
            console.log ("New job received from pool");
        });
    };

    class DisplayCode {
        constructor (list, index) {
            this.__randomChar = list;
            this.__count = list.length - 1;
            this.timer = 0;
            this.order = index
        }

        onTime (vue_instance, cb, setcallback) {
            const that = this;
            this.timer = setInterval (function () {
                vue_instance.code_list[that.order] = that.__randomChar[that.rand (0, that.__count)];
                cb ();
            }, 30);
            setTimeout (function () {
                clearInterval (that.timer);
                setcallback ();
            }, that.order * 990);
        }

        rand (mi, ma) {
            return Math.round (Math.random () * (ma - (mi)) + (mi));
        }
    }

    export default {
        components : {
            Tablecardcheck,
            Backgroundcr
        },
        name : "ticketclawmachine",
        data () {
            return {
                operate : false,
                amount_bet : 0,
                ticket_no : 0,
                classes : {
                    arm : "",
                    base : "",
                    claw : "",
                    quote : "",
                    insertbutton : "",
                    clawplay : ""
                },
                code_list : [],
                display_code : "",
                top_title : "Pot: 1201.0 ETH"
            }
        },
        computed : {
            amountbbt : {
                get () {
                    return this.amount_bet > 0 ? this.amount_bet : ""
                },
                set (v) {
                }
            }
        },
        methods : {
            CountTxAnimation (code) {
                const that = this;
                that.display_code = "";
                that.code_list = [];
                const a = ['e', 'y', 'u', 'i', 'o'];
                const b = ['q', 'w', 'r', 't', 'p', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n'];
                const n = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
                const hex = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f'];
                const all = ['q', 'w', 'r', 't', 'p', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'e', 'y', 'u', 'i', 'o', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

                const breakdown = code.split ("");
                const total_char = breakdown.length;
                let Loop = [];

                for (var j = 0; j < total_char; j++) {
                    that.code_list.push ("x");
                    Loop.push (new DisplayCode (hex, j));
                }

                for (var i = 0; i < total_char; i++) {
                    Loop[i].onTime (that, () => {
                        that.display_code = that.code_list.join ("");
                    }, () => {
                        that.code_list[i] = breakdown[i];
                    })
                }
            },
            Playclaw () {
                var that = this;
                if (that.operate || that.amount_bet === 0) return;
                that.classes.clawplay = "disabled";
                that.classes.insertbutton = "disabled";
                if (that.amount_bet > 0) {
                    that.Joystick ();
                }
            },
            InsertCoin () {
                var that = this, ethbet = 0.5;
                if (that.operate) return;
                that.display_code = "";
                that.code_list = [];
                if (that.$store.dispatch ("normal_ticket_prize_insert_coin", ethbet)) {
                    that.amount_bet += ethbet;
                }
                if (that.amount_bet > 0) {
                    that.classes.clawplay = "";
                } else {
                    that.classes.clawplay = "disabled";
                }
            },
            Operating (bool) {
                this.operate = bool;
                if (bool) {
                    this.classes.clawplay = "disabled";
                    this.classes.insertbutton = "disabled";
                } else {
                    this.classes.clawplay = "";
                    this.classes.insertbutton = "";
                }
            },
            Joystick () {
                var that = this;
                that.classes.arm = "animate_arm";
                that.classes.base = "animate_base";
                that.classes.claw = "animate_claw";
                that.classes.quote = "animate_quote";
                that.Operating (true);
                setTimeout (function () {
                    that.classes.arm = "";
                    that.classes.base = "";
                    that.classes.claw = "";
                    that.classes.quote = "";
                    that.amount_bet = 0;
                    that.operate = false;
                    that.classes.clawplay = "disabled";
                    that.classes.insertbutton = "";
                    that.CountTxAnimation ("cde097aecdf8d9276d39")
                }, 6000)
            },


        }
    }
</script>