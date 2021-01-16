import React from 'react';
import { Row, Col } from 'antd';
import style from './style/editor.module.css'
import ResourceLibrary from '../../components/editor/Resource/ResourceLibrary'
import Makers from '../../components/editor/Makers'
import Viewer from '../../components/editor/View/Viewer'

export default class Editor extends React.Component {
    render () {
        return (
            <>
                <Row>
                    <Col className={style.resource_area} span={12}>
                        <ResourceLibrary></ResourceLibrary>
                    </Col>
                    <Col className={style.view_area} span={12}>
                        <Viewer></Viewer>
                    </Col>
                </Row>
                <Row>
                    <Col id="makers_area" className={style.makers_area} span={24}>
                        <Makers></Makers>
                    </Col>
                </Row>
            </>
        )
    }
}