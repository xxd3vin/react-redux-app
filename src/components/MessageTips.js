import React, { Component, PropTypes } from 'react';
import {Modal,Button } from 'react-bootstrap';

/**
 * @des ：消息提示框
 * @param
 *
 */
class MessageTips extends React.Component{
    
    static propTypes = {
        show:PropTypes.bool,
        bsStyle:PropTypes.string ,
        bsSize:PropTypes.string,
        onHideEvent:PropTypes.func
    }
    constructor(props) {
        super(props);
    }

    onHideEvent =()=>{
        if(this.props.onHideEvent) {
            this.props.onHideEvent();
        }
    }

    render(){
        // bsStyle={ bsStyle }
        const { isShow ,txt } = this.props ;
        return(
            <Modal show ={ isShow }  onHide={::this.onHideEvent }   bsSize="sm">
                <Modal.Body>
                    { txt }
                </Modal.Body>
            </Modal>
        )



    }
}
export default MessageTips ;