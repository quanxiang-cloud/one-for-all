import React from 'react';
import { render } from 'react-dom';

import { Designer } from '@one-for-all/page-engine';

render(<Designer onSave={console.log} />, document.getElementById('app'));
