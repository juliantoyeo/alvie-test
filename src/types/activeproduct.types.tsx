export interface activeProductType {
    id: number, 
    ammId: number,      
    name: string,
    unit: string,
    dosemax: number,
    phytoproduct: {
        id: number,
        name: string,
    }
    selected?: boolean
    dose?: number
    doseCoop? :number
}