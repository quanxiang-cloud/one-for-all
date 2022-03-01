import React, {
  CSSProperties,
  ForwardedRef,
  forwardRef,
  PropsWithChildren,
  Children,
  ReactNode,
  useRef,
  useImperativeHandle,
  useEffect,
} from "react";

interface ExposeType {
  submit: () => void;
}
interface Props {
  className?: string;
  style?: CSSProperties;
  name?: string;
  placeholder?: ReactNode;
  "data-node-key"?: string;
  onSubmit?: (val: any) => void;
  __exposeState?: (prop: ExposeType) => void;
}

function serializeForm(formElement: HTMLFormElement): Record<string, any> {
  const formData = new FormData(formElement);
  const ret: Record<string, any> = {};
  formData.forEach((value, name) => {
    if (ret[name]) {
      ret[name] = formData.getAll(name);
    } else {
      ret[name] = value;
    }
  });
  return ret;
}

function Form(
  { children, placeholder, onSubmit, __exposeState, ...rest }: PropsWithChildren<Props>,
  ref: ForwardedRef<HTMLFormElement>
) {
  const formRef = useRef<HTMLFormElement>(null);

  useImperativeHandle(ref, () => formRef.current as HTMLFormElement);
  useEffect(() => {
    __exposeState?.({
      submit: formSubmit
    });
  }, [])

  function formSubmit() {
    const data = serializeForm(formRef.current as HTMLFormElement);
    onSubmit?.(data);
  }

  return (
    <form {...rest} ref={formRef}>
      {children}
      {!Children.count(children) && placeholder}
    </form>
  );
}

export default forwardRef(Form);
