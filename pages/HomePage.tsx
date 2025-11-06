import React from 'react';
import Hero from '../components/Hero';
import ValueProps from '../components/ValueProps';
import RecentEpisodes from '../components/RecentEpisodes';
import Categories from '../components/Categories';
import Newsletter from '../components/Newsletter';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <ValueProps />
      <RecentEpisodes />
      <Categories />
      <Newsletter />
    </>
  );
};

export default HomePage;
