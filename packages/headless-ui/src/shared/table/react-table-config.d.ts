import {
  UseColumnOrderInstanceProps,
  UseColumnOrderState,
  UseExpandedInstanceProps,
  UseExpandedRowProps,
  UseExpandedState,
  UseFiltersInstanceProps,
  UseFiltersState,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersState,
  UseGroupByInstanceProps,
  UseGroupByRowProps,
  UseGroupByState,
  UsePaginationInstanceProps,
  UsePaginationState,
  UseResizeColumnsState,
  UseRowSelectInstanceProps,
  UseRowSelectRowProps,
  UseRowSelectState,
  UseSortByInstanceProps,
  UseSortByState,
} from 'react-table';

declare module 'react-table' {
  export interface TableInstance<D extends object = {}>
    extends UseColumnOrderInstanceProps<D>,
      UseExpandedInstanceProps<D>,
      UseFiltersInstanceProps<D>,
      UseGlobalFiltersInstanceProps<D>,
      UseGroupByInstanceProps<D>,
      UsePaginationInstanceProps<D>,
      UseRowSelectInstanceProps<D>,
      UseSortByInstanceProps<D> {}

  export interface TableState<D extends object = {}>
    extends UseColumnOrderState<D>,
      UseExpandedState<D>,
      UseFiltersState<D>,
      UseGlobalFiltersState<D>,
      UseGroupByState<D>,
      UsePaginationState<D>,
      UseResizeColumnsState<D>,
      UseRowSelectState<D>,
      UseSortByState<D> {
    rowCount: number;
  }

  export interface Row<D extends object = {}>
    extends UseExpandedRowProps<D>,
      UseGroupByRowProps<D>,
      UseRowSelectRowProps<D> {}
}
