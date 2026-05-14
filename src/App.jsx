import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import { PageTitleProvider } from './contexts/PageTitleContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import Login from './pages/Login'

// Athlete pages
import AthletePlans    from './pages/athlete/Plans'
import PlanDetail      from './pages/athlete/PlanDetail'
import UnitDetail      from './pages/athlete/UnitDetail'
import Workout         from './pages/athlete/Workout'
import AthleteLog      from './pages/athlete/Log'
import AthleteWeight   from './pages/athlete/Weight'
import LogDetail       from './pages/athlete/LogDetail'
import AthleteStats    from './pages/athlete/Stats'
import AthleteProfile  from './pages/athlete/Profile'

// Trainer pages
import TrainerDashboard         from './pages/trainer/Dashboard'
import TrainerAthleteDetail     from './pages/trainer/AthleteDetail'
import TrainerAthleteLog        from './pages/trainer/AthleteLog'
import TrainerAthleteSession    from './pages/trainer/AthleteSessionDetail'
import TrainerPlans             from './pages/trainer/Plans'
import TrainerProfile           from './pages/trainer/Profile'

function ProtectedRoutes() {
  const { user, role, loading } = useAuth()

  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
      </div>
    )
  }

  if (!user) return <Login />

  if (role === 'trainer') {
    return (
      <Routes>
        <Route element={<Layout />}>
          <Route path="/trainer/athletes"                              element={<TrainerDashboard />} />
          <Route path="/trainer/athletes/:athleteId"                  element={<TrainerAthleteDetail />} />
          <Route path="/trainer/athletes/:athleteId/log"              element={<TrainerAthleteLog />} />
          <Route path="/trainer/athletes/:athleteId/log/:sessionId"   element={<TrainerAthleteSession />} />
          <Route path="/trainer/plans"                                element={<TrainerPlans />} />
          <Route path="/trainer/plans/:planId"                        element={<PlanDetail />} />
          <Route path="/trainer/plans/:planId/units/:unitId"          element={<UnitDetail />} />
          <Route path="/trainer/profile"                             element={<TrainerProfile />} />
          <Route path="*"                                             element={<Navigate to="/trainer/athletes" replace />} />
        </Route>
      </Routes>
    )
  }

  // athlete (default)
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/plans"                          element={<AthletePlans />} />
        <Route path="/plans/:planId"                  element={<PlanDetail />} />
        <Route path="/plans/:planId/units/:unitId"    element={<UnitDetail />} />
        <Route path="/log"                            element={<AthleteLog />} />
        <Route path="/weight"                         element={<AthleteWeight />} />
        <Route path="/log/:sessionId"                 element={<LogDetail />} />
        <Route path="/stats"                          element={<AthleteStats />} />
        <Route path="/profile"                        element={<AthleteProfile />} />
        <Route path="*"                               element={<Navigate to="/plans" replace />} />
      </Route>
      <Route path="/workout/:planId/:unitId"          element={<Workout />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <PageTitleProvider>
            <ToastProvider>
              <ProtectedRoutes />
            </ToastProvider>
          </PageTitleProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
