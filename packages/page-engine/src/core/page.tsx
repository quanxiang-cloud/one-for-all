import React, { useEffect, useCallback } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { useDrop } from 'react-dnd';
import { defaults, flow, get, set } from 'lodash';
import { toJS } from 'mobx';

import { Icon } from '@ofa/ui';
import { PageNode, PageSchema, useCtx } from '@ofa/page-engine';
import { NodeType } from '@ofa/render-engine';
import Elem from './elem';
import { mapRawProps } from '../utils/schema-adapter';
import { isDev } from '../utils';

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
  const handleKeyPress = useCallback((ev)=> {
    if (ev.code === 'Backspace') {
      // delete elem
      if (page.activeElem?.exportName !== 'page') {
        page.removeNode(page.activeElemId);
      }
    }
  }, []);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['elem', 'source_elem'],
    drop: (item: any, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      console.log('dropped %o onto page: ', item);
      page.appendNode(item, null, { renewId: true });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }));

  // useEffect(()=> {
  //   // bind events
  //   document.addEventListener('keyup', handleKeyPress);
  //
  //   return document.addEventListener('keyup', handleKeyPress);
  // }, []);

  useEffect(() => {
    // todo: remove
    if (isDev()) {
      // on dev mode
      let storedSchema = localStorage.getItem('page_schema');
      try {
        storedSchema = JSON.parse(storedSchema as any);
      } catch (err) {
        storedSchema = null;
      }
      storedSchema && page.setSchema(storedSchema as any);
    }

    // sync schema prop with store state
    schema && page.setSchema(schema);
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

    // patch certain elem's props
    if (schema.type === NodeType.ReactComponentNode) {
      // add placeholder to page elem
      if (schema.exportName === 'page' && !schema.children?.length) {
        Object.assign(elemProps, { placeholder: (
          <div className='flex flex-col items-center justify-center absolute w-full h-full'>
            <Icon name='pg-engine-empty' size={120} />
            <p className='text-gray-400 text-12'>开始构建页面，从左侧 组件库或模版库 面板中拖入元素</p>
          </div>
        ) });
      }

      // add placeholder to container elem
      if (schema.exportName === 'container' && !schema.children?.length) {
        Object.assign(elemProps, { placeholder: (
          <div className={styles.emptyContainer}>
              拖拽组件或模板到这里
          </div>
        ) });
      }
    }

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
