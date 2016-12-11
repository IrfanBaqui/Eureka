/*!---- responsive-----*/
/*!
 * jQuery lightweight responsive web adaptation plugin
 * Original author: @stildv
 * Copyright Â© 2011: Devrim Vardar, @stildv -- http://stild.com/
 * Further changes, comments: @stildv -- http://stild.com/code/jquery-responsive-web/
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://stild.com/license/
 * Date: Thu Oct 20 01:27:32 2011 +0300
 * Version: 1.00 (20-OCT-2010)
 * PS. I am not a wonderful coder, I neither have the patience nor the repertoire so this is almost as good as I get. Cheers. :)
 */
;
(function ($j, window, document, undefined) {

  $j.responsiveWeb = function (element, options) {

    var windowadaptTimeout;
    var tempCounter = 0;
    var winWidth;
    var winHeight;

    this.options = {};
    var that = this;
    element.data('responsiveWeb', this);

    this.init = function (element, options) {
      this.options = $j.extend({}, $j.responsiveWeb.defaultOptions, options);
      options = this.options;
      element.resize(checkResize);
      checkResize();
      if (options.manipulateDesign) {
        manipulateDesign();
      }
    };

    function delayedResize() {
      options = that.options;
      //window.status = ++tempCounter;
      var winNewWidth = $j(window).width();
      var winNewHeight = $j(window).height();
      if (winWidth != winNewWidth || winHeight != winNewHeight) {
        winWidth = winNewWidth;
        winHeight = winNewHeight;

        if (options.applyBodyClasses) {
          applyBodyClasses();
        }
        if (options.rearrangeObjects) {
          rearrangeObjects();
        }
      }
      //$j('body div.loadingDiv').remove();
    }

    function checkResize() {
      //window.scrollTo(0, 1);
      //$j('body').append('<div class="loadingDiv" style="width:100%;height:100%;position:absolute;left:0;top:0;zoom:1;filter:alpha(opacity=85);opacity:0.85;background:#AAA url(\'img/loading.gif\') no-repeat center center;">loading...</div>');
      window.clearTimeout(windowadaptTimeout);
      windowadaptTimeout = window.setTimeout(delayedResize, 100);
    }

    function applyBodyClasses() {
      options = that.options;
      clearBodyClasses();

      var currcC = '';
      var tmpWidth = decideResolution();
      var tmpArrWidth = tmpWidth.split(" ");
      tmpWidth = tmpArrWidth[0];
      if (options.applyPlatform) {
        currcC += decidePlatform();
      }
      if (options.applyBrowser) {
        currcC += decideBrowser();
      }
      if (options.applyResolution) {
        currcC += decideResolution();
      }
      $j('body').addClass(currcC);
      $j('body').attr("data-width", tmpWidth.substr(1));

      if (options.debug) {
        log(winWidth + 'x' + winHeight + ' || ' + $j('body').attr('class'));
      }
    }

    function log(str) {
      var debugDiv = '<div class="debugDiv" style="position:absolute;top:0;right:0;padding:2px;background:black;color:lime;font-size:9px;line-height:9px;"></div>';
      if ($j('.debugDiv ul').length) {
        $j('.debugDiv ul').append('<li>' + str + '</li>');
      } else {
        $j('body').append(debugDiv);
        $j('.debugDiv').append('<ul></ul>');
        $j('.debugDiv ul').append('<li>' + str + '</li>');
      }
    }

    function decidePlatform() {
      var cC = '';

      var platform = navigator.userAgent;
      if (platform.indexOf('Windows') > 0) {
        cC = 'windows' + ' ';
      } else if (platform.indexOf('Linux') > 0 && platform.indexOf('Android') < 0) {
        cC = 'linux' + ' ';
      } else if (platform.indexOf('Mac') > 0 && (platform.indexOf('iphone') < 0 || platform.indexOf('ipad') < 0)) {
        cC = 'mac' + ' ';
      } else if (platform.indexOf('iPhone') > 0) {
        cC = 'iphone' + ' ';
      } else if (platform.indexOf('iPad') > 0) {
        cC = 'ipad' + ' ';
      } else if (platform.indexOf('Android') > 0) {
        cC = 'android' + ' ';
      }

      return cC;
    }

    function decideBrowser() {
      var cC = '';
      options = that.options;

      var nVer = navigator.appVersion;
      var nAgt = navigator.userAgent;
      var browserName = navigator.appName;
      var fullVersion = '' + parseFloat(navigator.appVersion);
      var majorVersion = parseInt(navigator.appVersion, 10);
      var nameOffset, verOffset, ix;

      if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browserName = "opera";
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
          fullVersion = nAgt.substring(verOffset + 8);
      } else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browserName = "msie";
        fullVersion = nAgt.substring(verOffset + 5);
      } else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browserName = "chrome";
        fullVersion = nAgt.substring(verOffset + 7);
      } else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browserName = "safari";
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
          fullVersion = nAgt.substring(verOffset + 8);
      } else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browserName = "firefox";
        fullVersion = nAgt.substring(verOffset + 8);
      } else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
          browserName = navigator.appName;
        }
      }
      if ((ix = fullVersion.indexOf(";")) != -1) fullVersion = fullVersion.substring(0, ix);
      if ((ix = fullVersion.indexOf(" ")) != -1) fullVersion = fullVersion.substring(0, ix);

      majorVersion = parseInt('' + fullVersion, 10);
      if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
      }

      if (options.applyBrowser) {
        cC += browserName + ' ';
      }
      if (options.applyBrowserVersion) {
        cC += browserName + majorVersion + ' ';
      }

      return cC;
    }

    function decideResolution() {
      var h = $j(window).height();
      var w = $j(window).width();
      var cC = '';

      if (w >= 1880) {
        cC = 'w1920' + ' ';
      } else if (w >= 1560) {
        cC = 'w1600' + ' ';
      } else if (w >= 1400) {
        cC = 'w1440' + ' ';
      } else if (w >= 1240) {
        cC = 'w1280' + ' ';
      } else if (w >= 984) {
        cC = 'w1024' + ' ';
      } else if (w >= 728) {
        cC = 'w768' + ' ';
      } else if (w >= 440) {
        cC = 'w480' + ' ';
      } else if (w >= 280) {
        cC = 'w320' + ' ';
      } else {
        cC = 'wtiny' + ' ';
      }

      if (h >= 864) {
        cC += 'h1024' + ' ';
      } else if (h >= 740) {
        cC += 'h900' + ' ';
      } else if (h >= 608) {
        cC += 'h768' + ' ';
      } else if (h >= 440) {
        cC += 'h600' + ' ';
      } else if (h >= 320) {
        cC += 'h480' + ' ';
      } else {
        cC += 'htiny' + ' ';
      }

      return cC;
    }

    function clearBodyClasses() {
      $j('body').removeClass('w1920 w1600 w1440 w1280 w1024 w768 w480 w320 wtiny h1024 h900 h768 h600 h480 htiny');
    }

    this.init(element, options);
  };

  $j.fn.responsiveWeb = function (options) {
    return this.each(function () {
      (new $j.responsiveWeb($j(this), options));
    });
  };


  $j.responsiveWeb.defaultOptions = {
    applyBodyClasses: true,
    applyResolution: true,
    applyPlatform: true,
    applyBrowser: true,
    applyBrowserVersion: true,
    manipulateDesign: true,
    rearrangeObjects: true,
    debug: false
  };

})($j, window, document);

function viewport() {
  var e = window, a = 'inner';
  if (!('innerWidth' in window )) {
    a = 'client';
    e = document.documentElement || document.body;
  }
  return {width: e[a + 'Width'], height: e[a + 'Height']};
}

function manipulateDesign() {
}

function rearrangeObjects() {
  currWidth = viewport().width;
  if ($j(window).scrollTop() >= $j(".portfolioContainer").offset().top) {
    $j(".header").addClass("black");
    $j(".bannerText").addClass("out");
    $j(".project a img").each(function (i) {
      var thisEl = $j(this);
      setTimeout(function () {
        thisEl.removeClass("scaleOut");
      }, i * 100);
    });
  }
  else {
    $j(".header").removeClass("black");
    $j(".bannerText").removeClass("out");
    $j(".project a img").each(function (i) {
      var thisEl = $j(this);
      setTimeout(function () {
        thisEl.addClass("scaleOut");
      }, i * 100);
    });
  }
  $j(".bannerContainer").outerHeight(viewport().height);
  $j(".slide").css("min-height", viewport().height);


  if (currWidth > 901) {
    if ($j("html").hasClass("mm-opened")) {
      $j("#menu").trigger("close.mm");
    }
  }

  if (currWidth * 0.5604 < viewport().height)
    $j(".abs-background>img").addClass("heightD");
  else
    $j(".abs-background>img").removeClass("heightD");
  if (currWidth > 767) {
    setEqualHeight_CommonClass(".memberName");
    setEqualHeight_CommonClass(".member");
  }
  else {
    $j(".memberName,.member").outerHeight("auto");
  }

  if (currWidth >= 540) {
    setEqualHeight_CommonClass(".project");
  }
  else {
    $j(".project").height("auto");
  }

}

var isMobile;
var menuHeight;

$j(document).ready(function () {
  $j(window).responsiveWeb({
    applyBodyClasses: true,
    applyResolution: true,
    applyPlatform: true,
    applyBrowser: true,
    applyBrowserVersion: false,
    manipulateDesign: true,
    rearrangeObjects: true
  });

});

var scrolling = false;
var lastScrollTop = 0;

function handleScroll(dir) {
  var scrollAmount = $j(window).scrollTop();
  var scrollDir = dir;
  if ($j(".portfolioContainer").length >= 1 && !scrolling) {
    if (scrollDir == "down") {
      if (scrollAmount < $j(".portfolioContainer").offset().top) {
        scrolling = true;
        $j("html,body").animate({
          scrollTop: $j(".portfolioContainer").offset().top
        }, 1000);
        setTimeout(function () {
          scrolling = false
        }, 1000);
        $j(".header").addClass("black");
        $j(".bannerText").addClass("out");
        $j(".project a img").each(function (i) {
          var thisEl = $j(this);
          setTimeout(function () {
            thisEl.removeClass("scaleOut");
          }, i * 100);
        });
      }
      else {
        scrolling = true;
        $j("html,body").animate({
          scrollTop: scrollAmount + (viewport().height - $j(".header").height())
        }, 1000);
        setTimeout(function () {
          scrolling = false
        }, 1000);
      }
    }
    else if (scrollDir == "up") {
      if (scrollAmount <= $j(".portfolioContainer").offset().top) {
        scrolling = true;

        $j("html,body").animate({
          scrollTop: 0
        }, 1000);
        setTimeout(function () {
          scrolling = false
        }, 1000);
        $j(".header").removeClass("black");
        $j(".bannerText").removeClass("out");
        $j(".project a img").each(function (i) {
          var thisEl = $j(this);
          setTimeout(function () {
            thisEl.addClass("scaleOut");
          }, i * 100);
        });
      }
      else {
        scrolling = true;
        if ((scrollAmount - (viewport().height - $j(".header").height())) < $j(".portfolioContainer").offset().top) {
          $j("html,body").animate({
            scrollTop: $j(".portfolioContainer").offset().top
          }, 1000);
        }
        else {
          $j("html,body").animate({
            scrollTop: scrollAmount - (viewport().height - $j(".header").height())
          }, 1000);
        }
        setTimeout(function () {
          scrolling = false
        }, 1000);
      }
    }
  }
  lastScrollTop = scrollAmount;
}


$j(window).load(function () {

  rearrangeObjects();

  sq = window;
  if (sq.addEventListener) {
    sq.addEventListener("mousewheel", MouseWheelHandler, false);
    sq.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
  }
  else sq.e.attachEvent("onmousewheel", MouseWheelHandler);

  function MouseWheelHandler(e) {

    // cross-browser wheel delta
    var e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    if ($j(".portfolioContainer").length >= 1) {
      e.preventDefault();
      if (!scrolling)
        handleScroll(delta == 1 ? "up" : "down");

    }
    return false;
  }
});

/*------------- Set equal height function Starts -------------- */
function setEqualHeight_CommonClass(arr) {
  var x = new Array([]);
  $j(arr).each(function (i) {
    $j(this).height('auto');
    x[i] = $j(this).outerHeight();
  });
  Max_Value = Array.max(x);
  $j(arr).each(function (i) {
    //if($j(arr[i]).height() != Max_Value)
    //	{x[i] = $j(arr[i]).height(Max_Value);}
    $j(this).outerHeight(Max_Value);
  });
}
function setEqualHeight(arr) {
  var x = new Array([]);
  for (i = 0; i < arr.length; i++) {
    x[i] = $j(arr[i]).height('auto');
    x[i] = $j(arr[i]).outerHeight();
  }
  Max_Value = Array.max(x);
  for (i = 0; i < arr.length; i++) {
    //if($j(arr[i]).height() != Max_Value)
    // {x[i] = $j(arr[i]).height(Max_Value);}
    x[i] = $j(arr[i]).outerHeight(Max_Value);
  }
}
Array.min = function (array) {
  return Math.min.apply(Math, array);
};

Array.max = function (array) {
  return Math.max.apply(Math, array);
};
/*------------- Set equal height function Ends -------------- */