import react from 'react';
import { RouteMatch } from '../types';

const RouteContext = react.createContext<RouteMatch[]>([]);

export default RouteContext;
