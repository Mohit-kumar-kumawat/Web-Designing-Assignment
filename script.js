    const products = [
      { id: 1, name: "Pizza Margherita", price: 899, image: "pizza.png" },
      { id: 2, name: "Veggie Burger", price: 649, image: "burger.png" },
      { id: 3, name: "Sushi Platter", price: 1299, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80" },
      { id: 4, name: "Pasta Alfredo", price: 999, image: "pasta.png" },
      { id: 5, name: "Caesar Salad", price: 749, image: "salad.png" },
      { id: 6, name: "Chicken Wings", price: 1099, image: "chiken.png" },
      { id: 7, name: "Chocolate Cake", price: 599, image: "cake.png" },
      { id: 8, name: "Fruit Smoothie", price: 499, image: "smoothi.png" },
      { id: 9, name: "Grilled Sandwich", price: 699, image: "sandwitch.png" },
      { id: 10, name: "Falafel Wrap", price: 549, image: "wrap.png" }
    ];

    const cart = [];
    const ratings = {};

    function renderProducts(list = products) {
      const productList = document.getElementById('productList');
      productList.innerHTML = '';
      list.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x160?text=Image+Not+Found'" />
          <h3>${product.name}</h3>
          <p>₹${product.price.toFixed(2)}</p>
          <div class="stars" data-id="${product.id}">
            ${[1,2,3,4,5].map(i => `<span class="star" data-rating="${i}">&#9733;</span>`).join('')}
          </div>
          <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(div);
      });
      document.querySelectorAll('.stars').forEach(starGroup => {
        const id = starGroup.dataset.id;
        starGroup.addEventListener('click', e => {
          if (e.target.classList.contains('star')) {
            const rating = parseInt(e.target.dataset.rating);
            ratings[id] = rating;
            updateStars(starGroup, rating);
          }
        });
      });
    }

    function updateStars(container, rating) {
      container.querySelectorAll('.star').forEach(star => {
        const starRating = parseInt(star.dataset.rating);
        star.classList.toggle('filled', starRating <= rating);
      });
    }

    function addToCart(id) {
      const product = products.find(p => p.id === id);
      const existing = cart.find(p => p.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      renderCart();
    }

    function removeFromCart(id) {
      const index = cart.findIndex(item => item.id === id);
      if (index > -1) {
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
        } else {
          cart.splice(index, 1);
        }
        renderCart();
      }
    }

    function renderCart() {
      const cartItems = document.getElementById('cartItems');
      const cartTotal = document.getElementById('cartTotal');
      cartItems.innerHTML = '';
      let total = 0;
      cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`;
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => removeFromCart(item.id);
        li.appendChild(removeBtn);
        cartItems.appendChild(li);
        total += item.price * item.quantity;
      });
      cartTotal.textContent = total.toFixed(2);
    }

    function checkout() {
      if (cart.length === 0) {
        document.getElementById('checkoutMessage').textContent = 'Your cart is empty!';
        return;
      }
      document.getElementById('checkoutMessage').textContent = 'Thank you for your purchase!';
      cart.length = 0;
      renderCart();
    }

    document.getElementById('searchBar').addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase();
      const filtered = products.filter(p => p.name.toLowerCase().includes(query));
      renderProducts(filtered);
    });

    renderProducts();