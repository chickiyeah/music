$(function () {
  //오늘의 bgm 스와이퍼
  var mainswiper = new Swiper(".mainSwiper", {
    effect: "cube",
    grabCursor: true,
    slidesPerView: "1", //화면에 여러개 패널 보이기
    cubeEffect: {
      shadow: true, // 슬라이더 밑의 그림자 표시 여부
      slideShadows: true, // 슬라이더를 돌릴때 흐릿해 지는 그림자 표시 여부
      shadowOffset: 40, // 그림자 위치, 수치가 클수록 아래로 내려감
      shadowScale: 0.4, // 그림자 크기, 수치가 클수록 그림자 커짐
    },
  });
  // 인기차트 100 스와이퍼
  var bestSwiper = new Swiper(".bestSwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
  });
  // movie 20 스와이퍼
  var globalSwiper = new Swiper(".globalSwiper", {
    slidesPerView: "auto",
    spaceBetween: 30,
  });
  // 더보기 클래스 생성
  $("#more_list>li").addClass("li_bg");
  // 더보기 버튼 css
  $(".li_bg").css({
    background: "rgba(0, 0, 0, 0.1)",
    "border-radius": "20px",
    "line-height": "25px",
    "text-align": "left",
    margin: "3px",
    "padding-top": "6px",
    "padding-left": "6px",
    "box-shadow": "1px 1px 1px 1px rgba(0, 0, 0, 0.15)",
  });
  // 더보기 클래스 삭제
  $("#more_list>li").removeClass("li_bg");

  // 글로벌 pop 초기 갯수
  $("#more_list>li").slice(0, 3).show();
  let leng = $("#more_list>li").length;
  let isBool = false;
  console.log(leng);
  $(".more")
    .css("cursor", "pointer")
    .click(function (e) {
      e.preventDefault();
      // 클릭시 more
      if (isBool === false) {
        let leng2 = $("#more_list>li:hidden").length;
        $("#more_list>li:hidden").slice(0, 10).show();
        console.log(leng2);
        $(".more").text("close▲");
        return (isBool = true);
      } else {
        console.log(isBool);
        let leng3 = $("#more_list>li").slice(3, 6).hide();
        console.log(leng3);
        $(".more").text("more▼");
        return (isBool = false);
      }
    });

  // 글로벌 20 스와이퍼
  var popmvSwiper = new Swiper(".popmvSwiper", {
    // effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    pagination: {
      el: ".swiper-pagination",
    },
  });

  // file 커스텀
});
