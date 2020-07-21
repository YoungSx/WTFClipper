import React from 'react';
import { Tabs } from 'antd'
import Private from "./Private"

const { TabPane } = Tabs

export default class ResourceLibrary extends React.Component {
    render () {
        return (
            <>
                <Tabs defaultActiveKey="1" tabPosition="left" style={{ height: 220 }}>
                    <TabPane tab="My medias" key="1">
                        <Private></Private>
                    </TabPane>
                </Tabs>
            </>
        )
    }
}