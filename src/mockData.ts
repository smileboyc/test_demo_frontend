import type { Hotel, Flight, Review, Booking } from './types';

// Initial Data
let hotels: Hotel[] = [
    { id: '1', name: 'Grand Hotel', location: 'New York', price: 200, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800', description: 'Luxury hotel in the heart of NY.' },
    { id: '2', name: 'Beach Resort', location: 'Miami', price: 150, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800', description: 'Relax by the beach.' },
    { id: '3', name: 'Mountain Lodge', location: 'Aspen', price: 300, image: 'https://images.unsplash.com/photo-1518733057094-95b53143d2a7?auto=format&fit=crop&w=800', description: 'Cozy lodge in the mountains.' }
];

let flights: Flight[] = [
    { id: '1', airline: 'Delta', from: 'New York', to: 'London', price: 500, image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800', description: 'Direct flight to London.' },
    { id: '2', airline: 'United', from: 'San Francisco', to: 'Tokyo', price: 800, image: 'https://images.unsplash.com/photo-1542296332-2e44a0582761?auto=format&fit=crop&w=800', description: 'Experience Japan.' },
    { id: '3', airline: 'American', from: 'Los Angeles', to: 'Paris', price: 600, image: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=800', description: 'Romantic getaway.' }
];

let reviews: Review[] = [
    { id: '1', type: 'hotel', itemId: '1', user: 'alice@example.com', rating: 5, comment: 'Great stay!', date: new Date().toISOString() },
    { id: '2', type: 'flight', itemId: '1', user: 'bob@example.com', rating: 4, comment: 'Good service.', date: new Date().toISOString() }
];

let bookings: Booking[] = [];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Service Functions
export const mockApi = {
    getHotels: async (location?: string): Promise<Hotel[]> => {
        await delay(300);
        if (location) {
            return hotels.filter(h => h.location.toLowerCase().includes(location.toLowerCase()));
        }
        return hotels;
    },

    getFlights: async (from?: string, to?: string): Promise<Flight[]> => {
        await delay(300);
        let result = flights;
        if (from) result = result.filter(f => f.from.toLowerCase().includes(from.toLowerCase()));
        if (to) result = result.filter(f => f.to.toLowerCase().includes(to.toLowerCase()));
        return result;
    },

    getBookings: async (user: string): Promise<Booking[]> => {
        await delay(300);
        return bookings.filter(b => b.user === user);
    },

    addBooking: async (type: 'hotel' | 'flight', itemId: string, user: string): Promise<{ success: boolean }> => {
        await delay(500);
        const item = type === 'hotel' ? hotels.find(h => h.id === itemId) : flights.find(f => f.id === itemId);
        if (!item) return { success: false };

        const newBooking: Booking = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            item,
            user,
            date: new Date().toISOString(),
            status: 'confirmed'
        };
        bookings.push(newBooking);
        return { success: true };
    },

    getReviews: async (type: 'hotel' | 'flight', itemId: string): Promise<Review[]> => {
        await delay(300);
        return reviews.filter(r => r.type === type && r.itemId === itemId);
    },

    addReview: async (review: Omit<Review, 'id' | 'date'>): Promise<{ success: boolean }> => {
        await delay(300);
        const newReview: Review = {
            ...review,
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString()
        };
        reviews.push(newReview);
        return { success: true };
    },

    // Admin functions
    addHotel: async (hotel: Omit<Hotel, 'id'>): Promise<{ success: boolean, hotel: Hotel }> => {
        await delay(300);
        const newHotel = { ...hotel, id: Math.random().toString(36).substr(2, 9) };
        hotels.push(newHotel);
        return { success: true, hotel: newHotel };
    },

    addFlight: async (flight: Omit<Flight, 'id'>): Promise<{ success: boolean, flight: Flight }> => {
        await delay(300);
        const newFlight = { ...flight, id: Math.random().toString(36).substr(2, 9) };
        flights.push(newFlight);
        return { success: true, flight: newFlight };
    },

    deleteItem: async (type: 'hotel' | 'flight', id: string): Promise<{ success: boolean }> => {
        await delay(300);
        if (type === 'hotel') {
            hotels = hotels.filter(h => h.id !== id);
        } else {
            flights = flights.filter(f => f.id !== id);
        }
        return { success: true };
    }
};
