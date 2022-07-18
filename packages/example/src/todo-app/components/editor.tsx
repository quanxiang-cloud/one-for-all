import React, { useEffect, useRef } from 'react';
import MonacoEditor from "@monaco-editor/react";
import { Artery } from '@one-for-all/artery';
import yaml from 'yaml';
import arteryYaml from './artery-yaml';

interface Props {
  onChange?: (v?: Artery) => void;
}

function Editor({ onChange }: Props): JSX.Element {
  useEffect(() => {
    onChange?.(yaml.parse(arteryYaml));
  }, [])

  function handleEditorChange(value?: string) {
    if (!value) {
      onChange?.()
      return;
    }
    try {
      const artery = yaml.parse(value);
      onChange?.(artery)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <MonacoEditor
      height="90vh"
      defaultLanguage="yaml"
      defaultValue={arteryYaml}
      theme="vs-dark"
      options={{
        scrollBeyondLastLine: false,
      }}
      onChange={handleEditorChange}
    />
  );
}

export default Editor;
