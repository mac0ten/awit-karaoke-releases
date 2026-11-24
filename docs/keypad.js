// AWIT Karaoke's keypad maker: the app's keypad drawn as the app draws it - KeyStyle.java (Candy, Liquid, the shapes)
// and Ui.Arcade (Round), ported: change both together - and a style made here (shape, Liquid, colours, places) as the
// JSON the app pastes (Settings > App theme > Keypad > Paste a style; KeyStyle.paste reads it).
(function () {
  'use strict';

  var SHAPES = ['candy', 'round', 'pill', 'square', 'hexagon', 'custom'];
  var SHAPE_NAMES = ['Candy', 'Round', 'Pill', 'Square', 'Hexagon', 'Custom'];
  var IDS = ['num', 'can', 'rsv', 'melody', 'key', 'bgv', 'book', 'search', 'play', 'stop', 'first', 'next', 'volup',
    'voldown', 'queue', 'menu'];
  // the eleven keys a finger may move (KeyPlaces): places 0-7 the two rows over 1 2 3, 8-10 the side's
  var MOVABLE = ['melody', 'key', 'bgv', 'book', 'search', 'play', 'stop', 'first', 'volup', 'voldown', 'queue'];
  var DARK = '#1A1426';
  // the app's own colours for keys (AppTheme.BRIGHT)
  var BRIGHT = ['#F23B3B', '#FF8A1F', '#FFC61A', '#FDE047', '#A3E635', '#1FD67E', '#14B8A6', '#22D3EE', '#38BDF8',
    '#2F8BFF', '#6366F1', '#8B5CF6', '#A855F7', '#EC3FD8', '#F472B6', '#EEF0F6'];
  // the app's ready themes (AppTheme.THEMES): accent, background, numbers, play, next, replay, stop, rsv, 1st rsv,
  // can, songs, queue; then the accent's other end
  var THEMES = [
    ['Neon Night', ['#8B5CF6', '#070B1A', '#FFC61A', '#1FD67E', '#2F8BFF', '#FF8A1F', '#F23B3B', '#1FD67E', '#EC3FD8', '#EEF0F6', '#2F8BFF', '#FF8A1F'], '#D946EF'],
    ['Sunset', ['#FF6A4D', '#160A10', '#FFC145', '#2ED47A', '#FF6F91', '#FF9A3C', '#EF3B36', '#2ED47A', '#FF4FA3', '#FFE7D6', '#FF6F91', '#FF9A3C'], '#FFB23F'],
    ['Ocean', ['#22B8E6', '#04101B', '#67E8F9', '#34D399', '#3B82F6', '#FBBF24', '#F43F5E', '#34D399', '#A78BFA', '#E0F2FE', '#3B82F6', '#FBBF24'], '#2DD4BF'],
    ['Forest', ['#34C77B', '#05120B', '#FDE68A', '#22C55E', '#14B8A6', '#F59E0B', '#EF4444', '#22C55E', '#A3E635', '#ECFCCB', '#14B8A6', '#F59E0B'], '#A3E635'],
    ['Candy', ['#FF5FB4', '#160A1E', '#FFD1E6', '#6EE7B7', '#93C5FD', '#FDBA74', '#FCA5A5', '#6EE7B7', '#F0ABFC', '#FFFFFF', '#93C5FD', '#FDBA74'], '#A78BFA'],
    ['Mono', ['#B8BEC9', '#0A0A0C', '#E5E7EB', '#D1D5DB', '#D1D5DB', '#D1D5DB', '#B4B9C2', '#D1D5DB', '#D1D5DB', '#F9FAFB', '#D1D5DB', '#D1D5DB'], '#E5E7EB']];
  var ROLE = { num: 2, play: 3, next: 4, replay: 5, stop: 6, rsv: 7, first: 8, can: 9, songs: 10, queue: 11 };
  // each key's colour in a theme (SimpleMode's keys, the home's and a song's)
  var KEY_ROLE = { num: 'num', can: 'can', rsv: 'rsv', melody: 'first', key: 'replay', bgv: 'next', book: 'first',
    search: 'songs', play: 'play', stop: 'stop', first: 'first', next: 'next', volup: 'next', voldown: 'next',
    queue: 'queue', menu: 'can' };
  // a side key: its word, icon (Material Symbols) or its words on the cap
  var KEYS = { melody: ['Melody', null, '3/5'], key: ['Key', null, '±0'], bgv: ['', null, 'BGV'],
    book: ['Book', 'menu_book'], search: ['Search', 'search'], play: ['Play', 'play_arrow'], pause: ['Pause', 'pause'],
    stop: ['Stop', 'stop'], first: ['1st RSV', 'music_note'], next: ['Next', 'skip_next'], volup: ['Volume', 'add'],
    voldown: ['Volume', 'remove'], queue: ['Queue', 'queue_music'], menu: ['Menu', 'menu'] };
  var NAMES = { num: 'Number keys', can: 'CAN', rsv: 'RSV', melody: 'Melody', key: 'Key', bgv: 'BGV', book: 'Book',
    search: 'Search', play: 'Play', stop: 'Stop', first: '1st RSV', next: 'Next (while singing)', volup: 'Volume up',
    voldown: 'Volume down', queue: 'Queue', menu: 'Menu' };

  // ------------------------------------------------------------------ colours
  function rgb(h) { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function hex(c) { return '#' + c.map(function (v) { return ('0' + Math.round(v).toString(16)).slice(-2); }).join('').toUpperCase(); }
  function mix(a, b, t) { var x = rgb(a), y = rgb(b); return hex([0, 1, 2].map(function (i) { return Math.round(x[i] * (1 - t) + y[i] * t); })); }
  function rgba(h, a255) { var c = rgb(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (a255 / 255).toFixed(3) + ')'; }
  function lum(h) { var c = rgb(h); return (c[0] * 0.299 + c[1] * 0.587 + c[2] * 0.114) / 255; }
  var BLACK = '#000000', WHITE = '#FFFFFF';
  function validHex(s) { return typeof s === 'string' && /^#?[0-9a-fA-F]{6}$/.test(s.trim()); }
  function normHex(s) { s = s.trim(); return (s[0] === '#' ? s : '#' + s).toUpperCase(); }

  // ------------------------------------------------------------------ the style
  function plain() {
    return { name: '', shape: 'candy', corners: [32, 32, 32, 32], cut: false, liquid: false, colors: {}, text: {},
      places: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], placed: false };   // placed: Move or Put back used (places written)
  }
  var S = plain();

  function styled(st) { return st.shape !== 'round' || st.liquid; }
  function fills(st) { return st.shape !== 'round'; }
  function keyColor(st, id, th) { return st.colors[id] || THEMES[th][1][ROLE[KEY_ROLE[id]]]; }
  // a key's print colour (KeyStyle.ink): the style's, else white on deep, the dark plum on light; Round: Ui.inkOn
  function inkOf(st, id, cap) {
    if (st.text[id]) return st.text[id];
    if (!styled(st)) return lum(cap) < 0.45 ? WHITE : '#17120A';
    if (st.liquid) return lum(mix(cap, BLACK, 0.28)) > 0.6 ? DARK : WHITE;
    return lum(cap) > 0.68 ? DARK : WHITE;
  }

  function identity(p) { for (var i = 0; i < 11; i++) if (p[i] !== i) return false; return true; }
  function whole(p) {
    if (!Array.isArray(p) || p.length !== 11) return false;
    var seen = {};
    for (var i = 0; i < 11; i++) {
      var k = p[i];
      if (typeof k !== 'number' || k % 1 !== 0 || k < 0 || k > 10 || seen[k]) return false;
      seen[k] = true;
    }
    return true;
  }

  /** The style as the app reads it (KeyStyle.json, and the places when moved). */
  function toJSON(st) {
    var o = { awit: 'keypad', v: 1 };
    if (st.name.trim()) o.name = st.name.trim().slice(0, 40);
    o.shape = st.shape;
    if (st.shape === 'custom') { o.corners = st.corners.map(Math.round); o.cut = st.cut; }
    o.liquid = st.liquid;
    if (Object.keys(st.colors).length) o.colors = sorted(st.colors);
    if (Object.keys(st.text).length) o.text = sorted(st.text);
    // the places when moved here or put back here (as made: a phone's moved keys go back too); untouched, the
    // phone's own order stays (KeyStyle.paste: no "places", the places as they are)
    if (st.placed || !identity(st.places)) o.places = st.places.slice();
    return JSON.stringify(o);
  }
  function sorted(m) { var o = {}; IDS.forEach(function (id) { if (m[id]) o[id] = m[id]; }); return o; }

  /** A pasted style read as the app reads it (KeyStyle.paste): the style, or what is wrong with it in words. */
  function parse(text) {
    text = (text || '').trim();
    if (!text) return 'Nothing pasted yet.';
    var at = text.indexOf('{'), end = text.lastIndexOf('}');
    if (at < 0 || end < at) return "That isn't a keypad style.";
    var o;
    try { o = JSON.parse(text.slice(at, end + 1)); } catch (e) { return 'This style is broken. Copy it again.'; }
    if (!o || o.awit !== 'keypad') return "That isn't a keypad style.";
    var st = plain();
    var shape = o.shape === undefined ? 'candy' : o.shape;
    if (SHAPES.indexOf(shape) < 0) return 'Its shape is not one the app knows.';
    st.shape = shape;
    if (o.corners !== undefined) {
      if (!Array.isArray(o.corners) || o.corners.length !== 4 || o.corners.some(function (v) { return typeof v !== 'number'; }))
        return 'Its corners are broken.';
      st.corners = o.corners.map(function (v) { return Math.max(0, Math.min(50, v)); });
    }
    st.cut = o.cut === true;
    st.liquid = o.liquid === true;
    st.name = typeof o.name === 'string' ? o.name.trim().slice(0, 40) : '';
    var bad = false;
    [['colors', st.colors], ['text', st.text]].forEach(function (p) {
      var m = o[p[0]];
      if (m === undefined) return;
      if (typeof m !== 'object' || m === null) { bad = true; return; }
      IDS.forEach(function (id) {
        if (m[id] === undefined) return;
        if (!validHex(m[id])) bad = true;
        else p[1][id] = normHex(m[id]);
      });
    });
    if (bad) return 'One of its colours is broken.';
    if (o.places !== undefined) {
      if (!whole(o.places)) return "This style's key places are broken.";
      st.places = o.places.slice();
      st.placed = true;
    }
    return st;
  }

  // ------------------------------------------------------------------ drawing (KeyStyle.java)
  function body(sh, x, y, w, h, px) {
    if (sh === 'round') {
      var R = Math.min(w, h) / 2 - 5 * px, cx = x + w / 2, cy = y + h / 2;
      return { l: cx - R, t: cy - R, r: cx + R, b: cy + R };
    }
    var l = x + 4 * px, t = y + 3 * px, r = x + w - 4 * px, b = y + h - 5 * px;
    var bw = Math.max(px, r - l), bh = Math.max(px, b - t), c;
    if (bw > 2.2 * bh) { c = (bw - 2.2 * bh) / 2; l += c; r -= c; }
    else if (bh > 1.2 * bw) { c = (bh - 1.2 * bw) / 2; t += c; b -= c; }
    return { l: l, t: t, r: r, b: Math.max(t + px, b) };
  }
  function lip(b, px) { return Math.max(2 * px, Math.min(5 * px, (b.b - b.t) * 0.07)); }
  function rect(l, t, r, b) { return { l: l, t: t, r: r, b: b }; }
  function grow(b, d) { return rect(b.l - d, b.t - d, b.r + d, b.b + d); }
  function shift(b, dy) { return rect(b.l, b.t + dy, b.r, b.b + dy); }

  function rrect(ctx, l, t, r, b, tl, tr, br, bl) {
    ctx.moveTo(l + tl, t);
    ctx.lineTo(r - tr, t);
    if (tr) ctx.arc(r - tr, t + tr, tr, -Math.PI / 2, 0);
    ctx.lineTo(r, b - br);
    if (br) ctx.arc(r - br, b - br, br, 0, Math.PI / 2);
    ctx.lineTo(l + bl, b);
    if (bl) ctx.arc(l + bl, b - bl, bl, Math.PI / 2, Math.PI);
    ctx.lineTo(l, t + tl);
    if (tl) ctx.arc(l + tl, t + tl, tl, Math.PI, Math.PI * 1.5);
    ctx.closePath();
  }

  /** The shape filling r (KeyStyle.outline). */
  function outline(ctx, st, sh, r) {
    var w = r.r - r.l, h = r.b - r.t, m = Math.min(w, h), k;
    ctx.beginPath();
    switch (sh) {
      case 'round': ctx.arc((r.l + r.r) / 2, (r.t + r.b) / 2, m / 2, 0, Math.PI * 2); ctx.closePath(); break;
      case 'pill': rrect(ctx, r.l, r.t, r.r, r.b, m / 2, m / 2, m / 2, m / 2); break;
      case 'square': k = 0.14 * m; rrect(ctx, r.l, r.t, r.r, r.b, k, k, k, k); break;
      case 'hexagon': hexagon(ctx, r, 0.1 * m); break;
      case 'custom': custom(ctx, st, r, m); break;
      default: k = Math.min(0.32 * w, m / 2); rrect(ctx, r.l, r.t, r.r, r.b, k, k, k, k);
    }
  }
  function hexagon(ctx, r, round) {
    var l = r.l, t = r.t, R = r.r, b = r.b, cx = (l + R) / 2, cy = (t + b) / 2, w = R - l, h = b - t, xy, k;
    // pointed left and right unless much taller than wide: every layer of a key (foot, face, shadow) alike
    if (w >= 0.7 * h) { k = Math.min(0.3 * h, 0.3 * w); xy = [l, cy, l + k, t, R - k, t, R, cy, R - k, b, l + k, b]; }
    else { k = Math.min(0.3 * w, 0.3 * h); xy = [cx, t, R, t + k, R, b - k, cx, b, l, b - k, l, t + k]; }
    var n = xy.length / 2;
    for (var i = 0; i < n; i++) {
      var x = xy[2 * i], y = xy[2 * i + 1], pi = (i + n - 1) % n, ni = (i + 1) % n;
      var ax = xy[2 * pi] - x, ay = xy[2 * pi + 1] - y, bx = xy[2 * ni] - x, by = xy[2 * ni + 1] - y;
      var da = Math.hypot(ax, ay), db = Math.hypot(bx, by);
      var ka = da === 0 ? 0 : Math.min(round, da / 2) / da, kb = db === 0 ? 0 : Math.min(round, db / 2) / db;
      if (i === 0) ctx.moveTo(x + ax * ka, y + ay * ka); else ctx.lineTo(x + ax * ka, y + ay * ka);
      ctx.quadraticCurveTo(x, y, x + bx * kb, y + by * kb);
    }
    ctx.closePath();
  }
  function custom(ctx, st, r, m) {
    var c = st.corners.map(function (v) { return v / 100 * m; });
    if (!st.cut) { rrect(ctx, r.l, r.t, r.r, r.b, c[0], c[1], c[2], c[3]); return; }
    ctx.moveTo(r.l + c[0], r.t); ctx.lineTo(r.r - c[1], r.t); ctx.lineTo(r.r, r.t + c[1]); ctx.lineTo(r.r, r.b - c[2]);
    ctx.lineTo(r.r - c[2], r.b); ctx.lineTo(r.l + c[3], r.b); ctx.lineTo(r.l, r.b - c[3]); ctx.lineTo(r.l, r.t + c[0]);
    ctx.closePath();
  }
  function grad(ctx, y0, y1, stops) {
    var g = ctx.createLinearGradient(0, y0, 0, Math.max(y1, y0 + 0.01));
    stops.forEach(function (s) { g.addColorStop(s[0], s[1]); });
    return g;
  }
  function fillShape(ctx, st, sh, r, style) { outline(ctx, st, sh, r); ctx.fillStyle = style; ctx.fill(); }
  function strokeShape(ctx, st, sh, r, style, width) {
    outline(ctx, st, sh, r); ctx.strokeStyle = style; ctx.lineWidth = width; ctx.stroke();
  }

  /** Candy (KeyStyle.candy): its shadow, a dark edge, its foot, its face, the light along its top edge. */
  function candy(ctx, st, sh, b, color, pressed, px) {
    var lp = lip(b, px);
    fillShape(ctx, st, sh, shift(b, 2.6 * px), 'rgba(0,0,0,.2)');
    fillShape(ctx, st, sh, shift(b, 1.3 * px), 'rgba(0,0,0,.3)');
    fillShape(ctx, st, sh, grow(b, 0.8 * px), rgba(mix(color, BLACK, 0.72), 0xE6));
    fillShape(ctx, st, sh, b, grad(ctx, b.t, b.b, [[0, mix(color, BLACK, 0.28)], [1, mix(color, BLACK, 0.46)]]));
    var sink = pressed ? 0.7 * lp : 0, f = rect(b.l, b.t + sink, b.r, b.b - lp + sink), fh = f.b - f.t;
    var base = pressed ? mix(color, BLACK, 0.12) : color;
    fillShape(ctx, st, sh, f, grad(ctx, f.t, f.b, [[0, mix(base, WHITE, 0.24)], [0.5, base], [1, mix(base, BLACK, 0.1)]]));
    strokeShape(ctx, st, sh, grow(f, -0.9 * px), grad(ctx, f.t, f.t + fh * 0.4,
      [[0, pressed ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.55)'], [1, 'rgba(255,255,255,0)']]), 1.2 * px);
  }

  /** Liquid (KeyStyle.liquid): a glow of its colour, see-through glass, a shine, a bright rim, a glint. */
  function liquid(ctx, st, sh, b, color, pressed, px) {
    var f = pressed ? shift(b, px) : b, fw = f.r - f.l, fh = f.b - f.t;
    var glow = mix(color, WHITE, 0.25), a = [0x10, 0x20, 0x3A];
    for (var i = 0; i < 3; i++) strokeShape(ctx, st, sh, f, rgba(glow, a[i]), (7.5 - 2.4 * i) * px);
    var base = pressed ? mix(color, BLACK, 0.15) : color;
    fillShape(ctx, st, sh, f, grad(ctx, f.t, f.b, [[0, rgba(mix(base, WHITE, 0.3), 0xE6)], [0.45, rgba(mix(base, BLACK, 0.28), 0xD6)],
      [0.78, rgba(mix(base, BLACK, 0.16), 0xD6)], [1, rgba(mix(base, WHITE, 0.32), 0xEB)]]));
    var s = rect(f.l + fw * 0.05, f.t + fh * 0.05, f.r - fw * 0.05, f.t + fh * 0.5);
    fillShape(ctx, st, sh, s, grad(ctx, s.t, s.b, [[0, pressed ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.35)'], [1, 'rgba(255,255,255,.02)']]));
    strokeShape(ctx, st, sh, grow(f, -0.8 * px), grad(ctx, f.t, f.b, [[0, rgba(mix(base, WHITE, 0.85), 0xF2)],
      [0.5, rgba(mix(base, WHITE, 0.35), 0x8C)], [1, rgba(mix(base, WHITE, 0.75), 0xE6)]]), 1.6 * px);
    var g = Math.min(fw, fh), o = sh === 'round' || sh === 'hexagon'
      ? rect(f.l + g * 0.26, f.t + g * 0.12, f.l + g * 0.42, f.t + g * 0.19) : rect(f.l + g * 0.14, f.t + g * 0.09, f.l + g * 0.3, f.t + g * 0.16);
    ctx.beginPath();
    ctx.ellipse((o.l + o.r) / 2, (o.t + o.b) / 2, (o.r - o.l) / 2, (o.b - o.t) / 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = pressed ? 'rgba(255,255,255,.5)' : 'rgba(255,255,255,.8)';
    ctx.fill();
  }

  /** Round as it always was (Ui.Arcade): a glow, a thin dark rim, a white ring, the cap - its rim band and top. */
  function arcade(ctx, x, y, w, h, color, pressed, px) {
    var cx = x + w / 2, cy = y + h / 2, R = Math.min(w, h) / 2 - 5 * px, lap = 0.5 * px, SEE = 237 / 255;
    function band(yy, inner, outer, style) {
      ctx.beginPath(); ctx.arc(cx, yy, (inner + outer) / 2, 0, Math.PI * 2);
      ctx.strokeStyle = style; ctx.lineWidth = outer - inner; ctx.stroke();
    }
    ctx.save();
    ctx.globalAlpha = SEE;
    ctx.shadowColor = rgba(color, 0xA6); ctx.shadowBlur = 10 * px;
    band(cy, R - px, R, '#121219');
    ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 6 * px; ctx.shadowOffsetY = 2 * px;
    band(cy, R - px, R, '#121219');
    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    var B = R * 0.93;
    band(cy, B, R - px + lap, grad(ctx, cy - R, cy + R, [[0, '#34343E'], [1, '#0C0C12']]));
    var C = R * 0.85, T = R * 0.75, yy = cy + (pressed ? 0.8 * px : 0);
    var g = ctx.createLinearGradient(cx - B, cy - B, cx + B, cy + B);
    g.addColorStop(0, '#FFFFFF'); g.addColorStop(0.5, '#F4F5F9'); g.addColorStop(1, '#C9C6E6');
    band(cy, C, B + lap, g);
    ctx.globalAlpha = 1;
    band(cy + 1.4 * px, C - px, C + 0.6 * px, 'rgba(0,0,0,.25)');
    ctx.globalAlpha = SEE;
    var base = pressed ? mix(color, BLACK, 0.2) : color;
    band(yy, T, C + lap, grad(ctx, yy - C, yy + C, [[0, mix(base, WHITE, 0.3)], [1, mix(base, BLACK, 0.22)]]));
    var rg = ctx.createRadialGradient(cx, yy - T * 0.25, 0, cx, yy - T * 0.25, T * 1.25);
    rg.addColorStop(0, mix(base, WHITE, 0.24)); rg.addColorStop(0.6, base); rg.addColorStop(1, mix(base, BLACK, 0.08));
    ctx.beginPath(); ctx.arc(cx, yy, T + lap, 0, Math.PI * 2); ctx.fillStyle = rg; ctx.fill();
    ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.arc(cx, yy, T, 0, Math.PI * 2);
    ctx.strokeStyle = rgba(mix(base, BLACK, 0.35), 0x99); ctx.lineWidth = px; ctx.stroke();
    var gg = (C - T) / 2;
    ctx.beginPath(); ctx.arc(cx, yy, C - gg, 205 * Math.PI / 180, 265 * Math.PI / 180);
    ctx.strokeStyle = pressed ? 'rgba(255,255,255,.33)' : 'rgba(255,255,255,.8)';
    ctx.lineWidth = 1.5 * px; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineCap = 'butt';
    ctx.restore();
  }

  var HEAVY = '900 ', CONDENSED = '"Roboto Condensed", "Roboto", sans-serif', ROBOTO = 'Roboto, sans-serif';
  var ICONS = '"Material Symbols Rounded"';

  function shade(ctx, ink, px, on) {
    if (on && ink.toUpperCase() === WHITE) { ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 2.4 * px; ctx.shadowOffsetY = px; }
    else { ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; }
  }
  function fit(ctx, font, size, s, room, min) {
    while (size > min) { ctx.font = font(size); if (ctx.measureText(s).width <= room) break; size *= 0.92; }
    ctx.font = font(size);
    return size;
  }

  /**
   * A key in its place (x, y, w, h): `k` its id and what it shows; st the style, th the preview's theme. Round's
   * keys are square, as big as the place lets them (Keypad.fill), the others fill it (Keypad.place).
   */
  function drawKey(ctx, st, th, k, x, y, w, h, px, pressed) {
    var color = keyColor(st, k.id, th), ink = inkOf(st, k.id, color), sh = st.shape, flat = fills(st);
    var bx = x, by = y, bw = w, bh = h;
    if (!flat) {                                            // the arcade key's square: its ring 4 dp short of its place
      var S = Math.min(w, h) - 4 * px + 10 * px;
      bx = x + (w - S) / 2; by = y + (h - S) / 2; bw = bh = S;
    }
    var b = body(sh, bx, by, bw, bh, px);
    if (!styled(st)) arcade(ctx, bx, by, bw, bh, color, pressed, px);
    else if (st.liquid) liquid(ctx, st, sh, b, color, pressed, px);
    else candy(ctx, st, sh, b, color, pressed, px);
    ctx.save();
    ctx.fillStyle = ink;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    var f, fh, room, size, cx, cy;
    if (flat) {
      f = st.liquid ? (pressed ? shift(b, px) : b) : (function () { var lp = lip(b, px), s = pressed ? 0.7 * lp : 0; return rect(b.l, b.t + s, b.r, b.b - lp + s); })();
      fh = f.b - f.t; cx = (f.l + f.r) / 2; cy = (f.t + f.b) / 2;
      room = (f.r - f.l) * (sh === 'hexagon' ? 0.66 : k.digit || k.id === 'can' || k.id === 'rsv' ? 0.8 : 0.82);
    } else {
      var Sz = bw; cx = bx + bw / 2; cy = by + bh / 2;
      var R = Math.min(bw, bh) / 2 - 5 * px, top = R * 0.75;
    }
    shade(ctx, ink, px, styled(st));
    if (k.digit || k.id === 'can' || k.id === 'rsv') {      // the numbers, CAN, RSV (Ui.arcade, Ui.KeyText)
      var label = k.digit || k.id.toUpperCase(), digit = !!k.digit;
      var fam = styled(st) ? (digit && st.liquid ? 'italic ' + HEAVY : HEAVY) + '{s}px ' + ROBOTO
        : (digit ? 'italic 700 ' : '700 ') + '{s}px ' + CONDENSED;
      var font = function (s) { return fam.replace('{s}', s.toFixed(1)); };
      if (flat) {
        fit(ctx, font, fh * (digit ? 0.48 : 0.27), label, room, 7 * px);
        ctx.textBaseline = 'middle';
        ctx.fillText(label, cx, cy);
      } else {
        ctx.font = font(Sz * (digit ? 0.36 : 0.2));
        ctx.textBaseline = 'middle';
        ctx.fillText(label, cx, cy - px + (pressed ? 0.8 * px : 0));
      }
      ctx.restore();
      return;
    }
    var key = KEYS[k.show || k.id], word = key[0].toUpperCase(), icon = key[1], face = key[2], alone = !word;
    var is, iy, faceSize, facePx;
    var wordFont = styled(st) ? function (s) { return HEAVY + s.toFixed(1) + 'px ' + ROBOTO; } : function (s) { return '700 ' + s.toFixed(1) + 'px ' + CONDENSED; };
    if (flat) {
      is = Math.min(fh * (alone ? 0.46 : 0.38), room * 0.6);
      iy = alone ? cy : f.t + fh * 0.4;
      faceSize = fh * (alone ? 0.38 : 0.3);
      facePx = room;
    } else {
      is = Math.max(16 * px, Math.min(36 * px, Sz * 0.3));
      cy += pressed ? 0.8 * px : 0;
      iy = alone ? cy : cy - top * 0.2;
      faceSize = is * (alone ? 1.3 : 0.72);
      facePx = top * 1.5;
    }
    ctx.textBaseline = 'middle';
    if (face) {
      fit(ctx, wordFont, faceSize, face, facePx, 8 * px);
      ctx.fillText(face, cx, alone ? cy : iy);
    } else if (icon) {
      ctx.font = Math.round(is) + 'px ' + ICONS;
      ctx.fillText(icon, cx, iy);
    }
    if (!word) { ctx.restore(); return; }
    ctx.textBaseline = 'alphabetic';
    if (flat) {
      fit(ctx, wordFont, Math.max(8.5 * px, fh * 0.16), word, room, 6 * px);
      ctx.fillText(word, cx, f.t + fh * 0.84);
      ctx.restore();
      return;
    }
    // Round: letter by letter on a circle inside the cap's edge, centred at its foot (Ui.RoundKey)
    var base = top * 0.8, size = Math.max(8.5 * px, Math.min(top * 0.42, 17 * px)), widths, wide, gap;
    for (;;) {
      ctx.font = wordFont(size);
      widths = word.split('').map(function (ch) { return ctx.measureText(ch).width; });
      gap = size * 0.08;
      wide = gap * (widths.length - 1) + widths.reduce(function (a, v) { return a + v; }, 0);
      if (wide <= Math.PI * 140 / 180 * base || size <= 6 * px) break;
      size *= 0.92;
    }
    var at = 90 + (wide / 2 / base) * 180 / Math.PI;
    for (var i = 0; i < word.length; i++) {
      var mid = at - (widths[i] / 2 / base) * 180 / Math.PI;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((mid - 90) * Math.PI / 180);
      ctx.fillText(word[i], 0, base);
      ctx.restore();
      at -= ((widths[i] + gap) / base) * 180 / Math.PI;
    }
    ctx.restore();
  }

  // ------------------------------------------------------------------ the pad
  /** What each place shows: 24 keys, rows of four (SimpleMode's, the home's or a song's). */
  function layout(st, singing) {
    var p = st.places, k = [];
    function mv(i) {
      var id = MOVABLE[p[i]];
      if (id === 'first' && singing) return { id: 'next', place: i };          // (a song: Next in 1st RSV's place)
      if (id === 'play' && singing) return { id: 'play', show: 'pause', place: i };
      return { id: id, place: i };
    }
    for (var i = 0; i < 8; i++) k.push(mv(i));
    [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']].forEach(function (row, r) {
      row.forEach(function (d) { k.push({ id: 'num', digit: d }); });
      k.push(mv(8 + r));
    });
    k.push({ id: 'can' }, { id: 'num', digit: '0' }, { id: 'rsv' }, { id: 'menu' });
    return k;
  }

  /** The whole pad on `canvas` (its CSS width; its rows 0.82 of a key's width, as a phone's). */
  function drawPad(canvas, st, th, singing, pressedAt) {
    var dpr = Math.min(3, window.devicePixelRatio || 1), W = canvas.clientWidth || canvas.parentNode.clientWidth;
    var cw = W / 4, ch = cw * 0.82, H = ch * 6;
    canvas.style.height = H + 'px';
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    }
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    var px = cw / 85, keys = layout(st, singing);
    keys.forEach(function (k, i) {
      drawKey(ctx, st, th, k, (i % 4) * cw, Math.floor(i / 4) * ch, cw, ch, px, i === pressedAt);
    });
    return keys;
  }

  /** A theme's backdrop behind the pad: its own dark, its accent's glow. */
  function backdrop(el, th) {
    var t = THEMES[th][1];
    el.style.background = 'radial-gradient(circle at 20% 15%, ' + rgba(t[0], 0x8C) + ', transparent 55%),' +
      'radial-gradient(circle at 85% 80%, ' + rgba(THEMES[th][2], 0x59) + ', transparent 50%),' +
      'linear-gradient(160deg, ' + mix(t[1], t[0], 0.35) + ', ' + t[1] + ')';
  }

  // ------------------------------------------------------------------ the page
  var $ = function (id) { return document.getElementById(id); };
  var pad = $('pad'), padKeys = $('padKeys'), padWrap = $('padWrap');
  var theme = 0, singing = false, moving = false, picked = -1, pressedAt = -1, shownKeys = [];

  function save() { try { localStorage.setItem('awit-keypad', toJSON(S)); } catch (e) { /* private window */ } }
  function load() {
    try {
      var s = localStorage.getItem('awit-keypad');
      if (s) { var st = parse(s); if (typeof st === 'object') S = st; }
    } catch (e) { /* none kept */ }
  }

  function render() {
    backdrop(padWrap, theme);
    shownKeys = drawPad(pad, S, theme, singing, pressedAt);
    buildButtons();
    $('json').textContent = JSON.stringify(JSON.parse(toJSON(S)), null, 2);
    shapeChips();
    $('customBox').hidden = S.shape !== 'custom';
    $('liquid').checked = S.liquid;
    $('cut').checked = S.cut;
    ['c0', 'c1', 'c2', 'c3'].forEach(function (id, i) { $(id).value = S.corners[i]; $(id + 'v').textContent = Math.round(S.corners[i]) + '%'; });
    ownList();
    $('moveBtn').setAttribute('aria-pressed', moving ? 'true' : 'false');
    $('padHint').textContent = moving ? (picked < 0 ? 'Tap a key to move.' : 'Now tap the key to swap it with.')
      : 'Tap a key to colour it.';
    save();
  }

  function keyName(k) {
    if (k.digit) return 'Number ' + k.digit;
    if (k.show === 'pause') return 'Pause';
    return NAMES[k.id];
  }

  function buildButtons() {
    if (padKeys.children.length !== 24) {
      padKeys.innerHTML = '';
      for (var i = 0; i < 24; i++) {
        var b = document.createElement('button');
        b.type = 'button';
        (function (at) {
          b.addEventListener('click', function () { tapKey(at); });
          b.addEventListener('pointerdown', function () { pressedAt = at; shownKeys = drawPad(pad, S, theme, singing, pressedAt); });
          ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) {
            b.addEventListener(ev, function () { if (pressedAt === at) { pressedAt = -1; shownKeys = drawPad(pad, S, theme, singing, -1); } });
          });
        })(i);
        padKeys.appendChild(b);
      }
    }
    shownKeys.forEach(function (k, i) {
      var b = padKeys.children[i], movable = k.place !== undefined;
      b.setAttribute('aria-label', moving ? keyName(k) + (movable ? ': move' : ': stays in its place') : keyName(k) + ': colour');
      b.classList.toggle('fixed', moving && !movable);
      b.classList.toggle('picked', moving && k.place === picked && picked >= 0);
    });
  }

  function tapKey(at) {
    var k = shownKeys[at];
    if (!moving) { openColours(k.id); return; }
    if (k.place === undefined) { snack('The numbers, CAN, RSV and MENU stay in their places.'); return; }
    if (picked < 0) { picked = k.place; render(); return; }
    if (picked !== k.place) {
      var p = S.places, t = p[picked];
      p[picked] = p[k.place];
      p[k.place] = t;
      S.placed = true;
    }
    picked = -1;
    render();
  }

  // shapes
  function shapeChips() {
    var box = $('shapes');
    if (!box.children.length) {
      SHAPES.forEach(function (sh, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'shape';
        b.setAttribute('role', 'radio');
        b.innerHTML = '<canvas width="120" height="96" aria-hidden="true"></canvas><span>' + SHAPE_NAMES[i] + '</span>';
        b.addEventListener('click', function () { S.shape = sh; render(); });
        box.appendChild(b);
      });
    }
    Array.prototype.forEach.call(box.children, function (b, i) {
      b.setAttribute('aria-checked', S.shape === SHAPES[i] ? 'true' : 'false');
      var c = b.querySelector('canvas'), ctx = c.getContext('2d'), dpr = Math.min(3, window.devicePixelRatio || 1);
      c.width = 60 * dpr; c.height = 48 * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, 60, 48);
      var st = { shape: SHAPES[i], corners: S.corners, cut: S.cut, liquid: S.liquid, colors: S.colors, text: {} };
      var color = keyColor(S, 'num', theme), px = 0.75;
      if (!styled(st)) arcade(ctx, 6, 0, 48, 48, color, false, px);
      else {
        var bd = body(st.shape, 0, 0, 60, 48, px);
        if (st.liquid) liquid(ctx, st, st.shape, bd, color, false, px); else candy(ctx, st, st.shape, bd, color, false, px);
      }
    });
  }

  // colours: the key's sheet
  var editing = null;
  function openColours(id) {
    editing = id;
    $('csTitle').textContent = NAMES[id];
    swatches();
    inks();
    openSheet('colourSheet');
  }
  function swatches() {
    var box = $('csKey'), id = editing, own = S.colors[id], themeC = THEMES[theme][1][ROLE[KEY_ROLE[id]]];
    box.innerHTML = '';
    function sw(c, label, on, act, cls) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'sw' + (cls ? ' ' + cls : '');
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.setAttribute('aria-label', label);
      b.title = label;
      if (c) b.style.background = c;
      b.addEventListener('click', act);
      box.appendChild(b);
      return b;
    }
    var t = sw(themeC, "The theme's colour", !own, function () { delete S.colors[id]; render(); swatches(); }, 'theme');
    t.innerHTML = '<span>Theme</span>';
    BRIGHT.forEach(function (c) {
      sw(c, c, own === c, function () { S.colors[id] = c; render(); swatches(); });
    });
    var pick = sw(own && BRIGHT.indexOf(own) < 0 ? own : null, 'A colour of your own', !!own && BRIGHT.indexOf(own) < 0,
      function () { input.click(); }, 'pick');
    pick.innerHTML = '<span class="ms" aria-hidden="true">palette</span>';
    var input = document.createElement('input');
    input.type = 'color';
    input.value = own || themeC;
    input.className = 'pick-input';
    input.tabIndex = -1;
    input.setAttribute('aria-hidden', 'true');
    input.addEventListener('input', function () { S.colors[id] = input.value.toUpperCase(); render(); });
    input.addEventListener('change', function () { swatches(); });
    pick.appendChild(input);
  }
  function inks() {
    var box = $('csInk'), id = editing, own = S.text[id];
    var choices = [['Auto', null], ['White', WHITE], ['Dark', DARK]];
    box.innerHTML = '';
    choices.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'seg-btn';
      b.setAttribute('role', 'radio');
      var on = c[1] === null ? !own : own === c[1];
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.textContent = c[0];
      b.addEventListener('click', function () {
        if (c[1] === null) delete S.text[id]; else S.text[id] = c[1];
        render(); inks();
      });
      box.appendChild(b);
    });
  }
  function ownList() {
    var box = $('ownList'), ids = IDS.filter(function (id) { return S.colors[id] || S.text[id]; });
    box.innerHTML = '';
    $('clearColours').hidden = !ids.length;
    if (!ids.length) { box.innerHTML = '<p class="small">No colours of your own yet: every key takes the theme\'s.</p>'; return; }
    ids.forEach(function (id) {
      var c = document.createElement('span');
      c.className = 'own-chip';
      var dot = S.colors[id] || keyColor(S, id, theme);
      c.innerHTML = '<i style="background:' + dot + '"></i>' + NAMES[id];
      var x = document.createElement('button');
      x.type = 'button';
      x.className = 'x';
      x.setAttribute('aria-label', NAMES[id] + ": the theme's colours again");
      x.innerHTML = '<span class="ms" aria-hidden="true">close</span>';
      x.addEventListener('click', function () { delete S.colors[id]; delete S.text[id]; render(); });
      c.appendChild(x);
      box.appendChild(c);
    });
  }

  // sheets (a dialog over the page; Escape or the backdrop closes it)
  var lastFocus = null;
  function openSheet(id) {
    lastFocus = document.activeElement;
    var s = $(id);
    s.hidden = false;
    requestAnimationFrame(function () { s.classList.add('on'); });
    var first = s.querySelector('button, textarea, input');
    if (first) first.focus();
  }
  function closeSheet(id) {
    var s = $(id);
    s.classList.remove('on');
    s.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  ['colourSheet', 'pasteSheet'].forEach(function (id) {
    var s = $(id);
    s.addEventListener('click', function (e) { if (e.target === s) closeSheet(id); });
    s.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(id); });
  });
  $('csClose').addEventListener('click', function () { closeSheet('colourSheet'); });
  $('csDone').addEventListener('click', function () { closeSheet('colourSheet'); });

  // copy, paste
  var snackTimer;
  function snack(s) {
    var el = $('snack');
    el.textContent = s;
    el.classList.add('on');
    clearTimeout(snackTimer);
    snackTimer = setTimeout(function () { el.classList.remove('on'); }, 3200);
  }
  function copyText(s, done) {
    function fallback() {
      var t = document.createElement('textarea');
      t.value = s;
      t.setAttribute('readonly', '');
      t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t);
      t.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(t);
      done(ok);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(s).then(function () { done(true); }, fallback);
    else fallback();
  }
  $('copy').addEventListener('click', function () {
    copyText(toJSON(S), function (ok) {
      snack(ok ? 'Copied. In the app: Settings, App theme, Keypad, Paste a style.' : 'Copy the text under "The style\'s text" by hand.');
      if (!ok) $('jsonBox').open = true;
    });
  });
  $('pasteBtn').addEventListener('click', function () {
    $('pasteText').value = '';
    $('pasteErr').hidden = true;
    openSheet('pasteSheet');
  });
  $('pasteCancel').addEventListener('click', function () { closeSheet('pasteSheet'); });
  $('pasteClose').addEventListener('click', function () { closeSheet('pasteSheet'); });
  $('pasteLoad').addEventListener('click', function () {
    var st = parse($('pasteText').value);
    if (typeof st === 'string') { $('pasteErr').textContent = st; $('pasteErr').hidden = false; return; }
    S = st;
    $('name').value = S.name;
    moving = false; picked = -1;
    closeSheet('pasteSheet');
    render();
    snack(S.name ? 'Loaded: ' + S.name : 'Style loaded.');
  });

  // the controls
  $('liquid').addEventListener('change', function () { S.liquid = this.checked; render(); });
  $('cut').addEventListener('change', function () { S.cut = this.checked; render(); });
  ['c0', 'c1', 'c2', 'c3'].forEach(function (id, i) {
    $(id).addEventListener('input', function () { S.corners[i] = +this.value; render(); });
  });
  $('name').addEventListener('input', function () { S.name = this.value.slice(0, 40); render(); });
  $('clearColours').addEventListener('click', function () { S.colors = {}; S.text = {}; render(); });
  $('moveBtn').addEventListener('click', function () { moving = !moving; picked = -1; render(); });
  $('placesBack').addEventListener('click', function () {     // (and the style puts a phone's moved keys back too)
    S.places = plain().places; S.placed = true; picked = -1; render();
    snack('The keys in their own places. Pasted, this style puts them back on the phone too.');
  });
  $('startOver').addEventListener('click', function () { S = plain(); $('name').value = ''; moving = false; picked = -1; render(); snack('Back to Candy, as the app comes.'); });
  document.querySelectorAll('[data-scene]').forEach(function (b) {
    b.addEventListener('click', function () {
      singing = b.getAttribute('data-scene') === 'singing';
      document.querySelectorAll('[data-scene]').forEach(function (o) { o.setAttribute('aria-checked', o === b ? 'true' : 'false'); });
      render();
    });
  });

  // the themes to look at it in
  (function () {
    var box = $('themes');
    THEMES.forEach(function (t, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'theme-chip';
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', i === 0 ? 'true' : 'false');
      b.innerHTML = '<i style="background:' + t[1][2] + '"></i><i style="background:' + t[1][3] + '"></i><i style="background:' + t[1][0] + '"></i>' + t[0];
      b.addEventListener('click', function () {
        theme = i;
        Array.prototype.forEach.call(box.children, function (o, j) { o.setAttribute('aria-checked', j === i ? 'true' : 'false'); });
        render();
        drawReady();
      });
      box.appendChild(b);
    });
  })();

  // ------------------------------------------------------------------ ready styles
  var READY = [
    { name: 'Candy', shape: 'candy', about: 'The app as it comes' },
    { name: 'Arcade', shape: 'round', about: 'Round arcade buttons' },
    { name: 'Glass candy', shape: 'candy', liquid: true, about: 'Candy in liquid glass' },
    { name: 'Bubbles', shape: 'pill', liquid: true, about: 'Glass pills' },
    { name: 'Neon hex', shape: 'hexagon', liquid: true, about: 'Glass hexagons in neon',
      colors: { num: '#22D3EE', can: '#F472B6', rsv: '#A3E635', melody: '#A855F7', key: '#A855F7', bgv: '#6366F1', book: '#A855F7',
        search: '#6366F1', play: '#A3E635', stop: '#F23B3B', first: '#F472B6', next: '#6366F1', volup: '#38BDF8',
        voldown: '#38BDF8', queue: '#FDE047', menu: '#EEF0F6' } },
    { name: 'Pastel pills', shape: 'pill', about: 'Soft colours, dark words',
      colors: { num: '#FFD6E8', can: '#E9E3FF', rsv: '#B9F3D4', melody: '#F5C6FF', key: '#FFE3B3', bgv: '#BFE3FF',
        book: '#F5C6FF', search: '#BFE3FF', play: '#B9F3D4', stop: '#FFC4C4', first: '#F5C6FF', next: '#BFE3FF',
        volup: '#BFE3FF', voldown: '#BFE3FF', queue: '#FFE3B3', menu: '#E9E3FF' } },
    { name: 'Mono tiles', shape: 'square', about: 'Quiet grey squares',
      colors: { num: '#E5E7EB', can: '#9CA3AF', rsv: '#D1D5DB', melody: '#6B7280', key: '#6B7280', bgv: '#6B7280',
        book: '#6B7280', search: '#4B5563', play: '#4B5563', stop: '#4B5563', first: '#4B5563', next: '#4B5563',
        volup: '#374151', voldown: '#374151', queue: '#374151', menu: '#9CA3AF' } },
    { name: 'Leaf', shape: 'custom', corners: [50, 8, 50, 8], about: 'Two round corners, two sharp' },
    { name: 'Ticket', shape: 'custom', corners: [22, 22, 22, 22], cut: true, about: 'Corners cut straight' }];

  function readyStyle(r) {
    var st = plain();
    st.name = r.name; st.shape = r.shape; st.liquid = !!r.liquid; st.cut = !!r.cut;
    if (r.corners) st.corners = r.corners.slice();
    if (r.colors) st.colors = JSON.parse(JSON.stringify(r.colors));
    return st;
  }

  function buildReady() {
    var grid = $('readyGrid');
    READY.forEach(function (r) {
      var card = document.createElement('article');
      card.className = 'card ready-card';
      card.innerHTML = '<div class="mini"><canvas aria-hidden="true"></canvas></div><div class="ready-text"><h3></h3><p></p></div>' +
        '<div class="ready-actions"><button type="button" class="btn tonal sm use">Use it</button>' +
        '<button type="button" class="text-btn copy"><span class="ms" aria-hidden="true">content_copy</span>Copy</button></div>';
      card.querySelector('h3').textContent = r.name;
      card.querySelector('p').textContent = r.about;
      card.querySelector('.use').setAttribute('aria-label', 'Use ' + r.name + ' in the maker');
      card.querySelector('.copy').setAttribute('aria-label', 'Copy ' + r.name);
      card.querySelector('.use').addEventListener('click', function () {
        S = readyStyle(r);
        $('name').value = S.name;
        moving = false; picked = -1;
        render();
        $('maker').scrollIntoView({ behavior: 'smooth' });
        snack(r.name + ' is in the maker: change it, or copy it as it is.');
      });
      card.querySelector('.copy').addEventListener('click', function () {
        copyText(toJSON(readyStyle(r)), function (ok) {
          snack(ok ? r.name + ' copied. In the app: Settings, App theme, Keypad, Paste a style.' : 'Could not copy: use it, then copy it from the maker.');
        });
      });
      grid.appendChild(card);
    });
  }
  function drawReady() {
    var cards = $('readyGrid').children;
    READY.forEach(function (r, i) {
      var mini = cards[i].querySelector('.mini');
      backdrop(mini, theme);
      drawPad(mini.querySelector('canvas'), readyStyle(r), theme, false, -1);
    });
  }

  // ------------------------------------------------------------------ start
  load();
  $('name').value = S.name;
  buildReady();
  render();
  drawReady();
  var resized;
  window.addEventListener('resize', function () {
    clearTimeout(resized);
    resized = setTimeout(function () { render(); drawReady(); }, 120);
  });
  // the fonts in (the canvas draws with them): once they are, drawn again
  if (document.fonts && document.fonts.load) {
    Promise.all([
      document.fonts.load('900 20px Roboto'), document.fonts.load('italic 900 20px Roboto'),
      document.fonts.load('700 20px "Roboto Condensed"'), document.fonts.load('italic 700 20px "Roboto Condensed"'),
      document.fonts.load('24px "Material Symbols Rounded"', 'play_arrow')
    ]).then(function () { render(); drawReady(); }, function () { /* drawn with what there is */ });
  }

  // Material ripples and the bar turning into a surface, as on the home page
  document.addEventListener('pointerdown', function (e) {
    var el = e.target.closest && e.target.closest('.btn, .text-btn');
    if (!el) return;
    var r = el.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2.2, s = document.createElement('span');
    s.className = 'ripple';
    s.style.width = s.style.height = d + 'px';
    s.style.left = (e.clientX - r.left - d / 2) + 'px';
    s.style.top = (e.clientY - r.top - d / 2) + 'px';
    el.appendChild(s);
    setTimeout(function () { s.remove(); }, 650);
  });
  var bar = $('bar');
  function scrolled() { bar.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', scrolled, { passive: true });
  scrolled();
})();
