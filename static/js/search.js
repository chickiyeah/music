function search(keyword) {
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
