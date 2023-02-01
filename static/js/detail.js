$(document).ready(function () {
    var detail = window.top.mdetail()
    console.log(detail)
    mDur(window.top.maxtime)
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