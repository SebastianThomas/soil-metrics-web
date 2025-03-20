import Widget from './Widget'

function Diagram({chartData, isLoading} : any) {
    return (
        <>
        <Widget chartData = {chartData} isLoading = {isLoading}/>
        <Widget chartData = {chartData} isLoading = {isLoading}/>
        </>
    )
}

export default Diagram