const defaults={
 settings:{hero_title:"ROCK ESPORTS",hero_text:"Building the future of Nepali esports through discipline, teamwork, skill, leadership and competitive excellence.",about_title:"About ROCK ESPORTS",about_text:"ROCK ESPORTS is a professional esports organization focused on developing competitive talent, building strong teams, creating tournament opportunities and representing Nepali esports with pride.",email:"rockesprots.offical@gmail.com",social:"YouTube · Facebook · TikTok · Instagram · Discord"},
 management:Array.from({length:8},(_,i)=>({name:"Management "+String(i+1).padStart(2,"0"),position:["Founder & Owner","General Manager","Tournament Manager","Finance Manager","Operations Manager","Media & Public Relations","Secretary","Member Representative"][i],bio:"",photo_url:""})),
 members:Array.from({length:16},(_,i)=>({name:"Member "+String(i+1).padStart(2,"0"),role:"Official Member",bio:"",photo_url:""})),
 news:[{title:"Welcome to ROCK ESPORTS",body:"Official organization updates will appear here.",image_url:"",published:true}],
 tournaments:[{title:"ROCK ESPORTS Tournament",body:"Tournament details, registration and schedules will appear here.",status:"UPCOMING",image_url:""}]
};
function placeholder(n){return "https://placehold.co/800x800/0b121e/35b8ff?text="+encodeURIComponent(n)}
async function loadPublic(){
 let data=defaults;
 if(window.rockSupabase){
   const {data:s}=await rockSupabase.from("site_settings").select("*").eq("id",1).maybeSingle();
   const {data:m}=await rockSupabase.from("management").select("*").order("slot");
   const {data:p}=await rockSupabase.from("members").select("*").order("slot");
   const {data:n}=await rockSupabase.from("news").select("*").eq("published",true).order("created_at",{ascending:false});
   const {data:t}=await rockSupabase.from("tournaments").select("*").order("created_at",{ascending:false});
   if(s)data.settings={...data.settings,...s};
   if(m?.length)data.management=m;
   if(p?.length)data.members=p;
   if(n?.length)data.news=n;
   if(t?.length)data.tournaments=t;
 }
 document.getElementById("heroTitle").innerHTML=(data.settings.hero_title||"ROCK ESPORTS").replace(" ","<br><span>");
 document.getElementById("heroText").textContent=data.settings.hero_text||"";
 document.getElementById("aboutTitle").textContent=data.settings.about_title||"About ROCK ESPORTS";
 document.getElementById("aboutText").textContent=data.settings.about_text||"";
 document.getElementById("email").textContent=data.settings.email||"";
 document.getElementById("social").textContent=data.settings.social||"";
 renderPeople("managementGrid",data.management,"position");
 renderPeople("membersGrid",data.members,"role");
 document.getElementById("newsGrid").innerHTML=data.news.map(x=>`<article>${x.image_url?`<img src="${x.image_url}" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:10px">`:""}<span class="tag">NEWS</span><h3>${esc(x.title)}</h3><p class="muted">${esc(x.body)}</p></article>`).join("");
 document.getElementById("tourGrid").innerHTML=data.tournaments.map(x=>`<article class="card">${x.image_url?`<img src="${x.image_url}" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:10px">`:""}<span class="tag">${esc(x.status||"TOURNAMENT")}</span><h3>${esc(x.title)}</h3><p class="muted">${esc(x.body)}</p></article>`).join("");
}
function renderPeople(id,a,role){document.getElementById(id).innerHTML=a.map(x=>`<article class="person"><img src="${x.photo_url||placeholder(x.name)}" alt="${esc(x.name)}"><div class="in"><div class="role">${esc(x[role]||"")}</div><h3>${esc(x.name)}</h3><p class="muted">${esc(x.bio||"")}</p></div></article>`).join("")}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
loadPublic();