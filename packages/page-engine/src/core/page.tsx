import React, { useContext, useEffect } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { useDrop } from 'react-dnd';
import { defaults } from 'lodash';

import ctx from '../ctx';
import Elem from './elem';

import styles from './index.m.scss';

interface Props {
  schema?: PageEngine.Node;
  className?: string;
  onSave?: () => void;
  onPreview?: () => void;
  children?: React.ReactNode;
}

const identity = (x: any) => x;

function Page({ schema, children, className }: Props) {
  const { page, registry } = useContext(ctx);

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

    // fixme: restore schema from backend
    let storedSchema = localStorage.getItem('page_schema');
    try {
      storedSchema = JSON.parse(storedSchema as any);
    } catch (err) {
      storedSchema = null;
    }
    storedSchema && page.setSchema(storedSchema as any);
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

  function renderNode(schema: PageEngine.Node, level = 0): JSX.Element | null | undefined {
    // handle primitive type
    if (typeof schema !== 'object' || schema === null) {
      return schema;
    }

    // if registered elem, wrap with Elem comp
    // if whole schema block, wrap the first level node with Elem comp
    const elemConf = registry.getElemByType(schema.comp);
    const toProps = elemConf.toProps || identity;
    const elemProps = defaults(schema.props, elemConf.defaultConfig);
    return (
      <Elem node={schema}>
        {React.createElement(transformType(schema.comp), toProps(elemProps), ...([].concat(schema.children as any))
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
