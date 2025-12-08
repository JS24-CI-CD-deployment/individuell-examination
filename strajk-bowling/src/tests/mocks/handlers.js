import { http, HttpResponse } from "msw";

const API_URL =
  "https://731xy9c2ak.execute-api.eu-north-1.amazonaws.com/booking";

export const handlers = [
  http.post(API_URL, async ({ request }) => {
    return HttpResponse.json(
      {
        bookingDetails: {
          id: "SB-TEST-007",
          price: 340,
        },
      },
      { status: 201 }
    );
  }),

  http.post(API_URL, async ({ request }) => {
    return HttpResponse.json(
      {
        error: "Banorna är tyvärr fullbokade. Välj en annan tid.",
      },
      { status: 400 }
    );
  }),
];
