const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

function syncFilled(el){
  const group = el.closest('.input');
  if(!group) return;
  if(el.type === 'checkbox') return;
  if(el.value && el.value.trim() !== '') group.classList.add('filled'); else group.classList.remove('filled');
}
$$('input, select').forEach(i=>{
  i.addEventListener('input', (e)=> syncFilled(e.target));
  i.addEventListener('blur', (e)=> syncFilled(e.target));
  syncFilled(i);
});

function showError(el, msg){
  el.classList.add('shake');
  setTimeout(()=>el.classList.remove('shake'), 600);
  const help = $('#formHelp');
  help.textContent = msg;
  help.style.color = 'var(--accent)';
}
function clearHelp(){
  const help = $('#formHelp');
  help.textContent = "We'll never share your information.";
  help.style.color = '';
}

function validateForm(data){
  if(!data.name) return ['#grp-name', 'Please enter your name'];
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRe.test(data.email)) return ['#grp-email', 'Please enter a valid email'];
  const phoneRe = /^\d{10,15}$/;
  if(!phoneRe.test(data.phone)) return ['#grp-phone', 'Please enter a valid phone number (10-15 digits)'];
  if(!data.age || data.age < 10) return ['#grp-age','Please enter a valid age'];
  if(!data.membership) return ['#grp-membership','Please choose a membership'];
  if(!data.password || data.password.length < 6) return ['#grp-password','Password must be at least 6 characters'];
  if(data.password !== data.confirm) return ['#grp-confirm','Passwords do not match'];
  if(!data.terms) return ['#grp-terms','You must accept terms to continue'];
  return null;
}

const form = $('#regForm');
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  clearHelp();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  data.terms = formData.has('terms');
  data.age = data.age ? Number(data.age) : null;

  const err = validateForm(data);
  if(err){
    const [selector, message] = err;
    const el = document.querySelector(selector);
    showError(el, message);
    const input = el.querySelector('input, select'); if(input) input.focus();
    return;
  }

  const btn = $('#submitBtn');
  btn.disabled = true; btn.textContent = 'Creating...';

  setTimeout(()=>{
    try{ localStorage.setItem('gym_registration', JSON.stringify(data)); }catch(_){};
    const s = $('#successBox'); s.classList.add('show');
    btn.textContent = 'Done';
    form.reset();
    $$('input, select').forEach(i=>syncFilled(i));
    setTimeout(()=>{
      btn.disabled = false; btn.textContent = 'Create account';
      s.classList.remove('show');
      clearHelp();
    }, 2200);
  }, 800);
});

$('#resetBtn').addEventListener('click', ()=>{
  form.reset(); clearHelp(); $$('input, select').forEach(i=>syncFilled(i));
});

$$('#name, #email, #phone, #age, #password, #confirm').forEach(i=>{
  i.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') form.requestSubmit(); })
});