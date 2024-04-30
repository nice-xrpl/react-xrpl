type StoreListener = () => void;
// type Optional<T> = T | undefined;
type Fn<T> = (prevState: T) => T;

export type Store<T = unknown> = {
    getState: () => T;
    setState: (value: T | Fn<T>) => void;
    subscribe: (listener: StoreListener) => () => void;
};

/**
 * Checks if the given value is a function.
 *
 * @param {unknown} fn - The value to be checked.
 * @return {fn is Function} - Returns true if the value is a function, false otherwise.
 */
function isFunction(fn: unknown): fn is Function {
    return typeof fn === 'function';
}

/**
 * Creates a store with initial value.
 *
 * @param {T} initialValue - The initial value for the store.
 * @return {Store<T>} The created store object with getState, setState, and subscribe methods.
 */
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
