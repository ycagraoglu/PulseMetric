import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export function useQueryState(key: string, options: any = {}) {
    const [searchParams, setSearchParams] = useSearchParams();
    // @ts-ignore
    const value = searchParams.get(key) || options.defaultValue || null;

    const setValue = useCallback((newValue: any) => {
        setSearchParams(prev => {
            if (newValue === null || newValue === undefined || newValue === '') {
                prev.delete(key);
            } else {
                prev.set(key, String(newValue));
            }
            return prev;
        }, { replace: true });
    }, [key, setSearchParams]);

    return [value, setValue];
}

export const parseAsString = {
    parse: (v: string) => v,
    serialize: (v: string) => v,
    withDefault: (defaultValue: string) => ({ defaultValue, parse: (v: string) => v ?? defaultValue })
};

export const parseAsInteger = {
    parse: (v: string) => parseInt(v, 10),
    serialize: (v: number) => String(v),
    withDefault: (defaultValue: number) => ({ defaultValue, parse: (v: string) => v ? parseInt(v, 10) : defaultValue })
};

export function useQueryStates(parsers: Record<string, any>, _options: any = {}) {
    const [searchParams, setSearchParams] = useSearchParams();

    // Parse current values
    const values = useMemo(() => {
        return Object.keys(parsers).reduce((acc, key) => {
            const parser = parsers[key];
            const rawValue = searchParams.get(key);

            let parsedValue = rawValue;
            if (parser.parse && rawValue !== null) {
                parsedValue = parser.parse(rawValue);
            } else if (parser.defaultValue !== undefined) {
                parsedValue = parser.defaultValue;
            } else if (rawValue === null) {
                parsedValue = null;
            }

            acc[key] = parsedValue;
            return acc;
        }, {} as any);
    }, [searchParams, parsers]);

    // Setter
    const setValues = useCallback((updates: any, _options?: any) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            Object.entries(updates).forEach(([key, value]) => {
                if (value === null || value === undefined || value === '') {
                    newParams.delete(key);
                } else {
                    newParams.set(key, String(value));
                }
            });
            return newParams;
        }, { replace: true });

        return Promise.resolve(new URLSearchParams()); // Mock return for async compatibility
    }, [setSearchParams]);

    return [values, setValues];
}
