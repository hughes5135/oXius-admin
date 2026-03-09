import React from 'react';
import { Button } from 'antd';
import type { ButtonProps } from 'antd';

export interface DemoButtonProps extends ButtonProps {
  /** 是否显示为演示样式 */
  demo?: boolean;
}

const DemoButton: React.FC<DemoButtonProps> = ({ demo, children, ...rest }) => {
  return (
    <Button {...rest} type={demo ? 'primary' : rest.type}>
      {children ?? 'Demo Button'}
    </Button>
  );
};

DemoButton.displayName = 'DemoButton';

export default DemoButton;
