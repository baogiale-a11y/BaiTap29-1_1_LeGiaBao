const API_URL = './db.json'; 

async function loadProducts() {
    try {
        const response = await fetch(API_URL);
        const products = await response.json();
        const listElement = document.getElementById('product-list');
        const html = products.map(product => {
            let imageUrl = 'https://placehold.co/600x400';
            if (product.images && product.images.length > 0) {
                imageUrl = product.images[0];
            } else if (product.category && product.category.image) {
                imageUrl = product.category.image;
            }

            return `
                <div class="product-card">
                    <img src="${imageUrl}" alt="${product.title}" onerror="this.src='https://placehold.co/600x400'">
                    <div class="product-title">${product.title}</div>
                    <div class="product-desc">${product.description.substring(0, 50)}...</div>
                    <div class="product-price">$${product.price}</div>
                </div>
            `;
        }).join('');

        listElement.innerHTML = html;

    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        alert('Không thể tải dữ liệu sản phẩm!');
    }
}
loadProducts();