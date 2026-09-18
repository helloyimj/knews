// 1. nLogger 설정 및 실행
window.addEventListener("DOMContentLoaded", function() {
  if (typeof nLogger !== "undefined") {
    nLogger.configure({
      nth_service_id: "dream",
      nth_logging_url_base_http: "https://collect.kotra.or.kr:9443/nlog",
      nth_logging_url_base_https: "https://collect.kotra.or.kr:9443/nlog"
    });
    nLogger.log();
  }
});

// 2. Google Analytics 동적 로드 및 설정
(function() {
  var gaScript = document.createElement("script");
  gaScript.async = true;
  gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-FLVY8EFGBN";
  document.head.appendChild(gaScript);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", "G-FLVY8EFGBN");
})();