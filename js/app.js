document.addEventListener("DOMContentLoaded", () => {

const $=id=>document.getElementById(id);
let selectedFile=null;

const setTheme=(dark,save=true)=>{
 document.body.classList.toggle("dark",dark);
 if(save) localStorage.setItem("class-notes-theme",dark?"dark":"light");
};
const toggleTheme=()=>setTheme(!document.body.classList.contains("dark"));
const savedTheme=localStorage.getItem("class-notes-theme");
if(savedTheme==="dark") setTheme(true,false);
$("sunHotspot").onclick=toggleTheme;
$("themeToggle").onclick=toggleTheme;
$('drop').onclick=()=>$('file').click();
$('file').onchange=()=>{
 selectedFile=$('file').files[0];
 $('fileName').textContent=selectedFile?`فایل انتخاب‌شده: ${selectedFile.name}`:'';
 const p=$('preview');
 if(selectedFile && selectedFile.type.startsWith('image/')){
   p.src=URL.createObjectURL(selectedFile);p.style.display='block';
 }else{p.style.display='none';p.removeAttribute('src')}
};

function buildPrompt(){
 const subject=$('subject').value.trim()||'[نام درس وارد نشده]';
 const session=$('session').value.trim()||'[شماره جلسه وارد نشده]';
 const type=$('type').value;
 const raw=$('raw').value; // exact raw text: no trim, no normalization, no character changes
 const fileInfo=selectedFile?`فایل ضمیمه‌شده: ${selectedFile.name} (${selectedFile.type||'نوع نامشخص'})`:'هیچ فایلی ضمیمه نشده است';

 return `تو دستیار شخصی یادداشت‌های درسی من هستی.

ماموریت:
متن خام واقعی من را به یک یادداشت منظم و قابل استفاده در Obsidian تبدیل کن.

منابع:
- متن خام زیر منبع اصلی محتوای جلسه و نمونه اصلی لحن و واژگان من است.
- اگر فایل تصویری ضمیمه شده، از آن فقط برای خواندن/تکمیل اطلاعاتی که واقعاً در تصویر وجود دارد استفاده کن.
- اگر بین متن و تصویر اختلاف وجود داشت، چیزی را حدس نزن و مورد اختلاف را علامت بزن.

قوانین:
1. فقط از اطلاعات واقعی جلسه، متن خام و فایل ضمیمه استفاده کن.
2. هیچ اطلاعات، مثال، فرمول، تکلیف یا مفهومی از خودت اضافه نکن.
3. متن خام را از نظر لحن، واژگان، نوع جمله‌بندی و مثال‌های شخصی من الگو قرار بده.
3.5. متن خام داخل بلوک BEGIN/END RAW TEXT داده شده و باید تماماً خوانده و تحلیل شود؛ حتی یک خط یا عبارت را به دلیل کوتاهی، تکرار یا نامرتبط‌بودن ظاهری نادیده نگیر.
4. ساختار را بهتر کن، اما نوشته را رسمی، دانشگاهی یا مصنوعی نکن.
5. غلط‌های واضح تایپی و نگارشی را فقط در حد لازم اصلاح کن.
6. مثال‌های خودم را حذف نکن مگر کاملاً تکراری باشند.
7. یادداشت شخصی، وسیله، کار، ایده یا یادآوری را به زور مفهوم درسی نکن.
8. بخش نامشخص، ناخوانا یا مشکوک را با «⚠️ نیاز به بررسی» علامت بزن.
9. اگر محتوای متن با نام درس ناسازگار است، متن را تغییر نده؛ فقط ناسازگاری احتمالی را گزارش کن.
10. فعلاً هیچ لینک Obsidian به شکل [[...]] نساز.
11. اگر بخشی اطلاعاتی ندارد، «ذکری نشده» بنویس.
12. خروجی فقط Markdown باشد و هیچ توضیحی خارج از Markdown ننویس.

برچسب‌های اختیاری:
[فرمول] ... [/فرمول] → بخش فرمول‌ها
[تکلیف] ... [/تکلیف] → بخش تکالیف
[سؤال] ... [/سؤال] → بخش سوالات
[مهم] ... [/مهم] → بخش نکات مهم
این برچسب‌ها در خروجی حذف شوند.

اطلاعات واقعی جلسه:
درس: ${subject}
شماره جلسه: ${session}
نوع کلاس: ${type}
${fileInfo}

متن خام واقعی من، دقیقاً همان متنی که باید تحلیل شود:
======== BEGIN RAW TEXT ========
${raw}
======== END RAW TEXT ========

قالب خروجی:
# ${subject} | جلسه ${session}

## خلاصه
...

## نکات مهم
...

## مفاهیم و موضوعات
...

## فرمول‌ها
...

## مثال‌ها
...

## سوالات
...

## تکالیف
...

## موارد نیازمند بررسی
...

## ارتباط با مطالب قبلی
...

یادآوری نهایی:
هیچ بخشی از متن خام را نادیده نگیر. چیزی را اختراع نکن. ساختار بده، اما سبک من را حفظ کن.`;
}

function legacyCopy(text){
 const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';
 document.body.appendChild(ta);ta.focus();ta.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}document.body.removeChild(ta);return ok;
}
async function copyText(text){
 try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);return true}}catch(e){}
 return legacyCopy(text);
}
function show(t){$('status').textContent=t;$('status').style.display='block'}

$('makePrompt').onclick=()=>{
 const p=buildPrompt();$('prompt').textContent=p;$('promptBox').classList.add('show');
 $('promptBox').scrollIntoView({behavior:'smooth',block:'nearest'});
};

$('copyPrompt').onclick=async()=>{
 const p=$('prompt').textContent||buildPrompt();const ok=await copyText(p);
 show(ok?'✓ Prompt کامل، شامل متن خام، کپی شد.':'⚠️ کپی خودکار نشد؛ Prompt را دستی انتخاب و کپی کن.');
};

$('copyResult').onclick=async()=>{
 const ok=await copyText($('aiResult').value);show(ok?'✓ نتیجه کپی شد.':'⚠️ کپی خودکار نشد.');
};

$('downloadPackage').onclick=async()=>{
 const text=$('aiResult').value.trim();
 if(!text){show('⚠️ اول خروجی AI را وارد کن.');return}
 const subject=($('subject').value.trim()||'Class').replace(/[\\/:*?"<>|]/g,'_');
 const session=$('session').value.trim()||'Session';
 let md=text;
 if(selectedFile && selectedFile.type.startsWith('image/')){
   const imageName=selectedFile.name.replace(/[\\/:*?"<>|]/g,'_');
   const imageRef=`![](${imageName})`;
   // Put the image at the end only if AI did not already reference it.
   if(!md.includes(imageName)&&!md.includes('![](')&&!md.includes('![[image')){
     md += `\n\n## تصویر یادداشت جلسه\n\n${imageRef}\n`;
   }
   const blob=new Blob([md],{type:'text/markdown;charset=utf-8'});
   const mdFile=new File([blob],`${subject}_${session}.md`,{type:'text/markdown'});
   const imgBuffer=await selectedFile.arrayBuffer();
   // Build a ZIP manually via JS is non-trivial without a library, so use a single HTML-generated package manifest:
   // Instead, download both files separately with clear matching names.
   const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${subject}_${session}.md`;a.click();URL.revokeObjectURL(a.href);
   setTimeout(()=>{const b=document.createElement('a');b.href=URL.createObjectURL(selectedFile);b.download=imageName;b.click();URL.revokeObjectURL(b.href)},250);
   show('✓ فایل Markdown و عکس جداگانه دانلود شدند. هر دو را داخل یک پوشه در Vault بگذار تا تصویر با Markdown نمایش داده شود.');
 }else{
   const blob=new Blob([md],{type:'text/markdown;charset=utf-8'});
   const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${subject}_${session}.md`;a.click();URL.revokeObjectURL(a.href);
   show('✓ فایل Markdown ساخته شد.');
 }
};
$('clear').onclick=()=>location.reload();

});

// Basic runtime diagnostics: useful when the project is hosted on GitHub Pages.
window.addEventListener('error', (event) => {
  console.error('[Class Notes]', event.error || event.message);
});
window.addEventListener('unhandledrejection', (event) => {
  console.error('[Class Notes] Unhandled promise rejection:', event.reason);
});
