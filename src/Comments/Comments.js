import React, { Component } from 'react';
import axios from 'axios';

import CommentADT from './CommentADT';
import CommentRender from './CommentRender';

class Comments extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.story_id = props.match.params.story_id;
        this.story_author = props.match.params.story_author;
        this.story_points = props.match.params.story_points;

        this.state = {
            parsedCommentTree: null,
            error: null,
        }

        this.fetchComments(this.story_id);
    }

    componentDidMount = () => {
        this._isMounted = true;
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    fetchComments = (story_id, HPP = 5000) => {
        axios(`http://hn.algolia.com/api/v1/search?tags=comment,story_${story_id}&hitsPerPage=${HPP}`)
            .then(result => {
                console.log(result.data.hits);
                this.parseComments(result.data.hits)
            })
            .catch(error => this._isMounted && this.setState({ error }));
    }

    parseComments = (commentList) => {
        this.story_title = commentList[0].story_title;
        this.story_url = commentList[0].story_url;
        this.num_comments = commentList.length;
        let root = new CommentADT(this.story_id, this.story_id, -1, '', -1, '');
        this.searchForChildren(root, commentList);
        this.setState({ parsedCommentTree: root });
        root.prettyPrint(0);
    }

    searchForChildren = (parent, commentList) => {
        for (let i in commentList) {
            if (commentList[i].parent_id == parent.comment_id) { // Not triple equal
                let comment = commentList[i];
                let temp = new CommentADT(
                    this.story_id,
                    comment.objectID, // JSON
                    comment.parent_id,
                    comment.comment_text,
                    parent.depth + 1,
                    comment.author,
                    comment.created_at.substring(0,10));
                parent.addChild(temp);
            }
        }

        let commentsToSearchFor = parent.getChild();
        for (let i in commentsToSearchFor) {
            this.searchForChildren(commentsToSearchFor[i], commentList);
        }
    }

    render = () => {
        return (
            <div>
                <h3><a href={this.story_url}>{this.story_title}</a></h3>
                <div>Points: {this.story_points} | Author: {this.story_author} | Comments: {this.num_comments}</div>
                <hr />
                {this.state.parsedCommentTree
                    ?
                    // this.renderHelper(this.state.parsedCommentTree)
                    
                    <CommentRender
                        rawHTML={this.state.parsedCommentTree.comment_text}
                        depth={this.state.parsedCommentTree.depth}
                        author={this.state.parsedCommentTree.author}  
                        date={this.state.parsedCommentTree.date} 
                        children={this.state.parsedCommentTree.getChild()} />
                    :
                    <h3>Loading</h3>
                }
            </div>
        );
    }
}

export default Comments;