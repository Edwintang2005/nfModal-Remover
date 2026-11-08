// Fills every .window with a browser toolbar and a fictional article page.
document.querySelectorAll('.window').forEach((win) => {
  const host = win.dataset.host || 'news.example.com';
  const active = win.dataset.ext === 'active' ? ' active' : '';
  win.insertAdjacentHTML(
    'afterbegin',
    `<div class="toolbar">
       <div class="lights"><i></i><i></i><i></i></div>
       <div class="nav"><span>‹</span><span>›</span></div>
       <div class="address"><span class="lock">🔒</span>${host}</div>
       <div class="ext-btn${active}"><img src="../../NF%20Modal%20Remover%20Extension/Resources/images/toolbar-32.png" alt=""></div>
       <div class="spacer"></div>
     </div>
     <div class="page">
       <div class="masthead"><b>The Example Gazette</b><span>Saturday 8 November</span></div>
       <div class="article">
         <div>
           <div class="kicker">Travel</div>
           <h2>A slow weekend on the coast, one small town at a time</h2>
           <div class="hero"></div>
           <div class="lines">${'<i></i>'.repeat(7)}</div>
         </div>
         <div class="side">
           <div class="card"><div class="thumb"></div><div class="t">Ten easy dinners for busy weeknights</div><div class="lines">${'<i></i>'.repeat(2)}</div></div>
           <div class="card"><div class="thumb"></div><div class="t">How to start a balcony garden</div><div class="lines">${'<i></i>'.repeat(2)}</div></div>
         </div>
       </div>
     </div>`
  );
});
