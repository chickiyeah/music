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
})


async function khit() {
    $.ajax({
        type: "GET",
        url: "/api/list/k-hit",
        success: function (res) {
            console.log("thumbnail : ", res[0])
            for (let i = 0; i < 3; i++) {
                var vid = res[getRandomIntInclusive(1, 100)]
                $.ajax({
                    type: "POST",
                    url: "/api/musicinfo",
                    data: {
                        "id": vid
                    },
                    success: function (res) {
                        let card = `<li><img onclick="play('${res.vid}')" id="best_img" src="${res.thumbnail}" alt="${res.title}"></li>`
                        $("#ktop100").append(card)
                    }
                })
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