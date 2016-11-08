window.PerfHelpers = window.PerfHelpers || {};
;(function(PerfHelpers) {
  var timers = {};
  PerfHelpers = window.performance || {};
  PerfHelpers.now = PerfHelpers.now || function () {};

  if ((!console) || (!console.time)) {
    console.time = function() {};
    console.timeEnd = function() {};
  }

  var consoleTime = console.time.bind(window.console);
  var consoleTimeEnd = console.timeEnd.bind(window.console);

  console.time = function(key) {
    var phTimeKey = '[PHTime]' + key;
    timers[phTimeKey + '_start'] = PerfHelpers.now();
    var _startDate = (new Date().toLocaleString());
    timers[phTimeKey + '_startDate'] = _startDate;
    //console.log(phTimeKey + '[STARTED]: ' + _startDate);
    consoleTime(phTimeKey);
  };

  console.timeEnd = function (key) {
    var phTimeKey = '[PHTime]' + key;
    var _startTime = timers[phTimeKey + '_start'];
    if (_startTime) {
      var _endDate = (new Date().toLocaleString());
      var _endTime = PerfHelpers.now();
      var _totalTime = _endTime - _startTime;
      delete timers[phTimeKey + '_start'];
      delete timers[phTimeKey + '_startDate'];

      //console.log(phTimeKey + '[ENDED]: ' + _endDate);
      consoleTimeEnd(phTimeKey);

      if ('ga' in window) {
        var alKey = 'ACT_' + key;
        var _roundedTime = Math.round(_totalTime);
        ga('send', 'timing', 'web-performance', alKey, _roundedTime, 'Total Time');
        ga('send', {
          hitType: 'event',
          eventCategory: 'web-performance',
          eventAction: alKey,
          eventLabel: _endDate,
          eventValue: _roundedTime
        });
        // console.debug('[GA][timing]:', 'send', 'event', 'web-performance', alKey, _endDate, _roundedTime);
      }
      return _totalTime;
    } else {
      return undefined;
    }
  };
})(window.PerfHelpers);
