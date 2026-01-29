const API_URL = './db.json';
let originalProducts = []; 

async function loadProducts() {
    try {
        const response = await fetch(API_URL);
        originalProducts = await response.json();
        
        renderTable(originalProducts);
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi khi tải dữ liệu!');
    }
}

function renderTable(list) {
    const tableBody = document.getElementById('product-table-body');
    let html = '';

    if (list.length === 0) {
        html = '<tr><td colspan="5" class="text-center">Không tìm thấy sản phẩm</td></tr>';
    } else {
        html = list.map(p => {
            let img = 'https://placehold.co/50x50';
            if (p.images && p.images.length > 0) img = p.images[0];
            else if (p.category && p.category.image) img = p.category.image;

            return `
                <tr>
                    <td>${p.id}</td>
                    <td><img src="${img}" alt="img" width="50" height="50" style="object-fit: cover;"></td>
                    <td class="fw-bold">${p.title}</td>
                    <td class="text-danger fw-bold">$${p.price}</td>
                    <td>${p.description ? p.description.substring(0, 50) + '...' : ''}</td>
                </tr>
            `;
        }).join('');
    }

    tableBody.innerHTML = html;
}
function handleSearch() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();

    const filtered = originalProducts.filter(p => 
        p.title.toLowerCase().includes(keyword)
    );
    renderTable(filtered);
    document.getElementById('sortSelect').value = "";
}

function handleSort() {
    const sortValue = document.getElementById('sortSelect').value;
    let sortedList = [...originalProducts];
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    if(keyword) {
        sortedList = sortedList.filter(p => p.title.toLowerCase().includes(keyword));
    }

    if (sortValue === 'name-asc') {
        sortedList.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortValue === 'name-desc') {
        sortedList.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortValue === 'price-asc') {
        sortedList.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-desc') {
        sortedList.sort((a, b) => b.price - a.price);
    }

    renderTable(sortedList);
}
loadProducts();