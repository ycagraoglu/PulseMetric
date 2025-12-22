import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import React, { forwardRef } from 'react';

// Simplified shim for next/link wrapping react-router-dom Link
const Link = forwardRef<HTMLAnchorElement, RouterLinkProps & { prefetch?: boolean }>(({ prefetch, ...props }, ref) => {
    return <RouterLink ref={ref} {...props} />;
});

Link.displayName = 'Link';

export default Link;
