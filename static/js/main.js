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

function mdetail() {
    return $('#Player').get(0).contentWindow.playingdata
}

function mDur(dur) {
    if($('#MainDisplay').get(0).contentWindow.location.href.split("/")[1] == "detail") {
        document.getElementById("dur").max = document.getElementById("youtube").duration
    }
}

function mPlay(curtime) {
    if($('#MainDisplay').get(0).contentWindow.location.href.split("/")[1] == "detail") {
        document.getElementById("dur").value = document.getElementById("youtube").currentTime
    }
}

function mSet(Settime) {
    if($('#MainDisplay').get(0).contentWindow.location.href.split("/")[1] == "detail") {
        document.getElementById("youtube").currentTime = document.getElementById("dur").value
    }
}