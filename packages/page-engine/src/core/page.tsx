import React, { useEffect } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { useDrop } from 'react-dnd';
import { defaults, flow, get, set } from 'lodash';
import { toJS } from 'mobx';

import { PageNode, PageSchema, useCtx } from '@ofa/page-engine';
import { NodeType } from '@ofa/render-engine';
import Elem from './elem';
import { mapRawProps } from '../utils/schema-adapter';

import styles from './index.m.scss';

interface Props {
  schema?: PageSchema;
  className?: string;
  onSave?: () => void;
  onPreview?: () => void;
}

// type NodeProp=ConstantProperty | SharedStateProperty<Serialized> | FunctionalProperty<Serialized>

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

    // todo: remove
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
  }, []);

  function transformType(schema: PageNode): string | React.ComponentType {
    const { type } = schema;
    if (type === NodeType.ReactComponentNode) {
      return registry.elementMap?.[schema.exportName]?.component || type;
    }
    if (type === NodeType.HTMLNode) {
      return schema.name || 'div';
    }
    return 'div';
  }

  function mergeStyle(s: Record<string, any>): Record<string, any> {
    if (s._style) {
      const curStyle = { ...get(s, 'props.style', {}), ...s._style };
      const defaultStyle = page.getElemDefaultStyle(s?.comp || '');
      const mergeStyle = defaults({}, curStyle, defaultStyle);
      // console.log('node final style, default type: ', mergeStyle, defaultStyle);
      set(s, 'props.style', page.formatStyles(mergeStyle));
    }
    return s;
  }

  function mergeProps(schema: PageNode): Record<string, any> {
    const elemConf = registry.getElemByType(schema.exportName) || {};
    const toProps = elemConf?.toProps || identity;
    const elemProps = defaults({}, mapRawProps(schema.props || {}), elemConf?.defaultConfig);
    return toProps(elemProps);
  }

  const schemaToProps = flow([
    // mergeStyle,
    mergeProps,
  ]);

  function renderNode(schema: PageNode, level = 0): JSX.Element | null | undefined {
    if (typeof schema !== 'object' || schema === null) {
      return schema;
    }

    // return React.createElement(transformType(schema.exportName), schemaToProps(schema), ...([].concat(schema.children as any))
    //   .map((child) => renderNode(child, level + 1)));

    // if (schema.type === NodeType.HTMLNode) {
    //   return React.createElement(schema?.name || 'div');
    // }

    return (
      <Elem node={schema}>
        {
          React.createElement(transformType(schema), schemaToProps(toJS(schema)), ...([].concat(schema.children as any))
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
