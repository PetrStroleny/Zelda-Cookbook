import { useRef } from "react";

export function debounce(fn: Function, ms = 300) {
    const timeoutId = useRef<ReturnType<typeof setTimeout>>();

    function debounced(this: any, ...args: any[]) {
        clearTimeout(timeoutId.current);
        timeoutId.current = setTimeout(() => fn.apply(this, args), ms);
    };

    return {
        debounced,
        clearDebounceTimeout: () => clearTimeout(timeoutId.current),
    }
};