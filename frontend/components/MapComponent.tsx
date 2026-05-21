"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  CircleMarker,
  Popup,
  ZoomControl,
} from "react-leaflet";

import L from "leaflet";

import {
  useState,
  useEffect,
} from "react";

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

  const [mounted, setMounted] =
    useState(false);

  const [origin, setOrigin] =
    useState<[number, number] | null>(null);

  const [destination, setDestination] =
    useState<[number, number] | null>(null);

  const [route, setRoute] =
    useState<[number, number][]>([]);

  const [riskEdges, setRiskEdges] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [risk, setRisk] =
    useState(0.95);

  const [model, setModel] =
    useState("Bayesian MC Dropout");

  const [distance, setDistance] =
    useState(0);

  const [travelTime, setTravelTime] =
    useState(0);

  const [riskScore, setRiskScore] =
    useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const calculateRoute = async () => {

    if (!origin || !destination) {

      toast.error(
        "Please select origin and destination."
      );

      return;
    }

    try {

      setLoading(true);

      const data = await fetchRoute(
        origin,
        destination
      );

      setRoute(data.route || []);

      setRiskEdges(
        data.risk_edges || []
      );

      setDistance(
        data.distance_km || 0
      );

      setTravelTime(
        data.estimated_time_min || 0
      );

      setRiskScore(
        data.risk_score || 0
      );

      toast.success(
        "Safe route generated."
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "No safe route found."
      );

    } finally {

      setLoading(false);
    }
  };

  const resetMap = () => {

    setOrigin(null);

    setDestination(null);

    setRoute([]);

    setRiskEdges([]);

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
        zoomControl={false}
        className="h-screen w-full"
      >

        <ZoomControl position="bottomright" />

        <TileLayer
          attribution="CartoDB Voyager"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <ClickHandler
          origin={origin}
          destination={destination}
          setOrigin={setOrigin}
          setDestination={setDestination}
        />

        {/* FLOOD RISK ROADS */}

        {riskEdges.map((edge, idx) => {

          if (!edge || edge.length < 2) {
            return null;
          }

          return (
            <Polyline
              key={idx}
              positions={edge}
              pathOptions={{
                color: "#ef4444",
                weight: 4,
                opacity: 0.7,
                dashArray: "8 10",
              }}
            />
          );
        })}

        {/* ORIGIN */}

        {origin && (
          <>
            <CircleMarker
              center={origin}
              radius={18}
              pathOptions={{
                color: "#22c55e",
                fillColor: "#22c55e",
                fillOpacity: 0.2,
              }}
            />

            <Marker
              position={origin}
              icon={greenIcon}
            >
              <Popup>
                Origin
              </Popup>
            </Marker>
          </>
        )}

        {/* DESTINATION */}

        {destination && (
          <>
            <CircleMarker
              center={destination}
              radius={18}
              pathOptions={{
                color: "#ef4444",
                fillColor: "#ef4444",
                fillOpacity: 0.2,
              }}
            />

            <Marker
              position={destination}
              icon={redIcon}
            >
              <Popup>
                Destination
              </Popup>
            </Marker>
          </>
        )}

        {/* SAFE ROUTE */}

        {route.length > 0 && (
          <>
            <Polyline
              positions={route}
              pathOptions={{
                color: "#06b6d4",
                weight: 14,
                opacity: 0.2,
              }}
            />

            <Polyline
              positions={route}
              pathOptions={{
                color: "#06b6d4",
                weight: 7,
                opacity: 1,
              }}
            />
          </>
        )}

      </MapContainer>

      {/* LEGEND */}

      <div
        className="
          absolute
          bottom-5
          right-5
          z-[1000]
          bg-white/95
          rounded-2xl
          shadow-2xl
          border
          border-slate-200
          p-4
          w-[220px]
        "
      >

        <h2 className="font-bold text-slate-800 mb-3">
          Map Legend
        </h2>

        <div className="space-y-3 text-sm">

          <div className="flex items-center gap-3">
            <div className="w-6 h-2 rounded-full bg-cyan-500" />

            <span>
              Safe Route
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-6 h-2 rounded-full bg-red-500" />

            <span>
              Flood-Risk Roads
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-green-500" />

            <span>
              Origin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-red-400" />

            <span>
              Destination
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
