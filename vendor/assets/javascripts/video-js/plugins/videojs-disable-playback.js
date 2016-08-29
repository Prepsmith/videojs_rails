(function(vjs) {

  var
    /**
     * Copies properties from one or more objects onto an original.
     */
    extend = function(obj /*, arg1, arg2, ... */) {
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

    // define some reasonable defaults for this sweet plugin
    defaults = {
      autoDisable: false
    },

    // plugin initializer
    disablePlayback = function(options) {
      var
        // save a reference to the player instance
        player = this,
        state = false,

        // merge options and defaults
        settings = extend({}, defaults, options || {});

      // disable / enable methods
      player.disablePlayback = {
        disable: function() {
            state = true;

            player.controlBar.progressControl.seekBar.off("mousedown");
            player.controlBar.progressControl.seekBar.off("touchstart");
            player.controlBar.progressControl.seekBar.off("click");
            player.controlBar.progressControl.seekBar.el().style.cursor = 'default';
            player.controlBar.playToggle.off("click");
            player.controlBar.playToggle.el().style.cursor = 'default';
        },
        enable: function() {
            state = false;
            player.controlBar.progressControl.seekBar.on("mousedown",  player.controlBar.progressControl.seekBar.handleMouseDown);
            player.controlBar.progressControl.seekBar.on("touchstart", player.controlBar.progressControl.seekBar.handleMouseDown);
            player.controlBar.progressControl.seekBar.on("click", player.controlBar.progressControl.seekBar.handleClick);
            player.controlBar.progressControl.seekBar.el().style.cursor = 'pointer';
            player.controlBar.playToggle.on("click",  player.controlBar.playToggle.handleClick);
            player.controlBar.playToggle.el().style.cursor = 'pointer';
        },
        getState: function(){
          return state;
        }
      };

      if(settings.autoDisable)
      {
        player.disablePlayback.disable();
      }
    };

  // register the plugin with video.js
  vjs.plugin('disablePlayback', disablePlayback);

}(window.videojs));
