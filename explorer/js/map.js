// Map functionality using Leaflet.js

let map = null;
let markersLayer = null;
let routesLayer = null;

async function initMap(trips) {
    try {
        // Initialize map if not already done
        if (!map) {
            map = L.map('map').setView([45.0, 0.0], 2);
            
            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(map);
            
            // Initialize layers
            markersLayer = L.layerGroup().addTo(map);
            routesLayer = L.layerGroup().addTo(map);
        }
        
        // Clear existing markers and routes
        markersLayer.clearLayers();
        routesLayer.clearLayers();
        
        if (!trips || trips.length === 0) {
            updateMapTripCount(0);
            return;
        }
        
        // Get coordinates for trips
        const tripsWithCoords = await getTripsWithCoordinates(trips);
        
        if (tripsWithCoords.length === 0) {
            updateMapTripCount(0);
            return;
        }
        
        // Add markers for each trip
        addMarkersToMap(tripsWithCoords);
        
        // Add routes between consecutive trips
        addRoutesToMap(tripsWithCoords);
        
        // Fit map to show all markers
        fitMapToMarkers(tripsWithCoords);
        
        // Update trip count
        updateMapTripCount(tripsWithCoords.length);
        
        console.log(`Map initialized with ${tripsWithCoords.length} trips`);
        
    } catch (error) {
        console.error('Error initializing map:', error);
        showMapError('Failed to load map data. Please try again.');
    }
}

async function getTripsWithCoordinates(trips) {
    const tripsWithCoords = [];
    
    for (const trip of trips) {
        try {
            const coords = await geocodeLocation(trip.location);
            if (coords) {
                tripsWithCoords.push({
                    ...trip,
                    lat: coords.lat,
                    lng: coords.lng
                });
            }
        } catch (error) {
            console.warn(`Could not geocode location: ${trip.location}`, error);
        }
    }
    
    return tripsWithCoords;
}

async function geocodeLocation(location) {
    // Simple geocoding using a basic coordinate mapping
    // In a real application, you would use a proper geocoding service
    const locationCoords = {
        // Sample coordinates for common locations
        'Paris, France': { lat: 48.8566, lng: 2.3522 },
        'London, UK': { lat: 51.5074, lng: -0.1278 },
        'New York, USA': { lat: 40.7128, lng: -74.0060 },
        'Tokyo, Japan': { lat: 35.6762, lng: 139.6503 },
        'Sydney, Australia': { lat: -33.8688, lng: 151.2093 },
        'Montreal, Canada': { lat: 45.5017, lng: -73.5673 },
        'Barcelona, Spain': { lat: 41.3851, lng: 2.1734 },
        'Rome, Italy': { lat: 41.9028, lng: 12.4964 },
        'Berlin, Germany': { lat: 52.5200, lng: 13.4050 },
        'Amsterdam, Netherlands': { lat: 52.3676, lng: 4.9041 },
        'Prague, Czech Republic': { lat: 50.0755, lng: 14.4378 },
        'Vienna, Austria': { lat: 48.2082, lng: 16.3738 },
        'Budapest, Hungary': { lat: 47.4979, lng: 19.0402 },
        'Copenhagen, Denmark': { lat: 55.6761, lng: 12.5683 },
        'Stockholm, Sweden': { lat: 59.3293, lng: 18.0686 },
        'Oslo, Norway': { lat: 59.9139, lng: 10.7522 },
        'Helsinki, Finland': { lat: 60.1699, lng: 24.9384 },
        'Reykjavik, Iceland': { lat: 64.1466, lng: -21.9426 },
        'Dublin, Ireland': { lat: 53.3498, lng: -6.2603 },
        'Edinburgh, Scotland': { lat: 55.9533, lng: -3.1883 },
        'Lisbon, Portugal': { lat: 38.7223, lng: -9.1393 },
        'Madrid, Spain': { lat: 40.4168, lng: -3.7038 },
        'Zurich, Switzerland': { lat: 47.3769, lng: 8.5417 },
        'Brussels, Belgium': { lat: 50.8503, lng: 4.3517 },
        'Luxembourg, Luxembourg': { lat: 49.6116, lng: 6.1319 },
        'Monaco, Monaco': { lat: 43.7384, lng: 7.4246 },
        'San Marino, San Marino': { lat: 43.9424, lng: 12.4578 },
        'Vatican City, Vatican': { lat: 41.9029, lng: 12.4534 },
        'Andorra la Vella, Andorra': { lat: 42.5063, lng: 1.5218 },
        'Liechtenstein, Liechtenstein': { lat: 47.1400, lng: 9.5530 },
        'Singapore, Singapore': { lat: 1.3521, lng: 103.8198 },
        'Hong Kong, China': { lat: 22.3193, lng: 114.1694 },
        'Bangkok, Thailand': { lat: 13.7563, lng: 100.5018 },
        'Seoul, South Korea': { lat: 37.5665, lng: 126.9780 },
        'Beijing, China': { lat: 39.9042, lng: 116.4074 },
        'Mumbai, India': { lat: 19.0760, lng: 72.8777 },
        'Delhi, India': { lat: 28.7041, lng: 77.1025 },
        'Dubai, UAE': { lat: 25.2048, lng: 55.2708 },
        'Cairo, Egypt': { lat: 30.0444, lng: 31.2357 },
        'Cape Town, South Africa': { lat: -33.9249, lng: 18.4241 },
        'Lagos, Nigeria': { lat: 6.5244, lng: 3.3792 },
        'Nairobi, Kenya': { lat: -1.2921, lng: 36.8219 },
        'São Paulo, Brazil': { lat: -23.5558, lng: -46.6396 },
        'Rio de Janeiro, Brazil': { lat: -22.9068, lng: -43.1729 },
        'Buenos Aires, Argentina': { lat: -34.6118, lng: -58.3960 },
        'Lima, Peru': { lat: -12.0464, lng: -77.0428 },
        'Mexico City, Mexico': { lat: 19.4326, lng: -99.1332 },
        'Los Angeles, USA': { lat: 34.0522, lng: -118.2437 },
        'San Francisco, USA': { lat: 37.7749, lng: -122.4194 },
        'Chicago, USA': { lat: 41.8781, lng: -87.6298 },
        'Miami, USA': { lat: 25.7617, lng: -80.1918 },
        'Boston, USA': { lat: 42.3601, lng: -71.0589 },
        'Seattle, USA': { lat: 47.6062, lng: -122.3321 },
        'Las Vegas, USA': { lat: 36.1699, lng: -115.1398 },
        'Toronto, Canada': { lat: 43.6532, lng: -79.3832 },
        'Vancouver, Canada': { lat: 49.2827, lng: -123.1207 },
        'Ottawa, Canada': { lat: 45.4215, lng: -75.6972 }
    };
    
    // Try exact match first
    if (locationCoords[location]) {
        return locationCoords[location];
    }
    
    // Try partial matching for city names
    const locationLower = location.toLowerCase();
    for (const [key, coords] of Object.entries(locationCoords)) {
        if (key.toLowerCase().includes(locationLower.split(',')[0].toLowerCase().trim())) {
            return coords;
        }
    }
    
    // If no match found, return null
    console.warn(`No coordinates found for location: ${location}`);
    return null;
}

function addMarkersToMap(trips) {
    trips.forEach((trip, index) => {
        // Create custom icon based on trip order
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `
                <div class="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full border-2 border-white shadow-lg">
                    <span class="text-xs font-bold">${index + 1}</span>
                </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16]
        });
        
        // Create marker
        const marker = L.marker([trip.lat, trip.lng], { icon })
            .bindPopup(`
                <div class="p-2">
                    <h3 class="font-semibold text-gray-900 mb-1">${trip.location}</h3>
                    <p class="text-sm text-gray-600 mb-1">${formatDate(trip.date)}</p>
                    <p class="text-sm text-blue-600 font-medium">${trip.kmWalked} km walked</p>
                </div>
            `)
            .addTo(markersLayer);
        
        // Add hover effects
        marker.on('mouseover', function() {
            this.openPopup();
        });
    });
}

function addRoutesToMap(trips) {
    if (trips.length < 2) return;
    
    // Sort trips by date to create proper route
    const sortedTrips = [...trips].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Create route coordinates
    const routeCoords = sortedTrips.map(trip => [trip.lat, trip.lng]);
    
    // Create polyline
    const route = L.polyline(routeCoords, {
        color: '#3B82F6',
        weight: 3,
        opacity: 0.7,
        smoothFactor: 1
    }).addTo(routesLayer);
    
    // Add animated route effect
    const animatedRoute = L.polyline(routeCoords, {
        color: '#60A5FA',
        weight: 2,
        opacity: 0.8,
        dashArray: '10, 10',
        className: 'animated-route'
    }).addTo(routesLayer);
}

function fitMapToMarkers(trips) {
    if (trips.length === 0) return;
    
    if (trips.length === 1) {
        // Center on single location
        map.setView([trips[0].lat, trips[0].lng], 10);
    } else {
        // Fit bounds to all markers
        const bounds = L.latLngBounds(trips.map(trip => [trip.lat, trip.lng]));
        map.fitBounds(bounds, {
            padding: [20, 20],
            maxZoom: 15
        });
    }
}

function updateMapTripCount(count) {
    const countElement = document.getElementById('map-trip-count');
    if (countElement) {
        countElement.textContent = `${count} trip${count !== 1 ? 's' : ''}`;
    }
}

function showMapError(message) {
    const mapContainer = document.getElementById('map');
    mapContainer.innerHTML = `
        <div class="flex items-center justify-center h-full bg-gray-100 rounded-lg">
            <div class="text-center">
                <i data-feather="map-off" class="w-12 h-12 mx-auto mb-4 text-gray-400"></i>
                <p class="text-gray-600 mb-2">${message}</p>
                <button onclick="location.reload()" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Retry
                </button>
            </div>
        </div>
    `;
    feather.replace();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Add CSS for animated route (inject into document head)
const style = document.createElement('style');
style.textContent = `
    .animated-route {
        animation: dash 20s linear infinite;
    }
    
    @keyframes dash {
        from {
            stroke-dashoffset: 0;
        }
        to {
            stroke-dashoffset: -200;
        }
    }
    
    .custom-marker {
        background: transparent !important;
        border: none !important;
    }
    
    .leaflet-popup-content-wrapper {
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .leaflet-popup-tip {
        background: white;
    }
`;
document.head.appendChild(style);
