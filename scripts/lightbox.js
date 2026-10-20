document.addEventListener('DOMContentLoaded', function(){
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `
    <div class="lightbox-inner">
      <img class="lightbox-img" src="" alt="preview">
      <div class="lightbox-caption"></div>
      <div class="lightbox-links"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const imgNode = overlay.querySelector('.lightbox-img');
  const captionNode = overlay.querySelector('.lightbox-caption');
  const linksNode = overlay.querySelector('.lightbox-links');

  function open(src, caption, links){
    imgNode.src = src;
    imgNode.alt = caption || 'Project preview';
    captionNode.textContent = caption || '';
    linksNode.innerHTML = '';
    if(links){
      links.forEach(l=>{
        const a = document.createElement('a');
        a.href = l.href; a.target = '_blank'; a.rel = 'noopener'; a.textContent = l.text;
        linksNode.appendChild(a);
      });
    }
    overlay.classList.add('open');
    document.body.classList.add('lightbox-open');
    overlay.tabIndex = -1;
    overlay.focus();
  }

  function close(){
    overlay.classList.remove('open');
    document.body.classList.remove('lightbox-open');
    if(window.__lastActiveElement) try{ window.__lastActiveElement.focus(); }catch(e){}
  }

  overlay.addEventListener('click', function(e){
    if(e.target === overlay) close();
  });

  document.querySelectorAll('.project-thumb, .zoom-img').forEach(img=>{
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function(e){
      
      const path = e.composedPath ? e.composedPath() : (e.path || []);
      for(const node of path){
        if(node && node.classList && node.classList.contains && node.classList.contains('overlay-links')) return;
      }
      const src = img.src;
      const caption = img.getAttribute('data-caption') || img.alt || '';
      const repo = img.getAttribute('data-repo') || null;
      const live = img.getAttribute('data-live') || null;
      const links = [];
      if(live) links.push({ href: live, text: 'Live site' });
      if(repo) links.push({ href: repo, text: 'Repository' });
      
      window.__lastActiveElement = document.activeElement;
      open(src, caption, links);
    });
  });

  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
});
