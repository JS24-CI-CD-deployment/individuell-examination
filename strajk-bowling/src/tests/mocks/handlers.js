import { http, HttpResponse } from "msw";

const API_URL =
  "https://731xy9c2ak.execute-api.eu-north-1.amazonaws.com/booking";

export const handlers = [
  http.post(API_URL, async ({ request }) => {
    const body = await request.json();
    const { bowlers, lanesAvailable } = body;

    if (bowlers < 1) {
      return HttpResponse.json(
        { error: "Antal spelare måste vara mint 1" },
        { status: 400 }
      );
    }
    if (!lanesAvailable) {
      return HttpResponse.json(
        { error: "Banorna är tyvärr fullbokade. Välj en annan tid." },
        { status: 400 }
      );
    }

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
];
