import React, { useEffect, useRef, useState, useImperativeHandle } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import { useCtx } from '@ofa/page-engine';
import { Icon, Popper } from '@ofa/ui';

interface Props {
  className?: string;
}

function NodeToolbox(props: Props, ref: any): JSX.Element {
  const popperRef = useRef<Popper>(null);
  const reference = useRef<any>(null);
  const { page, registry, dataSource } = useCtx();
  const [seat, setSeat] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  useImperativeHandle(ref, () => {
    return {
      computedPlace,
    };
  });

  useEffect(()=> {
    // 监听浏览器窗口变动
    window.addEventListener('resize', ()=> {
      if (page.activeElemId) {
        const elementInfo = page.schemaElements[page.activeElemId];
        const { element } = elementInfo;
        handleElementPosition(element);
      }
    });
  }, []);

  useEffect(() => {
    computedPlace();
  }, [page.activeElemId]);

  function handleElementPosition(ele: Element): void {
    if (ele) {
      const { x, y, width, height } = ele.getBoundingClientRect();
      const _p: DOMRect = (document.getElementById('page-engine-canvas') as HTMLDivElement).getBoundingClientRect();
      setSeat({
        width,
        height,
        x: x - _p.x,
        y: y - _p.y,
      });
    }
  }

  function computedPlace(): void {
    if (page.activeElemId) {
      const elementInfo = page.schemaElements[page.activeElemId];
      const { element } = elementInfo;
      handleElementPosition(element);
    }
  }

  function getParentList(): any[] {
    const parentIds = page.parentNodes.slice(0, page.parentNodes.length - 1);
    return parentIds.map((item) => {
      const element = page.findElement(item);
      return ({
        value: item,
        // label: `容器${index}`,
        label: (element && element.label) || '容器',
      });
    }).reverse();
  }

  return (
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
                style={{ bottom: '-22px', right: '-2px', pointerEvents: 'all' }}
              >
                <div
                  className='mr-4 px-4 flex items-center bg-gradient-to-r from-blue-500 to-blue-600
                  rounded-2 cursor-pointer'
                  ref={reference}
                >
                  <Icon name='insert_drive_file' color='white' className='mr-4' clickable />
                  <span className='text-12 text-white whitespace-nowrap'>
                    {(page.activeElem && page.activeElem.label) || '容器'}
                  </span>
                </div>
                {
                  page.parentNodes.length > 1 && (
                    <div className='px-4 flex items-center justify-around corner-0-0-4-4 bg-white'>
                      <Icon
                        name='content_copy'
                        size={14}
                        className='mr-4'
                        clickable
                        onClick={() => {
                          page.copyNode(page.parentNodes[page.parentNodes.length - 2], page.activeElemId);
                        }}
                      />
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
                  getParentList().map((item) => {
                    return (
                      <li className='mb-2' key={item.value} onClick={() => page.setActiveElemId(item.value)}>
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
  );
}

export default observer(React.forwardRef(NodeToolbox));
