function CanCaptcha(options){
    var self = this;

    this.form = document.getElementById(options.form);
    this.form.addEventListener("submit", function(){self.checkCaptcha(self)}, false);
    this.captchaCheck = document.getElementById(options.input);

   var canvas = document.getElementById("cap"),
        ctx = canvas.getContext("2d"),
        len = Math.random() * (7-5)+5;

    this.capVal = [];

    for(var i = 0; i < len; i++){
        this.capVal.push(~(Math.random() * (122- 48) +48));
    }

    canvas.width = 100;
    canvas.height = 50;
    ctx.fillStyle = "#3c3c3c";
    ctx.fillRect(0,0,100,50);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px arial";
    for(var i = 0; i < this.capVal.length; i++){
      var x = (6*i)+6;
      ctx.save();
      ctx.translate(x,1);
      ctx.rotate((Math.random()*(15-30)+15) * Math.PI / 180);
      ctx.fillText(String.fromCharCode(~this.capVal[i]),x,30);
      ctx.restore();
    }
};

CanCaptcha.prototype = {
        checkCaptcha : function(captcha){
            for(var i = 0; i < captcha.capVal.length; i++){
                if(captcha.captchaCheck.value[i] == String.fromCharCode(~captcha.capVal[i])){
                    continue;
                        }else{
                            alert('error');
                            return false;
                        }
            }
            alert('correct');
            return true;
        }
}

var captcha = new CanCaptcha({form : "capForm", input : "capCheck"});