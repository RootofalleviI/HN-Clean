import React, { Component } from 'react';

class CommentRender extends Component {

  constructor(props) {
    super(props);
    this.comment_id = props.comment_id;
    this.rawHTML = props.rawHTML;
    this.indent = props.indent;
    this.author = props.author;
    this.date = props.date;
    this.SAScore = props.SAScore;
    this.enableSA = props.enableSA;
    this.threshold = props.threshold;

    this.state = {
      init: true,
      hidden: false,
      collapsed: false
    }
  }

  collapseClickHandler = () => this.setState({ collapsed: true });
  expandClickHandler = () => this.setState({ collapsed: false });
  hideClickHandler = () => this.setState({ hidden: true, init: false });
  showClickHandler = () => this.setState({ hidden: false, init: false });

  render = () => {
    let header = <div style={{ color: `gray` }}>
      {!this.state.collapsed
        ? <span onClick={this.collapseClickHandler}>[<u>Collapse</u>] </span>
        : <span onClick={this.expandClickHandler}>[<u>Expand</u>] </span>
      }
      {(this.state.init && this.SAScore < Number(this.threshold)) || (this.state.hidden && !this.state.init)
        ? <span onClick={this.showClickHandler}> [<u>Show</u>] </span>
        : <span onClick={this.hideClickHandler}> [<u>Hide</u>] </span>
      }
      | Author: {this.author}
      | Date: {this.date}
      | SA Score: {this.enableSA == 'true' ? this.SAScore.toString().substring(0, 7) : '--'}
    </div >

    let commentText = '';
    if (this.enableSA == 'true' && this.SAScore <= Number(this.threshold) && this.state.init) {
      commentText = '<em>Hidden</em';
    } else if (this.state.hidden) {
      commentText = '<em>Hidden</em';
    } else {
      commentText = this.rawHTML;
    }

    return (
      <div className="page">
        <div style={{ paddingLeft: `${this.indent}em` }}>
          {this.indent !== '-1'
            ?
            <div>
              {this.author ? header : null}
            </div>
            : null
          }
          {!this.state.collapsed
            ?
            <div>
              {(this.indent !== '-1')
                ? <div>
                  <span dangerouslySetInnerHTML={{ __html: commentText + '</p>' }} />
                </div>
                : null
              }
              <div>
                {CommentRender.commentList.filter(comment => {
                  return comment.parent_id == this.comment_id;
                }).map(comment => {
                  // console.log(comment)
                  return <CommentRender
                    key={comment.objectID}
                    comment_id={comment.objectID}
                    rawHTML={comment.comment_text}
                    indent={this.indent + 1}
                    author={comment.author}
                    date={comment.created_at.substring(0, 10)}
                    SAScore={comment.SAScore}
                    threshold={this.threshold}
                    enableSA={this.enableSA}
                  />
                })}
              </div>
            </div>
            :
            null
          }
        </div>
      </div>
    )
  }
}

export default CommentRender;