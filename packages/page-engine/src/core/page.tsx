import React, { useEffect } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { useDrop } from 'react-dnd';
import { defaults, get, set, flow, mapValues } from 'lodash';
import { toJS } from 'mobx';

import { useCtx, PageNode, PageSchema } from '@ofa/page-engine';
import { ConstantProperty } from '@ofa/render-engine';
import Elem from './elem';

import styles from './index.m.scss';

interface Props {
  schema?: PageSchema;
  className?: string;
  onSave?: () => void;
  onPreview?: () => void;
}

const identity = (x: any): any => x;

function Page({ schema, className }: Props): JSX.Element {
  const { page, registry, dataSource } = useCtx();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['elem', 'source_elem'],
    drop: (item: any, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      // console.log('dropped %o onto page: ', item);
      page.appendNode(item, null, { renewId: true });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }));

  useEffect(() => {
    // sync schema prop with store state
    schema && page.setSchema(schema);

    if (get(window, 'process.env.NODE_ENV') === 'development') {
      // on dev mode
      let storedSchema = localStorage.getItem('page_schema');
      try {
        storedSchema = JSON.parse(storedSchema as any);
      } catch (err) {
        storedSchema = null;
      }
      storedSchema && page.setSchema(storedSchema as any);
    }

    // init data source from page schema
    dataSource.sharedState = dataSource.mapSharedStateSpec();
    dataSource.apiState = dataSource.mapApiStateSpec();
  }, []);

  function transformType(type: string): string | React.ComponentType {
    return registry.elementMap?.[type]?.component || type;
  }

  function mergeStyle(s: Record<string, any>): Record<string, any> {
    if (s._style) {
      set(s, 'props.style', { ...get(s, 'props.style', {}), ...s._style });
    }
    return s;
  }

  function mergeProps(schema: PageNode): Record<string, any> {
    const elemConf = registry.getElemByType(schema.exportName);
    const toProps = elemConf.toProps || identity;
    const elemProps = defaults({}, mapValues(schema.props, (v: ConstantProperty)=> v.value), elemConf.defaultConfig);
    return toProps(elemProps);
  }

  const schemaToProps = flow([
    // mergeStyle,
    mergeProps,
  ]);

  function renderNode(schema: PageNode, level = 0): JSX.Element | null | undefined {
    // handle primitive type
    if (typeof schema !== 'object' || schema === null) {
      return schema;
    }

    // return React.createElement(transformType(schema.exportName), schemaToProps(schema), ...([].concat(schema.children as any))
    //   .map((child) => renderNode(child, level + 1)));

    return (
      <Elem node={schema}>
        {
          React.createElement(transformType(schema.exportName), schemaToProps(toJS(schema)), ...([].concat(schema.children as any))
            .map((child) => renderNode(child, level + 1)))
        }
      </Elem>
    );
  }

  return (
    <div className={cs(styles.page, className)} ref={drop}>
      {renderNode(page.schema.node)}
    </div>
  );
}

export default observer(Page);
