"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { fetchRoute } from "@/lib/api";
import { toast } from "sonner";

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ClickHandler({
  origin,
  destination,
  setOrigin,
  setDestination,
}: any) {
  useMapEvents({
    click(e) {
      const coords: [number, number] = [
        e.latlng.lat,
        e.latlng.lng,
      ];

      if (!origin) {
        setOrigin(coords);
      } else if (!destination) {
        setDestination(coords);
      }
    },
  });

  return null;
}

export default function MapComponent() {
  const [origin, setOrigin] =
    useState<[number, number] | null>(null);

  const [destination, setDestination] =
    useState<[number, number] | null>(null);

  const [route, setRoute] = useState<[number, number][]>([]);

  const [loading, setLoading] = useState(false);

  const [risk, setRisk] = useState(0.95);

  const [model, setModel] = useState(
    "Bayesian MC Dropout"
  );

  const [distance, setDistance] = useState(0);

  const [travelTime, setTravelTime] = useState(0);

  const [riskScore, setRiskScore] = useState(0);

  const calculateRoute = async () => {
    if (!origin || !destination) return;

    try {
      setLoading(true);

      const data = await fetchRoute(
        origin,
        destination
      );

      setRoute(data.route);

      let totalDistance = 0;

      for (let i = 0; i < data.route.length - 1; i++) {
        const [lat1, lon1] = data.route[i];
        const [lat2, lon2] = data.route[i + 1];

        const dx = lat2 - lat1;
        const dy = lon2 - lon1;

        totalDistance += Math.sqrt(dx * dx + dy * dy);
      }

      const km = totalDistance * 111;

      setDistance(km);

      const estimatedMinutes = (km / 30) * 60;

      setTravelTime(estimatedMinutes);

      setRiskScore(risk);

      toast.success("Safe route generated.");
    } catch (err) {
      toast.error("No safe route found.");
    } finally {
      setLoading(false);
    }
  };

  const resetMap = () => {
    setOrigin(null);
    setDestination(null);
    setRoute([]);

    setDistance(0);
    setTravelTime(0);
    setRiskScore(0);
  };

  return (
    <div className="relative h-screen w-full">
      <Sidebar
        origin={origin}
        destination={destination}
        loading={loading}
        risk={risk}
        setRisk={setRisk}
        model={model}
        setModel={setModel}
        onCalculate={calculateRoute}
        onReset={resetMap}
        distance={distance}
        travelTime={travelTime}
        riskScore={riskScore}
      />

      <MapContainer
        center={[10.3157, 123.8854]}
        zoom={13}
        className="h-screen w-full"
      >
        <TileLayer
          attribution="CartoDB"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <ClickHandler
          origin={origin}
          destination={destination}
          setOrigin={setOrigin}
          setDestination={setDestination}
        />

        {origin && (
          <Marker
            position={origin}
            icon={greenIcon}
          />
        )}

        {destination && (
          <Marker
            position={destination}
            icon={redIcon}
          />
        )}

        {route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: "#00e5ff",
              weight: 7,
              opacity: 0.9,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
