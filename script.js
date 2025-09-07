(() => {
  const stage = document.getElementById('stage');
  const startBtn = document.getElementById('start');

  const MEMES = [
    { q: '“Do you live alone?” — Sean', sub: 'Answer honestly. Sean is invested.', type: 'choices', choices: ['Yes','No','Only on Tuesdays','What is “alone”?'] },
    { q: '“Is Krispy Kreme crispy?” — The Krispy Kreme lady', sub: 'Spell it however your soul desires.', type: 'choices', choices: ['Crispy','Krispy','Crispee','Krisis Creem'] },
    { q: 'How often do you think about the Roman Empire?', sub: 'Be brave.', type: 'choices', choices: ['Hourly','Daily','Weekly','Never (liar)'] },
    { q: 'Is it cake?', sub: 'No knives provided.', type: 'choices', choices: ['It is cake','It is NOT cake','It is croissant','I have trust issues'] },
    { q: '“I love corn!” — Corn Kid', sub: 'Rate your corn enthusiasm.', type: 'range', min:0, max:10, step:1 },
    { q: 'Doors vs Wheels?', sub: 'Choose violence.', type: 'choices', choices: ['Doors','Wheels','Windows','I am a garage'] },
    { q: 'Skibidi or Ohio?', sub: 'There is no correct answer.', type: 'choices', choices: ['Skibidi','Ohio','Sigma','Huh?'] },
    { q: 'What’s your rizz level?', sub: 'Be realistic (or not).', type: 'range', min:0, max:100, step:5 },
    { q: 'What color is the dress?', sub: '2015 called.', type: 'choices', choices: ['Blue & Black','White & Gold','Green & Greener','It’s a trap'] },
    { q: '“Negroni… sbagliato… with Prosecco in it.”', sub: 'Would you order it?', type: 'choices', choices: ['Yum','No thanks','Only ironically','What are words'] },
    { q: 'Is water wet?', sub: 'Philosophy major required.', type: 'textarea', placeholder: 'State your thesis in 2–3 outrageous sentences.' },
    { q: 'Do you identify as a “Girl Dinner” enjoyer?', sub: 'A plate of vibes.', type: 'choices', choices: ['Absolutely','Sometimes','No, Chef','I eat drywall'] },
    { q: '“Do you have games on your phone?”', sub: 'Asking for a tiny cousin.', type: 'choices', choices: ['Yes','No','Only Snake','Phone died (again)'] }
  ];

  const rand = (min,max)=>Math.random()*(max-min)+min;
  const pick = (arr,n=1)=>{ const c=[...arr]; const out=[]; while(out.length<n && c.length){ out.push(c.splice(Math.floor(Math.random()*c.length),1)[0]); } return out; };

  let serial = 0;
  function spawnPopup(seedIndex=null, cascadeCount=0){
    const el=document.createElement('div');
    el.className='popup';
    el.style.left=`${rand(6,68)}vw`; el.style.top=`${rand(6,68)}vh`; el.style.rotate=`${rand(-2,2)}deg`; el.style.zIndex=String(100+ ++serial);
    const meme = seedIndex!==null ? MEMES[seedIndex] : MEMES[Math.floor(Math.random()*MEMES.length)];
    el.innerHTML = `
      <header>
        <div class="dot"></div>
        <div class="titlebar">Totally Official Form #${serial}</div>
        <div class="float">Progress: <b>${Math.floor(rand(1,99))}%</b></div>
        <button class="min" title="Minimize (lol)" disabled>–</button>
        <button class="x" title="Close">✕</button>
      </header>
      <form autocomplete="off">
        <div class="q">${meme.q}</div>
        <div class="sub">${meme.sub ?? ''}</div>
        <div class="fields"></div>
        <div class="error">Oops! You answered incorrectly. Try a different vibe.</div>
        <div class="row actions">
          <button type="submit" class="submit">Submit</button>
          <button type="button" class="ghost">Save & Quit</button>
        </div>
        <div class="progress"><div class="bar"></div></div>
      </form>`;

    const fields = el.querySelector('.fields');
    switch(meme.type){
      case 'choices':
        fields.innerHTML = `<select class="field" required><option value="">— choose wisely —</option>${meme.choices.map(c=>`<option>${c}</option>`).join('')}</select>`; break;
      case 'textarea':
        fields.innerHTML = `<textarea class="field" rows="3" required placeholder="${meme.placeholder ?? 'Write an essay that changes nothing.'}"></textarea>`; break;
      case 'range':
        fields.innerHTML = `<input class="field" type="range" min="${meme.min}" max="${meme.max}" step="${meme.step}" value="${meme.min}"><div class="sub">Value: <span class="val">${meme.min}</span></div>`; break;
      default:
        fields.innerHTML = `<input class="field" required placeholder="Type something, anything">`;
    }
    const range = fields.querySelector('input[type="range"]');
    if(range) range.addEventListener('input', e=>{ fields.querySelector('.val').textContent = e.target.value; });

    let drag=null;
    const header = el.querySelector('header');
    header.addEventListener('mousedown', (e)=>{
      drag={ x: e.clientX - el.offsetLeft, y: e.clientY - el.offsetTop };
      el.classList.add('dragging');
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp, { once:true });
    });
    const onMove = (e)=>{
      if(!drag) return;
      el.style.left = Math.min(window.innerWidth-120, Math.max(10, e.clientX - drag.x)) + 'px';
      el.style.top  = Math.min(window.innerHeight-80, Math.max(10, e.clientY - drag.y)) + 'px';
    };
    const onUp = ()=>{
      el.classList.remove('dragging'); document.removeEventListener('mousemove', onMove); drag=null;
    };

    const closeBtn = el.querySelector('.x');
    closeBtn.addEventListener('click', ()=>{
      if(Math.random()<0.5){
        const err = el.querySelector('.error');
        err.textContent = 'Error: Window refuses to be closed at this time.';
        err.style.display = 'block';
        cascade(el, 2, true);
      } else {
        el.remove();
        if(Math.random()<0.7) spawnPopup();
      }
    });

    let attempts=0;
    el.querySelector('form').addEventListener('submit', (e)=>{
      e.preventDefault(); attempts++; const err=el.querySelector('.error');
      if(attempts<2){
        err.style.display='block'; err.textContent='Incorrect vibe detected. Please select a sillier answer.';
        cascade(el, 3 + Math.floor(rand(0,2)));
      } else {
        err.style.display='none';
        el.querySelector('.titlebar').textContent='Submitting… forever';
        el.querySelector('.bar').style.animationDuration = (2 + Math.random()*8) + 's';
        setTimeout(()=>cascade(el,4),300);
      }
    });

    stage.appendChild(el);

    function cascade(anchorEl, howMany=3, jitterClose=false){
      const ids = pick([...Array(MEMES.length).keys()], Math.min(howMany, MEMES.length));
      ids.forEach((idx,i)=>{
        const p = spawnPopup(idx, (cascadeCount||0) + 1);
        const dx=(i+1)*rand(-40,40); const dy=(i+1)*rand(-30,50);
        p.style.left = Math.min(window.innerWidth-160, Math.max(10, anchorEl.offsetLeft + dx)) + 'px';
        p.style.top  = Math.min(window.innerHeight-120, Math.max(10, anchorEl.offsetTop + dy)) + 'px';
        if(jitterClose){
          const x=p.querySelector('.x');
          x.addEventListener('mouseenter', ()=>{
            p.style.left = Math.min(window.innerWidth-160, Math.max(10, p.offsetLeft + rand(-80,80))) + 'px';
            p.style.top  = Math.min(window.innerHeight-120, Math.max(10, p.offsetTop + rand(-60,60))) + 'px';
          });
        }
      });
    }
    return el;
  }

  startBtn.addEventListener('click', ()=>{
    startBtn.disabled=true; startBtn.textContent='Loading 1 (of possibly infinite)…';
    for(let i=0;i<3;i++) setTimeout(()=>spawnPopup(), 120*i);
    setInterval(()=>{
      if(document.querySelectorAll('.popup').length < 12) spawnPopup();
    }, 3500);
  });
})();