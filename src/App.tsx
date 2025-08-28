import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AuthScreen from './components/AuthScreen';
import OnboardingFlow from './components/OnboardingFlow';
import Dashboard from './components/Dashboard';
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function App() {
  const [showAuth, setShowAuth] = React.useState(false);
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [showDashboard, setShowDashboard] = React.useState(false);

  const handleAuthComplete = () => {
    setShowAuth(false);
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowDashboard(true);
  };

  // For demo purposes, you can trigger onboarding/dashboard from the homepage
  React.useEffect(() => {
    // Listen for demo triggers
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'o' && e.ctrlKey) {
        setShowAuth(true);
      }
      if (e.key === 'd' && e.ctrlKey) {
        setShowDashboard(true);
        setShowOnboarding(false);
      }
      if (e.key === 'h' && e.ctrlKey) {
        setShowAuth(false);
        setShowOnboarding(false);
        setShowDashboard(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (showAuth) {
    return <AuthScreen onAuthComplete={handleAuthComplete} />;
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  if (showDashboard) {
    return <Dashboard />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;