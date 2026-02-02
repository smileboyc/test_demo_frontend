import React, { useEffect, useState } from 'react';
import { Box, Typography, Tabs, Tab, Grid, Card, CardContent, TextField, Button, Snackbar, MenuItem, Rating } from '@mui/material';
import { mockApi } from '../mockData';
import type { Hotel, Flight, Review } from '../types';

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
    mockApi.getHotels().then(setHotels);
    mockApi.getFlights().then(setFlights);
  }, []);

  // Fetch reviews
  useEffect(() => {
    if (tab === 0 && selectedHotel) {
      mockApi.getReviews('hotel', selectedHotel).then(setReviews);
    } else if (tab === 1 && selectedFlight) {
      mockApi.getReviews('flight', selectedFlight).then(setReviews);
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

    mockApi.addReview({
      type,
      itemId,
      user: 'example@gmail.com',
      rating,
      comment
    })
      .then(data => {
        if (data.success) {
          setSnackbar({ open: true, message: 'Review submitted!' });
          setComment('');
          setRating(null);
          // Refresh reviews
          mockApi.getReviews(type, itemId).then(setReviews);
        } else {
          setSnackbar({ open: true, message: 'Failed to submit review.' });
        }
      })
      .catch(() => setSnackbar({ open: true, message: 'Failed to submit review.' }));
  };

  return (
    <Box>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Community Reviews</Typography>
        <Typography variant="body1" color="text.secondary">See what others are saying about their travels</Typography>
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

      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Box sx={{
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 4,
          mb: 6,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Write a Review</Typography>
          <TextField
            select
            label={tab === 0 ? "Select Hotel" : "Select Flight"}
            value={tab === 0 ? selectedHotel : selectedFlight}
            onChange={e => tab === 0 ? setSelectedHotel(e.target.value) : setSelectedFlight(e.target.value)}
            fullWidth
            sx={{ mb: 3 }}
          >
            {(tab === 0 ? hotels : flights).map(item => (
              <MenuItem key={item.id} value={item.id}>
                {tab === 0 ? (item as Hotel).name : `${(item as Flight).airline} (${(item as Flight).from} → ${(item as Flight).to})`}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>Rating</Typography>
            <Rating
              size="large"
              value={rating}
              onChange={(_, v) => setRating(v)}
            />
          </Box>

          <TextField
            label="Your experience..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            sx={{ mb: 3 }}
          />
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={!(tab === 0 ? selectedHotel : selectedFlight)}
            sx={{ minWidth: 160 }}
          >
            Post Review
          </Button>
        </Box>

        <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>Recent Reviews</Typography>
        {reviews.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'background.paper', borderRadius: 4, border: '1px dashed', borderColor: 'divider' }}>
            <Typography color="text.secondary">No reviews yet for this selection.</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {reviews.map(r => (
              <Grid size={{ xs: 12 }} key={r.id}>
                <Card sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Rating value={r.rating} readOnly size="small" sx={{ mb: 0.5 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{r.user}</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6 }}>
                      {r.comment}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

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