import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./menu.css";

const MenuBoard = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Import all images by category
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

  const imagesByCategory = {
    'Main Course': importCategoryImages('entrees'),
    'Beverage': importCategoryImages('drinks'),
    'Side': importCategoryImages('sides'),
    'Appetizer': importCategoryImages('appetizers'),
    'Dessert': importCategoryImages('desserts')
  };

  const getItemImage = (componentId, category) => {
    if (!componentId || !category) {
      console.log('Missing componentId or category:', { componentId, category });
      return null;
    }
  
    const categoryImages = imagesByCategory[category];
    if (!categoryImages) {
      console.log(`No images found for category: ${category}`);
      return null;
    }
  
    const image = categoryImages[componentId.toString()];
    if (!image) {
      console.log(`No image found for componentId: ${componentId} in category: ${category}`);
      return null;
    }
  
    return image;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
        const response = await axios.get(`${baseURL}/api/components`);
        
        if (!response.data) {
          throw new Error('No data received from API');
        }

        // Transform the data
        const transformedData = response.data.map((item, index) => {
          // Get the ComponentID from the actual data or use the array index + 1
          const componentId = item.ComponentID || (index+1).toString();
          
          return {
            ComponentID: componentId,
            component_name: item.Component_Name || item.component_name || '',
            category: item.Category || item.category || '',
            availability: item.Availability === 1 || item.availability === true,
            premium: item.Premium === 1 || item.premium === true,
            seasonal: item.Seasonal === 1 || item.seasonal === true,
            calories: item.calories || null
          };
        });

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

  const MenuItem = ({ name, calories, available, premium, seasonal, componentId, category }) => (
    <div className={`menu-item-card ${!available ? 'unavailable' : ''}`}>
      <div className="menu-item-image-container">
        {getItemImage(componentId, category) ? (
          <img 
            src={getItemImage(componentId, category)} 
            alt={name} 
            className="menu-item-image"
            onError={(e) => {
              console.error(`Failed to load image for ${name} (${componentId})`);
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

      {/* Step 2 */}
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
                name={item.component_name}
                calories={item.calories}
                available={item.availability}
                seasonal={item.seasonal}
                componentId={item.ComponentID}
                category={item.category}
              />
            ))}
        </div>
      </section>

      {/* Step 3 */}
      <header className="header">
        <h1>STEP 3: SELECT YOUR ENTREE(S)</h1>
      </header>

      {/* Entrees */}
      <section className="entrees-grid">
        <div className="entree-category">
          <h3 className="category-title">CLASSIC ENTREES</h3>
          <div className="entree-items">
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
                  componentId={item.ComponentID}
                  category={item.category}
                />
              ))}
          </div>
        </div>

        <div className="entree-category">
          <h3 className="category-title">PREMIUM ENTREES (+$1.50)</h3>
          <div className="entree-items">
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
                  componentId={item.ComponentID}
                  category={item.category}
                />
              ))}
          </div>
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
            .filter(item => item.category === 'Appetizer')
            .map(item => (
              <MenuItem
                key={item.component_name}
                name={item.component_name}
                calories={item.calories}
                available={item.availability}
                seasonal={item.seasonal}
                componentId={item.ComponentID}
                category={item.category}
              />
            ))}
        </div>
        <div>
          <h3>Beverages</h3>
          {components
            .filter(item => item.category === 'Beverage')
            .map(item => (
              <MenuItem
                key={item.component_name}
                name={item.component_name}
                calories={item.calories}
                available={item.availability}
                seasonal={item.seasonal}
                componentId={item.ComponentID}
                category={item.category}
              />
            ))}
        </div>
        <div>
          <h3>Desserts</h3>
          {components
            .filter(item => item.category === 'Dessert')
            .map(item => (
              <MenuItem
                key={item.component_name}
                name={item.component_name}
                calories={item.calories}
                available={item.availability}
                seasonal={item.seasonal}
                componentId={item.ComponentID}
                category={item.category}
              />
            ))}
        </div>
      </section>
    </div>
  );
};

export default MenuBoard;