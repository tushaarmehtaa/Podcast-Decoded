import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ValueProps from './components/RecentEpisodes';
import RecentEpisodes from './components/Features';
import Categories from './components/Categories';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="bg-background text-richblack font-sans">
      <Header />
      <main>
        <Hero />
        <ValueProps />
        <RecentEpisodes />
        <Categories />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default App;
