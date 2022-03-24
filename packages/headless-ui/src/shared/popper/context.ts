import React from 'react';

interface PopperContextProps {
  onPopupMouseDown: (a: any) => any;
}

const PopperContext = React.createContext<PopperContextProps | null>(null);

export default PopperContext;
