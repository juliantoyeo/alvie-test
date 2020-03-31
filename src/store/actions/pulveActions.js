
export const updatePhyto = (produitPhytoClicked) => {
    return ({
        type: 'UPDATE_PHYTO',
        produitPhytoClicked,
    });
}

export const updatePhytoProductList = (l) => {
    return {
        type: 'LIST_PHYTO',
        content: l
    }
}