(function(){
  const ENDPOINT = window.WAY2FORM_ENDPOINT ||
    'https://way2form.com/api/forms/53850bd2-396d-41ba-bebd-c320ea2ce17f/submit';

  function createStatus(node){
    let s = node.querySelector('#form-status') || node.querySelector('.contact-status');
    if(!s){ s = document.createElement('p'); s.className='form-status contact-status'; s.setAttribute('aria-live','polite'); node.appendChild(s) }
    return s;
  }

  function showMessage(statusNode, text, ok=true){
    statusNode.textContent = text;
    statusNode.style.color = ok ? '' : '#b91c1c';
  }

  function fieldsFrom(form){
    const data = new URLSearchParams();
    data.set('name', (form.elements.name && form.elements.name.value || '').trim());
    data.set('email', (form.elements.email && form.elements.email.value || '').trim());
    data.set('message', (form.elements.message && form.elements.message.value || '').trim());
    return data;
  }

  function send(data){
    return fetch(ENDPOINT, {
      method: 'POST',
      body: data.toString(),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(async r=>{
      const text = await r.text();
      let json = null;
      try { json = text ? JSON.parse(text) : null; } catch { json = null; }
      if(!r.ok){
        const msg = (json && (json.error || json.message)) || 'submit failed';
        throw new Error(msg);
      }
      return json || {};
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

      send(fieldsFrom(form)).then(()=>{
        showMessage(status,'Message sent — thank you!');
        form.reset();
      }).catch(err=>{
        console.error('Way2Form submit failed', err);
        showMessage(status,'Error sending message. Please try again later.', false);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('form.contact-form').forEach(initForm);
  });
})();
