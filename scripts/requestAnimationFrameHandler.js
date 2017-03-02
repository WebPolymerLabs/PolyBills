(function(root) {
  var originalRAF = root.requestAnimationFrame;
  var customRAF = function (cb) {
    return setTimeout(cb, 1000 / 60);
  };
  var useOriginal = false;  
  //overwrite the function only once because other components also overwrite it
  //this way, no one will have directly reference to customRAF
  root.requestAnimationFrame = function(cb) {
    return useOriginal ? originalRAF(cb) : customRAF(cb);  
  };  
  originalRAF(function() {
    useOriginal = true; //will be executed when page get focus
  });  
})(window);
