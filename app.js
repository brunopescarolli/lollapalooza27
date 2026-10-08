const $ = id => document.getElementById(id);
let currentDay = "sexta";
const selectedShows = new Set();

const savedSelections = localStorage.getItem('lolla2027_selections');
if (savedSelections) {
  JSON.parse(savedSelections).forEach(id => selectedShows.add(id));
}

const START_HOUR = 11;
const END_HOUR = 24;
const MINUTE_HEIGHT = 3.5;

function timeToMins(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  const hour24 = h === 0 ? 24 : h;
  return ((hour24 * 60) + m) - (START_HOUR * 60);
}

function renderTabs() {
  $("tabs").innerHTML = Object.keys(SCHEDULE).map(key => `
    <button class="tab-btn ${key === currentDay ? 'active' : ''}" onclick="changeDay('${key}')">
      ${SCHEDULE[key].nome}
    </button>
  `).join("");
}

window.changeDay = (key) => {
  currentDay = key;
  renderTabs();
  renderGrid();
};

window.toggleShow = (showId) => {
  if (selectedShows.has(showId)) {
    selectedShows.delete(showId);
  } else {
    selectedShows.add(showId);
  }
  
  localStorage.setItem('lolla2027_selections', JSON.stringify([...selectedShows]));
  renderGrid();
};

function getConflictingShows(dayData) {
  const conflicts = new Set();
  const selectedInDay = dayData.shows.filter(s => selectedShows.has(s.id));

  for (let i = 0; i < selectedInDay.length; i++) {
    for (let j = i + 1; j < selectedInDay.length; j++) {
      const showA = selectedInDay[i];
      const showB = selectedInDay[j];
      
      const startA = timeToMins(showA.inicio);
      const endA = timeToMins(showA.fim);
      const startB = timeToMins(showB.inicio);
      const endB = timeToMins(showB.fim);

      if (startA < endB && endA > startB) {
        conflicts.add(showA.id);
        conflicts.add(showB.id);
      }
    }
  }
  return conflicts;
}

function renderGrid() {
  const dayData = SCHEDULE[currentDay];
  document.documentElement.style.setProperty('--bg-color', dayData.theme);

  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    // RENDERIZAÇÃO VERTICAL PARA CELULAR (Sem precisar rolar para os lados)
    $("stage-headers").style.display = "none";
    $("schedule-grid").style.display = "none";
    
    const conflicts = getConflictingShows(dayData);
    
    // Ordena os shows cronologicamente para o feed vertical
    const sortedShows = [...dayData.shows].sort((a, b) => timeToMins(a.inicio) - timeToMins(b.inicio));

    let html = `<div style="font-weight:700; background:var(--lime); color:var(--ink); padding:10px; text-align:center; border:2px solid var(--ink); margin-bottom:15px; font-family:'Anton'; font-size:18px;">${dayData.nome.toUpperCase()} - TODOS OS SHOWS</div>`;
    
    sortedShows.forEach(show => {
      const isSelected = selectedShows.has(show.id);
      const isConflict = conflicts.has(show.id);
      const palcoNome = STAGES[show.palco];

      let bgStyle = "background: var(--paper);";
      if (isSelected) bgStyle = "background: var(--lime); border-width: 4px;";
      if (isConflict) bgStyle = "background: var(--red); color: white;";

      html += `
        <div onclick="toggleShow('${show.id}')" style="${bgStyle} border:3px solid var(--ink); border-radius:6px; padding:12px; margin-bottom:10px; cursor:pointer; box-shadow:3px 3px 0 var(--ink);">
          <div style="font-family:'Anton'; font-size:20px; text-transform:uppercase; margin-bottom:4px;">${show.artista}</div>
          <div style="font-size:14px; font-weight:700; opacity:0.8;">📍 ${palcoNome} | ⏰ ${show.inicio} - ${show.fim}</div>
          ${isConflict ? '<div style="margin-top:5px; background:var(--ink); color:var(--lime); font-size:12px; padding:2px 6px; display:inline-block; font-weight:700;">⚠️ CONFLITO DE HORÁRIO</div>' : ''}
        </div>
      `;
    });

    $("stage-columns").innerHTML = html;
    return;
  }

  // RENDERIZAÇÃO COMPLETA EM GRADE PARA DESKTOP/TABLET
  $("stage-headers").style.display = "flex";
  $("schedule-grid.desktop-grid") ? $("schedule-grid").style.display = "flex" : $("schedule-grid").style.display = "flex";

  const totalMinutes = (END_HOUR - START_HOUR) * 60;
  const gridHeight = totalMinutes * MINUTE_HEIGHT;
  $("schedule-grid").style.height = `${gridHeight}px`;

  $("stage-headers").innerHTML = `<div class="time-col-header"></div>` + 
    STAGES.map(s => `<div class="stage-name">${s}</div>`).join("");

  let linesHTML = "";
  for (let h = START_HOUR + 1; h <= END_HOUR; h++) {
    const yPos = (h - START_HOUR) * 60 * MINUTE_HEIGHT;
    const label = h === 24 ? "00H" : `${h}H`;
    linesHTML += `
      <div class="hour-line" style="top: ${yPos}px;">
        <div class="hour-circle">${label}</div>
      </div>
    `;
  }
  $("hour-lines").innerHTML = linesHTML;

  const conflicts = getConflictingShows(dayData);

  let columnsHTML = STAGES.map(() => `<div class="stage-col"></div>`);
  $("stage-columns").innerHTML = columnsHTML.join("");
  const cols = document.querySelectorAll('.stage-col');

  dayData.shows.forEach(show => {
    const topPx = timeToMins(show.inicio) * MINUTE_HEIGHT;
    const heightPx = (timeToMins(show.fim) - timeToMins(show.inicio)) * MINUTE_HEIGHT;

    const isSelected = selectedShows.has(show.id);
    const isConflict = conflicts.has(show.id);

    let classes = "show-block";
    if (isSelected) classes += " selected";
    if (isConflict) classes += " conflict";

    const block = document.createElement("div");
    block.className = classes;
    block.style.top = `${topPx}px`;
    block.style.height = `${heightPx}px`;
    block.onclick = () => toggleShow(show.id);
    
    block.innerHTML = `
      <div class="show-content">
        <div class="show-name">${show.artista}</div>
        <div class="show-time">${show.inicio} - ${show.fim}</div>
      </div>
    `;
    
    cols[show.palco].appendChild(block);
  });
}

$("btn-download").addEventListener("click", async () => {
  const btn = $("btn-download");
  const originalText = btn.textContent;
  btn.textContent = "GERANDO (AGUARDE)...";
  
  const printArea = $("print-area");
  
  try {
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim();
    
    const scrollWidth = printArea.scrollWidth + 40;
    const scrollHeight = printArea.scrollHeight + 40;
    
    const dataUrl = await htmlToImage.toPng(printArea, {
      backgroundColor: bgColor,
      pixelRatio: 2,
      cacheBust: true,
      width: scrollWidth,
      height: scrollHeight,
      style: { margin: '0', padding: '20px' } 
    });
    
    const link = document.createElement('a');
    link.download = `roteiro-lolla-2027-${currentDay}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error(error);
    alert("Ocorreu um erro ao baixar. Tente recarregar a página.");
  } finally {
    btn.textContent = originalText;
  }
});

window.addEventListener('resize', () => {
  renderGrid();
});

renderTabs();
renderGrid();