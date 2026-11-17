const models = [
  {
    id: 'bronze', type: 'garmon', category: 'Заказная гармонь', name: 'Заказная', layout: '25 × 25', voices: '3 голоса',
    description: 'Трёхголосная гармонь с бронзовой росписью. Тональность можно согласовать с фабрикой.',
    finishes: [{ label: 'Чёрная с бронзовой росписью', color: '#322522', image: 'bronze', page: '10/item-98' }]
  },
  {
    id: 'barynya', type: 'garmon', category: 'Заказная гармонь', name: 'Барыня', layout: '25 × 25', voices: '4 голоса',
    description: 'Четырёхголосная гармонь без регистра. Фабрика указывает два варианта настройки — в розлив и в унисон.',
    finishes: [
      { label: 'Бордовая с росписью', color: '#853533', image: 'barynya', page: '10/item-99' },
      { label: 'Белая с росписью', color: '#f3ecdc', image: 'barynya-white', page: '10/item-100' }
    ]
  },
  {
    id: 'chaika', type: 'garmon', category: 'Серийно-заказная гармонь', name: 'Чайка', layout: '19 × 12', voices: '2 голоса',
    description: 'Двухголосная гармонь без регистра. Тональность подбирают по пожеланию заказчика.',
    finishes: [
      { label: 'Зелёная с росписью', color: '#315847', image: 'chaika-green', page: '9/item-62' },
      { label: 'Синяя с росписью', color: '#213954', image: 'chaika', page: '9/item-63' }
    ]
  },
  {
    id: 'retro', type: 'garmon', category: 'Заказная гармонь', name: 'Шуйская ретро', layout: '25 × 25', voices: '3 голоса',
    description: 'Трёхголосная гармонь. Диапазон охватывает три октавы, строй выполняется по пожеланию заказчика.',
    finishes: [{ label: 'Корпус древесного тона', color: '#9a6439', image: 'retro', page: '10/item-120' }]
  },
  {
    id: 'romans', type: 'bayan', category: 'Баян', name: 'Романс', layout: '55 × 100', voices: '2 голоса',
    description: 'Двухголосый баян для сольной игры, оркестра и обучения. Настроен на 440 Гц по ноте ля первой октавы.',
    finishes: [{ label: 'Бордовый корпус', color: '#7e303c', image: 'romans', page: '5/item-57' }]
  },
  {
    id: 'shuya', type: 'bayan', category: 'Баян', name: 'Шуя', layout: '47 × 80', voices: '2 голоса',
    description: 'Двухголосый баян для учёбы, сольного и оркестрового исполнения с настройкой в унисон.',
    finishes: [
      { label: 'Синий корпус', color: '#355078', image: 'shuya', page: '5/item-56' },
      { label: 'Чёрный корпус', color: '#252325', image: 'shuya-black', page: '5/item-55' }
    ]
  }
];

const $ = selector => document.querySelector(selector);
const grid = $('#product-grid');
const filters = [...document.querySelectorAll('[data-filter]')];
const selectionTitle = $('#selection-title');
const selectionPhoto = $('#selection-photo');
const selectionType = $('#selection-type');
const selectionName = $('#selection-name');
const selectionDescription = $('#selection-description');
const selectionSpecs = $('#selection-specs');
const finishName = $('#finish-name');
const finishOptions = $('#finish-options');
const officialModel = $('#official-model');

let model = models[0];
let finish = model.finishes[0];

function instrumentName(product) {
  const kind = product.type === 'bayan' ? 'Баян' : 'Гармонь';
  return `${kind} «${product.name}»`;
}

function createProduct(product) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'product';
  card.dataset.model = product.id;
  card.setAttribute('aria-label', `Открыть карточку — ${instrumentName(product)}`);
  card.innerHTML = `
    <span class="product-art"><img src="assets/${product.finishes[0].image}.webp" alt="" width="400" height="330" loading="lazy"></span>
    <span class="product-info">
      <span class="product-type">${product.category}</span>
      <span class="product-title">«${product.name}»</span>
      <span class="product-meta">${product.layout} · ${product.voices}</span>
      <span class="product-arrow" aria-hidden="true">→</span>
    </span>`;
  return card;
}

for (const product of models) grid.append(createProduct(product));

filters.forEach(button => {
  button.addEventListener('click', () => {
    const kind = button.dataset.filter;
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    for (const card of grid.children) {
      const product = models.find(item => item.id === card.dataset.model);
      card.hidden = kind !== 'all' && product.type !== kind;
    }
  });
});

function setFinish(option) {
  finish = option;
  selectionPhoto.src = `assets/${finish.image}.webp`;
  selectionPhoto.alt = `${instrumentName(model)} — ${finish.label.toLocaleLowerCase('ru')}`;
  finishName.textContent = finish.label;
  officialModel.href = `https://accordions37.ru/products/${finish.page}/`;
}

function renderFinishes() {
  finishOptions.replaceChildren(...model.finishes.map((option, index) => {
    const label = document.createElement('label');
    label.title = option.label;
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'finish';
    radio.value = option.image;
    radio.checked = index === 0;
    radio.setAttribute('aria-label', option.label);
    radio.addEventListener('change', () => setFinish(option));
    const swatch = document.createElement('span');
    swatch.style.setProperty('--swatch', option.color);
    swatch.setAttribute('aria-hidden', 'true');
    label.append(radio, swatch);
    return label;
  }));
  setFinish(model.finishes[0]);
}

const audio = $('#audio');
const play = $('#play');
const progress = $('#audio-progress');
const waveform = $('#waveform');
const time = $('#audio-time');
const audioTitle = $('#audio-title');
const audioError = $('#audio-error');
const bars = [9,14,11,19,12,16,10,16,7,11,9,18,13,19,11,17,8,14,16,12,18,9,14,10,20,9,16,13,8,19,13,15,9,20,11,13,10,16,11,15,9,17,7,12].map(height => {
  const bar = document.createElement('i');
  bar.style.setProperty('--height', `${height}px`);
  return bar;
});
waveform.append(...bars);

function formatTime(seconds) {
  const value = Math.floor(seconds || 0);
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
}

function syncAudio() {
  const ready = Number.isFinite(audio.duration) && audio.duration > 0;
  const fraction = ready ? audio.currentTime / audio.duration : 0;
  const playing = !audio.paused && !audio.ended;
  play.classList.toggle('is-playing', playing);
  play.setAttribute('aria-label', playing ? 'Поставить на паузу' : 'Воспроизвести пример звучания');
  progress.disabled = !ready || !audio.seekable.length || !audio.seekable.end(audio.seekable.length - 1);
  progress.value = String(fraction * 100);
  progress.setAttribute('aria-valuetext', `${formatTime(audio.currentTime)} из ${formatTime(audio.duration)}`);
  time.textContent = ready ? formatTime(playing || audio.currentTime ? audio.currentTime : audio.duration) : '0:15';
  bars.forEach((bar, index) => bar.classList.toggle('is-past', index / bars.length < fraction));
}

function switchAudio() {
  audio.pause();
  audioError.hidden = true;
  audio.src = `assets/${model.type}.mp3`;
  audioTitle.textContent = model.type === 'bayan' ? 'Тембр баяна · пример' : 'Тембр гармони · пример';
  syncAudio();
}

play.addEventListener('click', async () => {
  if (!audio.paused) {
    audio.pause();
    return;
  }
  audioError.hidden = true;
  if (audio.error) audio.load();
  try {
    await audio.play();
  } catch (error) {
    if (error.name !== 'AbortError') audioError.hidden = false;
  }
});

for (const event of ['loadedmetadata', 'durationchange', 'progress', 'timeupdate', 'seeked', 'play', 'pause', 'ended', 'emptied']) {
  audio.addEventListener(event, syncAudio);
}
audio.addEventListener('error', () => { audioError.hidden = false; });
progress.addEventListener('input', () => {
  audio.currentTime = Number(progress.value) * audio.duration / 100;
});

function selectModel(product) {
  model = product;
  selectionType.textContent = model.category;
  selectionName.textContent = `«${model.name}»`;
  selectionDescription.textContent = model.description;
  selectionSpecs.innerHTML = `<div><dt>Клавиатуры</dt><dd>${model.layout}</dd></div><div><dt>Голосность</dt><dd>${model.voices}</dd></div>`;
  renderFinishes();
  switchAudio();
}

grid.addEventListener('click', event => {
  const card = event.target.closest('[data-model]');
  if (!card) return;
  selectModel(models.find(item => item.id === card.dataset.model));
  selectionTitle.focus({ preventScroll: true });
  $('#selection').scrollIntoView({ block: 'start' });
});

const menu = $('.menu');
const nav = $('#nav');

function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  nav.classList.toggle('open', open);
}

menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    setMenu(false);
    menu.focus();
  }
});
matchMedia('(max-width:850px)').addEventListener('change', () => setMenu(false));

const dialog = $('#inquiry-dialog');
const form = $('#inquiry-form');
const entry = $('#inquiry-entry');
const confirmation = $('#inquiry-confirm');
const summary = $('#inquiry-model');
const result = $('#inquiry-result');
const name = form.elements.namedItem('name');

$('#inquiry').addEventListener('click', () => {
  summary.textContent = `${instrumentName(model)} · ${finish.label}`;
  dialog.showModal();
  name.focus();
});

name.addEventListener('input', () => name.setCustomValidity(''));

form.addEventListener('submit', event => {
  event.preventDefault();
  name.setCustomValidity(name.value.trim() ? '' : 'Укажите имя.');
  if (!form.reportValidity()) return;
  entry.hidden = true;
  confirmation.hidden = false;
  result.textContent = summary.textContent;
  dialog.setAttribute('aria-labelledby', 'inquiry-confirm-title');
  $('#inquiry-confirm-title').focus();
});

dialog.addEventListener('click', event => {
  if (event.target.closest('[data-close]')) dialog.close();
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  form.reset();
  name.setCustomValidity('');
  entry.hidden = false;
  confirmation.hidden = true;
  summary.textContent = '';
  result.textContent = '';
  dialog.setAttribute('aria-labelledby', 'inquiry-title');
});

selectModel(model);
