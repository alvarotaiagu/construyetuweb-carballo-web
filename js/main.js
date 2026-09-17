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

  /* El noindex ya va como etiqueta en el <head> de cada pagina, que Google
     lee siempre; aqui sobraba y ademas solo valia si renderizaba el JS. */

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


  /* ---------------------------------------------------- cortina de entrada
     Gesto propio: se trazan las columnas de la rejilla de maquetacion,
     aparece el logo y EL VIEWPORT SE ABRE EN DOS. A proposito no "renderiza"
     cajas de boceto: eso ya lo hace cada seccion al entrar en pantalla.

     Dos momentos distintos:
       - alAbrirse(fn) -> cuando las mitades EMPIEZAN a separarse, para que
         el hero ya se este renderizando cuando asoma por el hueco.
       - retirar()     -> al terminar: quita el nodo, devuelve el scroll y
         refresca ScrollTrigger, que midio con overflow:hidden.
     Se retira SIEMPRE (sin GSAP, con reduced-motion o por el timeout de
     seguridad): una cortina atascada tapa el sitio entero. */
  var cortina = (function initCortina() {
    var el = $('[data-cortina]');
    var espera = [];
    var abierta = false;
    var fuera = false;

    function abrir() {
      if (abierta) return;
      abierta = true;
      espera.splice(0).forEach(function (fn) { try { fn(); } catch (e) {} });
    }
    function retirar() {
      abrir();
      if (fuera) return;
      fuera = true;
      if (el) el.hidden = true;
      root.classList.remove('cortina-puesta');
      if (lenis) lenis.start();
      if (hasST) ScrollTrigger.refresh();
    }

    var api = { alAbrirse: function (fn) { return abierta ? fn() : espera.push(fn); } };
    if (!el || !motion || !hasGSAP) { retirar(); return api; }

    root.classList.add('cortina-puesta');
    if (lenis) lenis.stop();

    var centro = $('.cortina-centro', el);
    var reglas = $$('.cortina-rejilla i', el);
    var logo = $('.cortina-logo', el);
    var regla = $('.cortina-regla', el);
    var pie = $('.cortina-pie', el);
    var arriba = $('.cortina-mitad--arriba', el);
    var abajo = $('.cortina-mitad--abajo', el);
    var ABRE = 1.3;

    var tl = gsap.timeline({ onComplete: retirar });
    if (reglas.length) tl.to(reglas, { scaleY: 1, duration: 0.55, stagger: 0.022, ease: 'power2.out' }, 0);
    if (logo) tl.to(logo, { opacity: 1, duration: 0.7, ease: 'power2.out' }, 0.45);
    if (regla) tl.to(regla, { scaleX: 1, duration: 0.65, ease: 'power2.inOut' }, 0.7);
    if (pie) tl.to(pie, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.8);

    tl.add(abrir, ABRE);
    if (centro) tl.to(centro, { opacity: 0, duration: 0.3, ease: 'power2.in' }, ABRE);
    if (arriba) tl.to(arriba, { yPercent: -101, duration: 1.0, ease: 'expo.inOut' }, ABRE + 0.05);
    if (abajo) tl.to(abajo, { yPercent: 101, duration: 1.0, ease: 'expo.inOut' }, ABRE);

    setTimeout(retirar, 5200);
    return api;
  })();

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

  /* El render no cae de golpe: se escalona segun la altura de cada pieza,
     asi se lee como una pasada de render recorriendo la seccion. */
  function stagger(sec) {
    if (!motion) return;
    var top = sec.getBoundingClientRect().top;
    var els = $$('.r-fade,.box,.shot,.fake,.proc__n,.vent__l li,.pack__feat li', sec);
    var max = 0;
    els.forEach(function (el) {
      var d = el.getBoundingClientRect().top - top;
      if (d > max) max = d;
    });
    if (max <= 0) max = 1;
    els.forEach(function (el) {
      var d = (el.getBoundingClientRect().top - top) / max;
      el.style.transitionDelay = (Math.min(Math.max(d, 0), 1) * 0.42).toFixed(3) + 's';
    });
  }

  function sweep(sec) {
    if (!motion || !hasGSAP) return;
    var bar = document.createElement('span');
    bar.className = 'sweep';
    sec.appendChild(bar);
    gsap.fromTo(bar, { scaleY: 0, transformOrigin: '50% 0%' },
      { scaleY: 1, duration: 0.86, ease: 'power2.inOut',
        onComplete: function () { gsap.to(bar, { opacity: 0, duration: 0.3,
          onComplete: function () { bar.remove(); } }); } });
  }

  function renderSection(sec, delay) {
    if (sec.classList.contains('is-rendered')) return;
    stagger(sec);
    sweep(sec);
    sec.classList.add('is-rendered');
    revealChars(sec, delay || 0);
    $$('[data-count]', sec).forEach(runCounter);
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
        /* El boceto se deja leer antes de renderizarse, pero no antes de que
           se abra la cortina: si no, el hero se renderiza a puerta cerrada y
           lo que asoma por el hueco ya esta quieto. */
        cortina.alAbrirse(function () {
          setTimeout(function () { renderSection(hero, 0); }, 620);
        });
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
        var tw = gsap.to(marq, {
          x: -w, duration: Math.max(18, w / 26), ease: 'none', repeat: -1,
          modifiers: { x: function (x) { return (parseFloat(x) % w) + 'px'; } }
        });
        /* el marquee acusa la velocidad del scroll: acelera y se inclina */
        var prevY = window.pageYOffset, vel = 0;
        var skewTo = gsap.quickTo(marq, 'skewX', { duration: 0.5, ease: 'power3.out' });
        gsap.ticker.add(function () {
          var y = window.pageYOffset;
          vel += ((y - prevY) - vel) * 0.16;
          prevY = y;
          var v = Math.max(-60, Math.min(60, vel));
          tw.timeScale(1 + Math.abs(v) / 14);
          skewTo(-v / 9);
        });
      }
    }
  }

  /* ------------------ las tarjetas de la baraja tienen que medir LO MISMO */
  /* Comparten contenedor: si una es mas alta, asoma por debajo de la que se
     pega encima y la pila parece rota. Se igualan por JS al alto de la mayor,
     recalculando al cambiar el ancho (el reparto de columnas cambia).      */

  var packCards = $$('[data-pack] .pack');
  function equalisePacks() {
    if (!packCards.length) return;
    var stacked = window.matchMedia('(min-width:861px)').matches;
    packCards.forEach(function (c) { c.style.minHeight = ''; });
    if (!stacked) return;                       // en movil la pila es lineal
    var max = 0;
    packCards.forEach(function (c) { max = Math.max(max, c.offsetHeight); });
    packCards.forEach(function (c) { c.style.minHeight = max + 'px'; });
    if (hasST) ScrollTrigger.refresh();
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(equalisePacks);
  else window.addEventListener('load', equalisePacks);
  var eqT;
  window.addEventListener('resize', function () {
    clearTimeout(eqT); eqT = setTimeout(equalisePacks, 180);
  });

  /* --------------------- profundidad de la baraja de packs (solo escala) */

  if (motion && hasST) {
    var packItems = $$('[data-pack]');
    packItems.forEach(function (li, i) {
      if (i === packItems.length - 1) return;
      var card = li.querySelector('.pack');
      var next = packItems[i + 1];
      gsap.fromTo(card, { scale: 1 }, {
        scale: 0.94, ease: 'none', immediateRender: false,
        scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: 0.4 }
      });
    });
  }

  /* ------------------------------- demo responsive: el ancho lo manda el scroll */
  /* El reflow de dentro NO esta simulado: el frame es un container y el CSS
     usa @container. Aqui solo se anima su ancho. */

  var rz = $('[data-rz]');
  if (rz) {
    var frame = $('[data-rz-frame]', rz);
    var wOut = $('[data-rz-w]', rz);
    var devOut = $('[data-rz-dev]', rz);
    var ticks = $$('[data-rz-tick]', rz);
    var MAXW = 1440, MINW = 390;

    function paintRz(px) {
      /* El ancho disponible es el del CONTENIDO del escenario: si se usa
         clientWidth a secas, el padding lateral se suma al ancho fijo del
         marco y el documento acaba desbordando en movil. */
      var stage = frame.parentElement;
      var cs = getComputedStyle(stage);
      var avail = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (!avail || avail < 0) avail = MAXW;
      var shown = Math.min(px, avail);
      frame.style.width = shown + 'px';
      if (wOut) wOut.textContent = String(Math.round(shown));
      var dev = shown > 1100 ? 'Escritorio' : shown > 820 ? 'Portátil' : shown > 560 ? 'Tablet' : 'Móvil';
      if (devOut) devOut.textContent = dev;
      var best = null;
      ticks.forEach(function (t) {
        var v = parseInt(t.dataset.rzTick, 10);
        if (best === null || Math.abs(v - shown) < Math.abs(best - shown)) best = v;
      });
      ticks.forEach(function (t) {
        t.classList.toggle('is-on', parseInt(t.dataset.rzTick, 10) === best);
      });
    }

    var narrow = window.matchMedia('(max-width:760px)').matches;

    if (!motion || !hasST || narrow) {
      /* Sin movimiento, o en pantallas donde la demo no cabe: se pinta al
         ancho disponible y se deja quieta. */
      paintRz(MAXW);
      window.addEventListener('resize', function () { paintRz(MAXW); });
    } else {
      ScrollTrigger.create({
        trigger: rz, start: 'top top', end: 'bottom bottom', scrub: 0.5,
        onUpdate: function (self) {
          /* llega a 390 al 82 % y se queda ahi: si no, el estado movil
             pasa de largo justo cuando el pin se suelta. */
          var e = Math.min(1, self.progress / 0.82);
          e = e < 0.5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2;   // inOutQuad
          paintRz(MAXW - (MAXW - MINW) * e);
        }
      });
      paintRz(MAXW);
      window.addEventListener('resize', function () {
        paintRz(parseFloat(frame.style.width) || MAXW);
      });
    }
  }

  /* ------------------------------------------------ parallax de las fotos */

  if (motion && hasST) {
    $$('[data-parallax]').forEach(function (el) {
      var img = el.querySelector('img');
      if (!img) return;
      gsap.fromTo(img, { yPercent: -7 }, {
        yPercent: 7, ease: 'none', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
      });
    });
  }

  /* --------------------------- lectura de coordenadas, como una herramienta */

  var readout = $('#readout');
  if (readout && motion && window.matchMedia('(pointer:fine)').matches) {
    var rx = gsap.quickTo ? gsap.quickTo(readout, 'x', { duration: 0.28, ease: 'power3.out' }) : null;
    var ry = gsap.quickTo ? gsap.quickTo(readout, 'y', { duration: 0.28, ease: 'power3.out' }) : null;
    window.addEventListener('pointermove', function (e) {
      if (rx) { rx(e.clientX + 16); ry(e.clientY + 18); }
      readout.textContent = 'x ' + e.clientX + '  y ' + Math.round(e.clientY + window.pageYOffset);
      readout.classList.add('is-on');
    }, { passive: true });
    document.addEventListener('mouseleave', function () { readout.classList.remove('is-on'); });
  }

  /* ------------------------------- rejilla de maquetacion, con la tecla G */

  var gridBtn = $('#gridBtn');
  function toggleGrid(force) {
    var on = root.classList.toggle('show-grid', force);
    if (gridBtn) gridBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
  if (gridBtn) gridBtn.addEventListener('click', function () { toggleGrid(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'g' || e.key === 'G') {
      var t = e.target.tagName;
      if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
      toggleGrid();
    }
  });

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
