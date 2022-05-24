import React from 'react';
import { BehaviorSubject } from 'rxjs';

const MonitoredElementsContext = React.createContext<BehaviorSubject<Set<HTMLElement>>>(new BehaviorSubject<Set<HTMLElement>>(new Set<HTMLElement>()));

export default MonitoredElementsContext;
