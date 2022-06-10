import forming from '@one-for-all/scss-forming';
import React, { useState, useEffect } from 'react';

type InputProps = {
  onChange: (v: string) => void;
  title: string;
};

function Input({ onChange, title }: InputProps): JSX.Element {
  const [value, setValue] = useState('');

  useEffect(() => {
    onChange(value);
  }, [value]);

  return (
    <div>
      <h1>{title}</h1>
      <textarea
        style={{ width: '100%', height: '300px' }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

type FormattedProps = {
  scss: string;
  formingRules: string;
};

function Formatted({ scss, formingRules }: FormattedProps): JSX.Element {
  const [formatted, setFormatted] = useState('');
  const [astStr, setASTStr] = useState('');

  function handleFormIt() {
    try {
      const rules = eval(`(${formingRules})`);
      forming(scss, rules).then(({ scss: formattedSCSS, ast }) => {
        setFormatted(formattedSCSS);
        setASTStr(JSON.stringify(ast, null, 2));
      });
    } catch (error) {
      setFormatted(`${error}`);
    }
  }

  return (
    <div style={{ gridColumn: '1/3' }}>
      <p>
        <button onClick={handleFormIt}>Form It!</button>
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <h3>formatted scss</h3>
          <textarea style={{ width: '100%', height: '300px' }} value={formatted} />
        </div>
        <div>
          <h3>AST</h3>
          <textarea style={{ width: '100%', height: '300px' }} value={astStr} />
        </div>
      </div>
    </div>
  );
}

function FormingDemo(): JSX.Element {
  const [scss, setSCSS] = useState('');
  const [formingRules, setFormingRules] = useState('');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: '8px', columnGap: '8px' }}>
      <Input title="请输入 SCSS" onChange={setSCSS} />
      <Input title="请输入 forming rules" onChange={setFormingRules} />
      <Formatted scss={scss} formingRules={formingRules} />
    </div>
  );
}

export default FormingDemo;
