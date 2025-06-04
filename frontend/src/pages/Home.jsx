import React from 'react';
import About from '../components/About';
import PhotoCarousel from '../components/PhotoCarousel';

function Home() {
  return (
    <div>
      <PhotoCarousel />
      <div className="container">
        <About />
      </div>
    </div>
  );
}

export default Home;
