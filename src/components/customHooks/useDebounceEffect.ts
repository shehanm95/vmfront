import { useEffect, useRef } from 'react';

export function useDebounceEffect(
    callback: () => void,
    delay: number,
    deps: any[] = [],
) {
    const firstUpdate = useRef(true);
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        const handler = setTimeout(() => {
            callback();
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [delay, ...deps]);
}