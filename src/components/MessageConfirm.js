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
        this.state={
            isShow:false  ,
            txt:"是否进行本次操作？",
            sureFn:""
        }
    }

    onHideEvent =()=>{
        if(this.props.onHideEvent) {
            this.props.onHideEvent();
        }
    }

    initParam(param){
        var sureFn = "";
        if(typeof param.sureFn == "function"){
            sureFn = param.sureFn  ;
        }
        this.setState({
            isShow : param.isShow ,
            txt: param.txt ,
            sureFn:sureFn
        })
    }

    exitEvent () {
        this.setState({
            isShow: false
        })
    }

    sureEvent (){
        this.exitEvent();
        this.state.sureFn();
    }

    render(){
        // bsStyle={ bsStyle }
        const { isShow ,txt } = this.state  ;

        return(
            <Modal show ={ isShow }  onHide={::this.onHideEvent }   bsSize="sm">
                <Modal.Header>
                    <Modal.Title>提示</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    { txt }
                </Modal.Body>
                <Modal.Footer>
                    <Button bsClass="btn btn-default" onClick={::this.exitEvent}>取消</Button>
                    <Button bsClass="btn btn-primary" onClick={::this.sureEvent}>确定</Button>
                </Modal.Footer>
            </Modal>
        )



    }
}
export default MessageTips ;