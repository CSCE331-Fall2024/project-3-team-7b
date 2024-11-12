import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Alert,
  Box,
  Chip,
  CircularProgress
} from '@mui/material';
import "./menu.css";

// Image import function for menu items
const importAll = (r) => {
  return r.keys().reduce((acc, fileName) => {
    acc[fileName.replace('./', '').split('.')[0]] = r(fileName);
    return acc;
  }, {});
};

// Import all images from respective folders
const menuImages = importAll(require.context("../../images/small_menu", false, /\.(png)$/));
const sideImages = importAll(require.context("../../images/components/sides", false, /\.(png)$/));
const entreeImages = importAll(require.context("../../images/components/entrees", false, /\.(png)$/));
const drinkImages = importAll(require.context("../../images/components/drinks", false, /\.(png)$/));
const appetizerImages = importAll(require.context("../../images/components/appetizers", false, /\.(png)$/));

const MenuBoard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
        
        // Fetch menu items
        const menuResponse = await axios.get(`${baseURL}/api/menu_items`);
        if (menuResponse.data && menuResponse.data.length > 0) {
          setMenuItems(menuResponse.data.map(item => ({
            id: item.itemid,
            name: item.item_name,
            price: item.price,
            category: item.category || "Menu Items",
            description: item.description || "",
            available: true,
            popular: false
          })));
        }

        // Fetch components
        const componentsResponse = await axios.get(`${baseURL}/api/components`);
        if (componentsResponse.data && componentsResponse.data.length > 0) {
          setComponents(componentsResponse.data.map(component => ({
            id: component.componentid,
            name: component.component_name,
            category: component.category || "Uncategorized",
            description: component.description || "",
            available: true
          })));
        }

        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Failed to load menu data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = [...new Set(menuItems.map(item => item.category))];
  const componentCategories = [...new Set(components.map(comp => comp.category))];

  const toggleAvailability = (itemId, isComponent = false) => {
    if (isComponent) {
      setComponents(prevComponents =>
        prevComponents.map(comp =>
          comp.id === itemId
            ? { ...comp, available: !comp.available }
            : comp
        )
      );
      
      const component = components.find(comp => comp.id === itemId);
      if (component) {
        setAlertMessage(`${component.name} marked as ${!component.available ? 'available' : 'unavailable'}`);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } else {
      setMenuItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId
            ? { ...item, available: !item.available }
            : item
        )
      );
      
      const item = menuItems.find(item => item.id === itemId);
      if (item) {
        setAlertMessage(`${item.name} marked as ${!item.available ? 'available' : 'unavailable'}`);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  const getImageSource = (id, category) => {
    const imageMap = {
      'Sides': sideImages,
      'Entrees': entreeImages,
      'Drinks': drinkImages,
      'Appetizers': appetizerImages
    };
    
    return imageMap[category]?.[id.toString()] || menuImages[id.toString()] || '/placeholder.png';
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
      {showAlert && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {alertMessage}
        </Alert>
      )}
      
      {/* Menu Items Section */}
      <Typography variant="h3" component="h1" sx={{ mb: 4 }}>
        Menu Board
      </Typography>
      
      <Grid container spacing={4}>
        {categories.map(category => (
          <Grid item xs={12} key={category}>
            <Typography variant="h4" component="h2" sx={{ mb: 3, pb: 1, borderBottom: '2px solid #eee' }}>
              {category}
            </Typography>
            
            <Grid container spacing={3}>
              {menuItems
                .filter(item => item.category === category)
                .map(item => (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Card sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      opacity: item.available ? 1 : 0.75
                    }}>
                      <Box sx={{ 
                        pt: '56.25%',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={getImageSource(item.id, category)}
                          alt={item.name}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                      
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          mb: 1 
                        }}>
                          <Typography variant="h6" component="h3">
                            {item.name}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {item.popular && (
                              <Chip
                                label="Popular"
                                size="small"
                                color="warning"
                              />
                            )}
                            <Chip
                              label={item.available ? 'In Stock' : 'Out of Stock'}
                              size="small"
                              color={item.available ? 'success' : 'error'}
                            />
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {item.description}
                        </Typography>
                        
                        <Button
                          variant="outlined"
                          color={item.available ? 'error' : 'primary'}
                          fullWidth
                          onClick={() => toggleAvailability(item.id)}
                        >
                          Mark as {item.available ? 'Unavailable' : 'Available'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Grid>
        ))}
      </Grid>

      {/* Components Section */}
      <Typography variant="h3" component="h1" sx={{ mt: 6, mb: 4 }}>
        Components
      </Typography>
      
      <Grid container spacing={4}>
        {componentCategories.map(category => (
          <Grid item xs={12} key={category}>
            <Typography variant="h4" component="h2" sx={{ mb: 3, pb: 1, borderBottom: '2px solid #eee' }}>
              {category}
            </Typography>
            
            <Grid container spacing={3}>
              {components
                .filter(comp => comp.category === category)
                .map(comp => (
                  <Grid item xs={12} sm={6} md={4} key={comp.id}>
                    <Card sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      opacity: comp.available ? 1 : 0.75
                    }}>
                      <Box sx={{ 
                        pt: '56.25%',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={getImageSource(comp.id, category)}
                          alt={comp.name}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                      
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          mb: 1 
                        }}>
                          <Typography variant="h6" component="h3">
                            {comp.name}
                          </Typography>
                          <Chip
                            label={comp.available ? 'In Stock' : 'Out of Stock'}
                            size="small"
                            color={comp.available ? 'success' : 'error'}
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {comp.description}
                        </Typography>
                        
                        <Button
                          variant="outlined"
                          color={comp.available ? 'error' : 'primary'}
                          fullWidth
                          onClick={() => toggleAvailability(comp.id, true)}
                        >
                          Mark as {comp.available ? 'Unavailable' : 'Available'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MenuBoard;