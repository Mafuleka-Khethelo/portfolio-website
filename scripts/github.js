(function(){
  const DEFAULT_USER = 'Mafuleka-Khethelo';
  const user = (window.GITHUB_USERNAME || DEFAULT_USER).trim();
  const container = document.getElementById('repos');
  const skillsNode = document.getElementById('inferred-skills');
  if(!user) return;
  if(!container && !skillsNode) return;

  const isStatic = !!(container && container.getAttribute('data-static') === 'true');
  const api = `https://api.github.com/users/${user}/repos?per_page=100&sort=updated`;

  fetch(api).then(r=>{
    if(!r.ok) throw new Error('GitHub API error');
    return r.json();
  }).then(repos=>{
    if(container && !isStatic) container.innerHTML = '';
    const inferred = {};
    const keywords = [
      ['react', 'React'], ['next', 'Next.js'], ['vue', 'Vue'], ['angular', 'Angular'],
      ['node', 'Node.js'], ['express', 'Express'], ['django', 'Django'], ['flask', 'Flask'],
      ['python', 'Python'], ['typescript', 'TypeScript'], ['tailwind', 'Tailwind CSS'],
      ['kotlin', 'Kotlin'], ['android', 'Android'], ['java', 'Java'],
      ['css', 'CSS'], ['html', 'HTML'], ['cli', 'CLI'], ['rust', 'Rust'], ['go', 'Go']
    ];

    function bump(skill){ inferred[skill] = (inferred[skill]||0)+1 }

    repos.forEach(repo=>{
      if(container){
        const existing = container.querySelectorAll(`[data-repo*="${repo.name}"]`);
        if(existing && existing.length>0){
          existing.forEach(node=>{
            node.setAttribute('data-stars', repo.stargazers_count || 0);
            node.setAttribute('data-updated', repo.updated_at || '');
            const stars = node.querySelector('.stars');
            const updated = node.querySelector('.updated');
            if(stars) stars.textContent = repo.stargazers_count || 0;
            if(updated) updated.textContent = new Date(repo.updated_at).toLocaleDateString();
            if(!node.querySelector('.repo-meta')){
              const meta = document.createElement('div');
              meta.className = 'repo-meta';
              meta.innerHTML = `⭐ <span class="stars">${repo.stargazers_count||0}</span> • <span class="updated">${new Date(repo.updated_at).toLocaleDateString()}</span>`;
              node.appendChild(meta);
            }
          });
        } else if(!isStatic){
          const card = document.createElement('article');
          card.className = 'project-card';
          const title = document.createElement('h4'); title.textContent = repo.name;
          const desc = document.createElement('p'); desc.textContent = repo.description || 'No description';
          const a = document.createElement('a'); a.className='button'; a.href = repo.html_url; a.target='_blank'; a.rel='noopener'; a.textContent = 'View repo';
          const meta = document.createElement('div'); meta.className='repo-meta'; meta.innerHTML = `⭐ <span class="stars">${repo.stargazers_count||0}</span> • <span class="updated">${new Date(repo.updated_at).toLocaleDateString()}</span>`;
          card.appendChild(title); card.appendChild(desc); card.appendChild(meta); card.appendChild(a);
          container.appendChild(card);
        }
      }

      if(repo.language) bump(repo.language);
      const hay = (repo.name + ' ' + (repo.description||'')).toLowerCase();
      keywords.forEach(([k,label])=>{
        if(new RegExp('\\b' + k.replace('.', '\\.') + '\\b').test(hay)) bump(label);
      });
    });

    if(skillsNode){
      const list = Object.keys(inferred).map(k=>({name:k,count:inferred[k]})).sort((a,b)=>b.count-a.count);
      if(list.length===0){
        skillsNode.textContent = 'No public repositories detected or unable to infer skills.';
      } else {
        skillsNode.innerHTML = '';
        list.slice(0, 12).forEach(s=>{
          const span = document.createElement('span');
          span.className = 'skill-badge';
          span.textContent = `${s.name} (${s.count})`;
          skillsNode.appendChild(span);
        });
      }
    }
  }).catch(err=>{
    console.error(err);
    if(skillsNode && !skillsNode.textContent.trim()){
      skillsNode.textContent = 'Could not load GitHub repositories right now.';
    }
  });
})();
