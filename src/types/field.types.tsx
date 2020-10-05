export interface fieldType {
    area: number,       // in meter
    culture: {
        name: string,
        id: number
    }
    features: {
        bbox: any,
        coordinates:Array<Array<Array<number>>>, 
        'type': string
    },
    id: number,
    selected? : boolean
    name: string
}