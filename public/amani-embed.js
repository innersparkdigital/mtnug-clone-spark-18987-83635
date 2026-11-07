/*! Talk to Amani widget loader. InnerSpark Africa.
   Usage on a partner site:
   <script src="https://www.innersparkafrica.com/amani-embed.js" data-org="your-key" async></script>
   Adds a round "Talk to Amani" button (bottom right). The chat opens in an iframe,
   full screen on phones. The loader reads nothing from the host page. */
(function () {
  var script = document.currentScript;
  if (!script) return;
  var org = (script.getAttribute('data-org') || '').trim().toLowerCase();
  if (!/^[a-z0-9-]{2,40}$/.test(org)) {
    if (window.console) console.warn('[Amani] Missing or invalid data-org attribute.');
    return;
  }
  var origin;
  try { origin = new URL(script.src).origin; } catch (e) { origin = 'https://www.innersparkafrica.com'; }
  var side = script.getAttribute('data-side') === 'left' ? 'left' : 'right';

  var css = document.createElement('style');
  css.textContent =
    '.amani-btn{position:fixed;bottom:20px;' + side + ':20px;z-index:2147483000;display:flex;align-items:center;gap:10px;' +
    'border:0;border-radius:999px;padding:6px 18px 6px 6px;background:#0f766e;color:#fff;font:600 14px/1 system-ui,sans-serif;' +
    'box-shadow:0 6px 20px rgba(0,0,0,.25);cursor:pointer}' +
    '.amani-btn:focus-visible{outline:3px solid #99f6e4;outline-offset:2px}' +
    '.amani-btn img{width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.6)}' +
    '.amani-panel{position:fixed;z-index:2147483001;bottom:92px;' + side + ':20px;width:400px;height:640px;max-height:calc(100vh - 112px);' +
    'border:1px solid #d4d4d8;border-radius:16px;overflow:hidden;background:#fff;box-shadow:0 12px 40px rgba(0,0,0,.3);display:none}' +
    '.amani-panel.open{display:block}.amani-panel iframe{width:100%;height:100%;border:0}' +
    '@media(max-width:640px){.amani-panel{inset:0;width:100%;height:100%;max-height:none;border:0;border-radius:0}' +
    '.amani-btn.open{display:none}}';
  document.head.appendChild(css);

  var panel = document.createElement('div');
  panel.className = 'amani-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Amani chat');

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'amani-btn';
  btn.setAttribute('aria-label', 'Talk to Amani');
  btn.setAttribute('aria-expanded', 'false');
  var img = document.createElement('img');
  img.alt = '';
  img.src = origin + '/amani-avatar.jpg';
  img.onerror = function () { img.style.display = 'none'; };
  var label = document.createElement('span');
  label.textContent = 'Talk to Amani';
  btn.appendChild(img);
  btn.appendChild(label);

  var frame = null;
  function setOpen(open) {
    if (open && !frame) {
      frame = document.createElement('iframe');
      frame.title = 'Amani chat';
      frame.src = origin + '/amani-embed?org=' + encodeURIComponent(org);
      frame.setAttribute('referrerpolicy', 'no-referrer');
      panel.appendChild(frame);
    }
    panel.classList.toggle('open', open);
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  btn.addEventListener('click', function () { setOpen(!panel.classList.contains('open')); });

  window.addEventListener('message', function (e) {
    if (e.origin === origin && e.data && e.data.type === 'amani:close') setOpen(false);
  });

  document.body.appendChild(panel);
  document.body.appendChild(btn);
})();
