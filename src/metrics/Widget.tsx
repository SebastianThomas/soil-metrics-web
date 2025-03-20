import {useState, useEffect} from "react"
import LChart from './Charts.tsx'


function Widget() {
    const [type, setType] = useState("rain");
    const [data, setData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`/fake-backend/${type}.json`);
            const result = await response.json();
            setData(result);
          } catch (error) {
            console.error(`Error fetching data in /fake-backend/${type}.json:`, error);
          }
        };
    
        fetchData();
      }, [type]); // Runs when selectedValue changes

    return (
        <div className = "widget">
            <select value = {type}
            onChange = {e => setType(e.target.value)}>
                <option value="rain">Rain</option>
                <option value="defor">Deforestation</option>
            </select>
            <LChart data = {data}/>
        </div>
    );
}

export default Widget