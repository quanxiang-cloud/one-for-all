import React, {
  CSSProperties,
  ForwardedRef,
  forwardRef,
  PropsWithChildren,
  FormEvent,
  Children,
} from "react";

interface Props {
  className?: string;
  style?: CSSProperties;
  name?: string;
  "data-node-key"?: string;
  onSubmit?: (val: any, e: FormEvent) => void;
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
  { children, onSubmit, ...rest }: PropsWithChildren<Props>,
  ref: ForwardedRef<HTMLFormElement>
) {
  function handleSumit(e: FormEvent): void {
    e.preventDefault();
    const data = serializeForm(e.nativeEvent.target as HTMLFormElement);
    onSubmit && onSubmit(data, e);
  }

  return (
    <form {...rest} onSubmit={handleSumit} ref={ref}>
      {children}
      {!Children.count(children) && <div
        style={{ minHeight: 60 }}
        className="bg-gray-100 border border-dashed flex items-center justify-center"
      >
        拖拽表单控件到这里
      </div>}
    </form>
  );
}

export default forwardRef(Form);
