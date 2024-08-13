
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
                         <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#foodModal">
                         Read More
                        </button>
                        <div class="modal fade" id="foodModal" tabindex="-1" role="dialog" aria-labelledby="foodModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="foodModalLabel">${food.blogTitle}</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <img src="${food.image}" class="img-fluid">
                                    <p>${food.additionalText}</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                        </div>

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
    loadFoodBlogs();
    
});
