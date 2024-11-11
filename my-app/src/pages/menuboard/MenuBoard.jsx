import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./menu.css";
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
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const MenuBoard = () => {
  // Initialize with sample data for testing
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: "Orange Chicken",
      price: 11.99,
      category: "Entrees",
      description: "Our signature dish - crispy chicken wok-tossed in a sweet and spicy orange sauce",
      available: true,
      popular: true,
    },
    {
      id: 2,
      name: "Beijing Beef",
      price: 11.99,
      category: "Entrees",
      description: "Crispy beef with bell peppers and onions in a sweet-tangy sauce",
      available: true,
      popular: false,
    },
    {
      id: 3,
      name: "Chow Mein",
      price: 4.99,
      category: "Sides",
      description: "Stir-fried wheat noodles with onions and celery",
      available: true,
      popular: true,
    }
  ]);
  
  const [data, setData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch components data
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
        console.log('Fetching components from:', `${baseURL}/api/components`);
        const response = await axios.get(`${baseURL}/api/components`);
        console.log('Components data received:', response.data);
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch components:', error);
        setError('Failed to load components');
      }
    };

    fetchComponents();
  }, []);

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
        console.log('Fetching menu items from:', `${baseURL}/api/menu-items`);
        const response = await axios.get(`${baseURL}/api/menu-items`);
        console.log('Menu items received:', response.data);
        if (response.data && response.data.length > 0) {
          setMenuItems(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch menu items:', error);
        setError('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Get unique categories from menuItems
  const categories = [...new Set(menuItems.map(item => item.category))];
  console.log('Categories:', categories);
  console.log('Current menuItems:', menuItems);

  const itemsDictionary = data.reduce((dict, item) => {
    dict[item.componentid] = item;
    return dict;
  }, {});

  const toggleAvailability = (itemId) => {
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

  if (!menuItems.length) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No menu items available.
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
      {showAlert && (
        <Alert 
          severity="info" 
          sx={{ mb: 2 }}
          icon={<InfoIcon />}
        >
          {alertMessage}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {categories.map(category => (
          <Box key={category}>
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                mb: 3, 
                pb: 1, 
                borderBottom: '2px solid #eee'
              }}
            >
              {category}
            </Typography>
            
            <Grid container spacing={3}>
              {menuItems
                .filter(item => item.category === category)
                .map(item => (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        opacity: item.available ? 1 : 0.75
                      }}
                    >
                      {item.imageUrl && (
                        <Box 
                          sx={{
                            pt: '56.25%', // 16:9 aspect ratio
                            position: 'relative',
                            '& img': {
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }
                          }}
                        >
                          <img src={item.imageUrl} alt={item.name} />
                        </Box>
                      )}
                      
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          mb: 1
                        }}>
                          <Box>
                            <Typography variant="h6" component="h3">
                              {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ${item.price.toFixed(2)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {item.popular && (
                              <Chip
                                icon={<CheckCircleIcon />}
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
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MenuBoard;