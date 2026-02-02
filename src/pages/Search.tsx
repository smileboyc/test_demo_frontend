import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, TextField, Button, Box, Snackbar, Tabs, Tab } from '@mui/material';
import { useAuth } from '../App';
import { mockApi } from '../mockData';
import type { Hotel, Flight } from '../types';

const Search: React.FC = () => {
  const [tab, setTab] = useState(0);
  // Hotels
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [hotelLocation, setHotelLocation] = useState('');
  // Flights
  const [flights, setFlights] = useState<Flight[]>([]);
  const [flightFrom, setFlightFrom] = useState('');
  const [flightTo, setFlightTo] = useState('');
  // Booking
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const { isAuthenticated } = useAuth();

  // Fetch hotels
  useEffect(() => {
    mockApi.getHotels(hotelLocation).then(setHotels);
  }, [hotelLocation]);

  // Fetch flights
  useEffect(() => {
    mockApi.getFlights(flightFrom, flightTo).then(setFlights);
  }, [flightFrom, flightTo]);

  const handleBook = (type: 'hotel' | 'flight', itemId: string) => {
    if (!isAuthenticated) {
      setSnackbar({ open: true, message: 'Please login to book.' });
      return;
    }
    mockApi.addBooking(type, itemId, 'example@gmail.com')
      .then(data => {
        if (data.success) setSnackbar({ open: true, message: 'Booking successful!' });
        else setSnackbar({ open: true, message: 'Booking failed.' });
      })
      .catch(() => setSnackbar({ open: true, message: 'Booking failed.' }));
  };

  return (
    <Box>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Where to next?</Typography>
        <Typography variant="body1" color="text.secondary">Explore the best deals on hotels and flights</Typography>
      </Box>

      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        mb: 6
      }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            bgcolor: 'background.paper',
            p: 0.5,
            borderRadius: 4,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            '& .MuiTabs-indicator': {
              height: '100%',
              borderRadius: 3,
              zIndex: 0,
              opacity: 0.2
            },
            '& .MuiTab-root': {
              zIndex: 1,
              minWidth: 120,
              transition: 'color 0.2s',
              fontWeight: 600,
              '&.Mui-selected': {
                color: 'primary.main'
              }
            }
          }}
        >
          <Tab label="Hotels" />
          <Tab label="Flights" />
        </Tabs>
      </Box>

      {tab === 0 && (
        <Box>
          <Box sx={{
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: 4,
            mb: 4,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
            display: 'flex',
            gap: 2,
            alignItems: 'center'
          }}>
            <TextField
              label="Search by location..."
              value={hotelLocation}
              onChange={e => setHotelLocation(e.target.value)}
              fullWidth
              variant="outlined"
              size="medium"
            />
          </Box>
          <Grid container spacing={4}>
            {hotels.map(hotel => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={hotel.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {hotel.image && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={hotel.image}
                      alt={hotel.name}
                      sx={{ filter: 'brightness(0.9)' }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" gutterBottom>{hotel.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">📍 {hotel.location}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{
                      mb: 3,
                      color: 'text.secondary',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {hotel.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Typography variant="h6" color="primary">${hotel.price}<Box component="span" sx={{ fontSize: '0.8rem', color: 'text.secondary', fontWeight: 400 }}> /night</Box></Typography>
                      <Button
                        variant="contained"
                        onClick={() => handleBook('hotel', hotel.id)}
                      >
                        Book Now
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {tab === 1 && (
        <Box>
          <Box sx={{
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: 4,
            mb: 4,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
            display: 'flex',
            gap: 2
          }}>
            <TextField
              label="From"
              value={flightFrom}
              onChange={e => setFlightFrom(e.target.value)}
              fullWidth
            />
            <TextField
              label="To"
              value={flightTo}
              onChange={e => setFlightTo(e.target.value)}
              fullWidth
            />
          </Box>
          <Grid container spacing={4}>
            {flights.map(flight => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={flight.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {flight.image && (
                    <CardMedia component="img" height="180" image={flight.image} alt={flight.airline} />
                  )}
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" gutterBottom>{flight.airline}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>{flight.from} ➔ {flight.to}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{flight.description}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Typography variant="h6" color="primary">${flight.price}</Typography>
                      <Button
                        variant="contained"
                        onClick={() => handleBook('flight', flight.id)}
                      >
                        Book Flight
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default Search; 