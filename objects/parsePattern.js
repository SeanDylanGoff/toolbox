import { normalizePath } from './normalizePath.js';

export const parsePattern = pattern =>
    normalizePath(pattern).map(segment => {
        if (segment.startsWith(':')) {
            const match = segment.match(/:(.+?)(?:\((.+)\))?$/);
            return {
                key: match[1],
                wildcard: !match[2],
                segments: match[2]?.split('|'),
            };
        }
        return { segments: [segment] };
    });
