import React from 'react';
import ReactDOM from 'react-dom';
import { remote } from 'electron';
import fs from 'fs';
import { Button } from 'antd';

import 'antd/dist/antd.css';

interface Props {
}

interface State {
  txtFileData: string;
}

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      txtFileData: ''
    };
  }

  /**
   * 弹出文件选择框，选择 .txt 文件
   * 将选中的 .txt 内容展示到页面
   */
  public readTxtFileData = async () => {
    const result = await remote.dialog.showOpenDialog({
      title: '请选择 .txt 文件',
      filters: [
        {
          name: 'txt',
          extensions: ['txt']
        }
      ]
    });
    fs.readFile(result.filePaths[0], 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        this.setState({
          txtFileData: data.replace(/\n|\r\n/g, '<br/>')
        });
      }
    });
  };

  public render = (): JSX.Element => {
    return (
      <section>
        <Button type="primary" onClick={this.readTxtFileData}>读取一个txt文件的内容</Button>
        <div dangerouslySetInnerHTML={{__html: this.state.txtFileData}}/>
      </section>
    );
  };
}