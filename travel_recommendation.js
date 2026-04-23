let travelData = null;

fetch('travel_recommendation_api.json')
  .then(res => res.json())
  .then(data => {
    travelData = data;
    console.log('Данные загружены:', travelData);
  })
  .catch(err => console.error('Ошибка загрузки данных:', err));

function getLocalTime(timeZone) {
  const options = {
    timeZone,
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  return new Date().toLocaleTimeString('ru-RU', options);
}

function buildCard(item) {
  const time = getLocalTime(item.timeZone);
  return `
    <div class="result-card">
      <img src="${item.imageUrl}" alt="${item.name}" loading="lazy"
           onerror="this.src='https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600'" />
      <div class="card-body">
        <h3>${item.name}</h3>
        <span class="country-tag">${item.country || item.capital || ''}</span>
        <p>${item.description}</p>
        <p class="card-time"><i class="far fa-clock"></i> Местное время: ${time}</p>
      </div>
    </div>`;
}

function handleSearch() {
  if (!travelData) {
    alert('Данные ещё загружаются, попробуйте через секунду.');
    return;
  }

  const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
  if (!keyword) {
    alert('Введите ключевое слово для поиска.');
    return;
  }

  let results = [];
  let title = 'Результаты поиска';

  if (keyword === 'пляж' || keyword === 'пляжи' || keyword === 'beach' || keyword === 'beaches') {
    results = travelData.beaches;
    title = 'Рекомендуемые пляжи';
  } else if (keyword === 'храм' || keyword === 'храмы' || keyword === 'temple' || keyword === 'temples') {
    results = travelData.temples;
    title = 'Рекомендуемые храмы';
  } else if (keyword === 'страна' || keyword === 'страны' || keyword === 'country' || keyword === 'countries') {
    results = travelData.countries;
    title = 'Рекомендуемые страны';
  } else {
    const all = [...travelData.beaches, ...travelData.temples, ...travelData.countries];
    results = all.filter(item =>
      item.name.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword) ||
      (item.country && item.country.toLowerCase().includes(keyword))
    );
    title = `Результаты по запросу «${keyword}»`;
  }

  const section = document.getElementById('results-section');
  const container = document.getElementById('results-container');
  const titleEl = document.getElementById('results-title');

  titleEl.textContent = title;
  container.innerHTML = results.length
    ? results.map(buildCard).join('')
    : '<p style="text-align:center;color:#888;grid-column:1/-1">Ничего не найдено. Попробуйте: пляж, храм или страна.</p>';

  section.style.display = 'block';
  section.scrollIntoView({ behavior: 'smooth' });
}

function handleReset() {
  document.getElementById('searchInput').value = '';
  const section = document.getElementById('results-section');
  section.style.display = 'none';
  document.getElementById('results-container').innerHTML = '';
  document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
}

function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  alert(`Спасибо, ${name}! Ваше сообщение отправлено. Мы ответим вам в ближайшее время.`);
  form.reset();
}

document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleSearch();
});
