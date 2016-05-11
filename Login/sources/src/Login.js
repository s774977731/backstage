$(document).ready(function() {
  /**
   * 全局的链接
   */
  var Login = 'http://bi.webei.cn/video';

    /**
     *用户登录
     */

    $('#LoginForm').on('submit', function () {
        var $f = $(this);
        var inputPhone = $('#inputPhone').val();
        var inputPassword = $('#inputPassword').val();
        var phone = $(this).val();
        //unix时间戳
        var timestamp = Date.parse(new Date());

        console.log($f.serialize());
        if(inputPassword == "" || phone == "") {
            $('#checkPhone').text('请输入账号/密码');
        }
        if(inputPassword.length > 0 || phone.length > 0) {
            $('#checkPhone').text('');
        }

      $.ajax({
        url: Login,
        data:{app:1,service:'Admin.Login',username:inputPhone,password:inputPassword,t:timestamp,sign:$.md5(timestamp+'lowkey')},
        method:'POST',
        dataType:'jsonp',
        statusCode: {
          404: function() {
            console.log("404:page not found");
            window.user = inputPhone;
            $('.modal-header').children()[0].innerHTML = '登录失败';
            $('#getModal').modal({backdrop: 'static', keyboard: false}).css({
              "margin-top": function () {
                return $(window).height() / 4;
              }
            });
          }
        },
        xhrFields: {
          withCredentials: true
        }
      }).done(function (data) {
        //这里判断是否相等
        if (data.data.code == 0) {
          console.log(data.data);
          sessionStorage.setItem('user_id',data.data.user_id);
          sessionStorage.setItem('token',data.data.token);
          window.location.href = 'http://localhost:9001/';
        } else {
          $('.modal-header').children()[0].innerHTML = '登录失败';
          $('#getModal').modal({backdrop: 'static', keyboard: false}).css({
            "margin-top": function () {
              return $(window).height() / 4;
            }
          });
        }
      });
        return false;
    });
});

