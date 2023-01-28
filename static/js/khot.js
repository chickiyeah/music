$(document).ready(function () {
    window.top.toast("로딩중입니다.")
    if (window.location.href.includes("?")) {
        let type = window.location.href.split("?")[1].split("=")[1]
        if (type == "khit") {
            document.getElementById("l_title").innerText = "🔥 K-힛 리스트: 국내 인기 음악 🔥"
            khit()
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
            for (let i = 1; i < 101; i++) { // 스와이퍼 갯수
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