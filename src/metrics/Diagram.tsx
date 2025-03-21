import Widget from './Widget'

function Diagram({chartData, isLoading} : {chartData: Map<string, {time: Date, data: any}>, isLoading: boolean}) {
    return (
        <>
        <div className='diagrams'>
        <Widget chartData = {chartData} isLoading = {isLoading} startType ="CLIMATE_PRECIPITATION"/>
        <Widget chartData = {chartData} isLoading = {isLoading} startType ="GP"/>
        </div>
        </>
    )
}

export default Diagram