(function() {
  function headerScroll() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var element = document.getElementsByClassName("site-header")[0];
    if (scrollY > 0) {
      if (element.className.indexOf("scrolling") == -1) {
        element.className += " scrolling";
      }
    } else {
      element.className = element.className.replace(" scrolling", "");
    }
  }
  window.addEventListener("scroll", headerScroll);
  window.AppController = function() {
    this.sendRequest = function(path, callback, method) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          callback(JSON.parse(this.responseText));
        } else {
          callback(null);
        }
      };
      xhttp.open(method, path, true);
      xhttp.send();
    };
  };
  headerScroll();
})();
