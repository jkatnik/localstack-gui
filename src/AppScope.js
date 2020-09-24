const objects = {}

export function register(key, object) {
    console.log("========= register " + key);
    return objects[key] = object;
}

export function get(key) {
    return objects[key]
}

export function registerIfNotExist(key, providerFun) {
    if (!objects[key]) {
        objects[key] = providerFun();
    }
    return objects[key];
}