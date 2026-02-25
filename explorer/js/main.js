// VNX Travel Footprints - Main Application JavaScript

class VNXTravelFootprints {
    constructor() {
        this.trips = [];
        this.currentView = 'overview';
        this.map = null;
        this.charts = {};
        this.components = {};
        
        this.init();
    }
    
    async init() {
        try {
            // Load components
            await this.loadComponents();
            
            // Load trip data
            await this.loadTripData();
            
            // Initialize event listeners
            this.initEventListeners();
            
            // Initialize views
            this.updateStats();
            this.renderRecentTrips();
            this.showView('overview');
            
            console.log('VNX Travel Footprints initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showNotification('Failed to initialize the application. Please refresh the page.', 'error');
        }
    }
    
    async loadComponents() {
        try {
            // Load navbar component
            const navbarResponse = await fetch('components/navbar.html');
            if (navbarResponse.ok) {
                this.components.navbar = await navbarResponse.text();
            }
            
            // Load footer component
            const footerResponse = await fetch('components/footer.html');
            if (footerResponse.ok) {
                this.components.footer = await footerResponse.text();
            }
            
            // Load travel card template
            const cardResponse = await fetch('components/travel-card.html');
            if (cardResponse.ok) {
                this.components.travelCard = await cardResponse.text();
            }
        } catch (error) {
            console.warn('Could not load some components:', error);
        }
    }
    
    async loadTripData() {
        try {
            const response = await fetch('data/sample-locations.json');
            if (!response.ok) {
                // Fallback to existing trips.json if sample-locations.json doesn't exist
                const fallbackResponse = await fetch('data/trips.json');
                if (!fallbackResponse.ok) {
                    throw new Error(`HTTP error! status: ${fallbackResponse.status}`);
                }
                this.trips = await fallbackResponse.json();
            } else {
                this.trips = await response.json();
            }
            console.log(`Loaded ${this.trips.length} trips`);
        } catch (error) {
            console.error('Error loading trip data:', error);
            this.trips = [];
            this.showNotification('Could not load trip data. Some features may not work properly.', 'warning');
        }
    }
    
    initEventListeners() {
        // Navigation links
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                e.preventDefault();
                const viewName = e.target.dataset.view;
                if (viewName) {
                    this.showView(viewName);
                    this.updateNavigation(viewName);
                }
            }
        });
        
        // Hero action buttons
        document.addEventListener('click', (e) => {
            if (e.target.id === 'start-tracking-btn') {
                this.showView('timeline');
                this.updateNavigation('timeline');
            } else if (e.target.id === 'explore-map-btn') {
                this.showView('map');
                this.updateNavigation('map');
            }
        });
        
        // Window resize handler for responsive charts
        window.addEventListener('resize', () => {
            if (this.charts.weekly) this.charts.weekly.resize();
            if (this.charts.monthly) this.charts.monthly.resize();
        });
        
        // Smooth scroll for anchor links
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
    
    showView(viewName) {
        // Hide all views
        document.querySelectorAll('.view-content').forEach(view => {
            view.classList.add('hidden');
        });
        
        // Show selected view
        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.remove('hidden');
            this.currentView = viewName;
            
            // Initialize view-specific content
            this.initializeView(viewName);
        }
    }
    
    async initializeView(viewName) {
        switch (viewName) {
            case 'map':
                await this.initializeMap();
                break;
            case 'timeline':
                this.renderTimeline();
                break;
            case 'reports':
                await this.initializeCharts();
                break;
            case 'overview':
                this.updateStats();
                this.renderRecentTrips();
                break;
        }
    }
    
    async initializeMap() {
        if (typeof initMap === 'function') {
            await initMap(this.trips);
        } else {
            // Show map placeholder if map.js is not loaded
            const mapContainer = document.getElementById('map');
            if (mapContainer) {
                mapContainer.innerHTML = `
                    <div class="map-placeholder">
                        <div class="text-center">
                            <h3>Interactive Map</h3>
                            <p>Your travel locations will be displayed here</p>
                            <button class="btn btn-primary mt-2" onclick="window.vnxApp.loadMapScript()">Load Map</button>
                        </div>
                    </div>
                `;
            }
        }
    }
    
    async loadMapScript() {
        try {
            // Dynamically load map script if not already loaded
            if (!document.querySelector('script[src*="map.js"]')) {
                const script = document.createElement('script');
                script.src = 'js/map.js';
                script.onload = () => this.initializeMap();
                document.head.appendChild(script);
            }
        } catch (error) {
            console.error('Error loading map script:', error);
        }
    }
    
    async initializeCharts() {
        if (typeof initCharts === 'function') {
            await initCharts(this.trips);
        } else {
            // Show chart placeholders if chart.js is not loaded
            this.renderChartPlaceholders();
        }
    }
    
    renderChartPlaceholders() {
        const weeklyContainer = document.getElementById('weekly-chart');
        const monthlyContainer = document.getElementById('monthly-chart');
        
        if (weeklyContainer) {
            weeklyContainer.parentElement.innerHTML = `
                <h3>Weekly Travel Activity</h3>
                <div class="chart-placeholder">
                    <p>Weekly activity chart will be displayed here</p>
                    <button class="btn btn-primary" onclick="window.vnxApp.loadChartScript()">Load Charts</button>
                </div>
            `;
        }
        
        if (monthlyContainer) {
            monthlyContainer.parentElement.innerHTML = `
                <h3>Monthly Distance Traveled</h3>
                <div class="chart-placeholder">
                    <p>Monthly distance chart will be displayed here</p>
                </div>
            `;
        }
    }
    
    async loadChartScript() {
        try {
            if (!document.querySelector('script[src*="chart.js"]')) {
                const script = document.createElement('script');
                script.src = 'js/chart.js';
                script.onload = () => this.initializeCharts();
                document.head.appendChild(script);
            }
        } catch (error) {
            console.error('Error loading chart script:', error);
        }
    }
    
    updateNavigation(activeView) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-view="${activeView}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    updateStats() {
        if (!this.trips || this.trips.length === 0) {
            document.getElementById('stats-countries').textContent = '0';
            document.getElementById('stats-cities').textContent = '0';
            document.getElementById('stats-distance').textContent = '0 km';
            document.getElementById('stats-trips').textContent = '0';
            return;
        }
        
        // Calculate unique countries
        const countries = new Set(this.trips.map(trip => {
            const location = trip.location || '';
            const parts = location.split(',');
            return parts.length > 1 ? parts[parts.length - 1].trim() : '';
        }).filter(country => country));
        
        // Calculate unique cities
        const cities = new Set(this.trips.map(trip => {
            const location = trip.location || '';
            const parts = location.split(',');
            return parts[0].trim();
        }).filter(city => city));
        
        // Calculate total distance
        const totalDistance = this.trips.reduce((sum, trip) => {
            return sum + (parseFloat(trip.kmWalked) || 0);
        }, 0);
        
        // Update DOM with animations
        this.animateCounter('stats-countries', countries.size);
        this.animateCounter('stats-cities', cities.size);
        this.animateCounter('stats-trips', this.trips.length);
        
        const distanceElement = document.getElementById('stats-distance');
        if (distanceElement) {
            distanceElement.textContent = `${totalDistance.toFixed(1)} km`;
        }
    }
    
    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const duration = 1000;
        const startValue = 0;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
    
    renderRecentTrips() {
        const container = document.getElementById('recent-trips');
        if (!container) return;
        
        if (!this.trips || this.trips.length === 0) {
            container.innerHTML = `
                <div class="text-center p-4">
                    <div class="travel-card-icon mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                    </div>
                    <h3>No trips recorded yet</h3>
                    <p>Start tracking your travels to see them here!</p>
                    <button class="btn btn-primary mt-2" id="start-tracking-btn">Start Tracking</button>
                </div>
            `;
            return;
        }
        
        // Sort trips by date (most recent first)
        const sortedTrips = [...this.trips].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        // Show only the 5 most recent trips
        const recentTrips = sortedTrips.slice(0, 5);
        
        container.innerHTML = recentTrips.map(trip => `
            <div class="travel-card" data-location="${trip.location}" data-date="${trip.date}">
                <div class="travel-card-header">
                    <div class="travel-card-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                    </div>
                    <div>
                        <div class="travel-card-title">${trip.location}</div>
                        <div class="travel-card-date">${this.formatDate(trip.date)}</div>
                    </div>
                </div>
                <div class="travel-card-stats">
                    <span class="travel-distance">${trip.kmWalked} km walked</span>
                    <span class="travel-badge">City Break</span>
                </div>
            </div>
        `).join('');
    }
    
    renderTimeline() {
        const container = document.getElementById('timeline-content');
        if (!container) return;
        
        if (!this.trips || this.trips.length === 0) {
            container.innerHTML = `
                <div class="text-center p-4">
                    <h3>No travel timeline available</h3>
                    <p>Your travel history will appear here once you have recorded trips.</p>
                </div>
            `;
            return;
        }
        
        // Group trips by month
        const tripsByMonth = this.groupTripsByMonth();
        
        container.innerHTML = Object.keys(tripsByMonth)
            .sort((a, b) => new Date(b) - new Date(a))
            .map(month => {
                const monthTrips = tripsByMonth[month];
                const totalDistance = monthTrips.reduce((sum, trip) => sum + parseFloat(trip.kmWalked || 0), 0);
                
                return `
                    <div class="timeline-item">
                        <div class="mb-3">
                            <h4>${this.formatMonth(month)}</h4>
                            <p class="text-muted">${monthTrips.length} trips • ${totalDistance.toFixed(1)} km total</p>
                        </div>
                        <div class="grid gap-md">
                            ${monthTrips.map(trip => `
                                <div class="travel-card">
                                    <div class="travel-card-header">
                                        <div class="travel-card-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                <circle cx="12" cy="10" r="3"></circle>
                                            </svg>
                                        </div>
                                        <div>
                                            <div class="travel-card-title">${trip.location}</div>
                                            <div class="travel-card-date">${this.formatDate(trip.date)}</div>
                                        </div>
                                    </div>
                                    <div class="travel-card-stats">
                                        <span class="travel-distance">${trip.kmWalked} km</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('');
    }
    
    groupTripsByMonth() {
        const grouped = {};
        
        this.trips.forEach(trip => {
            const date = new Date(trip.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!grouped[monthKey]) {
                grouped[monthKey] = [];
            }
            grouped[monthKey].push(trip);
        });
        
        return grouped;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    formatMonth(monthKey) {
        const [year, month] = monthKey.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="notification-close">×</button>
            </div>
        `;
        
        // Add notification styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                    max-width: 400px;
                    padding: 16px;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    animation: slideInRight 0.3s ease-out;
                }
                .notification-info { background: #3B82F6; color: white; }
                .notification-success { background: #10B981; color: white; }
                .notification-warning { background: #F59E0B; color: white; }
                .notification-error { background: #EF4444; color: white; }
                .notification-content { display: flex; justify-content: space-between; align-items: center; }
                .notification-close { background: none; border: none; color: inherit; font-size: 18px; cursor: pointer; }
                @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.vnxApp = new VNXTravelFootprints();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VNXTravelFootprints;
}