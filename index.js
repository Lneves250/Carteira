// Processa as planilhas localmente e atualiza filtros, indicadores e gráficos.
const monthRows = (rows) =>
  Object.entries(rows).map(([month, count]) => ({ month, count }));

const groupRows = (rows) =>
  rows.map(([label, count]) => ({ label, count }));

const atcPoles = new Map([
  ["924", "CAMPO LIMPO"],
  ["286", "DIADEMA"],
  ["298", "EMBU"],
  ["370", "EMBU"],
  ["410", "EMBU"],
  ["772", "EMBU"],
  ["929", "GRAJAÚ"],
  ["299", "GRAJAÚ"],
  ["923", "INTERLAGOS"],
  ["911", "SANTO AMARO"],
  ["930", "SANTO AMARO"],
  ["21", "SBC"],
  ["581", "SBC"],
  ["589", "SBC"],
]);

const poleOrder = [
  "CAMPO LIMPO",
  "DIADEMA",
  "EMBU",
  "GRAJAÚ",
  "INTERLAGOS",
  "SANTO AMARO",
  "SBC",
  "NÃO MAPEADO",
];

const poleAtcCodes = new Map([
  ["CAMPO LIMPO", ["924"]],
  ["DIADEMA", ["286"]],
  ["EMBU", ["298", "370", "410", "772"]],
  ["GRAJAÚ", ["299", "929"]],
  ["INTERLAGOS", ["923"]],
  ["SANTO AMARO", ["911", "930"]],
  ["SBC", ["21", "581", "589"]],
]);

const initialData = {
  open: {
    rows: 2811,
    uniqueOrders: 2756,
    overdue: 1169,
    missingScheduled: 2811,
    poles: groupRows([
      ["CAMPO LIMPO", 476], ["DIADEMA", 218], ["EMBU", 289], ["GRAJAÚ", 439],
      ["INTERLAGOS", 467], ["SANTO AMARO", 562], ["SBC", 356], ["NÃO MAPEADO", 4],
    ]).map((pole) => ({
      ...pole,
      atcs: pole.label === "NÃO MAPEADO"
        ? ["70", "915", "957"]
        : poleAtcCodes.get(pole.label),
    })),
    months: monthRows({
      "2025-08": 1, "2025-09": 6, "2025-10": 9, "2025-11": 16,
      "2025-12": 8, "2026-01": 2, "2026-02": 5, "2026-03": 1,
      "2026-04": 10, "2026-05": 21, "2026-06": 25, "2026-07": 36,
      "2026-08": 40, "2026-09": 178, "2026-10": 1700, "2026-11": 753,
    }),
    families: groupRows([
      ["REPOSIÇÃO", 514], ["SUPRESSÃO A PEDIDO", 431], ["VISTORIA", 398],
      ["LIGAÇÃO DE ÁGUA", 218], ["VAZAMENTO DE ÁGUA", 181], ["PI, PV, TL", 163],
      ["LIGAÇÃO DE ESGOTO", 146], ["OUTROS SERVIÇOS DE ÁGUA", 132],
    ]),
    cities: groupRows([
      ["SÃO PAULO", 1867], ["SÃO BERNARDO DO CAMPO", 311], ["DIADEMA", 218],
      ["EMBU", 141], ["ITAPECERICA DA SERRA", 99], ["EMBU-GUACU", 81],
      ["JUQUITIBA", 32], ["RIBEIRÃO PIRES", 28],
    ]),
    priorities: groupRows([["NORMAL", 2630], ["URGÊNCIA", 173], ["ATENÇÃO", 8]]),
    initiative: groupRows([["INICIATIVA CLIENTE", 1563], ["INICIATIVA ADMINISTRATIVA", 1248]]),
    tss: groupRows([
      ["SUPRIMIR LIG AGUA ENCERRAMENTO CONTRATO", 289],
      ["VISTORIA DE IDENTIFICAR RESPONSABILIDADE", 195],
      ["SUPRIMIR LIGAÇÃO DE AGUA POR IMOVEL VAGO", 139],
      ["REPOR ASFALTO", 128],
      ["NIVELAR POÇO DE INSPEÇÃO/VISITA", 81],
      ["VISTORIA DE SINISTRO", 78],
      ["LIGAÇÃO DE ÁGUA - PROG AGUA LEGAL", 73],
      ["LIGAÇÃO DE ESGOTO - PROG AGUA LEGAL", 71],
    ]),
    aging: groupRows([
      ["1 a 7 dias", 510], ["8 a 30 dias", 330], ["31 a 90 dias", 197], ["Mais de 90 dias", 132],
    ]),
    statuses: groupRows([
      ["Planejável", 961], ["Despachada", 950], ["Reprogramável", 390],
      ["Validada", 221], ["Suspensa", 183], ["Planejada", 101],
      ["OS Admitida", 3], ["Em Execução", 2],
    ]),
  },
  closed: {
    rows: 4969,
    uniqueOrders: 3911,
    closed: 4968,
    cancelled: 1,
    missingScheduled: 4969,
    poles: groupRows([
      ["CAMPO LIMPO", 845], ["DIADEMA", 431], ["EMBU", 585], ["GRAJAÚ", 374],
      ["INTERLAGOS", 403], ["SANTO AMARO", 1092], ["SBC", 1239],
    ]).map((pole) => ({ ...pole, atcs: poleAtcCodes.get(pole.label) })),
    months: monthRows({
      "2026-01": 20, "2026-02": 13, "2026-03": 5, "2026-06": 4,
      "2026-08": 1, "2026-09": 12, "2026-10": 4221, "2026-11": 693,
    }),
    families: groupRows([
      ["CAVALETE", 655], ["REPOSIÇÃO", 651], ["OUTROS SERVIÇOS DE REPOSIÇÃO", 523],
      ["REATIV/RELIG/RESTAB", 418], ["DESOBSTRUÇÃO", 415],
      ["VAZAMENTO DE ÁGUA", 410], ["HIDRÔMETRO", 320], ["SUPRESSÃO A PEDIDO", 316],
    ]),
    cities: groupRows([
      ["SÃO PAULO", 2653], ["SÃO BERNARDO DO CAMPO", 950], ["DIADEMA", 431],
      ["EMBU", 339], ["ITAPECERICA DA SERRA", 216], ["RIBEIRÃO PIRES", 184],
      ["RIO GRANDE DA SERRA", 105], ["EMBU-GUACU", 61],
    ]),
    priorities: groupRows([["NORMAL", 4494], ["URGÊNCIA", 468], ["ATENÇÃO", 7]]),
    initiative: groupRows([["INICIATIVA CLIENTE", 2667], ["INICIATIVA ADMINISTRATIVA", 2302]]),
    tss: groupRows([
      ["REATIVAR LIGAÇÃO DE ÁGUA S/V", 279],
      ["SUPRIMIR LIG AGUA ENCERRAMENTO CONTRATO", 232],
      ["CAVALETE VAZANDO", 208],
      ["FALTA DE ÁGUA LOCAL", 199],
      ["DESOBSTRUIR REDE DE ESGOTO", 188],
      ["VISTORIA DE IDENTIFICAR RESPONSABILIDADE", 179],
      ["COMPACTAR E SELAR BASE", 151],
      ["VAZAMENTO DE ÁGUA LEITO PAVIMENTADO", 141],
    ]),
    causes: groupRows([
      ["TRATA-SE DE OUTRO SERVIÇO", 417],
      ["IMÓVEL FECHADO, ORDEM ENCERRADA", 377],
      ["VISTORIADO LOCAL E IDENTIFICADA SITUAÇÃO", 262],
      ["REATIVADA LIGAÇÃO DE ÁGUA S/V", 219],
      ["REPARO DE CAVALETE", 218],
      ["NADA CONSTA NO LOCAL", 188],
      ["SUPRIMIDA LIG AGUA ENCERRAMENTO CONTRATO", 168],
      ["DUPLICIDADE", 150],
    ]),
    statuses: groupRows([["Fechada", 4968], ["Cancelada", 1]]),
  },
  overlap: 390,
  combinedUnique: 6277,
  asOf: new Date(2026, 10, 3),
  files: ["56421-CLista_OS_20261103_080922.xlsx", "56421-ELista_OS_20261103_083317.xlsx"],
};

let dashboardData = initialData;
let toastTimeout;

const elements = {
  trendPeriod: document.querySelector("#trend-period"),
  trendChart: document.querySelector("#trend-chart"),
  trendYAxis: document.querySelector("#trend-y-axis"),
  trendGridlines: document.querySelector("#trend-gridlines"),
  trendXAxis: document.querySelector("#trend-x-axis"),
  filterPanel: document.querySelector(".filter-panel"),
  filterSummary: document.querySelector("#filter-summary"),
  filterHint: document.querySelector("#filter-hint"),
  clearFilters: document.querySelector("#clear-filters"),
  filters: {
    source: document.querySelector("#filter-source"),
    pole: document.querySelector("#filter-pole"),
    month: document.querySelector("#filter-month"),
    city: document.querySelector("#filter-city"),
    priority: document.querySelector("#filter-priority"),
    family: document.querySelector("#filter-family"),
    status: document.querySelector("#filter-status"),
  },
  importDialog: document.querySelector("#import-dialog"),
  importForm: document.querySelector("#import-form"),
  openFile: document.querySelector("#open-file"),
  closedFile: document.querySelector("#closed-file"),
  importError: document.querySelector("#import-error"),
  submitImport: document.querySelector("#submit-import"),
  toast: document.querySelector("#toast"),
};

const numberFormat = new Intl.NumberFormat("pt-BR");

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => elements.toast.classList.remove("visible"), 3200);
}

function formatMonth(month) {
  const [year, value] = month.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { month: "short", year: "2-digit" })
    .format(new Date(year, value - 1, 1))
    .replace(".", "");
}

function percent(part, total) {
  return total ? `${((part / total) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%` : "0%";
}

function mergeGroups(first, second, limit = 7) {
  const totals = new Map();
  for (const item of first) totals.set(item.label, { label: item.label, open: item.count, closed: 0 });
  for (const item of second) {
    const current = totals.get(item.label) || { label: item.label, open: 0, closed: 0 };
    current.closed = item.count;
    totals.set(item.label, current);
  }
  return [...totals.values()]
    .sort((a, b) => b.open + b.closed - (a.open + a.closed))
    .slice(0, limit);
}

function mergePoles(first, second) {
  if (!first?.length && !second?.length) return [];
  const counts = new Map();
  for (const [source, rows] of [["open", first], ["closed", second]]) {
    for (const row of rows) {
      const current = counts.get(row.label) || { label: row.label, open: 0, closed: 0, atcs: new Set() };
      current[source] = row.count;
      for (const code of row.atcs || []) current.atcs.add(code);
      counts.set(row.label, current);
    }
  }
  return poleOrder
    .filter((pole) => pole !== "NÃO MAPEADO" || counts.has(pole))
    .map((pole) => {
      const count = counts.get(pole);
      return {
        label: pole,
        open: count?.open || 0,
        closed: count?.closed || 0,
        atcs: poleAtcCodes.get(pole) || [...(count?.atcs || [])],
      };
    });
}

function createBarRow(label, count, max, variant = "") {
  const row = document.createElement("div");
  row.className = "bar-row";
  const heading = document.createElement("div");
  heading.className = "bar-heading";
  const name = document.createElement("span");
  name.className = "bar-name";
  name.textContent = label;
  name.title = label;
  const value = document.createElement("span");
  value.className = "bar-value";
  value.textContent = numberFormat.format(count);
  heading.append(name, value);
  const track = document.createElement("div");
  track.className = "bar-track";
  const fill = document.createElement("span");
  fill.className = `bar-fill ${variant}`.trim();
  fill.style.width = `${max ? Math.max((count / max) * 100, 1) : 0}%`;
  track.append(fill);
  row.append(heading, track);
  return row;
}

function renderPairedBars(targetId, rows) {
  const target = document.querySelector(`#${targetId}`);
  const max = Math.max(1, ...rows.flatMap((row) => [row.open, row.closed]));
  const fragment = document.createDocumentFragment();

  if (!rows.length) {
    const empty = document.createElement("p");
    empty.className = "chart-empty";
    empty.textContent = "Sem registros para os filtros selecionados.";
    target.replaceChildren(empty);
    return;
  }

  for (const item of rows) {
    const row = document.createElement("div");
    row.className = "paired-row";
    const label = document.createElement("div");
    label.className = "paired-label";
    if (item.atcs) {
      const name = document.createElement("strong");
      name.textContent = item.label;
      const codes = document.createElement("small");
      codes.textContent = item.atcs.length
        ? `ATC ${item.atcs.join(", ")}`
        : "ATC não informado";
      label.append(name, codes);
      label.title = `${item.label} · ATC ${item.atcs.join(", ") || "não informado"}`;
    } else {
      label.textContent = item.label;
      label.title = item.label;
    }
    row.append(label);
    for (const key of ["open", "closed"]) {
      const line = document.createElement("div");
      line.className = `paired-line paired-${key}`;
      const track = document.createElement("div");
      track.className = "paired-track";
      const fill = document.createElement("span");
      fill.className = "paired-fill";
      fill.style.width = `${item[key] ? Math.max((item[key] / max) * 100, 1) : 0}%`;
      track.append(fill);
      const value = document.createElement("span");
      value.className = "paired-value";
      value.textContent = numberFormat.format(item[key]);
      line.append(track, value);
      row.append(line);
    }
    fragment.append(row);
  }
  target.replaceChildren(fragment);
}

function renderSingleBars(targetId, rows) {
  const target = document.querySelector(`#${targetId}`);
  const max = Math.max(1, ...rows.map((row) => row.count));
  if (!rows.length) {
    const empty = document.createElement("p");
    empty.className = "chart-empty";
    empty.textContent = "Sem registros para os filtros selecionados.";
    target.replaceChildren(empty);
    return;
  }
  target.replaceChildren(...rows.map((row) => createBarRow(row.label, row.count, max)));
}

function createSvgElement(tag, attributes = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
  return element;
}

function renderTrendChart(open = dashboardData.open, closed = dashboardData.closed) {
  const allMonths = new Map();
  for (const [source, stats] of [["open", open], ["closed", closed]]) {
    for (const row of stats.months) {
      const current = allMonths.get(row.month) || { month: row.month, open: 0, closed: 0 };
      current[source] = row.count;
      allMonths.set(row.month, current);
    }
  }

  const sorted = [...allMonths.values()].sort((a, b) => a.month.localeCompare(b.month));
  const period = elements.trendPeriod.value;
  const rows = period === "all" ? sorted : sorted.slice(-Number(period));
  const maxValue = Math.max(1, ...rows.flatMap((row) => [row.open, row.closed]));
  const tickStep = Math.max(1, Math.ceil(maxValue / 4 / 10) * 10);
  const top = Math.ceil(maxValue / tickStep) * tickStep;
  const left = 2;
  const right = 798;
  const chartTop = 8;
  const chartBottom = 184;
  const x = (index) => rows.length < 2 ? (left + right) / 2 : left + (index * (right - left)) / (rows.length - 1);
  const y = (value) => chartBottom - (value / top) * (chartBottom - chartTop);

  const yLabels = [];
  const gridlines = [];
  for (let value = top; value >= 0; value -= tickStep) {
    yLabels.push(numberFormat.format(value));
    const line = document.createElement("i");
    line.style.top = `${((top - value) / top) * 100}%`;
    gridlines.push(line);
  }
  elements.trendYAxis.replaceChildren(...yLabels.map((label) => {
    const span = document.createElement("span");
    span.textContent = label;
    return span;
  }));
  elements.trendGridlines.replaceChildren(...gridlines);

  const labelsCount = Math.min(rows.length, 8);
  const shownLabels = new Set();
  for (let index = 0; index < labelsCount; index += 1) {
    shownLabels.add(Math.round((index * (rows.length - 1)) / Math.max(1, labelsCount - 1)));
  }
  elements.trendXAxis.replaceChildren(...rows.map((row, index) => {
    const span = document.createElement("span");
    span.textContent = shownLabels.has(index) ? formatMonth(row.month) : "";
    return span;
  }));

  const paths = [];
  for (const source of ["open", "closed"]) {
    const points = rows.map((row, index) => [x(index), y(row[source])]);
    if (!points.length) continue;
    paths.push(createSvgElement("path", {
      d: points.map(([pointX, pointY], index) => `${index ? "L" : "M"}${pointX},${pointY}`).join(" "),
      class: `trend-line trend-${source}`,
    }));
    points.forEach(([pointX, pointY], index) => {
      if (index === points.length - 1) {
        paths.push(createSvgElement("circle", {
          cx: pointX, cy: pointY, r: 4, class: `trend-point trend-point-${source}`,
        }));
      }
    });
  }
  elements.trendChart.replaceChildren(...paths);
  elements.trendChart.setAttribute(
    "aria-label",
    `Registros por mês de inserção, comparando ${numberFormat.format(open.rows)} em aberto e ${numberFormat.format(closed.rows)} encerrados`,
  );
}

function renderInsights(open, closed) {
  const overdueRate = percent(open.overdue, open.rows);
  const largestCity = mergeGroups(open.cities, closed.cities, 1)[0];
  const topFamily = mergeGroups(open.families, closed.families, 1)[0];

  document.querySelector("#insight-overdue").textContent = `${overdueRate} dos registros abertos estão fora do prazo`;
  document.querySelector("#insight-overdue-detail").textContent =
    `${numberFormat.format(open.overdue)} de ${numberFormat.format(open.rows)} registros, conforme a data-limite da CLista.`;
  document.querySelector("#insight-city").textContent = largestCity?.label || "Sem dados de município";
  document.querySelector("#insight-city-detail").textContent = largestCity
    ? `${numberFormat.format(largestCity.open + largestCity.closed)} registros somando as duas listas.`
    : "A planilha não tem municípios preenchidos.";
  document.querySelector("#insight-family").textContent = topFamily?.label || "Sem dados de família";
  document.querySelector("#insight-family-detail").textContent = topFamily
    ? `${numberFormat.format(topFamily.open + topFamily.closed)} registros nas duas listas.`
    : "A planilha não tem famílias preenchidas.";
  const totalRows = open.rows + closed.rows;
  const missingDates = open.missingScheduled + closed.missingScheduled;
  document.querySelector("#insight-schedule").textContent =
    `${numberFormat.format(missingDates)} registros sem data agendada`;
  document.querySelector("#insight-schedule-detail").textContent =
    `${percent(missingDates, totalRows)} das linhas não têm “Data Agendada” preenchida.`;
}

function getSelectedRecords() {
  const filters = Object.fromEntries(
    Object.entries(elements.filters).map(([key, select]) => [key, select.value]),
  );
  return dashboardData.records.filter((record) =>
    (filters.source === "all" || record.source === filters.source) &&
    (filters.pole === "all" || record.pole === filters.pole) &&
    (filters.month === "all" || record.month === filters.month) &&
    (filters.city === "all" || record.city === filters.city) &&
    (filters.priority === "all" || record.priority === filters.priority) &&
    (filters.family === "all" || record.family === filters.family) &&
    (filters.status === "all" || record.status === filters.status),
  );
}

function buildFilteredDashboard(records) {
  const cutoff = dashboardData.asOf;
  const groups = {
    open: {
      months: new Map(), poles: new Map(), families: new Map(), cities: new Map(), priorities: new Map(),
      initiative: new Map(), tss: new Map(), statuses: new Map(), aging: new Map([
        ["1 a 7 dias", 0], ["8 a 30 dias", 0], ["31 a 90 dias", 0], ["Mais de 90 dias", 0],
      ]),
      poleCodes: new Map(), orderIds: new Set(), rows: 0, overdue: 0, missingScheduled: 0,
    },
    closed: {
      months: new Map(), poles: new Map(), families: new Map(), cities: new Map(), priorities: new Map(),
      initiative: new Map(), tss: new Map(), causes: new Map(), statuses: new Map(),
      poleCodes: new Map(), orderIds: new Set(), rows: 0, closed: 0, cancelled: 0, missingScheduled: 0,
    },
  };
  const add = (group, value) => {
    if (value) group.set(value, (group.get(value) || 0) + 1);
  };

  for (const record of records) {
    const stats = groups[record.source];
    stats.rows += 1;
    if (record.orderId) stats.orderIds.add(record.orderId);
    if (record.month) add(stats.months, record.month);
    add(stats.poles, record.pole);
    if (record.atc || record.pole === "NÃO MAPEADO") {
      const codes = stats.poleCodes.get(record.pole) || new Set();
      codes.add(record.atc || "SEM ATC");
      stats.poleCodes.set(record.pole, codes);
    }
    add(stats.families, record.family);
    add(stats.cities, record.city);
    add(stats.priorities, record.priority);
    add(stats.initiative, record.initiative);
    add(stats.tss, record.tss);
    add(stats.statuses, record.status);
    if (!record.scheduled) stats.missingScheduled += 1;

    if (record.source === "open" && record.deadline && record.deadline < cutoff) {
      stats.overdue += 1;
      const lateDays = Math.floor(
        (
          Date.UTC(cutoff.getFullYear(), cutoff.getMonth(), cutoff.getDate()) -
          Date.UTC(record.deadline.getFullYear(), record.deadline.getMonth(), record.deadline.getDate())
        ) / 86400000,
      );
      const bucket = lateDays <= 7
        ? "1 a 7 dias"
        : lateDays <= 30
          ? "8 a 30 dias"
          : lateDays <= 90
            ? "31 a 90 dias"
            : "Mais de 90 dias";
      stats.aging.set(bucket, stats.aging.get(bucket) + 1);
    }
    if (record.source === "closed") {
      const status = record.status.toLocaleLowerCase("pt-BR");
      if (status === "fechada") stats.closed += 1;
      if (status === "cancelada") stats.cancelled += 1;
      add(stats.causes, record.cause);
    }
  }

  const sortedGroup = (group) =>
    [...group.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
  const normalizeStats = (stats) => ({
    ...stats,
    uniqueOrders: stats.orderIds.size,
    months: [...stats.months].sort(([first], [second]) => first.localeCompare(second))
      .map(([month, count]) => ({ month, count })),
    poles: poleOrder
      .filter((pole) => pole !== "NÃO MAPEADO" || stats.poles.has(pole))
      .map((label) => ({
        label,
        count: stats.poles.get(label) || 0,
        atcs: [...(stats.poleCodes.get(label) || [])],
      })),
    families: sortedGroup(stats.families),
    cities: sortedGroup(stats.cities),
    priorities: sortedGroup(stats.priorities),
    initiative: sortedGroup(stats.initiative),
    tss: sortedGroup(stats.tss),
    statuses: sortedGroup(stats.statuses),
    causes: sortedGroup(stats.causes || new Map()),
    aging: [...(stats.aging || new Map())].map(([label, count]) => ({ label, count })),
  });
  const open = normalizeStats(groups.open);
  const closed = normalizeStats(groups.closed);
  let overlap = 0;
  for (const orderId of open.orderIds) if (closed.orderIds.has(orderId)) overlap += 1;
  delete open.orderIds;
  delete closed.orderIds;
  return {
    open,
    closed,
    overlap,
    combinedUnique: open.uniqueOrders + closed.uniqueOrders - overlap,
  };
}

function renderDashboard() {
  const hasImportedRecords = Array.isArray(dashboardData.records);
  const filtered = hasImportedRecords ? getSelectedRecords() : [];
  const { open, closed, overlap, combinedUnique } = hasImportedRecords
    ? buildFilteredDashboard(filtered)
    : dashboardData;
  const totalUnique = combinedUnique;
  const filterValues = Object.values(elements.filters).map((select) => select.value);
  const activeFilters = filterValues.filter((value) => value !== "all").length;

  elements.filterPanel.classList.toggle("is-active", activeFilters > 0);
  elements.clearFilters.disabled = !hasImportedRecords || activeFilters === 0;
  elements.filterSummary.textContent = hasImportedRecords
    ? `${numberFormat.format(filtered.length)} de ${numberFormat.format(dashboardData.records.length)} registros no recorte atual.`
    : "Importe as planilhas para filtrar os registros.";
  elements.filterHint.textContent = hasImportedRecords
    ? activeFilters
      ? `${activeFilters} ${activeFilters === 1 ? "filtro aplicado" : "filtros aplicados"} · ${numberFormat.format(filtered.length)} registros correspondentes.`
      : "Filtros aplicados a todos os indicadores e gráficos."
    : "Selecione a CLista e a ELista para habilitar os filtros interativos.";

  document.querySelector("#metric-open").textContent = numberFormat.format(open.rows);
  document.querySelector("#metric-open-unique").textContent = `${numberFormat.format(open.uniqueOrders)} OS únicas`;
  document.querySelector("#metric-closed").textContent = numberFormat.format(closed.rows);
  document.querySelector("#metric-closed-detail").textContent =
    `${numberFormat.format(closed.closed)} fechadas · ${numberFormat.format(closed.cancelled)} cancelada`;
  document.querySelector("#metric-overdue").textContent = numberFormat.format(open.overdue);
  document.querySelector("#metric-overdue-rate").textContent = percent(open.overdue, open.rows);
  document.querySelector("#metric-unique").textContent = numberFormat.format(totalUnique);
  document.querySelector("#metric-overlap").textContent = `${numberFormat.format(overlap)} em ambas`;
  document.querySelector("#nav-open-count").textContent = numberFormat.format(open.rows);
  document.querySelector("#data-caption").textContent =
    `Dados de ${new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(dashboardData.asOf)} · ${numberFormat.format(open.rows + closed.rows)} registros nas duas listas.`;
  document.querySelector("#report-date").textContent =
    `Base atualizada em ${new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(dashboardData.asOf).replace(".", "")}`;
  document.querySelector("#source-files").textContent = dashboardData.files.join(" · ");

  renderInsights(open, closed);
  renderTrendChart(open, closed);
  renderPairedBars("pole-chart", mergePoles(open.poles, closed.poles));
  renderPairedBars("family-chart", mergeGroups(open.families, closed.families));
  renderSingleBars("status-chart", open.statuses);
  renderPairedBars("priority-chart", mergeGroups(open.priorities, closed.priorities, 5));
  renderPairedBars("municipality-chart", mergeGroups(open.cities, closed.cities));
  renderPairedBars("initiative-chart", mergeGroups(open.initiative, closed.initiative, 5));
  renderPairedBars("tss-chart", mergeGroups(open.tss, closed.tss));
  renderSingleBars("aging-chart", open.aging);
  renderSingleBars("cause-chart", closed.causes.slice(0, 8));
}

function populateFilter(select, defaultLabel, options) {
  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = defaultLabel;
  const values = options.filter(Boolean);
  const filterOptions = values.map((value) => {
    const option = document.createElement("option");
    option.value = typeof value === "string" ? value : value.value;
    option.textContent = typeof value === "string" ? value : value.label;
    return option;
  });
  select.replaceChildren(defaultOption, ...filterOptions);
  select.value = "all";
  select.disabled = false;
}

function enableDashboardFilters(records) {
  const months = [...new Set(records.map((record) => record.month).filter(Boolean))]
    .sort((first, second) => second.localeCompare(first));
  const unique = (key) => [...new Set(records.map((record) => record[key]).filter(Boolean))]
    .sort((first, second) => first.localeCompare(second, "pt-BR"));

  populateFilter(elements.filters.source, "Todas as bases", [
    { value: "open", label: "CLista — em aberto" },
    { value: "closed", label: "ELista — encerrados" },
  ]);
  populateFilter(elements.filters.pole, "Todos os polos", [
    ...poleOrder.filter((pole) => pole !== "NÃO MAPEADO"),
    ...(records.some((record) => record.pole === "NÃO MAPEADO") ? ["NÃO MAPEADO"] : []),
  ]);
  populateFilter(elements.filters.month, "Todo o período", months.map((month) => ({
    value: month,
    label: formatMonth(month),
  })));
  [...elements.filters.month.options].forEach((option) => {
    if (option.value !== "all") option.textContent = formatMonth(option.value);
  });
  populateFilter(elements.filters.city, "Todos os municípios", unique("city"));
  populateFilter(elements.filters.priority, "Todas as prioridades", unique("priority"));
  populateFilter(elements.filters.family, "Todas as famílias", unique("family"));
  populateFilter(elements.filters.status, "Todos os status", unique("status"));
}

function normalizeHeader(value) {
  return value.trim().toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeArchivePath(target) {
  const parts = target.startsWith("/") ? [] : ["xl"];
  for (const part of target.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part);
  }
  return parts.join("/");
}

async function readXlsxEntries(file) {
  if (!file.name.toLocaleLowerCase("pt-BR").endsWith(".xlsx")) {
    throw new Error(`“${file.name}” não é um arquivo .xlsx.`);
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  const view = new DataView(bytes.buffer);
  let endOffset = -1;
  for (let index = bytes.length - 22; index >= Math.max(0, bytes.length - 65557); index -= 1) {
    if (view.getUint32(index, true) === 0x06054b50) {
      endOffset = index;
      break;
    }
  }
  if (endOffset < 0) throw new Error(`Não foi possível ler o conteúdo ZIP de “${file.name}”.`);

  const decoder = new TextDecoder();
  const entryCount = view.getUint16(endOffset + 10, true);
  let offset = view.getUint32(endOffset + 16, true);
  const entries = new Map();

  for (let index = 0; index < entryCount; index += 1) {
    if (view.getUint32(offset, true) !== 0x02014b50) {
      throw new Error(`A estrutura de “${file.name}” está inválida.`);
    }
    const method = view.getUint16(offset + 10, true);
    const compressedSize = view.getUint32(offset + 20, true);
    const nameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    const localOffset = view.getUint32(offset + 42, true);
    const name = decoder.decode(bytes.slice(offset + 46, offset + 46 + nameLength));
    const dataOffset =
      localOffset + 30 + view.getUint16(localOffset + 26, true) + view.getUint16(localOffset + 28, true);
    const compressed = bytes.slice(dataOffset, dataOffset + compressedSize);
    let text;

    if (method === 0) {
      text = decoder.decode(compressed);
    } else if (method === 8 && typeof DecompressionStream === "function") {
      const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
      text = await new Response(stream).text();
    } else {
      throw new Error(`O navegador não consegue descompactar a planilha “${file.name}”.`);
    }

    entries.set(name, text);
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

function parseXml(entries, path, fileName) {
  const content = entries.get(path);
  if (!content) throw new Error(`A planilha “${fileName}” não contém ${path}.`);
  const document = new DOMParser().parseFromString(content, "application/xml");
  if (document.querySelector("parsererror")) throw new Error(`O XML interno de “${fileName}” está inválido.`);
  return document;
}

function excelCellValue(cell, sharedStrings) {
  const type = cell.getAttribute("t");
  if (type === "inlineStr") {
    return [...cell.querySelectorAll("is t")].map((node) => node.textContent).join("");
  }
  const value = cell.querySelector("v")?.textContent ?? "";
  if (type === "s") return sharedStrings[Number(value)] ?? "";
  if (type === "b") return value === "1";
  return value;
}

async function readWorksheet(file) {
  const entries = await readXlsxEntries(file);
  const workbook = parseXml(entries, "xl/workbook.xml", file.name);
  const relationships = parseXml(entries, "xl/_rels/workbook.xml.rels", file.name);
  const relationMap = new Map(
    [...relationships.querySelectorAll("Relationship")].map((relationship) => [
      relationship.getAttribute("Id"),
      relationship.getAttribute("Target"),
    ]),
  );
  const sharedDocument = entries.has("xl/sharedStrings.xml")
    ? parseXml(entries, "xl/sharedStrings.xml", file.name)
    : null;
  const sharedStrings = sharedDocument
    ? [...sharedDocument.querySelectorAll("si")].map((item) =>
        [...item.querySelectorAll("t")].map((node) => node.textContent).join(""),
      )
    : [];
  const sheet = workbook.querySelector("sheet");
  if (!sheet) throw new Error(`Nenhuma aba foi encontrada em “${file.name}”.`);
  const relationId =
    sheet.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id") ||
    sheet.getAttribute("r:id");
  const target = relationMap.get(relationId);
  if (!target) throw new Error(`Não foi possível localizar a aba da planilha “${file.name}”.`);
  const worksheet = parseXml(entries, normalizeArchivePath(target), file.name);
  const rows = [...worksheet.querySelectorAll("sheetData row")];
  if (rows.length < 2) throw new Error(`A aba da planilha “${file.name}” não contém registros.`);

  const toValues = (row) => {
    const values = [];
    for (const cell of row.querySelectorAll("c")) {
      const reference = cell.getAttribute("r").match(/^[A-Z]+/)?.[0];
      if (!reference) continue;
      let column = 0;
      for (const letter of reference) column = column * 26 + letter.charCodeAt(0) - 64;
      values[column - 1] = excelCellValue(cell, sharedStrings);
    }
    return values;
  };
  const headers = toValues(rows[0]).map((value) => normalizeHeader(String(value ?? "")));
  const headerIndex = new Map(headers.map((header, index) => [header, index]));
  const required = [
    "numero os",
    "status da operacao",
    "prioridade",
    "atc",
    "municipio",
    "familia",
    "iniciativa",
    "tss",
    "causa resultado",
    "data agendada",
    "data insercao",
    "prazo de execucao - fim",
  ];
  const missing = required.filter((header) => !headerIndex.has(header));
  if (missing.length) {
    throw new Error(`Colunas não encontradas em “${file.name}”: ${missing.join(", ")}.`);
  }
  return {
    fileName: file.name,
    rows: rows.slice(1).map(toValues).filter((values) => values.some((value) => String(value ?? "").trim())),
    column: (name) => headerIndex.get(normalizeHeader(name)),
  };
}

function parseReportDate(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    const days = Math.floor(value);
    const date = new Date(1899, 11, 30);
    date.setDate(date.getDate() + days);
    date.setTime(date.getTime() + Math.round((value - days) * 86400000));
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const match = String(value ?? "").trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!match) return null;
  const date = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function aggregateRows(workbook, isOpen, cutoff) {
  const groups = {
    months: new Map(),
    poles: new Map(),
    poleCodes: new Map(),
    families: new Map(),
    cities: new Map(),
    priorities: new Map(),
    statuses: new Map(),
    initiative: new Map(),
    tss: new Map(),
    causes: new Map(),
  };
  const orderIds = new Set();
  const records = [];
  let overdue = 0;
  let closed = 0;
  let cancelled = 0;
  let missingScheduled = 0;
  const aging = new Map([
    ["1 a 7 dias", 0],
    ["8 a 30 dias", 0],
    ["31 a 90 dias", 0],
    ["Mais de 90 dias", 0],
  ]);

  const valueAt = (row, header) => String(row[workbook.column(header)] ?? "").trim();
  const addGroup = (group, value) => {
    if (value) group.set(value, (group.get(value) || 0) + 1);
  };

  for (const row of workbook.rows) {
    const orderId = valueAt(row, "Número OS");
    if (orderId) orderIds.add(orderId);
    const rawAtc = valueAt(row, "ATC").replace(/\.0$/, "").replace(/^0+(?=\d)/, "");
    const pole = atcPoles.get(rawAtc) || "NÃO MAPEADO";
    const family = valueAt(row, "Família");
    const city = valueAt(row, "Município");
    const priority = valueAt(row, "Prioridade");
    const status = valueAt(row, "Status da Operação");
    const initiative = valueAt(row, "Iniciativa");
    const tss = valueAt(row, "TSS");
    const cause = valueAt(row, "Causa Resultado");
    const scheduled = Boolean(valueAt(row, "Data Agendada"));
    addGroup(groups.poles, pole);
    if (rawAtc || pole === "NÃO MAPEADO") {
      const codes = groups.poleCodes.get(pole) || new Set();
      codes.add(rawAtc || "SEM ATC");
      groups.poleCodes.set(pole, codes);
    }
    addGroup(groups.families, family);
    addGroup(groups.cities, city);
    addGroup(groups.priorities, priority);
    addGroup(groups.statuses, status);
    addGroup(groups.initiative, initiative);
    addGroup(groups.tss, tss);
    addGroup(groups.causes, cause);
    if (!scheduled) missingScheduled += 1;
    const insertionDate = parseReportDate(row[workbook.column("Data Inserção")]);
    const month = insertionDate
      ? `${insertionDate.getFullYear()}-${String(insertionDate.getMonth() + 1).padStart(2, "0")}`
      : "";
    if (month) {
      groups.months.set(month, (groups.months.get(month) || 0) + 1);
    }
    const deadline = isOpen ? parseReportDate(row[workbook.column("Prazo de Execução - Fim")]) : null;
    records.push({
      source: isOpen ? "open" : "closed",
      atc: rawAtc,
      pole,
      orderId,
      month,
      city,
      family,
      priority,
      status,
      initiative,
      tss,
      cause,
      scheduled,
      deadline,
    });
    if (isOpen) {
      if (deadline && deadline < cutoff) {
        overdue += 1;
        const lateDays = Math.floor(
          (
            Date.UTC(cutoff.getFullYear(), cutoff.getMonth(), cutoff.getDate()) -
            Date.UTC(deadline.getFullYear(), deadline.getMonth(), deadline.getDate())
          ) / 86400000,
        );
        const bucket = lateDays <= 7
          ? "1 a 7 dias"
          : lateDays <= 30
            ? "8 a 30 dias"
            : lateDays <= 90
              ? "31 a 90 dias"
              : "Mais de 90 dias";
        aging.set(bucket, aging.get(bucket) + 1);
      }
    } else {
      const status = valueAt(row, "Status da Operação").toLocaleLowerCase("pt-BR");
      if (status === "fechada") closed += 1;
      if (status === "cancelada") cancelled += 1;
    }
  }

  const sortedGroup = (group) =>
    [...group.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
  return {
    rows: workbook.rows.length,
    uniqueOrders: orderIds.size,
    overdue,
    missingScheduled,
    closed,
    cancelled,
    months: [...groups.months].sort(([first], [second]) => first.localeCompare(second))
      .map(([month, count]) => ({ month, count })),
    poles: [...groups.poles].map(([label, count]) => ({
      label,
      count,
      atcs: [...(groups.poleCodes.get(label) || [])],
    })),
    families: sortedGroup(groups.families),
    cities: sortedGroup(groups.cities),
    priorities: sortedGroup(groups.priorities),
    statuses: sortedGroup(groups.statuses),
    initiative: sortedGroup(groups.initiative),
    tss: sortedGroup(groups.tss),
    causes: sortedGroup(groups.causes),
    aging: [...aging].map(([label, count]) => ({ label, count })),
    orderIds,
    records,
  };
}

async function importWorkbooks(openFile, closedFile) {
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  const openWorkbook = await readWorksheet(openFile);
  const closedWorkbook = await readWorksheet(closedFile);
  const open = aggregateRows(openWorkbook, true, cutoff);
  const closed = aggregateRows(closedWorkbook, false, cutoff);
  let overlap = 0;
  for (const orderId of open.orderIds) if (closed.orderIds.has(orderId)) overlap += 1;

  return {
    open: { ...open, orderIds: undefined },
    closed: { ...closed, orderIds: undefined },
    records: [...open.records, ...closed.records],
    overlap,
    combinedUnique: open.uniqueOrders + closed.uniqueOrders - overlap,
    asOf: cutoff,
    files: [openFile.name, closedFile.name],
  };
}

function setFileName(input, target) {
  const file = input.files[0];
  document.querySelector(target).textContent = file?.name || "Selecione o arquivo XLSX correspondente";
  elements.importError.hidden = true;
}

document.querySelector("#open-import").addEventListener("click", () => {
  elements.importError.hidden = true;
  elements.importDialog.showModal();
});
document.querySelector("#close-import").addEventListener("click", () => elements.importDialog.close());
document.querySelector("#cancel-import").addEventListener("click", () => elements.importDialog.close());
elements.openFile.addEventListener("change", () => setFileName(elements.openFile, "#open-file-name"));
elements.closedFile.addEventListener("change", () => setFileName(elements.closedFile, "#closed-file-name"));
elements.trendPeriod.addEventListener("change", renderDashboard);
Object.values(elements.filters).forEach((select) => {
  select.addEventListener("change", renderDashboard);
});
elements.clearFilters.addEventListener("click", () => {
  Object.values(elements.filters).forEach((select) => {
    select.value = "all";
  });
  renderDashboard();
});

document.querySelectorAll(".main-nav .nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".main-nav .nav-link").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

elements.importForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  elements.importError.hidden = true;
  if (!elements.importForm.reportValidity()) return;

  elements.submitImport.disabled = true;
  elements.submitImport.textContent = "Lendo planilhas...";
  try {
    dashboardData = await importWorkbooks(elements.openFile.files[0], elements.closedFile.files[0]);
    enableDashboardFilters(dashboardData.records);
    renderDashboard();
    elements.importDialog.close();
    showToast("Indicadores atualizados com as duas planilhas.");
  } catch (error) {
    elements.importError.textContent = error instanceof Error
      ? error.message
      : "Não foi possível ler as planilhas. Confira os arquivos selecionados e tente novamente.";
    elements.importError.hidden = false;
  } finally {
    elements.submitImport.disabled = false;
    elements.submitImport.textContent = "Gerar indicadores";
  }
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
renderDashboard();
