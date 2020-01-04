
export const updateToken = (token) => {
    return ({
        type: 'UPDATE_TOKEN',
        token
    });
}

export const updateUserName = (userName) => {
    return ({
        type: 'UPDATE_USERNAME',
        userName
    });
}
export const updateFamilyName = (familyName) => {
    return ({
        type: 'UPDATE_FAMILYNAME',
        familyName
    });
}
export const updateDeviceid = (deviceid) => {
    return ({
        type: 'UPDATE_DEVICEID',
        deviceid
    });
}
export const updateDeviceType = (deviceType) => {
    return ({
        type: 'UPDATE_DEVICETYPE',
        deviceType
    });
}

export const deleteToken = () => {
    return ({
        type: 'DELETE_TOKEN'
    });
}