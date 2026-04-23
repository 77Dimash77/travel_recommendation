const btnSearch = document.getElementById('btnSearch');
const searchInput = document.getElementById('searchInput');

let travelData = null;

fetch('travel_recommendation_api.json')
  .then(response => response.json())
  .then(data => {
    travelData = data;
    console.log('Данные загружены:', travelData);
  })
  .catch(error => {
    console.error('Ошибка загрузки данных:', error);
  });

function getLocalTime(timeZone) {
  const options = { timeZone: timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return new Date().toLocaleTimeString('ru-RU', options);
}

function handleSearch() {
  if (!travelData) {
    alert('Данные ещё загружаются, попробуйте через секунду.');
    return;
  }

  const keyword = document.getElementById('searchInput').value.toLowerCase().trim();

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
    title = 'Результаты по запросу: ' + keyword;
  }

  const section = document.getElementById('results-section');
  const container = document.getElementById('results-container');
  const titleEl = document.getElementById('results-title');

  titleEl.textContent = title;

  if (results.length === 0) {
    container.innerHTML = '<p>Ничего не найдено. Попробуйте: пляж, храм или страна.</p>';
  } else {
    container.innerHTML = results.map(item => {
      const time = getLocalTime(item.timeZone);
      return `
        <div class="result-card">
          <img src="${item.imageUrl}" alt="${item.name}">
          <h3>${item.name}</h3>
          <span class="tag">${item.country || item.capital || ''}</span>
          <p>${item.description}</p>
          <p class="time">Местное время: ${time}</p>
        </div>`;
    }).join('');
  }

  section.style.display = 'block';
  section.scrollIntoView({ behavior: 'smooth' });
}

function handleReset() {
  document.getElementById('searchInput').value = '';
  document.getElementById('results-section').style.display = 'none';
  document.getElementById('results-container').innerHTML = '';
}

searchInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') handleSearch();
});
