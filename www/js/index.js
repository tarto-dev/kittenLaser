/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
        document.addEventListener("backbutton", onBackKeyDown, false);

        window.plugins.insomnia.keepAwake();
        var level = 1,
            speedModifier = 0.1,
            levelText = ["Idle", "Easy", "Normal", "Hard", "Insane"],
            laserSettings = {
                "background-color": "#F00",
                "height": "15px",
                "width": "15px"
            };


        $('.mode-select').on('change', function () {
            level = +$('.mode-select option:selected').val();
            $('.level').text(levelText[level]);

            switch (level) {
                default:
                case 1:
                    laserSettings.height = "40px";
                    laserSettings.width = "40px";
                    speedModifier = 0.2;
                    break;

                case 2:
                    laserSettings.height = "30px";
                    laserSettings.width = "30px";
                    speedModifier = 0.3;
                    break;

                case 3:
                    laserSettings.height = "20px";
                    laserSettings.width = "20px";
                    speedModifier = 0.4;
                    break;

                case 4:
                    laserSettings.height = "10px";
                    laserSettings.width = "10px";
                    speedModifier = 0.7;
                    break;
            }

            $('.laser-pointer').css(laserSettings);
        });

        switch (level) {
            default:
            case 1:
                laserSettings.height = "40px";
                laserSettings.width = "40px";
                break;

            case 2:
                laserSettings.height = "30px";
                laserSettings.width = "30px";
                speedModifier = 0.3;
                break;

            case 3:
                laserSettings.height = "20px";
                laserSettings.width = "20px";
                speedModifier = 0.4;
                break;

            case 4:
                laserSettings.height = "10px";
                laserSettings.width = "10px";
                speedModifier = 0.7;
                break;
        }

        function levelUp() {
            var current = level;

            if (level >= 4) {
                return 4;
            }
            else if (level <= 1) {
                return 2;
            } else {
                return level + 1;
            }
        }

        animateDiv();

        var hits = 0;
        $(".laser-container").on('click', function () {
            hits++;

            if (hits % 5 == 0) {
                level = levelUp();
            }

            $('.hits').text(hits);

            $('.level').text(levelText[level]);

            $('.a').hide();
            setTimeout(function () {
                $('.a').show();
            }, 2000);
        })

        function makeNewPosition() {
            // Get viewport dimensions (remove the dimension of the div)
            var h = $(window).height() - 50;
            var w = $(window).width() - 50;

            var nh = Math.floor(Math.random() * h);
            var nw = Math.floor(Math.random() * w);

            return [nh, nw];

        }

        function animateDiv() {
            var newq = makeNewPosition();
            var oldq = $('.a').offset();
            var speed = calcSpeed([oldq.top, oldq.left], newq);

            $('.a').animate({top: newq[0], left: newq[1]}, speed, function () {
                animateDiv();
            });

        };

        function calcSpeed(prev, next) {

            var x = Math.abs(prev[1] - next[1]);
            var y = Math.abs(prev[0] - next[0]);

            var greatest = x > y ? x : y;

            var speed = Math.ceil(greatest / speedModifier);

            return speed;

        }

        function onBackKeyDown(e) {
            e.preventDefault();
            openSelect(".mode-select");
            return false;
        }
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
    }
};

app.initialize();


var openSelect = function (selector) {
    var element = $(selector)[0], worked = false;


    var el = element;
    if (window.document.createEvent) { // All
        var evt = window.document.createEvent("MouseEvents");
        evt.initMouseEvent("mousedown", false, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        el.dispatchEvent(evt);
    } else if (el.fireEvent) { // IE
        el.fireEvent("onmousedown");
    }
}


// keytool -genkey -v -keystore kittenlaser.keystore -alias kittenlaser -keyalg RSA -keysize 2048 -validity 10000
// jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore kittenlaser.keystore kittenlaser.apk kittenlaser
// zipalign -p 4 my.apk my-aligned.apk
