import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, TextField, Button, Box, Snackbar, Tabs, Tab } from '@mui/material';
import { useAuth } from '../App';

interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  image: string;
  description: string;
}
interface Flight {
  id: string;
  airline: string;
  from: string;
  to: string;
  price: number;
  image: string;
  description: string;
}

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
    fetch(`/api/hotels${hotelLocation ? `?location=${encodeURIComponent(hotelLocation)}` : ''}`)
      .then(res => res.json())
      .then(setHotels);
  }, [hotelLocation]);

  // Fetch flights
  useEffect(() => {
    let url = '/api/flights';
    const params = [];
    if (flightFrom) params.push(`from=${encodeURIComponent(flightFrom)}`);
    if (flightTo) params.push(`to=${encodeURIComponent(flightTo)}`);
    if (params.length) url += '?' + params.join('&');
    fetch(url)
      .then(res => res.json())
      .then(setFlights);
  }, [flightFrom, flightTo]);

  const handleBook = (type: 'hotel' | 'flight', itemId: string) => {
    if (!isAuthenticated) {
      setSnackbar({ open: true, message: 'Please login to book.' });
      return;
    }
    fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, itemId, user: 'example@gmail.com' }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setSnackbar({ open: true, message: 'Booking successful!' });
        else setSnackbar({ open: true, message: 'Booking failed.' });
      })
      .catch(() => setSnackbar({ open: true, message: 'Booking failed.' }));
  };

  return (
    <Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Hotels" />
        <Tab label="Flights" />
      </Tabs>
      {tab === 0 && (
        <Box>
          <TextField
            label="Location"
            value={hotelLocation}
            onChange={e => setHotelLocation(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Grid container spacing={3}>
            {hotels.map(hotel => (
              <Grid item xs={12} sm={6} md={4} key={hotel.id}>
                <Card>
                  {hotel.image && (
                    <CardMedia component="img" height="140" image={hotel.image} alt={hotel.name} />
                  )}
                  <CardContent>
                    <Typography variant="h6">{hotel.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{hotel.location}</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>Price: ${hotel.price}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>{hotel.description}</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={() => handleBook('hotel', hotel.id)}
                    >
                      Book
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {tab === 1 && (
        <Box>
          <TextField
            label="From"
            value={flightFrom}
            onChange={e => setFlightFrom(e.target.value)}
            sx={{ mb: 2, mr: 2 }}
          />
          <TextField
            label="To"
            value={flightTo}
            onChange={e => setFlightTo(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Grid container spacing={3}>
            {flights.map(flight => (
              <Grid item xs={12} sm={6} md={4} key={flight.id}>
                <Card>
                  {flight.image && (
                    <CardMedia component="img" height="140" image={flight.image} alt={flight.airline} />
                  )}
                  <CardContent>
                    <Typography variant="h6">{flight.airline}</Typography>
                    <Typography variant="body2" color="text.secondary">{flight.from} → {flight.to}</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>Price: ${flight.price}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>{flight.description}</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={() => handleBook('flight', flight.id)}
                    >
                      Book
                    </Button>
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