import React, { Component } from 'react';
import axios from 'axios';

import CommentADT from './CommentADT';
import CommentRender from './CommentRender';

class Comments extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.story_id = props.match.params.story_id;

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
            .then(result => this.parseComments(result.data.hits))
            .catch(error => this._isMounted && this.setState({ error }));
    }

    parseComments = (commentList) => {
        let root = new CommentADT(this.story_id, this.story_id, -1, '', -1);
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
                    parent.depth + 1);
                parent.addChild(temp);
            }
        }

        let commentsToSearchFor = parent.getChild();
        for (let i in commentsToSearchFor) {
            this.searchForChildren(commentsToSearchFor[i], commentList);
        }
    }

    renderHelper(node) {
        return (
            <div>
                {node
                    ?
                    node.getChild().map(childComment =>
                        <div>
                            <CommentRender
                                key={childComment.comment_id}
                                rawHTML={childComment.comment_text}
                                depth={childComment.depth}
                            />
                            <div>
                                {this.renderHelper(childComment)}
                            </div>
                        </div>
                    )
                    :
                    <h1>Loading</h1>}
            </div>
        );
    }

    render = () => {
        return (
            <div>
                <h1>Comment Page</h1>
                <h3>Story title here</h3>
                
                {this.state.parsedCommentTree
                    ?
                    this.renderHelper(this.state.parsedCommentTree)
                    :
                    <h3>Loading</h3>
                }
            </div>
        );
    }
}

export default Comments;