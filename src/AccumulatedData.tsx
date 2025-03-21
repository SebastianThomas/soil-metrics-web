import { useState } from "react";
import Widget from "./metrics/Widget";


export default function AccumulatedData() {
    const [isLoading, setIsLoading] = useState(true)
    const nwMap = new Map()

    fetch(`https://start-hack-public-dev.sthomas.ch/aggregated-lct.json`)
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

            nwMap.get(prod).push({"time": time, "data":data});
          }
        }
      }).finally(() => setIsLoading(false))

    return (
        <>
        <Widget chartData={nwMap} isLoading={isLoading} />
        </>
    )
}