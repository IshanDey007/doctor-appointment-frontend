# 🏥 Doctor Appointment Booking System - Frontend

A modern, responsive React + TypeScript frontend for the healthcare appointment booking system with real-time slot availability and seamless booking experience.

## 🚀 Features

- **Patient Portal**: Browse doctors, view available slots, book appointments
- **Admin Dashboard**: Manage doctors and create appointment slots
- **Real-time Updates**: Instant slot availability using Context API
- **Form Validation**: Client-side validation with error handling
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Smooth loading indicators for better UX

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router v6** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **date-fns** - Date formatting

## 📦 Installation

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/IshanDey007/doctor-appointment-frontend.git
cd doctor-appointment-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000
```

4. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── context/            # Context API for state management
│   └── AppContext.tsx
├── pages/              # Page components
│   ├── Home.tsx        # Patient portal
│   ├── Admin.tsx       # Admin dashboard
│   └── Booking.tsx     # Booking page
├── services/           # API service layer
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🎨 Key Components

### Context API (State Management)

**AppContext** provides global state for:
- Doctors list
- Available slots
- Bookings
- Loading states
- Error handling

```typescript
const { 
  doctors, 
  slots, 
  bookings, 
  loading, 
  error,
  fetchDoctors,
  createBooking,
  // ... more actions
} = useApp();
```

### API Service Layer

Centralized API calls with error handling:

```typescript
// Example: Fetch available slots
const slots = await slotApi.getAvailable({
  doctor_id: 1,
  date: '2025-12-15'
});
```

### Reusable Components

- **Button**: Multiple variants (primary, secondary, danger, outline)
- **Input**: Form input with validation and error states
- **Card**: Container component with hover effects
- **LoadingSpinner**: Customizable loading indicator
- **ErrorMessage**: User-friendly error display

## 📱 Pages

### 1. Home Page (`/`)

**Features:**
- Browse available appointment slots
- Filter by specialization and date
- View doctor information
- Quick booking access

**Key Functionality:**
```typescript
// Filter slots by date and specialization
useEffect(() => {
  fetchSlots({ 
    date: selectedDate, 
    specialization: selectedSpecialization 
  });
}, [selectedDate, selectedSpecialization]);
```

### 2. Admin Dashboard (`/admin`)

**Features:**
- Create new doctors
- Add appointment slots (single or bulk)
- View all doctors
- Manage availability

**Bulk Slot Creation:**
```typescript
// Create slots from 9 AM to 5 PM with 30-min intervals
await createBulkSlots({
  doctor_id: 1,
  slot_date: '2025-12-15',
  start_time: '09:00',
  end_time: '17:00',
  duration_minutes: 30
});
```

### 3. Booking Page (`/booking/:id`)

**Features:**
- View slot details
- Patient information form
- Form validation
- Booking confirmation

**Form Validation:**
```typescript
const validateForm = () => {
  // Email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Invalid email format';
  }
  // Phone validation
  if (phone && !/^\+?[\d\s-()]+$/.test(phone)) {
    errors.phone = 'Invalid phone number';
  }
};
```

## 🔄 State Management Flow

```
User Action → Component → Context API → API Service → Backend
                ↓                           ↓
            Update UI ← Update State ← Response
```

**Example: Creating a Booking**

1. User fills form and submits
2. Component calls `createBooking()` from context
3. Context calls API service
4. API service makes HTTP request
5. Response updates context state
6. Component re-renders with new data

## 🎯 Error Handling

**Multi-Level Error Handling:**

1. **API Level**: Axios interceptors catch network errors
2. **Service Level**: Transform errors to user-friendly messages
3. **Context Level**: Store errors in global state
4. **Component Level**: Display errors with ErrorMessage component

```typescript
try {
  await createBooking(data);
} catch (error) {
  // Error automatically stored in context
  // Component displays error via useApp().error
}
```

## 🚀 Build & Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `VITE_API_URL`: Your backend API URL
4. Deploy

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy `dist/` folder to Netlify
3. Set environment variables in Netlify dashboard
4. Configure redirects for SPA routing:

Create `public/_redirects`:
```
/*    /index.html   200
```

## 🧪 Testing

### Manual Testing Checklist

**Home Page:**
- [ ] Slots load correctly
- [ ] Filters work (date, specialization)
- [ ] Empty state shows when no slots
- [ ] Loading spinner appears during fetch
- [ ] Error message shows on API failure

**Admin Page:**
- [ ] Doctor creation form works
- [ ] Bulk slot creation works
- [ ] Form validation prevents invalid data
- [ ] Success messages appear
- [ ] Doctors list updates after creation

**Booking Page:**
- [ ] Slot details display correctly
- [ ] Form validation works
- [ ] Booking succeeds with valid data
- [ ] Error shows for invalid data
- [ ] Success screen appears after booking
- [ ] Concurrent bookings handled (one succeeds, others fail)

### Concurrency Test

Open multiple browser tabs and try booking the same slot simultaneously:

```bash
# Expected: Only one booking succeeds
# Others get "Slot no longer available" error
```

## 📊 Performance Optimizations

1. **Efficient Re-renders**: useCallback for memoized functions
2. **Lazy Loading**: Code splitting with React.lazy (future enhancement)
3. **API Caching**: Avoid redundant API calls
4. **Optimized Images**: Use WebP format (future enhancement)
5. **Bundle Size**: Tree-shaking with Vite

## 🎨 Styling Guidelines

**Tailwind CSS Conventions:**

- Use utility classes for consistency
- Custom colors defined in `tailwind.config.js`
- Responsive design with mobile-first approach
- Consistent spacing scale (4px base)

**Color Palette:**
- Primary: Blue (#3b82f6)
- Success: Green (#10b981)
- Error: Red (#ef4444)
- Warning: Yellow (#f59e0b)

## 🔐 Security Considerations

1. **Input Sanitization**: All user inputs validated
2. **XSS Prevention**: React's built-in escaping
3. **HTTPS Only**: Production uses HTTPS
4. **Environment Variables**: Sensitive data in .env
5. **CORS**: Configured in backend

## 📱 Responsive Design

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Mobile Optimizations:**
- Touch-friendly buttons (min 44px)
- Simplified navigation
- Stacked layouts on small screens
- Optimized font sizes

## 🐛 Common Issues & Solutions

**Issue: API calls fail with CORS error**
```
Solution: Ensure backend CORS_ORIGIN includes frontend URL
```

**Issue: Slots don't update after booking**
```
Solution: Context automatically removes booked slots from state
```

**Issue: Build fails with TypeScript errors**
```
Solution: Run `npm run build` to see detailed errors
Fix type mismatches in components
```

## 🚀 Future Enhancements

1. **User Authentication**: Login/signup for patients
2. **Booking History**: View past appointments
3. **Notifications**: Email/SMS confirmations
4. **Payment Integration**: Online payment for appointments
5. **Video Consultation**: Integrate video calling
6. **Calendar View**: Visual calendar for slot selection
7. **Multi-language**: i18n support
8. **Dark Mode**: Theme toggle
9. **PWA**: Offline support
10. **Analytics**: Track user behavior

## 👨‍💻 Development Guidelines

### Code Style

- Use functional components with hooks
- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for formatting (future)

### Component Structure

```typescript
// 1. Imports
import React, { useState } from 'react';

// 2. Types/Interfaces
interface Props {
  title: string;
}

// 3. Component
const Component: React.FC<Props> = ({ title }) => {
  // 4. State
  const [state, setState] = useState();
  
  // 5. Effects
  useEffect(() => {}, []);
  
  // 6. Handlers
  const handleClick = () => {};
  
  // 7. Render
  return <div>{title}</div>;
};

// 8. Export
export default Component;
```

## 📄 License

MIT License - feel free to use this project for learning and development.

## 👨‍💻 Author

**Ishan Dey**
- Email: irock9431@gmail.com
- GitHub: [@IshanDey007](https://github.com/IshanDey007)

## 🙏 Acknowledgments

- React team for amazing framework
- Tailwind CSS for utility-first CSS
- Vite for blazing fast builds
- Lucide for beautiful icons

---

**Built with ❤️ for Modex Assessment**