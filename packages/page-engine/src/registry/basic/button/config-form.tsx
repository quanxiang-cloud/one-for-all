import React from 'react';

interface Props {
  className?: string;
}

function ConfigForm(props: Props): JSX.Element {
  console.log(props);
  return (
    <div>
      button config
    </div>
  );
}

export default ConfigForm;
