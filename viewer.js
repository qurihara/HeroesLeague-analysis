/* viewer.js — shared renderer for all analysis HTML pages */
(function () {
  /* ── CSS ─────────────────────────────────────────────────────── */
  const css = `
:root{--bg:#0d1117;--bg2:#161b22;--bg3:#21262d;--border:#30363d;--accent:#f0b429;--text:#e6edf3;--text2:#8b949e;--text3:#6e7681;--blue:#58a6ff;--purple:#bc8cff;--nav-h:60px;--radius:10px;}
*{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:'Noto Sans JP','Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;line-height:1.7;}
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Inter:wght@300;400;500;600;700&display=swap');

/* Navbar */
nav{position:fixed;top:0;left:0;right:0;z-index:100;height:var(--nav-h);background:rgba(13,17,23,0.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px;padding:0 28px;}
.nav-back{display:flex;align-items:center;gap:6px;background:var(--bg2);border:1px solid var(--border);color:var(--text2);padding:7px 14px;border-radius:8px;cursor:pointer;font-size:13px;text-decoration:none;transition:all .2s;}
.nav-back:hover{border-color:var(--accent);color:var(--accent);}
.nav-title{display:flex;align-items:center;gap:8px;font-size:16px;font-weight:700;color:var(--text);}
.nav-title .icon{font-size:18px;}
.nav-spacer{flex:1;}
.nav-credit{font-size:12px;color:var(--text3);}
.nav-credit a{color:var(--text2);text-decoration:none;transition:color .2s;}
.nav-credit a:hover{color:var(--accent);}

/* Content */
.page-wrap{max-width:860px;margin:0 auto;padding:calc(var(--nav-h) + 40px) 40px 80px;}

/* Loading */
.loading{display:flex;align-items:center;justify-content:center;gap:12px;padding:80px;color:var(--text3);font-size:14px;}
.spinner{width:20px;height:20px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}

/* Markdown body */
.md-body h1{font-size:28px;font-weight:700;margin:0 0 24px;color:var(--text);line-height:1.3;}
.md-body h2{font-size:20px;font-weight:700;margin:40px 0 16px;padding-bottom:8px;border-bottom:1px solid var(--border);color:var(--text);}
.md-body h3{font-size:16px;font-weight:700;margin:28px 0 12px;color:var(--accent);}
.md-body h4{font-size:14px;font-weight:700;margin:20px 0 8px;color:var(--text2);}
.md-body p{margin:0 0 14px;color:var(--text2);font-size:14px;}
.md-body a{color:var(--blue);text-decoration:none;}
.md-body a:hover{text-decoration:underline;}
.md-body strong{color:var(--text);font-weight:600;}
.md-body em{color:var(--text2);}
.md-body ul,.md-body ol{padding-left:22px;margin:0 0 14px;}
.md-body li{color:var(--text2);font-size:14px;margin-bottom:6px;}
.md-body li strong{color:var(--text);}
.md-body blockquote{border-left:3px solid var(--accent);background:rgba(240,180,41,0.06);padding:12px 18px;margin:16px 0;border-radius:0 6px 6px 0;}
.md-body blockquote p{color:var(--text2);margin:0;}
.md-body code{background:var(--bg3);color:var(--purple);padding:2px 7px;border-radius:4px;font-size:13px;font-family:'SF Mono','Fira Code',monospace;border:1px solid var(--border);}
.md-body pre{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:18px 20px;margin:16px 0;overflow-x:auto;}
.md-body pre code{background:none;border:none;padding:0;color:var(--text2);font-size:13px;}
.md-body table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px;}
.md-body th{background:var(--bg3);color:var(--text);padding:10px 14px;text-align:left;border:1px solid var(--border);font-weight:600;}
.md-body td{padding:9px 14px;border:1px solid var(--border);color:var(--text2);vertical-align:top;}
.md-body tr:nth-child(even) td{background:rgba(255,255,255,0.02);}
.md-body tr:hover td{background:rgba(255,255,255,0.04);}
.md-body hr{border:none;border-top:1px solid var(--border);margin:32px 0;}

/* Footer */
footer{margin-top:48px;padding-top:24px;border-top:1px solid var(--border);text-align:center;font-size:12px;color:var(--text3);line-height:2;}
footer a{color:var(--accent);text-decoration:none;}
footer a:hover{text-decoration:underline;}

@media(max-width:768px){
  .page-wrap{padding:calc(var(--nav-h)+24px) 20px 60px;}
  .md-body h1{font-size:22px;}
  .md-body h2{font-size:17px;}
  nav{padding:0 16px;}
}
`;

  /* ── Inject CSS & Google Fonts ───────────────────────────────── */
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Inter:wght@300;400;500;600;700&display=swap';
  document.head.appendChild(fontLink);

  const faviconLink = document.createElement('link');
  faviconLink.rel = 'icon';
  faviconLink.type = 'image/svg+xml';
  faviconLink.href = 'favicon.svg';
  document.head.appendChild(faviconLink);

  /* ── Google Analytics ─────────────────────────────────────────── */
  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-KYFWPQ97ME';
  document.head.appendChild(gtagScript);
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-KYFWPQ97ME');

  /* ── Determine MD file from current HTML filename ─────────────── */
  const htmlFile = location.pathname.split('/').pop() || 'index.html';
  const mdFile   = htmlFile.replace(/\.html?$/, '.md');
  const title    = (typeof PAGE_TITLE !== 'undefined') ? PAGE_TITLE : mdFile.replace('.md', '');
  const icon     = (typeof PAGE_ICON  !== 'undefined') ? PAGE_ICON  : '📄';

  /* ── Build page & fetch MD (runs after DOM is ready) ─────────── */
  function init() {
    document.body.innerHTML = `
<nav>
  <a class="nav-back" href="index.html">← ポータル</a>
  <div class="nav-title"><span class="icon">${icon}</span>${title}</div>
  <div class="nav-spacer"></div>
  <div class="nav-credit">by <a href="https://www.unryu.org" target="_blank" rel="noopener">栗原一貴</a></div>
</nav>
<div class="page-wrap">
  <div id="md-area" class="md-body">
    <div class="loading"><div class="spinner"></div>読み込み中...</div>
  </div>
  <footer>
    この分析は <strong>Claude（Anthropic）</strong> を用いて行いました。<br>
    <a href="https://heroes-league.net/" target="_blank" rel="noopener">ヒーローズ・リーグ</a> ·
    <a href="https://protopedia.net/prototype/8454" target="_blank" rel="noopener">protopedia-mcp</a> ·
    <a href="https://github.com/qurihara/HeroesLeague-analysis" target="_blank" rel="noopener">GitHub</a> ·
    Crafted by <a href="https://www.unryu.org" target="_blank" rel="noopener">栗原一貴</a>
  </footer>
</div>`;

    /* 見出しIDをGitHub流で生成：日本語を保持しつつ記号類を除去 */
    function slugify(text) {
      return text
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const markedScript = document.createElement('script');
    markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    markedScript.onload = async () => {
      marked.use({ breaks: true, gfm: true });
      try {
        const res  = await fetch(mdFile);
        if (!res.ok) throw new Error(res.status);
        const text = await res.text();
        const area = document.getElementById('md-area');
        area.innerHTML = marked.parse(text);

        /* 見出しにIDを付与（日本語対応） */
        area.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(h => {
          h.id = slugify(h.textContent);
        });

        const h1 = area.querySelector('h1');
        if (h1) document.title = h1.textContent + ' | HeroesLeague Analysis';

        /* 非同期描画後にハッシュ位置へスクロール */
        if (location.hash) {
          const id = decodeURIComponent(location.hash.slice(1));
          const target = document.getElementById(id);
          if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
        }
      } catch (e) {
        document.getElementById('md-area').innerHTML =
          `<p style="color:#f85149">ファイルの読み込みに失敗しました: ${mdFile} (${e})</p>`;
      }
    };
    document.head.appendChild(markedScript);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
