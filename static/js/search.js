function search(keyword) {
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

function play(code) {
    window.top.play(code)
}
