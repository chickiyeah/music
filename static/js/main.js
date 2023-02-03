let removeToast;

function toast(string) {
    const toast = document.getElementById("toast");

    toast.classList.contains("reveal") ?
        (clearTimeout(removeToast), removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 1000)) :
        removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 3000)
    toast.classList.add("reveal"),
        toast.innerText = string
}

function browse(url) {
    $('#MainDisplay').attr('src',$(this).attr(url));
}

function play(code) {
    $('#Player').get(0).contentWindow.youtube(code)
    toast("서버에 재생을 요청했습니다.\n잠시만 기다려주세요.")
}

function isplaying() {
    return $('#Player').get(0).contentWindow.isplaying()
}

function mdetail() {
    return $('#Player').get(0).contentWindow.playingdata
}
var maxtime = 0
function mDur(dur) {
    if($('#MainDisplay').get(0).contentWindow.location.href.split("/")[3] == "detail") {
        $('#MainDisplay').get(0).contentWindow.mDur(dur)
    }
    maxtime = dur
}

function toggleplay() {
    return $('#Player').get(0).contentWindow.toggleplay()
}

function mPlay(curtime) {
    if($('#MainDisplay').get(0).contentWindow.location.href.split("/")[3] == "detail") {
        $('#MainDisplay').get(0).contentWindow.mPlay(curtime)
    }
}

function mSet(Settime) {
    if($('#MainDisplay').get(0).contentWindow.location.href.split("/")[3] == "detail") {
        $('#Player').get(0).contentWindow.mSet(Settime)
    }
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
            if(response != "This Video is Live Stream"){
                console.log("LoadComplete")
                console.log(response);
                return response
            }else{
                console.log("Load Failed Reason: This Video is Live Stream")
                alert("이 영상을 재생할수 없습니다.\n사유: 이 영상은 실시간 스트리밍입니다.")
                return
            }
        }
    })
}