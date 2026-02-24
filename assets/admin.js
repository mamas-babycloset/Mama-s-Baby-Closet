document.addEventListener('DOMContentLoaded', () => {
    const isAdmin = localStorage.getItem('mamasBabyAdmin') === 'true';
    if (!isAdmin) {
        window.location.href = 'login.html'; // Redirect non-admins
    }

    // Render Stats
    const renderStats = () => {
        const statsContainer = document.getElementById('admin-stats');
        const activeOrders = orders.filter(o => o.status === 'Pending').length;
        const totalSales = orders.reduce((sum, o) => sum + o.totalInfo.total, 0);

        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-pink-100 flex items-center justify-between">
                    <div>
                        <h3 class="text-sm font-medium text-gray-500">Total Sales</h3>
                        <p class="text-3xl font-bold text-gray-800 mt-1">LKR ${totalSales.toFixed(2)}</p>
                    </div>
                    <div class="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 text-xl">💸</div>
                </div>
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 flex items-center justify-between">
                    <div>
                        <h3 class="text-sm font-medium text-gray-500">Active Orders</h3>
                        <p class="text-3xl font-bold text-gray-800 mt-1">${activeOrders}</p>
                    </div>
                    <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-xl">📦</div>
                </div>
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-yellow-100 flex items-center justify-between">
                    <div>
                        <h3 class="text-sm font-medium text-gray-500">Total Products</h3>
                        <p class="text-3xl font-bold text-gray-800 mt-1">${products.length}</p>
                    </div>
                    <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500 text-xl">🧸</div>
                </div>
            `;
        }
    };

    // Render Products Table
    const renderProductsTable = () => {
        const table = document.getElementById('admin-product-list');
        if (table) {
            table.innerHTML = products.map((p, index) => {
                const isDemo = false; // Allow deleting demo products too
                return `
                 <tr class="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                     <td class="py-4">
                         <div class="flex items-center gap-4">
                             <div class="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                                 <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover">
                             </div>
                             <div>
                                <span class="font-medium text-gray-800 block">${p.name}</span>
                                <span class="text-xs text-gray-400 max-w-[120px] truncate block">${p.sizes ? p.sizes.join(', ') : 'Various sizes'}</span>
                             </div>
                         </div>
                     </td>
                     <td class="py-4 text-gray-500 uppercase text-xs tracking-wider">${p.category}</td>
                     <td class="py-4 font-bold text-gray-800">LKR ${p.price.toFixed(2)}</td>
                     <td class="py-4 text-yellow-500 text-xs font-bold">⭐ ${p.rating}</td>
                     <td class="py-4 text-right space-x-2 w-24">
                         <button onclick="deleteProduct(${p.id}, ${isDemo})" class="${isDemo ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-700 hover:bg-red-50'} p-2 rounded-full transition-colors" title="${isDemo ? 'Cannot delete demo product' : 'Delete'}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                         </button>
                     </td>
                 </tr>
             `}).join('');
        }
    };

    // Render Orders Table
    const renderOrdersTable = () => {
        const table = document.getElementById('admin-order-list');
        if (table) {
            if (orders.length === 0) {
                table.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-gray-400">No orders placed yet. 😢</td></tr>`;
                return;
            }

            // Show recent first
            const sortedOrders = [...orders].reverse();

            table.innerHTML = sortedOrders.map(o => `
                 <tr class="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors align-top">
                     <td class="py-4 text-sm font-medium text-gray-800">#${o.id.toString().slice(-6)}<br><span class="text-xs text-gray-400 font-normal">${new Date(o.id).toLocaleDateString()}</span></td>
                     <td class="py-4">
                        <p class="font-bold text-gray-800">${o.buyerName}</p>
                        <p class="text-xs text-gray-500 mt-1">📞 ${o.contact}</p>
                     </td>
                     <td class="py-4 text-xs text-gray-500 max-w-[200px] break-words">${o.address}</td>
                     <td class="py-4 text-xs text-gray-600">
                        <ul class="list-disc list-inside space-y-1">
                            ${o.items.map(item => `<li><span class="font-bold">${item.quantity}x</span> ${item.name}</li>`).join('')}
                        </ul>
                     </td>
                     <td class="py-4 font-bold text-pink-500">LKR ${o.totalInfo.total.toFixed(2)}<br><span class="text-xs text-gray-400 font-normal">(${o.items.length} items)</span></td>
                     <td class="py-4 text-right">
                         <select onchange="updateOrderStatus(${o.id}, this.value)" class="bg-gray-50 border border-gray-200 text-xs rounded-full px-3 py-1 outline-none focus:border-pink-300 font-medium ${o.status === 'Pending' ? 'text-yellow-600' : 'text-green-600'}">
                            <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
                            <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                            <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                         </select>
                     </td>
                 </tr>
             `).join('');
        }
    };

    // Make functions global for inline onclick
    window.deleteProduct = (id, isDemo) => {
        if (confirm('Are you sure you want to delete this product?')) {
            products = products.filter(p => p.id !== id);
            saveProducts();
            renderStats();
            renderProductsTable();
            showToast('Product deleted 🗑️');
        }
    };

    window.updateOrderStatus = (id, newStatus) => {
        const order = orders.find(o => o.id === id);
        if (order) {
            order.status = newStatus;
            saveOrders();
            renderStats();
            showToast('Order status updated ✅');
        }
    };

    // Add Product Form Handler
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('prod-name').value;
            const category = document.getElementById('prod-category').value;
            const price = parseFloat(document.getElementById('prod-price').value);

            // Get selected sizes
            const sizeCheckboxes = document.querySelectorAll('#prod-sizes input[type="checkbox"]:checked');
            const sizes = Array.from(sizeCheckboxes).map(cb => cb.value);

            if (sizes.length === 0) {
                showToast('Please select at least one size range! ⚠️');
                return;
            }

            // Image handling
            const imgInput = document.getElementById('prod-image');
            const file = imgInput.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const newProduct = {
                        id: Date.now(), // Generate unique ID
                        name: name,
                        price: price,
                        category: category,
                        image: reader.result, // Base64 string
                        rating: "4.5", // Default rating for new products
                        sizes: sizes
                    };

                    products.push(newProduct);
                    saveProducts();

                    renderStats();
                    renderProductsTable();

                    // Close modal and reset form
                    document.getElementById('add-product-modal').classList.add('hidden');
                    document.getElementById('add-product-modal').classList.remove('flex');
                    addProductForm.reset();

                    showToast('Product added successfully! ✨');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Check logout button
    const logoutBtn = document.getElementById('admin-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('mamasBabyAdmin');
            window.location.href = 'index.html';
        });
    }

    // Initial render
    renderStats();
    renderProductsTable();
    renderOrdersTable();
});
