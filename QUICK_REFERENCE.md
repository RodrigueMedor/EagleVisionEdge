# Eagle Vision Edge - Quick Reference Guide

## 🚀 Quick Start (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# http://localhost:5173

# 4. Login with
# Email: admin@igr.com
# Password: admin123
```

## 📁 Where to Add New Features

### Adding a New Page

```
1. Create component:
   src/pages/dashboard/NewFeature/FeaturePage.tsx

2. Add to routes:
   src/routes/index.tsx

3. Create mock service (if needed):
   src/services/featureService.ts

4. Create mock data:
   src/data/mockFeatures.ts
```

### Adding a New Component

```
1. Reusable UI component:
   src/components/ui/NewComponent.tsx

2. Feature-specific:
   src/components/FeatureComponent.tsx

3. Use in pages and other components
```

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run linter
npm run type-check      # Run TypeScript check

# Scripts
npm audit              # Check vulnerabilities
npm update             # Update dependencies
npm install <package>  # Install new package
```

## 📚 Import Patterns

### Use path aliases (recommended)
```typescript
import Button from '@/components/ui/Button'
import { inventoryService } from '@/services/inventoryService'
import { Vehicle } from '@/types/vehicle'
import { useAuth } from '@/hooks'
```

### Avoid relative imports
```typescript
// ❌ Don't do this
import Button from '../../../components/ui/Button'

// ✅ Do this instead
import Button from '@/components/ui/Button'
```

## 🔐 Authentication

### Check if user is logged in
```typescript
import { useAuth } from '@/hooks'

export default function MyComponent() {
  const { isAuthenticated, user } = useAuth()
  
  if (!isAuthenticated) {
    return <Login />
  }
  
  return <p>Welcome {user?.name}</p>
}
```

### Logout
```typescript
import { useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'

const dispatch = useAppDispatch()
dispatch(logout())
```

## 📢 Notifications

```typescript
import { useNotification } from '@/hooks'

const { success, error, warning, info } = useNotification()

// Show notification (auto-hides after 3s)
success('Operation completed!')
error('Something went wrong')
warning('Warning message')
info('Info message')

// Custom duration
success('Message', 5000)  // 5 seconds
```

## 🎨 UI Components Quick Reference

### Button
```tsx
<Button variant="primary" size="lg">Click me</Button>
// Variants: primary, secondary, accent, ghost
// Sizes: sm, md, lg
```

### Input
```tsx
<Input
  label="Name"
  type="text"
  error="Required field"
  onChange={...}
/>
```

### Select
```tsx
<Select
  label="Status"
  options={[
    { value: 'open', label: 'Open' },
    { value: 'closed', label: 'Closed' },
  ]}
  onChange={...}
/>
```

### Modal
```tsx
<Modal isOpen={open} onClose={onClose} title="Edit">
  Form content here
</Modal>
```

### Card
```tsx
<Card hoverable onClick={handleClick}>
  Card content here
</Card>
```

### Status Badge
```tsx
import { StatusBadge } from '@/components/ui/Card'

<StatusBadge status="Available" variant="success" />
// Variants: success, warning, error, info
```

## 📊 Using Mock Services

### Fetch data
```typescript
import { inventoryService } from '@/services/inventoryService'

const vehicles = await inventoryService.getVehicles()
const vehicle = await inventoryService.getVehicleById('1')
```

### Create/Update/Delete
```typescript
// Add vehicle
const newVehicle = await inventoryService.addVehicle({
  make: 'Toyota',
  model: 'Camry',
  // ... other fields
})

// Update
const updated = await inventoryService.updateVehicle('id', {
  status: 'sold'
})

// Delete
await inventoryService.deleteVehicle('id')
```

### Search and Filter
```typescript
const results = await inventoryService.searchVehicles('camry')

const filtered = await inventoryService.filterVehicles({
  make: 'Toyota',
  maxPrice: 25000,
  status: 'available'
})
```

## 🎯 Redux Patterns

### Read state
```typescript
import { useAppSelector } from '@/store/hooks'

const user = useAppSelector(state => state.auth.user)
const notifications = useAppSelector(state => state.notifications.items)
```

### Dispatch actions
```typescript
import { useAppDispatch } from '@/store/hooks'
import { addNotification } from '@/store/slices/notificationsSlice'

const dispatch = useAppDispatch()

dispatch(addNotification({
  id: 'id-1',
  type: 'success',
  message: 'Done!',
  duration: 3000
}))
```

## 📱 Responsive Design

### Tailwind breakpoints
```tsx
// Mobile first approach
<div className="
  grid grid-cols-1      // Mobile: 1 column
  md:grid-cols-2        // Tablet: 2 columns
  lg:grid-cols-4        // Desktop: 4 columns
">
```

### Hide/Show by breakpoint
```tsx
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>
```

## 🔍 Debugging

### Console
```typescript
// Check Redux state
console.log(store.getState())

// Check auth
const auth = useAppSelector(state => state.auth)
console.log('Auth:', auth)
```

### Redux DevTools
- Install Redux DevTools browser extension
- In dev mode, inspect Redux actions and state

### TypeScript Errors
```bash
# Check all TS errors
npm run type-check

# Build will show errors too
npm run build
```

## 📋 Type Definitions

### Use existing types
```typescript
import { Vehicle } from '@/types/vehicle'
import { Lead } from '@/types/lead'
import { Customer } from '@/types/customer'
```

### Define new types
```typescript
// src/types/myFeature.ts
export type MyStatus = 'new' | 'processing' | 'done'

export interface MyEntity {
  id: string
  name: string
  status: MyStatus
  createdAt: Date
}
```

## 🚨 Error Handling

### In async operations
```typescript
try {
  const result = await inventoryService.getVehicles()
  setVehicles(result)
} catch (error) {
  const message = error instanceof Error ? error.message : 'Failed to load'
  showError(message)
}
```

### Show error UI
```typescript
{error && (
  <div className="p-3 bg-red-50 border border-red-200 rounded">
    {error}
  </div>
)}
```

## 🎓 Project File Reference

| File | Purpose |
|------|---------|
| `src/routes/index.tsx` | Route definitions |
| `src/store/index.ts` | Redux store config |
| `src/App.tsx` | Root component |
| `src/main.tsx` | Entry point |
| `App.tsx` | App wrapper |
| `vite.config.ts` | Build config |
| `tailwind.config.js` | Styling config |
| `tsconfig.json` | TypeScript config |

## 🔗 Service Files

| Service | Location |
|---------|----------|
| Authentication | `src/services/authService.ts` |
| Inventory | `src/services/inventoryService.ts` |
| Leads | `src/services/leadsService.ts` |
| Customers | `src/services/customersService.ts` |
| Rentals | `src/services/rentalsService.ts` |
| Analytics | `src/services/analyticsService.ts` |

## 📚 Additional Resources

- **Setup Guide**: See `SETUP_GUIDE.md`
- **Migration Guide**: See `MIGRATION_GUIDE.md`
- **Implementation Summary**: See `IMPLEMENTATION_SUMMARY.md`
- **React Router Docs**: https://reactrouter.com/
- **Redux Toolkit Docs**: https://redux-toolkit.js.org/
- **Tailwind CSS Docs**: https://tailwindcss.com/

## 💡 Pro Tips

1. **Use custom hooks** for repeated logic
2. **Type everything** - TypeScript catches errors early
3. **Keep components small** - easier to test and maintain
4. **Use Redux for shared state** - components stay simple
5. **Mock first** - replace services later
6. **Responsive by default** - start mobile, add desktop
7. **Check the console** - HMR updates info is there
8. **Use DevTools** - Redux DevTools for state debugging

---

**Last Updated**: May 2024  
**Version**: 1.0.0-alpha

