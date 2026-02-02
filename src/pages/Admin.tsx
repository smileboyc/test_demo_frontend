import React, { useEffect, useState } from 'react';
import { Box, Typography, Tabs, Tab, Grid, Card, CardContent, CardMedia, TextField, Button, Snackbar } from '@mui/material';
import { mockApi } from '../mockData';
import type { Hotel, Flight } from '../types';

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
    mockApi.getHotels().then(setHotels);
    mockApi.getFlights().then(setFlights);
  }, []);

  // Add hotel
  const handleAddHotel = (e: React.FormEvent) => {
    e.preventDefault();
    mockApi.addHotel(hotelForm)
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
    mockApi.addFlight(flightForm)
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
    mockApi.deleteItem('hotel', id)
      .then(data => {
        if (data.success) {
          setHotels(hotels.filter(h => h.id !== id));
          setSnackbar({ open: true, message: 'Hotel deleted.' });
        }
      });
  };
  // Delete flight
  const handleDeleteFlight = (id: string) => {
    mockApi.deleteItem('flight', id)
      .then(data => {
        if (data.success) {
          setFlights(flights.filter(f => f.id !== id));
          setSnackbar({ open: true, message: 'Flight deleted.' });
        }
      });
  };

  return (
    <Box>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Content Management</Typography>
        <Typography variant="body1" color="text.secondary">Add or remove hotels and flights from the catalog</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
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
              fontWeight: 600
            }
          }}
        >
          <Tab label="Hotels" />
          <Tab label="Flights" />
        </Tabs>
      </Box>

      {tab === 0 && (
        <Box>
          <Card sx={{ p: 4, mb: 6, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Add New Hotel</Typography>
            <form onSubmit={handleAddHotel}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField label="Hotel Name" value={hotelForm.name} onChange={e => setHotelForm(f => ({ ...f, name: e.target.value }))} required fullWidth />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField label="Location" value={hotelForm.location} onChange={e => setHotelForm(f => ({ ...f, location: e.target.value }))} required fullWidth />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField label="Price per Night" type="number" value={hotelForm.price} onChange={e => setHotelForm(f => ({ ...f, price: Number(e.target.value) }))} required fullWidth />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField label="Image URL" value={hotelForm.image} onChange={e => setHotelForm(f => ({ ...f, image: e.target.value }))} fullWidth />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField label="Description" value={hotelForm.description} onChange={e => setHotelForm(f => ({ ...f, description: e.target.value }))} multiline minRows={2} fullWidth />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button type="submit" variant="contained" size="large">Add Hotel Entry</Button>
                </Grid>
              </Grid>
            </form>
          </Card>

          <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>Existing Hotels</Typography>
          <Grid container spacing={4}>
            {hotels.map(hotel => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={hotel.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                  {hotel.image && (
                    <CardMedia component="img" height="140" image={hotel.image} alt={hotel.name} />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom noWrap>{hotel.name}</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>{hotel.location}</Typography>
                    <Typography variant="body1" color="primary" sx={{ fontWeight: 700, mb: 2 }}>${hotel.price}/night</Typography>
                    <Button
                      fullWidth
                      onClick={() => handleDeleteHotel(hotel.id)}
                      color="error"
                      variant="outlined"
                    >
                      Remove
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
          <Card sx={{ p: 4, mb: 6, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Add New Flight</Typography>
            <form onSubmit={handleAddFlight}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField label="Airline" value={flightForm.airline} onChange={e => setFlightForm(f => ({ ...f, airline: e.target.value }))} required fullWidth />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField label="From" value={flightForm.from} onChange={e => setFlightForm(f => ({ ...f, from: e.target.value }))} required fullWidth />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField label="To" value={flightForm.to} onChange={e => setFlightForm(f => ({ ...f, to: e.target.value }))} required fullWidth />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField label="Price" type="number" value={flightForm.price} onChange={e => setFlightForm(f => ({ ...f, price: Number(e.target.value) }))} required fullWidth />
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField label="Image URL" value={flightForm.image} onChange={e => setFlightForm(f => ({ ...f, image: e.target.value }))} fullWidth />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField label="Description" value={flightForm.description} onChange={e => setFlightForm(f => ({ ...f, description: e.target.value }))} multiline minRows={2} fullWidth />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button type="submit" variant="contained" size="large">Add Flight Entry</Button>
                </Grid>
              </Grid>
            </form>
          </Card>

          <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>Existing Flights</Typography>
          <Grid container spacing={4}>
            {flights.map(flight => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={flight.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                  {flight.image && (
                    <CardMedia component="img" height="140" image={flight.image} alt={flight.airline} />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom noWrap>{flight.airline}</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>{flight.from} → {flight.to}</Typography>
                    <Typography variant="body1" color="primary" sx={{ fontWeight: 700, mb: 2 }}>${flight.price}</Typography>
                    <Button
                      fullWidth
                      onClick={() => handleDeleteFlight(flight.id)}
                      color="error"
                      variant="outlined"
                    >
                      Remove
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

export default Admin; 