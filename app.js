/* ===================================================================
   TravelMate ✨ Cute Pastel Scrapbook App Logic
   =================================================================== */

// --- 1. Realistic Mock Trips Data ---
const mockTripsData = {
  kyoto: {
    title: "Kyoto & Osaka Autumn Serenade 🍂",
    destination: "Kyoto & Osaka, Japan",
    dates: "Oct 14 - Oct 18",
    duration: "5 Days",
    currency: "¥",
    currencyCode: "JPY",
    budget: 280000,
    travellers: "Couple (2 people)",
    travellerCount: 2,
    style: "Cultural & Historic",
    pace: "Relaxed",
    accommodation: "Gion Traditional Ryokan Sano",
    days: [
      {
        dayNum: 1,
        title: "Arrive in Ancient Gion 🍵",
        city: "Kyoto (Gion District)",
        hotel: "Gion Ryokan Sano (Tatami & Garden View)",
        morning: {
          title: "Morning Arrival & Machiya Tea",
          activities: [
            "Check-in at traditional wooden ryokan & change into comfortable yukata",
            "Welcome matcha tea & wagashi sweet bean cake served in tatami parlor",
            "Gentle orientation walk along Shirakawa Canal's stone bridges"
          ],
          tip: "💡 Tip: Walk softly in wooden slippers and keep small change for vending machines!"
        },
        afternoon: {
          title: "Kiyomizu-dera & Sannenzaka Lanes",
          activities: [
            "Ascend stone stairs past pottery shops to the wooden Kiyomizu stage",
            "Sip from Otowa Spring fountains for health and sweet friendship",
            "Sample hot cinnamon yatsuhashi triangular cookies from street bakers"
          ],
          tip: "💡 Tip: Sannenzaka is prettiest right before golden hour sunset."
        },
        evening: {
          title: "Lantern Glow & Kaiseki Dinner",
          activities: [
            "Multi-course seasonal Kaiseki banquet with local tofu & simmered lotus",
            "Quiet evening lantern stroll along Hanamikoji alley in search of geiko",
            "Soak in the aromatic cedar wood onsen bath before tucking into futon"
          ],
          tip: "💡 Tip: Silence your camera shutter when walking through private alleys."
        }
      },
      {
        dayNum: 2,
        title: "Torii Gates & Bamboo Whispers ⛩️",
        city: "Kyoto (Fushimi & Arashiyama)",
        hotel: "Gion Ryokan Sano",
        morning: {
          title: "Fushimi Inari Vermillion Pathway",
          activities: [
            "Early morning 7:00 AM walk through 10,000 bright vermillion torii gates",
            "Spot playful stone kitsune fox statues holding granary keys",
            "Warm up with roasted hojicha tea near the mountain mid-crossing"
          ],
          tip: "💡 Tip: Go early before 8:30 AM to capture calm photos without the crowd."
        },
        afternoon: {
          title: "Arashiyama Bamboo Forest & River",
          activities: [
            "Take the scenic Randen tram to the whispering Arashiyama bamboo grove",
            "Visit Tenryu-ji zen landscape garden with reflection koi pond",
            "Pick up handmade cherrywood combs and matcha soft serve by Togetsukyo Bridge"
          ],
          tip: "💡 Tip: The % Arabica coffee kiosk by the riverbank has the sweetest latte view."
        },
        evening: {
          title: "Pontocho Alley Izakaya Treats",
          activities: [
            "Cozy dinner at narrow Pontocho alley overlooking the Kamogawa River",
            "Crunchy vegetable tempura, yakitori skewers, and chilled peach cider",
            "Sit along the riverbank grass with locals enjoying cool autumn breeze"
          ],
          tip: "💡 Tip: Look for restaurants with wooden river terraces (kawayuka)."
        }
      },
      {
        dayNum: 3,
        title: "Golden Pavilion & Tea Ceremony 🎋",
        city: "Kyoto (Northern District)",
        hotel: "Gion Ryokan Sano",
        morning: {
          title: "Kinkaku-ji Golden Reflection",
          activities: [
            "Visit the shimmering Golden Pavilion mirrored on Kyoko-chi mirror pond",
            "Stroll through the moss gardens and coin-tossing lucky stone statues",
            "Browse sweet amulet charms for safe travels and peaceful dreams"
          ],
          tip: "💡 Tip: Morning light hits the gold leaf facade at the perfect angle."
        },
        afternoon: {
          title: "Private Uji Matcha Workshop",
          activities: [
            "Hands-on stone grinding of organic green tea leaves into velvety powder",
            "Learn bamboo whisk (chasen) whisking technique from a tea master",
            "Enjoy bitter matcha paired with melt-in-mouth sugar candy flowers"
          ],
          tip: "💡 Tip: Slurping the final sip of tea politely signals your gratitude!"
        },
        evening: {
          title: "Nishiki Market Evening Tasting",
          activities: [
            "Wander 'Kyoto's Kitchen' for octopus skewers, tamagoyaki egg rolls & dango",
            "Shop for handcrafted chef knives and cute ceramic chopstick rests",
            "Pack small bags for tomorrow's short express ride to lively Osaka"
          ],
          tip: "💡 Tip: Most market stalls stop hot cooking around 6:00 PM."
        }
      },
      {
        dayNum: 4,
        title: "Transit to Neon Osaka 🚅",
        city: "Osaka (Namba & Dotonbori)",
        hotel: "Osaka Namba Cross Boutique Hotel",
        morning: {
          title: "Swift Train & Osaka Castle Grounds",
          activities: [
            "Hop on the rapid train to Osaka (only 35 scenic minutes)",
            "Explore massive stone moats & citrus trees surrounding Osaka Castle",
            "Panoramic observation deck view over the skyline"
          ],
          tip: "💡 Tip: Coin lockers at Osaka station easily hold large luggage."
        },
        afternoon: {
          title: "Shinsekai Retro Vintage District",
          activities: [
            "Walk beneath the iconic retro Tsutenkaku tower",
            "Crispy kushikatsu deep-fried skewers at a nostalgic昭和-era diner",
            "Browse quirky vintage capsule machines and local indie craft stores"
          ],
          tip: "💡 Tip: Remember the golden rule: never double-dip skewers in the shared sauce!"
        },
        evening: {
          title: "Dotonbori Glico Man & Canal Cruise",
          activities: [
            "Strike the runner pose under the giant neon Glico running man billboard",
            "Grab piping hot takoyaki octopus balls topped with dancing bonito flakes",
            "Hop on a 20-minute cheerful river boat cruise through singing city lights"
          ],
          tip: "💡 Tip: Takoyaki centers are lava-hot! Nibble a tiny corner first."
        }
      },
      {
        dayNum: 5,
        title: "Souvenir Haul & Farewell Sweets 🍣",
        city: "Osaka (Umeda & Airport)",
        hotel: "Departure Day",
        morning: {
          title: "Fluffy Souffle Pancakes in Nakazakicho",
          activities: [
            "Breakfast in Osaka's hipster bohemian neighborhood Nakazakicho",
            "Stack of 3-inch jiggly vanilla souffle pancakes with fresh berries",
            "Final stroll past independent indie stationery and washi tape shops"
          ],
          tip: "💡 Tip: Japanese cafes open around 10:00 AM, so take your time waking up."
        },
        afternoon: {
          title: "Last-Minute Department Store Hall",
          activities: [
            "Basement food hall (depachika) gift shopping: Tokyo Banana, Royce chocolates",
            "Collect colorful train stamps (Eki stamps) in your travel scrapbook",
            "Board the Haruka Express train directly to Kansai International Airport"
          ],
          tip: "💡 Tip: Keep passport handy for duty-free tax exemption discounts!"
        },
        evening: {
          title: "Airport Lounges & Sunset Takeoff",
          activities: [
            "Comfortable boarding gate coffee while sorting polaroid photos",
            "Reflect on favorite temple memories and delicious noodle bowls",
            "Fly home with heart and suitcase full of joy"
          ],
          tip: "💡 Tip: Write your top 3 trip highlights right on the flight home!"
        }
      }
    ]
  },
  bali: {
    title: "Bali Tropical Villa Retreat 🌴",
    destination: "Bali, Indonesia",
    dates: "Nov 02 - Nov 09",
    duration: "7 Days",
    currency: "$",
    currencyCode: "USD",
    budget: 1450,
    travellers: "Friends (4 people)",
    travellerCount: 4,
    style: "Beach & Island Chill",
    pace: "Relaxed",
    accommodation: "Boutique Ubud Pool Villa",
    days: [
      {
        dayNum: 1,
        title: "Warm Island Welcome & Frangipani 🌺",
        city: "Seminyak & Canggu",
        hotel: "Sunset Breeze Private Pool Villa",
        morning: {
          title: "Airport Pickup & Fresh Coconut",
          activities: [
            "Private villa driver pickup with sweet-smelling frangipani flower garlands",
            "Welcome fresh young coconut sipping by the private plunge pool",
            "Unpack sun dresses, sandals, and beach towels"
          ],
          tip: "💡 Tip: Download Grab or Gojek for effortless scooter & food delivery."
        },
        afternoon: {
          title: "Canggu Cafe Hopping & Boutique Strolls",
          activities: [
            "Acai and dragonfruit smoothie bowls at a bamboo open-air cafe",
            "Explore woven rattan bag boutiques and linen wear shops",
            "Chill lounge bed by Echo beach watching surfers catch breaks"
          ],
          tip: "💡 Tip: Mineral reef-safe sunscreen is a must for tropical sun."
        },
        evening: {
          title: "Sunset Cocktails at La Brisa",
          activities: [
            "Bohemian driftwood beach club seating as the sky turns flamingo pink",
            "Woodfired pizza, grilled prawns, and passion fruit mocktails",
            "Listen to gentle acoustic guitar while waves crash on the shore"
          ],
          tip: "💡 Tip: Reserve sunset daybeds at least 2 days ahead!"
        }
      },
      {
        dayNum: 2,
        title: "Ubud Rice Terraces & Swing 🌾",
        city: "Ubud Valley",
        hotel: "Sunset Breeze Private Pool Villa",
        morning: {
          title: "Tegallalang Sunrise Valley",
          activities: [
            "Walk through tiered emerald-green rice paddy steps in morning dew",
            "Experience the iconic jungle swing soaring high over palm tree canopy",
            "Learn how Subak ancient water irrigation preserves Balinese farms"
          ],
          tip: "💡 Tip: Wear bright yellow or pink to pop against the green terrace backdrops!"
        },
        afternoon: {
          title: "Sacred Monkey Forest Sanctuary",
          activities: [
            "Shaded walk among ancient banyan trees with hanging moss vines",
            "Watch baby long-tailed macaques play near mossy dragon fountains",
            "Explore Ubud Traditional Art Market for hand-carved wooden plates"
          ],
          tip: "💡 Tip: Tuck away sunglasses, earrings, and loose items from curious monkeys."
        },
        evening: {
          title: "Balinese Herb Spa & Duck Feast",
          activities: [
            "90-minute traditional Balinese massage with warm lemongrass oils",
            "Crispy Bebek Betutu duck dinner served on banana leaves",
            "Night stargazing around the villa pool"
          ],
          tip: "💡 Tip: Herbal tea after massage helps flush toxins after flying."
        }
      },
      {
        dayNum: 3,
        title: "Uluwatu Cliffs & Kecak Fire Dance 🔥",
        city: "South Bukit Peninsula",
        hotel: "Sunset Breeze Private Pool Villa",
        morning: {
          title: "Lazy Floating Breakfast",
          activities: [
            "Heart-shaped wicker basket floating in pool with avocado toasts & fruits",
            "Morning swim workout and reading on the outdoor sunlounger",
            "Pack beach tote for coastal southern adventure"
          ],
          tip: "💡 Tip: Floating breakfast makes for the cutest group photos!"
        },
        afternoon: {
          title: "Padang Padang Beach Hidden Cove",
          activities: [
            "Descend through limestone sea cave opening onto turquoise cove",
            "Swim in calm crystal waters and watch reef fish dart around rocks",
            "Grab chilled Bintang radler from local beach warung"
          ],
          tip: "💡 Tip: Check tide charts; low tide provides the best sand area."
        },
        evening: {
          title: "Uluwatu Sunset Amphitheater Dance",
          activities: [
            "Perched cliff temple view 70 meters directly above pounding waves",
            "Hypnotic chorus of 50 chanting dancers in the Kecak Fire performance",
            "Jimbaran bay candlelit seafood barbecue right on the sand"
          ],
          tip: "💡 Tip: Buy dance tickets online early as seating is limited."
        }
      }
    ]
  },
  paris: {
    title: "Paris Patisserie & Bookshops 🥐",
    destination: "Paris, France",
    dates: "April 18 - April 22",
    duration: "4 Days",
    currency: "€",
    currencyCode: "EUR",
    budget: 1100,
    travellers: "Solo Explorer",
    travellerCount: 1,
    style: "Cultural & Historic",
    pace: "Relaxed",
    accommodation: "Saint-Germain Cozy Boutique Hotel",
    days: [
      {
        dayNum: 1,
        title: "Latin Quarter & Shakespeare and Co 📚",
        city: "Paris (5th & 6th Arrondissement)",
        hotel: "Hôtel Saint-Germain Des Prés",
        morning: {
          title: "Croissant & Sidewalk Cafe",
          activities: [
            "Sit at small round wicker cafe table for cafe au lait and flaky croissant",
            "Watch chic locals walking past with baguettes under their arms",
            "Check-in at boutique hotel with wrought-iron balcony"
          ],
          tip: "💡 Tip: Always say 'Bonjour Madame/Monsieur' when entering any French shop."
        },
        afternoon: {
          title: "Shakespeare and Company & Notre Dame",
          activities: [
            "Browse dusty wooden shelves & antique typewriter at famous bookshop",
            "Pick up a novel and request the official library ink stamp inside the cover",
            "Stroll across Pont Neuf stone bridge admiring Notre Dame's restored spire"
          ],
          tip: "💡 Tip: The upstairs library room has a cozy reading nook with a sweet piano."
        },
        evening: {
          title: "Sunset River Walk & French Bistro",
          activities: [
            "Browse green bouquiniste riverside book stalls along the Seine",
            "Classic steak frites and onion soup gratinée at a cozy corner bistro",
            "Listen to street accordions play near Île Saint-Louis"
          ],
          tip: "💡 Tip: Tap water in carafes ('une carafe d'eau') is always free and delicious."
        }
      },
      {
        dayNum: 2,
        title: "Montmartre Windmills & Rose Cafes 🎨",
        city: "Paris (18th Arrondissement)",
        hotel: "Hôtel Saint-Germain Des Prés",
        morning: {
          title: "Sacré-Cœur Dawn Panorama",
          activities: [
            "Climb the cobbled hill stairs to white marble Sacré-Cœur basilica",
            "Sweeping morning panorama of all Paris rooftops waking up",
            "Find the pastel pink 'La Maison Rose' cottage corner"
          ],
          tip: "💡 Tip: Take the funicular rail if stairs feel tiring after a long day."
        },
        afternoon: {
          title: "Place du Tertre Portrait Artists",
          activities: [
            "Watch caricaturists and watercolor painters at open-air easels",
            "Indulge in pistachio and raspberry macarons from Ladurée",
            "Discover quiet vine-covered alleyways away from tourist hubs"
          ],
          tip: "💡 Tip: Ask painter prices politely before sitting down for sketches."
        },
        evening: {
          title: "Eiffel Tower Twinkle Lights",
          activities: [
            "Picnic on Champ de Mars lawn with brie cheese, grapes, and crackers",
            "Watch 20,000 sparkling golden light bulbs sparkle on the hour",
            "Night stroll back across illuminated bridges"
          ],
          tip: "💡 Tip: Twinkle show starts on the top of each hour for exactly 5 minutes."
        }
      }
    ]
  }
};

let currentTrip = mockTripsData.kyoto;
let activeDayIndex = 1;

// --- 2. Navigation Handler ---
function switchSection(targetSectionId) {
  // Hide all sections
  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active-section');
  });

  // Activate target
  const targetElement = document.getElementById(targetSectionId);
  if (targetElement) {
    targetElement.classList.add('active-section');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update Nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.dataset.section === targetSectionId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Close mobile nav if opened
  const mainNav = document.getElementById('mainNav');
  if (mainNav) {
    mainNav.classList.remove('show');
  }
}

// Nav Click Listeners
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const section = link.getAttribute('data-section');
    switchSection(section);
  });
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    const mainNav = document.getElementById('mainNav');
    mainNav.classList.toggle('show');
  });
}

// --- 3. Date & Duration Helper in Plan Trip ---
const tripDepInput = document.getElementById('tripDeparture');
const tripRetInput = document.getElementById('tripReturn');
const tripDurDisplay = document.getElementById('tripDurationDisplay');

// Set default dates (Departure in 3 weeks, return 5 days later)
const today = new Date();
const defaultDep = new Date(today);
defaultDep.setDate(today.getDate() + 21);
const defaultRet = new Date(defaultDep);
defaultRet.setDate(defaultDep.getDate() + 4);

function formatDateToInput(d) {
  return d.toISOString().split('T')[0];
}

if (tripDepInput && tripRetInput) {
  tripDepInput.value = formatDateToInput(defaultDep);
  tripRetInput.value = formatDateToInput(defaultRet);

  function updateDurationDisplay() {
    const d1 = new Date(tripDepInput.value);
    const d2 = new Date(tripRetInput.value);
    if (!isNaN(d1) && !isNaN(d2) && d2 >= d1) {
      const diffTime = Math.abs(d2 - d1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const nights = diffDays - 1;
      tripDurDisplay.textContent = `${diffDays} Days, ${nights} Nights`;
    } else {
      tripDurDisplay.textContent = `Please select valid return date`;
    }
  }

  tripDepInput.addEventListener('change', updateDurationDisplay);
  tripRetInput.addEventListener('change', updateDurationDisplay);
  updateDurationDisplay();
}

// --- 4. Render Itinerary Function ---
function renderItinerary(tripData) {
  const titleElem = document.getElementById('itineraryTitle');
  const metaElem = document.getElementById('itineraryMeta');
  const paceTag = document.getElementById('itineraryPaceTag');
  const tabsContainer = document.getElementById('dayTabsContainer');

  if (titleElem) titleElem.textContent = tripData.title;
  if (metaElem) {
    metaElem.textContent = `📅 ${tripData.dates} • 👥 ${tripData.travellers} • 🏮 ${tripData.accommodation}`;
  }
  if (paceTag) {
    paceTag.textContent = `🐢 ${tripData.pace} Pace`;
  }

  // Render Day Tabs
  tabsContainer.innerHTML = '';
  tripData.days.forEach((day, idx) => {
    const btn = document.createElement('button');
    btn.className = `day-tab ${day.dayNum === activeDayIndex ? 'active' : ''}`;
    btn.dataset.day = day.dayNum;
    btn.textContent = `Day ${day.dayNum} 🌸`;
    btn.addEventListener('click', () => {
      activeDayIndex = day.dayNum;
      document.querySelectorAll('.day-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderDayContent(day);
    });
    tabsContainer.appendChild(btn);
  });

  // Find active day or default to first
  const activeDay = tripData.days.find(d => d.dayNum === activeDayIndex) || tripData.days[0];
  if (activeDay) {
    activeDayIndex = activeDay.dayNum;
    renderDayContent(activeDay);
  }
}

function renderDayContent(day) {
  const displayContainer = document.getElementById('dayContentDisplay');
  if (!displayContainer) return;

  displayContainer.innerHTML = `
    <div class="day-overview-card">
      <div class="day-badge-col">
        <span class="cute-tag">Day ${day.dayNum} Highlights</span>
        <h3>${day.title}</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem;">📍 City / Area: <strong>${day.city}</strong></p>
      </div>
      <div class="day-hotel-info">
        <span>🏨 Tonight's Stay:</span>
        <span>${day.hotel}</span>
      </div>
    </div>

    <div class="time-slots-grid">
      <!-- Morning -->
      <div class="slot-card slot-morning">
        <div class="slot-header">
          <span class="slot-time-badge">🌅 Morning (8:00 - 12:00)</span>
        </div>
        <h4 class="slot-title">${day.morning.title}</h4>
        <ul class="slot-activity-list">
          ${day.morning.activities.map(act => `<li>${act}</li>`).join('')}
        </ul>
        <div class="slot-tip">${day.morning.tip}</div>
      </div>

      <!-- Afternoon -->
      <div class="slot-card slot-afternoon">
        <div class="slot-header">
          <span class="slot-time-badge">☀️ Afternoon (12:30 - 17:00)</span>
        </div>
        <h4 class="slot-title">${day.afternoon.title}</h4>
        <ul class="slot-activity-list">
          ${day.afternoon.activities.map(act => `<li>${act}</li>`).join('')}
        </ul>
        <div class="slot-tip">${day.afternoon.tip}</div>
      </div>

      <!-- Evening -->
      <div class="slot-card slot-evening">
        <div class="slot-header">
          <span class="slot-time-badge">🌙 Evening (17:30 - 21:30)</span>
        </div>
        <h4 class="slot-title">${day.evening.title}</h4>
        <ul class="slot-activity-list">
          ${day.evening.activities.map(act => `<li>${act}</li>`).join('')}
        </ul>
        <div class="slot-tip">${day.evening.tip}</div>
      </div>
    </div>
  `;
}

// Initial itinerary render
renderItinerary(currentTrip);

// --- 5. Trip Planner Form Submission ---
const plannerForm = document.getElementById('tripPlannerForm');
if (plannerForm) {
  plannerForm.addEventListener('submit', (e) => {
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

    // Calculate days count
    let numDays = 4;
    if (dep && ret) {
      const d1 = new Date(dep);
      const d2 = new Date(ret);
      const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
      if (diff > 0 && diff <= 14) numDays = diff;
    }

    // Currency symbol
    const curMap = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', INR: '₹', AUD: 'A$' };
    const curSym = curMap[currency] || '$';

    // Generate dynamic days array
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
        morning: {
          title: `Morning Discovery in ${dest.split(',')[0]}`,
          activities: [
            poolItem.morning,
            "Fresh breakfast buffet & specialty local tea or coffee",
            "Map orientation walk around the neighborhood square"
          ],
          tip: poolItem.tip
        },
        afternoon: {
          title: "Afternoon Adventure & Sights",
          activities: [
            poolItem.afternoon,
            "Sample famous street snacks & regional desserts",
            "Snap cute polaroid snapshots for your album"
          ],
          tip: "💡 Tip: Carry a light refillable water bottle and coin pouch."
        },
        evening: {
          title: "Evening Atmosphere & Dining",
          activities: [
            poolItem.evening,
            "Evening stroll past illuminated monuments and lanterns",
            "Relaxing night-time journal scribbles in your hotel room"
          ],
          tip: "💡 Tip: Save daily museum tickets and transit stubs for the scrapbook!"
        }
      });
    }

    // New generated trip object
    const newTrip = {
      title: `${dest} Joyful Escape ✨`,
      destination: dest,
      dates: `${dep} to ${ret}`,
      duration: `${numDays} Days`,
      currency: curSym,
      currencyCode: currency,
      budget: budgetVal,
      travellers: `${travellerType.toUpperCase()} (${travellerNum} person${travellerNum > 1 ? 's' : ''})`,
      travellerCount: travellerNum,
      style: style,
      pace: paceVal,
      accommodation: accommodation,
      days: generatedDays
    };

    currentTrip = newTrip;
    activeDayIndex = 1;

    // Update budget screen too
    updateBudgetWithTrip(newTrip);

    // Render in Itinerary
    renderItinerary(newTrip);

    // Add to My Trips grid dynamically
    addNewTripToGrid(newTrip);

    // Switch view
    switchSection('itinerary');
  });
}

const resetBtn = document.getElementById('resetPlanBtn');
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    if (confirm("Reset the planning form to defaults? 🌸")) {
      plannerForm.reset();
      updateDurationDisplay();
    }
  });
}

function updateBudgetWithTrip(trip) {
  const totalElem = document.getElementById('budgetTotalDisplay');
  const spentElem = document.getElementById('budgetSpentDisplay');
  const leftElem = document.getElementById('budgetLeftDisplay');

  const approxSpent = Math.round(trip.budget * 0.45);
  const approxLeft = trip.budget - approxSpent;

  if (totalElem) totalElem.textContent = `${trip.currency}${trip.budget.toLocaleString()}`;
  if (spentElem) spentElem.textContent = `${trip.currency}${approxSpent.toLocaleString()}`;
  if (leftElem) leftElem.textContent = `${trip.currency}${approxLeft.toLocaleString()}`;
}

function addNewTripToGrid(trip) {
  const tripsGrid = document.getElementById('myTripsGrid');
  if (!tripsGrid) return;

  const card = document.createElement('div');
  card.className = 'trip-journal-card active-journal';
  card.innerHTML = `
    <div class="tag-status confirmed">Custom Trip ✨</div>
    <div class="journal-img-box">
      <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80" alt="${trip.destination}">
      <div class="tape-corner"></div>
    </div>
    <div class="journal-body">
      <h3>${trip.title}</h3>
      <p class="journal-meta">🗓️ ${trip.dates} • ${trip.duration} • 👥 ${trip.travellers}</p>
      <p class="journal-desc">Custom itinerary tailored with ${trip.pace} pace and staying in ${trip.accommodation}.</p>
      <div class="journal-footer">
        <span class="budget-badge">${trip.currency}${trip.budget.toLocaleString()}</span>
        <button class="btn btn-small btn-primary" onclick="renderItinerary(currentTrip); switchSection('itinerary');">View Now 📖</button>
      </div>
    </div>
  `;
  tripsGrid.prepend(card);
}

// Load pre-made trip from My Trips
function loadTripToItinerary(tripKey) {
  if (mockTripsData[tripKey]) {
    currentTrip = mockTripsData[tripKey];
    activeDayIndex = 1;
    renderItinerary(currentTrip);
    updateBudgetWithTrip(currentTrip);
    switchSection('itinerary');
  }
}

// Fill form from Destinations postcards
function fillFormWithDest(destName, styleName, currencyCode) {
  const destInput = document.getElementById('tripDestination');
  const styleSelect = document.getElementById('travelStyle');
  const curSelect = document.getElementById('tripCurrency');

  if (destInput) destInput.value = destName;
  if (styleSelect) styleSelect.value = styleName;
  if (curSelect) curSelect.value = currencyCode;

  switchSection('plan');
}

// --- 6. Packing List Functionality ---
function updatePackingCounter() {
  const allCheckboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
  const checkedBoxes = document.querySelectorAll('.checklist input[type="checkbox"]:checked');
  const countDisplay = document.getElementById('packingCount');
  const progressBar = document.getElementById('packingProgressBar');

  const total = allCheckboxes.length;
  const packed = checkedBoxes.length;

  if (countDisplay) {
    countDisplay.textContent = `${packed} / ${total}`;
  }

  if (progressBar) {
    const pct = total === 0 ? 0 : Math.round((packed / total) * 100);
    progressBar.style.width = `${pct}%`;
  }
}

// Listen to checkbox changes
document.addEventListener('change', (e) => {
  if (e.target.matches('.checklist input[type="checkbox"]')) {
    updatePackingCounter();
  }
});

// Delete packing item
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-delete-item')) {
    const li = e.target.closest('li');
    if (li) {
      li.remove();
      updatePackingCounter();
    }
  }
});

// Add new packing item
const addPackingBtn = document.getElementById('addPackingBtn');
const newPackingInput = document.getElementById('newPackingItem');
const newPackingCat = document.getElementById('newPackingCategory');

if (addPackingBtn && newPackingInput) {
  addPackingBtn.addEventListener('click', () => {
    const text = newPackingInput.value.trim();
    const cat = newPackingCat.value;
    if (!text) {
      alert("Please write an item name first! 🧳");
      return;
    }

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
    }
  });
}

// --- 7. Budget Log & Calculator ---
let currentSpentTotal = 192400;
let currentBudgetTotal = 280000;

function recalculateBudgetDisplays() {
  const spentElem = document.getElementById('budgetSpentDisplay');
  const leftElem = document.getElementById('budgetLeftDisplay');
  const curSymbol = currentTrip.currency || '¥';

  if (spentElem) spentElem.textContent = `${curSymbol}${currentSpentTotal.toLocaleString()}`;
  const remaining = currentBudgetTotal - currentSpentTotal;
  if (leftElem) {
    leftElem.textContent = `${curSymbol}${remaining.toLocaleString()}`;
    if (remaining < 0) {
      leftElem.style.color = '#C92A2A';
    } else {
      leftElem.style.color = 'var(--text-dark)';
    }
  }
}

const addExpenseForm = document.getElementById('addExpenseForm');
if (addExpenseForm) {
  addExpenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('expenseName');
    const amountInput = document.getElementById('expenseAmount');
    const catSelect = document.getElementById('expenseCategory');
    const tableBody = document.getElementById('expenseTableBody');

    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value) || 0;
    const cat = catSelect.value;

    if (!name || amount <= 0) return;

    // Pick pill style
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
      <td class="cell-price">${currentTrip.currency || '¥'}${amount.toLocaleString()}</td>
      <td><button class="btn-table-del" onclick="deleteExpenseRow(this, ${amount})">✕</button></td>
    `;
    tableBody.prepend(tr);

    currentSpentTotal += amount;
    recalculateBudgetDisplays();

    nameInput.value = '';
    amountInput.value = '';
  });
}

function deleteExpenseRow(btn, amount) {
  const tr = btn.closest('tr');
  if (tr) {
    tr.remove();
    currentSpentTotal = Math.max(0, currentSpentTotal - amount);
    recalculateBudgetDisplays();
  }
}

// --- 8. Destinations Filter ---
document.querySelectorAll('.filter-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    const filterVal = pill.getAttribute('data-filter');
    const cards = document.querySelectorAll('.dest-polaroid');

    cards.forEach(card => {
      const cats = card.getAttribute('data-category') || '';
      if (filterVal === 'all' || cats.includes(filterVal)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Run Initial Check
updatePackingCounter();
recalculateBudgetDisplays();
