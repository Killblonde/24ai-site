(function () {
  'use strict';

  var CFG = {
    teaserTimeoutMs: 12000,
    scrollThresholdPct: 30,
    teaserText: 'Здравствуйте! Меня зовут Аня. Помогу разобраться, что в вашем бизнесе можно автоматизировать. Пройдём короткую диагностику?',
    diagPath: '/diagnostika.html',
    avatarPath: '/img/assistant.jpg',
    lsKeyDismissed: '24ai_widget_teaser_dismissed'
  };

  var path = location.pathname.toLowerCase();
  if (path.endsWith('/diagnostika.html') || path.endsWith('/admin.html') || path.endsWith('/panel.html')) {
    return;
  }
  if (window.__ai24WidgetLoaded) return;
  window.__ai24WidgetLoaded = true;

  var css = ''
    + '.ai24-widget-root{position:fixed;right:20px;bottom:20px;z-index:99999;display:flex;flex-direction:column;align-items:flex-end;gap:12px;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;transition:opacity .2s ease}'
    + '.ai24-widget-root.is-modal-open{opacity:0;pointer-events:none}'
    + '.ai24-widget-root{'
    + '--w-bg:var(--bg-card,#1a1a24);--w-text:var(--text-primary,#fff);--w-text-muted:var(--text-muted,#6b6b7b);--w-text-secondary:var(--text-secondary,#a0a0b0);--w-accent:var(--accent-yellow,#f7c948);--w-border:var(--border-color,#2a2a3a)}'
    + '.ai24-widget-bubble{position:relative;width:64px;height:64px;border-radius:50%;border:2px solid var(--w-accent);background:var(--w-bg);padding:0;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.45);transition:transform .2s ease, box-shadow .2s ease;display:flex;align-items:center;justify-content:center;overflow:visible}'
    + '.ai24-widget-bubble:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 12px 28px rgba(0,0,0,.55)}'
    + '.ai24-widget-bubble:focus-visible{outline:3px solid var(--w-accent);outline-offset:3px}'
    + '.ai24-widget-bubble img{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;pointer-events:none}'
    + '.ai24-widget-badge{position:absolute;top:-2px;right:-2px;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:#e53935;color:#fff;font-size:11px;font-weight:700;line-height:18px;text-align:center;box-shadow:0 0 0 2px var(--bg-primary,#0a0a0f);pointer-events:none;font-family:inherit}'
    + '.ai24-widget-teaser{max-width:280px;background:var(--w-bg);color:var(--w-text);border:1px solid var(--w-border);border-radius:16px;padding:14px 16px;box-shadow:0 8px 32px rgba(0,0,0,.4);position:relative;cursor:pointer;opacity:0;transform:translateY(16px);transition:opacity .32s ease-out,transform .32s ease-out;will-change:opacity,transform}'
    + '.ai24-widget-teaser[hidden]{display:none}'
    + '.ai24-widget-teaser.is-visible{opacity:1;transform:translateY(0)}'
    + '.ai24-widget-teaser.is-closing{opacity:0;transform:translateY(8px);transition:opacity .22s ease-in,transform .22s ease-in}'
    + '.ai24-widget-teaser-text{font-size:14px;line-height:1.45;color:var(--w-text);margin:0;padding-right:22px}'
    + '.ai24-widget-teaser-close{position:absolute;top:6px;right:6px;width:24px;height:24px;border-radius:50%;border:0;background:transparent;color:var(--w-text-muted);font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;transition:color .15s ease, background .15s ease}'
    + '.ai24-widget-teaser-close:hover{color:var(--w-text-secondary);background:rgba(255,255,255,.06)}'
    + '.ai24-widget-teaser-close:focus-visible{outline:2px solid var(--w-accent);outline-offset:2px}'
    + '.ai24-widget-modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:999999;opacity:0;pointer-events:none;transition:opacity .2s ease}'
    + '.ai24-widget-modal-backdrop.is-open{opacity:1;pointer-events:auto}'
    + '.ai24-widget-modal{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%) scale(.96);width:90vw;height:90vh;max-width:880px;max-height:720px;background:var(--w-bg);border-radius:20px;overflow:hidden;z-index:1000000;opacity:0;pointer-events:none;transition:opacity .2s ease, transform .2s ease;display:flex;box-shadow:0 30px 80px rgba(0,0,0,.6)}'
    + '.ai24-widget-modal.is-open{opacity:1;transform:translate(-50%,-50%) scale(1);pointer-events:auto}'
    + '.ai24-widget-modal iframe{width:100%;height:100%;border:0;display:block;background:var(--w-bg)}'
    + '.ai24-widget-modal-close{position:absolute;top:12px;right:12px;width:32px;height:32px;border-radius:50%;border:0;background:rgba(0,0,0,.5);color:#fff;font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;z-index:2;transition:background .15s ease}'
    + '.ai24-widget-modal-close:hover{background:rgba(0,0,0,.75)}'
    + '.ai24-widget-modal-close:focus-visible{outline:2px solid var(--w-accent);outline-offset:2px}'
    + '.ai24-widget-modal-loader{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--w-text-muted);font-size:14px;pointer-events:none;background:var(--w-bg);transition:opacity .25s ease;z-index:1}'
    + '.ai24-widget-modal-loader.is-hidden{opacity:0}'
    + '.ai24-widget-modal-spinner{width:36px;height:36px;border-radius:50%;border:3px solid var(--w-border);border-top-color:var(--w-accent);animation:ai24WidgetSpin 1s linear infinite}'
    + '@keyframes ai24WidgetSpin{to{transform:rotate(360deg)}}'
    + '@media (max-width:768px){'
    + '.ai24-widget-root{right:14px;bottom:14px;gap:10px}'
    + '.ai24-widget-bubble{width:56px;height:56px}'
    + '.ai24-widget-teaser{max-width:calc(100vw - 28px);padding:12px 14px}'
    + '.ai24-widget-teaser-text{font-size:13px;padding-right:20px}'
    + '.ai24-widget-modal{width:100vw;height:100dvh;max-width:none;max-height:none;border-radius:0;left:0;top:0;transform:none}'
    + '.ai24-widget-modal.is-open{transform:none}'
    + '.ai24-widget-modal-close{top:10px;right:10px}'
    + '}';

  var styleEl = document.createElement('style');
  styleEl.setAttribute('data-ai24-widget', '');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  var dismissed = false;
  try { dismissed = localStorage.getItem(CFG.lsKeyDismissed) === '1'; } catch (e) {}

  var root = document.createElement('div');
  root.className = 'ai24-widget-root';
  root.innerHTML = ''
    + '<div class="ai24-widget-teaser" role="dialog" aria-live="polite" aria-label="Предложение пройти AI-диагностику" hidden>'
    +   '<button type="button" class="ai24-widget-teaser-close" aria-label="Закрыть подсказку">×</button>'
    +   '<p class="ai24-widget-teaser-text"></p>'
    + '</div>'
    + '<button type="button" class="ai24-widget-bubble" aria-label="Открыть чат с Аней">'
    +   '<img alt="Аня, ассистент 24AI" aria-hidden="true">'
    +   '<span class="ai24-widget-badge" aria-hidden="true" hidden>1</span>'
    + '</button>';

  var teaserEl = root.querySelector('.ai24-widget-teaser');
  var teaserTextEl = root.querySelector('.ai24-widget-teaser-text');
  var teaserCloseEl = root.querySelector('.ai24-widget-teaser-close');
  var bubbleEl = root.querySelector('.ai24-widget-bubble');
  var bubbleImgEl = bubbleEl.querySelector('img');
  var badgeEl = root.querySelector('.ai24-widget-badge');

  teaserTextEl.textContent = CFG.teaserText;
  bubbleImgEl.src = CFG.avatarPath;

  if (!dismissed) {
    badgeEl.hidden = false;
  }

  function appendRoot() { document.body.appendChild(root); }
  if (document.body) appendRoot();
  else document.addEventListener('DOMContentLoaded', appendRoot);

  var modalEl = null;
  var modalBackdropEl = null;
  var modalCloseEl = null;
  var modalIframeEl = null;
  var modalLoaderEl = null;
  var modalBuilt = false;
  var iframeLoaded = false;
  var lastFocusEl = null;

  function buildModal() {
    if (modalBuilt) return;
    modalBuilt = true;

    modalBackdropEl = document.createElement('div');
    modalBackdropEl.className = 'ai24-widget-modal-backdrop';

    modalEl = document.createElement('div');
    modalEl.className = 'ai24-widget-modal';
    modalEl.setAttribute('role', 'dialog');
    modalEl.setAttribute('aria-modal', 'true');
    modalEl.setAttribute('aria-label', 'AI-диагностика 24AI');

    modalCloseEl = document.createElement('button');
    modalCloseEl.type = 'button';
    modalCloseEl.className = 'ai24-widget-modal-close';
    modalCloseEl.setAttribute('aria-label', 'Закрыть диагностику');
    modalCloseEl.textContent = '×';

    modalLoaderEl = document.createElement('div');
    modalLoaderEl.className = 'ai24-widget-modal-loader';
    modalLoaderEl.innerHTML = '<div class="ai24-widget-modal-spinner" aria-hidden="true"></div>';

    modalIframeEl = document.createElement('iframe');
    modalIframeEl.title = 'AI-диагностика 24AI';
    modalIframeEl.setAttribute('allow', 'clipboard-write');

    modalIframeEl.addEventListener('load', function () {
      if (!modalIframeEl.src || modalIframeEl.src === 'about:blank') return;
      iframeLoaded = true;
      modalLoaderEl.classList.add('is-hidden');
    });

    modalEl.appendChild(modalIframeEl);
    modalEl.appendChild(modalLoaderEl);
    modalEl.appendChild(modalCloseEl);

    document.body.appendChild(modalBackdropEl);
    document.body.appendChild(modalEl);

    modalCloseEl.addEventListener('click', closeModal);
    modalBackdropEl.addEventListener('click', closeModal);
    document.addEventListener('keydown', onKeydown);
  }

  function onKeydown(e) {
    if (e.key === 'Escape' && modalEl && modalEl.classList.contains('is-open')) {
      closeModal();
    }
  }

  function openModal() {
    buildModal();
    lastFocusEl = document.activeElement;

    if (!iframeLoaded) {
      modalLoaderEl.classList.remove('is-hidden');
      modalIframeEl.src = CFG.diagPath;
    }

    modalBackdropEl.classList.add('is-open');
    modalEl.classList.add('is-open');
    root.classList.add('is-modal-open');
    document.documentElement.style.overflow = 'hidden';

    setTimeout(function () {
      try { modalCloseEl.focus(); } catch (e) {}
    }, 60);
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.classList.remove('is-open');
    modalBackdropEl.classList.remove('is-open');
    root.classList.remove('is-modal-open');
    document.documentElement.style.overflow = '';
    if (lastFocusEl && typeof lastFocusEl.focus === 'function') {
      try { lastFocusEl.focus(); } catch (e) {}
    }
  }

  var teaserShown = false;
  var teaserTimer = null;
  var scrollHandlerBound = false;

  function showTeaser() {
    if (teaserShown || dismissed) return;
    teaserShown = true;
    cancelTriggers();

    teaserEl.hidden = false;
    requestAnimationFrame(function () {
      teaserEl.classList.add('is-visible');
    });
  }

  function dismissTeaser(persist) {
    if (persist) {
      dismissed = true;
      try { localStorage.setItem(CFG.lsKeyDismissed, '1'); } catch (e) {}
    }
    badgeEl.hidden = true;

    if (!teaserShown) {
      cancelTriggers();
      return;
    }

    teaserEl.classList.remove('is-visible');
    teaserEl.classList.add('is-closing');
    setTimeout(function () {
      teaserEl.hidden = true;
      teaserEl.classList.remove('is-closing');
    }, 240);
  }

  function cancelTriggers() {
    if (teaserTimer) { clearTimeout(teaserTimer); teaserTimer = null; }
    if (scrollHandlerBound) {
      window.removeEventListener('scroll', onScroll);
      scrollHandlerBound = false;
    }
  }

  function maybeShowTeaser() {
    if (dismissed || teaserShown) return;
    showTeaser();
  }

  function onScroll() {
    if (dismissed || teaserShown) { cancelTriggers(); return; }
    var doc = document.documentElement;
    var scrolled = window.pageYOffset || doc.scrollTop || 0;
    var max = (doc.scrollHeight || 0) - (window.innerHeight || 0);
    if (max <= 0) return;
    var pct = (scrolled / max) * 100;
    if (pct >= CFG.scrollThresholdPct) maybeShowTeaser();
  }

  if (!dismissed) {
    teaserTimer = setTimeout(maybeShowTeaser, CFG.teaserTimeoutMs);
    window.addEventListener('scroll', onScroll, { passive: true });
    scrollHandlerBound = true;
  }

  bubbleEl.addEventListener('click', function () {
    dismissTeaser(true);
    openModal();
  });

  teaserEl.addEventListener('click', function (e) {
    if (e.target.closest('.ai24-widget-teaser-close')) {
      e.stopPropagation();
      dismissTeaser(true);
      return;
    }
    dismissTeaser(true);
    openModal();
  });
})();
