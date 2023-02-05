$(document).ready(function () {
    window.top.toast("로딩중입니다.")
    if (window.location.href.includes("?")) {
        let type = window.location.href.split("?")[1].split("=")[1]
        if (type == "khit") {
            document.getElementById("l_title").innerText = "🔥 K-힛 리스트: 국내 인기 음악 🔥"
            khit()
        }
        if (type == "ksurgevid20") {
            document.getElementById("l_title").innerText = "🔥 국내 인기 급상승 동영상 20 🔥"
            ksurgevid20()
        }
    } else {
        window.top.toast("올바르지 않은 접근입니다.\n메인 화면으로 돌아갑니다.")
        window.location.href = "/index"
    }
})

function play(code) {
    window.top.play(code)
}


function sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) { }
}


async function khit() {
    $.ajax({
        type: "GET",
        url: "/api/list/k-hit",
        success: function (res) {
            console.log("thumbnail : ", res[0])
            let cardall = ""
            for (let i = 0; i < 100; i++) { // 스와이퍼 갯수
                $.ajax({
                    type: "POST",
                    url: "/api/musicinfo",
                    data: {
                        "id": res[i]
                    },
                    success: function (res) {
                        let card = `<div class="list_content" onclick="play('${res.vid}')">
                                        <div class="list_img">
                                            <img src="${res.thumbnail}" alt="">
                                        </div>
                                        <div class="list_info">
                                            <p>${res.title}</p>
                                            <p>${res.author}</p>
                                        </div>
                                    </div>`
                        
                        //`<li><img onclick="play('${res.vid}')" id="best_img" src="${res.thumbnail}" alt="${res.title}"></li>`
                        $(`#l_container`).append(card)
                    }
                })
                sleep(25)
            }
        }
    })
}

async function ksurgevid20() {
    $.ajax({
        type: "GET",
        url: "/api/surgevideo20",
        success: function (res) {
            console.log("thumbnail : ", res[0])
            let cardall = ""
            for (let i = 0; i < 20; i++) { // 스와이퍼 갯수
                $.ajax({
                    type: "POST",
                    url: "/api/musicinfo",
                    data: {
                        "id": res[i]
                    },
                    success: function (res) {
                        let card = `<div class="list_content" onclick="showmodal('${res.vid}')">
                                        <div class="list_img">
                                            <img src="${res.thumbnail}" alt="">
                                        </div>
                                        <div class="list_info">
                                            <p>${res.title}</p>
                                            <p>${res.author}</p>
                                        </div>
                                    </div>`
                        
                        //`<li><img onclick="play('${res.vid}')" id="best_img" src="${res.thumbnail}" alt="${res.title}"></li>`
                        $(`#l_container`).append(card)
                    }
                })
                sleep(25)
            }
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
        }
    }
});