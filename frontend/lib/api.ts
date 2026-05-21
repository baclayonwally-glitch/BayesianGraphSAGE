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

    const err = await response.json();

    throw new Error(
      err.detail || "Route generation failed."
    );
  }

  const data = await response.json();

  console.log("BACKEND RESPONSE:", data);

  return data;
}
