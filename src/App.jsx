import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles-modular.css';

// Importar componentes
import Header from './components/Header';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import VideoSection from './components/VideoSection';
import Pricing from './components/Pricing';
import Inscription from './components/Inscription';
import Contact from './components/Contact';
import About from './components/About';
import Schedule from './components/Schedule';
import Equipment from './components/Equipment';
import FAQ from './components/FAQ';
import Privacy from './components/Privacy';
import Footer from './components/Footer';
import AdminPage from './components/AdminPage';

// Componente de la página principal
const HomePage = () => (
  <>
    <Header />
    <Hero />
    <Schedule />
    <Gallery />
    <VideoSection />
    <Pricing />
    <Equipment />
    <Inscription />
    <About />
    <Privacy />
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <div className="App" style={{ width: '100%', overflowX: 'hidden' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
