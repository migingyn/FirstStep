import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { Toaster } from 'sonner'
import { ProgressProvider } from '@/contexts/ProgressContext'

import Index from '@/pages/Index'
import Auth from '@/pages/Auth'
import Onboarding from '@/pages/Onboarding'
import Dashboard from '@/pages/Dashboard'
import Events from '@/pages/Events'
import EventDetail from '@/pages/EventDetail'
import CalendarPage from '@/pages/CalendarPage'
import MapPage from '@/pages/MapPage'
import Profile from '@/pages/Profile'
import StudentOrgs from '@/pages/StudentOrgs'
import ContactSales from '@/pages/ContactSales'
import SeeAll from '@/pages/SeeAll'
import NotFound from '@/pages/NotFound'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipPrimitive.Provider>
        <ProgressProvider>
          <Toaster position="bottom-right" richColors closeButton />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/student-orgs" element={<StudentOrgs />} />
              <Route path="/contact-sales" element={<ContactSales />} />
              <Route path="/see-all/:section" element={<SeeAll />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ProgressProvider>
      </TooltipPrimitive.Provider>
    </QueryClientProvider>
  )
}
