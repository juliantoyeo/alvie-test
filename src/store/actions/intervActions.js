
export const updateInterv = (interventionValues) => {
    return ({
        type: 'UPDATE_INTERV',
        interventionValues,
    });
}

export const updatePhytoSelect = (produitPhytoClicked, deviceid, interventionid) => {
    return ({
        type: 'UPDATE_PHYTO_SELECT',
        produitPhytoClicked,
        deviceid,
        interventionid,
    });
}

