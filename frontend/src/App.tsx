import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { Toaster } from 'sonner'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AuthProvider } from '@/contexts/AuthContext'
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
        <AuthProvider>
          <ProgressProvider>
            <Toaster position="bottom-right" richColors closeButton />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/onboarding"
                  element={(
                    <ProtectedRoute>
                      <Onboarding />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/dashboard"
                  element={(
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/events"
                  element={(
                    <ProtectedRoute>
                      <Events />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/events/:id"
                  element={(
                    <ProtectedRoute>
                      <EventDetail />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/calendar"
                  element={(
                    <ProtectedRoute>
                      <CalendarPage />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/map"
                  element={(
                    <ProtectedRoute>
                      <MapPage />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/profile"
                  element={(
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/student-orgs"
                  element={(
                    <ProtectedRoute>
                      <StudentOrgs />
                    </ProtectedRoute>
                  )}
                />
                <Route path="/contact-sales" element={<ContactSales />} />
                <Route
                  path="/see-all/:section"
                  element={(
                    <ProtectedRoute>
                      <SeeAll />
                    </ProtectedRoute>
                  )}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ProgressProvider>
        </AuthProvider>
      </TooltipPrimitive.Provider>
    </QueryClientProvider>
  )
}
