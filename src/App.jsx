import React from 'react';
import './styles-modular.css';

// Importar componentes
import Header from './components/Header';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import Pricing from './components/Pricing';
import Inscription from './components/Inscription';
import Contact from './components/Contact';
import About from './components/About';
import Schedule from './components/Schedule';
import Equipment from './components/Equipment';
import FAQ from './components/FAQ';
import Privacy from './components/Privacy';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App" style={{ width: '100%', overflowX: 'hidden' }}>
      <Header />
      <Hero />
      <Schedule />
      <Gallery />
      <Pricing />
      <Equipment />
      <Inscription />
      <About />
      <FAQ />
      <Privacy />
      <Footer />
    </div>
  );
}

export default App;
