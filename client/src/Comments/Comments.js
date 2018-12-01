import React, { Component } from 'react';
import axios from 'axios';

import CommentRender from './CommentRender';

import './Comments.css';

class Comments extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);
    this.story_id = props.match.params.story_id;
    this.story_author = props.match.params.story_author;
    this.story_points = props.match.params.story_points;
    this.threshold = props.match.params.threshold;
    this.enableSA = props.match.params.enableSA;

    this.state = {
      receivedData: false,
      error: null
    }

    this.enableSA == 'true'
      ? this.fetchComments(this.story_id, 1) 
      : this.fetchComments(this.story_id, 0);
  }

  componentDidMount = () => {
    this._isMounted = true;
  }

  componentWillUnmount = () => {
    this._isMounted = false;
  }

  fetchComments = (story_id, sa_flag) => {
    axios(`/api/comments/${story_id}/${sa_flag}`)
      .then(result => {
        CommentRender.commentList = result.data.hits;
        this.story_url = CommentRender.commentList[0].story_url;
        this.story_title = CommentRender.commentList[0].story_title;
        this.num_comments = CommentRender.commentList.length;
        console.log("Received data");
        console.log(CommentRender.commentList);
        this.setState({ receivedData: true })
      })
      .catch(error => this._isMounted && this.setState({ error }));
  }

  render = () => {
    let SA = this.enableSA == "true"
      ? <span> SA Threshold: {this.threshold}</span>
      : <span> SA Disabled </span>;
    return (
      <center>
        <div className="page">
          {
            this.state.receivedData
              ?
              <div>
                <div style={{ margin: '10px' }}>
                  <h5>
                    <a href={this.story_url} >
                      {this.story_title}
                    </a>
                  </h5>
                  Points: {this.story_points} |
                  Author: {this.story_author} |
                  Comments: {this.num_comments} |
                  {SA}
              {/* <a href="/"> Go Back</a> */}
                  <hr />
                </div>
                <CommentRender
                  key={this.story_id}
                  comment_id={this.story_id}
                  rawHTML='rawHTML'
                  indent='-1'
                  author='author'
                  date='date'
                  SAScore='SAScore'
                  threshold={this.threshold}
                  enableSA={this.enableSA}
                />
              </div>
              :
              <h6>Fetching Comments...</h6>
          }
        </div>
      </center>
    );
  }
}

export default Comments;