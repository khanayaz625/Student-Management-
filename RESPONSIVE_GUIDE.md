# DigiSkill - Responsive Classroom Management System

## Overview
DigiSkill is a modern, fully responsive classroom management system designed for digital skills training. The application is optimized for all screen sizes including desktop, tablet, and mobile devices.

## Responsive Features

### Breakpoints
The application uses the following responsive breakpoints:
- **Mobile**: ≤ 480px (Small phones)
- **Tablet**: 481px - 768px (Tablets and large phones)
- **Desktop Small**: 769px - 1024px (Small laptops)
- **Desktop**: ≥ 1025px (Large screens)

### Mobile Optimizations (≤ 768px)
- **Navigation**: Collapsible sidebar with overlay for better mobile experience
- **Navbar**: Reduced height (56px) with optimized spacing
- **Typography**: Scaled down headings and text for readability
- **Touch Targets**: Minimum 44px touch targets for better usability
- **Forms**: Full-width buttons and optimized input fields
- **Cards**: Reduced padding and adjusted spacing
- **Grids**: Single column layouts for better content flow

### Tablet Optimizations (769px - 1024px)
- **Layouts**: Optimized grid columns for medium screens
- **Sidebar**: Toggle-based navigation
- **Content**: Balanced spacing and typography
- **Dashboard**: Responsive stat cards with flexible grid

### Desktop Features (≥ 1025px)
- **Sidebar**: Always visible with 260px width
- **Multi-column Layouts**: Full grid layouts for dashboards
- **Enhanced Spacing**: Generous padding and margins
- **Advanced Features**: Full feature set with optimal spacing

## Key Responsive Components

### 1. Navbar
- Responsive logo sizing
- Collapsible menu for mobile
- Optimized notification dropdown
- Hidden user info on smaller screens

### 2. Sidebar
- Slide-in navigation for mobile/tablet
- Overlay backdrop for better UX
- Touch-friendly menu items
- Smooth transitions

### 3. Authentication Pages (Login/Register)
- Full-width forms on mobile
- Optimized input fields
- Responsive role selector (stacked on mobile)
- Adaptive padding and spacing

### 4. Dashboard
- Responsive stat cards grid
- Stacked layouts on mobile
- Optimized chart heights
- Reordered content for mobile priority

## Technology Stack
- **Frontend**: React + Vite
- **Styling**: Vanilla CSS with CSS Variables
- **Icons**: Lucide React
- **Charts**: Chart.js with React wrapper
- **Routing**: React Router DOM

## Design System

### CSS Variables
```css
--primary: #6366f1
--bg-main: #f8fafc (light) / #0f172a (dark)
--bg-card: #ffffff (light) / #1e293b (dark)
--text-main: #1e293b (light) / #f1f5f9 (dark)
--border: #e2e8f0 (light) / #334155 (dark)
--radius: 12px
```

### Typography
- **Headings**: Outfit font family
- **Body**: Inter font family
- **Responsive Scaling**: Automatic font size adjustments per breakpoint

## Running the Application

### Development
```bash
cd client
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility Features
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Touch-friendly interactions
- High contrast mode support

## Performance Optimizations
- Lazy loading for routes
- Optimized bundle size
- Efficient re-renders with React
- CSS-only animations
- Responsive images

## Future Enhancements
- Progressive Web App (PWA) support
- Offline functionality
- Push notifications
- Enhanced mobile gestures
- Tablet-specific layouts

## License
MIT License

## Support
For issues or questions, please contact the development team.
