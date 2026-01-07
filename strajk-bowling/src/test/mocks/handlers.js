import { http, HttpResponse } from 'msw';

// Mock API endpoint for booking
export const handlers = [
  http.post(
    'https://731xy9c2ak.execute-api.eu-north-1.amazonaws.com/booking',
    async ({ request }) => {
      const body = await request.json();
      
      // Generate a mock booking ID
      const bookingId = `BK${Date.now()}`;
      
      // Calculate price: 120 kr per person + 100 kr per lane
      const peoplePrice = body.people * 120;
      const lanesPrice = body.lanes * 100;
      const shoesPrice = body.shoes.length * 0; // Shoes are included in person price
      const totalPrice = peoplePrice + lanesPrice;
      
      return HttpResponse.json({
        bookingDetails: {
          bookingId,
          when: body.when,
          people: body.people,
          lanes: body.lanes,
          shoes: body.shoes,
          price: totalPrice,
        },
      });
    }
  ),
];
