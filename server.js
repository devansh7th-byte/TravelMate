const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const PORT = 3000;
const DB_FILE = path.join(__dirname, 'travelmate.db');

// --- Initialize Database ---
const db = new DatabaseSync(DB_FILE);

db.exec(`
  CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY,
    destination TEXT,
    dates TEXT,
    budget REAL,
    travellers TEXT,
    preferences TEXT,
    title TEXT,
    duration TEXT,
    currency TEXT,
    currencyCode TEXT
  );

  CREATE TABLE IF NOT EXISTS itinerary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id TEXT,
    day INTEGER,
    title TEXT,
    city TEXT,
    hotel TEXT,
    activities TEXT
  );

  CREATE TABLE IF NOT EXISTS packing (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id TEXT UNIQUE,
    items TEXT
  );

  CREATE TABLE IF NOT EXISTS budget (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id TEXT UNIQUE,
    expenses TEXT
  );
`);

// --- Seed Default Data if empty ---
const countTrips = db.prepare('SELECT COUNT(*) as count FROM trips').get();
if (countTrips.count === 0) {
  const insertTrip = db.prepare(`
    INSERT INTO trips (id, destination, dates, budget, travellers, preferences, title, duration, currency, currencyCode)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertItin = db.prepare(`
    INSERT INTO itinerary (trip_id, day, title, city, hotel, activities)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const insertPack = db.prepare(`INSERT INTO packing (trip_id, items) VALUES (?, ?)`);
  const insertBudget = db.prepare(`INSERT INTO budget (trip_id, expenses) VALUES (?, ?)`);

  // Default Kyoto Trip
  insertTrip.run(
    'kyoto',
    'Kyoto & Osaka, Japan',
    'Oct 14 - Oct 18',
    280000,
    'Couple (2 people)',
    JSON.stringify({ style: 'Cultural & Historic', pace: 'Relaxed', accommodation: 'Gion Traditional Ryokan Sano' }),
    'Kyoto & Osaka Autumn Serenade 🍂',
    '5 Days',
    '¥',
    'JPY'
  );

  const kyotoDays = [
    {
      day: 1,
      title: 'Arrive in Ancient Gion 🍵',
      city: 'Kyoto (Gion District)',
      hotel: 'Gion Ryokan Sano (Tatami & Garden View)',
      activities: {
        morning: { title: 'Morning Arrival & Machiya Tea', activities: ['Check-in at traditional wooden ryokan & change into yukata', 'Welcome matcha tea & wagashi sweet cake', 'Gentle orientation walk along Shirakawa Canal'], tip: '💡 Tip: Walk softly in wooden slippers!' },
        afternoon: { title: 'Kiyomizu-dera & Sannenzaka Lanes', activities: ['Ascend stone stairs past pottery shops to wooden stage', 'Sip from Otowa Spring fountains for sweet friendship', 'Sample hot cinnamon yatsuhashi cookies'], tip: '💡 Tip: Sannenzaka is prettiest right before golden hour.' },
        evening: { title: 'Lantern Glow & Kaiseki Dinner', activities: ['Multi-course seasonal Kaiseki banquet', 'Quiet evening lantern stroll along Hanamikoji alley', 'Soak in the aromatic cedar wood onsen bath'], tip: '💡 Tip: Silence camera shutter in private alleys.' }
      }
    },
    {
      day: 2,
      title: 'Torii Gates & Bamboo Whispers ⛩️',
      city: 'Kyoto (Fushimi & Arashiyama)',
      hotel: 'Gion Ryokan Sano',
      activities: {
        morning: { title: 'Fushimi Inari Vermillion Pathway', activities: ['Early morning 7:00 AM walk through 10,000 torii gates', 'Spot playful stone kitsune fox statues', 'Warm up with roasted hojicha tea'], tip: '💡 Tip: Go early before 8:30 AM.' },
        afternoon: { title: 'Arashiyama Bamboo Forest & River', activities: ['Take scenic Randen tram to bamboo grove', 'Visit Tenryu-ji zen landscape garden', 'Pick up handmade crafts by Togetsukyo Bridge'], tip: '💡 Tip: % Arabica coffee kiosk has great river views.' },
        evening: { title: 'Pontocho Alley Izakaya Treats', activities: ['Cozy dinner at narrow Pontocho alley', 'Crispy tempura & chilled peach cider', 'Sit along Kamogawa riverbank grass'], tip: '💡 Tip: Look for restaurants with wooden river terraces.' }
      }
    },
    {
      day: 3,
      title: 'Golden Pavilion & Tea Ceremony 🎋',
      city: 'Kyoto (Northern District)',
      hotel: 'Gion Ryokan Sano',
      activities: {
        morning: { title: 'Kinkaku-ji Golden Reflection', activities: ['Visit shimmering Golden Pavilion', 'Stroll through moss gardens and lucky stone statues', 'Browse sweet amulet charms'], tip: '💡 Tip: Morning light hits the gold leaf facade nicely.' },
        afternoon: { title: 'Private Uji Matcha Workshop', activities: ['Stone grinding organic green tea leaves', 'Whisking technique from tea master', 'Melt-in-mouth sugar candy flowers'], tip: '💡 Tip: Slurping the final sip signals gratitude!' },
        evening: { title: 'Nishiki Market Evening Tasting', activities: ['Wander Kyoto Kitchen for skewers & dango', 'Shop for handcrafted knives & chopstick rests', 'Pack small bags for Osaka'], tip: '💡 Tip: Market stalls stop cooking around 6:00 PM.' }
      }
    }
  ];

  for (const d of kyotoDays) {
    insertItin.run(d.day, d.title, d.city, d.hotel, JSON.stringify(d.activities), 'kyoto');
  }

  insertPack.run(
    'kyoto',
    JSON.stringify([
      { category: 'documents', text: 'Passport & Visas', packed: true },
      { category: 'documents', text: 'Hotel confirmations & train passes', packed: true },
      { category: 'clothing', text: 'Comfortable temple-walking sneakers', packed: true },
      { category: 'clothing', text: 'Light pastel knitwear cardigan', packed: true },
      { category: 'electronics', text: 'Universal power plug adapter', packed: true },
      { category: 'electronics', text: '10,000mAh Powerbank + cables', packed: true },
      { category: 'toiletries', text: 'Hydrating lip balm & sunscreen', packed: true }
    ])
  );

  insertBudget.run(
    'kyoto',
    JSON.stringify([
      { category: '🏨 Stay', item: 'Gion Traditional Ryokan Deposit (2 Nights)', date: 'Oct 14', amount: 84000 },
      { category: '🚅 Transport', item: 'Kansai Area 5-Day Train Pass (2x)', date: 'Oct 14', amount: 24000 },
      { category: '🍜 Food & Drinks', item: 'Nishiki Market Morning Skewers & Wagyu', date: 'Oct 15', amount: 7800 },
      { category: '🎟️ Sightseeing', item: 'Tea Ceremony Masterclass in Uji', date: 'Oct 16', amount: 14600 }
    ])
  );

  // Default Bali Trip
  insertTrip.run(
    'bali',
    'Bali, Indonesia',
    'Nov 02 - Nov 09',
    1450,
    'Friends (4 people)',
    JSON.stringify({ style: 'Beach & Island Chill', pace: 'Relaxed', accommodation: 'Boutique Ubud Pool Villa' }),
    'Bali Tropical Villa Retreat 🌴',
    '7 Days',
    '$',
    'USD'
  );

  // Default Paris Trip
  insertTrip.run(
    'paris',
    'Paris, France',
    'April 18 - April 22',
    1100,
    'Solo Explorer',
    JSON.stringify({ style: 'Cultural & Historic', pace: 'Relaxed', accommodation: 'Saint-Germain Cozy Boutique Hotel' }),
    'Paris Patisserie & Bookshops 🥐',
    '4 Days',
    '€',
    'EUR'
  );
}

// --- Helper to parse JSON body ---
function readJSON(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// --- Send JSON Response ---
function sendJSON(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// --- Static File Server ---
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function serveStatic(req, res, filePath) {
  const ext = path.extname(filePath);
  const mime = MIME_TYPES[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': mime });
      res.end(content);
    }
  });
}

// --- HTTP Server ---
const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  try {
    // 1. GET /api/trips (List all trips)
    if (req.method === 'GET' && pathname === '/api/trips') {
      const rows = db.prepare('SELECT * FROM trips').all();
      const trips = rows.map(r => ({
        ...r,
        preferences: JSON.parse(r.preferences || '{}')
      }));
      return sendJSON(res, 200, trips);
    }

    // 2. POST /api/trips (Create trip)
    if (req.method === 'POST' && pathname === '/api/trips') {
      const data = await readJSON(req);
      const id = data.id || 'trip_' + Date.now();
      const insert = db.prepare(`
        INSERT INTO trips (id, destination, dates, budget, travellers, preferences, title, duration, currency, currencyCode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insert.run(
        id,
        data.destination || '',
        data.dates || '',
        Number(data.budget) || 0,
        data.travellers || '',
        JSON.stringify(data.preferences || {}),
        data.title || 'My Trip',
        data.duration || '',
        data.currency || '$',
        data.currencyCode || 'USD'
      );

      // Save initial itinerary days if provided
      if (Array.isArray(data.days) && data.days.length > 0) {
        const insertItin = db.prepare(`
          INSERT INTO itinerary (trip_id, day, title, city, hotel, activities)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        for (const d of data.days) {
          insertItin.run(
            id,
            d.dayNum || d.day || 1,
            d.title || `Day ${d.dayNum || 1}`,
            d.city || '',
            d.hotel || '',
            JSON.stringify(d.activities || { morning: d.morning, afternoon: d.afternoon, evening: d.evening })
          );
        }
      }

      return sendJSON(res, 201, { success: true, id });
    }

    // Trip ID Matcher: /api/trips/:id(/...)
    const tripMatch = pathname.match(/^\/api\/trips\/([^/]+)(\/(itinerary|packing|budget))?$/);
    if (tripMatch) {
      const tripId = decodeURIComponent(tripMatch[1]);
      const subResource = tripMatch[3];

      // 3. GET /api/trips/:id (Single trip with full details)
      if (req.method === 'GET' && !subResource) {
        const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(tripId);
        if (!trip) return sendJSON(res, 404, { error: 'Trip not found' });

        trip.preferences = JSON.parse(trip.preferences || '{}');

        // Fetch itinerary
        const itinRows = db.prepare('SELECT * FROM itinerary WHERE trip_id = ? ORDER BY day ASC').all(tripId);
        trip.days = itinRows.map(r => ({
          dayNum: r.day,
          title: r.title,
          city: r.city,
          hotel: r.hotel,
          activities: JSON.parse(r.activities || '{}')
        }));

        // Fetch packing
        const packRow = db.prepare('SELECT items FROM packing WHERE trip_id = ?').get(tripId);
        trip.packing = packRow ? JSON.parse(packRow.items || '[]') : [];

        // Fetch budget
        const budgetRow = db.prepare('SELECT expenses FROM budget WHERE trip_id = ?').get(tripId);
        trip.expenses = budgetRow ? JSON.parse(budgetRow.expenses || '[]') : [];

        return sendJSON(res, 200, trip);
      }

      // 4. PUT /api/trips/:id (Update trip)
      if (req.method === 'PUT' && !subResource) {
        const data = await readJSON(req);
        const update = db.prepare(`
          UPDATE trips
          SET destination = ?, dates = ?, budget = ?, travellers = ?, preferences = ?, title = ?, duration = ?, currency = ?, currencyCode = ?
          WHERE id = ?
        `);
        update.run(
          data.destination || '',
          data.dates || '',
          Number(data.budget) || 0,
          data.travellers || '',
          JSON.stringify(data.preferences || {}),
          data.title || '',
          data.duration || '',
          data.currency || '$',
          data.currencyCode || 'USD',
          tripId
        );
        return sendJSON(res, 200, { success: true });
      }

      // 5. DELETE /api/trips/:id (Delete trip and associated data)
      if (req.method === 'DELETE' && !subResource) {
        db.prepare('DELETE FROM trips WHERE id = ?').run(tripId);
        db.prepare('DELETE FROM itinerary WHERE trip_id = ?').run(tripId);
        db.prepare('DELETE FROM packing WHERE trip_id = ?').run(tripId);
        db.prepare('DELETE FROM budget WHERE trip_id = ?').run(tripId);
        return sendJSON(res, 200, { success: true, deleted: tripId });
      }

      // 6. Itinerary Sub-resource
      if (subResource === 'itinerary') {
        if (req.method === 'GET') {
          const rows = db.prepare('SELECT * FROM itinerary WHERE trip_id = ? ORDER BY day ASC').all(tripId);
          const days = rows.map(r => ({
            dayNum: r.day,
            title: r.title,
            city: r.city,
            hotel: r.hotel,
            activities: JSON.parse(r.activities || '{}')
          }));
          return sendJSON(res, 200, days);
        }
        if (req.method === 'PUT') {
          const data = await readJSON(req);
          db.prepare('DELETE FROM itinerary WHERE trip_id = ?').run(tripId);
          const insertItin = db.prepare(`
            INSERT INTO itinerary (trip_id, day, title, city, hotel, activities)
            VALUES (?, ?, ?, ?, ?, ?)
          `);
          for (const d of (data.days || [])) {
            insertItin.run(
              tripId,
              d.dayNum || d.day || 1,
              d.title || '',
              d.city || '',
              d.hotel || '',
              JSON.stringify(d.activities || { morning: d.morning, afternoon: d.afternoon, evening: d.evening })
            );
          }
          return sendJSON(res, 200, { success: true });
        }
      }

      // 7. Packing Sub-resource
      if (subResource === 'packing') {
        if (req.method === 'GET') {
          const row = db.prepare('SELECT items FROM packing WHERE trip_id = ?').get(tripId);
          return sendJSON(res, 200, row ? JSON.parse(row.items || '[]') : []);
        }
        if (req.method === 'PUT') {
          const data = await readJSON(req);
          const items = Array.isArray(data) ? data : (data.items || []);
          db.prepare(`
            INSERT INTO packing (trip_id, items) VALUES (?, ?)
            ON CONFLICT(trip_id) DO UPDATE SET items = excluded.items
          `).run(tripId, JSON.stringify(items));
          return sendJSON(res, 200, { success: true });
        }
      }

      // 8. Budget Sub-resource
      if (subResource === 'budget') {
        if (req.method === 'GET') {
          const row = db.prepare('SELECT expenses FROM budget WHERE trip_id = ?').get(tripId);
          return sendJSON(res, 200, row ? JSON.parse(row.expenses || '[]') : []);
        }
        if (req.method === 'PUT') {
          const data = await readJSON(req);
          const expenses = Array.isArray(data) ? data : (data.expenses || []);
          db.prepare(`
            INSERT INTO budget (trip_id, expenses) VALUES (?, ?)
            ON CONFLICT(trip_id) DO UPDATE SET expenses = excluded.expenses
          `).run(tripId, JSON.stringify(expenses));
          return sendJSON(res, 200, { success: true });
        }
      }
    }

    // Static Frontend Files
    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return serveStatic(req, res, filePath);
    }

    sendJSON(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error('Server Error:', err);
    sendJSON(res, 500, { error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`TravelMate backend listening on http://localhost:${PORT}`);
});
