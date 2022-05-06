import React from 'react';
import Cascader from './cascader';

export default function SingleCascader(props: SingleCascaderProps): JSX.Element {
  return <Cascader model='single' multiple={false} {...props} />;
}

export function TimelyCascader(props: SingleCascaderProps): JSX.Element {
  return <Cascader model='timely' multiple={false} {...props} />;
}

export function MultipleCascader(props: MultipleCascaderProps): JSX.Element {
  return <Cascader model='multiple' multiple={true} {...props} />;
}

export function UnlinkCascader(props: MultipleCascaderProps): JSX.Element {
  return <Cascader model='unlink' multiple={true} {...props} />;
}
