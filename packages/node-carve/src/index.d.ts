export = NodeCarvePropSpec;
// export as namespace NodeCarvePropSpec;

declare module NodeCarvePropSpec {
  type PropTypes = 'string' | 'number' | 'boolean' | 'object' | 'function';

  type BaseWillTypes =
    | 'Input'
    | 'Textarea'
    | 'NumberPicker'
    | 'Select'
    | 'Switch'
    | 'DatePicker'
    | 'TimePicker'
    | 'DateTimePicker'
    | 'Checkbox'
    | 'RadioGroup'
    | 'CheckboxGroup'
    | 'ClassName'
    | 'StyleSheet'

  /**
   * node carve support some enhance configuration component
   * and it follows Progressive enhancement principle
   * we will provide more and more enhance types
   */
  type EnhanceWillTypes = 'ImageUrl' | 'ImageUrlGroup' | 'FunctionBind' | 'VaribleBind';

  type ImageUrlProps = {}

  type FunctionBindProps = {
    args?: string,
    name?: string,
    notes?: string,
  }

  type VaribleBindProps = {
    type?: 'object' | 'array';
    text?: string;
  }

  type WillTypes = BaseWillTypes | EnhanceWillTypes;

  /**
   * node carve will render configuration components by spec 
   */
  export interface BasePropSpec {
    label: string;
    name: string;
    type: PropTypes;
    desc?: string;
    will?: WillTypes;
    willProps?: Record<string, unknown>;
    initialValue?: unknown;
  }

  /**
   * Each component should have PropsSpec
   * including all configable props's spec
   * so that node carve are avaliable to render props config panel
   * also spec should tell node carve the component is able to revice children or not
   * as well as tell node carve the component is over layer or not (like modal component) 
   */
  export interface PropsSpec {
    props: BasePropSpec[];
    isContainer?: boolean;
    isOverLayer?: boolean;
  }
}
