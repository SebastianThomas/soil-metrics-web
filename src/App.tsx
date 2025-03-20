import './App.css'
import MapComponent from './map/MapComponent.tsx'
import Diagram from './metrics/Diagram.tsx'

function App() {
  return (
    <>
      <h1>ein unglaubliches Dashboard</h1>
      <div className="column"><MapComponent/></div>
      <div className="column"><Diagram/></div>
    </>
  )
}

export default App
