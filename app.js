const $ = id => document.getElementById(id);
let currentDay = "sexta";
const selectedShows = new Set(); // Guarda os IDs dos shows marcados

// Configurações da Grade (Escala de tempo)
const START_HOUR = 11; // 11:00 (Abertura)
const END_HOUR = 24; // 00:00 (Fim)
const MINUTE_HEIGHT = 2.2; // Pixels por minuto

// Converte horário (ex: "14:30") para Minutos a partir do inicio (11:00)
function timeToMins(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  const hour24 = h === 0 ? 24 : h; // Meia noite vira 24 para a conta
  return ((hour24 * 60) + m) - (START_HOUR * 60);
}

// Renderiza os botões de seleção de dia
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

// Lida com o clique no show (selecionar/deselecionar)
window.toggleShow = (showId) => {
  if (selectedShows.has(showId)) {
    selectedShows.delete(showId);
  } else {
    selectedShows.add(showId);
  }
  renderGrid(); // Re-renderiza para checar conflitos e atualizar as classes
};

// Verifica conflitos entre shows selecionados
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

      // Lógica matemática de intersecção (Se A começa antes de B terminar e A termina depois que B começar)
      if (startA < endB && endA > startB) {
        conflicts.add(showA.id);
        conflicts.add(showB.id);
      }
    }
  }
  return conflicts;
}

// Renderiza a Grade Visual Inteira
function renderGrid() {
  const dayData = SCHEDULE[currentDay];
  
  // Muda a cor de fundo do CSS baseado no tema do dia
  document.documentElement.style.setProperty('--bg-color', dayData.theme);

  // Define altura total da grade
  const totalMinutes = (END_HOUR - START_HOUR) * 60;
  const gridHeight = totalMinutes * MINUTE_HEIGHT;
  $("schedule-grid").style.height = `${gridHeight}px`;

  // 1. Renderiza os cabeçalhos dos palcos
  $("stage-headers").innerHTML = `<div class="time-col-header"></div>` + 
    STAGES.map(s => `<div class="stage-name">${s}</div>`).join("");

  // 2. Renderiza as linhas das horas (12H, 13H, etc)
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

  // 3. Verifica Conflitos Atuais
  const conflicts = getConflictingShows(dayData);

  // 4. Renderiza as colunas e os blocos de shows
  let columnsHTML = STAGES.map((_, index) => `<div class="stage-col"></div>`);
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
      <div class="show-name">${show.artista}</div>
      <div class="show-time">${show.inicio} - ${show.fim}</div>
    `;
    
    cols[show.palco].appendChild(block);
  });
}

// Inicia
renderTabs();
renderGrid();