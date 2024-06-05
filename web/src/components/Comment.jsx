import React from 'react';
import classes from '../pages/ArticlePage.module.css';

const Comment = ({ comment, userId, connection, handleDeleteComment, handleReply }) => {
    return (
        <li key={comment.commentId} className={classes.form}>
            <div className={classes.user}>
                <img
                    src={comment.userImage ? `${window.minioUrl}/writewave/` + comment.userImage : 'Default User Image URL'}
                    alt="Comment Author Avatar"
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
                <h3 className={classes.username}>{comment.username}</h3>
            </div>
            <p>{comment.content}</p>

            <div className={classes.del_btn_cont}>
                {comment.userId === userId && (
                    <button className={classes.delete_button} onClick={() => handleDeleteComment(comment.commentId)}>
                        <img src="../delete.png" alt="Delete" />
                    </button>
                )}
                {/*{comment.parentId === null &&*/}
                    <button className={classes.reply_button} onClick={() => handleReply(comment)}>
                        Ответить
                    </button>
            {/*}*/}
            </div>

            {comment.replies && comment.replies.length > 0 && (
                <ul className={classes.replies}>
                    {comment.replies.map(reply => (
                        <Comment
                            
                            key={reply.commentId}
                            comment={reply}
                            userId={userId}
                            connection={connection}
                            handleDeleteComment={handleDeleteComment}
                            handleReply={handleReply}
                            
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default Comment;
