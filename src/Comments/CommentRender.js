import React, { Component } from 'react';

class CommentRender extends Component {

    constructor(props) {
        super(props);
        this.rawHTML = props.rawHTML;
        this.indent = props.depth * 2;
        this.margin = '1';
        this.author = props.author;
        this.date = props.date;
        this.SAScore = 0;

        this.children = props.children;

        this.state = {
            hidden: false,
            collapsed: false,
        }
    }

    collapseClickHandler = () => {
        this.setState({ collapsed: true });
    }

    expandClickHandler = () => {
        this.setState({ hidden: false, collapsed: false });
    }

    render = () => {

        let header = <div style={{ color: `gray` }}>
            {!(this.state.hidden || this.state.collapsed)
                ? <span onClick={this.collapseClickHandler}>-Hide </span>
                : <span onClick={this.expandClickHandler}>+Show </span>}
            | Author: {this.author} | Date: {this.date} | SA Score: {this.SAScore}
        </div>

        return (
            <div style={{ paddingLeft: `${this.indent}em` }}>
                {this.author ? header : null}
                {!(this.state.hidden || this.state.collapsed) ?
                    <div>
                        <div >
                            <span dangerouslySetInnerHTML={{ __html: this.rawHTML + '</p>' }} />
                        </div>
                        <div>
                            {this.children.map(childComment =>
                                <div key={childComment.comment_id}>
                                    <CommentRender
                                        rawHTML={childComment.comment_text}
                                        depth={childComment.depth}
                                        author={childComment.author}
                                        date={childComment.date}
                                        children={childComment.getChild()}
                                    />
                                </div>)
                            }
                        </div>
                    </div>
                    :
                    <br />}
            </div>
        )
    }
}

export default CommentRender;