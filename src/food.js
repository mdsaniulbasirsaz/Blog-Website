

// document.addEventListener('DOMContentLoaded', loadFoodBlogs);

async function loadFoodBlogs() {
    try {
        const response = await fetch('/get-food');
        const foods = await response.json();

        const blogContainer = document.getElementById('blogContainer');
        blogContainer.innerHTML = '';  // Clear the container before inserting new cards

        foods.forEach(food => {
            const card = document.createElement('div');
            card.className = 'col-sm-6 col-12 col-md-6 col-lg-4 text-justify-content mt-3';
            
            card.innerHTML = `
                <div class="card text-justify-content" style="width: 18rem;">
                    <img src="${food.image}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title mb-0" id="category">${food.category}</h5>
                        <small id="date">${new Date(food.date).toLocaleDateString()}</small>
                        <p class="card-text" id="blogTitle">${food.blogTitle}</p>
                        <p>by <strong id="name" style="font-size: 14px;">${food.name}</strong></p>    
                    </div>
                </div>
            `;

            blogContainer.appendChild(card);
        });



    } catch (error) {
        console.error('Error loading food blogs:', error);
    }
}

// document.addEventListener('DOMContentLoaded', loadFoodBlogs);
document.addEventListener('DOMContentLoaded', function () {
    loadFoodBlogs(); // Load blogs when the page is ready

    // Event delegation for dynamically loaded content
    $('#staticBackdrop').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget); // Button that triggered the modal
        const blogId = button.data('blogid'); // Extract info from data-* attributes

        loadBlogDetails(blogId); // Fetch and load blog details
    });
});