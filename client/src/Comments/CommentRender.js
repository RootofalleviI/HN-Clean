import React, { Component } from 'react';

class CommentRender extends Component {

    constructor(props) {
        super(props);
        this.rawHTML = props.rawHTML;
        this.indent = props.depth;
        this.margin = '1';
        this.author = props.author;
        this.date = props.date;
        this.SAScore = 0;

        this.children = props.children;

        this.state = {
            hidden: false,
            hover: false,
            collapsed: false,
        }
    }

    hoverOn = () => {
        this.setState({ hover: true });
    }

    hoverOff = () => {
        this.setState({ hover: false });
    }

    collapseClickHandler = () => {
        this.setState({ collapsed: true });
    }

    expandClickHandler = () => {
        this.setState({ collapsed: false });
    }

    hideClickHandler = () => {
        this.setState({ hidden: true });
    }

    showClickHandler = () => {
        this.setState({ hidden: false });
    }

    render = () => {

        let header = <div style={{ color: `gray` }}>
            {!this.state.collapsed
                ? <span onClick={this.collapseClickHandler}>[<u>Collapse</u>] </span>
                : <span onClick={this.expandClickHandler}>[<u>Expand</u>] </span>
            }
            {!this.state.hidden
                ? <span onClick={this.hideClickHandler}> [<u>Hide</u>]</span>
                : <span onClick={this.showClickHandler}> [<u>Show</u>]</span>}
            | Author: {this.author} | Date: {this.date} | SA Score: {this.SAScore} 
        </div >

        let commentText = !this.state.hidden ? this.rawHTML : '<em>Hidden</em>';

        return (
            <div style={{ paddingLeft: `${this.indent}rem` }}>
                {this.author ? header : null}
                {!this.state.collapsed
                    ?
                    <div>
                        <div >
                            <span dangerouslySetInnerHTML={{ __html: commentText + '</p>' }} />
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