import './App.css'
import MapComponent from './map/MapComponent.tsx'
import Diagram from './metrics/Diagram.tsx'
// import AccumulatedData from './AccumulatedData.tsx'

import { useState, useEffect } from 'react'

type ClickInfo = { lng: number; lat: number; firstLayer: any; }


function App() {
  const [clickInfo, setClickInfo] = useState<ClickInfo | null>(null);
  const [chartData, setChartData] = useState<Map<string, {time: Date, data: any}>>(new Map());
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if(clickInfo) {
      console.log('loading');
      setLoading(true);
      let nwMap = new Map();
      fetch(`https://start-hack-ws-dev.sthomas.ch/v1/point-data?x=${clickInfo?.lng}&y=${clickInfo?.lat}`)
      .then((res) => res.json())
      .then((json) => {
        for (let elem of json) {
          let prod: string = elem['product'];
          let time: Date = new Date(elem['time']);
          let data = elem['data'];

          if(data != null) {
            if(!nwMap.has(prod)) {
              nwMap.set(prod, []);
            }
            let year = new Date(time).getFullYear(); 
            nwMap.get(prod).push({"time": time, "data":data, "year": year});
            
          }
        }
      })
      .finally(() =>{  
        setChartData(nwMap);
        setLoading(false);
      })
    }
  }, [clickInfo]);

  return (
    <>
      <h1 className="text" style={{textAlign: 'center'}}>Dashboard Soil Metrics</h1>
      <div className="column">
        <MapComponent clickInfo={clickInfo} setClickInfo = {setClickInfo}/>
      </div>
      <div className="column">
        <Diagram chartData = {chartData} isLoading = {isLoading} />
        {/* <AccumulatedData /> */}
      </div>
    </>
  )
}

export default App
