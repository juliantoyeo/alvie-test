export interface activeProductType {
    id: number,      
    name: string,
    phytoproduct: {
        id: number,
        name: string,
    }
    selected?: boolean
    dose?: number
}