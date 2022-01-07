import React, { useEffect, useState, useRef } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { useDrop } from 'react-dnd';
import { get } from 'lodash';
import { toJS } from 'mobx';

import { PageSchema, useCtx } from '@ofa/page-engine';
import { Icon, Popper } from '@ofa/ui';
import { ElementInfo } from '../types';
import RenderNode from './render-node';

import styles from './index.m.scss';

interface Props {
  schema?: PageSchema;
  className?: string;
  onSave?: () => void;
  onPreview?: () => void;
}

// type NodeProp=ConstantProperty | SharedStateProperty<Serialized> | FunctionalProperty<Serialized>

function Page({ schema, className }: Props): JSX.Element {
  const popperRef = useRef<Popper>(null);
  const reference = useRef<any>(null);
  const { page } = useCtx();
  const [seat, setSeat] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  // console.log(toJS(page.schema));
  const [parentNodes, setParentNodes] = useState<string[]>([]);

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
      // console.log('storedSchema', storedSchema);
      // storedSchema && page.setSchema(storedSchema as any);
      page.setSchema(storedSchema as any);
    }
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

  function handleGetElements(): void {
    const root = document.getElementById('all') as HTMLDivElement;
    const _rootChildren = Array.from(root.children);
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
    page.setActiveElemId(checkedNodeIds[checkedNodeIds.length - 1]);
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
        className={cs(styles.page, className, '哈哈哈哈')}
        ref={drop}
      >
        {/* {renderNode(page.schema.node)} */}
        {/* {
          (page.schema.node.children && page.schema.node.children.length > 0) && ( */}
        <RenderNode schema={page.schema.node} />
        {/* )
        } */}
      </div>
    </div>
  );
}

export default observer(Page);
