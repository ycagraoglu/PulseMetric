import { type SpringOptions, useMotionValue, useSpring } from 'framer-motion';
import { type ComponentProps, type RefObject, useEffect } from 'react';

// Simplified useIsInView hook since we don't have the custom one


type CountingNumberProps = Omit<ComponentProps<'span'>, 'children'> & {
    number: number;
    fromNumber?: number;
    padStart?: boolean;
    decimalSeparator?: string;
    decimalPlaces?: number;
    transition?: SpringOptions;
    delay?: number;
    initiallyStable?: boolean;
} & { inView?: boolean; inViewMargin?: string; inViewOnce?: boolean };

function CountingNumber({
    ref,
    number,
    fromNumber = 0,
    padStart = false,
    inView = false,
    inViewMargin = '0px',
    inViewOnce = true,
    decimalSeparator = '.',
    transition = { stiffness: 150, damping: 30 },
    decimalPlaces = 0,
    delay = 0,
    initiallyStable = false,
    ...props
}: CountingNumberProps) {
    const localRef = (ref as RefObject<HTMLElement>) || { current: null };
    //   const isInView = useInView(localRef, { once: inViewOnce, margin: inViewMargin as any });
    // Temporary fix for ref issue, assuming always in view for now or using simple effect
    const isInView = true;

    const numberStr = number.toString();

    const getDecimals = () => {
        if (typeof decimalPlaces === 'number') {
            return decimalPlaces;
        }
        if (numberStr.includes('.')) {
            return numberStr.split('.')[1]?.length ?? 0;
        }
        return 0;
    };

    const decimals = getDecimals();

    const motionVal = useMotionValue(initiallyStable ? number : fromNumber);
    const springVal = useSpring(motionVal, transition);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            //   if (isInView) {
            motionVal.set(number);
            //   }
        }, delay);

        return () => clearTimeout(timeoutId);
    }, [isInView, number, motionVal, delay]);

    useEffect(() => {
        const unsubscribe = springVal.on('change', (latest) => {
            // @ts-ignore
            if (localRef.current) {
                let formatted =
                    decimals > 0
                        ? latest.toFixed(decimals)
                        : Math.round(latest).toString();

                if (decimals > 0) {
                    formatted = formatted.replace('.', decimalSeparator);
                }

                if (padStart) {
                    const finalIntLength = Math.floor(Math.abs(number)).toString().length;
                    const [intPart, fracPart] = formatted.split(decimalSeparator);
                    const paddedInt = intPart?.padStart(finalIntLength, '0') ?? '';
                    formatted = fracPart
                        ? `${paddedInt}${decimalSeparator}${fracPart}`
                        : paddedInt;
                }

                // @ts-ignore
                localRef.current.textContent = formatted;
            }
        });
        return () => unsubscribe();
    }, [springVal, decimals, padStart, number, decimalSeparator, localRef]);

    const finalIntLength = Math.floor(Math.abs(number)).toString().length;

    const formatValue = (val: number) => {
        let out = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString();
        if (decimals > 0) {
            out = out.replace('.', decimalSeparator);
        }
        if (padStart) {
            const [intPart, fracPart] = out.split(decimalSeparator);
            const paddedInt = (intPart ?? '').padStart(finalIntLength, '0');
            out = fracPart ? `${paddedInt}${decimalSeparator}${fracPart}` : paddedInt;
        }
        return out;
    };

    const zeroText = padStart
        ? '0'.padStart(finalIntLength, '0') +
        (decimals > 0 ? decimalSeparator + '0'.repeat(decimals) : '')
        : `0${decimals > 0 ? decimalSeparator + '0'.repeat(decimals) : ''}`;

    const initialText = initiallyStable ? formatValue(number) : zeroText;

    return (
        <span data-slot="counting-number" ref={localRef} {...props}>
            {initialText}
        </span>
    );
}

export { CountingNumber, type CountingNumberProps };
