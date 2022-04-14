import forming from '@one-for-all/scss-forming';
import React, { useState, useEffect } from 'react';

type InputProps = {
  onChange: (v: string) => void;
  title: string;
}

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
}

function Formatted({ scss, formingRules }: FormattedProps): JSX.Element {
  const [formatted, setFormatted] = useState('');

  function handleFormIt() {
    try {
      const rules = eval(`(${formingRules})`);
      forming(scss, rules).then(({ scss: formattedSCSS }) => {
        setFormatted(formattedSCSS)
      })
    } catch (error) {
      setFormatted(`${error}`);
    }
  }

  return (
    <div>
      <p><button onClick={handleFormIt}>Form It!</button></p>
      <textarea style={{ width: '100%', height: '300px' }} value={formatted} />
    </div>
  )
}

function FormingDemo(): JSX.Element {
  const [scss, setSCSS] = useState('');
  const [formingRules, setFormingRules] = useState('');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: '8px', columnGap: '8px' }}>
      <Input title='请输入 SCSS' onChange={setSCSS} />
      <Input title='请输入 forming rules' onChange={setFormingRules} />
      <Formatted scss={scss} formingRules={formingRules} />
    </div>
  )
}

export default FormingDemo;
