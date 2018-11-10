import React, { Component } from 'react';
// import CommentRender from './CommentRender ';

class CommentRender extends Component {

  constructor(props) {
    super(props);
    this.comment_id = props.comment_id;
    this.rawHTML = props.rawHTML;
    this.indent = props.indent;
    this.author = props.author;
    this.date = props.date;
    this.SAScore = props.SAScore;

    this.state = {
      hidden: false,
      collapsed: false,
      showSA: true
    }
  }

  collapseClickHandler = () => this.setState({ collapsed: true });
  expandClickHandler = () => this.setState({ collapsed: false });
  hideClickHandler = () => this.setState({ hidden: true });
  showClickHandler = () => this.setState({ hidden: false });

  render = () => {

    let header = <div style={{ color: `gray` }}>
      {!this.state.collapsed
        ? <span onClick={this.collapseClickHandler}>[<u>Collapse</u>] </span>
        : <span onClick={this.expandClickHandler}>[<u>Expand</u>] </span>
      }
      {!this.state.hidden
        ? <span onClick={this.hideClickHandler}> [<u>Hide</u>]</span>
        : <span onClick={this.showClickHandler}> [<u>Show</u>]</span>}
      | Author: {this.author} | Date: {this.date} | SA Score: {this.state.showSA ? this.SAScore.toString().substring(0, 7) : '--'}
    </div >

    let commentText = !this.state.hidden ? this.rawHTML : '<em>Hidden</em>';

    return (
      <div className="page">
        <div style={{ paddingLeft: `${this.indent}rem` }}>
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
                  // console.log(comment.parent_id, this.comment_id)
                  return comment.parent_id == this.comment_id;
                }).map(comment => {
                  console.log(comment)
                  return <CommentRender
                    key={comment.objectID}
                    comment_id={comment.objectID}
                    rawHTML={comment.comment_text}
                    indent={this.indent + 1}
                    author={comment.author}
                    date={comment.date}
                    SAScore={comment.SAScore}
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