const norm = s => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
const INDEX = new Map();
LINEUP.forEach(it => [it.n, ...it.a].forEach(k => INDEX.set(norm(k), it)));

const CLIENT_ID = "959c89129e094a0083d8a8f19b38a73e";
const REDIRECT = location.origin + location.pathname.replace(/index\.html$/, "").replace(/\/?$/, "/");
const $= id => document.getElementById(id), status =$("status"), say = t => status.textContent = t;
const b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function login() {
  const verifier = b64(crypto.getRandomValues(new Uint8Array(48)));
  const challenge = b64(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier)));
  sessionStorage.setItem("pkce", verifier);
  location.href = "https://accounts.spotify.com/authorize?" + new URLSearchParams({ client_id: CLIENT_ID, response_type: "code", redirect_uri: REDIRECT, scope: "user-top-read", code_challenge_method: "S256", code_challenge: challenge });
}

async function token(code) {
  const r = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: CLIENT_ID, grant_type: "authorization_code", code, redirect_uri: REDIRECT, code_verifier: sessionStorage.getItem("pkce") })
  });
  if (!r.ok) throw new Error("falha ao autenticar (" + r.status + ")");
  return (await r.json()).access_token;
}

let TOKEN = null;

async function fetchTop(type, range) {
  const r = await fetch(`https://api.spotify.com/v1/me/top/${type}?limit=50&time_range=${range}`, { headers: { Authorization: "Bearer " + TOKEN } });
  if (r.status === 403) throw new Error("Acesso negado. Seu e-mail precisa estar cadastrado no dashboard do Spotify.");
  if (!r.ok) throw new Error(`Erro da API do Spotify (${r.status})`);
  return (await r.json()).items;
}

async function load() {
  say("Buscando seus artistas e músicas...");
  try {
    // Busca em paralelo os artistas e músicas dos 3 períodos
    const [aShort, aMed, aLong, tShort, tMed, tLong] = await Promise.all([
      fetchTop("artists", "short_term"), fetchTop("artists", "medium_term"), fetchTop("artists", "long_term"),
      fetchTop("tracks", "short_term"), fetchTop("tracks", "medium_term"), fetchTop("tracks", "long_term")
    ]);

    const stats = new Map();

    const addArtists = (items) => {
      items.forEach((a, i) => {
        const it = INDEX.get(norm(a.name));
        if (it) {
          if (!stats.has(it)) stats.set(it, { trackCount: 0, bestRank: 999 });
          if (i + 1 < stats.get(it).bestRank) stats.get(it).bestRank = i + 1;
        }
      });
    };

    const addTracks = (items) => {
      items.forEach(t => {
        t.artists.forEach(a => {
          const it = INDEX.get(norm(a.name));
          if (it) {
            if (!stats.has(it)) stats.set(it, { trackCount: 0, bestRank: 999 });
            stats.get(it).trackCount += 1;
          }
        });
      });
    };

    addArtists(aShort); addArtists(aMed); addArtists(aLong);
    addTracks(tShort); addTracks(tMed); addTracks(tLong);

    if (stats.size === 0) {
      $("result").hidden = true;
      say("Nenhum artista do line-up apareceu nos seus tops recentes.");
      return;
    }

    // Transforma o Map em array e ordena os resultados
    const top = [...stats.entries()].map(([it, s]) => ({ it, ...s }));
    top.sort((a, b) => {
      if (b.trackCount !== a.trackCount) return b.trackCount - a.trackCount; // Prioriza quem tem mais faixas nos tops de tracks
      return a.bestRank - b.bestRank; // Desempata pela melhor posição nos tops de artistas
    });

    const t10 = top.slice(0, 10);
    $("rows").innerHTML = t10.map((data, i) => {
      // Define a exibição respeitando o elemento .row .h span do style.css
      const info = data.trackCount > 0
        ? `${data.trackCount} ${data.trackCount === 1 ? 'música' : 'músicas'}<span>nos seus tops</span>`
        : `#${data.bestRank}<span>no top artistas</span>`;
      
      return `<div class="row"><div class="n">${i + 1}</div><div class="a"></div><div class="h">${info}</div></div>`;
    }).join("");

    [...document.querySelectorAll("#rows .a")].forEach((el, i) => el.textContent = t10[i].it.n);

    // Correção de plural no rodapé
    const total = top.length;
    $("foot").textContent = `${total} ${total === 1 ? 'artista' : 'artistas'} do line-up encontrados`;
    $("result").hidden = false;
    say("");

  } catch (e) {
    say(e.message);
  }
}

$("login").addEventListener("click", login);
$("save").addEventListener("click", async () => {
  const url = await htmlToImage.toPng($("card"), { pixelRatio: 2, backgroundColor: "#fffdf5" });
  const a = document.createElement("a"); a.href = url; a.download = "meu-lolla-2027.png"; a.click();
});

(async () => {
  const p = new URLSearchParams(location.search);
  if (p.get("error")) { say("Login cancelado."); return; }
  if (p.get("code")) {
    history.replaceState({}, "", REDIRECT); $("login").hidden = true;
    try {
      TOKEN = await token(p.get("code"));
      await load(); // Alterado para executar a nova função sem parâmetros engessados
    } catch (e) {
      say("Erro: " + e.message); $("login").hidden = false;
    }
  }
})();