document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('comment-form');
    const commentList = document.querySelector('.comment-list');

    // 1. 초기 댓글 목록 가져오기
    fetchComments();

    // 2. 댓글 등록 이벤트
    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = commentForm.querySelector('.form-input');
        const contentInput = commentForm.querySelector('.form-textarea');

        const newComment = {
            name: nameInput.value,
            content: contentInput.value,
            date: new Date().toLocaleString()
        };

        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newComment)
            });

            if (response.ok) {
                nameInput.value = '';
                contentInput.value = '';
                fetchComments(); // 목록 새로고침
            }
        } catch (error) {
            console.error('댓글 등록 실패:', error);
        }
    });

    // 3. 댓글 목록 API 호출 함수
    async function fetchComments() {
        try {
            const response = await fetch('/api/comments');
            const data = await response.json();
            
            commentList.innerHTML = data.map(comment => `
                <div class="comment-item">
                    <strong>${comment.name}</strong> <small>(${comment.date})</small>
                    <p style="margin-top: 5px;">${comment.content}</p>
                </div>
            `).join('');
        } catch (error) {
            console.error('목록 로드 실패:', error);
        }
    }
});