export interface activeProductType {
    id: number, 
    amm_id: number,      
    name: string,
    unit: string,
    dosemax: number,
    phytoproduct: {
        id: number,
        name: string,
    }
    selected?: boolean
    dose?: number
    dosecoop? :number
}