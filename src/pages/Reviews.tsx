import React, { useEffect, useState } from 'react';
import { Box, Typography, Tabs, Tab, Grid, Card, CardContent, TextField, Button, Snackbar, MenuItem, Rating } from '@mui/material';

interface Hotel {
  id: string;
  name: string;
}
interface Flight {
  id: string;
  airline: string;
}
interface Review {
  id: string;
  type: 'hotel' | 'flight';
  itemId: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

const Reviews: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [selectedFlight, setSelectedFlight] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  // Fetch hotels/flights
  useEffect(() => {
    fetch('/api/hotels').then(res => res.json()).then(setHotels);
    fetch('/api/flights').then(res => res.json()).then(setFlights);
  }, []);

  // Fetch reviews
  useEffect(() => {
    if (tab === 0 && selectedHotel) {
      fetch(`/api/reviews?type=hotel&itemId=${selectedHotel}`)
        .then(res => res.json())
        .then(setReviews);
    } else if (tab === 1 && selectedFlight) {
      fetch(`/api/reviews?type=flight&itemId=${selectedFlight}`)
        .then(res => res.json())
        .then(setReviews);
    } else {
      setReviews([]);
    }
  }, [tab, selectedHotel, selectedFlight]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment) {
      setSnackbar({ open: true, message: 'Please provide rating and comment.' });
      return;
    }
    const type = tab === 0 ? 'hotel' : 'flight';
    const itemId = tab === 0 ? selectedHotel : selectedFlight;
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, itemId, user: 'example@gmail.com', rating, comment }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSnackbar({ open: true, message: 'Review submitted!' });
          setComment('');
          setRating(null);
          // Refresh reviews
          fetch(`/api/reviews?type=${type}&itemId=${itemId}`)
            .then(res => res.json())
            .then(setReviews);
        } else {
          setSnackbar({ open: true, message: 'Failed to submit review.' });
        }
      })
      .catch(() => setSnackbar({ open: true, message: 'Failed to submit review.' }));
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
            select
            label="Select Hotel"
            value={selectedHotel}
            onChange={e => setSelectedHotel(e.target.value)}
            sx={{ mb: 2, minWidth: 220 }}
          >
            {hotels.map(hotel => (
              <MenuItem key={hotel.id} value={hotel.id}>{hotel.name}</MenuItem>
            ))}
          </TextField>
          {selectedHotel && (
            <Box>
              <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
                <Rating
                  value={rating}
                  onChange={(_, v) => setRating(v)}
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Comment"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  fullWidth
                  multiline
                  minRows={2}
                  sx={{ mb: 1 }}
                />
                <Button type="submit" variant="contained">Submit Review</Button>
              </form>
              <Typography variant="h6">Reviews</Typography>
              <Grid container spacing={2}>
                {reviews.map(r => (
                  <Grid item xs={12} key={r.id}>
                    <Card>
                      <CardContent>
                        <Rating value={r.rating} readOnly />
                        <Typography variant="body2">{r.comment}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {r.user} — {new Date(r.date).toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      )}
      {tab === 1 && (
        <Box>
          <TextField
            select
            label="Select Flight"
            value={selectedFlight}
            onChange={e => setSelectedFlight(e.target.value)}
            sx={{ mb: 2, minWidth: 220 }}
          >
            {flights.map(flight => (
              <MenuItem key={flight.id} value={flight.id}>{flight.airline} ({flight.from} → {flight.to})</MenuItem>
            ))}
          </TextField>
          {selectedFlight && (
            <Box>
              <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
                <Rating
                  value={rating}
                  onChange={(_, v) => setRating(v)}
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Comment"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  fullWidth
                  multiline
                  minRows={2}
                  sx={{ mb: 1 }}
                />
                <Button type="submit" variant="contained">Submit Review</Button>
              </form>
              <Typography variant="h6">Reviews</Typography>
              <Grid container spacing={2}>
                {reviews.map(r => (
                  <Grid item xs={12} key={r.id}>
                    <Card>
                      <CardContent>
                        <Rating value={r.rating} readOnly />
                        <Typography variant="body2">{r.comment}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {r.user} — {new Date(r.date).toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
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

export default Reviews; 