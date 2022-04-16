import { noop } from 'rxjs';
import React from 'react';

export const AllElementsCTX = React.createContext<Map<HTMLElement, boolean>>(new Map());
export const VisibleObserverCTX = React.createContext<IntersectionObserver>(new IntersectionObserver(noop));
