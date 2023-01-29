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
})


async function khit() {
    $.ajax({
        type: "GET",
        url: "/api/list/k-hit",
        success: function (res) {
            let cardall = ""
            for (let i = 0; i < 2; i++) { // 스와이퍼 갯수
                for (let j = 0; j < 3; j++) { // 스와이퍼 하나당 표시할 갯수                    
                    var vid = res[(((i+1)*3+1)-(5-(j+1)))]                
                    $.ajax({
                        type: "POST",
                        url: "/api/musicinfo",
                        data: {
                            "id": vid
                        },
                        success: function (res) {
                            let card = `<li><img onclick="play('${res.vid}')" id="best_img" src="${res.thumbnail}" alt="${res.title}"></li>`
                            $(`#ktop${i}`).append(card)
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
                    var vid = res[(((i+1)*3+1)-(5-(j+1)))]          
                    console.log(j)      
                    $.ajax({
                        type: "POST",
                        url: "/api/musicinfo",
                        data: {
                            "id": vid
                        },
                        success: function (res) {
                            let card = `<li><img onclick="play('${res.vid}')" id="global_img" src="${res.thumbnail}" alt="${res.title}"></li>`
                            $(`#ksurgevid${i}`).append(card)
                        }
                    })
                }
                sleep(25)
                cardall = `
                            <ul id="ksurgevid${i}" class="swiper-slide list">
                            </ul>
                            `
                
                            $("#ksurgevid_swiper").append(cardall)
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

function getchannelvideos(channel) {
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