import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CareerProvider } from './context/CareerContext.jsx';
import AppShell from './layouts/AppShell.jsx';
import LandingPage from './pages/LandingPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ResumeAnalysisPage from './pages/ResumeAnalysisPage.jsx';
import JobsPage from './pages/JobsPage.jsx';
import RoadmapPage from './pages/RoadmapPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <CareerProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="analysis" element={<ResumeAnalysisPage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="roadmap" element={<RoadmapPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CareerProvider>
    </BrowserRouter>
  );
}
