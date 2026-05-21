"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  RotateCcw,
  Route,
  ShieldAlert,
  Timer,
  Map,
} from "lucide-react";

interface Props {
  origin: [number, number] | null;
  destination: [number, number] | null;
  loading: boolean;
  risk: number;
  setRisk: (value: number) => void;
  model: string;
  setModel: (value: string) => void;
  onCalculate: () => void;
  onReset: () => void;

  distance: number;
  travelTime: number;
  riskScore: number;
}

export default function Sidebar({
  origin,
  destination,
  loading,
  risk,
  setRisk,
  model,
  setModel,
  onCalculate,
  onReset,
  distance,
  travelTime,
  riskScore,
}: Props) {
  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="
        glass
        absolute
        z-[1000]
        left-4
        top-4
        w-[360px]
        rounded-3xl
        p-6
        shadow-2xl
        border
        border-cyan-500/20
      "
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-cyan-500/20 p-3 rounded-2xl">
          <AlertTriangle className="text-cyan-400" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">
            Flood Routing AI
          </h1>

          <p className="text-xs text-slate-400">
            Bayesian Risk-Aware Navigation
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-sm text-slate-300 mb-1">
            Origin
          </p>

          <div className="text-xs bg-slate-900/80 border border-slate-700 p-3 rounded-xl">
            {origin
              ? `${origin[0].toFixed(5)}, ${origin[1].toFixed(5)}`
              : "Click on map"}
          </div>
        </div>

        <div>
          <p className="text-sm text-slate-300 mb-1">
            Destination
          </p>

          <div className="text-xs bg-slate-900/80 border border-slate-700 p-3 rounded-xl">
            {destination
              ? `${destination[0].toFixed(5)}, ${destination[1].toFixed(5)}`
              : "Click on map"}
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-300">
            Routing Model
          </label>

          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="
              w-full
              mt-2
              p-3
              rounded-xl
              bg-slate-900/80
              border
              border-slate-700
              text-sm
            "
          >
            <option>Baseline Dijkstra</option>
            <option>Deterministic GraphSAGE</option>
            <option>Bayesian MC Dropout</option>
            <option>Variational Inference</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-300">
            Risk Aversion (CVaR β)
          </label>

          <div className="flex justify-between text-xs text-cyan-400 mt-1 mb-2">
            <span>Low Risk</span>
            <span>{risk.toFixed(2)}</span>
            <span>High Safety</span>
          </div>

          <input
            type="range"
            min="0.50"
            max="0.99"
            step="0.01"
            value={risk}
            onChange={(e) => setRisk(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>

        <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert
              size={18}
              className="text-cyan-400"
            />

            <h2 className="font-semibold text-cyan-400">
              Route Analytics
            </h2>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Map size={16} />
              <span>Distance</span>
            </div>

            <span className="font-medium">
              {distance.toFixed(2)} km
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Timer size={16} />
              <span>Travel Time</span>
            </div>

            <span className="font-medium">
              {travelTime.toFixed(1)} mins
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span>Risk Score</span>

            <span className="font-medium text-cyan-400">
              {riskScore.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span>Model</span>

            <span className="font-medium text-right text-xs">
              {model}
            </span>
          </div>
        </div>

        <button
          onClick={onCalculate}
          disabled={loading || !origin || !destination}
          className="
            w-full
            bg-cyan-500
            hover:bg-cyan-400
            disabled:bg-slate-700
            transition-all
            duration-300
            rounded-2xl
            py-4
            flex
            items-center
            justify-center
            gap-2
            font-semibold
            shadow-lg
            shadow-cyan-500/20
          "
        >
          <Route size={18} />

          {loading
            ? "Calculating Safe Route..."
            : "Calculate Safe Route"}
        </button>

        <button
          onClick={onReset}
          className="
            w-full
            bg-red-500/90
            hover:bg-red-400
            transition-all
            duration-300
            rounded-2xl
            py-4
            flex
            items-center
            justify-center
            gap-2
            font-semibold
          "
        >
          <RotateCcw size={18} />
          Reset Map
        </button>
      </div>
    </motion.div>
  );
}
