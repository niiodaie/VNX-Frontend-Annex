// Hero Map functionality with footprint markers
class HeroMap {
    constructor() {
        this.map = null;
        this.footprintLayer = null;
        this.isSignedIn = false;
        this.userTrips = [];
        
        this.init();
    }
    
    async init() {
        try {
            await this.initializeMap();
            this.setupSignInPrompt();
            this.loadUserData();
        } catch (error) {
            console.error('Error initializing hero map:', error);
        }
    }
    
    async initializeMap() {
        // Initialize Leaflet map in hero section
        this.map = L.map('hero-map', {
            zoomControl: false,
            attributionControl: false,
            dragging: true,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: true
        }).setView([20, 0], 2);
        
        // Add custom tile layer with muted colors
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '',
            subdomains: 'abcd',
            maxZoom: 10,
            minZoom: 2
        }).addTo(this.map);
        
        // Initialize footprint layer
        this.footprintLayer = L.layerGroup().addTo(this.map);
        
        // Disable zoom on mobile for better UX
        if (window.innerWidth <= 768) {
            this.map.dragging.disable();
            this.map.touchZoom.disable();
        }
    }
    
    setupSignInPrompt() {
        // Create sign-in prompt overlay
        const signInPrompt = document.createElement('div');
        signInPrompt.className = 'signin-prompt';
        signInPrompt.innerHTML = `
            <h4>See Your Footprints</h4>
            <p>Sign in to visualize your travel history as footprint markers on this interactive world map.</p>
            <button id="signin-btn" class="btn btn-primary">Sign In</button>
        `;
        
        document.querySelector('.hero-map').appendChild(signInPrompt);
        
        // Add sign-in functionality
        document.getElementById('signin-btn').addEventListener('click', () => {
            this.simulateSignIn();
        });
    }
    
    async loadUserData() {
        // Check if user data exists (simulate checking authentication)
        const hasUserData = localStorage.getItem('vnx_user_signed_in');
        
        if (hasUserData) {
            this.isSignedIn = true;
            await this.loadUserTrips();
            this.hideSignInPrompt();
            this.showFootprintMarkers();
        }
    }
    
    async loadUserTrips() {
        try {
            // Load user's travel data
            const response = await fetch('data/sample-locations.json');
            if (response.ok) {
                this.userTrips = await response.json();
            } else {
                // Fallback to trips.json
                const fallbackResponse = await fetch('data/trips.json');
                if (fallbackResponse.ok) {
                    this.userTrips = await fallbackResponse.json();
                }
            }
        } catch (error) {
            console.warn('Could not load user trips for hero map:', error);
            this.userTrips = [];
        }
    }
    
    simulateSignIn() {
        // Simulate sign-in process
        this.isSignedIn = true;
        localStorage.setItem('vnx_user_signed_in', 'true');
        
        // Load and show user trips
        this.loadUserTrips().then(() => {
            this.hideSignInPrompt();
            this.showFootprintMarkers();
            
            // Show success message
            this.showNotification('Welcome back! Your travel footprints are now visible.', 'success');
        });
    }
    
    hideSignInPrompt() {
        const prompt = document.querySelector('.signin-prompt');
        if (prompt) {
            prompt.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => prompt.remove(), 300);
        }
    }
    
    async showFootprintMarkers() {
        if (!this.userTrips || this.userTrips.length === 0) return;
        
        // Clear existing markers
        this.footprintLayer.clearLayers();
        
        // Get unique countries from trips
        const countries = this.getUniqueCountries();
        
        // Add footprint markers for each country
        for (const country of countries) {
            const coords = await this.getCountryCoordinates(country);
            if (coords) {
                this.addFootprintMarker(coords, country);
            }
        }
        
        // Add pulsing animation delay for visual effect
        setTimeout(() => {
            this.animateMarkersSequentially();
        }, 500);
    }
    
    getUniqueCountries() {
        const countries = new Set();
        
        this.userTrips.forEach(trip => {
            const location = trip.location || '';
            const parts = location.split(',');
            if (parts.length > 1) {
                const country = parts[parts.length - 1].trim();
                if (country) countries.add(country);
            }
        });
        
        return Array.from(countries);
    }
    
    async getCountryCoordinates(country) {
        // Country center coordinates for footprint markers
        const countryCoords = {
            'France': [46.6034, 1.8883],
            'UK': [54.7023, -3.2765],
            'United Kingdom': [54.7023, -3.2765],
            'Spain': [40.4637, -3.7492],
            'Italy': [41.8719, 12.5674],
            'Netherlands': [52.1326, 5.2913],
            'Germany': [51.1657, 10.4515],
            'Czech Republic': [49.8175, 15.4730],
            'Austria': [47.5162, 14.5501],
            'Hungary': [47.1625, 19.5033],
            'Denmark': [56.2639, 9.5018],
            'Sweden': [60.1282, 18.6435],
            'Norway': [60.4720, 8.4689],
            'Canada': [56.1304, -106.3468],
            'USA': [37.0902, -95.7129],
            'Japan': [36.2048, 138.2529],
            'South Korea': [35.9078, 127.7669],
            'Thailand': [15.8700, 100.9925],
            'Singapore': [1.3521, 103.8198],
            'Australia': [-25.2744, 133.7751],
            'UAE': [23.4241, 53.8478],
            'Turkey': [38.9637, 35.2433],
            'Scotland': [56.4907, -4.2026],
            'Iceland': [64.9631, -19.0208],
            'Ireland': [53.1424, -7.6921]
        };
        
        return countryCoords[country] || null;
    }
    
    addFootprintMarker(coords, country) {
        // Create custom footprint icon
        const footprintIcon = L.divIcon({
            className: 'footprint-marker',
            html: '',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
        
        // Create marker with popup
        const marker = L.marker(coords, { icon: footprintIcon })
            .bindPopup(`
                <div style="text-align: center; min-width: 120px;">
                    <h4 style="margin: 0 0 8px 0; color: #1F2937;">${country}</h4>
                    <p style="margin: 0; color: #6B7280; font-size: 0.875rem;">
                        ${this.getCountryTripCount(country)} trip${this.getCountryTripCount(country) !== 1 ? 's' : ''}
                    </p>
                </div>
            `, {
                closeButton: false,
                offset: [0, -12]
            })
            .addTo(this.footprintLayer);
        
        // Add hover effects
        marker.on('mouseover', function() {
            this.openPopup();
        });
        
        marker.on('mouseout', function() {
            this.closePopup();
        });
        
        return marker;
    }
    
    getCountryTripCount(country) {
        return this.userTrips.filter(trip => {
            const location = trip.location || '';
            return location.toLowerCase().includes(country.toLowerCase());
        }).length;
    }
    
    animateMarkersSequentially() {
        const markers = [];
        this.footprintLayer.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                markers.push(layer);
            }
        });
        
        markers.forEach((marker, index) => {
            setTimeout(() => {
                const element = marker._icon;
                if (element) {
                    element.style.animation = 'pulse 1.5s ease-in-out';
                }
            }, index * 200);
        });
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `hero-notification hero-notification-${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: inherit; font-size: 18px; cursor: pointer;">×</button>
            </div>
        `;
        
        // Add notification styles
        if (!document.querySelector('#hero-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'hero-notification-styles';
            style.textContent = `
                .hero-notification {
                    position: absolute;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 5;
                    padding: 12px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    backdrop-filter: blur(10px);
                    animation: slideInDown 0.3s ease-out;
                    max-width: 400px;
                }
                .hero-notification-success { 
                    background: rgba(16, 185, 129, 0.95); 
                    color: white; 
                }
                .hero-notification-info { 
                    background: rgba(59, 130, 246, 0.95); 
                    color: white; 
                }
                @keyframes slideInDown { 
                    from { transform: translate(-50%, -100%); } 
                    to { transform: translate(-50%, 0); } 
                }
                @keyframes fadeOut { 
                    to { opacity: 0; transform: translateY(-10px); } 
                }
            `;
            document.head.appendChild(style);
        }
        
        document.querySelector('.hero-map').appendChild(notification);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
    }
    
    // Method to sign out (for testing)
    signOut() {
        this.isSignedIn = false;
        localStorage.removeItem('vnx_user_signed_in');
        this.footprintLayer.clearLayers();
        this.setupSignInPrompt();
    }
}

// Initialize hero map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.heroMap = new HeroMap();
});