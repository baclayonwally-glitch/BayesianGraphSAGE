"use client";

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
    <div
      className="
        absolute
        top-4
        left-4
        z-[1000]
        w-[360px]
        bg-white/95
        backdrop-blur-md
        rounded-3xl
        shadow-2xl
        border
        border-slate-200
        p-6
      "
    >
      <h1 className="text-3xl font-bold text-slate-800">
        Flood Routing AI
      </h1>

      <p className="text-sm text-slate-500 mt-1 mb-6">
        Bayesian Risk-Aware Navigation
      </p>

      <div className="space-y-5">

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Origin
          </label>

          <div className="bg-slate-100 rounded-2xl p-3 mt-2 text-sm">
            {origin
              ? `${origin[0].toFixed(5)}, ${origin[1].toFixed(5)}`
              : "Click map"}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Destination
          </label>

          <div className="bg-slate-100 rounded-2xl p-3 mt-2 text-sm">
            {destination
              ? `${destination[0].toFixed(5)}, ${destination[1].toFixed(5)}`
              : "Click map"}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Routing Model
          </label>

          <select
            value={model}
            onChange={(e) =>
              setModel(e.target.value)
            }
            className="
              w-full
              mt-2
              p-3
              rounded-2xl
              border
              border-slate-300
              bg-white
            "
          >
            <option>
              Baseline Dijkstra
            </option>

            <option>
              Deterministic GraphSAGE
            </option>

            <option>
              Bayesian MC Dropout
            </option>

            <option>
              Variational Inference
            </option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Risk Aversion (CVaR β)
          </label>

          <div className="text-cyan-600 font-bold mt-1">
            {risk.toFixed(2)}
          </div>

          <input
            type="range"
            min="0.50"
            max="0.99"
            step="0.01"
            value={risk}
            onChange={(e) =>
              setRisk(Number(e.target.value))
            }
            className="w-full mt-2"
          />
        </div>

        <div className="bg-slate-100 rounded-3xl p-4">

          <h2 className="font-bold text-slate-800 mb-4">
            Route Analytics
          </h2>

          <div className="space-y-3 text-sm">

            <div className="flex justify-between">
              <span>Distance</span>

              <span className="font-semibold">
                {distance.toFixed(2)} km
              </span>
            </div>

            <div className="flex justify-between">
              <span>Travel Time</span>

              <span className="font-semibold">
                {travelTime.toFixed(1)} mins
              </span>
            </div>

            <div className="flex justify-between">
              <span>Risk Score</span>

              <span className="font-semibold text-red-500">
                {riskScore.toFixed(3)}
              </span>
            </div>

          </div>

        </div>

        <button
          onClick={onCalculate}
          disabled={
            loading ||
            !origin ||
            !destination
          }
          className="
            w-full
            bg-cyan-500
            hover:bg-cyan-600
            text-white
            font-bold
            py-4
            rounded-2xl
            transition
          "
        >
          {loading
            ? "Calculating..."
            : "Calculate Safe Route"}
        </button>

        <button
          onClick={onReset}
          className="
            w-full
            bg-red-500
            hover:bg-red-600
            text-white
            font-bold
            py-4
            rounded-2xl
            transition
          "
        >
          Reset
        </button>

      </div>
    </div>
  );
}
