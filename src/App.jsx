import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Sparkles, MapPin, Moon, Sun, Navigation, Calendar, User, Compass, Infinity as InfinityIcon, Search, ArrowLeft } from 'lucide-react';
import L from 'leaflet';
import Navbar from './components/Navbar';

// Fix leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], map.getZoom());
    }
  }, [position, map]);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

// Generates dynamic starfield background
const StarField = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const arr = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 8,
      duration: Math.random() * 10 + 15
    }));
    setStars(arr);
  }, []);

  return (
    <div className="starfield">
      {stars.map((s) => (
        <div key={s.id} className="star" style={{
          left: `${s.x}vw`,
          top: `${s.y}vh`,
          width: `${s.size}px`,
          height: `${s.size}px`,
          animationDelay: `${s.delay}s`,
          animationDuration: `${s.duration}s, 3s`
        }}></div>
      ))}
    </div>
  );
};


function App() {
  const [appState, setAppState] = useState('FORM'); // 'FORM', 'LOADING', 'RESULT'
  const [loadingText, setLoadingText] = useState('Consulting the stars...');

  const [formData, setFormData] = useState({
    name: '',
    dobDate: '',
    dobTime: '',
    timezone: '5.5', // Default to IST
  });

  const [citySearch, setCitySearch] = useState('');
  const [position, setPosition] = useState({ lat: 28.6139, lng: 77.2090 });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const searchCity = async () => {
    if (!citySearch.trim()) return;
    try {
      const resp = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(citySearch)}&format=json&limit=1`);
      if (resp.data && resp.data.length > 0) {
        setPosition({
          lat: parseFloat(resp.data[0].lat),
          lng: parseFloat(resp.data[0].lon)
        });
        setError(null);
      } else {
        setError("City not found in the cosmos. Try a larger nearby city.");
      }
    } catch {
      setError("Failed to fetch location data.");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dobDate || !formData.dobTime || !position) {
      setError("The cosmos require your full details.");
      return;
    }

    // Move to visually loading state immediately to cover the screen
    setAppState('LOADING');
    setError(null);
    setResult(null);

    // Dynamic Loading text logic
    const msgs = [
      "Consulting the stars...",
      "Aligning celestial bodies...",
      "Mapping planetary coordinates...",
      "Unveiling the mystery..."
    ];
    let msgIndex = 0;
    const textInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % msgs.length;
      setLoadingText(msgs[msgIndex]);
    }, 1200);

    let dateIso = "";
    try {
      const dateObj = new Date(`${formData.dobDate}T${formData.dobTime}`);
      dateIso = dateObj.toISOString().slice(0, 19);
    } catch {
      clearInterval(textInterval);
      setError("Invalid planetary alignment. Please check date/time.");
      setAppState('FORM');
      return;
    }

    try {
      const offsetHours = parseFloat(formData.timezone);

      // Perform request immediately
      const response = await axios.post('http://localhost:8000/api/astrology/calculate', {
        name: formData.name,
        dob: dateIso,
        latitude: position.lat,
        longitude: position.lng,
        timezone_offset: offsetHours
      });

      // Artificial Suspense! Wait at least 4.5 seconds to build thrill.
      setTimeout(() => {
        clearInterval(textInterval);
        setResult(response.data.data);
        setAppState('RESULT');
      }, 4500);

    } catch (err) {
      clearInterval(textInterval);
      console.error(err);
      setError(err.response?.data?.detail || "The mystical channels are clouded. Try again later.");
      setAppState('FORM');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setResult(null);
    setAppState('FORM');
  };

  return (
    <>
      <StarField />
      <div className="app-container">
        <Navbar />

        <header className="hero">
          <InfinityIcon size={64} className="hero-icon" strokeWidth={1} />
          <h1>Zodiac Persona</h1>
          <p>Your Nature, Your Sign</p>
        </header>

        <main className="view-container">

          {/* STATE 1: FORM */}
          {appState === 'FORM' && (
            <section className="mystic-card fade-enter">
              {error && <div className="error-msg">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name"><User size={20} /> Identity</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    placeholder="What is your cosmic anchor? (Name)"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dobDate"><Calendar size={20} /> Arrival Date</label>
                    <input
                      type="date"
                      id="dobDate"
                      name="dobDate"
                      className="form-control"
                      value={formData.dobDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dobTime"><Calendar size={20} /> Arrival Time</label>
                    <input
                      type="time"
                      id="dobTime"
                      name="dobTime"
                      className="form-control"
                      value={formData.dobTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="timezone"><Compass size={20} /> Timezone Alignment</label>
                  <select
                    id="timezone"
                    name="timezone"
                    className="form-control"
                    value={formData.timezone}
                    onChange={handleChange}
                  >
                    <option value="5.5">IST (Indian Standard Time +5:30)</option>
                    <option value="0.0">UTC (Universal Time 0:00)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label><MapPin size={20} /> Earth Coordinates (City Search)</label>
                  <div className="location-search-container">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter City Name (e.g. Pune)"
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); searchCity(); } }}
                    />
                    <button type="button" className="btn-search" onClick={searchCity}>
                      <Search size={20} />
                    </button>
                  </div>
                  <div className="map-container-wrapper">
                    <div className="map-container">
                      <MapContainer center={[position.lat, position.lng]} zoom={6} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                        />
                        <LocationMarker position={position} setPosition={setPosition} />
                      </MapContainer>
                    </div>
                  </div>
                  <div className="map-hint">
                    Coordinates: {position.lat.toFixed(4)}°, {position.lng.toFixed(4)}°
                  </div>
                </div>

                <button type="submit" className="btn-mystic">
                  <Sparkles size={24} /> Reveal the Mystery
                </button>
              </form>
            </section>
          )}


          {/* STATE 2: LOADING SCREEN */}
          {appState === 'LOADING' && (
            <section className="loading-view fade-enter">
              <div className="magic-circle">
                <div className="magic-ring ring1"></div>
                <div className="magic-ring ring2"></div>
                <Compass size={60} className="inner-icon" />
              </div>
              <h2 className="loading-text">{loadingText}</h2>
            </section>
          )}


          {/* STATE 3: RESULTS SCREEN */}
          {appState === 'RESULT' && result && (
            <section className="mystic-card results-wrapper fade-enter">
              <div className="results-header">
                <div className="greeting">Greetings</div>
                <h2 className="name-reveal">{result.name}</h2>
              </div>

              <div className="reading-text">
                {result.personality}
              </div>

              <div className="constellation-grid">
                <div className="sign-orb">
                  <div className="orb-icon"><Sun size={32} /></div>
                  <div className="sign-label">Solar Core</div>
                  <div className="sign-value">{result.sun_sign}</div>
                </div>

                <div className="sign-orb" style={{ transform: "translateY(20px)" }}>
                  <div className="orb-icon"><Moon size={32} /></div>
                  <div className="sign-label">Lunar Mind</div>
                  <div className="sign-value">{result.moon_sign}</div>
                </div>

                <div className="sign-orb">
                  <div className="orb-icon"><Navigation size={32} /></div>
                  <div className="sign-label">Ascendant</div>
                  <div className="sign-value">{result.ascendant}</div>
                </div>
              </div>

              <button className="btn-mystic secondary" onClick={handleReset}>
                <ArrowLeft size={20} /> Read Another Soul
              </button>

            </section>
          )}

        </main>
      </div>
    </>
  );
}

export default App;
