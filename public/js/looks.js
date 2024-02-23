document.addEventListener('DOMContentLoaded', function () {
    const feed = document.querySelector('.feed');
    const messagesCollapse = document.getElementById('messagesCollapse');
    const friendsCollapse = document.getElementById('friendsCollapse');

    function setFeedPadding() {
        let paddingValue;

        if (!messagesCollapse.classList.contains('show') && !friendsCollapse.classList.contains('show')) {
            paddingValue = '25%';
        } else if (messagesCollapse.classList.contains('show') && friendsCollapse.classList.contains('show')) {
            paddingValue = '7%';
        } else {
            paddingValue = '13%';
        }

        feed.style.paddingLeft = paddingValue;
        feed.style.paddingRight = paddingValue;
    }

    // Event listeners for the collapse elements
    $('#messagesCollapse, #friendsCollapse').on('shown.bs.collapse hidden.bs.collapse', setFeedPadding);

    // Initial set of padding
    setFeedPadding();

    feed.addEventListener('click', function (event) {
        if (event.target.classList.contains('guess-btn')) {
            const post = event.target.closest('.audio-post');
            const videoContainer = post.querySelector('.video-container');
            const audioPlayer = post.querySelector('.audio-player');
            const postDescription = post.querySelector('.post-description');
            const guessSection = post.querySelector('.input-group');
            const userGuess = post.querySelector('.guess-input').value.trim().toLowerCase();
            const correctGuess = post.getAttribute('data-guess-answer').toLowerCase();
            const postTitle = post.querySelector('.post-title');

            audioPlayer.pause();

            // Show the video regardless of the guess's correctness
            post.classList.replace('audio-post', 'video-post');
            videoContainer.style.display = '';
            audioPlayer.style.display = 'none';

            if (userGuess === correctGuess) {
                postTitle.textContent = 'Correct guess! This is the video:';
                postDescription.textContent = 'The mystery sound comes from this video! Did you guess correctly?';
            } else {
                postTitle.textContent = `Incorrect guess. The correct guess was "${correctGuess}". Here is the video:`;
                postDescription.textContent = 'The mystery sound comes from this video!';
            }

            // Hide the guess input section after a guess is made
            guessSection.style.display = 'none';
        }
    });


});
