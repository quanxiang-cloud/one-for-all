element identifier spec:

```
[html|component]:name:version

basic/button
basic/table
basic/tableCell
@advancedComponents/chart
```

```
1. resolve value
  - loading
  - error?
  - static value
  - api response
  - states from other components
2. handle callback
  - mutate state
  - call api

api response:
  - api id
  - api instance id
  - responseConvertor

{
  api: string;
  instanceID: string;
  convertor: (response: any) => Record<string, unknown>;
}

{
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => Promise<boolean>;
}
```
