import './App.css'
import Map from './map/Map.tsx'
import Diagram from './metrics/Diagram.tsx'

function App() {
  return (
    <>
      <h1>ein unglaubliches Dashboard</h1>
      <div className="column"><Map/></div>
      <div className="column"><Diagram/></div>
    </>
  )
}

export default App
