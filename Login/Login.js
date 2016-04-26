$(document).ready(function() {
  /**
   * 全局的链接
   */
  var Login = 'http://192.168.0.8:8080/backend/Public/video';

    /**
     *用户登录
     */
    //检测是否为手机号
    var is_phone = function (phone_number) { return /^1[34578]\d{9}$/.test(phone_number); };

    $('#inputPhone').blur(function () {
        var phone = $(this).val();
        if(!is_phone(phone)){
            $('#checkPhone').text('请输入正确的手机号');
        }else {
            $('#checkPhone').text('');
        }
    });

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
            //window.location.href = 'hello.html';
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
        if (data) {
          console.log(data.data);
          sessionStorage.setItem('user_id',data.data.user_id);
          sessionStorage.setItem('token',data.data.token);

          window.location.href = 'demo.html';
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

