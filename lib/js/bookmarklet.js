(function() {
  var head = document.getElementsByTagName('head')[0];
  var s = document.createElement('link');
  s.setAttribute('rel', 'stylesheet');
  s.setAttribute('type', 'text/css');
  s.setAttribute('media', 'screen');
  s.setAttribute('href', '{{BASE_URL}}/styles.css?r=' + Math.random());
  (head ? head : document.body).appendChild(s);

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
      clearInterval(interval);
      SelectorGadget.toggle({ analytics: false });
    }
  }, 50);
})();
