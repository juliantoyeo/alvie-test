
export const updateInterv = (interventionValues) => {
    return ({
        type: 'UPDATE_INTERV',
        interventionValues,
    });
}

export const updatePhytoSelect = (produitPhytoClicked) => {
    return ({
        type: 'UPDATE_PHYTO_SELECT',
        produitPhytoClicked,
    });
}

