
export const updatePhyto = (produitPhytoClicked) => {
    return ({
        type: 'UPDATE_PHYTO',
        produitPhytoClicked,
    });
}

export const updatePhyto = ({
    phytoProductSelected, 
    culturesSelected
  }) => {
    return ({
        type: 'UPDATE_PULV_INFO',
        phytoProductSelected, 
        culturesSelected
    });
}

export const updatePhytoProductList = (l) => {
    return {
        type: 'LIST_PHYTO',
        content: l
    }
}

export const updatePhytoProductSelected = (selected) => {
    return {
        type: 'UPDATE_SELECTED_PHYTO',
        selected,
    }
}

export const updateCulturesSelected = (selected) => {
    return {
        type: 'UPDATE_SELECTED_CULTURES',
        selected,
    }
}