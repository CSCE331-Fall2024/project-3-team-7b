import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./menu.css";

// Component to display the menu board
const MenuBoard = () => {
  // State to store menu components data, loading status, and error messages
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Dynamically imports images from a given category folder.
   * @param {string} category - The category name to import images for.
   * @returns {object} - An object mapping image IDs to their paths.
   */
  const importCategoryImages = (category) => {
    try {
      const images = {};
      const context = {
        entrees: require.context('../../images/components/entrees', false, /\.(png|jpe?g)$/),
        drinks: require.context('../../images/components/drinks', false, /\.(png|jpe?g)$/),
        sides: require.context('../../images/components/sides', false, /\.(png|jpe?g)$/),
        appetizers: require.context('../../images/components/appetizers', false, /\.(png|jpe?g)$/),
        desserts: require.context('../../images/components/dessert', false, /\.(png|jpe?g)$/)
      }[category];

      context.keys().forEach((key) => {
        const id = key.replace('./', '').replace(/\.(png|jpe?g)$/, '');
        images[id] = context(key);
      });
      
      return images;
    } catch (error) {
      console.error(`Error importing ${category} images:`, error);
      return {};
    }
  };

  // Map of categories to their respective images
  const imagesByCategory = {
    'Main Course': importCategoryImages('entrees'),
    'Beverage': importCategoryImages('drinks'),
    'Side': importCategoryImages('sides'),
    'Appetizer': importCategoryImages('appetizers'),
    'Dessert': importCategoryImages('desserts')
  };

  /**
   * Retrieves the image for a specific component based on its ID and category.
   * @param {number|string} ComponentId - The ID of the component.
   * @param {string} category - The category of the component.
   * @returns {string|null} - The image path or null if not found.
   */
  const getItemImage = (ComponentId, category) => {
    if (!ComponentId || !category) {
      console.log('Missing ComponentId or category:', { ComponentId, category });
      return null;
    }
  
    const categoryImages = imagesByCategory[category];
    if (!categoryImages) {
      console.log(`No images found for category: ${category}`);
      return null;
    }
  
    const image = categoryImages[ComponentId.toString()];
    if (!image) {
      console.log(`No image found for componentId: ${ComponentId} in category: ${category}`);
      return null;
    }
  
    return image;
  };

  /**
   * Fetches menu data from the API and updates the state.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
        const response = await axios.get(`${baseURL}/api/components`);
        
        if (!response.data) {
          throw new Error('No data received from API');
        }

        // Transform the data for easier usage
        const transformedData = response.data.map((item) => ({
          ComponentID: item.componentid,
          component_name: item.Component_Name || item.component_name || '',
          category: item.Category || item.category || '',
          availability: item.Availability === 1 || item.availability === true,
          premium: item.Premium === 1 || item.premium === true,
          seasonal: item.Seasonal === 1 || item.seasonal === true,
          calories: item.calories || null
        }));

        console.log('Transformed Data:', transformedData);
        setComponents(transformedData);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load menu data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Component to render individual menu items.
   * @param {object} props - Properties of the menu item.
   */
  const MenuItem = ({ name, calories, available, premium, seasonal, ComponentId, category }) => (
    <div className={`menu-item-card ${!available ? 'unavailable' : ''}`}>
      <div className="menu-item-image-container">
        {getItemImage(ComponentId, category) ? (
          <img 
            src={getItemImage(ComponentId, category)} 
            alt={name} 
            className="menu-item-image"
            onError={(e) => {
              console.error(`Failed to load image for ${name} (${ComponentId})`);
              e.target.src = '/api/placeholder/200/150';
            }}
          />
        ) : (
          <img 
            src="/api/placeholder/200/150" 
            alt={name} 
            className="menu-item-image"
          />
        )}
      </div>
      <div className="menu-item-details">
        <div className={`menu-item-name ${!available ? 'line-through' : ''}`}>
          {name}
        </div>
        <div className="menu-item-info">
          {calories && <span className="calories">{calories} cal.</span>}
          {seasonal && <span className="seasonal">Seasonal</span>}
          {!available && <span className="unavailable-text">Currently Unavailable</span>}
        </div>
      </div>
    </div>
  );

  // Render loading or error states if applicable
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  // Render the menu layout
  return (
    <div className="menu-container">
      {/* Step 1: Create your meal */}
      <header className="header">
        <h1 className="main-title">STEP 1: CREATE YOUR MEAL</h1>
      </header>

      {/* Meal Types */}
      <section className="meal-types">
        <div className="meal-type">
          <h2>CLASSIC BOWL - $8.30</h2>
          <p className="center">Classic Entree + 1 Side</p>
        </div>
        <div className="meal-type">
          <h2>CLASSIC PLATE - $9.80</h2>
          <p className="center">2 Classic Entrees + 1 Side</p>
        </div>
        <div className="meal-type">
          <h2>BIGGER PLATE - $11.30</h2>
          <p className="center">3 Classic Entrees + 1 Side</p>
        </div>
      </section>

      {/* Step 2: Choose your side */}
      <header className="header">
        <h1>STEP 2: CHOOSE YOUR SIDE</h1>
      </header>
      <section className="sides">
        <div className="side-category">
          {components
            .filter(item => item.category === 'Side')
            .map(item => (
              <MenuItem
                key={item.component_name}
                {...item}
              />
            ))}
        </div>
      </section>

      {/* Step 3: Select entrees */}
      {/* Additional steps and categories are rendered similarly */}
    </div>
  );
};

export default MenuBoard;
