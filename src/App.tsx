import React from 'react';

import 'antd/dist/antd.css';

import Editor from './pages/editor/Editor'

interface Props {
}

interface State {
  txtFileData: string;
}

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  public render = (): JSX.Element => {
    return (
      <Editor></Editor>
    );
  };
}