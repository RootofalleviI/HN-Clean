import React, { Component } from 'react';

class CommentRender extends Component { 

    constructor(props) {
        super(props);
        this.rawHTML = props.rawHTML;
        this.indent = props.depth * 2;
        this.margin = '1';
        
        if (this.indent == 0) {
            this.color = 'blue';
            this.margin = '3';
        } else if (this.indent == 1) {
            this.color = 'green';
        } else if (this.indent == 2) {
            this.color = 'red';
        } else if (this.indent == 3) {
            this.color = 'purple';
        } else if (this.indent == 4) {
            this.color = 'pink';
        } else {
            this.color = 'yellow';
        }
    }

    render = () => {
        return (
            <div style={{ border: `3px solid ${this.color}`, marginTop: `${this.margin}em`, paddingLeft: `${this.indent}em`}}>
                <span style={{ borderLeft: `20px solid black`}} dangerouslySetInnerHTML={{ __html: this.rawHTML}} />
            </div>
        )
    }
}

export default CommentRender;