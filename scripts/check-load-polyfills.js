window.PolyfillHelpers = window.PolyfillHelpers || {};
;(function(PolyfillHelpers) {
  PolyfillHelpers.loadPolyfillLib = function (checkCallback, polyfillPath, opt, onload) {
    if (checkCallback) { 
      opt = opt || {};
      opt.async = (opt.async === undefined) ? true : opt.async;  
      
      var cbResult = checkCallback();

      if (!cbResult) {
        var script = document.createElement('script');
        script.async = opt.async;
        script.src = polyfillPath;
        script.onload = function () { 
          onload(true); /* param: polyfillUsed */
        };
        document.head.appendChild(script);
      } else {
        onload(false);
      }
    }
  };
}(window.PolyfillHelpers));