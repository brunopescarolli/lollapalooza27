const norm=s=>(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");
const INDEX=new Map();
LINEUP.forEach(it=>[it.n,...it.a].forEach(k=>INDEX.set(norm(k),it)));

const CLIENT_ID="959c89129e094a0083d8a8f19b38a73e";
const REDIRECT=location.origin+location.pathname;
const $=id=>document.getElementById(id),status=$("status"),say=t=>status.textContent=t;
const b64=buf=>btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");

async function login(){
  const verifier=b64(crypto.getRandomValues(new Uint8Array(48)));
  const challenge=b64(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(verifier)));
  sessionStorage.setItem("pkce",verifier);
  location.href="https://accounts.spotify.com/authorize?"+new URLSearchParams({client_id:CLIENT_ID,response_type:"code",redirect_uri:REDIRECT,scope:"user-top-read",code_challenge_method:"S256",code_challenge:challenge});
}
async function token(code){
  const r=await fetch("https://accounts.spotify.com/api/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},
    body:new URLSearchParams({client_id:CLIENT_ID,grant_type:"authorization_code",code,redirect_uri:REDIRECT,code_verifier:sessionStorage.getItem("pkce")})});
  if(!r.ok)throw new Error("falha ao autenticar ("+r.status+")");
  return (await r.json()).access_token;
}
let TOKEN=null;
async function load(range){
  say("Buscando seus artistas…");
  const r=await fetch("https://api.spotify.com/v1/me/top/artists?limit=50&time_range="+range,{headers:{Authorization:"Bearer "+TOKEN}});
  if(r.status===403){say("Acesso negado. Seu e-mail precisa estar cadastrado como usuário do app no dashboard do Spotify.");return}
  if(!r.ok){say("Erro da API do Spotify ("+r.status+").");return}
  const items=(await r.json()).items;
  const seen=new Set(),top=[];
  items.forEach((ar,i)=>{const it=INDEX.get(norm(ar.name));if(it&&!seen.has(it)){seen.add(it);top.push([it,i+1])}});
  if(!top.length){$("result").hidden=true;say("Nenhum artista do line-up apareceu no seu top 50 do último ano.");return}
  const t10=top.slice(0,10);
  $("rows").innerHTML=t10.map(([it,p],i)=>`<div class="row"><div class="n">${i+1}</div><div class="a"></div><div class="h">#${p}<span>no seu top 50</span></div></div>`).join("");
  [...document.querySelectorAll("#rows .a")].forEach((el,i)=>el.textContent=t10[i][0].n);
  $("foot").textContent=`${top.length} artistas do line-up no seu top 50`;
  $("result").hidden=false;say("");
}
$("login").addEventListener("click",login);
$("save").addEventListener("click",async()=>{
  const url=await htmlToImage.toPng($("card"),{pixelRatio:2,backgroundColor:"#fffdf5"});
  const a=document.createElement("a");a.href=url;a.download="meu-lolla-2027.png";a.click();
});
(async()=>{
  const p=new URLSearchParams(location.search);
  if(p.get("error")){say("Login cancelado.");return}
  if(p.get("code")){
    history.replaceState({},"",REDIRECT);$("login").hidden=true;
    try{TOKEN=await token(p.get("code"));await load("long_term")}catch(e){say("Erro: "+e.message);$("login").hidden=false}
  }
})();
