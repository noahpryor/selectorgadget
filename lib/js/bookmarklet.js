(function() {
  var head = document.getElementsByTagName('head')[0];
  var s = document.createElement('link');
  s.setAttribute('rel', 'stylesheet');
  s.setAttribute('type', 'text/css');
  s.setAttribute('media', 'screen');
  s.setAttribute('href', '{{BASE_URL}}/styles.css?r=' + Math.random());
  (head ? head : document.body).appendChild(s);
  simple = "https://cdn.firebase.com/js/simple-login/1.3.2/firebase-simple-login.js"
  s3 = document.createElement('script');
  s3.setAttribute('type', 'text/javascript');
  s3.setAttribute('src', simple)
  document.body.appendChild(s3);

  s2 = document.createElement('script');
  s2.setAttribute('type', 'text/javascript');
  s2.setAttribute('src', "https://cdn.firebase.com/js/client/1.0.11/firebase.js")
  head2 = document.getElementsByTagName('head')[0]
  document.body.appendChild(s2);
  s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', '{{BASE_URL}}/schlepless.js?r=' + Math.random());
  (head ? head : document.body).appendChild(s);

  var interval = setInterval(function() {
    if (typeof SelectorGadget != 'undefined') {
      var sg_div = jQuerySG('<div>').attr('id', 'selectorgadget_main').addClass('selectorgadget_top').addClass('selectorgadget_ignore')
      sg_div.append(TMPL.bookmarklet)
      jQuerySG('body').append(sg_div)
      clearInterval(interval);
      angular.element("#sl-widget").ready(function() {
            angular.bootstrap("#sl-widget", ['bookmarklet']);
          });
    }
  }, 50);
})();
