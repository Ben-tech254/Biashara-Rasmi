(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile menu ---------- */
  var mb = document.querySelector('.menu-btn'), links = document.querySelector('.nav-links');
  if (mb && links) mb.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    mb.setAttribute('aria-expanded', open);
  });

  /* ---------- Hero slider ---------- */
  var hero = document.querySelector('.hero');
  if (hero && hero.querySelectorAll('.slide').length > 1) {
    var slides = hero.querySelectorAll('.slide');
    var bars = hero.querySelectorAll('.bars button');
    var DUR = 6500, i = 0, t = null;
    hero.style.setProperty('--dur', DUR + 'ms');

    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        s.classList.toggle('is-on', k === i);
        s.setAttribute('aria-hidden', k !== i);
      });
      bars.forEach(function (b, k) {
        b.classList.remove('run', 'done');
        b.setAttribute('aria-current', k === i);
        if (k < i) b.classList.add('done');
      });
      if (bars[i]) { void bars[i].offsetWidth; bars[i].classList.add('run'); }
      clearTimeout(t);
      if (!reduce) t = setTimeout(function () { show(i + 1); }, DUR);
    }
    hero.querySelector('.next').addEventListener('click', function () { show(i + 1); });
    hero.querySelector('.prev').addEventListener('click', function () { show(i - 1); });
    bars.forEach(function (b, k) { b.addEventListener('click', function () { show(k); }); });
    // pause on hover so people can read
    hero.addEventListener('mouseenter', function () { hero.classList.add('paused'); clearTimeout(t); });
    hero.addEventListener('mouseleave', function () { hero.classList.remove('paused'); if (!reduce) t = setTimeout(function () { show(i + 1); }, 2500); });
    // swipe on phones
    var x0 = null;
    hero.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1));
      x0 = null;
    });
    show(0);
  }

  /* ---------- Reveal on scroll + animated bars ---------- */
  var els = document.querySelectorAll('.reveal, .hbar .fill');
  function reveal(e) {
    e.classList.add('in');
    if (e.dataset.w) e.style.width = e.dataset.w;
  }
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { reveal(x.target); io.unobserve(x.target); } });
    }, { threshold: 0.15 });
    els.forEach(function (e) { io.observe(e); });
  } else els.forEach(reveal);

  /* ---------- Facts page: dot grid + Kenya map ---------- */
  var dt = document.getElementById('dots');
  if (dt) {
    var h = '';
    for (var d = 0; d < 100; d++) h += '<i' + (d < 21 ? ' class="on"' : '') + '></i>';
    dt.innerHTML = h;
  }
  var km = document.getElementById('kmap');
  if (km) {
    var P = [[34.0,4.2],[35.9,4.6],[36.9,4.45],[38.1,3.6],[39.05,3.5],[39.8,3.9],[41.0,3.95],[41.9,3.98],[41.0,3.0],[41.0,-0.9],[41.55,-1.65],[40.9,-2.3],[40.1,-3.2],[39.7,-4.05],[39.2,-4.68],[37.7,-3.4],[37.6,-3.0],[33.9,-1.0],[34.0,0.1],[34.1,0.5],[34.5,1.1],[35.0,1.9],[34.4,3.4]];
    var xy = function (p) { return [(p[0] - 33.8) * 40, (5 - p[1]) * 40]; };
    var path = 'M' + P.map(function (p) { return xy(p).join(','); }).join('L') + 'Z';
    var C = [['Eldoret',35.27,0.52,1],['Nairobi',36.82,-1.29,0],['Mombasa',39.67,-4.05,0,1]];
    var s = '<path d="' + path + '" fill="#00693C" stroke="#B5121B" stroke-width="4" stroke-linejoin="round"/>';
    C.forEach(function (c) {
      var q = xy([c[1], c[2]]);
      var tx = c[4] ? q[0] - 78 : q[0] + 12; // put Mombasa's label inside the map
      s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + (c[3] ? 9 : 6) + '" fill="' + (c[3] ? '#F4B52E' : '#fff') + '"/>' +
           '<text x="' + tx + '" y="' + (q[1] + 5) + '" fill="#fff" stroke="#00693C" stroke-width="5" paint-order="stroke" stroke-linejoin="round" font-size="15" font-family="Inter,sans-serif" font-weight="600">' + c[0] + '</text>';
    });
    km.innerHTML = s;
  }
})();
