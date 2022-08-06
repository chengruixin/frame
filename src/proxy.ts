import { track, trigger } from "./efffect"

export const handler = {
    get(target, key) {
        track(target, key);

        return target[key]
    },

    set(target, key, newVal) {
        target[key] = newVal;
        trigger(target, key);
        return true;
    }
}