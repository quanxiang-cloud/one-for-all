interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
}

type NumberString = number | string;

type Modifier = 'primary' | 'secondary' | 'success' | 'danger';

interface ButtonProps extends BaseProps {
  modifier?: Modifier;
  disabled?: boolean;
  children: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  iconName?: string;
  type?: 'submit' | 'reset' | 'button' | undefined;
  iconSize?: NumberString;
  size?: 'normal' | 'compact';
  textClassName?: string;
  forbidden?: boolean;
  iconClassName?: string;
  onClick?: React.MouseEventHandler;
}

interface IconProps extends BaseProps {
  // if size is number, add unit with px, else use size string
  name: string;
  size?: NumberString;
}

// Grid
type FlexType = number | 'none' | 'auto' | string;

interface ColSize {
  flex?: FlexType;
  span?: NumberString;
  order?: NumberString;
  offset?: NumberString;
  push?: NumberString;
  pull?: NumberString;
}

interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  flex?: FlexType;
  span?: NumberString;
  order?: NumberString;
  offset?: NumberString;
  push?: NumberString;
  pull?: NumberString;
  prefixCls?: string;
}

declare enum RowAligns {
  top = 'top',
  middle = 'middle',
  bottom = 'bottom',
  stretch = 'stretch',
}

declare enum RowJustify {
  start = 'start',
  end = 'end',
  center = 'center',
  spaceAround = 'space-around',
  spaceBetween = 'space-between',
}

type Gutter = number;

interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  gutter?: Gutter | [Gutter, Gutter];
  align?: RowAligns;
  justify?: RowJustify;
  wrap?: boolean;
}

interface DividerProps extends BaseProps {
  direction?: 'horizontal' | 'vertical';
  size?: string;
  thickness?: string;
}

type InputEnterKeyHint = 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
// todo: add BaseInputProps
interface InputProps extends BaseProps {
  value?: string;
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean; // disabled > focused > error > normal
  maxLength?: number;
  minLength?: number;
  max?: NumberString;
  min?: NumberString;
  autoComplete?: string;
  // pattern?: string; // todo: what is this?
  type?: React.HTMLInputTypeAttribute;
  autoCapitalize?: string;
  autoCorrect?: string;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onEnterPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  enterKeyHint?: InputEnterKeyHint;
  onChange?: (val: string, e: React.ChangeEvent) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

type ValueType = string | number | boolean;
interface OptionType<T extends ValueType> {
  label: React.ReactNode;
  value: T;
  disabled?: boolean;
  onChange?: (val: T, e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface RadioProps<T extends string | number> extends BaseProps {
  label?: React.ReactNode;
  value: T;
  error?: boolean;
  disabled?: boolean;
  checked?: boolean;
  onChange?: (val: T, e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface RadioGroupProps<T extends ValueType> extends BaseProps {
  name?: string;
  value?: T;
  disabled?: boolean;
  options?: OptionType<T>[] | string[];
  onChange?: (value: T) => void;
}

type CheckboxProps<T extends ValueType> = Omit<RadioProps<T>, 'renderIcon'> & {
  indeterminate?: boolean;
};

type CheckboxGroupProps<T extends ValueType> = Omit<RadioGroupProps<T>, 'value' | 'onChange'> & {
  value?: T[];
  onChange?: (value: T[]) => void;
};

type SelectOption<T> = {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
};

type TriggerRenderFunc<T> = React.FC<{
  selectedOption?: SelectOption<T>;
  triggerActive: boolean;
}>;

interface ShowSearchType {
  filter?: (inputValue: string, path: CascaderOptionType[], names?: FilledFieldNamesType) => boolean;
  render?: (inputValue: string, path: CascaderOptionType[], names?: FilledFieldNamesType) => React.ReactNode;
  sort?: (
    a: CascaderOptionType[],
    b: CascaderOptionType[],
    inputValue: string,
    names?: FilledFieldNamesType,
  ) => number;
  matchInputWidth?: boolean;
  limit?: number | false;
}

// draft
interface SelectProps<T = unknown> extends BaseProps {
  id?: string;
  name?: string;
  value?: T | T[];
  optionClassName?: string;
  disabled?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  options: SelectOption<T>[];
  optionsDesc?: string;
  placeholder?: React.ReactNode;
  multiple?: boolean;
  defaultValue?: T | T[];
  triggerRender?: TriggerRenderFunc<T>;
  showSearch?: boolean | ShowSearchType;
  dropdownRender?: (menus: React.ReactNode) => React.ReactNode;
  onChange?: (value: T | T[]) => void;
  onOptionsVisibilityChange?: (visible: boolean) => void;
}

interface CascaderOptionType {
  value: NumberString;
  label: React.ReactNode;
  disabled?: boolean;
  isLeaf?: boolean;
  loading?: boolean;
  children?: CascaderOptionType[];
}

type PopupPlacement = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';

interface FilledFieldNamesType {
  value: NumberString;
  label: string;
  children: string;
}

type CascaderValue = NumberString[] | NumberString[][];

type CascaderExpandTrigger = 'click' | 'hover';

type SingleCascaderModelType = 'single' | 'timely';
type MultipleCascaderModelType = 'multiple' | 'unlink';
type CascaderModelType = SingleCascaderModelType | MultipleCascaderModelType;

interface BaseCascaderProps extends BaseProps {
  options: CascaderOptionType[];
  popupClassName?: string;
  popupPlacement?: PopupPlacement;
  placeholder?: string;
  disabled?: boolean;
  showSearch?: boolean | ShowSearchType;
  notFoundContent?: React.ReactNode;
  loadData?: (selectedOptions?: CascaderOptionType[]) => void;
  expandTrigger?: CascaderExpandTrigger;
  expandIcon?: React.ReactNode;
  onPopupVisibleChange?: (popupVisible: boolean) => void;
  suffixIcon?: React.ReactNode;
  dropdownRender?: (menus: React.ReactNode) => React.ReactNode;
}

interface SingleCascaderProps extends BaseCascaderProps {
  defaultValue?: NumberString;
  value?: NumberString;
  onChange?: (value: NumberString, selectedOptions?: CascaderOptionType[]) => void;
  selectedOptionRender?: (label: React.ReactNode[], selectedOptions: CascaderOptionType[]) => React.ReactNode;
}

interface MultipleCascaderProps extends BaseCascaderProps {
  defaultValue?: NumberString[];
  value?: NumberString[];
  onChange?: (value: NumberString[], selectedOptions?: CascaderOptionType[][]) => void;
  selectedOptionRender?: (label: React.ReactNode[][], selectedOptions: CascaderOptionType[][]) => React.ReactNode;
}

type SwitcherIcon = {
  open: string;
  close: string;
};

type TreeNode<T> = Readonly<{
  data: T;
  name: string;
  id: string;
  parentId: string | null;
  path: string;
  isLeaf: boolean;
  expanded: boolean;
  order: number;
  level: number;
  visible: boolean;
  positionY?: number;
  childrenStatus: 'resolved' | 'unknown' | 'loading';

  children?: TreeNode<T>[];
}>;

type CheckStatus = 'checked' | 'unchecked' | 'indeterminate';

type TNode<T> = {
  data: T;
  id: string;
  parentID: string | null;
  children?: string[];
  checkStatus: CheckStatus;
};

type NodeRenderProps<T> = {
  node: TreeNode<T>;
  // store: TreeStore<T> | SelectableTreeStore<T>;
};

type NodeRender<T> = React.FC<NodeRenderProps<T>>;

interface TreeSelectProps<T> {
  // store: TreeStore<T>;
  // NodeRender: React.FC<{ node: TreeNode<T>; store: TreeStore<T> | SelectableTreeStore<T> }>;
  // RootNodeRender: React.FC<{ node: TreeNode<T>; store: TreeStore<T> | SelectableTreeStore<T> }>;
  nodeDraggable?: (node: TreeNode<T>) => boolean;
  canDropOn?: (node: TreeNode<T>) => boolean;
  onDragOver?: (node: TreeNode<T>, draggingNode: TreeNode<T>) => boolean;
  onDrop?: (node: TreeNode<T>, draggingNode: TreeNode<T>) => Promise<boolean>;
  onSelect?: (data: T) => void;
  className?: string;
  itemClassName?: string;
  switcherIcon?: SwitcherIcon;
}

interface TreeNodeProps<T> {
  node: TreeNode<T>;
  // store: TreeStore<T>;
  draggingNode: TreeNode<T> | null;
  currentFocusedNodeID: string;
  renamingNodeID: string;
  actualFocusedNodeID: string;
  upwardFocusedStyleToParent: boolean;
  // NodeRender: React.FC<{ node: TreeNode<T>; store: TreeStore<T> }>;
  onClick: (node: TreeNode<T>) => void;
  onSwitcherClick: (node: TreeNode<T>) => void;
  draggable?: (node: TreeNode<T>) => boolean;
  canDropOn?: (node: TreeNode<T>) => boolean;
  onDragOver?: (node: TreeNode<T>, draggingNode: TreeNode<T>) => boolean;
  onDrop: (node: TreeNode<T>) => void;
  setDraggingNode?: (node: TreeNode<T> | null) => void;
  className?: string;
  switcherIcon?: SwitcherIcon;
}

// interface DatePickerProps extends SelectProps {
//   // todo
// }

// todo: date time dateTime range

type PullRefreshStatus = 'normal' | 'loading' | 'loosing' | 'pulling' | 'success';

type StatusTextTypeRender = ({ distance }: { distance: number }) => React.ReactNode;

type StatusTextType = React.ReactNode | StatusTextTypeRender;

interface PullRefreshProps extends BaseProps {
  disabled?: boolean;
  successText?: StatusTextType;
  pullingText?: StatusTextType;
  loosingText?: StatusTextType;
  loadingText?: StatusTextType;
  successDuration?: NumberString;
  animationDuration?: NumberString;
  headHeight?: NumberString;
  pullDistance?: NumberString;
  onRefresh: () => Promise<unknown> | void;
}

type ListDirection = 'up' | 'down';

interface ListProps extends BaseProps {
  error?: boolean;
  loading?: boolean;
  finished?: boolean;
  errorText?: React.ReactNode;
  loadingText?: React.ReactNode;
  finishedText?: React.ReactNode;
  offset?: NumberString;
  direction?: ListDirection;
  immediateCheck?: boolean;
  autoCheck?: boolean;
  onLoad?: () => Promise<unknown> | void;
}

type ListInstance = {
  check: () => void;
  state: {
    loading: boolean;
    error: boolean;
  };
};

interface NavBarProps extends BaseProps {
  title?: React.ReactNode;
  fixed?: boolean;
  zIndex?: NumberString;
  left?: React.ReactNode;
  right?: React.ReactNode;
  leftArrow?: boolean;
  safeAreaInsetTop?: boolean;
  placeholder?: boolean;
  onClickLeft?: (e: React.MouseEvent) => void;
  onClickRight?: (e: React.MouseEvent) => void;
}

type SwitchProps = Partial<RadioProps<boolean>> & {
  onText?: string;
  offText?: string;
  onChange?: (value: boolean) => void;
};

interface FileProps {
  uid: string;
  type: string;
  name: string;
  size: number;
}

interface FilePartBlob {
  chunkBlob: Blob;
  partNumber: number;
}

interface FileTask extends FileProps {
  uploadID?: string;
  progress?: number;
  state?: 'uploading' | 'processing' | 'success' | 'failed';
  blob?: File;
  md5?: string;
  isExist?: boolean;
  uploadUrl?: string;
  md5Worker?: Worker | null;
  fileChunks?: FilePartBlob[] | null;
}

interface UploadProps extends BaseProps {
  accept?: string[];
  multiple?: boolean;
  disabled?: boolean;
  maxFileSize?: number;
  maxUploadLength?: number;
  fileData?: FileProps[];
  onDelete?: (file: FileProps) => void;
  onSuccess?: (file: FileProps) => void;
  onError?: (err: Error, file: FileProps) => void;
  onAbort?: (file: FileProps | FileProps[]) => void;
  iconName?: string;
  uploaderDescription?: React.ReactNode;
}

interface FileListProps extends BaseProps {
  files: FileTask[];
  imgOnly?: boolean;
  canDownload?: boolean;
  showFileName?: boolean;
  deleteFileItem?: (file: FileTask) => void;
  onRetryFileUpload?: (file: FileTask) => void;
}

type WidthMap = Record<any, NumberString>;

type Column<T> = import('react-table').Column<T>;

type FixedColumn<T extends Record<string, unknown>> = Column<T> & {
  fixed: boolean;
  width: number;
};
type UnionColumn<T extends Record<string, unknown>> =
  | FixedColumn<T>
  | (Column<T> & { fixed?: boolean; sortable?: boolean });
interface TableProps<T extends Record<string, any>> {
  columns: UnionColumn<T>[];
  data: Array<T>;
  compact?: boolean;
  emptyTips?: React.ReactNode;
  initialSelectedRowKeys?: string[];
  loading?: boolean;
  rowKey: string;
  showCheckbox?: boolean;
  onRowClick?: (rowID: string, selectedRow: T) => void;
  onSelectChange?: (selectedKeys: string[], selectedRows: T[]) => void;
  className?: string;
  isCompact?: boolean;
  style?: React.CSSProperties;
  canSetColumnWidth?: boolean;
  canAcrossPageChoose?: boolean;
  initWidthMap?: WidthMap;
  widthMapChange?: (widthMap: WidthMap) => void;
}

interface PaginationProps extends BaseProps {
  current: number;
  total: number;
  pageSize?: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  showQuickJumper?: boolean;
  showLessItems?: boolean;
  renderTotalTip?: (total: number, range?: [number, number]) => React.ReactNode;
  onChange?: (current: number, pageSize: number) => void;
}

interface TabItemProps<T extends React.Key> extends BaseProps {
  id: T;
  name: string | React.ReactNode;
  state?: 'error' | 'warning';
  disabled?: boolean;
}

type TabNavProps<T extends React.Key> = BaseProps & {
  navs: TabItemProps<T>[];
  currentKey: string | number;
  navsClassName?: string;
  onClick?: (item: TabItemProps<T>) => void;
};
interface TabsProps<T extends React.Key> extends BaseProps {
  items: TabItemProps<T>[];
  direction: 'vertical' | 'horizon';
  maxHeight: NumberString;
  children?: React.ReactNode;
  navsClassName?: string;
  contentClassName?: string;
  currentKey?: string | number;
  onChange?: (key: T) => void;
}

// interface TagsProps
interface TagProps<T extends React.Key> extends BaseProps {
  value: T;
  label?: React.ReactNode;
  onDelete?: (value: T, e: React.MouseEvent) => void;
  deleteIconSize?: number;
  modifier?: Modifier;
  disabled?: boolean;
}

// popover
type ShowAction = 'click' | 'focus' | 'mouseEnter' | 'contextMenu';
type HideAction = 'click' | 'blur' | 'mouseLeave' | 'contextMenu';
type Action = 'click' | 'hover' | 'contextMenu' | 'focus';

type PopperProps = {
  popup?: React.ReactNode;
  popupVisible?: boolean;
  // trigger
  action?: Action | Action[];
  showAction?: ShowAction[];
  hideAction?: HideAction[];
  enableArrow?: boolean;
  placement?: import('@popperjs/core').Placement;
  modifiers?: Array<Partial<import('@popperjs/core').Modifier<unknown, unknown>>>;
  // theme?: Theme;
  className?: string;
  popupClassName?: string;
  popupStyle?: React.CSSProperties;
  zIndex?: number;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  focusDelay?: number;
  blurDelay?: number;
  forceRender?: boolean;
  autoDestroy?: boolean;
  children: React.ReactElement;
  onVisibilityChange?: (visible: boolean) => void;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onMouseDown?: React.MouseEventHandler<HTMLElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  onFocus?: React.FocusEventHandler<HTMLElement>;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  onContextMenu?: React.MouseEventHandler<HTMLElement>;
  onMouseMove?: React.MouseEventHandler<HTMLElement>;
  onTouchStart?: React.TouchEventHandler<HTMLElement>;
} & BaseProps;

interface LoadingProps extends BaseProps {
  desc?: React.ReactNode;
  iconSize?: NumberString;
  vertical?: boolean;
  children?: React.ReactNode;
}

interface ToastProps extends BaseProps {
  content: string;
  duration?: number;
  icon?: React.ReactNode;
  onClose?: () => void;
  modifier: Modifier;
}

// todo: Notifycation

interface ModalProps extends BaseProps {
  title?: React.ReactNode;
  fullscreen?: boolean;
  width?: NumberString;
  height?: NumberString;
  clickOnClose?: boolean;
  onClose?: () => void;
  footerBtns?: ButtonProps[];
  children: React.ReactNode;
}

interface DrawerProps extends Omit<ModalProps, 'height'> {
  position?: 'top' | 'right' | 'bottom' | 'left';
}

type SegmentRenderType = (segment: Segment, active?: boolean) => React.ReactNode;
interface Segment {
  key: string;
  text: string;
  path?: string;
  render?: SegmentRenderType;
}
interface BreadcrumbProps extends BaseProps {
  segments: Array<Segment>;
  separator?: React.ReactNode;
  activeClass?: string;
  segmentRender?: SegmentRenderType;
  segmentClass?: string;
  segmentStyle?: React.CSSProperties;
}
