import Widget from './Widget'

function Diagram({chartData, isLoading} : {chartData: Map<string, {time: Date, data: any}>, isLoading: boolean}) {
    return (
        <>
        <Widget chartData = {chartData} isLoading = {isLoading}/>
        <Widget chartData = {chartData} isLoading = {isLoading}/>
        </>
    )
}

export default Diagram