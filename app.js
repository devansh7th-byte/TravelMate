/* ===================================================================
   TravelMate ✨ Cute Pastel Scrapbook App Logic (Connected to Backend)
   =================================================================== */

const API_BASE = (window.location.protocol === 'file:') ? 'http://localhost:3000/api' : '/api';

// --- API Service ---
const api = {
  async getTrips() {
    try {
      const res = await fetch(`${API_BASE}/trips`);
      if (!res.ok) throw new Error('API offline');
      return await res.json();
    } catch (e) {
      if (typeof tmDB !== 'undefined' && tmDB.getAllTrips) {
        return await tmDB.getAllTrips();
      }
      return [];
    }
  },

  async getTrip(id) {
    try {
      const res = await fetch(`${API_BASE}/trips/${id}`);
      if (!res.ok) throw new Error('Trip fetch failed');
      return await res.json();
    } catch (e) {
      if (typeof tmDB !== 'undefined' && tmDB.getTrip) {
        const trip = await tmDB.getTrip(id);
        if (trip) {
          const days = await tmDB.getItinerary(id);
          trip.days = days || [];
          trip.packing = await tmDB.getPacking(id) || [];
          trip.expenses = await tmDB.getBudget(id) || [];
          return trip;
        }
      }
      return null;
    }
  },

  async createTrip(tripData) {
    try {
      const res = await fetch(`${API_BASE}/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData)
      });
      if (!res.ok) throw new Error('Create failed');
      return await res.json();
    } catch (e) {
      if (typeof tmDB !== 'undefined' && tmDB.saveTrip) {
        await tmDB.saveTrip(tripData);
        await tmDB.saveItineraryDays(tripData.id, tripData.days || []);
        return { success: true, id: tripData.id };
      }
    }
  },

  async updateTrip(id, tripData) {
    try {
      const res = await fetch(`${API_BASE}/trips/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData)
      });
      return await res.json();
    } catch (e) {
      if (typeof tmDB !== 'undefined' && tmDB.saveTrip) {
        await tmDB.saveTrip({ ...tripData, id });
      }
    }
  },

  async deleteTrip(id) {
    try {
      const res = await fetch(`${API_BASE}/trips/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (e) {
      console.warn("Delete fallback:", e);
    }
  },

  async saveItinerary(id, days) {
    try {
      await fetch(`${API_BASE}/trips/${id}/itinerary`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days })
      });
    } catch (e) {
      if (typeof tmDB !== 'undefined') await tmDB.saveItineraryDays(id, days);
    }
  },

  async savePacking(id, items) {
    try {
      await fetch(`${API_BASE}/trips/${id}/packing`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items)
      });
    } catch (e) {
      if (typeof tmDB !== 'undefined') await tmDB.savePackingList(id, items);
    }
  },

  async saveBudget(id, expenses) {
    try {
      await fetch(`${API_BASE}/trips/${id}/budget`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenses)
      });
    } catch (e) {
      if (typeof tmDB !== 'undefined') await tmDB.saveExpenses(id, expenses);
    }
  }
};

let currentTrip = null;
let editingTripId = null;
let activeDayIndex = 1;
let currentSpentTotal = 0;
let currentBudgetTotal = 0;

// --- Navigation Handler ---
function switchSection(targetSectionId) {
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active-section'));

  const target = document.getElementById(targetSectionId);
  if (target) {
    target.classList.add('active-section');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === targetSectionId);
  });

  const mainNav = document.getElementById('mainNav');
  if (mainNav) mainNav.classList.remove('show');
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    switchSection(link.getAttribute('data-section'));
  });
});

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    const mainNav = document.getElementById('mainNav');
    mainNav.classList.toggle('show');
  });
}

// --- Date & Duration Helpers ---
const tripDepInput = document.getElementById('tripDeparture');
const tripRetInput = document.getElementById('tripReturn');
const tripDurDisplay = document.getElementById('tripDurationDisplay');

const today = new Date();
const defaultDep = new Date(today);
defaultDep.setDate(today.getDate() + 21);
const defaultRet = new Date(defaultDep);
defaultRet.setDate(defaultDep.getDate() + 4);

function formatDateToInput(d) {
  return d.toISOString().split('T')[0];
}

function updateDurationDisplay() {
  if (!tripDepInput || !tripRetInput || !tripDurDisplay) return;
  const d1 = new Date(tripDepInput.value);
  const d2 = new Date(tripRetInput.value);
  if (!isNaN(d1) && !isNaN(d2) && d2 >= d1) {
    const diffDays = Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
    tripDurDisplay.textContent = `${diffDays} Days, ${diffDays - 1} Nights`;
  } else {
    tripDurDisplay.textContent = `Please select valid return date`;
  }
}

if (tripDepInput && tripRetInput) {
  tripDepInput.value = formatDateToInput(defaultDep);
  tripRetInput.value = formatDateToInput(defaultRet);
  tripDepInput.addEventListener('change', updateDurationDisplay);
  tripRetInput.addEventListener('change', updateDurationDisplay);
  updateDurationDisplay();
}

// --- Render Itinerary ---
function renderItinerary(tripData) {
  if (!tripData) return;
  const titleElem = document.getElementById('itineraryTitle');
  const metaElem = document.getElementById('itineraryMeta');
  const paceTag = document.getElementById('itineraryPaceTag');
  const tabsContainer = document.getElementById('dayTabsContainer');

  const pref = tripData.preferences || {};
  if (titleElem) titleElem.textContent = tripData.title;
  if (metaElem) {
    metaElem.textContent = `📅 ${tripData.dates} • 👥 ${tripData.travellers} • 🏮 ${pref.accommodation || 'Cozy Stay'}`;
  }
  if (paceTag) {
    paceTag.textContent = `🐢 ${pref.pace || 'Relaxed'} Pace`;
  }

  tabsContainer.innerHTML = '';
  const days = tripData.days || [];
  if (days.length === 0) return;

  days.forEach((day) => {
    const dayNum = day.dayNum || day.day || 1;
    const btn = document.createElement('button');
    btn.className = `day-tab ${dayNum === activeDayIndex ? 'active' : ''}`;
    btn.dataset.day = dayNum;
    btn.textContent = `Day ${dayNum} 🌸`;
    btn.addEventListener('click', () => {
      activeDayIndex = dayNum;
      document.querySelectorAll('.day-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderDayContent(day);
    });
    tabsContainer.appendChild(btn);
  });

  const activeDay = days.find(d => (d.dayNum || d.day) === activeDayIndex) || days[0];
  if (activeDay) {
    activeDayIndex = activeDay.dayNum || activeDay.day || 1;
    renderDayContent(activeDay);
  }
}

function renderDayContent(day) {
  const displayContainer = document.getElementById('dayContentDisplay');
  if (!displayContainer) return;

  const acts = day.activities || {};
  const morning = day.morning || acts.morning || { title: "Morning Exploration", activities: ["Sightseeing stroll"], tip: "Comfortable shoes!" };
  const afternoon = day.afternoon || acts.afternoon || { title: "Afternoon Sights", activities: ["Local food & cafe visit"], tip: "Stay hydrated!" };
  const evening = day.evening || acts.evening || { title: "Evening Relax", activities: ["Dinner & night lights"], tip: "Save receipts!" };

  displayContainer.innerHTML = `
    <div class="day-overview-card">
      <div class="day-badge-col">
        <span class="cute-tag">Day ${day.dayNum || day.day || 1} Highlights</span>
        <h3>${day.title || 'Day Plan'}</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem;">📍 City / Area: <strong>${day.city || 'Scenic Spot'}</strong></p>
      </div>
      <div class="day-hotel-info">
        <span>🏨 Stay:</span>
        <span>${day.hotel || 'Cozy Hotel'}</span>
      </div>
    </div>

    <div class="time-slots-grid">
      <div class="slot-card slot-morning">
        <div class="slot-header"><span class="slot-time-badge">🌅 Morning (8:00 - 12:00)</span></div>
        <h4 class="slot-title">${morning.title}</h4>
        <ul class="slot-activity-list">${(morning.activities || []).map(act => `<li>${act}</li>`).join('')}</ul>
        <div class="slot-tip">${morning.tip || ''}</div>
      </div>

      <div class="slot-card slot-afternoon">
        <div class="slot-header"><span class="slot-time-badge">☀️ Afternoon (12:30 - 17:00)</span></div>
        <h4 class="slot-title">${afternoon.title}</h4>
        <ul class="slot-activity-list">${(afternoon.activities || []).map(act => `<li>${act}</li>`).join('')}</ul>
        <div class="slot-tip">${afternoon.tip || ''}</div>
      </div>

      <div class="slot-card slot-evening">
        <div class="slot-header"><span class="slot-time-badge">🌙 Evening (17:30 - 21:30)</span></div>
        <h4 class="slot-title">${evening.title}</h4>
        <ul class="slot-activity-list">${(evening.activities || []).map(act => `<li>${act}</li>`).join('')}</ul>
        <div class="slot-tip">${evening.tip || ''}</div>
      </div>
    </div>
  `;
}

// --- Trip Planner Form (Create & Edit) ---
const plannerForm = document.getElementById('tripPlannerForm');
if (plannerForm) {
  plannerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dest = document.getElementById('tripDestination').value;
    const dep = document.getElementById('tripDeparture').value;
    const ret = document.getElementById('tripReturn').value;
    const currency = document.getElementById('tripCurrency').value;
    const budgetVal = parseFloat(document.getElementById('tripBudget').value) || 2000;
    const travellerType = document.getElementById('travellerType').value;
    const travellerNum = document.getElementById('travellerCount').value;
    const style = document.getElementById('travelStyle').value;
    const accommodation = document.getElementById('accommodationType').value;
    const paceRadio = document.querySelector('input[name="tripPace"]:checked');
    const paceVal = paceRadio ? paceRadio.value : 'Relaxed';

    let numDays = 4;
    if (dep && ret) {
      const d1 = new Date(dep);
      const d2 = new Date(ret);
      const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
      if (diff > 0 && diff <= 14) numDays = diff;
    }

    const curMap = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', INR: '₹', AUD: 'A$' };
    const curSym = curMap[currency] || '$';

    if (editingTripId) {
      // EDIT OPERATION
      const updatedData = {
        title: `${dest} Getaway ✨`,
        destination: dest,
        dates: `${dep} to ${ret}`,
        duration: `${numDays} Days`,
        currency: curSym,
        currencyCode: currency,
        budget: budgetVal,
        travellers: `${travellerType.toUpperCase()} (${travellerNum} person${travellerNum > 1 ? 's' : ''})`,
        preferences: { style, pace: paceVal, accommodation }
      };

      await api.updateTrip(editingTripId, updatedData);
      editingTripId = null;
      document.querySelector('#tripPlannerForm button[type="submit"]').textContent = '✨ Generate & View Cute Itinerary';
      await loadAllTrips();
      await loadTripToItinerary(currentTrip.id);
      switchSection('itinerary');
      return;
    }

    // CREATE OPERATION
    const generatedDays = [];
    const activitiesPool = [
      {
        morning: "Scenic bakery breakfast & stroll along cobblestone historic lanes",
        afternoon: "Explore local cultural museum, botanical garden & tea cafe",
        evening: "Sunset viewpoint observation deck & candlelit regional cuisine",
        tip: "💡 Tip: Wear broken-in walking sneakers & bring a pocket camera!"
      },
      {
        morning: "Quiet early morning landmark visit before the crowds gather",
        afternoon: "Indie artisan craft market shopping & handmade souvenir stalls",
        evening: "Cozy bistro dining with dessert pastry & night photography",
        tip: "💡 Tip: Keep receipts in your travel diary envelope for memory scrapbooking."
      },
      {
        morning: "Nature coastal walk or tranquil park bamboo grove meditation",
        afternoon: "Hands-on cooking class or local culinary tasting tour",
        evening: "Acoustic music lounge or peaceful waterside terrace tea",
        tip: "💡 Tip: Take time to pause and write a postcard to a friend!"
      },
      {
        morning: "Specialty coffee tasting & neighborhood vintage bookstore stroll",
        afternoon: "Scenic boat cruise or panoramic cable car mountain ride",
        evening: "Celebratory farewell dinner featuring signature local recipes",
        tip: "💡 Tip: Double check packing checklist before sleep for smooth checkout."
      }
    ];

    for (let i = 1; i <= numDays; i++) {
      const poolItem = activitiesPool[(i - 1) % activitiesPool.length];
      generatedDays.push({
        dayNum: i,
        title: `Day ${i}: Exploring ${dest} 🌸`,
        city: dest.split(',')[0].trim(),
        hotel: accommodation,
        activities: {
          morning: {
            title: `Morning Discovery in ${dest.split(',')[0]}`,
            activities: [poolItem.morning, "Fresh breakfast buffet & specialty local tea or coffee", "Map orientation walk around the neighborhood square"],
            tip: poolItem.tip
          },
          afternoon: {
            title: "Afternoon Adventure & Sights",
            activities: [poolItem.afternoon, "Sample famous street snacks & regional desserts", "Snap cute polaroid snapshots for your album"],
            tip: "💡 Tip: Carry a light refillable water bottle and coin pouch."
          },
          evening: {
            title: "Evening Atmosphere & Dining",
            activities: [poolItem.evening, "Evening stroll past illuminated monuments and lanterns", "Relaxing night-time journal scribbles in your hotel room"],
            tip: "💡 Tip: Save daily museum tickets and transit stubs for the scrapbook!"
          }
        }
      });
    }

    const tripId = 'trip_' + Date.now();
    const newTrip = {
      id: tripId,
      title: `${dest} Joyful Escape ✨`,
      destination: dest,
      dates: `${dep} to ${ret}`,
      duration: `${numDays} Days`,
      currency: curSym,
      currencyCode: currency,
      budget: budgetVal,
      travellers: `${travellerType.toUpperCase()} (${travellerNum} person${travellerNum > 1 ? 's' : ''})`,
      preferences: { style, pace: paceVal, accommodation },
      days: generatedDays
    };

    await api.createTrip(newTrip);
    await loadAllTrips();
    await loadTripToItinerary(tripId);
    switchSection('itinerary');
  });
}

const resetBtn = document.getElementById('resetPlanBtn');
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    if (confirm("Reset the planning form to defaults? 🌸")) {
      plannerForm.reset();
      editingTripId = null;
      document.querySelector('#tripPlannerForm button[type="submit"]').textContent = '✨ Generate & View Cute Itinerary';
      updateDurationDisplay();
    }
  });
}

// --- Load and Render Trips (View, Edit, Delete) ---
async function loadAllTrips() {
  const tripsGrid = document.getElementById('myTripsGrid');
  if (!tripsGrid) return;

  const trips = await api.getTrips();
  tripsGrid.innerHTML = '';

  trips.forEach(trip => {
    const pref = trip.preferences || {};
    const card = document.createElement('div');
    card.className = `trip-journal-card ${currentTrip && currentTrip.id === trip.id ? 'active-journal' : ''}`;
    card.innerHTML = `
      <div class="tag-status confirmed">Confirmed 🌸</div>
      <div class="journal-img-box">
        <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80" alt="${trip.destination}">
        <div class="tape-corner"></div>
      </div>
      <div class="journal-body">
        <h3>${trip.title}</h3>
        <p class="journal-meta">🗓️ ${trip.dates} • ${trip.duration} • 👥 ${trip.travellers}</p>
        <p class="journal-desc">Pace: ${pref.pace || 'Relaxed'} • Style: ${pref.style || 'Scenic'} • Stay: ${pref.accommodation || 'Cozy Hotel'}.</p>
        <div class="journal-footer">
          <span class="budget-badge">${trip.currency || '$'}${Number(trip.budget).toLocaleString()}</span>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button class="btn btn-small btn-primary" onclick="loadTripToItinerary('${trip.id}')">Open 📖</button>
            <button class="btn btn-small btn-secondary" onclick="startEditTrip('${trip.id}')" title="Edit trip details">✏️</button>
            <button class="btn btn-small btn-tiny" onclick="deleteTripHandler('${trip.id}')" title="Delete trip">🗑️</button>
          </div>
        </div>
      </div>
    `;
    tripsGrid.appendChild(card);
  });
}

async function startEditTrip(tripId) {
  const trip = await api.getTrip(tripId);
  if (!trip) return;

  editingTripId = tripId;
  document.getElementById('tripDestination').value = trip.destination || '';
  document.getElementById('tripBudget').value = trip.budget || 2000;
  if (trip.currencyCode) document.getElementById('tripCurrency').value = trip.currencyCode;

  const pref = trip.preferences || {};
  if (pref.style) document.getElementById('travelStyle').value = pref.style;
  if (pref.accommodation) document.getElementById('accommodationType').value = pref.accommodation;
  if (pref.pace) {
    const radio = document.querySelector(`input[name="tripPace"][value="${pref.pace}"]`);
    if (radio) radio.checked = true;
  }

  const submitBtn = document.querySelector('#tripPlannerForm button[type="submit"]');
  if (submitBtn) submitBtn.textContent = '💾 Save Changes to Trip';

  switchSection('plan');
}

async function deleteTripHandler(tripId) {
  if (confirm("Are you sure you want to remove this trip from your scrapbook? 🗑️")) {
    await api.deleteTrip(tripId);
    await loadAllTrips();
    const remaining = await api.getTrips();
    if (remaining.length > 0) {
      await loadTripToItinerary(remaining[0].id);
    }
  }
}

// --- Load Single Trip into Itinerary, Packing, Budget ---
async function loadTripToItinerary(tripId) {
  const trip = await api.getTrip(tripId);
  if (!trip) return;

  currentTrip = trip;
  activeDayIndex = 1;
  currentBudgetTotal = Number(trip.budget) || 0;

  renderItinerary(trip);
  updateBudgetWithTrip(trip);
  renderPackingList(trip.packing || []);
  renderBudgetExpenses(trip.expenses || []);

  // Update active card indicator
  document.querySelectorAll('.trip-journal-card').forEach(c => c.classList.remove('active-journal'));

  switchSection('itinerary');
}

// --- Packing List Operations ---
function renderPackingList(items) {
  ['documents', 'clothing', 'electronics', 'toiletries'].forEach(c => {
    const el = document.getElementById(`list-${c}`);
    if (el) el.innerHTML = '';
  });

  items.forEach(it => {
    const target = document.getElementById(`list-${it.category}`) || document.getElementById('list-documents');
    if (target) {
      const li = document.createElement('li');
      li.innerHTML = `
        <label class="check-container">
          <input type="checkbox" ${it.packed ? 'checked' : ''}>
          <span class="custom-checkbox"></span>
          <span class="item-text">${it.text}</span>
        </label>
        <button class="btn-delete-item" title="Delete">✕</button>
      `;
      target.appendChild(li);
    }
  });
  updatePackingCounter();
}

function updatePackingCounter() {
  const allCheckboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
  const checkedBoxes = document.querySelectorAll('.checklist input[type="checkbox"]:checked');
  const countDisplay = document.getElementById('packingCount');
  const progressBar = document.getElementById('packingProgressBar');

  const total = allCheckboxes.length;
  const packed = checkedBoxes.length;

  if (countDisplay) countDisplay.textContent = `${packed} / ${total}`;
  if (progressBar) {
    const pct = total === 0 ? 0 : Math.round((packed / total) * 100);
    progressBar.style.width = `${pct}%`;
  }
}

function getPackingItemsFromDOM() {
  const items = [];
  document.querySelectorAll('.checklist').forEach(ul => {
    const cat = ul.getAttribute('data-cat') || 'documents';
    ul.querySelectorAll('li').forEach(li => {
      const cb = li.querySelector('input[type="checkbox"]');
      const textElem = li.querySelector('.item-text');
      if (cb && textElem) {
        items.push({ category: cat, text: textElem.textContent.trim(), packed: cb.checked });
      }
    });
  });
  return items;
}

document.addEventListener('change', async (e) => {
  if (e.target.matches('.checklist input[type="checkbox"]')) {
    updatePackingCounter();
    if (currentTrip) await api.savePacking(currentTrip.id, getPackingItemsFromDOM());
  }
});

document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('btn-delete-item')) {
    const li = e.target.closest('li');
    if (li) {
      li.remove();
      updatePackingCounter();
      if (currentTrip) await api.savePacking(currentTrip.id, getPackingItemsFromDOM());
    }
  }
});

const addPackingBtn = document.getElementById('addPackingBtn');
const newPackingInput = document.getElementById('newPackingItem');
const newPackingCat = document.getElementById('newPackingCategory');

if (addPackingBtn && newPackingInput) {
  addPackingBtn.addEventListener('click', async () => {
    const text = newPackingInput.value.trim();
    const cat = newPackingCat.value;
    if (!text) return alert("Please write an item name first! 🧳");

    const targetList = document.getElementById(`list-${cat}`);
    if (targetList) {
      const li = document.createElement('li');
      li.innerHTML = `
        <label class="check-container">
          <input type="checkbox">
          <span class="custom-checkbox"></span>
          <span class="item-text">${text}</span>
        </label>
        <button class="btn-delete-item" title="Delete">✕</button>
      `;
      targetList.appendChild(li);
      newPackingInput.value = '';
      updatePackingCounter();
      if (currentTrip) await api.savePacking(currentTrip.id, getPackingItemsFromDOM());
    }
  });
}

// --- Budget Operations ---
function renderBudgetExpenses(expenses) {
  const tbody = document.getElementById('expenseTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  let spent = 0;

  expenses.forEach(exp => {
    spent += Number(exp.amount) || 0;
    let pillClass = 'pill-food';
    if (exp.category.includes('Stay')) pillClass = 'pill-hotel';
    else if (exp.category.includes('Transport')) pillClass = 'pill-transit';
    else if (exp.category.includes('Activities') || exp.category.includes('Sightseeing')) pillClass = 'pill-activity';
    else if (exp.category.includes('Shopping')) pillClass = 'pill-shop';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="pill ${pillClass}">${exp.category}</span></td>
      <td>${exp.item}</td>
      <td>${exp.date || 'Today'}</td>
      <td class="cell-price">${currentTrip ? currentTrip.currency : '$'}${Number(exp.amount).toLocaleString()}</td>
      <td><button class="btn-table-del" onclick="deleteExpenseRow(this, ${exp.amount})">✕</button></td>
    `;
    tbody.appendChild(tr);
  });

  currentSpentTotal = spent;
  recalculateBudgetDisplays();
}

function updateBudgetWithTrip(trip) {
  const totalElem = document.getElementById('budgetTotalDisplay');
  currentBudgetTotal = Number(trip.budget) || 0;
  if (totalElem) totalElem.textContent = `${trip.currency || '$'}${currentBudgetTotal.toLocaleString()}`;
  recalculateBudgetDisplays();
}

function recalculateBudgetDisplays() {
  const spentElem = document.getElementById('budgetSpentDisplay');
  const leftElem = document.getElementById('budgetLeftDisplay');
  const curSymbol = currentTrip ? (currentTrip.currency || '$') : '$';

  if (spentElem) spentElem.textContent = `${curSymbol}${currentSpentTotal.toLocaleString()}`;
  const remaining = currentBudgetTotal - currentSpentTotal;
  if (leftElem) {
    leftElem.textContent = `${curSymbol}${remaining.toLocaleString()}`;
    leftElem.style.color = (remaining < 0) ? '#C92A2A' : 'var(--text-dark)';
  }
}

function getExpensesFromDOM() {
  const expenses = [];
  const rows = document.querySelectorAll('#expenseTableBody tr');
  rows.forEach(r => {
    const catPill = r.querySelector('.pill');
    const descCell = r.cells[1];
    const dateCell = r.cells[2];
    const costCell = r.querySelector('.cell-price');
    if (descCell && costCell) {
      const numAmount = parseFloat(costCell.textContent.replace(/[^0-9.]/g, '')) || 0;
      expenses.push({
        category: catPill ? catPill.textContent.trim() : 'Other',
        item: descCell.textContent.trim(),
        date: dateCell ? dateCell.textContent.trim() : 'Today',
        amount: numAmount
      });
    }
  });
  return expenses;
}

const addExpenseForm = document.getElementById('addExpenseForm');
if (addExpenseForm) {
  addExpenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('expenseName');
    const amountInput = document.getElementById('expenseAmount');
    const catSelect = document.getElementById('expenseCategory');
    const tableBody = document.getElementById('expenseTableBody');

    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value) || 0;
    const cat = catSelect.value;
    if (!name || amount <= 0) return;

    let pillClass = 'pill-food';
    if (cat.includes('Stay')) pillClass = 'pill-hotel';
    else if (cat.includes('Transport')) pillClass = 'pill-transit';
    else if (cat.includes('Activities')) pillClass = 'pill-activity';
    else if (cat.includes('Shopping')) pillClass = 'pill-shop';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="pill ${pillClass}">${cat}</span></td>
      <td>${name}</td>
      <td>Today</td>
      <td class="cell-price">${currentTrip ? currentTrip.currency : '$'}${amount.toLocaleString()}</td>
      <td><button class="btn-table-del" onclick="deleteExpenseRow(this, ${amount})">✕</button></td>
    `;
    tableBody.prepend(tr);

    currentSpentTotal += amount;
    recalculateBudgetDisplays();
    if (currentTrip) await api.saveBudget(currentTrip.id, getExpensesFromDOM());

    nameInput.value = '';
    amountInput.value = '';
  });
}

async function deleteExpenseRow(btn, amount) {
  const tr = btn.closest('tr');
  if (tr) {
    tr.remove();
    currentSpentTotal = Math.max(0, currentSpentTotal - amount);
    recalculateBudgetDisplays();
    if (currentTrip) await api.saveBudget(currentTrip.id, getExpensesFromDOM());
  }
}

// --- Destinations Filter & Prefill ---
function fillFormWithDest(destName, styleName, currencyCode) {
  const destInput = document.getElementById('tripDestination');
  const styleSelect = document.getElementById('travelStyle');
  const curSelect = document.getElementById('tripCurrency');

  if (destInput) destInput.value = destName;
  if (styleSelect) styleSelect.value = styleName;
  if (curSelect) curSelect.value = currencyCode;

  switchSection('plan');
}

document.querySelectorAll('.filter-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    const filterVal = pill.getAttribute('data-filter');
    const cards = document.querySelectorAll('.dest-polaroid');
    cards.forEach(card => {
      const cats = card.getAttribute('data-category') || '';
      card.style.display = (filterVal === 'all' || cats.includes(filterVal)) ? 'flex' : 'none';
    });
  });
});

// --- App Initialization ---
async function initApp() {
  await loadAllTrips();
  const trips = await api.getTrips();
  if (trips.length > 0) {
    await loadTripToItinerary(trips[0].id);
  }
}

initApp();
