export interface fieldType {
    area: number,       // in meter
    culture_name: string,
    features: {
        bbox: any,
        coordinates:Array<Array<Array<number>>>, 
        'type': string
    },
    id: number,
    selected? : boolean
    name?: string
}