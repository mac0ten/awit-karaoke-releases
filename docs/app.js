// AWIT Karaoke's site: things coming in as they scroll into view, the newest APK (its version, size, downloads and
// what is new in it, from GitHub's releases), on a computer a QR code to open this page on the phone, Material ripples, and the top
// app bar turning into a surface once the page moves under it.
(function () {
  var REPO = 'mac0ten/awit-karaoke-releases';

  document.addEventListener('pointerdown', function (e) {
    var el = e.target.closest && e.target.closest('.btn, .text-btn, summary');
    if (!el) return;
    var r = el.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2.2, s = document.createElement('span');
    s.className = 'ripple';
    s.style.width = s.style.height = d + 'px';
    s.style.left = (e.clientX - r.left - d / 2) + 'px';
    s.style.top = (e.clientY - r.top - d / 2) + 'px';
    el.appendChild(s);
    setTimeout(function () { s.remove(); }, 650);
  });

  var bar = document.getElementById('bar');
  function scrolled() { bar.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', scrolled, { passive: true });
  scrolled();

  var shown = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    shown.forEach(function (el) { io.observe(el); });
  } else {
    shown.forEach(function (el) { el.classList.add('in'); });
  }

  // the newest release's APK: the button goes straight to it; the line under it says what it is
  fetch('https://api.github.com/repos/' + REPO + '/releases?per_page=100')
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function (releases) {
      var total = 0, newest = null;
      releases.forEach(function (rel) {
        if (rel.draft || rel.prerelease) return;
        (rel.assets || []).forEach(function (a) {
          if (!/\.apk$/i.test(a.name)) return;
          total += a.download_count || 0;
          if (!newest) newest = { rel: rel, apk: a };
        });
      });
      if (!newest) return;
      var mb = Math.round(newest.apk.size / 1048576);
      var version = newest.rel.tag_name.replace(/^v/, '');
      var dl = document.getElementById('download');
      dl.href = newest.apk.browser_download_url;
      document.getElementById('dl-label').textContent = 'Download APK · ' + mb + ' MB';
      document.getElementById('meta').textContent = 'Version ' + version + ' · Android 10 or newer · free, not for sale';
      if (total > 0) document.getElementById('count').textContent = total.toLocaleString() + ' downloads';
      // what is new in it: the release's notes (its first paragraph), unless they only name the version
      var notes = (newest.rel.body || '').trim().split(/\r?\n\s*\r?\n/)[0];
      if (notes && notes !== newest.rel.name) {
        var news = document.getElementById('news');
        news.querySelector('b').textContent = 'New in ' + version + ':';
        news.querySelector('span').textContent = notes;
        news.hidden = false;
      }
    })
    .catch(function () { /* the button keeps pointing at the releases page */ });

  // not on Android: a QR code to open this page on the phone
  if (!/Android/i.test(navigator.userAgent)) {
    var box = document.getElementById('desktop');
    var tries = 0;
    (function draw() {
      if (window.QRCode) {
        new QRCode(document.getElementById('qr'), { text: location.href.split('#')[0], width: 192, height: 192,
          colorDark: '#0e1530', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M });
        box.hidden = false;
      } else if (++tries < 40) {
        setTimeout(draw, 100);
      }
    })();
  }
})();
