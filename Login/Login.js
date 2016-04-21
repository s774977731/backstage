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

    //点击忘记密码

    $('#forgetPassword').click(function () {
        $('#login').css({'display':'none'});
        $('#forgetPass').css({'display':'block'})
    });

    /**
     * 忘记密码
     */

    //获取验证码
    var wait = 60;
    var is_success = false;//验证码是否发送成功
    function time(self) {
        if (wait == 0) {
            self.text("获取验证码");
            self.removeClass("disabled").attr('disabled', false);
            wait = 60;
        } else {
            self.text(wait + '秒重新获取');
            self.addClass("disabled").attr('disabled', true);
            wait--;
            setTimeout(function() {
                time(self)
            },1000)
        }
    }

    $('#Btn_SMS_Reg').click(function () {
        //检测手机号
        var phoneNum = $('#phoneNum').val();
        if(phoneNum == "") {
            $('#checkNumHelp').text('请输入手机号');
            return false;
        }else if (!is_phone(phoneNum)) {
            $('#checkNumHelp').text('手机号码格式不正确');
            return false;
        }else {
            $('#checkNumHelp').text('');
            time($(this));
            //请求手机验证码
            $.post('api/sms', function (data) {
                if(data){
                    //信息发送成功
                    is_success = true;
                }else {

                }
            })
        }
    });


    //点击确定--跳转
    $('#confirm').click(function () {
        //检查验证码
        var captchaInput = $('#captchaInput').val;
        $.ajax({
            url: "/api/check/captcha/{captcha}",
            data:{captcha:captchaInput},
            statusCode: {
                404: function() {
                    console.log("404:page not found");
                }
            },
            xhrFields: {
                withCredentials: true
            }
        }).done(function (data) {
            //这里判断是否相等
            if(true) {
                $('#forgetPass').hide();
                $('#resetPass').fadeIn()
            }else {
                $('#checkCode').text('验证码错误');

            }
        });
    });


    /**
     * 重置密码
     */
    $('#reset').click(function () {
        var phonePass = $('#phonePass').val();
        var rePhonePass = $('#rePhonePass').val();
        if(phonePass =="" || rePhonePass == "") {
            $('#checkLength').text('请输入密码');
        }else if(phonePass !== rePhonePass){
            $('#checkLength').text('两次输入的密码不一致');
        }else if(rePhonePass.length < 6){
           $('#checkLength').text('密码太短，请输入大于6位的字符密码');
        }else {
            $('#checkLength').text('');
            $('#getModal').modal({backdrop: 'static', keyboard: false}).css({
                "margin-top": function () {
                    return $(window).height() / 4;
                }
            });
            $.post(
                'api/change/password',
                {new_passward:phonePass,new_confirm_password:rePhonePass},
                function (data) {
                    if(data) {
                        $('#PassConfirm').click(function () {
                            window.location.href = "../../";
                        });
                    }else {
                        //do something
                    }
                }
            );
        }
    });


});

