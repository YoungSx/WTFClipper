import React from 'react';
import { Row, Col } from 'antd';
import style from './style/editor.module.css'

export default class Editor extends React.Component {
    render () {
        return (
            <>
                <Row>
                    <Col className={style.resource_area} span={12}>Resource area</Col>
                    <Col className={style.preview_area} span={12}>Preview area</Col>
                </Row>
                <Row>
                    <Col className={style.makers_area} span={24}>Makers area</Col>
                </Row>
            </>
        )
    }
}