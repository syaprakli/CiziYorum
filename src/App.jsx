import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import WelcomeModal from './components/layout/WelcomeModal';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import Upload from './pages/Upload';
import Profile from './pages/Profile';

import StepByStep from './pages/StepByStep';
import VideoTutorials from './pages/VideoTutorials';

import Settings from './pages/Settings';
import ShadingLab from './pages/ShadingLab';
import { migrateFromLocalStorage } from './utils/storage';

function App() {
  const location = useLocation();
  const activeTab = location.pathname.substring(1) || 'dashboard';

  useEffect(() => {
    // Migrate existing users' data from localStorage to IndexedDB
    migrateFromLocalStorage();
  }, []);

  return (
    <Layout>
      <WelcomeModal />
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
            {activeTab === 'shading' && 'Gölge Laboratuvarı 🐻☀️'}
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
          <Route path="/shading" element={<ShadingLab />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>

      </div>
    </Layout>
  );
}

export default App;
