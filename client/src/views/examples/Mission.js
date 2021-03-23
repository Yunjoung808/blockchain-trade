import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

class Mission extends React.Component{
    render(){
        return(
            <TableRow>
                <TableCell>{this.props.index}</TableCell>
                <TableCell>{this.props.title}</TableCell>
            </TableRow>
        )
    }
}

export default Mission;