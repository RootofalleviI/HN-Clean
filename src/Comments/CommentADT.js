class CommentADT {

    constructor(
        story_id,       // the story this comments replies to
        comment_id,     // the unique id for this comment
        parend_id,      // the direct ancester of this comment
        comment_text,   // the actual comment represented in raw HTML form
        depth,          // distance from this comment to root, 0 being direct comment
    ) {
        this.story_id = story_id;
        this.comment_id = comment_id;
        this.parend_id = parend_id;
        this.comment_text = comment_text;
        this.depth = depth;

        this.childrenList = [];
    }

    addChild = childComment => {
        this.childrenList.push(childComment);
        console.log(`Added comment ${childComment.comment_id} to childrenList of ${this.comment_id}`);
    }

    getChild = () => {
        return this.childrenList;
    }

    prettyPrint = (numOfIndents) => {
        let indent = '>'.repeat(numOfIndents);
        console.log(`${indent} Current comment: ${this.comment_id}.`);
        // console.log(`${indent} => List of children: `, this.getChild());
        for (let i in this.childrenList) {
            this.childrenList[i].prettyPrint(numOfIndents+4);
        }
    }
}

export default CommentADT;