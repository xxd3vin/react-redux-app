/**
 * 新组件.
 * Created by duan on 2016/1/21.
 */

import React, {Component, PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {Panel, Label, Input, Button} from 'react-bootstrap';

export default class NormalWidget extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let src = "themes/images/4.png";
        return (
            <div className="widget">
                <ReactCSSTransitionGroup transitionName="example"
                                         transitionAppear={true}
                                         transitionAppearTimeout={3000}
                                         transitionEnterTimeout={1000}
                                         transitionLeaveTimeout={1000}>
                                         {/*<image src={src} key={src}/>*/}
                </ReactCSSTransitionGroup>
                {
                    //<Button>上一页</Button>
                    //<Button>下一页</Button>
                }

            </div>
        );
    }
}
