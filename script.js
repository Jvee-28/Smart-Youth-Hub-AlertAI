const reportForm = document.getElementById('reportForm');
const list = document.getElementById('reportList');
const useLocationBtn = document.getElementById('useLocation');
const donateBtn = document.getElementById('donateBtn');

// Replace with your payment link (e.g., M-Pesa STK Push page or Flutterwave checkout)
donateBtn.href = 'https://mpesa.com/donate';

// Load saved reports from localStorage
const saved = JSON.parse(localStorage.getItem('alertai_reports') || '[]');

// Init map centered on Nakuru
const map = L.map('map').setView([-0.3031, 36.0800], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let markers = [];

function renderList() {
  list.innerHTML = '';
  saved.slice().reverse().forEach((r) => {
    const li = document.createElement('li');
    const dt = new Date(r.createdAt).toLocaleString();
    li.innerHTML = \`<strong>\${r.category}</strong> • <small>\${dt}</small><br/>\${r.description}<br/><small>\${r.lat.toFixed(5)}, \${r.lng.toFixed(5)}</small>\`;
    list.appendChild(li);
  });
}

function renderMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = saved.map(r => {
    const m = L.marker([r.lat, r.lng]).addTo(map);
    m.bindPopup(\`<b>\${r.category}</b><br/>\${r.description}\`);
    return m;
  });
}

renderList();
renderMarkers();

useLocationBtn.addEventListener('click', () => {
  if (!navigator.geolocation) return alert('Geolocation not supported');
  navigator.geolocation.getCurrentPosition((pos) => {
    document.getElementById('lat').value = pos.coords.latitude.toFixed(6);
    document.getElementById('lng').value = pos.coords.longitude.toFixed(6);
  }, (err) => alert('Could not get location: ' + err.message));
});

reportForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const category = document.getElementById('category').value.trim();
  const description = document.getElementById('description').value.trim();
  const lat = parseFloat(document.getElementById('lat').value);
  const lng = parseFloat(document.getElementById('lng').value);
  if (!category || !description || isNaN(lat) || isNaN(lng)) {
    alert('Please fill all fields'); return;
  }
  const report = { category, description, lat, lng, createdAt: Date.now() };
  saved.push(report);
  localStorage.setItem('alertai_reports', JSON.stringify(saved));
  renderList();
  renderMarkers();
  reportForm.reset();
  alert('Report submitted. Thank you for keeping the community safe!');
}); 
