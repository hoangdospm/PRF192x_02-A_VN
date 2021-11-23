$(document).ready(function () {
    var urlHeadlines = 'https://gnews.io/api/v4/top-headlines?';
    var urlSearch = 'https://gnews.io/api/v4/search?q=';
    var token = '&token=80f239ee2c097fd685e78a09a91c19bc';
    var lang = '&lang=en';
    //Khởi tạo giao diện mặc định - Tình huống 1
    getData(urlHeadlines + token + lang);

    //Khởi tạo thuộc tính max cho input chức năng tìm kiếm lọc theo ngày - Tiêu chí nâng cao
    let d = new Date();
    let maxDate = (d.toISOString().slice(0,10));
    $("#start-date").prop("max", maxDate);
    $("#end-date").prop("max", maxDate);

    //Xử lý trở về trang chủ khi bấm vào GNEWS
    $("#head-lines").click(function (e) {
        e.preventDefault();
        $("#breaking-news").click();
    });

    //Xử lý tìm kiếm từ khóa - Tình huống 2
    $("#search-button").click(function (e) {
        e.preventDefault();
        //Lấy dữ liệu trên form
        let keyword = $("#key-word").val().trim();
        let startDate = $("#start-date").val();
        let endDate = $("#end-date").val();
        //Kiểm tra dữ liệu, nếu không đạt sẽ hiện noti và không làm gì tiếp
        if (!validateInput(keyword,startDate,endDate)) {
            return;
        }
        //Dữ liệu OK -> Xóa dữ liệu trên form và tắt modal
        $("#search-cancel").click();
        $("#key-word").val("");
        $("#start-date").val("");
        $("#end-date").val("");
        colorDefaultTopic();
        //Xử lý dữ liệu lọc theo ngày - Tiêu chí nâng cao
        let from = '';
        let to = '';
        if (startDate.length) {
            from = '&from=' + startDate + 'T00:00:00Z';
        }
        if (startDate.length) {
            to = '&to=' + endDate + 'T23:59:59Z';
        }
        //Tạo link để gửi request
        let url = urlSearch + encodeURIComponent(keyword) + token + lang + from + to;
        getData(url);
    });

    //Hàm kiểm tra dữ liệu đầu vào và bật tắt noti báo sai dữ liệu gì
    function validateInput(keyword,startDate,endDate) {
        let res = true;
        if (keyword.length == 0) {
            res = false;
            $("#kw-noti").css("display", "block");
        } else {
            $("#kw-noti").css("display", "none");
        }
        if (startDate.length > 0 && endDate.length > 0 && startDate > endDate) {
            res = false;
            $("#date-noti").css("display", "block");
        } else {
            $("#date-noti").css("display", "none");
        }
        return res;
    }

    //Thêm chức năng tìm theo các chủ đề trong mục tin tức hàng đầu - Tiêu chí nâng cao
    $("#topic input").click(function () {
        let topic = $(this).val();
        colorDefaultTopic();
        $(this).addClass("btn-danger");
        $(this).removeClass("btn-default");
        let topicQuery = "&topic=" + topic;
        let url = urlHeadlines + token + topicQuery + lang;
        getData(url);
    });

    //Hàm tô màu default cho tất cả các nút
    function colorDefaultTopic() {
        $("#topic input").each(function () {
            $(this).addClass("btn-default");
            $(this).removeClass("btn-danger");
        });
    }

    //Hàm gửi request lấy response rồi gọi hàm hiển thị
    function getData(url) {
        //Hiển thị biểu tượng loading - Tiêu chí nâng cao
        $("#loading").css("display", "block");
        //Khởi tạo lại nội dung tin tức
        $("#total").html('');
        $("#newsList").html('');
        //Bắt đầu gửi request thông qua JS API Fetching
        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                displayData(data);
            });
    }

    //Hàm hiển thị từ data json
    function displayData(obj) {
        //Có dữ liệu trả về -> Ẩn biểu tượng loading
        $("#loading").css("display", "none");
        //Các dòng dưới đây hiển thị nội dung
        $("#total").html('Có khoảng ' + obj.totalArticles + ' kết quả. (Dưới đây là các tin tức mới nhất)');
        let articles = obj.articles;
        for (let article of articles) {
            let content = '<div class="row">';
            content += '<div class="col-md-4">';
            content += '<img src=' + article.image + '>';
            content += '</div>';
            content += '<div class="col-md-8">';
            //Tiêu đề có gắng link mở bằng tab mới - Tình huống 3
            content += '<h2><a href=' + article.url + ' target="_blank">' + article.title + '</a></h2>';
            content += '<p>' + article.publishedAt + '</p>';
            content += '<p>' + article.description + '</p>';
            content += '</div>';
            content += '</div>';
            $("#newsList").append(content);
        }
    }
});