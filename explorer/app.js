// Main application JavaScript
class TravelFootprints {
    constructor() {
        this.trips = [];
        this.currentView = 'overview';
        this.map = null;
        this.charts = {};
        
        this.init();
    }
    
    async init() {
        try {
            // Load trip data
            await this.loadTripData();
            
            // Initialize event listeners
            this.initEventListeners();
            
            // Initialize views
            this.updateStats();
            this.renderRecentTrips();
            this.showView('overview');
            
            console.log('Travel Footprints app initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showError('Failed to initialize the application. Please refresh the page.');
        }
    }
    
    async loadTripData() {
        try {
            const response = await fetch('data/trips.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.trips = await response.json();
            console.log(`Loaded ${this.trips.length} trips`);
        } catch (error) {
            console.error('Error loading trip data:', error);
            this.trips = [];
            this.showError('Could not load trip data. Some features may not work properly.');
        }
    }
    
    initEventListeners() {
        // Desktop navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const viewName = e.currentTarget.id.replace('nav-', '');
                this.showView(viewName);
                this.updateNavigation(viewName);
            });
        });
        
        // Mobile navigation
        document.getElementById('mobile-menu-btn').addEventListener('click', () => {
            const mobileMenu = document.getElementById('mobile-menu');
            mobileMenu.classList.toggle('hidden');
        });
        
        document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const viewName = e.currentTarget.dataset.view;
                this.showView(viewName);
                this.updateMobileNavigation(viewName);
                document.getElementById('mobile-menu').classList.add('hidden');
            });
        });
        
        // Window resize handler for responsive charts
        window.addEventListener('resize', () => {
            if (this.charts.weekly) this.charts.weekly.resize();
            if (this.charts.monthly) this.charts.monthly.resize();
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
        }
    }
    
    async initializeCharts() {
        if (typeof initCharts === 'function') {
            await initCharts(this.trips);
        }
    }
    
    updateNavigation(activeView) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('nav-active');
            btn.classList.add('text-gray-500');
            btn.classList.remove('text-blue-600');
        });
        
        const activeBtn = document.getElementById(`nav-${activeView}`);
        if (activeBtn) {
            activeBtn.classList.add('nav-active');
            activeBtn.classList.remove('text-gray-500');
            activeBtn.classList.add('text-blue-600');
        }
    }
    
    updateMobileNavigation(activeView) {
        document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
            btn.classList.remove('nav-active');
            btn.classList.add('text-gray-500');
            btn.classList.remove('text-blue-600');
        });
        
        const activeBtn = document.querySelector(`[data-view="${activeView}"]`);
        if (activeBtn) {
            activeBtn.classList.add('nav-active');
            activeBtn.classList.remove('text-gray-500');
            activeBtn.classList.add('text-blue-600');
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
        
        // Update DOM
        document.getElementById('stats-countries').textContent = countries.size;
        document.getElementById('stats-cities').textContent = cities.size;
        document.getElementById('stats-distance').textContent = `${totalDistance.toFixed(1)} km`;
        document.getElementById('stats-trips').textContent = this.trips.length;
    }
    
    renderRecentTrips() {
        const container = document.getElementById('recent-trips');
        
        if (!this.trips || this.trips.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i data-feather="map-pin" class="w-12 h-12 mx-auto mb-4 text-gray-300"></i>
                    <p class="text-lg font-medium">No trips recorded yet</p>
                    <p class="text-sm">Start tracking your travels to see them here!</p>
                </div>
            `;
            feather.replace();
            return;
        }
        
        // Sort trips by date (most recent first)
        const sortedTrips = [...this.trips].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        // Show only the 5 most recent trips
        const recentTrips = sortedTrips.slice(0, 5);
        
        container.innerHTML = recentTrips.map(trip => `
            <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                        <i data-feather="map-pin" class="w-5 h-5 text-blue-500"></i>
                    </div>
                    <div>
                        <h4 class="text-sm font-medium text-gray-900">${trip.location}</h4>
                        <p class="text-sm text-gray-500">${this.formatDate(trip.date)}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-sm font-medium text-gray-900">${trip.kmWalked} km</p>
                    <p class="text-xs text-gray-500">walked</p>
                </div>
            </div>
        `).join('');
        
        feather.replace();
    }
    
    renderTimeline() {
        const container = document.getElementById('timeline-content');
        
        if (!this.trips || this.trips.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i data-feather="calendar" class="w-12 h-12 mx-auto mb-4 text-gray-300"></i>
                    <p class="text-lg font-medium">No travel timeline available</p>
                    <p class="text-sm">Your travel history will appear here once you have recorded trips.</p>
                </div>
            `;
            feather.replace();
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
                        <div class="mb-4">
                            <h4 class="text-lg font-semibold text-gray-900">${this.formatMonth(month)}</h4>
                            <p class="text-sm text-gray-500">${monthTrips.length} trips • ${totalDistance.toFixed(1)} km total</p>
                        </div>
                        <div class="space-y-3 ml-4">
                            ${monthTrips.map(trip => `
                                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div class="flex items-center space-x-3">
                                        <i data-feather="map-pin" class="w-4 h-4 text-blue-500"></i>
                                        <div>
                                            <p class="text-sm font-medium text-gray-900">${trip.location}</p>
                                            <p class="text-xs text-gray-500">${this.formatDate(trip.date)}</p>
                                        </div>
                                    </div>
                                    <span class="text-sm text-gray-600">${trip.kmWalked} km</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        
        feather.replace();
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
    
    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50';
        errorDiv.innerHTML = `
            <div class="flex items-center space-x-2">
                <i data-feather="alert-circle" class="w-5 h-5"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-red-700 hover:text-red-900">
                    <i data-feather="x" class="w-4 h-4"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        feather.replace();
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }
    
    showSuccess(message) {
        // Create success notification
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50';
        successDiv.innerHTML = `
            <div class="flex items-center space-x-2">
                <i data-feather="check-circle" class="w-5 h-5"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-green-700 hover:text-green-900">
                    <i data-feather="x" class="w-4 h-4"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(successDiv);
        feather.replace();
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (successDiv.parentElement) {
                successDiv.remove();
            }
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.travelApp = new TravelFootprints();
});
