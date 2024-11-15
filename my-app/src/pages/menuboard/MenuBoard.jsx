import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import "./menu.css";

const MenuBoard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
        const response = await axios.get(`${baseURL}/api/menu_items`);
        if (response.data && response.data.length > 0) {
          setMenuItems(response.data.map(item => ({
            id: item.itemid,
            name: item.item_name,
            price: Number(item.price) || 0,
            category: item.category || "Classic Entrees",
            description: item.description || "",
            calories: item.calories || "",
            available: item.available ?? true
          })));
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
          <div>Chow Mein</div>
          <div>Fried Rice</div>
          <div>White Rice</div>
        </div>
        <div className="side-category">
          <h3>VEGETABLES (90 CAL.)</h3>
          <div>Super Greens</div>
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
          <div>Original Orange Chicken 490 cal.</div>
          <div>Kung Pao Chicken 290 cal.</div>
          <div>Grilled Chicken Teriyaki 300 cal.</div>
          <div>Beijing Beef 470 cal.</div>
          <div>Honey Sesame Chicken 490 cal.</div>
        </div>
        <div>
          <h3>PREMIUM ENTREES</h3>
          <div>Honey Walnut Shrimp 360 cal.</div>
          <div>Black Pepper Angus Steak 180 cal.</div>
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
