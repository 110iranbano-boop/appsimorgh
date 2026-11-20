const $=s=>document.querySelector(s), $=s=>[...document.querySelectorAll(s)];
const API_BASE='https://nodejs-by53mz.chbkn.dev/api';
const API_TOKEN_KEY='simorgh_token';
function latinDigits(value){return String(value||'').replace(/[۰-۹٠-٩]/g,d=>'۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩'.indexOf(d)%10)}
async function apiRequest(path,body){
 const response=await fetch(API_BASE+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 let data={};try{data=await response.json()}catch(_){}
 if(!response.ok||data.success===false)throw new Error(data.message||data.error||'درخواست ناموفق بود. کد: '+response.status);
 return data;
}
const demo={name:localStorage.getItem('simorgh_name')||'مهمان سیمرغ',points:120,logged:localStorage.getItem('simorgh_logged')==='1',requests:[],posts:[
 {title:'کتابی که مسیر فکری‌تان را تغییر داد',body:'دوستان، دوست دارم درباره کتاب‌هایی گفت‌وگو کنیم که نگاه ما به زندگی را تغییر داده‌اند.',author:'نگار',comments:['برای من انسان در جست‌وجوی معنا بود.']},
 {title:'پیشنهاد برای نشست پنجشنبه',body:'چه موضوعی را برای دورهمی کتاب‌خوانی این هفته پیشنهاد می‌کنید؟',author:'علی',comments:[]}
],events:[{title:'دورهمی کتاب‌خوانی پنجشنبه',date:'پنجشنبه · ساعت ۱۷',kind:'weekly',capacity:0},{title:'کارگاه آشنایی با داستان‌نویسی',date:'جمعه · ساعت ۱۶',kind:'timed',capacity:20}]};
const books=[{name:'سمفونی مردگان',by:'عباس معروفی',type:'امانی',price:'',icon:'📕'},{name:'ملت عشق',by:'الیف شافاک',type:'امانی',icon:'📗'},{name:'هنر شفاف اندیشیدن',by:'رولف دوبلی',type:'فروشی',price:'۲۸۰٬۰۰۰ تومان',icon:'📘'},{name:'قصه‌های مجید',by:'هوشنگ مرادی کرمانی',type:'فروشی',price:'۱۹۰٬۰۰۰ تومان',icon:'📙'}];
const products=[{name:'آینه ویترای دست‌ساز',desc:'اثر هنری با الهام از رنگ و نقش ایرانی',price:'۱٬۲۰۰٬۰۰۰ تومان',icon:'🪞'},{name:'شمع دست‌ساز',desc:'ساخته‌شده در کارگاه هنری سیمرغ',price:'۱۸۰٬۰۰۰ تومان',icon:'🕯️'},{name:'تابلوی هنری',desc:'ترکیبی از هنر و هویت بومی',price:'۸۵۰٬۰۰۰ تومان',icon:'🖼️'},{name:'ظرف دکوراتیو گچی',desc:'طراحی و پرداخت دست‌ساز',price:'۳۲۰٬۰۰۰ تومان',icon:'🏺'}];
const drinks=[{name:'قهوه دمی',desc:'قهوه تازه‌دم با عطر دلنشین',price:'۹۵٬۰۰۰ تومان',icon:'☕'},{name:'لاته',desc:'اسپرسو و شیر گرم',price:'۱۱۰٬۰۰۰ تومان',icon:'🥛'},{name:'چای ایرانی',desc:'چای خوش‌عطر و تازه‌دم',price:'۵۵٬۰۰۰ تومان',icon:'🫖'},{name:'کیک روز',desc:'پیشنهاد روز کافه',price:'۸۰٬۰۰۰ تومان',icon:'🍰'}];
let page='home',filter='همه';
const categoryData={
 library:[['رمان و داستان','📚','داستان‌های ایرانی و جهان'],['شعر و ادبیات','📜','شعر، نثر و ادبیات'],['تاریخ و سیاست','🏛️','تاریخ و اندیشه سیاسی'],['روان‌شناسی','🧠','شناخت و رشد فردی'],['دین و اندیشه','✨','معارف و تفکر'],['کودک و نوجوان','🪁','کتاب‌های گروه سنی کودک و نوجوان'],['هنر و معماری','🎨','هنرهای تجسمی و معماری']],
 cafe:[['قهوه','☕','اسپرسو و قهوه‌های دمی'],['نوشیدنی گرم','🫖','چای و نوشیدنی‌های گرم'],['نوشیدنی سرد','🧋','نوشیدنی‌های خنک'],['دمنوش','🌿','دمنوش‌های گیاهی'],['کیک و شیرینی','🍰','شیرینی و کیک روز'],['صبحانه و میان‌وعده','🥐','خوراکی‌های سبک']],
 store:[['شمع و محصولات عطری','🕯️','شمع‌های دست‌ساز و محصولات عطری'],['آثار رزینی','💠','ساخته‌های هنری رزینی'],['آینه‌های ویترای','🪞','آینه‌های رنگی دست‌ساز'],['تابلو و آثار هنری','🖼️','آثار هنری و تابلو'],['محصولات گچی و دکوراتیو','🏺','وسایل دکوراتیو دست‌ساز'],['محصولات سفارشی','🎁','سفارش‌های اختصاصی']]
};
let selectedCategory='', selectedItem=null;

function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2300)}
function go(p){page=p;render();$$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===p));window.scrollTo(0,0)}
function card(x,cls=''){return '<article class="item-card"><div class="art '+cls+'">'+x.icon+'</div><div class="item-body"><strong>'+x.name+'</strong><p>'+(x.by||x.desc||'')+'</p><div class="item-foot"><span class="price">'+(x.price||x.type||'')+'</span><button class="btn small secondary" data-action="'+(x.type==='امانی'?'borrow':x.type==='فروشی'?'buy':'product')+'" data-name="'+x.name+'">جزئیات</button></div></div></article>'}
function head(title,sub){return '<h1 class="page-title">'+title+'</h1><p class="page-sub">'+sub+'</p>'}
function categoryLanding(section,title,sub){const cats=categoryData[section]||[];return head(title,sub)+'<div class="category-grid">'+cats.map((c,i)=>'<button class="category-card cat-'+section+'" data-action="open-category" data-section="'+section+'" data-cat="'+i+'"><span class="category-art">'+c[1]+'</span><strong>'+c[0]+'</strong><small>'+c[2]+'</small><span class="category-arrow">←</span></button>').join('')+'</div>'}
function categoryListing(section,index){const c=categoryData[section][index];const source=section==='library'?books:section==='cafe'?drinks:products;const items=source.filter(x=>{const t=(x.name+' '+(x.by||'')+' '+(x.desc||'')).toLowerCase();if(section==='library')return index===0||index===1||index===2||index===3||index===4||index===5||index===6; if(section==='cafe')return index===0?t.includes('قهوه')||t.includes('لاته'):index===1?t.includes('چای'):index===2?false:index===3?false:index===4?t.includes('کیک'):true;return index===0?t.includes('شمع'):index===1?t.includes('رزین'):index===2?t.includes('آینه'):index===3?t.includes('تابلو'):index===4?t.includes('گچی'):true});const shown=items.length?items:source;return '<button class="back-link" data-action="back-categories" data-section="'+section+'">→ بازگشت به دسته‌بندی‌ها</button>'+head(c[0],c[2])+'<div class="cards">'+shown.map((x,i)=>'<button class="item-card item-button" data-action="open-detail" data-section="'+section+'" data-item="'+source.indexOf(x)+'"><div class="art '+(section==='library'?'book':section==='cafe'?'cafe':'')+'">'+x.icon+'</div><div class="item-body"><strong>'+x.name+'</strong><p>'+(x.by||x.desc||'')+'</p><div class="item-foot"><span class="price">'+(x.price||x.type||'')+'</span><span class="detail-hint">مشاهده ←</span></div></div></button>').join('')+'</div>'}
function detailPage(section,index){const x=(section==='library'?books:section==='cafe'?drinks:products)[index];const action=section==='library'?(x.type==='امانی'?'borrow':'buy'):section==='cafe'?'product':'product';return '<button class="back-link" data-action="back-categories" data-section="'+section+'">→ بازگشت به دسته‌بندی‌ها</button><div class="detail-card"><div class="detail-art">'+x.icon+'</div><div class="detail-content"><span class="eyebrow">'+(section==='library'?'کتابخانه سیمرغ':section==='cafe'?'کافه سیمرغ':'فروشگاه سیمرغ')+'</span><h1>'+x.name+'</h1><p>'+(x.by||x.desc||'')+'</p><strong class="price">'+(x.price||x.type||'')+'</strong><p class="muted">اطلاعات تکمیلی این مورد در نسخه متصل از پنل مدیریت بارگذاری خواهد شد.</p><button class="btn gold" data-action="'+action+'" data-name="'+x.name+'">'+(section==='library'?(x.type==='امانی'?'درخواست امانت':'درخواست خرید'):section==='cafe'?'درخواست این محصول':'درخواست خرید حضوری')+'</button></div></div>'}
function home(){return '<section class="hero"><span class="eyebrow">خانه فرهنگ و اندیشه</span><h1>به جهان سیمرغ<br>خوش آمدید</h1><p>اینجا کتاب‌ها خوانده می‌شوند، اندیشه‌ها جان می‌گیرند و دوستی‌ها شکل می‌گیرند.</p><button class="btn gold" data-page="events">رویدادهای پیش‌رو</button></section><div class="section-head"><h2>دروازه‌های سیمرغ</h2><span class="muted">یک جهان، چند مسیر</span></div><section class="portal-wrap"><div class="portal-ring"><button class="portal-item portal-library" data-page="library"><span>▤</span><b>کتابخانه</b></button><button class="portal-item portal-cafe" data-page="cafe"><span>☕</span><b>کافه</b></button><button class="portal-item portal-events" data-page="events"><span>✦</span><b>رویدادها</b></button><button class="portal-item portal-store" data-page="store"><span>◇</span><b>فروشگاه</b></button><button class="portal-item portal-forum" data-page="forum"><span>☷</span><b>تالار</b></button><button class="portal-item portal-profile" data-page="profile"><span>♙</span><b>عضویت</b></button><div class="portal-center"><div class="phoenix-seal"><span>س</span><small>سیمرغ</small></div></div></div></section><div class="feature-banner"><div class="seal">✧</div><div><strong>به جمع اهالی سیمرغ بپیوندید</strong><p>کتاب بخوانید، در رویدادها شرکت کنید و از آثار هنری دیدن کنید.</p></div></div>'}
function library(){return categoryLanding('library','کتابخانه سیمرغ','ابتدا موضوع مورد علاقه‌ات را انتخاب کن؛ سپس کتاب‌های همان دسته را ببین.')}
function store(){return categoryLanding('store','فروشگاه سیمرغ','دسته آثار هنری را انتخاب کن و ساخته‌های هنرمندان سیمرغ را ببین.')}
function cafe(){return categoryLanding('cafe','کافه سیمرغ','برای دیدن منو، یکی از دسته‌بندی‌های خوراکی و نوشیدنی را انتخاب کن.')}
function events(){return head('رویدادهای سیمرغ','نشست‌ها، دورهمی‌ها و کارگاه‌های فرهنگی مجموعه.')+'<div class="list">'+demo.events.map((e,i)=>'<div class="list-row"><div class="list-icon">✦</div><div class="grow"><strong>'+e.title+'</strong><p>'+e.date+' · '+(e.kind==='weekly'?'رویداد هفتگی':'ثبت‌نام زمان‌دار')+'</p></div>'+(e.kind==='timed'?'<button class="btn small" data-action="event" data-index="'+i+'">ثبت‌نام</button>':'<span class="event-date">اطلاع‌رسانی</span>')+'</div>').join('')+'</div><div class="notice">ظرفیت رویدادهای زمان‌دار محدود است. قوانین و امتیاز هر برنامه پیش از ثبت‌نام نمایش داده می‌شود.</div>'}
function store(){return head('فروشگاه سیمرغ','آثار هنری و دست‌ساز هنرمندان سیمرغ را ببینید و برای خرید حضوری درخواست ثبت کنید.')+'<div class="cards">'+products.map(p=>card(p)).join('')+'</div>'}
function cafe(){return head('کافه سیمرغ','منوی نوشیدنی‌ها و خوراکی‌های کافه‌کتاب.')+'<div class="cards">'+drinks.map(p=>card(p,'cafe')).join('')+'</div><div class="notice">این نسخه برای معرفی منو است؛ سفارش و پرداخت آنلاین در آن فعال نیست.</div>'}
function profile(){return '<div class="profile-card"><div class="avatar">'+demo.name.slice(0,1)+'</div><span class="eyebrow">کارت عضویت دیجیتال</span><h2>'+demo.name+'</h2><p>اهالی کافه‌کتاب سیمرغ</p><span class="membership">عضو همراه سیمرغ</span></div><div class="stats"><div class="stat"><b>'+demo.points+'</b><small>امتیاز</small></div><div class="stat"><b>'+demo.requests.length+'</b><small>درخواست‌ها</small></div><div class="stat"><b>'+demo.events.length+'</b><small>رویدادها</small></div></div><div class="panel"><h3>اطلاعات حساب</h3><p class="muted">نام نمایشی: '+demo.name+'<br>وضعیت حساب: '+(demo.logged?'واردشده':'حالت نمایشی')+'</p><button class="btn secondary" data-action="editprofile">ویرایش پروفایل</button> <button class="btn" data-action="login">'+(demo.logged?'تغییر حساب':'ورود / ثبت‌نام')+'</button></div><div class="panel"><h3>درخواست‌های من</h3>'+(demo.requests.length?demo.requests.map(r=>'<p class="muted">• '+r+'</p>').join(''):'<p class="muted">هنوز درخواستی ثبت نشده است.</p>')+'</div><button class="btn secondary" data-page="admin">ورود به پنل مدیریت آزمایشی</button>'}
function forum(){return head('تالار سیمرغ','گفت‌وگو، پرسش و تبادل تجربه میان اعضای مجموعه.')+'<button class="btn" data-action="newpost">＋ ایجاد تاپیک آزمایشی</button><div style="height:14px"></div>'+demo.posts.map((p,i)=>'<article class="post"><div class="post-meta">'+p.author+' · گفت‌وگوی اعضا</div><h3>'+p.title+'</h3><p>'+p.body+'</p><div class="comment">'+p.comments.length+' پاسخ · '+(p.comments.join(' / ')||'هنوز پاسخی ثبت نشده')+'</div><button class="btn small secondary" style="margin-top:10px" data-action="reply" data-index="'+i+'">پاسخ به گفت‌وگو</button></article>').join('')}
function admin(){return head('پنل مدیریت','نمای آزمایشی ساختار مدیریت بخش‌های اپلیکیشن. دسترسی واقعی پس از اتصال سرور کنترل می‌شود.')+'<div class="notice">این پنل در حال حاضر نمایشی است؛ هیچ مجوز مدیریتی یا عملیات پایگاه داده‌ای در سمت سرور فعال نیست.</div><div class="admin-grid">'+[['☕','مدیریت کافه','دسته‌ها و محصولات'],['▤','مدیریت کتابخانه','کتاب و امانت'],['✦','مدیریت رویدادها','ظرفیت و حضور'],['◇','مدیریت فروشگاه','موضوعات و محصولات'],['♙','مدیریت کاربران','نقش‌ها و مجوزها'],['☷','مدیریت تالار','تاپیک و نظرات']].map(x=>'<button class="admin-tile" data-action="adminitem"><span>'+x[0]+'</span><b>'+x[1]+'</b><small>'+x[2]+'</small></button>').join('')+'</div>'}
function render(){let pages={home,library,events,store,cafe,profile,forum,admin};let html=(pages[page]||home)();if(page==='category')html=categoryListing(selectedCategory,Number(selectedItem));if(page==='detail')html=detailPage(selectedCategory,Number(selectedItem));$('#view').innerHTML=html;$('#headerName').textContent=demo.name}
function modal(title,body){$('#modalRoot').innerHTML='<div class="modal-backdrop" id="backdrop"><section class="modal"><h2>'+title+'</h2>'+body+'<div class="modal-actions"><button class="btn secondary" data-action="close">بستن</button></div></section></div>'}
function submitRequest(label){demo.requests.push(label);toast('درخواست در حالت نمایشی ثبت شد');$('#modalRoot').innerHTML='';render()}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.page){$('#modalRoot').innerHTML='';go(b.dataset.page);return}if(b.dataset.filter){filter=b.dataset.filter;render();return}const a=b.dataset.action;if(!a)return;
if(a==='open-category'){selectedCategory=b.dataset.section;selectedItem=b.dataset.cat;page='category';render();window.scrollTo(0,0);return}
if(a==='open-detail'){selectedCategory=b.dataset.section;selectedItem=b.dataset.item;page='detail';render();window.scrollTo(0,0);return}
if(a==='back-categories'){selectedCategory=b.dataset.section;page=selectedCategory;render();window.scrollTo(0,0);return}
if(a==='close'){$('#modalRoot').innerHTML='';return}
if(a==='borrow'||a==='buy'||a==='product'){const name=b.dataset.name;modal('جزئیات: '+name,'<p class="muted">برای این مورد می‌توان درخواست خود را ثبت کرد. در نسخه متصل، درخواست در سرور چابکان ذخیره و توسط مدیر بررسی می‌شود.</p><button class="btn" id="confirmReq">ثبت درخواست</button>');$('#confirmReq').onclick=()=>submitRequest((a==='borrow'?'درخواست امانت: ':a==='buy'?'درخواست خرید: ':'مشاهده محصول: ')+name);return}
if(a==='suggest'){modal('پیشنهاد یا تهیه کتاب','<form class="form" id="reqForm"><div class="field"><label>نام کتاب</label><input required id="reqName" placeholder="عنوان کتاب"></div><div class="field"><label>توضیحات</label><textarea id="reqDesc" placeholder="نام نویسنده یا توضیحات تکمیلی"></textarea></div><button class="btn">ثبت درخواست</button></form>');$('#reqForm').onsubmit=ev=>{ev.preventDefault();submitRequest('پیشنهاد کتاب: '+$('#reqName').value)};return}
if(a==='event'){const ev=demo.events[Number(b.dataset.index)];modal('ثبت‌نام رویداد','<p class="muted">'+ev.title+'<br>'+ev.date+'<br>امتیاز و قوانین نهایی پس از اتصال سامانه از سرور دریافت می‌شوند.</p><form class="form" id="eventForm"><div class="field"><label>نام و نام خانوادگی</label><input required placeholder="نام کامل"></div><div class="field"><label>شماره تماس</label><input required inputmode="tel" placeholder="شماره تماس"></div><button class="btn">ثبت‌نام آزمایشی</button></form>');$('#eventForm').onsubmit=ev2=>{ev2.preventDefault();submitRequest('ثبت‌نام رویداد: '+ev.title)};return}
if(a==='login'){
 const authForm=(mode='login')=>{
  const registering=mode==='register';
  modal(registering?'ثبت‌نام عضویت سیمرغ':'ورود به حساب کاربری',
   '<form class="form" id="authForm">'+
   (registering?'<div class="field"><label>نام و نام خانوادگی</label><input id="fullName" required minlength="2" autocomplete="name" placeholder="نام کامل"></div>':'')+
   '<div class="field"><label>شماره تماس</label><input id="authPhone" required inputmode="tel" autocomplete="tel" placeholder="09xxxxxxxxx"></div>'+
   '<div class="field"><label>رمز عبور</label><input id="authPass" required type="password" minlength="8" autocomplete="'+(registering?'new-password':'current-password')+'" placeholder="حداقل ۸ کاراکتر"></div>'+
   '<button class="btn" id="authSubmit">'+(registering?'ایجاد حساب':'ورود')+'</button></form>'+
   '<p class="muted" id="authMessage">'+(registering?'با ثبت‌نام، حساب کاربری شما در سرور سیمرغ ایجاد می‌شود.':'برای ورود، شماره تماس و رمز عبور ثبت‌شده را وارد کنید.')+'</p>'+
   '<button class="btn secondary" id="authSwitch">'+(registering?'قبلاً حساب دارم؛ ورود':'حساب ندارم؛ ثبت‌نام')+'</button>');
  $('#authSwitch').onclick=()=>authForm(registering?'login':'register');
  $('#authForm').onsubmit=async ev=>{
   ev.preventDefault();
   const phone=latinDigits($('#authPhone').value).trim();
   const password=$('#authPass').value;
   const submit=$('#authSubmit'),message=$('#authMessage');
   submit.disabled=true;submit.textContent='در حال ارتباط با سرور...';
   try{
    if(registering){
     const full_name=$('#fullName').value.trim();
     await apiRequest('/register',{full_name,username:phone,password});
     message.textContent='ثبت‌نام با موفقیت انجام شد. اکنون با شماره تماس و رمز عبور وارد شوید.';
     toast('حساب کاربری ایجاد شد');
     authForm('login');
    }else{
     const data=await apiRequest('/login',{username:phone,password});
     const token=data.token||(data.data&&data.data.token);
     if(!token)throw new Error('ورود از سرور پاسخ گرفت، اما توکن احراز هویت دریافت نشد.');
     const user=data.user||(data.data&&data.data.user)||{};
     const displayName=user.full_name||user.name||user.username||phone;
     localStorage.setItem(API_TOKEN_KEY,token);
     localStorage.setItem('simorgh_name',displayName);
     localStorage.setItem('simorgh_logged','1');
     demo.name=displayName;demo.logged=true;
     $('#modalRoot').innerHTML='';render();toast('ورود موفقیت‌آمیز بود');
    }
   }catch(error){
    message.textContent=error.message||'ارتباط با سرور برقرار نشد.';
    submit.disabled=false;submit.textContent=registering?'ایجاد حساب':'ورود';
   }
  };
 };
 authForm('login');return
}
if(a==='editprofile'){modal('ویرایش نام نمایشی','<form id="profileForm" class="form"><div class="field"><label>نام نمایشی</label><input id="newName" required value="'+demo.name+'"></div><button class="btn">ذخیره</button></form>');$('#profileForm').onsubmit=ev=>{ev.preventDefault();demo.name=$('#newName').value;localStorage.setItem('simorgh_name',demo.name);$('#modalRoot').innerHTML='';render()};return}
if(a==='newpost'){modal('ایجاد تاپیک','<form class="form" id="postForm"><div class="field"><label>عنوان</label><input id="postTitle" required></div><div class="field"><label>متن</label><textarea id="postBody" required></textarea></div><button class="btn">انتشار آزمایشی</button></form>');$('#postForm').onsubmit=ev=>{ev.preventDefault();demo.posts.unshift({title:$('#postTitle').value,body:$('#postBody').value,author:demo.name,comments:[]});$('#modalRoot').innerHTML='';render();toast('تاپیک نمایشی افزوده شد')};return}
if(a==='reply'){const i=Number(b.dataset.index);modal('پاسخ به گفت‌وگو','<form class="form" id="replyForm"><div class="field"><label>متن پاسخ</label><textarea id="replyText" required></textarea></div><button class="btn">ارسال پاسخ</button></form>');$('#replyForm').onsubmit=ev=>{ev.preventDefault();demo.posts[i].comments.push($('#replyText').value);$('#modalRoot').innerHTML='';render()};return}
if(a==='adminitem'){toast('مدیریت این بخش پس از اتصال سرور فعال می‌شود');return}
});
$('#menuBtn').addEventListener('click',()=>modal('بخش‌های اپلیکیشن','<div class="list">'+[['home','خانه'],['cafe','کافه و منو'],['library','کتابخانه'],['events','رویدادها'],['store','فروشگاه سیمرغ'],['profile','حساب کاربری'],['forum','تالار سیمرغ'],['admin','پنل مدیریت']].map(x=>'<button class="list-row" data-page="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>'));
render();