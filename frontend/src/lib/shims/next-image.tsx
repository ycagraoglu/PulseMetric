import React, { forwardRef } from 'react';

// Simplified shim for next/image
// Assuming basic usage with src, alt, width, height, className
const Image = forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }>(({ priority, ...props }, ref) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img ref={ref} {...props} />;
});

Image.displayName = 'Image';

export default Image;
