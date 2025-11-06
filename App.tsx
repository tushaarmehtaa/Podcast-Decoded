import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import EpisodePage from './pages/EpisodePage';
import CategoryPage from './pages/CategoryPage';
import RequestPage from './pages/RequestPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="bg-background text-richblack font-sans min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/episode/:id" element={<EpisodePage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/request" element={<RequestPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
