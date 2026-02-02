import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { mockApi } from '../mockData';
import type { Booking, Hotel, Flight } from '../types';

const BookingHistory: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.getBookings('example@gmail.com')
      .then(data => {
        setBookings(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <Typography>Loading booking history...</Typography>;

  return (
    <Box>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 1 }}>My Bookings</Typography>
        <Typography variant="body1" color="text.secondary">Manage and view your upcoming and past trips</Typography>
      </Box>

      {bookings.length === 0 ? (
        <Box sx={{
          textAlign: 'center',
          py: 12,
          bgcolor: 'background.paper',
          borderRadius: 4,
          border: '1px dashed',
          borderColor: 'divider',
          maxWidth: 600,
          mx: 'auto'
        }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>No trips found</Typography>
          <Typography variant="body2" color="text.secondary">Start exploring the world today!</Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {bookings.map(booking => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={booking.id}>
              <Card sx={{ height: '100%', position: 'relative' }}>
                <Box sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  zIndex: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  color: 'primary.main',
                  textTransform: 'uppercase',
                  backdropFilter: 'blur(4px)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {booking.type}
                </Box>
                {booking.item.image && (
                  <CardMedia
                    component="img"
                    height="160"
                    image={booking.item.image}
                    alt={booking.type === 'hotel' ? (booking.item as Hotel).name : (booking.item as Flight).airline}
                  />
                )}
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    {booking.type === 'hotel' ? (booking.item as Hotel).name : (booking.item as Flight).airline}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {booking.type === 'hotel'
                      ? `📍 ${(booking.item as Hotel).location}`
                      : `✈️ ${(booking.item as Flight).from} → ${(booking.item as Flight).to}`}
                  </Typography>

                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">Booked on</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {new Date(booking.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary" display="block">Total Paid</Typography>
                      <Typography variant="body1" color="primary" sx={{ fontWeight: 800 }}>
                        ${booking.item.price}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default BookingHistory; 