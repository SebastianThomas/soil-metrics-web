import { useState, useEffect } from "react"
import { LChart, BChart } from './Charts.tsx'
import "../App.css"
import ClipLoader from "react-spinners/ClipLoader";
import './Widget.css'
import "../App.css"

const chartFuncs = {
  'climate precipitation': 'CLIMATE_PRECIPITATION',
  'population density': 'POPULATION_DENSITY',
  //'land cover type' : 'LCT',
  'gross primary product': 'GP'
}




function Widget({ chartData, isLoading }: any) {
  const [showEffects, setShowEffects] = useState(false);
  const [type, setType] = useState("CLIMATE_PRECIPITATION");

  useEffect(() => {
    let timeout: number = 0;

    if (isLoading) {
      timeout = setTimeout(() => setShowEffects(true), 100); // Show spinner & blur only after 1 sec
    } else {
      clearTimeout(timeout);
      setShowEffects(false); // Remove spinner & blur immediately when loading stops
    }

    return () => clearTimeout(timeout);
  }, [isLoading]);

  return (
    <div className="widget-container">
      {showEffects && (
        <div className="loading-overlay">
          <ClipLoader />
        </div>
      )}

      <div className={`widget ${showEffects ? "blurred" : ""}`}>
        <div className="select">
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {Object.entries(chartFuncs).map(([key, value]) => (
              <option key={value} value={value}>
                {key}
              </option>
            ))}
          </select>
        </div>
        {type === "LCT" ? (
          <BChart data={chartData.get(type)} />
        ) : (
          <LChart data={chartData.get(type)} />
        )}
      </div>
    </div>
  );
}

export default Widget;

