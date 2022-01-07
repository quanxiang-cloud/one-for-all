import React, { useEffect, useCallback, useState, useRef } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { useDrop } from 'react-dnd';
import { get, defaults, flow } from 'lodash';
import { toJS } from 'mobx';

import { PageNode, LoopNode, PageSchema, useCtx } from '@ofa/page-engine';
import { Icon, Popper } from '@ofa/ui';

import { ElementInfo } from '../types';
import RenderNode from './render-node';
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
  const popperRef = useRef<Popper>(null);
  const reference = useRef<any>(null);
  const { page, registry, dataSource } = useCtx();
  const [seat, setSeat] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  // console.log(toJS(page.schema));
  const [parentNodes, setParentNodes] = useState<string[]>([]);

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
      // console.log('storedSchema', storedSchema);
      // storedSchema && page.setSchema(storedSchema as any);
      page.setSchema(storedSchema as any);
    }

    // sync schema prop with store state
    schema && page.setSchema(schema);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      handleGetElements();
    }, 100);
  }, [toJS(page.schema.node)]);

  useEffect(() => {
    if (page.activeElemId) {
      const elementInfo = page.schemaElements[page.activeElemId];
      const { element } = elementInfo;
      handleElementPosition(element);
    }
  }, [page.activeElemId]);

  function transformType(schema: PageNode | LoopNode): string | React.ComponentType {
    const { type } = schema;
    if (type === NodeType.ReactComponentNode) {
      return registry.elementMap?.[schema.exportName]?.component || type;
    }
    if (type === NodeType.LoopContainerNode) {
      const nodeType = get(schema, 'node.exportName');
      return registry.elementMap[nodeType]?.component;
    }
    if (type === NodeType.HTMLNode) {
      return schema.name || 'div';
    }
    return 'div';
  }

  function handleGetElements(): void {
    const root = document.getElementById('all') as HTMLDivElement;
    const _rootChildren = Array.from(root.children || []);
    const elementMap: any = {};
    handleEle(_rootChildren, elementMap);
    page.setSchemaElements(elementMap);
  }

  function handleEle(elements: Element[], newElements: Record<string, ElementInfo>): void {
    elements.map((element: Element) => {
      const nodeKey = element.getAttribute('data-node-key');
      const _children = Array.from(element.children);
      if (nodeKey) {
        newElements[nodeKey] = {
          element,
          position: element.getBoundingClientRect(),
        };
      }
      if (_children.length > 0) {
        handleEle(_children, newElements);
      }
    });
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

  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    const { pageX, pageY } = e;
    const checkedNodeIds: string[] = [];
    const elementMap = toJS(page.schemaElements);
    Object.entries(elementMap).forEach((item) => {
      const [nodeKey, params] = item;
      const { position } = params;
      const { x, y, width, height } = position;
      if ((x < pageX && pageX < (x + width)) && (y < pageY && pageY < (y + height))) {
        if (nodeKey) {
          checkedNodeIds.push(nodeKey);
        }
      }
    });

    setParentNodes(checkedNodeIds);
    const currActiveId = checkedNodeIds[checkedNodeIds.length - 1];
    if (page.activeElemId === currActiveId) return;
    page.setActiveElemId(currActiveId);
  }

  function handleElementPosition(ele: Element): void {
    if (ele) {
      const { x, y, width, height } = ele.getBoundingClientRect();
      const _p: DOMRect = (document.getElementById('ggg') as HTMLDivElement).getBoundingClientRect();
      setSeat({
        width,
        height,
        x: x - _p.x,
        y: y - _p.y,
      });
    }
  }

  function handleParentList(): any[] {
    const parentIds = parentNodes.slice(0, parentNodes.length - 1);
    const list: any[] = [];
    parentIds.map((item, index) => {
      list.push({
        value: item,
        // label: `容器${index}`,
        label: page.findElement(item).label || '',
      });
    });
    return list.reverse();
  }

  function handleSelectParenNode(id: string): void {
    page.setActiveElemId(id);
  }

  const schemaToProps = flow([
    // mergeStyle,
    mergeProps,
  ]);

  function renderNode(schema: PageNode | LoopNode, level = 0): JSX.Element | null | undefined {
    if (typeof schema !== 'object' || schema === null) {
      return null;
    }

    let node;

    if (schema.type === NodeType.LoopContainerNode) {
      node = (schema as LoopNode).node as PageNode;
    } else {
      node = schema;
    }

    return (
      <Elem node={node}>
        {
          React.createElement(transformType(node), schemaToProps(toJS(node)), ...([].concat(node.children as any))
            .map((child) => renderNode(child, level + 1)))
        }
      </Elem>
    );
  }

  // 监听浏览器窗口变动
  window.onresize = () => {
    if (page.activeElemId) {
      const elementInfo = page.schemaElements[page.activeElemId];
      const { element } = elementInfo;
      handleElementPosition(element);
    }
  };

  return (
    <div className='relative bg-red' id="ggg">
      <div
        className='relative top-0 left-0 bottom-0 right-0 overflow-visible z-10 inline-block'
        style={{ transform: 'translate(0px 0px)', pointerEvents: 'none' }}
      >
        {
          page.activeElemId && (
            <>
              <div style={{
                width: seat.width,
                height: seat.height,
                border: '2px solid #197aff',
                transform: `translate3d(${seat.x}px, ${seat.y}px, 0px)`,
                zIndex: 2,
                pointerEvents: 'none',
                willChange: 'width, height, transform',
              }}>
                <div
                  className='h-20 border border-black flex absolute'
                  style={{ top: '22px', right: '-2px', pointerEvents: 'all' }}
                >
                  <div
                    className='mr-4 px-4 flex items-center bg-gradient-to-r from-blue-500 to-blue-600
                  rounded-2 cursor-pointer'
                    ref={reference}
                  >
                    <Icon name='insert_drive_file' color='white' className='mr-4' clickable />
                    <span className='text-12 text-white whitespace-nowrap'>
                      {(page.activeElem.label) || '容器'}
                    </span>
                  </div>
                  {
                    parentNodes.length > 1 && (
                      <div className='px-4 flex items-center justify-around corner-0-0-4-4 bg-white'>
                        <Icon
                          name='content_copy'
                          size={14}
                          className='mr-4'
                          clickable
                          onClick={() => page.copyNode(
                            parentNodes[parentNodes.length - 2], page.activeElemId)} />
                        <Icon name='save' className='mr-4' clickable />
                        <Icon name='delete' clickable
                          onClick={() => page.removeNode(page.activeElemId)}
                        />
                      </div>
                    )
                  }
                </div>
              </div>
              <Popper
                ref={popperRef}
                reference={reference}
              >
                <ul>
                  {
                    handleParentList().map((item) => {
                      return (
                        <li className='mb-2' key={item.value}
                          onClick={() => handleSelectParenNode(item.value)}>
                          <div className='px-4 flex items-center bg-gray-400 rounded-2 cursor-pointer'>
                            <Icon name='insert_drive_file' color='white' className='mr-4' clickable />
                            <span className='text-12 text-white whitespace-nowrap'>{item.label}</span>
                          </div>
                        </li>
                      );
                    })
                  }
                </ul>
              </Popper>
            </>
          )
        }
      </div>
      <div
        id='all'
        onClick={(e) => handleClick(e)}
        className={cs(styles.page, className)}
        ref={drop}
      >
        <RenderNode schema={page.schema.node} />
      </div>
    </div>
  );
}

export default observer(Page);
