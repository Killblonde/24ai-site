(function () {
  'use strict';

  var CFG = {
    teaserTimeoutMs: 12000,
    scrollThresholdPct: 30,
    teaserText: 'Здравствуйте! Меня зовут Аня. Помогу разобраться, что в вашем бизнесе можно автоматизировать. Пройдём короткую диагностику?',
    diagPath: '/diagnostika.html',
    avatarPath: '/img/assistant.jpg',
    lsKeyDismissed: '24ai_widget_teaser_dismissed',
    apiUrl: 'https://api.24-ai.ru'
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
    + '}'
    + '.ai24-exit-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:1000001;opacity:0;pointer-events:none;transition:opacity .18s ease;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif}'
    + '.ai24-exit-backdrop.is-open{opacity:1;pointer-events:auto}'
    + '.ai24-exit-modal{position:fixed;left:50%;top:50%;transform:translate(-50%,-46%);width:90vw;max-width:420px;background:var(--w-bg,#1a1a24);color:var(--w-text,#fff);border:1px solid var(--w-border,#2a2a3a);border-radius:18px;padding:28px 24px 24px;box-shadow:0 30px 80px rgba(0,0,0,.6);z-index:1000002;opacity:0;pointer-events:none;transition:opacity .18s ease,transform .18s ease;font-family:inherit}'
    + '.ai24-exit-modal.is-open{opacity:1;pointer-events:auto;transform:translate(-50%,-50%)}'
    + '.ai24-exit-title{font-family:"Space Grotesk",Inter,sans-serif;font-size:22px;font-weight:700;margin:0 0 10px;line-height:1.25}'
    + '.ai24-exit-sub{font-size:14.5px;color:var(--w-text-secondary,#a0a0b0);margin:0 0 20px;line-height:1.5}'
    + '.ai24-exit-field{margin-bottom:12px}'
    + '.ai24-exit-field label{display:block;font-size:12.5px;color:var(--w-text-secondary,#a0a0b0);margin-bottom:6px;font-weight:500}'
    + '.ai24-exit-field input{width:100%;background:var(--bg-secondary,#12121a);color:var(--w-text,#fff);border:1px solid var(--w-border,#2a2a3a);border-radius:12px;padding:11px 13px;font-size:15px;outline:none;font-family:inherit;transition:border-color .15s ease,box-shadow .15s ease;box-sizing:border-box}'
    + '.ai24-exit-field input:focus{border-color:var(--w-accent,#f7c948);box-shadow:0 0 0 3px rgba(247,201,72,0.15)}'
    + '.ai24-exit-field.has-error input{border-color:#ff6b6b}'
    + '.ai24-exit-field-error{display:none;font-size:12px;color:#ff6b6b;margin-top:4px}'
    + '.ai24-exit-field.has-error .ai24-exit-field-error{display:block}'
    + '.ai24-exit-submit{width:100%;background:var(--w-accent,#f7c948);color:#000;border:0;border-radius:12px;padding:13px 16px;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px;min-height:46px;transition:background .15s ease,transform .15s ease}'
    + '.ai24-exit-submit:hover{background:#fad96a}'
    + '.ai24-exit-submit:active{transform:scale(0.98)}'
    + '.ai24-exit-submit[disabled]{opacity:0.7;cursor:not-allowed}'
    + '.ai24-exit-submit-spinner{width:16px;height:16px;border:2px solid rgba(0,0,0,0.25);border-top-color:#000;border-radius:50%;animation:ai24WidgetSpin .7s linear infinite;display:inline-block}'
    + '.ai24-exit-skip{display:block;width:100%;margin-top:12px;background:none;border:0;color:var(--w-text-muted,#6b6b7b);font-size:13.5px;cursor:pointer;text-decoration:underline;text-underline-offset:3px;padding:6px;font-family:inherit}'
    + '.ai24-exit-skip:hover{color:var(--w-text-secondary,#a0a0b0)}'
    + '.ai24-exit-error{display:none;margin-top:10px;padding:9px 12px;background:rgba(255,107,107,0.1);border:1px solid rgba(255,107,107,0.3);border-radius:10px;color:#ff6b6b;font-size:13px;text-align:center}'
    + '.ai24-exit-toast{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);background:var(--w-bg,#1a1a24);color:var(--w-text,#fff);border:1px solid var(--w-accent,#f7c948);border-radius:14px;padding:18px 26px;font-size:15px;font-weight:500;z-index:1000003;opacity:0;pointer-events:none;transition:opacity .2s ease;box-shadow:0 20px 50px rgba(0,0,0,.55);font-family:inherit}'
    + '.ai24-exit-toast.is-open{opacity:1}'
    + '@media (max-width:480px){.ai24-exit-modal{padding:24px 18px 18px;width:calc(100vw - 24px)}.ai24-exit-title{font-size:20px}}';

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

    modalCloseEl.addEventListener('click', requestCloseModal);
    modalBackdropEl.addEventListener('click', requestCloseModal);
    document.addEventListener('keydown', onKeydown);
  }

  function onKeydown(e) {
    if (e.key === 'Escape' && exitModalEl && exitModalEl.classList.contains('is-open')) {
      closeExitIntent();
      return;
    }
    if (e.key === 'Escape' && modalEl && modalEl.classList.contains('is-open')) {
      requestCloseModal();
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

  /* ---------- Exit-intent ---------- */
  var lastIframeState = { screen: 'welcome', hasSession: false, submitted: false };
  var exitIntentShown = false;
  var exitModalEl = null;
  var exitBackdropEl = null;
  var exitToastEl = null;
  var exitBuilt = false;

  window.addEventListener('message', function (e) {
    var data = e && e.data;
    if (!data || data.type !== '24ai-diag:state') return;
    lastIframeState = {
      screen: data.screen || 'welcome',
      hasSession: !!data.hasSession,
      submitted: !!data.submitted
    };
  });

  function requestIframeState() {
    if (!modalIframeEl || !modalIframeEl.contentWindow) return;
    try {
      modalIframeEl.contentWindow.postMessage({ type: '24ai-diag:request-state' }, '*');
    } catch (e) {}
  }

  function shouldShowExitIntent() {
    if (exitIntentShown) return false;
    if (!lastIframeState.hasSession) return false;
    if (lastIframeState.submitted) return false;
    if (lastIframeState.screen === 'thanks') return false;
    return true;
  }

  function requestCloseModal() {
    requestIframeState();
    // give the iframe a tiny window to respond before deciding
    setTimeout(function () {
      if (shouldShowExitIntent()) {
        openExitIntent();
      } else {
        closeModal();
      }
    }, 60);
  }

  function buildExitModal() {
    if (exitBuilt) return;
    exitBuilt = true;

    exitBackdropEl = document.createElement('div');
    exitBackdropEl.className = 'ai24-exit-backdrop';

    exitModalEl = document.createElement('div');
    exitModalEl.className = 'ai24-exit-modal';
    exitModalEl.setAttribute('role', 'dialog');
    exitModalEl.setAttribute('aria-modal', 'true');
    exitModalEl.setAttribute('aria-label', 'Оставить контакты');
    exitModalEl.innerHTML = ''
      + '<h3 class="ai24-exit-title">Уйдёте без ответа?</h3>'
      + '<p class="ai24-exit-sub">Оставьте контакты - Роман Сухов свяжется, чтобы продолжить разговор и помочь с диагностикой.</p>'
      + '<form class="ai24-exit-form" novalidate>'
      +   '<div class="ai24-exit-field" data-field="name">'
      +     '<label for="ai24-exit-name">Имя</label>'
      +     '<input id="ai24-exit-name" type="text" autocomplete="name" required>'
      +     '<div class="ai24-exit-field-error">Введите имя (минимум 2 символа).</div>'
      +   '</div>'
      +   '<div class="ai24-exit-field" data-field="phone">'
      +     '<label for="ai24-exit-phone">Телефон или Telegram</label>'
      +     '<input id="ai24-exit-phone" type="text" autocomplete="tel" required placeholder="+7... или @username">'
      +     '<div class="ai24-exit-field-error">Введите телефон или Telegram-юзернейм.</div>'
      +   '</div>'
      +   '<button type="submit" class="ai24-exit-submit">Оставить контакты</button>'
      +   '<div class="ai24-exit-error"></div>'
      +   '<button type="button" class="ai24-exit-skip">Всё равно закрыть</button>'
      + '</form>';

    document.body.appendChild(exitBackdropEl);
    document.body.appendChild(exitModalEl);

    var formEl = exitModalEl.querySelector('.ai24-exit-form');
    var skipEl = exitModalEl.querySelector('.ai24-exit-skip');
    var nameEl = exitModalEl.querySelector('#ai24-exit-name');
    var phoneEl = exitModalEl.querySelector('#ai24-exit-phone');

    [nameEl, phoneEl].forEach(function (el) {
      el.addEventListener('input', function () {
        var f = el.closest('.ai24-exit-field');
        if (f) f.classList.remove('has-error');
      });
    });

    formEl.addEventListener('submit', function (e) { e.preventDefault(); submitExitContact(); });
    skipEl.addEventListener('click', function () {
      closeExitIntent();
      closeModal();
    });
    exitBackdropEl.addEventListener('click', function () {
      // backdrop click on exit-intent: keep widget open, hide intent only
      closeExitIntent();
    });
  }

  function openExitIntent() {
    buildExitModal();
    exitIntentShown = true;
    var errEl = exitModalEl.querySelector('.ai24-exit-error');
    if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }
    exitModalEl.querySelectorAll('.ai24-exit-field').forEach(function (f) { f.classList.remove('has-error'); });
    exitBackdropEl.classList.add('is-open');
    exitModalEl.classList.add('is-open');
    setTimeout(function () {
      var nameEl = exitModalEl.querySelector('#ai24-exit-name');
      try { if (nameEl) nameEl.focus(); } catch (e) {}
    }, 80);
  }

  function closeExitIntent() {
    if (!exitModalEl) return;
    exitModalEl.classList.remove('is-open');
    exitBackdropEl.classList.remove('is-open');
  }

  function showExitToast(text) {
    if (!exitToastEl) {
      exitToastEl = document.createElement('div');
      exitToastEl.className = 'ai24-exit-toast';
      document.body.appendChild(exitToastEl);
    }
    exitToastEl.textContent = text;
    exitToastEl.classList.add('is-open');
    setTimeout(function () {
      if (exitToastEl) exitToastEl.classList.remove('is-open');
    }, 2000);
  }

  function getDiagSessionId() {
    try { return localStorage.getItem('24ai_diag_session_id') || ''; } catch (e) { return ''; }
  }

  function submitExitContact() {
    var nameEl = exitModalEl.querySelector('#ai24-exit-name');
    var phoneEl = exitModalEl.querySelector('#ai24-exit-phone');
    var btnEl = exitModalEl.querySelector('.ai24-exit-submit');
    var errEl = exitModalEl.querySelector('.ai24-exit-error');
    var fName = exitModalEl.querySelector('[data-field="name"]');
    var fPhone = exitModalEl.querySelector('[data-field="phone"]');

    var name = (nameEl.value || '').trim();
    var phone = (phoneEl.value || '').trim();
    var bad = false;
    if (name.length < 2) { fName.classList.add('has-error'); bad = true; }
    if (phone.length < 5 || !/[\d@]/.test(phone)) { fPhone.classList.add('has-error'); bad = true; }
    if (bad) return;

    var sid = getDiagSessionId();
    if (!sid) {
      errEl.textContent = 'Сессия диагностики не найдена. Попробуйте через форму в чате.';
      errEl.style.display = 'block';
      return;
    }

    btnEl.disabled = true;
    var origHtml = btnEl.innerHTML;
    btnEl.innerHTML = '<span class="ai24-exit-submit-spinner" aria-hidden="true"></span>';
    errEl.style.display = 'none';

    fetch(CFG.apiUrl + '/api/submit-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sid,
        name: name,
        phone_or_telegram: phone,
        company: 'не указана'
      })
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).then(function () {
      // mark submitted in localStorage so the widget restored next time goes to thanks
      try { localStorage.setItem('24ai_diag_contact_submitted', 'true'); } catch (e) {}
      lastIframeState.submitted = true;
      closeExitIntent();
      showExitToast('Спасибо! Роман свяжется с вами');
      setTimeout(function () { closeModal(); }, 2000);
    }).catch(function (err) {
      errEl.textContent = 'Не удалось отправить. Попробуйте ещё раз.';
      errEl.style.display = 'block';
      btnEl.disabled = false;
      btnEl.innerHTML = origHtml;
      try { console.error('[24ai-widget] exit submit failed', err); } catch (e) {}
    });
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
