import React, { useEffect } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { useDrop } from 'react-dnd';
import { defaults, get, set, flow } from 'lodash';
import { toJS } from 'mobx';

import { useCtx } from '@ofa/page-engine';
import Elem from './elem';

import styles from './index.m.scss';

interface Props {
  schema?: PageEngine.Node;
  className?: string;
  onSave?: () => void;
  onPreview?: () => void;
  children?: React.ReactNode;
}

const identity = (x: any): any => x;

function Page({ schema, children, className }: Props): JSX.Element {
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
    } else {
      // todo: query page schema from backend, delegate to render engine
    }

    // init data source from page schema
    dataSource.sharedState = page.schema._shared || {};
  }, []);

  function transformType(type: string): string | ReactComp {
    if (type.startsWith('elem.')) {
      return registry.elementMap[type.slice('elem.'.length)].component;
    }
    if (type === 'page') {
      return registry.elementMap.page.component;
    }
    return type;
  }

  function mergeStyle(s: Record<string, any>): Record<string, any> {
    if (s._style) {
      const curStyle = { ...get(s, 'props.style', {}), ...s._style };
      const defaultStyle = page.getElemDefaultStyle(s?.comp || '');
      const mergeStyle = defaults({}, curStyle, defaultStyle);
      console.log('node final style, default type: ', mergeStyle, defaultStyle);
      set(s, 'props.style', page.formatStyles(mergeStyle));
    }
    return s;
  }

  function mergeProps(schema: Record<string, any>): Record<string, any> {
    const elemConf = registry.getElemByType(schema.comp);
    const toProps = elemConf.toProps || identity;
    const elemProps = defaults(schema.props, elemConf.defaultConfig);
    return toProps(elemProps);
  }

  function renderNode(schema: PageEngine.Node, level = 0): JSX.Element | null | undefined {
    // handle primitive type
    if (typeof schema !== 'object' || schema === null) {
      return schema;
    }

    const schemaToProps = flow([
      mergeStyle,
      mergeProps,
    ]);

    return (
      <Elem node={schema}>
        {React.createElement(transformType(schema.comp), schemaToProps(toJS(schema)), ...([].concat(schema.children as any))
          .map((child) => renderNode(child, level + 1)))}
      </Elem>
    );
  }

  return (
    <div className={cs(styles.page, { [styles.isOver]: isOver }, className)} ref={drop}>
      {renderNode(page.schema)}
      {children}
    </div>
  );
}

export default observer(Page);
