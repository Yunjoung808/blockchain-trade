import React, { Component } from 'react';

import Mission from 'views/examples/Mission.js';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer'



class Test extends Component{

  state={
    mission:""
  };
  
  componentDidMount(){
    this.callApi()
      .then(res => this.setState({mission: res}))
      .then(res => console.log("res:", res))
      .catch(err => console.log("err:", err))
  }
  
  callApi = async()=>{
    const response = await fetch('http://localhost:5000/api/hello');
    const body = await response.json();
    return body;
  }

  render(){
    const {mission}=this.props;
    return (
        <Table>
          <TableHead>
            <TableRow>
            <TableCell>번호</TableCell>
            <TableCell>제목</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {this.state.mission ? this.state.mission.map(c =>{return(<Mission key={c.id} index={c.index} title={c.title}/>);}) : ""}
        </TableBody>
        </Table>
    );
  }
}

export default Test;