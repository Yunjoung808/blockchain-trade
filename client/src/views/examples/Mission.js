import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import {
    Row,
    Col,
    Card,
    CardBody,
    Button
  } from "reactstrap";

class Mission extends React.Component{
    render(){
        return(
            <Row>
                <Col><h4>{this.props.index}</h4> </Col>
                <Col><h4>{this.props.title}</h4></Col>
                <Col>
                    <Button
                    className="btn-icon btn-round"
                    color="primary"
                    type="button"
                    >
                    <i className="tim-icons icon-heart-2" />
                    </Button>
                </Col>
            </Row>
        )
    }
}

export default Mission;