export interface Hotel {
    id: string;
    name: string;
    location: string;
    price: number;
    image: string;
    description: string;
}

export interface Flight {
    id: string;
    airline: string;
    from: string;
    to: string;
    price: number;
    image: string;
    description: string;
}

export interface Review {
    id: string;
    type: 'hotel' | 'flight';
    itemId: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Booking {
    id: string;
    type: 'hotel' | 'flight';
    item: Hotel | Flight;
    user: string;
    date: string;
    status: string;
}
