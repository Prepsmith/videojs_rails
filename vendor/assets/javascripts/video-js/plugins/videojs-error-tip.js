(function(vjs) {
"use strict";
 var
  extend = function(obj) {
    var arg, i, k;
    for (i = 1; i < arguments.length; i++) {
      arg = arguments[i];
      for (k in arg) {
        if (arg.hasOwnProperty(k)) {
          obj[k] = arg[k];
        }
      }
    }
    return obj;
  },

  defaults = {
    title: "The video connection was lost, please confirm you're connected to the internet.",
    buttonText: 'Retry',
    tryErrorTime: 2000,
    buttonClick: '',
    beforeMethod: ''
  },

  errorTip = function(options) {
    var player = this;
    var timeoutId = null;
    var timeoutError = null;
    var el = this.el();
    var settings = extend({}, defaults, options || {});
    var htmlStr = "<div class='vjs-error-tip'>"+
          "<div class='vjs-error-tip-full'></div>"+
          "<div class='vjs-error-tip-box'>"+
          "<div class='vjs-error-tip-title'>"+settings.title+"</div>"+
          "</div>"+
          "<div class='vjs-error-tip-button'>"+settings.buttonText+"</div>"+
          "</div>";

    if ($(el).find('.vjs-error-tip').length === 0){
      $(el).append(htmlStr);
    };

    var isErrorId = null;
    var errorTipDom = $(el).find('.vjs-error-tip');
    var titleDom = $(errorTipDom).find('.vjs-error-tip-title');
    var buttonDom = $(errorTipDom).find('.vjs-error-tip-button');

    buttonDom.click(function() {
      closeAlert();
      if (typeof settings.buttonClick === "function") {
        settings.buttonClick();
        setIsError(true);
      }

      // if (isError() && timeoutId === null){
      //   timeoutId = setTimeout(openAlert(),500);
      // }
    });

    function isError(){
      return errorTipDom.data('isError');
    }

    function setIsError(val) {
      errorTipDom.data('isError', val);
    }

    function resetTimeout(){
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      // setIsError(false);
    }

    function resetSession() {
      errorTipDom.hide();
      isErrorId = null;
      titleDom.text(settings.title);
      buttonDom.text(settings.buttonText);
      $(el).find('.vjs-tech').show();
    }

    function openAlert(){
      resetSession();
      if (typeof settings.beforeMethod === "function") {
        settings.beforeMethod();
      };
      errorTipDom.show();
    }

    function closeAlert() {
      resetSession();
      resetTimeout();
    }

    function checkIsError() {
      timeoutError = setTimeout(
        (function(){
          player.error(settings.title);
        }).bind(this),
        settings.tryErrorTime);
    }

    function clearIsError() {
      if (timeoutError) {
        clearTimeout(timeoutError);
        timeoutError = null;
      }
    }

    player.on('error', function() {
      openAlert();
    });

    player.on('play', function() {
      checkIsError();
    });

    player.on('ended', function() {
      clearIsError();
    });

    player.on('playing', function() {
      // if (isError() && timeoutId !== null) {
      //   closeAlert();
      //   setIsError(false);
      // }
      clearIsError();
    });

    player.errorTip = {
      reset: function(){
        resetSession();
      }
    };

    // player.on('error', function() {
    //   numberDom.Text();
    //   console.log('.................this.error():', this.error());
    //   console.log('.................this.networkState():', this.networkState());
    // });
  };

  vjs.plugin('errorTip', errorTip);
})(window.videojs);
