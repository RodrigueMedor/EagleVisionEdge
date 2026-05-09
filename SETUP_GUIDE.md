# Eagle Vision Edge - Dealership SaaS Platform

A modern, professional SaaS platform for independent auto dealerships built with React, TypeScript, Vite, and Tailwind CSS.

## Features

### ✅ Implemented
- **Authentication**: Login, Register, Password Reset (mock)
- **Dashboard**: KPI cards, inventory status, quick actions
- **State Management**: Redux Toolkit with auth, UI, notifications
- **Responsive Design**: Mobile-first, works on all devices
- **Mock Services**: Simulated API layer for future backend integration
- **Professional UI**: Tailwind CSS styling, Lucide icons

### 📋 Architecture
- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Components**: Lucide React Icons
- **Backend**: Mock services (ready for Axios integration)

### 📦 Modules (Ready for Development)
1. **Inventory Management**: Add, edit, delete, search, filter vehicles
2. **Lead Management**: Pipeline tracking, status updates, communication history
3. **Customers**: Customer profiles, segmentation, purchase history
4. **Rentals**: Rental management and tracking
5. **Analytics**: Dashboard analytics and reporting
6. **Settings**: Dealership settings and user management

## Tech Stack

```
Frontend:
- React 18.2
- TypeScript 5.3
- Vite 5.0
- React Router 6
- Redux Toolkit 1.9
- Tailwind CSS 3.4
- Lucide React Icons
- Recharts (for analytics)
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/           # Base UI components (Button, Input, etc.)
│   ├── Navbar.tsx    # Navigation bar
│   ├── Sidebar.tsx   # Dashboard sidebar
│   ├── Footer.tsx    # Page footer
│   └── Toast.tsx     # Notification toast
├── pages/            # Page components
│   ├── public/       # Public-facing pages
│   ├── auth/         # Authentication pages
│   └── dashboard/    # Dashboard pages
├── layouts/          # Layout wrappers
│   ├── PublicLayout.tsx
│   └── DashboardLayout.tsx
├── services/         # Mock API services
│   ├── authService.ts
│   ├── inventoryService.ts
│   ├── leadsService.ts
│   ├── customersService.ts
│   ├── rentalsService.ts
│   └── analyticsService.ts
├── store/            # Redux store
│   ├── slices/      # Redux slices (auth, ui, notifications)
│   └── hooks.ts     # Redux hooks
├── types/            # TypeScript type definitions
├── data/             # Mock data
├── hooks/            # Custom React hooks
├── routes/           # Route configuration
├── utils/            # Utility functions
└── styles/           # Global styles
```

## Setup & Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm build

# Preview production build
npm preview
```

## Running the Application

1. **Start the development server**:
```bash
npm run dev
```

2. **Navigate to** `http://localhost:5173` (default Vite port)

3. **Login with demo credentials**:
   - Email: `admin@igr.com`
   - Password: `admin123`
   
   Or register a new account

4. **Explore the dashboard**:
   - View inventory statistics
   - Navigate between modules
   - Test responsive design on mobile

## Demo Credentials

```
Admin Account:
- Email: admin@igr.com
- Password: admin123
- Role: Administrator

Manager Account:
- Email: manager@igr.com
- Password: manager123
- Role: Manager

Sales Rep Account:
- Email: sales@igr.com
- Password: sales123
- Role: Sales Representative
```

## Development Workflow

### Adding a New Feature

1. **Create the page component** in `src/pages/`
2. **Add types** to `src/types/` if needed
3. **Create mock service** in `src/services/`
4. **Add mock data** in `src/data/`
5. **Build the UI components** in `src/components/`
6. **Wire up routing** in `src/routes/index.tsx`

### Redux State Management

```typescript
// Using Redux in components
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { addNotification } from '@/store/slices/notificationsSlice'

export default function MyComponent() {
  const { user, isAuthenticated } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()

  const handleAction = () => {
    dispatch(addNotification({
      id: 'id-1',
      type: 'success',
      message: 'Action completed!',
      duration: 3000,
    }))
  }
}
```

### Using Mock Services

```typescript
// Services are async and simulated
import { inventoryService } from '@/services/inventoryService'

// Get all vehicles
const vehicles = await inventoryService.getVehicles()

// Add new vehicle
const newVehicle = await inventoryService.addVehicle({
  make: 'Toyota',
  model: 'Camry',
  // ...
})

// Services return mock data with realistic delays (100-500ms)
```

## Key Components

### Button
```tsx
<Button variant="primary" size="md">
  Click me
</Button>
```

### Input
```tsx
<Input
  label="Email"
  type="email"
  error="Invalid email"
  onChange={...}
/>
```

### Modal
```tsx
<Modal isOpen={open} onClose={onClose} title="My Modal">
  Modal content here
</Modal>
```

### Card
```tsx
<Card hoverable onClick={...}>
  Card content here
</Card>
```

### Toast Notifications
```tsx
import { useNotification } from '@/hooks'

const { success, error, warning, info } = useNotification()

success('Success message!')
error('Error occurred!')
```

## Authentication Flow

The app uses Redux for auth state management:

1. User logs in → `authService.login()` → `loginSuccess` action
2. Auth state saved to localStorage
3. Protected routes check `isAuthenticated`
4. User logs out → `logout` action → redirects to login

## Mock Data

The app includes realistic mock data for:
- 10+ vehicles with full details
- 8+ leads with communication history
- 5+ customers with purchase history
- 3+ active rentals
- Month-by-month analytics data

All mock data is generated at app startup and persists in memory during the session.

## Future Backend Integration

The services are designed to be easily replaced:

```typescript
// Current: Mock service
// services/inventoryService.ts uses JSON data

// Future: Replace with Axios calls
const response = await axios.get('/api/vehicles')
return response.data
```

## Performance

- **Code Splitting**: Pages loaded with lazy() and Suspense
- **Bundle Optimization**: Vite optimizations configured
- **Responsive Images**: SVG placeholders for vehicles
- **CSS**: Tailwind production purging enabled
- **Assets**: Minified and optimized in production build

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### Netlify/Vercel Deployment

```bash
# Build
npm run build

# Output in ./dist folder
# Deploy the dist/ folder
```

### Environment Variables

Create `.env.local` file:

```
VITE_API_BASE_URL=https://api.example.com
VITE_APP_NAME=Eagle Vision Edge
VITE_DEALERSHIP_NAME=IGR AUTO SALES
```

## Development Commands

```bash
# Development server with hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Roadmap

### Phase 1: ✅ Foundation (Completed)
- Project setup and structure
- Authentication UI
- Redux state management
- Base components
- Mock services

### Phase 2: 📝 Core Features (Next)
- Inventory CRUD pages
- Lead management pages
- Customer management pages
- Dashboard analytics

### Phase 3: 🎨 Polish & Optimization
- Mobile responsive refinement
- Accessibility improvements
- Performance optimization
- E2E testing setup

### Phase 4: 🔗 Backend Integration
- Replace mock services with real API
- Database schema setup
- Authentication with JWT
- Real-time updates

## Code Style

- **TypeScript**: Strict mode enabled
- **Components**: Functional components with hooks
- **Styling**: Tailwind CSS utility classes
- **Icons**: Lucide React icons
- **Import Aliases**: Use `@/` for src imports

## Contributing

When building features:

1. Create components in appropriate directories
2. Add TypeScript types
3. Use existing UI components for consistency
4. Follow the Redux pattern for state
5. Add proper error handling
6. Make components responsive

## License

Commercial License - All Rights Reserved

## Support

For issues or questions, refer to the implementation plan and documentation in this project.

---

**Built with ❤️ for dealership operations**

Last Updated: May 2024

