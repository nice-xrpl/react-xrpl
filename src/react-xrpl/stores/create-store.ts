type StoreListener = () => void;
// type Optional<T> = T | undefined;
type Fn<T> = (prevState: T) => T;

export type Store<T> = {
    getState: () => T;
    setState: (value: T | Fn<T>) => void;
    subscribe: (listener: StoreListener) => () => void;
};

function isFunction(fn: unknown): fn is Function {
    return typeof fn === 'function';
}

export function createStore<T>(initialValue: T): Store<T> {
    let state: T = initialValue;

    const getState = () => state;

    const listeners = new Set<StoreListener>();

    const setState = (value: T | Fn<T>) => {
        let nextState = state;

        if (isFunction(value)) {
            nextState = value(state);
        } else {
            nextState = value;
        }

        if (nextState !== state) {
            state = nextState;

            for (const listener of listeners) {
                listener();
            }
        }
    };

    const subscribe = (listener: StoreListener) => {
        listeners.add(listener);

        return () => listeners.delete(listener);
    };

    return {
        getState,
        setState,
        subscribe,
    };
}
