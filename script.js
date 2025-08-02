const username = prompt("Enter your username");

let wishlistItems = [];
let boardCovers = {};

const storedWishlist = localStorage.getItem(`wishlist_${username}`);
if (storedWishlist) {
    wishlistItems = JSON.parse(storedWishlist);
}

const storedCovers = localStorage.getItem(`boardCovers_${username}`);
if (storedCovers) {
    boardCovers = JSON.parse(storedCovers);
}

function addItem() {
    const name = document.getElementById('item-name').value;
    const price = document.getElementById('item-price').value;
    const link = document.getElementById('item-link').value;
    const image = document.getElementById('item-image').value;
    const category = document.getElementById('item-category').value.trim().toLowerCase();

    if (!name || !price || !link || !image || !category) {
        alert("Please fill in all fields.");
        return;
    }

    const item = { name, price, link, image, category };
    wishlistItems.push(item);

    localStorage.setItem(`wishlist_${username}`, JSON.stringify(wishlistItems));
    renderBoards();
    clearForm();
}

function renderBoards() {
    const container = document.getElementById('wishlist-boards');
    container.innerHTML = "";

    const categories = [...new Set(wishlistItems.map(item => item.category))];

    categories.forEach(category => {
        const board = document.createElement('div');
        board.className = 'board';

        board.onclick = () => {
        window.open(`wishlist.html?category=${encodeURIComponent(category)}`, '_blank');
        };

    const items = wishlistItems.filter(item => item.category === category);
    const coverImage = boardCovers[category] || (items.length > 0 ? items[0].image : "default-cover.jpg");
    const displayCategory = category.charAt(0).toUpperCase() + category.slice(1);

    const img = document.createElement('img');
    img.src = coverImage;
    img.alt = `${category} cover`;

    const title = document.createElement('h2');
    title.textContent = displayCategory;

    const button = document.createElement('button');
    button.textContent = "Edit Cover";
    button.onclick = (e) => {
      e.stopPropagation();
      editCover(category);
    };

    const deleteBoardBtn = document.createElement('button');
        deleteBoardBtn.textContent = "×";
        deleteBoardBtn.className = "delete-board-btn";
        deleteBoardBtn.onclick = (e) => {
            e.stopPropagation();
            if (confirm(`Are you sure you want to delete the "${displayCategory}" board and all its items?`)) {
                wishlistItems = wishlistItems.filter(item => item.category !== category);
                delete boardCovers[category];

                localStorage.setItem(`wishlist_${username}`, JSON.stringify(wishlistItems));
                localStorage.setItem(`boardCovers_${username}`, JSON.stringify(boardCovers));

                renderBoards();
            }
        };

    board.appendChild(deleteBoardBtn);
    board.appendChild(img);
    board.appendChild(title);
    board.appendChild(button);

    container.appendChild(board);
  });
}

function editCover(category) {
  const newCover = prompt("Enter new cover image URL for " + category + ":");
  if (newCover) {
    boardCovers[category] = newCover;

    localStorage.setItem(`boardCovers_${username}`, JSON.stringify(boardCovers));
    renderBoards();
  }
}

function clearForm() {
    document.getElementById('item-name').value = '';
    document.getElementById('item-price').value = '';
    document.getElementById('item-link').value = '';
    document.getElementById('item-image').value = '';
    document.getElementById('item-category').value = '';
}

renderBoards();
