export interface RouteResponse {
  status: string;
  route: [number, number][];
  risk_edges: [[number, number], [number, number]][];
  distance_km: number;
  estimated_time_min: number;
  risk_score: number;
  message: string;
}
