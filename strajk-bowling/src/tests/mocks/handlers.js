import { http, HttpResponse } from "msw";

const API_URL =
  "https://731xy9c2ak.execute-api.eu-north-1.amazonaws.com/booking";

export const handlers = [
  http.post(API_URL, async ({ request }) => {
    const body = await request.json();

    const people = Number(body.people ?? 0);
    const lanes = Number(body.lanes ?? 0);

    const price = people * 120 + lanes * 100;

    return HttpResponse.json(
      {
        bookingDetails: {
          id: "SB-TEST-007",
          price,
        },
      },
      { status: 201 }
    );
  }),
];
