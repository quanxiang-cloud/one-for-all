import React from 'react';

// eslint-disable-next-line
function noop() {}

export const AllElementsCTX = React.createContext<Map<HTMLElement, boolean>>(new Map());
export const VisibleObserverCTX = React.createContext<IntersectionObserver>(new IntersectionObserver(noop));
