$(document).ready(function () {
    var detail = window.top.mdetail()
    var thumbnailsize =  detail.videoDetails.thumbnail.thumbnails.length
    console.log(thumbnailsize)
    var thumbnail = detail.videoDetails.thumbnail.thumbnails[thumbnailsize-1].url
    $("#dthumbnail")[0].src = thumbnail
    $("#title").text(detail.videoDetails.title)
    $("#author").text(detail.videoDetails.author)
    requestCC(detail.videoDetails.videoId)
    mDur(window.top.maxtime)
    if(window.top.isplaying()) {
        $("#play").append('<i onclick="toggleplay()" class="fa-solid fa-pause"></i>')
    }else{
        $("#play").append('<i onclick="toggleplay()" class="fa-solid fa-play"></i>')
    }
})

function mDur(dur) {
    document.getElementById("dur").max = dur
}

function mPlay(curtime) {
    document.getElementById("dur").value = curtime
}

function mSet() {
    window.top.mSet(document.getElementById("dur").value)
}

function volSet() {
    window.top.volSet(document.getElementById("vol").value)
}

function toggleplay() {
    res = window.top.toggleplay()
    if(res == "paused") {
        $("#play").empty()
        $("#play").append('<i onclick="toggleplay()" class="fa-solid fa-play"></i>')
    }else{
        $("#play").empty()
        $("#play").append('<i onclick="toggleplay()" class="fa-solid fa-pause"></i>')       
    }
}

window.onkeydown = (e) => {if(e.code == "Space"){toggleplay()}};

function requestCC(id) {
    try {
        $.ajax({
            type: "POST",
            url: "/api/lyrcis",
            data: {
                "video_id": id
            },
            success: function (response) {
                $("#CC").empty()
                response.forEach(function (lyrcis) {
                    let lyr = `<p>${lyrcis.text}</p>`
                    $("#CC").append(lyr)
                })
            },
            error: function (response) {
                $("#CC").empty()
                let lyr = `<p>등록된 가사가 없습니다.</p>`
                $("#CC").append(lyr)
            }
        })
    } catch (err) {
        $("#CC").empty()
        let lyr = `<p>등록된 가사가 없습니다.</p>`
        $("#CC").append(lyr)
    }
}


const body = document.querySelector('body');
const vol = document.querySelector(".volume")
function showvol() {
    window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
    vol.classList.toggle('show');

    if (vol.classList.contains('show')) {
        body.style.overflow = 'hidden';
    }

};

vol.addEventListener('click', (event) => {
    if (event.target === vol) {
        vol.classList.toggle('show');
        //document.getElementById("k_swiper").style.visibility="visible";
        //document.getElementById("g_swiper").style.visibility="visible";
        if (!vol.classList.contains('show')) {
            body.style.overflow = 'auto';
        }
    }
});