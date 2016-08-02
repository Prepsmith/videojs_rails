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
    count: 10,
    prompt: 'The next play',
    nextPlayTitle: "",
    cancelName: 'Cancel',
    getRelatedContent: function(callback){callback();},
    getNextVid: function(callback){callback();},
    getNextPlay: ''
  },

  countdown = function(options) {
    var player = this;
    var el = this.el();
    var settings = extend({}, defaults, options || {});
    var isCancel = false;
    var htmlStr = "<div class='vjs-countdown'>"+
          "<div class='vjs-overlay-full'></div>"+
          "<div class='vjs-text-area'>"+
          "<div class='vjs-countdown-tip'>"+settings.prompt+"</div>"+
          "<div class='vjs-countdown-title'>"+settings.nextPlayTitle+"</div>"+
          "</div>"+
          "<div class='vjs-countdown-countdown'><span class='number'>"+settings.count+"</span></div>"+
          "<div class='vjs-countdown-cancel'>"+settings.cancelName+"</div>"+
          "</div>";

    $(el).append(htmlStr);

    var countdownDom = $(el).find('.vjs-countdown');
    window.cdd = countdownDom;
    var numberDom = $(countdownDom).find('.number');
    var cancelDom = $(countdownDom).find('.vjs-countdown-cancel')

    cancelDom.click(function() {
      isCancel = true;
      countdownDom.hide();
    });

    player.on('playing', function() {
      countdownDom.hide();
      isCancel = false;
      //clearInterval(interval);
    });

    player.on('ended', function() {
      countdownDom.show();
      var count = settings.count;
      var interval = setInterval(function(){
        count--;
        numberDom.text(count);
        if (count <= 0) {
          clearInterval(interval);
          countdownDom.hide();
          numberDom.text(settings.count);
            if (typeof settings.getNextPlay === "function" && !isCancel) {
               settings.getNextPlay();
            }
          return;
        }
      }, 1000);
    });
  };
  vjs.plugin('countdown', countdown);
})(window.videojs);
