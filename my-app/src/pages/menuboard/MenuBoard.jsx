import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./menu.css";

const MenuBoard = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const MenuItem = ({ name, calories, available, premium, seasonal }) => (
    <div className={`menu-item ${!available ? 'unavailable' : ''}`}>
      <span style={{ textDecoration: available ? 'none' : 'line-through' }}>
        {name} {calories ? `${calories} cal.` : ''}
        {seasonal && <span className="text-blue-500 text-sm ml-2">(Seasonal)</span>}
      </span>
      {!available && <span className="text-red-500 text-sm ml-2">(Currently Unavailable)</span>}
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
        <p className="subtitle">UPGRADE ANY ENTREE TO PREMIUM FOR 1.25 EA</p>
      </header>

      {/* Meal Types */}
      <section className="meal-types">
        <div className="meal-type">
          <h2>CLASSIC BOWL</h2>
          <p>Classic Entree + 1 Side</p>
        </div>
        <div className="meal-type">
          <h2>CLASSIC PLATE</h2>
          <p>2 Classic Entrees + 1 Side</p>
        </div>
        <div className="meal-type">
          <h2>BIG PANDA PLATE</h2>
          <p>3 Classic Entrees + 1 Side</p>
        </div>
      </section>

      {/* Step 2 */}
      <header className="header">
        <h1>STEP 2: CHOOSE YOUR SIDE</h1>
      </header>

      {/* Sides */}
      <section className="sides">
        <div className="side-category">
          <h3>NOODLES & RICE (510-520 CAL.)</h3>
          {components
            .filter(item => item.category === 'Noodles & Rice')
            .map(item => (
              <MenuItem
                key={item.component_name}
                name={item.component_name}
                available={item.availability}
                seasonal={item.seasonal}
              />
            ))}
        </div>
        <div className="side-category">
          <h3>VEGETABLES (90 CAL.)</h3>
          {components
            .filter(item => item.category === 'Vegetables')
            .map(item => (
              <MenuItem
                key={item.component_name}
                name={item.component_name}
                available={item.availability}
                seasonal={item.seasonal}
              />
            ))}
        </div>
      </section>

      {/* Step 3 */}
      <header className="header">
        <h1>STEP 3: SELECT YOUR ENTREE(S)</h1>
        <p>UPGRADE ANY ENTREE TO PREMIUM</p>
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
              />
            ))}
        </div>
        <div>
          <h3>PREMIUM ENTREES</h3>
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
          <h3>Sides</h3>
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
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>We Cater!</p>
        <p>panthercatering.com</p>
      </footer>
    </div>
  );
};

export default MenuBoard;