import {useState, useEffect} from "react"
import {LChart, BChart} from './Charts.tsx'
import "../App.css"

const chartFuncs = {
  'climate precipitation' : 'CLIMATE_PRECIPITATION', 
  'population density' : 'POPULATION_DENSITY',
  //'land cover type' : 'LCT',
  'gross primary product' : 'GP'
}


function Widget({chartData} : any) {
    const [type, setType] = useState('CLIMATE_PRECIPITATION');


    return (
        <div className = "widget">
            <div className="select">
            <select value = {type}
            
            onChange = {e => setType(e.target.value)}>
                {Object.entries(chartFuncs).map(([key, value]) => 
                  <option key={value} value={value}>{key}</option>
                )}
            </select>
            </div>
            {type == 'LCT' ? <BChart data = {chartData.get(type)}/> : <LChart data = {chartData.get(type)}/>}
        </div>
    );
}

export default Widget