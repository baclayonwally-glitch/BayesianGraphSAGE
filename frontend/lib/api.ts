import { RouteResponse } from "@/types/route";

export async function fetchRoute(
  origin: [number, number],
  destination: [number, number],
  model: string,
  risk: number
): Promise<RouteResponse> {

  const response = await fetch(
    "https://flood-routing-api-1.onrender.com/predict_route",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        origin,
        destination,
        model,
        risk,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("No route found.");
  }

  return response.json();
}
