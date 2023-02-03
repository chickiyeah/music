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
                    var vid = res[(((i+1)*2+1)-(4-(j+1)))]            
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

//비디오 MODAL
const body = document.querySelector('body');
const modal = document.querySelector('.modal');
const btnOpenPopup = document.querySelector('.btn-open-popup');

jQuery.fn.center = function () {
	this.css('top', Math.max(0,(($(window).height()-$(this).outerHeight())/2) + $(window).scrollTop())+'px');
	this.css('left', Math.max(0,(($(window).width()-$(this).outerWidth())/2) + $(window).scrollLeft())+'px');
	return this;
}

function showmodal() {
    console.log(modal)
    window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
    modal.classList.toggle('show');
    //document.getElementById("k_swiper").style.visibility="hidden";
    //document.getElementById("g_swiper").style.visibility="hidden";
    if (modal.classList.contains('show')) {
        body.style.overflow = 'hidden';

    }
    //$("modal").center()
};

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.toggle('show');
    //document.getElementById("k_swiper").style.visibility="visible";
    //document.getElementById("g_swiper").style.visibility="visible";
    if (!modal.classList.contains('show')) {
      body.style.overflow = 'auto';

    }
  }
});