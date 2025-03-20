import Widget from './Widget'

function Diagram({chartData, isLoading} : any) {
    return (
        <>
        <h2>ein lustiges Diagram</h2>
        <Widget chartData = {chartData} isLoading = {isLoading}/>
        <Widget chartData = {chartData} isLoading = {isLoading}/>
        </>
    )
}

export default Diagram