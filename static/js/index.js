function sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) { }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
}

function play(code) {
    window.top.play(code)
}

$(document).ready(function () {
    khit()
    ksurgevid20()
    global_top_100()
})


async function khit() {
    $.ajax({
        type: "GET",
        url: "/api/list/k-hit",
        success: function (res) {
            let cardall = ""
            for (let i = 0; i < 2; i++) { // 스와이퍼 갯수
                for (let j = 0; j < 3; j++) { // 스와이퍼 하나당 표시할 갯수                    
                    var vid = res[(((i + 1) * 3 + 1) - (5 - (j + 1)))]
                    $.ajax({
                        type: "POST",
                        url: "/api/musicinfo",
                        data: {
                            "id": vid
                        },
                        success: function (res) {
                            let card = `<li><img onclick="play('${res.vid}')" id="best_img" src="${res.thumbnail}" alt="${res.title}"></li>`
                            $(`#ktop${i}`).append(card)
                        },
                        error: function (err) {

                        }
                    })
                }
                sleep(25)
                cardall = cardall + `
                            <ul id="ktop${i}" class="swiper-slide list">
                            </ul>
                            `

            }
            $("#k-hit_swiper").append(cardall)
        }
    })
}

async function ksurgevid20() {
    $.ajax({
        type: "GET",
        url: "/api/surgevideo20",
        success: function (res) {
            let cardall = ""
            for (let i = 0; i < 2; i++) { // 스와이퍼 갯수
                for (let j = 0; j < 2; j++) { // 스와이퍼 하나당 표시할 갯수                    
                    var vid = res[(((i + 1) * 2 + 1) - (4 - (j + 1)))]
                    $.ajax({
                        type: "POST",
                        url: "/api/musicinfo",
                        data: {
                            "id": vid
                        },
                        success: function (res) {
                            let card = `<li><img onclick="showmodal('${res.vid}')" id="global_img" src="${res.thumbnail}" alt="${res.title}"></li>`
                            $(`#ksurgevid${i}`).append(card)
                        }
                    })
                }
                sleep(25)
            }

        }
    })
}

async function ktop100() {
    $.ajax({
        type: "GET",
        url: "/api/top100",
        success: function (res) {
            res.forEach(function (id) {
                $.ajax({
                    type: "POST",
                    url: "/api/musicinfo",
                    data: {
                        "id": id
                    },
                    success: function (res) {
                        console.log(res)
                    }
                })
                sleep(25)
            })
        }
    })
}

async function global_top_100() {
    $.ajax({
        type: "GET",
        url: "/api/list/global_top_100",
        success: function (res) {
            for (let i = 0; i < 6; i++) {
                console.log(i)
                $.ajax({
                    type: "POST",
                    url: "/api/musicinfo",
                    data: {
                        "id": res[i]
                    },
                    success: function (res) {
                        let card = `<li>
                                        <div class="pop_img">
                                            <img style="width:49px" src="${res.thumbnail}" alt="외국 인기차트 이미지">
                                        </div>
                                        <div class="pop_txt">
                                            <p style="font-size:13px">${res.title}</p>
                                            <p style="font-size:13px; color:orange">${res.author}</p>
                                        </div>
                                    </li>`
                        
                        $("#more_list").append(card)
                    }
                })
                sleep(25)               
            }
        }
    })
}

async function getchannelvideos(channel) {
    console.log("Getting All Videos For This Channel...")
    $.ajax({
        type: "POST",
        url: "/api/channel/getvideos",
        data: {
            "channel": channel
        },
        success: function (response) {
            console.log(response)
            console.log("Successfully All Videos For This Channel")
            return response
        }
    })
}

function newgetvideo(id) {
    let audio_tag = document.getElementById('youtube');
    let vid = id
    console.log("Loading...")
    $.ajax({
        type: "POST",
        url: "/api/music/get_secure_video",
        data: {
            "url": vid
        },
        success: function (response) {
            if (response != "This Video is Live Stream") {
                console.log("LoadComplete")
                console.log(response);
                document.getElementById("i_mv_player").src = response

                fetch("https://images" + ~~(Math.random() * 33) + "-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=" + encodeURIComponent("https://www.youtube.com/watch?hl=en&v=" + vid)).then(response => {
                    if (response.ok) {
                        response.text().then(data => {

                            var regex = /(?:ytplayer\.config\s*=\s*|ytInitialPlayerResponse\s?=\s?)(.+?)(?:;var|;\(function|\)?;\s*if|;\s*if|;\s*ytplayer\.|;\s*<\/script)/gmsu;

                            data = data.split('window.getPageData')[0];
                            data = data.replace('ytInitialPlayerResponse = null', '');
                            data = data.replace('ytInitialPlayerResponse=window.ytInitialPlayerResponse', '');
                            data = data.replace('ytplayer.config={args:{raw_player_response:ytInitialPlayerResponse}};', '');


                            var matches = regex.exec(data);
                            var data = matches && matches.length > 1 ? JSON.parse(matches[1]) : false;

                            $("#title").text(data.videoDetails.title)
                            $("#author").text(data.videoDetails.author)
                        })
                    }
                })
                return response
            } else {
                console.log("Load Failed Reason: This Video is Live Stream")
                alert("이 영상을 재생할수 없습니다.\n사유: 이 영상은 실시간 스트리밍입니다.")
                return
            }
        }
    })
}

//비디오 MODAL
const body = document.querySelector('body');
const modal = document.querySelector('.modal');
const btnOpenPopup = document.querySelector('.btn-open-popup');

jQuery.fn.center = function () {
    this.css('top', Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + 'px');
    this.css('left', Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + 'px');
    return this;
}

function showmodal(id) {
    console.log(modal)
    window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
    modal.classList.toggle('show');
    //document.getElementById("k_swiper").style.visibility="hidden";
    //document.getElementById("g_swiper").style.visibility="hidden";
    if (modal.classList.contains('show')) {
        body.style.overflow = 'hidden';
        window.top.forcepause()
    }
    let res = newgetvideo(id)
    console.log(document.getElementById("i_mv_player").src)  
};

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.toggle('show');
        //document.getElementById("k_swiper").style.visibility="visible";
        //document.getElementById("g_swiper").style.visibility="visible";
        if (!modal.classList.contains('show')) {
            body.style.overflow = 'auto';
            document.getElementById("i_mv_player").pause()
            window.top.toggleplay()
        }
    }
});