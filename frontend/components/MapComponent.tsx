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

import "leaflet/dist/leaflet.css";

// =====================================================
// FIX LEAFLET ICONS
// =====================================================

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// =====================================================
// CUSTOM ICONS
// =====================================================

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

// =====================================================
// MAP CLICK HANDLER
// =====================================================

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

      // First click = origin
      if (!origin) {

        setOrigin(coords);

      // Second click = destination
      } else if (!destination) {

        setDestination(coords);

      // Third click = reset origin
      } else {

        setOrigin(coords);

        setDestination(null);
      }
    },
  });

  return null;
}

// =====================================================
// MAIN COMPONENT
// =====================================================

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
    useState<
      [[number, number], [number, number]][]
    >([]);

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

  const [backendMessage, setBackendMessage] =
    useState("");

  // =========================================
  // FIX SSR ISSUE
  // =========================================

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // =========================================
  // CALCULATE ROUTE
  // =========================================

 const calculateRoute = async () => {

  if (!origin || !destination) {

    toast.error(
      "Please select origin and destination."
    );

    return;
  }

  try {

    setLoading(true);

    setRoute([]);

    setRiskEdges([]);

    const data = await fetchRoute(
      origin,
      destination,
      model,
      risk
    );

    // =====================================
    // DEBUG RESPONSE
    // =====================================

    console.log(
      "FULL BACKEND RESPONSE:",
      data
    );

    console.log(
      "DISTANCE:",
      data.distance_km
    );

    console.log(
      "TRAVEL TIME:",
      data.estimated_time_min
    );

    console.log(
      "RISK SCORE:",
      data.risk_score
    );

    // =====================================
    // UPDATE MAP
    // =====================================

    setRoute(
      Array.isArray(data.route)
        ? data.route
        : []
    );

    setRiskEdges(
      Array.isArray(data.risk_edges)
        ? data.risk_edges
        : []
    );

    // =====================================
    // UPDATE ANALYTICS
    // =====================================

    setDistance(
      Number(data.distance_km) || 0
    );

    setTravelTime(
      Number(data.estimated_time_min) || 0
    );

    setRiskScore(
      Number(data.risk_score) || 0
    );

    // =====================================
    // BACKEND MESSAGE
    // =====================================

    setBackendMessage(
      data.message || ""
    );

    toast.success(
      "Flood-aware route generated successfully."
    );

  } catch (error: any) {

    console.error(error);

    toast.error(
      error.message ||
      "No safe route found."
    );

  } finally {

    setLoading(false);
  }
};

  // =========================================
  // RESET MAP
  // =========================================

  const resetMap = () => {

    setOrigin(null);

    setDestination(null);

    setRoute([]);

    setRiskEdges([]);

    setDistance(0);

    setTravelTime(0);

    setRiskScore(0);

    setBackendMessage("");
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">

      {/* ========================================= */}
      {/* SIDEBAR */}
      {/* ========================================= */}

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

      {/* ========================================= */}
      {/* MAP */}
      {/* ========================================= */}

      <MapContainer
        center={[10.3157, 123.8854]}
        zoom={13}
        zoomControl={false}
        className="h-screen w-full z-0"
      >

        <ZoomControl position="bottomright" />

        {/* ========================================= */}
        {/* MAP STYLE */}
        {/* ========================================= */}

        <TileLayer
          attribution="CartoDB Voyager"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* ========================================= */}
        {/* CLICK HANDLER */}
        {/* ========================================= */}

        <ClickHandler
          origin={origin}
          destination={destination}
          setOrigin={setOrigin}
          setDestination={setDestination}
        />

        {/* ========================================= */}
        {/* RISK EDGES */}
        {/* ========================================= */}

        {riskEdges.map((edge, idx) => {

          if (
            !edge ||
            edge.length < 2
          ) return null;

          return (
            <Polyline
              key={idx}
              positions={edge}
              pathOptions={{
                color: "#ef4444",
                weight: 5,
                opacity: 0.8,
                dashArray: "10 10",
              }}
            />
          );
        })}

        {/* ========================================= */}
        {/* SAFE ROUTE */}
        {/* ========================================= */}

        {route.length > 0 && (
          <>
            {/* GLOW */}
            <Polyline
              positions={route}
              pathOptions={{
                color: "#06b6d4",
                weight: 14,
                opacity: 0.2,
              }}
            />

            {/* MAIN */}
            <Polyline
              positions={route}
              pathOptions={{
                color: "#06b6d4",
                weight: 7,
                opacity: 1,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </>
        )}

        {/* ========================================= */}
        {/* ORIGIN */}
        {/* ========================================= */}

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
                Origin Point
              </Popup>
            </Marker>
          </>
        )}

        {/* ========================================= */}
        {/* DESTINATION */}
        {/* ========================================= */}

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
                Destination Point
              </Popup>
            </Marker>
          </>
        )}

      </MapContainer>

      {/* ========================================= */}
      {/* LEGEND */}
      {/* ========================================= */}

      <div
        className="
          absolute
          bottom-5
          right-5
          z-[1000]
          bg-white/95
          backdrop-blur-md
          rounded-2xl
          shadow-2xl
          border
          border-slate-200
          p-4
          w-[230px]
        "
      >

        <h2 className="font-bold text-slate-800 mb-3">
          Map Legend
        </h2>

        <div className="space-y-3 text-sm">

          <div className="flex items-center gap-3">
            <div className="w-6 h-2 rounded-full bg-cyan-500" />

            <span className="text-slate-700">
              Safe Route
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-6 h-2 rounded-full bg-red-500" />

            <span className="text-slate-700">
              Flood-Risk Roads
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-green-500" />

            <span className="text-slate-700">
              Origin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-red-400" />

            <span className="text-slate-700">
              Destination
            </span>
          </div>

        </div>

      </div>

      {/* ========================================= */}
      {/* BACKEND MESSAGE */}
      {/* ========================================= */}

      {backendMessage && (
        <div
          className="
            absolute
            top-5
            right-5
            z-[1000]
            bg-cyan-500
            text-white
            px-5
            py-3
            rounded-2xl
            shadow-xl
            max-w-[400px]
          "
        >
          {backendMessage}
        </div>
      )}

    </div>
  );
}
