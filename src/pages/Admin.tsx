import React, { useEffect, useState } from 'react';
import { Box, Typography, Tabs, Tab, Grid, Card, CardContent, CardMedia, TextField, Button, Snackbar } from '@mui/material';

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

const emptyHotel: Omit<Hotel, 'id'> = { name: '', location: '', price: 0, image: '', description: '' };
const emptyFlight: Omit<Flight, 'id'> = { airline: '', from: '', to: '', price: 0, image: '', description: '' };

const Admin: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [hotelForm, setHotelForm] = useState(emptyHotel);
  const [flightForm, setFlightForm] = useState(emptyFlight);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  // Fetch hotels/flights
  useEffect(() => {
    fetch('/api/hotels').then(res => res.json()).then(setHotels);
    fetch('/api/flights').then(res => res.json()).then(setFlights);
  }, []);

  // Add hotel
  const handleAddHotel = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/admin/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'hotel', data: hotelForm }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setHotels(hotels.concat(data.hotel));
          setHotelForm(emptyHotel);
          setSnackbar({ open: true, message: 'Hotel added!' });
        }
      });
  };
  // Add flight
  const handleAddFlight = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/admin/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'flight', data: flightForm }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFlights(flights.concat(data.flight));
          setFlightForm(emptyFlight);
          setSnackbar({ open: true, message: 'Flight added!' });
        }
      });
  };
  // Delete hotel
  const handleDeleteHotel = (id: string) => {
    fetch('/api/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'hotel', id }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setHotels(hotels.filter(h => h.id !== id));
          setSnackbar({ open: true, message: 'Hotel deleted.' });
        }
      });
  };
  // Delete flight
  const handleDeleteFlight = (id: string) => {
    fetch('/api/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'flight', id }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFlights(flights.filter(f => f.id !== id));
          setSnackbar({ open: true, message: 'Flight deleted.' });
        }
      });
  };

  return (
    <Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Hotels" />
        <Tab label="Flights" />
      </Tabs>
      {tab === 0 && (
        <Box>
          <form onSubmit={handleAddHotel} style={{ marginBottom: 24, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <TextField label="Name" value={hotelForm.name} onChange={e => setHotelForm(f => ({ ...f, name: e.target.value }))} required sx={{ flex: 1 }} />
            <TextField label="Location" value={hotelForm.location} onChange={e => setHotelForm(f => ({ ...f, location: e.target.value }))} required sx={{ flex: 1 }} />
            <TextField label="Price" type="number" value={hotelForm.price} onChange={e => setHotelForm(f => ({ ...f, price: Number(e.target.value) }))} required sx={{ flex: 1 }} />
            <TextField label="Image URL" value={hotelForm.image} onChange={e => setHotelForm(f => ({ ...f, image: e.target.value }))} sx={{ flex: 2 }} />
            <TextField label="Description" value={hotelForm.description} onChange={e => setHotelForm(f => ({ ...f, description: e.target.value }))} sx={{ flex: 2 }} />
            <Button type="submit" variant="contained" color="primary">Add Hotel</Button>
          </form>
          <Grid container spacing={3}>
            {hotels.map(hotel => (
              <Grid item xs={12} sm={6} md={4} key={hotel.id}>
                <Card>
                  {hotel.image && (
                    <CardMedia component="img" height="120" image={hotel.image} alt={hotel.name} />
                  )}
                  <CardContent>
                    <Typography variant="h6">{hotel.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{hotel.location}</Typography>
                    <Typography variant="body2" color="text.secondary">Price: ${hotel.price}</Typography>
                    <Typography variant="body2" color="text.secondary">{hotel.description}</Typography>
                    <Button onClick={() => handleDeleteHotel(hotel.id)} color="error" variant="contained" sx={{ mt: 1 }}>Delete</Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {tab === 1 && (
        <Box>
          <form onSubmit={handleAddFlight} style={{ marginBottom: 24, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <TextField label="Airline" value={flightForm.airline} onChange={e => setFlightForm(f => ({ ...f, airline: e.target.value }))} required sx={{ flex: 1 }} />
            <TextField label="From" value={flightForm.from} onChange={e => setFlightForm(f => ({ ...f, from: e.target.value }))} required sx={{ flex: 1 }} />
            <TextField label="To" value={flightForm.to} onChange={e => setFlightForm(f => ({ ...f, to: e.target.value }))} required sx={{ flex: 1 }} />
            <TextField label="Price" type="number" value={flightForm.price} onChange={e => setFlightForm(f => ({ ...f, price: Number(e.target.value) }))} required sx={{ flex: 1 }} />
            <TextField label="Image URL" value={flightForm.image} onChange={e => setFlightForm(f => ({ ...f, image: e.target.value }))} sx={{ flex: 2 }} />
            <TextField label="Description" value={flightForm.description} onChange={e => setFlightForm(f => ({ ...f, description: e.target.value }))} sx={{ flex: 2 }} />
            <Button type="submit" variant="contained" color="primary">Add Flight</Button>
          </form>
          <Grid container spacing={3}>
            {flights.map(flight => (
              <Grid item xs={12} sm={6} md={4} key={flight.id}>
                <Card>
                  {flight.image && (
                    <CardMedia component="img" height="120" image={flight.image} alt={flight.airline} />
                  )}
                  <CardContent>
                    <Typography variant="h6">{flight.airline}</Typography>
                    <Typography variant="body2" color="text.secondary">{flight.from} → {flight.to}</Typography>
                    <Typography variant="body2" color="text.secondary">Price: ${flight.price}</Typography>
                    <Typography variant="body2" color="text.secondary">{flight.description}</Typography>
                    <Button onClick={() => handleDeleteFlight(flight.id)} color="error" variant="contained" sx={{ mt: 1 }}>Delete</Button>
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

export default Admin; 