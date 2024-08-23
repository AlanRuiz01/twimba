import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.comment){
        handleCommentSubmit(e.target.dataset.comment)
    }   else if(e.target.dataset.deleteComment){
        handleDeleteComment(e.target.dataset.deleteComment)
    }
})

function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.find(tweet => tweet.uuid === tweetId);

    targetTweetObj.likes += targetTweetObj.isLiked ? -1 : 1;
    targetTweetObj.isLiked = !targetTweetObj.isLiked;
    render();
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.find(tweet => tweet.uuid === tweetId);
    
    targetTweetObj.retweets += targetTweetObj.isRetweeted ? -1 : 1;
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
    render(); 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden');
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input');

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        });
        render();
        tweetInput.value = '';
    }
}

function handleCommentSubmit(tweetId){
    const commentInput = document.getElementById(`comment-input-${tweetId}`);
    
    if(commentInput.value){
        const targetTweetObj = tweetsData.find(tweet => tweet.uuid === tweetId);
        
        targetTweetObj.replies.push({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`, // Puedes reemplazar esto con la imagen que desees
            tweetText: commentInput.value,
            uuid: uuidv4()
        });
        
        render();
        commentInput.value = '';
    }
}

function handleDeleteComment(commentId){
    tweetsData.forEach(tweet => {
        const commentIndex = tweet.replies.findIndex(reply => reply.uuid === commentId && reply.handle === '@Scrimba');
        if(commentIndex !== -1) {
            tweet.replies.splice(commentIndex, 1); // Elimina el comentario del array
            render();
        }
    });
}

function getFeedHtml(){
    let feedHtml = '';
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = tweet.isLiked ? 'liked' : '';
        let retweetIconClass = tweet.isRetweeted ? 'retweeted' : '';
        
        let repliesHtml = tweet.replies.map(reply => `
            <div class="tweet-reply">
                <div class="tweet-inner">
                    <img src="${reply.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${reply.handle}</p>
                        <p class="tweet-text">${reply.tweetText}</p>
                    </div>
                    ${reply.handle === '@Scrimba' ? `<button class="delete-comment-btn" data-delete-comment="${reply.uuid}">Delete comment</button>` : ''}
                </div>
            </div>
        `).join('');
          
        feedHtml += `
        <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots"
                            data-reply="${tweet.uuid}"
                            ></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}"
                            data-like="${tweet.uuid}"
                            ></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}"
                            data-retweet="${tweet.uuid}"
                            ></i>
                            ${tweet.retweets}
                        </span>
                    </div>   
                </div>            
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                ${repliesHtml}
                <div class="comment-section">
                <div>
                    <img src="images/scrimbalogo.png" class="profile-pic">
                    <input type="text" id="comment-input-${tweet.uuid}" placeholder="Add a comment..." class="comment-input">
                    <button data-comment="${tweet.uuid}">Comment</button>
                    </div>
                </div>
            </div>   
        </div>
        `;
   });
   return feedHtml;
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml();
}

render();
