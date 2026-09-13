(function(){
  const ENDPOINT = window.WAY2FORM_ENDPOINT ||
    'https://way2form.com/api/forms/53850bd2-396d-41ba-bebd-c320ea2ce17f/submit';

  function createStatus(node){
    let s = node.querySelector('.contact-status') || node.querySelector('#form-status');
    if(!s){ s = document.createElement('p'); s.className='form-status contact-status'; s.setAttribute('aria-live','polite'); node.appendChild(s) }
    return s;
  }

  function showMessage(statusNode, text, ok=true){
    statusNode.textContent = text;
    statusNode.style.color = ok ? '' : '#b91c1c';
  }

  function send(data, retries=2){
    return fetch(ENDPOINT, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(r=>{
      if(!r.ok) throw new Error('submit failed');
      const type = r.headers.get('content-type') || '';
      if(type.includes('application/json')) return r.json();
      return {};
    }).catch(err=>{
      if(retries>0) return new Promise(res=>setTimeout(()=>res(send(data,retries-1)), 800));
      throw err;
    });
  }

  function initForm(form){
    if(!form) return;
    form.setAttribute('action', ENDPOINT);
    form.setAttribute('method', 'post');
    const status = createStatus(form);

    const hpName = '__hp';
    if(!form.querySelector(`[name="${hpName}"]`)){
      const hp = document.createElement('input');
      hp.type='text'; hp.name=hpName; hp.tabIndex='-1'; hp.autocomplete='off';
      hp.style.position='absolute'; hp.style.left='-9999px'; hp.setAttribute('aria-hidden','true');
      form.appendChild(hp);
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      status.textContent='Sending...';
      const hp = form.querySelector(`[name="${hpName}"]`);
      if(hp && hp.value){ showMessage(status,'Spam detected — submission rejected', false); return }

      if(form.checkValidity && form.checkValidity() === false){
        showMessage(status,'Please fill required fields and use a valid email.', false);
        return;
      }

      const data = new FormData(form);
      data.delete(hpName);
      data.append('source', window.location.href);

      send(data).then(()=>{
        showMessage(status,'Message sent — thank you!');
        form.reset();
      }).catch(()=>{
        showMessage(status,'Error sending message. Please try again later.', false);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('form.contact-form').forEach(initForm);
  });
})();
