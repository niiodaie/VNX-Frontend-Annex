// Chart functionality using Chart.js

let weeklyChart = null;
let monthlyChart = null;

async function initCharts(trips) {
    try {
        // Initialize charts
        await initWeeklyChart(trips);
        await initMonthlyChart(trips);
        generateTravelInsights(trips);
        
        console.log('Charts initialized successfully');
    } catch (error) {
        console.error('Error initializing charts:', error);
        showChartError('Failed to load chart data. Please try again.');
    }
}

async function initWeeklyChart(trips) {
    const ctx = document.getElementById('weekly-chart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (weeklyChart) {
        weeklyChart.destroy();
    }
    
    const weeklyData = processWeeklyData(trips);
    
    weeklyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weeklyData.labels,
            datasets: [{
                label: 'Distance Walked (km)',
                data: weeklyData.distances,
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(31, 41, 55, 0.9)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        title: function(context) {
                            return `Week ${context[0].label}`;
                        },
                        label: function(context) {
                            return `${context.parsed.y} km walked`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6B7280'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(229, 231, 235, 0.5)'
                    },
                    ticks: {
                        color: '#6B7280',
                        callback: function(value) {
                            return value + ' km';
                        }
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

async function initMonthlyChart(trips) {
    const ctx = document.getElementById('monthly-chart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (monthlyChart) {
        monthlyChart.destroy();
    }
    
    const monthlyData = processMonthlyData(trips);
    
    monthlyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthlyData.labels,
            datasets: [{
                label: 'Distance Traveled',
                data: monthlyData.distances,
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(31, 41, 55, 0.9)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            return `${context.parsed.y} km traveled`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6B7280'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(229, 231, 235, 0.5)'
                    },
                    ticks: {
                        color: '#6B7280',
                        callback: function(value) {
                            return value + ' km';
                        }
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}

function processWeeklyData(trips) {
    if (!trips || trips.length === 0) {
        return {
            labels: ['No Data'],
            distances: [0]
        };
    }
    
    // Group trips by week
    const weeklyTotals = {};
    
    trips.forEach(trip => {
        const date = new Date(trip.date);
        const weekStart = getWeekStart(date);
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weeklyTotals[weekKey]) {
            weeklyTotals[weekKey] = 0;
        }
        weeklyTotals[weekKey] += parseFloat(trip.kmWalked) || 0;
    });
    
    // Convert to arrays for Chart.js
    const sortedWeeks = Object.keys(weeklyTotals).sort();
    const labels = sortedWeeks.map((week, index) => `${index + 1}`);
    const distances = sortedWeeks.map(week => weeklyTotals[week]);
    
    return { labels, distances };
}

function processMonthlyData(trips) {
    if (!trips || trips.length === 0) {
        return {
            labels: ['No Data'],
            distances: [0]
        };
    }
    
    // Group trips by month
    const monthlyTotals = {};
    
    trips.forEach(trip => {
        const date = new Date(trip.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyTotals[monthKey]) {
            monthlyTotals[monthKey] = 0;
        }
        monthlyTotals[monthKey] += parseFloat(trip.kmWalked) || 0;
    });
    
    // Convert to arrays for Chart.js
    const sortedMonths = Object.keys(monthlyTotals).sort();
    const labels = sortedMonths.map(month => formatMonthLabel(month));
    const distances = sortedMonths.map(month => monthlyTotals[month]);
    
    return { labels, distances };
}

function generateTravelInsights(trips) {
    const container = document.getElementById('travel-insights');
    if (!container) return;
    
    if (!trips || trips.length === 0) {
        container.innerHTML = `
            <div class="col-span-3 text-center py-8 text-gray-500">
                <i data-feather="trending-up" class="w-12 h-12 mx-auto mb-4 text-gray-300"></i>
                <p class="text-lg font-medium">No insights available</p>
                <p class="text-sm">Travel insights will appear here once you have recorded trips.</p>
            </div>
        `;
        feather.replace();
        return;
    }
    
    const insights = calculateInsights(trips);
    
    container.innerHTML = `
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center space-x-2 mb-2">
                <i data-feather="star" class="w-5 h-5 text-blue-500"></i>
                <h4 class="font-medium text-blue-900">Most Active Month</h4>
            </div>
            <p class="text-2xl font-bold text-blue-900">${insights.mostActiveMonth.month}</p>
            <p class="text-sm text-blue-700">${insights.mostActiveMonth.distance} km traveled</p>
        </div>
        
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center space-x-2 mb-2">
                <i data-feather="target" class="w-5 h-5 text-green-500"></i>
                <h4 class="font-medium text-green-900">Average per Trip</h4>
            </div>
            <p class="text-2xl font-bold text-green-900">${insights.averageDistance} km</p>
            <p class="text-sm text-green-700">Distance walked per trip</p>
        </div>
        
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div class="flex items-center space-x-2 mb-2">
                <i data-feather="calendar" class="w-5 h-5 text-purple-500"></i>
                <h4 class="font-medium text-purple-900">Travel Frequency</h4>
            </div>
            <p class="text-2xl font-bold text-purple-900">${insights.frequency}</p>
            <p class="text-sm text-purple-700">trips per month on average</p>
        </div>
    `;
    
    feather.replace();
}

function calculateInsights(trips) {
    // Calculate most active month
    const monthlyTotals = {};
    trips.forEach(trip => {
        const date = new Date(trip.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyTotals[monthKey]) {
            monthlyTotals[monthKey] = 0;
        }
        monthlyTotals[monthKey] += parseFloat(trip.kmWalked) || 0;
    });
    
    const mostActiveMonthKey = Object.keys(monthlyTotals).reduce((a, b) => 
        monthlyTotals[a] > monthlyTotals[b] ? a : b
    );
    
    // Calculate average distance per trip
    const totalDistance = trips.reduce((sum, trip) => sum + (parseFloat(trip.kmWalked) || 0), 0);
    const averageDistance = trips.length > 0 ? (totalDistance / trips.length).toFixed(1) : 0;
    
    // Calculate travel frequency (trips per month)
    const uniqueMonths = new Set(trips.map(trip => {
        const date = new Date(trip.date);
        return `${date.getFullYear()}-${date.getMonth()}`;
    })).size;
    
    const frequency = uniqueMonths > 0 ? (trips.length / uniqueMonths).toFixed(1) : 0;
    
    return {
        mostActiveMonth: {
            month: formatMonthLabel(mostActiveMonthKey),
            distance: monthlyTotals[mostActiveMonthKey].toFixed(1)
        },
        averageDistance,
        frequency
    };
}

function getWeekStart(date) {
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
}

function formatMonthLabel(monthKey) {
    if (!monthKey || monthKey === 'undefined-undefined') {
        return 'Unknown';
    }
    
    const [year, month] = monthKey.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
    });
}

function showChartError(message) {
    // Show error in both chart containers
    const weeklyContainer = document.getElementById('weekly-chart').parentElement;
    const monthlyContainer = document.getElementById('monthly-chart').parentElement;
    
    const errorHTML = `
        <div class="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <div class="text-center">
                <i data-feather="bar-chart-off" class="w-12 h-12 mx-auto mb-4 text-gray-400"></i>
                <p class="text-gray-600">${message}</p>
            </div>
        </div>
    `;
    
    weeklyContainer.innerHTML = `<h3 class="text-lg font-semibold text-gray-900 mb-4">Weekly Travel Activity</h3>${errorHTML}`;
    monthlyContainer.innerHTML = `<h3 class="text-lg font-semibold text-gray-900 mb-4">Monthly Distance Traveled</h3>${errorHTML}`;
    
    feather.replace();
}

// Utility function to resize charts on window resize
function resizeCharts() {
    if (weeklyChart) {
        weeklyChart.resize();
    }
    if (monthlyChart) {
        monthlyChart.resize();
    }
}

// Add resize listener
window.addEventListener('resize', resizeCharts);
