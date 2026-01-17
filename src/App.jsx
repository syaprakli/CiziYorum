import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import Upload from './pages/Upload';
import Profile from './pages/Profile';

import StepByStep from './pages/StepByStep';
import VideoTutorials from './pages/VideoTutorials';

import Settings from './pages/Settings';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.substring(1) || 'dashboard';

  // Redirect to settings on first visit if no logo is set
  useEffect(() => {
    const hasLogo = localStorage.getItem('appLogo');
    // If no logo is saved AND we are on the dashboard (root), redirect to settings
    if (!hasLogo && (location.pathname === '/' || location.pathname === '/dashboard')) {
      // We use replace: true so the user can't click back to the empty dashboard loop easily
      navigate('/settings', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">

        {/* Header / Welcome */}
        <header className="mb-8">
          <h2 className="text-4xl font-heading font-bold text-dark mb-2">
            {activeTab === 'dashboard' && 'Merhaba Ressam! 👋'}
            {activeTab === 'profile' && 'Profilin 🏅'}
            {activeTab === 'gallery' && 'Resimlerin 🖼️'}
            {activeTab === 'upload' && 'Resim Yükle 📸'}
            {activeTab === 'adim-adim' && 'Adım Adım Öğren 📏'}
            {activeTab === 'videolar' && 'Video Atölyesi 🎥'}
            {activeTab === 'settings' && 'Ayarlar ⚙️'}
          </h2>
          <p className="text-gray-500 text-lg">Bugün neler çizmek istersin?</p>
        </header>

        {/* Content Area */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/adim-adim" element={<StepByStep />} />
          <Route path="/videolar" element={<VideoTutorials />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>

      </div>
    </Layout>
  );
}

export default App;
