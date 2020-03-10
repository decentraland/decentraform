
export function checkAddressMapping(deploy: any, addresses: any) {
    const addressDict = {}
    for (let address of Object.keys(addresses)) {
        addressDict[address] = 1
    }
    for (let scene of Object.values(deploy) as any) {
        if (!addressDict[scene.target.base]) {
            return false
        }
        for (let parcel of scene.target.parcels)
        if (!addressDict[parcel]) {
            return false
        }
    }
    return true
}