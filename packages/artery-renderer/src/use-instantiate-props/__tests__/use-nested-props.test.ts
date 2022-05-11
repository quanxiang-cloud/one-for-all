import { renderHook } from '@testing-library/react-hooks/pure';
import ArterySpec from '@one-for-all/artery';

import useNestedProps from '../use-nested-props';

import dummyCTX from '../../boot-up/__tests__/fixtures/dummy-ctx';
import { ArteryNode } from '../../types';
import deserialize from '../../boot-up/deserialize';

test('useNestedProps_resolve_expected_value', () => {
  const node: ArterySpec.Node = {
    id: 'whatever',
    type: 'html-element',
    name: 'whatever',
    props: {
      normalProp: {
        type: 'constant_property',
        value: 100,
      },
      nestProps: {
        type: 'nested_property',
        value: {
          constant: {
            type: 'constant_property',
            value: 'this is a constant_property',
          },
          func: {
            type: 'functional_property',
            func: {
              type: '',
              args: '',
              body: '',
            },
          },
        },
      },
    },
  };
  const arteryNode: ArteryNode = deserialize(node, undefined) as ArteryNode;

  const { result, unmount } = renderHook(() => useNestedProps(arteryNode, dummyCTX));

  const { nestProps } = result.current;
  // @ts-ignore
  expect(nestProps.constant).toEqual('this is a constant_property');
  // @ts-ignore
  expect(nestProps.func).toBeInstanceOf(Function);

  unmount();
});

test('useNestedPropsArrays_resolve_expected_value', () => {
  const node: ArterySpec.Node = {
    id: 'whatever',
    type: 'html-element',
    name: 'whatever',
    props: {
      normalProp: {
        type: 'constant_property',
        value: 100,
      },
      nestProps: {
        type: 'nested_property',
        value: [
          {
            constant: {
              type: 'constant_property',
              value: 'this is a constant_property',
            },
            func: {
              type: 'functional_property',
              func: {
                type: '',
                args: '',
                body: '',
              },
            },
          },
          {
            constant: {
              type: 'constant_property',
              value: 'this is a constant_property2',
            },
            func: {
              type: 'functional_property',
              func: {
                type: '',
                args: '',
                body: '',
              },
            },
          },
        ],
      },
    },
  };
  const arteryNode: ArteryNode = deserialize(node, undefined) as ArteryNode;

  const { result, unmount } = renderHook(() => useNestedProps(arteryNode, dummyCTX));

  const { nestProps } = result.current;
  // @ts-ignore
  expect(nestProps[0].constant).toEqual('this is a constant_property');
  // @ts-ignore
  expect(nestProps[0].func).toBeInstanceOf(Function);

  // @ts-ignore
  expect(nestProps[1].constant).toEqual('this is a constant_property2');
  // @ts-ignore
  expect(nestProps[1].func).toBeInstanceOf(Function);

  unmount();
});

test('useNestedProps_resolve_expected_value_deeper', () => {
  const node: ArterySpec.Node = {
    id: 'whatever',
    type: 'html-element',
    name: 'whatever',
    props: {
      normalProp: {
        type: 'constant_property',
        value: 100,
      },
      nestProps: {
        type: 'nested_property',
        value: {
          constant: {
            type: 'constant_property',
            value: 'this is a constant_property',
          },
          func: {
            type: 'functional_property',
            func: {
              type: '',
              args: '',
              body: '',
            },
          },
          nodeNestPropsDeeper: {
            type: 'nested_property',
            value: {
              constantDeeper: {
                type: 'constant_property',
                value: 'this is a deeper constant_property',
              },
              funcDeeper: {
                type: 'functional_property',
                func: {
                  type: '',
                  args: '',
                  body: '',
                },
              },
            },
          },
        },
      },
    },
  };
  const arteryNode: ArteryNode = deserialize(node, undefined) as ArteryNode;

  const { result, unmount } = renderHook(() => useNestedProps(arteryNode, dummyCTX));

  const { nestProps } = result.current;
  // @ts-ignore
  expect(nestProps.constant).toEqual('this is a constant_property');
  // @ts-ignore
  expect(nestProps.func).toBeInstanceOf(Function);
  // @ts-ignore
  expect(nestProps.nodeNestPropsDeeper.constantDeeper).toEqual('this is a deeper constant_property');
  // @ts-ignore
  expect(nestProps.nodeNestPropsDeeper.funcDeeper).toBeInstanceOf(Function);

  unmount();
});

test('useNestedPropsArrays_resolve_expected_value_deeper', () => {
  const node: ArterySpec.Node = {
    id: 'whatever',
    type: 'html-element',
    name: 'whatever',
    props: {
      nestProps: {
        type: 'nested_property',
        value: [
          {
            nodeNestPropsDeeper: {
              type: 'nested_property',
              value: {
                constantDeeper: {
                  type: 'constant_property',
                  value: 'this is a deeper constant_property',
                },
                funcDeeper: {
                  type: 'functional_property',
                  func: {
                    type: '',
                    args: '',
                    body: '',
                  },
                },
              },
            },
          },
          {
            nodeNestPropsDeeperArray: {
              type: 'nested_property',
              value: [
                {
                  constantDeeper: {
                    type: 'constant_property',
                    value: 'this is a deeper constant_property1 in array',
                  },
                  funcDeeper: {
                    type: 'functional_property',
                    func: {
                      type: '',
                      args: '',
                      body: '',
                    },
                  },
                },
                {
                  constantDeeper: {
                    type: 'constant_property',
                    value: 'this is a deeper constant_property2 in array',
                  },
                  funcDeeper: {
                    type: 'functional_property',
                    func: {
                      type: '',
                      args: '',
                      body: '',
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  };
  const arteryNode: ArteryNode = deserialize(node, undefined) as ArteryNode;

  const { result, unmount } = renderHook(() => useNestedProps(arteryNode, dummyCTX));

  const { nestProps } = result.current;
  // @ts-ignore
  expect(nestProps[0].nodeNestPropsDeeper.constantDeeper).toEqual('this is a deeper constant_property');
  // @ts-ignore
  expect(nestProps[0].nodeNestPropsDeeper.funcDeeper).toBeInstanceOf(Function);
  // @ts-ignore
  expect(nestProps[1].nodeNestPropsDeeperArray[0].constantDeeper).toEqual('this is a deeper constant_property1 in array');
  // @ts-ignore
  expect(nestProps[1].nodeNestPropsDeeperArray[0].funcDeeper).toBeInstanceOf(Function);
  // @ts-ignore
  expect(nestProps[1].nodeNestPropsDeeperArray[1].constantDeeper).toEqual('this is a deeper constant_property2 in array');
  // @ts-ignore
  expect(nestProps[1].nodeNestPropsDeeperArray[1].funcDeeper).toBeInstanceOf(Function);

  unmount();
});
