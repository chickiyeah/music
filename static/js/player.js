$(document).ready(function () {
    const el = document.createElement('div');
    document.body.appendChild(el);

    eruda.init({
        container: el,
        tool: ['console', 'network', 'elements'],
        useShadowDom: true,
        autoScale: true,
        defaults: {
            displaySize: 50,
            transparency: 0.9,
            theme: 'Monokai Pro'
        }
    });
})

function mDur() {
    document.getElementById("dur").max = document.getElementById("youtube").duration
}

function mPlay() {
    document.getElementById("dur").value = document.getElementById("youtube").currentTime
}

function mSet() {
    document.getElementById("youtube").currentTime = document.getElementById("dur").value
}

function search() {
    let keyword = document.getElementById("keyword").value
    $.ajax({
        type: "POST",
        url: "/api/search",
        data: {
            "keyword": keyword
        },
        success: function (response) {
            console.log(response)
        }
    })
}

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
                    let lyr = `<li>${lyrcis.text}</li>`
                    $("#CC").append(lyr)
                })
            },
            error: function (response) {
                $("#CC").empty()
                let lyr = `<li>등록된 가사가 없습니다.</li>`
                $("#CC").append(lyr)
            }
        })
    } catch (err) {
        $("#CC").empty()
        let lyr = `<li>등록된 가사가 없습니다.</li>`
        $("#CC").append(lyr)
    }
}

function newgetsong(id) {
    let audio_tag = document.getElementById('youtube');
    let vid = id
    console.log("Loading...")
    $.ajax({
        type: "POST",
        url: "/api/music/get_secure_music",
        data: {
            "url": vid
        },
        success: function (response) {
            if(response != "This Video is Live Stream"){
                console.log("LoadComplete")
                audio_tag.src = response;
                audio_tag.play()
                return response
            }else{
                console.log("Load Failed Reason: This Video is Live Stream")
                alert("이 영상을 재생할수 없습니다.\n사유: 이 영상은 실시간 스트리밍입니다.")
                return
            }
        }
    })
}

var playingdata = ''
function youtube(id) {
    var vid = id,
        audio_streams = {},
        audio_tag = document.getElementById('youtube');

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

                playingdata = data;
                console.log(playingdata)
                if (!playingdata.videoDetails.title) {
                    alert("해당 아이디의 유튜브 영상은 존재하지 않습니다.\n유튜브 아이디를 확인해주세요.")
                }

                var streams = [],
                    result = {};

                if (data.streamingData) {

                    if (data.streamingData.adaptiveFormats) {
                        streams = streams.concat(data.streamingData.adaptiveFormats);
                    }

                    if (data.streamingData.formats) {
                        streams = streams.concat(data.streamingData.formats);
                    }

                } else {
                    console.log("Stream data check error skiping...")
                    newgetsong(vid);
                }

                streams.forEach(function (stream, n) {
                    var itag = stream.itag * 1,
                        quality = false;
                    switch (itag) {
                        case 18:
                            quality = "380P";
                            break;
                        case 139:
                            quality = "48kbps";
                            break;
                        case 140:
                            quality = "128kbps";
                            break;
                        case 141:
                            quality = "256kbps";
                            break;
                        case 249:
                            quality = "webm_l";
                            break;
                        case 250:
                            quality = "webm_m";
                            break;
                        case 251:
                            quality = "webm_h";
                            break;
                    }
                    if (quality) audio_streams[quality] = stream.url;
                });

                console.log(audio_streams);
                audio_tag.src = audio_streams['256kbps'] || audio_streams['128kbps'] || audio_streams['48kbps'];
                audio_tag.play().catch(function (err) { newgetsong(vid) });
                requestCC(vid);
                //alert("서버에 재생을 요청했습니다.\n잠시만 기다려주세요.")
            })
        }
    });
}