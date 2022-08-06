
type TFnArg = {
    <T>(): T;
    (): void;
    deps?:  Set<TFnArg>[];
}; 

type TEffectFn = (fn: () => void) => void;
type TAnyObject = Record<string | symbol, any>;
type TAnyKey = TAnyObject | string | symbol;

let activeEffect: TFnArg;
const dependencyBucket = new WeakMap<TAnyObject, Map<TAnyKey, Set<TFnArg>>>();


function cleanDeps(activeEffect: TFnArg) {
    activeEffect.deps.forEach((depSet: Set<TFnArg>) => depSet.delete(activeEffect));
}

export function track(target: TAnyObject, key: TAnyKey) {
    if (!activeEffect) {
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

    // collect reversed deps set
    activeEffect.deps.push(deps);

    deps.add(activeEffect);
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

    const effectsToRun = new Set(effectFns);
    effectsToRun.forEach(fn => fn());
}


export const effect: TEffectFn = (fn: TFnArg) => {
    const effectFn: TFnArg = () => {
        activeEffect = effectFn;
        cleanDeps(effectFn);
        fn()
        activeEffect = null;
    }

    effectFn.deps = [];

    effectFn();
}