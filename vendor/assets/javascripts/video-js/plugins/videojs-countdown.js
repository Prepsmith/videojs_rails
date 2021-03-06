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
    var isStart = true;
    var interval;
    var count = settings.count;
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
    var numberDom = $(countdownDom).find('.number');
    var cancelDom = $(countdownDom).find('.vjs-countdown-cancel')
    var countdownTitle = $(countdownDom).find('.vjs-countdown-title')

    function resetSession() {
      clearInterval(interval);
      isCancel = false;
      count = settings.count;
      countdownDom.hide();
      numberDom.text(settings.count);
    }

    player.countdown = {
      updateNextPlayTitle: function(title) {
        resetSession();
        settings.nextPlayTitle = title;
        countdownTitle.text(title);
      },
      reset: function(){
        resetSession();
      },
      stop: function(){
        isStart = false;
      },
      start: function(){
        isStart = true;
      }
    };

    cancelDom.click(function() {
      resetSession();
    });

    player.on('play', function() {
      resetSession();
    });

    var counter_started = 0;
    player.on('ended', function() {
      if (isStart) {
        countdownDom.show();
        interval = setInterval(function(){
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
      }
      // if (counter_started === 0) {
      //   counter_started++;
      //   player.on('playing', function() {
      //     count = settings.count;
      //     isCancel = false;
      //     countdownDom.hide();
      //     clearInterval(interval);
      //   });
      // }
    });
  };
  vjs.plugin('countdown', countdown);
})(window.videojs);
