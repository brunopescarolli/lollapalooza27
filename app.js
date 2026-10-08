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

$("btn-download").addEventListener("click", async () => {
  const btn = $("btn-download");
  const originalText = btn.textContent;
  btn.textContent = "GERANDO (AGUARDE)...";
  
  const printArea = $("print-area");
  
  try {
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim();
    
    const scrollWidth = printArea.scrollWidth;
    const scrollHeight = printArea.scrollHeight;
    
    const dataUrl = await htmlToImage.toPng(printArea, {
      backgroundColor: bgColor,
      pixelRatio: 2,
      cacheBust: true,
      width: scrollWidth,
      height: scrollHeight,
      style: { margin: '0', padding: '0' } // Removido o padding artificial que causava o corte à direita
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

renderTabs();
renderGrid();