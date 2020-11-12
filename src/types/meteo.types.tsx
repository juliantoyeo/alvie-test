export interface meteoByHourType {
    timestamp: string,
    hour: string,
    dthour?: number,
    maxhumi: number,
    minhumi: number,
    maxtemp: number,
    mintemp: number,
    wind: number,
    gust: number,
    precipitation: number,
    probability: string,
    soiltemp: number,
    soilhumi: number,
    pictocode: string,
    winddirection: string
}