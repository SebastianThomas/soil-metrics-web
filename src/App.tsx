import './App.css'
import MapComponent from './map/MapComponent.tsx'
import Diagram from './metrics/Diagram.tsx'

import { useState, useEffect } from 'react'

type ClickInfo = { lng: number; lat: number; firstLayer: any; }


function App() {
  const [clickInfo, setClickInfo] = useState<ClickInfo | null>(null);
  const [chartData, setChartData] = useState(new Map());

  useEffect(() => {
    if(clickInfo) {
      let nwMap = new Map();
      fetch(`https://start-hack-ws-dev.sthomas.ch/v1/point-data?x=${clickInfo?.lng}&y=${clickInfo?.lat}`)
      .then((res) => res.json())
      .then((json) => {
        for (let elem of json) {
          let prod = elem['product'];
          let time = elem['time'];
          let data = elem['data'];

          if(data != null) {
            if(!nwMap.has(prod)) {
              nwMap.set(prod, []);
            }

            nwMap.get(prod).push({"time": time, "data":data});
          }
        }
      })
      .finally(() =>{  
        setChartData(nwMap);
      })
    }
  }, [clickInfo]);

  return (
    <>
      <h1>ein unglaubliches Dashboard</h1>
      <div className="column">
        <MapComponent clickInfo={clickInfo} setClickInfo = {setClickInfo}/>
      </div>
      <div className="column"><Diagram chartData = {chartData}/></div>
    </>
  )
}

export default App
