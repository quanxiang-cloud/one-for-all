import react from 'react';

const RouteContext = react.createContext<{ path: string, element: unknown}[]>([]);

export default RouteContext;
