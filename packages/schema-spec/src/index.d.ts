export = SchemaSpec;
export as namespace SchemaSpec;

declare namespace SchemaSpec {
  /**
   * BaseFunctionSpec define the fundamental shape of `function` in Schema,
   * all function spec **MUST** extends this type.
   */
  interface BaseFunctionSpec {
    type: string;
    args: string;
    body: string;
  }

  /**
   * Convertor is used to transform the state, such as API Result, before passing it to node.
   *
   * Convertor will NOT be called if the state is nullish, for example API request failed or the result is `null`.
   */
  interface StateConvertorFuncSpec extends BaseFunctionSpec {
    type: 'state_convertor_func_spec';
    args: 'state';
  }

  /**
   * StateConvertExpression is a simple version of StateConvertorFunc,
   * you can use JavaScript [dot notation or the bracket notation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors)
   * to get the value needed.
   *
   * In runtime, StateConvertExpression will be converted to a function with `return` statement.
   */
  interface StateConvertExpression {
    type: 'state_convert_expression';
    // same as JavaScript expression, with a predefined variable called `state`
    // state.foo
    // state.offset / (state.limit + state.offset)
    // state.list.map((item) => item.name))
    // state.list.map((item) => `名称：${item.name}`))
    // state.foo?.bar?.baz || 'someValue'
    expression: string;
  }

  interface LifecycleHookFuncSpec extends BaseFunctionSpec {
    type: 'lifecycle_hook_func_spec';
    args: '';
  }

  /**
   * toProps function should return Record<string, unknown>;
   */
  interface ToPropsFuncSpec extends BaseFunctionSpec {
    type: 'to_props_function_spec';
    args: 'state';
  }

  /**
   * LifecycleHooks provide a opportunity to executive some side-effects when node
   * `didMount` and `willUnmount`.
   */
  type LifecycleHooks = Partial<{
    didMount: LifecycleHookFuncSpec;
    willUnmount: LifecycleHookFuncSpec;
  }>;

  /**
   * It is a best practice to always define a fallback for API results,
   * no matter before the API response returned or after an unexpected error has occurred.
   *
   * Fallback should NOT be a nullish value, and will be passed to node in the following situations:
   * - the initial state
   * - API request failed or some business error returned
   * - convertor throw an error when calling it with API result
   * - convertor return `null` or `undefined`
   *
   * The value of fallback will not always be the same.
   * It will be assign a new value when convertor returned a not-nullish value.
   * If there is no convertor defined, fallback will be assigned to the latest not-nullish api result.
   *
   * Be Attention. fallback is **NOT** the fallback of API result, it is the fallback of a property passed to node.
   */
  type Fallback = unknown;

  type NodePropType =
    | 'constant_property'
    | 'api_result_property'
    | 'api_loading_property'
    | 'shared_state_property'
    | 'node_state_property'
    | 'functional_property'
    | 'render_property'
    | 'computed_property'
    /**
     * @deprecated This type has been deprecated, please use FunctionalProperty instead
     */
    | 'api_invoke_property'
    /**
     * @deprecated This type has been deprecated, please use FunctionalProperty instead
     */
    | 'shared_state_mutation_property';

  type NodeProperty =
    | ConstantProperty
    | APIResultProperty
    | APILoadingProperty
    | SharedStateProperty
    | NodeStateProperty
    | FunctionalProperty
    | SharedStateMutationProperty
    | APIInvokeProperty
    | RenderProperty
    | ComputedProperty;

  type PlainState = APIResultProperty | SharedStateProperty | NodeStateProperty | ConstantProperty;

  interface BaseNodeProperty {
    type: NodePropType;
  }

  /**
   * ConstantProperty define a constant value passed to node.
   */
  interface ConstantProperty extends BaseNodeProperty {
    type: 'constant_property';
    value: unknown;
  }

  /**
   * APIResultProperty define a value converted from API response.
   */
  interface APIResultProperty extends BaseNodeProperty {
    type: 'api_result_property';
    stateID: string;
    convertor?: StateConvertExpression | StateConvertorFuncSpec;
    fallback: Fallback;
  }

  /**
   * APILoadingProperty define the loading status of a API request.
   */
  interface APILoadingProperty extends BaseNodeProperty {
    type: 'api_loading_property';
    stateID: string;
  }

  interface SharedStateProperty extends BaseNodeProperty {
    type: 'shared_state_property';
    stateID: string;
    fallback: Fallback;
    convertor?: StateConvertExpression | StateConvertorFuncSpec;
  }

  interface NodeStateProperty extends BaseNodeProperty {
    type: 'node_state_property';
    // starts with ROOT/xx
    // eg: ROOT/node_id_1/node_id_2/5/node_id_3
    nodePath: string;
    fallback: Fallback;
    convertor?: StateConvertExpression | StateConvertorFuncSpec;
  }

  interface FunctionalProperty extends BaseNodeProperty {
    type: 'functional_property';
    func: BaseFunctionSpec;
  }

  /**
   * @deprecated This type has been deprecated, please use FunctionalProperty instead
   */
  interface SharedStateMutationProperty extends BaseNodeProperty {
    type: 'shared_state_mutation_property';
    stateID: string;
    convertor?: BaseFunctionSpec;
  }

  /**
   * @deprecated This type has been deprecated, please use FunctionalProperty instead
   */
  interface APIInvokeProperty extends BaseNodeProperty {
    type: 'api_invoke_property';
    stateID: string;
    // the required return type is too complex
    paramsBuilder?: ParamsBuilderFuncSpec;
    callback?: APIFetchCallback;
  }

  interface APIFetchCallback extends BaseFunctionSpec {
    type: 'api_fetch_callback';
    args: '{ result, error }';
  }

  interface ParamsBuilderFuncSpec extends BaseFunctionSpec {
    type: 'param_builder_func_spec';
  }

  // It is common to passing a component to another component,
  // or defined a function which may take some argument and return a component.
  // RenderProperty is the spec for this kind of property.
  //
  // <ParentComponent
  //   render={<SomeComponent />}
  // />
  // <ParentComponent
  //   render={(someData): JSX.Element => (<SomeComponent data={someData} />)}
  // />
  // <ParentComponent
  //   render={(someData, someIgnoredValue): JSX.Element => (<SomeComponent data={someData} otherProp={otherProp} />)}
  // />
  interface RenderProperty extends BaseNodeProperty {
    type: 'render_property';
    node: SchemaNode;
    adapter: BaseFunctionSpec & {
      type: 'render_property_function_spec';
    };
  }

  interface ComputedDependency {
    type: 'api_state' | 'shared_state' | 'node_state';
    depID: string;
  }

  interface ComputedProperty {
    type: 'computed_property';
    deps: Array<ComputedDependency>;
    convertor: StateConvertExpression | StateConvertorFuncSpec;
    fallback: unknown;
  }

  type NodeProperties = Record<string, NodeProperty>;

  type ShouldRenderCondition =
    | APIResultProperty
    | NodeStateProperty
    | SharedStateProperty
    | ComputedProperty
    | (APILoadingProperty & { revert?: boolean });

  type NodeType =
    | 'html-element'
    | 'react-component'
    | 'loop-container'
    | 'composed-node'
    | 'ref-node'
    | 'jsx-node'
    | 'route-node';

  interface BaseNode {
    id: string | number;
    label?: string;
    type: NodeType;
    props?: NodeProperties;
    shouldRender?: ShouldRenderCondition;
    lifecycleHooks?: LifecycleHooks;
  }

  type SchemaNode = HTMLNode | ReactComponentNode | LoopContainerNode | RefNode | JSXNode | RouteNode;

  interface HTMLNode extends BaseNode {
    type: 'html-element';
    name: string;
    children?: Array<SchemaNode>;
  }

  interface ReactComponentNode extends BaseNode {
    type: 'react-component';
    packageName: string;
    packageVersion: string;
    exportName: 'default' | string;
    supportStateExposure?: boolean;
    // not recommend, should avoid
    children?: Array<SchemaNode>;
  }

  interface RouteNode extends BaseNode {
    type: 'route-node';
    path: string;
    node: SchemaNode;
    exactly?: boolean;
  }
  
  interface IndividualLoopContainer extends BaseNode {
    type: 'loop-container';
    loopKey: string;
    iterableState: PlainState;
    node: SchemaNode;
    toProps: ToPropsFuncSpec;
  }

  interface ComposedNodeLoopContainer extends BaseNode {
    type: 'loop-container';
    loopKey: string;
    iterableState: PlainState;
    node: ComposedNode;
  }

  type LoopContainerNode = IndividualLoopContainer | ComposedNodeLoopContainer;

  type ComposedNodeChild = SchemaNode & {
    toProps: ToPropsFuncSpec;
  };

  type ComposeOutLayer = Omit<HTMLNode, 'children'> | Omit<ReactComponentNode, 'children'>;

  interface ComposedNode extends BaseNode {
    type: 'composed-node';
    outLayer?: ComposeOutLayer;
    /**
     * @deprecated use nodes instead
     */
    children: Array<ComposedNodeChild>;
    nodes: Array<ComposedNodeChild>;
  }

  interface RefNode extends BaseNode {
    type: 'ref-node';
    schemaID: string;
    fallback?: SchemaNode;
    // RefNode will inherit parent context,
    // which means use states if not found in current context.
    // set `orphan` to `true` to disable inheritance
    orphan?: boolean;
  }

  interface JSXNode extends BaseNode {
    type: 'jsx-node';
    jsx: string;
  }

  // APIState define the type of API results from view perspective.
  // This type is inspired by [react-query](https://react-query.tanstack.com/).
  interface APIState {
    loading: boolean;
    result?: unknown;
    error?: Error;
  }

  // map of stateID and apiID
  // todo should also store builder info
  type APIStatesSpec = Record<string, { apiID: string; [key: string]: unknown }>;

  /**
   * InitializerFuncSpec is used to define a function which return value will assigned to some state
   */
  interface InitializerFuncSpec extends BaseFunctionSpec {
    type: 'initializer_func_spec';
    args: '';
  }

  interface SharedState {
    initial: unknown;
    // default to true
    writeable?: boolean;
    initializer?: InitializerFuncSpec;
    [key: string]: unknown;
  }

  type SharedStatesSpec = Record<string, SharedState>;

  interface Schema {
    node: SchemaNode;
    apiStateSpec?: APIStatesSpec;
    sharedStatesSpec?: SharedStatesSpec;
  }
}
