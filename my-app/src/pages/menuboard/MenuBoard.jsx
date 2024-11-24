import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./menu.css";

// Dynamically load all images from a folder
const importAll = (r) => {
  const images = r.keys().map((fileName) => {
      return {
          src: r(fileName), // The image source
          name: fileName.replace('./', '') // The file name without the leading './'
      };
  });
  console.log('Loaded Entree Images:');
  return images;
}

const MenuBoard = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const entreeImages = importAll(require.context("../../images/components/entrees", false, /\.(png)$/));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
        const response = await axios.get(`${baseURL}/api/components`);

        if (response.data && response.data.length > 0) {
          setComponents(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load menu data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const MenuItem = ({ name, calories, available, premium, seasonal, image }) => (
    <div className={`menu-item ${!available ? 'unavailable' : ''}`}>
      {image && <img src={image} alt={name} className="menu-item-image" />}
      <span style={{ textDecoration: available ? 'none' : 'line-through' }}>
        {name} {calories ? `${calories} cal.` : ''}
        {seasonal && <span className="text-blue-500 text-sm ml-2">(Seasonal)</span>}
      </span>
      {!available && <span className="text-red-500 text-sm ml-2">(Currently Unavailable)</span>}
    </div>
  );

  // Get images for menu items by matching names
  const getItemImage = (componentId) => {
    if (!componentId) return null;
  
    console.log('Searching for image for ComponentID:', componentId);
    console.log('Available images:', entreeImages);
  
    const matchedImage = entreeImages.find(img => 
      img.name.startsWith(`${componentId}.`)
    );
    
    if (!matchedImage) {
      console.warn(`No image found for ComponentID: ${componentId}`);
    }
    
    return matchedImage ? matchedImage.src : null;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="menu-container">
      {/* Header */}
      <header className="header">
        <h1 className="main-title">STEP 1: CREATE YOUR MEAL</h1>
      </header>

      {/* Meal Types */}
      <section className="meal-types">
        <div className="meal-type">
          <h2>CLASSIC BOWL - $8.30</h2>
          <p class="center">Classic Entree + 1 Side</p>
        </div>
        <div className="meal-type">
          <h2>CLASSIC PLATE - $9.80</h2>
          <p class="center">2 Classic Entrees + 1 Side</p>
        </div>
        <div className="meal-type">
          <h2>BIGGER PLATE - $11.30</h2>
          <p class="center">3 Classic Entrees + 1 Side</p>
        </div>
      </section>

      {/* Step 2 */}
      <header className="header">
        <h1>STEP 2: CHOOSE YOUR SIDE</h1>
      </header>
      <section className="sides">
        <div className="side-category">
        {components
            .filter(item => 
              item.category === 'Side' 
            )
            .map(item => (
              <MenuItem
                key={item.component_name}
                name={item.component_name}
                calories={item.calories}
                available={item.availability}
                seasonal={item.seasonal}
              />
            ))}
        </div>

      </section>


      {/* Step 3 */}
      <header className="header">
        <h1>STEP 3: SELECT YOUR ENTREE(S)</h1>
      </header>

      {/* Entrees */}
      <section className="entrees">
        <div>
          <h3>CLASSIC ENTREES</h3>
          {components
            .filter(item => 
              item.category === 'Main Course' && 
              !item.premium
            )
            .map(item => (
              <MenuItem
                key={item.component_name}
                name={item.component_name}
                calories={item.calories}
                available={item.availability}
                seasonal={item.seasonal}
                image={getItemImage(item.ComponentID)}
              />
            ))}
        </div>
        <div>
          <h3>PREMIUM ENTREES (+$1.50)</h3>
          {components
            .filter(item => 
              item.category === 'Main Course' && 
              item.premium
            )
            .map(item => (
              <MenuItem
                key={item.component_name}
                name={item.component_name}
                calories={item.calories}
                available={item.availability}
                seasonal={item.seasonal}
                image={getItemImage(item.ComponentID)}
                
              />
            ))}
        </div>
      </section>
      {/* Step 4 */}
      <header className="header">
        <h1>A LA CARTE ENTREE & SIDES</h1>
      </header>
      <section className="sides">
        <div>
          <h3>Appetizers</h3>
          {components
            .filter(item => 
              item.category === 'Appetizer'
            )
            .map(item => (
              <MenuItem
                key={item.component_name}
                name={item.component_name}
                calories={item.calories}
                available={item.availability}
                seasonal={item.seasonal}
              />
            ))}
        </div>
        <div>
          <h3>Beverages</h3>
          {components
            .filter(item => 
              item.category === 'Beverage'
            )
            .map(item => (
              <MenuItem
                key={item.component_name}
                name={item.component_name}
                calories={item.calories}
                available={item.availability}
                seasonal={item.seasonal}
              />
            ))}
        </div>
        <div>
          <h3>Desserts</h3>
          {components
            .filter(item => 
              item.category === 'Dessert'
            )
            .map(item => (
              <MenuItem
                key={item.component_name}
                name={item.component_name}
                calories={item.calories}
                available={item.availability}
                seasonal={item.seasonal}
              />
            ))}
        </div>
      </section>

    
    </div>
  );
};

export default MenuBoard;