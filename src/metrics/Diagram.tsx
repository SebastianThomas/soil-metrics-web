import Widget from './Widget'

function Diagram({chartData} : any) {
    return (
        <>
        <h2>ein lustiges Diagram</h2>
        <Widget chartData = {chartData}/>
        <Widget chartData = {chartData}/>
        </>
    )
}

export default Diagram