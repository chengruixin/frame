
type TFnArg = (<T>() => T) | (() => void); 
type TEffectFn = (fn: () => void) => void;
type TAnyObject = Record<string | symbol, any>;
type TAnyKey = TAnyObject | string | symbol;

let acctiveEffect: TFnArg;
const dependencyBucket = new WeakMap<TAnyObject, Map<TAnyKey, Set<TFnArg>>>();

export function track(target: TAnyObject, key: TAnyKey) {
    if (!acctiveEffect) {
        return;
    }

    if (!dependencyBucket.has(target)) {
        dependencyBucket.set(target, new Map<TAnyKey, Set<TFnArg>>());
    }

    const targetDep = dependencyBucket.get(target);
    if (!targetDep.has(key)) {
        targetDep.set(key, new Set<TFnArg>());
    }

    const deps = targetDep.get(key);

    deps.add(acctiveEffect);
}

export function trigger(target: TAnyObject, key: TAnyKey) {
    if (!dependencyBucket.has(target)) {
        return;
    }

    const tragetDep = dependencyBucket.get(target);

    if (!tragetDep.has(key)) {
        return;
    }

    const effectFns = tragetDep.get(key);


    effectFns.forEach(fn => fn());
}


export const effect: TEffectFn = (fn: TFnArg) => {
    const effectFn = () => {
        acctiveEffect = effectFn;
        fn()
        acctiveEffect = null;
    }

    effectFn();
}