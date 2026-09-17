/* ============================================================
   construyetuweb.es — "Wireframe: del boceto a la web"
   Motor de render por seccion, hero, marquee, magneticos,
   mapa bajo consentimiento, cookies y formulario.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* `motion` gobierna SOLO el movimiento. El contenido (texto renderizado,
     contadores, indices) se actualiza siempre, tambien sin movimiento. */
  var motion = !mqReduce.matches;
  if (!motion) root.classList.add('no-motion');

  var hasGSAP = typeof window.gsap !== 'undefined';
  var hasST = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  /* ---------------------------------------------------------- utilidades */

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ------------------------------------------------- Lenis smooth-scroll */

  var lenis = null;
  if (motion && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.05, lerp: 0.12, smoothWheel: true });
    if (hasGSAP) {
      lenis.on('scroll', function () { if (hasST) ScrollTrigger.update(); });
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    }
  }

  /* Anclas internas: con Lenis hay que pedirle el scroll a el. */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      closeNav();
      var off = -78;
      if (lenis) lenis.scrollTo(t, { offset: off });
      else window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset + off,
                             behavior: motion ? 'smooth' : 'auto' });
    });
  });

  /* ------------------------------------------------------------ cabecera */

  var hdr = $('#hdr'), burger = $('#burger'), nav = $('#nav');

  function closeNav() {
    if (!hdr) return;
    hdr.classList.remove('is-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }
  if (burger) {
    burger.addEventListener('click', function () {
      var open = hdr.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  var lastY = 0;
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (hdr) hdr.classList.toggle('is-stuck', y > 12);
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* -------------------------------------- partir titulares en caracteres */
  /* Cada palabra va en un .wd inline-block con nowrap: si no, una palabra
     con las letras sueltas se parte por la mitad al final de la linea. */

  function split(el) {
    if (el.dataset.splitDone) return [];
    var text = el.textContent.trim();
    var words = text.split(/\s+/);
    var chars = [];
    el.textContent = '';
    words.forEach(function (w, wi) {
      var ws = document.createElement('span');
      ws.className = 'wd';
      for (var i = 0; i < w.length; i++) {
        var cs = document.createElement('span');
        cs.className = 'ch';
        cs.textContent = w[i];
        ws.appendChild(cs);
        chars.push(cs);
      }
      el.appendChild(ws);
      if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    el.dataset.splitDone = '1';
    el.setAttribute('aria-label', text);
    return chars;
  }

  var splitMap = new Map();
  $$('[data-split]').forEach(function (el) {
    var chars = split(el);
    splitMap.set(el, chars);
    if (hasGSAP && motion) gsap.set(chars, { yPercent: 116, opacity: 0 });
  });

  function revealChars(section, delay) {
    var els = $$('[data-split]', section);
    els.forEach(function (el) {
      var chars = splitMap.get(el);
      if (!chars || !chars.length) return;
      if (!hasGSAP || !motion) { el.style.opacity = ''; return; }
      gsap.to(chars, {
        yPercent: 0, opacity: 1, duration: 0.62, ease: 'power3.out',
        stagger: 0.016, delay: delay || 0, overwrite: true
      });
    });
  }

  /* ------------------------------------------- render: de boceto a web  */
  /* Una seccion entra en estado boceto y se renderiza al cruzar el 30 %
     del viewport. Una vez renderizada NO vuelve al boceto.               */

  function renderSection(sec, delay) {
    if (sec.classList.contains('is-rendered')) return;
    sec.classList.add('is-rendered');
    revealChars(sec, delay || 0);
    var counters = $$('[data-count]', sec);
    counters.forEach(runCounter);
  }

  var sections = $$('[data-render]').filter(function (s) { return !s.hasAttribute('data-render-hero'); });

  if (!motion) {
    // Sin movimiento: todo nace renderizado, incluido el contenido.
    $$('[data-render]').forEach(function (s) { renderSection(s, 0); });
  } else if (hasST) {
    sections.forEach(function (sec) {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 70%',          // cruza el 30 % del viewport
        once: true,
        onEnter: function () { renderSection(sec, 0.12); }
      });
    });
  } else {
    // Sin ScrollTrigger: mejor todo visible que nada visible.
    $$('[data-render]').forEach(function (s) { renderSection(s, 0); });
  }

  /* ------------------------------------------------------- hero: 0 → web */

  var hero = $('[data-render-hero]');
  if (hero) {
    if (!motion) {
      renderSection(hero, 0);
    } else {
      var start = function () {
        // El boceto se deja leer antes de renderizarse.
        setTimeout(function () { renderSection(hero, 0); }, 620);
      };
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
      else window.addEventListener('load', start);
    }
  }

  /* ---------------------------------------------------------- contadores */

  function runCounter(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    var end = parseFloat(el.dataset.count || '0');
    if (!motion || !hasGSAP) { el.textContent = String(end); return; }
    var o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 1.15, ease: 'power2.out',
      onUpdate: function () { el.textContent = String(Math.round(o.v)); },
      onComplete: function () { el.textContent = String(end); }
    });
  }

  /* ------------------------------------------------------------- marquee */

  var marq = $('#marq');
  if (marq) {
    var grp = marq.querySelector('.marq__grp');
    if (grp) {
      var need = Math.max(2, Math.ceil((window.innerWidth * 2) / Math.max(1, grp.offsetWidth)) + 1);
      for (var i = 1; i < need; i++) marq.appendChild(grp.cloneNode(true));
      if (motion && hasGSAP) {
        var w = grp.offsetWidth;
        gsap.to(marq, {
          x: -w, duration: Math.max(18, w / 26), ease: 'none', repeat: -1,
          modifiers: { x: function (x) { return (parseFloat(x) % w) + 'px'; } }
        });
      }
    }
  }

  /* --------------------------------------------------- botones magneticos */

  if (motion && hasGSAP && window.matchMedia('(pointer:fine)').matches) {
    $$('[data-magnetic]').forEach(function (btn) {
      var qx = gsap.quickTo(btn, 'x', { duration: 0.45, ease: 'power3.out' });
      var qy = gsap.quickTo(btn, 'y', { duration: 0.45, ease: 'power3.out' });
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        qx((e.clientX - (r.left + r.width / 2)) * 0.28);
        qy((e.clientY - (r.top + r.height / 2)) * 0.4);
      });
      btn.addEventListener('pointerleave', function () { qx(0); qy(0); });
    });
  }

  /* ------------------------------------------- mapa: solo si lo pides tu */

  var mapBtn = $('#mapBtn'), mapBox = $('#mapBox'), mapPh = $('#mapPh');
  if (mapBtn && mapBox) {
    mapBtn.addEventListener('click', function () {
      var q = 'construyetuweb.es Rúa Vázquez de Parga 76 15100 Carballo A Coruña';
      var f = document.createElement('iframe');
      f.src = 'https://www.google.com/maps?q=' + encodeURIComponent(q) + '&output=embed';
      f.title = 'Mapa de la ubicación en Carballo';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.setAttribute('allowfullscreen', '');
      if (mapPh) mapPh.remove();
      mapBox.classList.add('is-on');
      mapBox.style.borderStyle = 'solid';
      mapBox.appendChild(f);
    });
  }

  /* ------------------------------------------------------ aviso de cookies */
  /* El boton tiene que cerrar de verdad: .ck no lleva display:flex, asi que
     [hidden] manda. El layout vive en .ck__in.                            */

  var ck = $('#ck'), ckOk = $('#ckOk');
  var CK_KEY = 'ctw-cookies-v1';
  if (ck) {
    var seen = null;
    try { seen = localStorage.getItem(CK_KEY); } catch (e) { seen = null; }
    if (!seen) {
      setTimeout(function () { ck.hidden = false; }, 900);
    }
    if (ckOk) {
      ckOk.addEventListener('click', function () {
        ck.hidden = true;
        try { localStorage.setItem(CK_KEY, String(Date.now())); } catch (e) {}
      });
    }
  }

  /* ---------------------------------------------------------- formulario */
  /* No hay servidor detras: el envio se prepara en el correo del visitante
     y se avisa de ello sin disimulo.                                     */

  var form = $('#form'), formMsg = $('#formMsg');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!formMsg) return;
      var nombre = $('#f-nombre').value.trim();
      var email = $('#f-email').value.trim();
      var ok = $('#f-ok').checked;
      var hp = $('#f-web').value;

      if (hp) return;                       // trampa para robots
      if (!nombre || !email || !ok) {
        formMsg.textContent = 'Faltan el nombre, el email o la aceptación de la política de privacidad.';
        formMsg.classList.add('is-on');
        return;
      }
      var tel = $('#f-tel').value.trim();
      var tipo = $('#f-tipo').value;
      var msg = $('#f-msg').value.trim();
      var body = 'Nombre: ' + nombre + '\nEmail: ' + email +
                 (tel ? '\nTeléfono: ' + tel : '') +
                 '\nQué necesita: ' + tipo +
                 (msg ? '\n\nMensaje:\n' + msg : '');
      formMsg.innerHTML = '<strong>[FORMULARIO: FALTA DESTINO]</strong> Esta web todavía no tiene ' +
        'servidor de envío configurado, así que se abre tu programa de correo con el mensaje escrito. ' +
        'Si no se abre, escribe a <a href="mailto:info@construyetuweb.es">info@construyetuweb.es</a> ' +
        'o manda un WhatsApp al 657 303 623.';
      formMsg.classList.add('is-on');
      window.location.href = 'mailto:info@construyetuweb.es?subject=' +
        encodeURIComponent('Presupuesto web — ' + nombre) + '&body=' + encodeURIComponent(body);
    });
  }

  /* --------------------------------------------------------------- varios */

  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  if (hasST) {
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }
})();
