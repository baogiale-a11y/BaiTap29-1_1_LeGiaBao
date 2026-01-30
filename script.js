const API_URL = "http://localhost:3000";

function generateId(list) {
    if (!list || list.length === 0) return "1";
    const maxId = Math.max(...list.map(item => Number(item.id)));
    return String(maxId + 1);
}

async function loadPosts() {
    const res = await fetch(`${API_URL}/posts`);
    const posts = await res.json();
    
    const html = posts.map(post => {
        const deletedClass = post.isDeleted ? 'deleted-post' : '';
        const statusText = post.isDeleted ? '<span class="badge bg-danger">Đã xóa</span>' : '<span class="badge bg-success">Hoạt động</span>';
        const btnDisabled = post.isDeleted ? 'disabled' : '';

        return `
            <tr class="${deletedClass}">
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td>${statusText}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="softDeletePost('${post.id}')" ${btnDisabled}>
                        Xóa mềm
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    document.getElementById('posts-list').innerHTML = html;
}

async function addPost() {
    const title = document.getElementById('postTitle').value;
    const views = document.getElementById('postViews').value;

    if (!title) return alert("Vui lòng nhập tiêu đề!");

    const res = await fetch(`${API_URL}/posts`);
    const posts = await res.json();
    const newId = generateId(posts);

    const newPost = { 
        id: newId, 
        title: title, 
        views: Number(views),
        isDeleted: false 
    };

    await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
    });

    document.getElementById('postTitle').value = '';
    loadPosts();
}

async function softDeletePost(id) {
    if(!confirm("Bạn chắc chắn muốn xóa mềm bài này?")) return;

    await fetch(`${API_URL}/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDeleted: true })
    });
    loadPosts();
}

async function loadComments() {
    const res = await fetch(`${API_URL}/comments`);
    const comments = await res.json();

    const html = comments.map(c => `
        <tr>
            <td>${c.id}</td>
            <td>${c.text}</td>
            <td>${c.postId}</td>
            <td>
                <button class="btn btn-info btn-sm text-white" onclick="editComment('${c.id}')">Sửa</button>
                <button class="btn btn-danger btn-sm" onclick="deleteComment('${c.id}')">Xóa cứng</button>
            </td>
        </tr>
    `).join('');

    document.getElementById('comments-list').innerHTML = html;
}

async function saveComment() {
    const id = document.getElementById('commentId').value;
    const text = document.getElementById('commentText').value;
    const postId = document.getElementById('commentPostId').value;

    if (!text || !postId) return alert("Nhập đủ nội dung và Post ID!");

    if (id) {
        await fetch(`${API_URL}/comments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, text, postId })
        });
    } else {
        const res = await fetch(`${API_URL}/comments`);
        const list = await res.json();
        const newId = generateId(list);

        await fetch(`${API_URL}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: newId, text, postId })
        });
    }
    resetForm();
    loadComments();
}

async function deleteComment(id) {
    if(!confirm("Xóa vĩnh viễn comment này?")) return;
    await fetch(`${API_URL}/comments/${id}`, { method: 'DELETE' });
    loadComments();
}

async function editComment(id) {
    const res = await fetch(`${API_URL}/comments/${id}`);
    const data = await res.json();

    document.getElementById('commentId').value = data.id;
    document.getElementById('commentText').value = data.text;
    document.getElementById('commentPostId').value = data.postId;

    const btn = document.getElementById('btn-save-comment');
    btn.innerText = "Cập nhật";
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-warning');
    
    document.getElementById('btn-cancel').classList.remove('d-none');
}

function resetForm() {
    document.getElementById('commentId').value = '';
    document.getElementById('commentText').value = '';
    document.getElementById('commentPostId').value = '';

    const btn = document.getElementById('btn-save-comment');
    btn.innerText = "Lưu Comment";
    btn.classList.add('btn-primary');
    btn.classList.remove('btn-warning');
    
    document.getElementById('btn-cancel').classList.add('d-none');
}

// CHẠY LẦN ĐẦU
loadPosts();
loadComments();