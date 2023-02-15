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

function forcepause() {
    return $('#Player').get(0).contentWindow.forcepause()
}

function getvol() {
    return $('#Player').get(0).contentWindow.getvol()
}

function volSet(nvol) {
    return $('#Player').get(0).contentWindow.setvol(nvol)
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