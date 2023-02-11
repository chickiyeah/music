function search(keyword) {
    if(keyword == '') {
        window.top.toast("검색 키워드를 입력해주세요.")
    }else{
        $.ajax({
            type: "POST",
            url: "/api/search",
            data: {
                "keyword": keyword
            },
            success: function (response) {
                $(`#l_container`).empty()
                response.forEach(res => {
                    $.ajax({
                        type: "POST",
                        url: "/api/musicinfo",
                        data: {
                            "id": res.id
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
                        }})
                });
            }
        })
    }
}

window.onkeydown = (e) => {
    if(e.code == "Enter") {
        if(document.getElementById('search-address').value == '') {
            window.top.toast("검색 키워드를 입력해주세요.")
        }else{
            search(document.getElementById('search-address').value)
        }
    }
}

function play(code) {
    window.top.play(code)
}
