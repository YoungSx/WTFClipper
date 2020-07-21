import React from 'react';
import { Tabs } from 'antd'

const { TabPane } = Tabs

export default class Makers extends React.Component {
    render () {
        return (
            <>
                <Tabs defaultActiveKey="1" tabPosition="left" style={{ height: 220 }}>
                    <TabPane tab="My medias" key="1">
                        there are some medias
                    </TabPane>
                </Tabs>
            </>
        )
    }
}