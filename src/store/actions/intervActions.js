
export const updateInterv = (interventionValues) => {
    return {
        type: 'UPDATE_INTERV',
        interventionValues,
    }
}

export const updateProductsInterv = (products, id) => {
    return {
        type: 'UPDATE_PHYTO_SELECT',
        products,
        id,
    }
}