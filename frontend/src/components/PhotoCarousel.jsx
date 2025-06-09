import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './PhotoCarousel.css';

const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;

function PhotoCarousel() {
  const [productImages, setProductImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch products to get images
    API.get('/products').then(res => {
      // Get all product images and shuffle them
const images = res.data.map(product => ({
  url: product.image.startsWith('http') ? product.image : BACKEND_BASE_URL + product.image,
  title: product.title
}));
      
      // Shuffle array to randomize images
      const shuffled = images.sort(() => 0.5 - Math.random());
      setProductImages(shuffled);
    }).catch(err => {
      console.error('Error fetching products:', err);
    });
  }, []);

  useEffect(() => {
    if (productImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => 
        prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [productImages.length]);

  if (productImages.length === 0) {
    return null; // Don't render if no images
  }

  // Get 5 images to display (current + next 4)
  const getVisibleImages = () => {
    const visible = [];
    for (let i = 0; i < 5; i++) {
      const index = (currentIndex + i) % productImages.length;
      visible.push(productImages[index]);
    }
    return visible;
  };

  const visibleImages = getVisibleImages();

  return (
    <div className="photo-carousel">
      <div className="carousel-overlay">
        <h1 className="carousel-title">
          Welcome to Afrin's Store
        </h1>
        <p className="carousel-subtitle">
          Discover Amazing Fashion & Style
        </p>
      </div>
      
      <div className="carousel-track">
        {/* Duplicate images for seamless loop */}
        {[...visibleImages, ...visibleImages].map((image, index) => (
        <div
          key={image.url + '-' + index}
          className="carousel-item"
        >
            <img
              src={image.url}
              alt={image.title}
              className="carousel-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PhotoCarousel;
