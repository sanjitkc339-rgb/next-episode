// title, year, episodes (1 = film), score, genres, moods, hue, blurb
const D=[
["Frieren: Beyond Journey's End",2023,28,9.3,["Fantasy","Slice of Life"],["Cozy","Emotional"],265,"An elf mage walks the road again after the hero's party disbands, learning what a short human life meant."],
["Fullmetal Alchemist: Brotherhood",2009,64,9.1,["Action","Fantasy"],["Hyped","Emotional"],8,"Two brothers chase the Philosopher's Stone to undo a terrible mistake. Tight plot, huge heart."],
["Steins;Gate",2011,24,9.1,["Sci-Fi","Thriller"],["Mind-bending","Emotional"],195,"A self-proclaimed mad scientist discovers microwave-powered time messages and can't stop meddling."],
["Hunter x Hunter",2011,148,9.0,["Action","Fantasy"],["Hyped"],140,"Gon sets out to become a Hunter and find his father. Clever fights built on rules, not just power."],
["Monster",2004,74,8.9,["Thriller"],["Dark","Mind-bending"],350,"A surgeon saves a boy's life, then spends years hunting the killer that boy became."],
["Bocchi the Rock!",2022,12,8.9,["Comedy","Slice of Life"],["Funny","Cozy"],330,"A painfully shy guitarist tries to join a band. Anxiety jokes with surprisingly sharp visuals."],
["A Silent Voice",2016,1,8.9,["Romance","Slice of Life"],["Emotional"],200,"A former bully tries to make amends with the deaf classmate he tormented years ago."],
["Cowboy Bebop",1998,26,8.8,["Sci-Fi","Action"],["Emotional","Hyped"],30,"Bounty hunters drift through space with jazz, bad luck and pasts they can't outrun."],
["Your Name",2016,1,8.8,["Romance","Fantasy"],["Emotional"],340,"Two strangers swap bodies across distance and start to fall for each other."],
["Vinland Saga",2019,48,8.7,["Action"],["Dark","Emotional"],20,"A Viking revenge story that slowly becomes a story about what it takes to stop fighting."],
["Made in Abyss",2017,27,8.7,["Fantasy","Thriller"],["Dark","Mind-bending"],160,"A girl descends into a bottomless pit to find her mother. Cute art, brutal consequences."],
["Death Note",2006,37,8.6,["Thriller"],["Dark","Mind-bending"],0,"A student finds a notebook that kills and a detective who is just as brilliant as he is."],
["Spy x Family",2022,37,8.6,["Comedy","Action"],["Funny","Cozy"],350,"A spy, an assassin and a telepathic child pretend to be a family. Everyone is hiding something."],
["Mushishi",2005,26,8.6,["Fantasy","Slice of Life"],["Cozy","Mind-bending"],150,"A wanderer helps villagers affected by strange life-forms. Quiet, one-episode stories."],
["Mob Psycho 100",2016,37,8.6,["Action","Comedy"],["Hyped","Emotional","Funny"],280,"A powerful kid with a plain life learns that kindness matters more than strength."],
["Jujutsu Kaisen",2020,47,8.6,["Action","Fantasy"],["Hyped","Dark"],245,"A high-schooler swallows a cursed finger and joins a school of sorcerers. Slick fights."],
["Attack on Titan",2013,87,8.5,["Action","Thriller"],["Dark","Hyped"],25,"Humanity hides behind walls from giants, until the truth behind them changes everything."],
["One Punch Man",2015,24,8.5,["Action","Comedy"],["Funny","Hyped"],50,"A hero who wins every fight in one hit is bored. The action is huge and the jokes land."],
["Haikyu!!",2014,85,8.5,["Sports","Comedy"],["Hyped","Funny"],30,"A short volleyball player with huge jump and a rival-turned-teammate climb toward nationals."],
["Natsume's Book of Friends",2008,74,8.5,["Slice of Life","Fantasy"],["Cozy","Emotional"],120,"A boy who sees spirits returns the names his grandmother bound. Warm and gentle."],
["Violet Evergarden",2018,13,8.5,["Slice of Life","Fantasy"],["Emotional"],215,"A former soldier writes letters for others and slowly learns what 'I love you' means."],
["Kaguya-sama: Love is War",2019,37,8.4,["Romance","Comedy"],["Funny"],340,"Two genius students refuse to confess first, so every crush becomes a battle of wits."],
["Neon Genesis Evangelion",1995,26,8.3,["Sci-Fi"],["Mind-bending","Dark"],275,"Teenagers pilot giant machines against angels while struggling with loneliness."],
["Laid-Back Camp",2018,37,7.8,["Slice of Life"],["Cozy"],170,"Friends camp in winter, eat well and look at mountains. Pure calm."]
];
const MOODS=["Cozy","Hyped","Funny","Emotional","Mind-bending","Dark"];
const GENRES=[...new Set(D.flatMap(d=>d[4]))].sort();
const $=s=>document.querySelector(s);
const st={mood:new Set(),genre:null,fav:false,q:"",sort:"score",favs:new Set()};
try{JSON.parse(localStorage.getItem("ne-favs")||"[]").forEach(x=>st.favs.add(x))}catch(e){}
const save=()=>{try{localStorage.setItem("ne-favs",JSON.stringify([...st.favs]))}catch(e){}};
const esc=s=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const bg=h=>`background:linear-gradient(135deg,hsl(${h} 80% 52%),hsl(${(h+50)%360} 85% 38%))`;
const epsTxt=d=>d[2]==1?"Film":d[2]+" eps";

function chips(el,list,isOn,onClick){
  el.innerHTML=list.map(x=>`<button class="chip" aria-pressed="${isOn(x)}" data-v="${esc(x)}">${esc(x)}</button>`).join("");
  el.onclick=e=>{const b=e.target.closest("button");if(b)onClick(b.dataset.v)};
}
function drawChips(){
  chips($("#moods"),MOODS,m=>st.mood.has(m),m=>{st.mood.has(m)?st.mood.delete(m):st.mood.add(m);drawChips();rollPick()});
  chips($("#genres"),["All",...GENRES],g=>(g==="All"?!st.genre:st.genre===g),g=>{st.genre=g==="All"?null:g;drawChips();drawGrid()});
}
let cur=null;
function rollPick(){
  let pool=D.filter(d=>!st.mood.size||[...st.mood].some(m=>d[5].includes(m)));
  if(pool.length>1&&cur)pool=pool.filter(d=>d!==cur);
  cur=pool[Math.floor(Math.random()*pool.length)];
  const d=cur,p=$("#pick");
  p.innerHTML=`<div class="art" style="${bg(d[6])}"><b>${esc(d[0][0])}</b></div>
  <div class="body"><h2>${esc(d[0])}</h2>
  <div class="meta">${d[1]} · ${epsTxt(d)} · ★ ${d[3].toFixed(1)}</div>
  <div class="tags">${d[4].concat(d[5]).map(t=>`<span class="tag">${esc(t)}</span>`).join("")}</div>
  <p style="margin:0">${esc(d[2]?d[7]:"")}</p>
  <div class="actions"><button class="btn" id="again">Show another</button>
  <button class="btn small" id="saveP" aria-pressed="${st.favs.has(d[0])}">${st.favs.has(d[0])?"♥ Saved":"♡ Save to watchlist"}</button></div></div>`;
  p.classList.remove("swap");void p.offsetWidth;p.classList.add("swap");
  $("#again").onclick=rollPick;
  $("#saveP").onclick=()=>{toggleFav(d[0]);rollPick.keep=1;showSave()};
}
function showSave(){const b=$("#saveP");if(!b||!cur)return;const on=st.favs.has(cur[0]);b.textContent=on?"♥ Saved":"♡ Save to watchlist";b.setAttribute("aria-pressed",on)}
function toggleFav(t){st.favs.has(t)?st.favs.delete(t):st.favs.add(t);save();drawGrid();showSave()}
function drawGrid(){
  const q=st.q.trim().toLowerCase();
  let list=D.filter(d=>(!st.genre||d[4].includes(st.genre))&&(!st.fav||st.favs.has(d[0]))&&(!q||(d[0]+" "+d[7]+" "+d[4].join(" ")+" "+d[5].join(" ")).toLowerCase().includes(q)));
  const s=st.sort;
  list.sort((a,b)=>s==="score"?b[3]-a[3]:s==="year"?b[1]-a[1]:s==="eps"?a[2]-b[2]:a[0].localeCompare(b[0]));
  $("#count").textContent=`${list.length} ${list.length===1?"anime":"anime"} shown`;
  $("#grid").innerHTML=list.length?list.map(d=>`<article class="card"><div class="art" style="${bg(d[6])}"><b>${esc(d[0][0])}</b><span class="score">★ ${d[3].toFixed(1)}</span></div>
  <div class="body"><h3>${esc(d[0])}</h3><div class="meta">${d[1]} · ${epsTxt(d)}</div>
  <div class="tags">${d[4].map(t=>`<span class="tag">${esc(t)}</span>`).join("")}</div>
  <p>${esc(d[7])}</p>
  <div class="foot"><span class="meta">${d[5].join(", ")}</span>
  <button class="heart" data-t="${esc(d[0])}" aria-pressed="${st.favs.has(d[0])}" aria-label="${st.favs.has(d[0])?"Remove from":"Add to"} watchlist: ${esc(d[0])}">${st.favs.has(d[0])?"♥":"♡"}</button></div></div></article>`).join(""):
  `<div class="empty" style="grid-column:1/-1">${st.fav?"Your watchlist is empty. Tap ♡ on any card to save it.":"No matches. Try a different word or clear the genre filter."}</div>`;
}
$("#grid").onclick=e=>{const b=e.target.closest(".heart");if(b)toggleFav(b.dataset.t)};
$("#q").oninput=e=>{st.q=e.target.value;drawGrid()};
$("#sort").onchange=e=>{st.sort=e.target.value;drawGrid()};
$("#onlyFav").onclick=e=>{st.fav=!st.fav;e.currentTarget.setAttribute("aria-pressed",st.fav);drawGrid()};
$("#roll").onclick=rollPick;
$("#theme").onclick=()=>{const r=document.documentElement;const dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;r.dataset.theme=dark?"light":"dark"};
drawChips();drawGrid();rollPick();
