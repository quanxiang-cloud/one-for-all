import React, { useEffect, useRef } from 'react';
import MonacoEditor from "@monaco-editor/react";
import todoAppSchema from '../todo-app-main-schema';
import { Artery } from '@one-for-all/artery';
import yaml from 'yaml';
import arteryYaml from './artery-yaml';

interface Props {
  onChange?: (v?: Artery) => void;
}

function Editor({ onChange }: Props): JSX.Element {
  useEffect(() => {
    onChange?.(todoAppSchema)
  }, []);

  function handleEditorChange(value?: string) {
    if (!value) {
      onChange?.()
      return;
    }
    try {
      const artery = yaml.parse(value);
      console.log(artery)
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
      onChange={handleEditorChange}
    />
  );
}

export default Editor;
