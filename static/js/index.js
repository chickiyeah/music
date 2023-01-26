function sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
  }

async function ktop100() {
    $.ajax({
        type: "GET",
        url:"/api/top100",
        success: function (res) {
            res.forEach(function(id) {
                     $.ajax({
                        type: "POST",
                        url:"/api/musicinfo",
                        data:{
                            "id":id
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