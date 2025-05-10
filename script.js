$(function () {
    $.scrollUp({
        scrollImg: true,
        scrollDistance: 30,
    });
});
//search
document.getElementById("searchForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const input = document.getElementById("searchInput").value.trim().toLowerCase();

    if (input === "cupcake" || input === "cupcakes") {
        window.location.href = "cupcakes.html";
    } else if (input === "cookie" || input === "cookies") {
        window.location.href = "cookies.html";
    } else if (input === "cake" || input === "cakes") {
        window.location.href = "cakes.html";
    } else {
        window.location.href = "notfound.html";
    }
});
//thankyou message
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("newsletterForm");
    const successMessage = document.getElementById("successMessage");
    const closeButton = successMessage.querySelector(".btn-close");
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const formData = new FormData(form);
  
      fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      }).then(response => {
        if (response.ok) {
          successMessage.style.display = "block";
          form.reset();
        } else {
          alert("Submission failed. Please try again.");
        }
      }).catch(error => {
        alert("Error occurred. Check your network.");
        console.error("Error:", error);
      });
    });
  
    closeButton.addEventListener("click", function () {
      successMessage.style.display = "none";
    });
  });
  
  //add to cart

  document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll('.btn.btn-outline-dark');
    
    // Function to handle adding products to the cart
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default action (if any)
            
            const card = this.closest('.card');
            const productName = card.querySelector('.card-title').textContent;
            // const productPrice = card.querySelector('.card-text').textContent.split(': ')[1]; // Extract price
            const rawPriceText = card.querySelector('.item-price').textContent;
            console.log('Raw price text:', rawPriceText);
            
const priceMatch = rawPriceText.match(/\d+(\.\d+)?/); // Matches "500" or "500.00"
const productPrice = priceMatch ? parseFloat(priceMatch[0]) : 0;

            const productCategory = card.querySelector('.card-img-top').alt; // Category is stored in the alt attribute of the image

            const product = {
                name: productName,
                price: productPrice,
                category: productCategory
            };
            
console.log('Added product:', product);
            addToCart(product);  // Add product to cart
            updateCartCount();    // Update the cart count immediately
        });
    });

    // Get cart from local storage or initialize an empty cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to add product to cart
    function addToCart(product) {
        // Check if the product already exists in the cart
        const existingProductIndex = cart.findIndex(item => item.name === product.name);
        
        if (existingProductIndex !== -1) {
            // If product already exists, increment the quantity
            cart[existingProductIndex].quantity += 1;
        } else {
            // If product doesn't exist, add to cart with quantity 1
            product.quantity = 1;
            cart.push(product);
        }

        // Save updated cart to local storage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Optionally, show a message that the item was added
        alert(`${product.name} has been added to your cart.`);
    }

    // Function to update cart count in navbar or anywhere else
    function updateCartCount() {
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }
    }

    // Optionally, you can add a view cart page where the cart items will be displayed.
    updateCartCount();  // Ensure the cart count is correct on page load
});
//cart view
document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById('cart-container');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-message">Your cart is empty.</p>';
        return;
    }

    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Remove</th>
                </tr>
            </thead>
            <tbody>
    `;

    let grandTotal = 0;

    cart.forEach((item, index) => {
        const price = parseFloat(item.price) || 0;
const subtotal = price * item.quantity;

        grandTotal += subtotal;

        tableHTML += `
            <tr data-index="${index}">
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>$${price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${subtotal.toFixed(2)}</td>
                <td><span class="btn-remove">✖</span></td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
        <h3 class="mt-4">Total: $${grandTotal.toFixed(2)}</h3>
    `;

    cartContainer.innerHTML = tableHTML;

    // Remove item on click
    const removeButtons = document.querySelectorAll('.btn-remove');
    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('tr');
            const index = parseInt(row.dataset.index);
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload(); // Refresh to show updated cart
        });
    });
});
//checkout
 // Load cart and inject into form
 document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const summary = document.getElementById("cart-summary");
    const cartDataInput = document.getElementById("cart-data");

    if (cart.length === 0) {
      summary.innerHTML = "<p>Your cart is empty.</p>";
      document.getElementById("checkout-form").style.display = "none";
      return;
    }

    let total = 0;
    let summaryHTML = "<ul>";

    const cartDetails = cart.map(item => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      summaryHTML += `<li>${item.name} (${item.quantity}) - $${subtotal.toFixed(2)}</li>`;
      return `${item.name} x ${item.quantity} = $${subtotal.toFixed(2)}`;
    });

    summaryHTML += `</ul><strong>Total: $${total.toFixed(2)}</strong>`;
    summary.innerHTML = summaryHTML;

    // Set hidden cart input value
    cartDataInput.value = cartDetails.join(", ") + `. Total: $${total.toFixed(2)}`;
  });
//checkout message
