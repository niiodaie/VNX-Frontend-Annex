# VNX Travel Footprints

A clean, responsive frontend application for tracking travel history, visualizing footprints across the globe, and generating personal travel statistics. Part of the Visnec Nexus (VNX) ecosystem.

## Features

- **Interactive Travel Map**: Visualize your travel locations with markers and routes using Leaflet.js
- **Travel Analytics**: Weekly and monthly travel charts with insights
- **Timeline View**: Chronological travel history with detailed trip information
- **Statistics Dashboard**: Real-time stats for countries visited, cities explored, and distances traveled
- **Responsive Design**: Mobile-first design with Inter font and VNX brand styling
- **PWA Ready**: Progressive Web App capabilities with manifest.json

## Project Structure

```
VNX-TravelFootprints/
├── index.html              # Main entry page
├── css/
│   └── style.css           # VNX brand styles with CSS custom properties
├── js/
│   ├── main.js             # Main application logic
│   ├── map.js              # Leaflet.js map functionality
│   └── chart.js            # Chart.js analytics
├── assets/
│   ├── icons/
│   │   └── vnx-logo.svg    # VNX brand logo
│   └── images/
├── data/
│   ├── sample-locations.json # Travel data
│   └── trips.json         # Legacy travel data (fallback)
├── components/
│   ├── navbar.html         # Navigation component
│   ├── footer.html         # Footer component
│   └── travel-card.html    # Travel card template
├── locales/
│   └── en.json            # English localization
├── manifest.json          # PWA manifest
└── README.md              # This file
```

## Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with VNX brand colors and Inter font
- **Maps**: Leaflet.js for interactive maps
- **Charts**: Chart.js for data visualization
- **Icons**: Custom SVG icons with VNX branding

## Design System

### Colors
- Primary Blue: `#3B82F6`
- Primary Blue Dark: `#2563EB`
- Primary Blue Light: `#60A5FA`
- Accent Green: `#10B981`
- Accent Coral: `#F59E0B`

### Typography
- Primary Font: Inter (Google Fonts)
- Secondary Font: Roboto

### Components
- Modular component structure for scalability
- Responsive grid system
- Card-based layouts
- Modern button styles with hover effects

## Getting Started

1. **Serve the files** using a local server:
   ```bash
   python -m http.server 5000
   ```

2. **Open in browser**: Navigate to `http://localhost:5000`

3. **View your travel data**: The app loads sample travel data from `data/sample-locations.json`

## Features Overview

### Hero Section
- Modern gradient background with VNX branding
- Call-to-action buttons for tracking and map exploration

### Navigation
- Sticky navigation with VNX logo
- Clean navigation between Overview, Map, Timeline, and Analytics

### Overview Dashboard
- Live statistics cards with animated counters
- Recent travel activity feed
- VNX-branded styling

### Interactive Map
- Leaflet.js integration with OpenStreetMap tiles
- Travel markers with numbered pins
- Route connections between locations
- Popup details for each trip

### Timeline View
- Chronological travel history
- Grouped by month with distance totals
- Visual timeline with connected dots

### Analytics
- Weekly travel activity bar chart
- Monthly distance line chart
- Travel insights with key metrics

## Data Format

Travel data should follow this JSON structure:

```json
[
  {
    "location": "Paris, France",
    "date": "2024-01-15",
    "kmWalked": 12.5
  }
]
```

## Customization

### Styling
- Edit `css/style.css` to modify VNX brand colors and styling
- CSS custom properties allow easy theme customization

### Components
- Modify `components/*.html` files for layout changes
- Update `js/main.js` for functionality changes

### Localization
- Add language files in `locales/` directory
- Update `js/main.js` to support new languages

## Browser Support

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized for fast loading with minimal dependencies
- Efficient component-based architecture
- Responsive images and lazy loading ready

## VNX Ecosystem Integration

This application is part of the Visnec Nexus ecosystem and follows VNX design guidelines:
- Consistent branding and color scheme
- Modular architecture for integration
- Standard component patterns
- PWA capabilities for app-like experience

## Future Enhancements

- Real-time geolocation tracking
- Photo integration with travel entries
- Social sharing capabilities
- Export functionality for travel reports
- Integration with other VNX applications

## License

Part of the Visnec Nexus ecosystem. All rights reserved.