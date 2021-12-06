import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import cs from 'classnames';

import Icon from '@c/icon';
import Button from '@c/button';

import creatModal from './dialog-modal';

export interface FooterBtnProps {
  text: React.ReactNode;
  key: React.Key;
  loading?: boolean;
  iconName?: string;
  className?: string;
  forbidden?: boolean;
  style?: React.CSSProperties;
  modifier?: 'primary' | 'danger';
  onClick: (key: React.Key, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

interface Props {
  title?: string | React.ReactNode;
  fullscreen?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
  children?: React.ReactNode
  onClose?: () => void;
  footerBtns?: FooterBtnProps[]
}

export default function Modal({
  title,
  fullscreen,
  className,
  width = 'auto',
  height = 'auto',
  children,
  onClose,
  footerBtns = [],
}: Props): JSX.Element {
  const [element] = useState(document.createElement('div'));

  useEffect(() => {
    document.body.append(element);
    return () => {
      document.body.removeChild(element);
    };
  }, []);

  const renderFooter = () : React.ReactNode => {
    if (!footerBtns.length) {
      return null;
    } else {
      return (
        <Footer>
          {
            footerBtns.map(({
              className = '',
              text,
              key,
              onClick,
              ...restProps
            }) => (
              <Button
                {...restProps}
                key={key}
                className={
                  cs(className, 'mr-20')
                }
                onClick={(e) => onClick(key, e)}
              >
                {text}
              </Button>
            ))
          }
        </Footer>
      );
    }
  };

  return createPortal(
    <Wrap className={className}>
      <GlobalStyle />
      <Mask />
      <InnerWrap width={width} height={height} fullscreen={fullscreen}>
        <Header>
          <div className='md-header-left'>
            <div className='md-title'>{title}</div>
          </div>
          <div className='md-header-right'>
            <Icon name='close' size={24} clickable onClick={onClose} />
          </div>
        </Header>
        <Body className='md-body' fullscreen={fullscreen}>
          {children}
        </Body>
        {renderFooter()}
      </InnerWrap>
    </Wrap>,
    element,
  );
}

Modal.open = creatModal;

const GlobalStyle = createGlobalStyle`
  body {
    overflow-y: hidden;
  }
`;
const Mask = styled.div`
  background: #0F172A;
  opacity: 0.65;
  backdrop-filter: blur(72px);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  height: 56px;
  min-height: 56px;
  border-bottom: 1px solid #E2E8F0;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  position: relative;
  background: white;
  background-image: url(/dist/images/md-header-bg.jpg);
  background-position: top right;
  background-size: contain;
  background-repeat: no-repeat;

  .md-header-left {
    display: flex;
    flex: 1;
    align-items: center;
    > .md-title {
      font-size: 1.6rem;
      font-weight: 600;
      line-height: 24px;
      color: #0F172A;
      margin-right: 16px;
    }
  }
  .md-header-right {
    justify-content: flex-end;
  }
`;

const Body = styled.div<{ fullscreen?: boolean }>`
  overflow: auto;
  ${({ fullscreen }) => fullscreen ? css`
      height: calc(100vh - 56px);
    ` : css`
      height: 100%;
    `}
`;

const Footer = styled.div`
  padding: 16px 20px;
  background-color: #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
`;

const scaleAnimation = keyframes`
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const InnerWrap = styled.div<{
  width: number | string,
  height: number | string,
  fullscreen?: boolean
}>`
  display: flex;
  flex-direction: column;
  width: ${(props) => typeof props.width === 'number' ? props.width + 'px' : props.width};
  height: ${(props) => typeof props.height === 'number' ? props.height + 'px' : props.height};
  ${(props) => props.width === 'auto' ? 'min-width: 632px' : ''};
  background: white;
  ${({ fullscreen }) => fullscreen ? css`
    width: 100vw;
    height: 100vh;
    position: relative;
    top: 56px;
  ` : css`
    margin: auto;  // FFC auto box
    max-width: calc(100vw - 42px);
    max-height: calc(100vh - 42px);
  `};
  z-index: 14;
  border-radius: 12px;
  animation: ${scaleAnimation} 0.3s;
`;

const Wrap = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  transition: opacity .1s;
  justify-content: center;
  overflow: hidden;
  z-index: 20;
  box-shadow: inset 0px -1px 0px #E2E8F0;

  ${Mask} {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;
