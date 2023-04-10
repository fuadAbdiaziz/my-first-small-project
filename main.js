
function renderListings(listing) {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="card" style="width: 18rem;">
        <img src="${listing.image}" class="card-img-top">
        <div class="card-body">
          <h5 class="card-title">${listing.description}</h5>
          <h5 class="card-title">Ksh ${listing.price}</h5>
          <p class="card-text">${listing.city}</p>
          <button id="button" class="btn btn-primary"><i class="fa fa-eye" aria-hidden="true"></i>Go somewhere</button>
          <button id="delete" class="btn btn-primary"><i class="fa fa-trash" aria-hidden="true"></i>Delete</button>
        </div>
      </div>
    `;
    li.querySelector("#delete").addEventListener("click", () => {
      li.remove();
      deleteListings()
    });
    li.querySelector("#button").addEventListener("click", () => {
      li.innerHTML = `
        <div class="card-body" style="width: 18rem;">
          <img src="${listing.image}" class="card-img-top">
          <h5 class="card-title">${listing.description}</h5>
          <p class="card-text">Ksh ${listing.price}</p>
          <p class="card-text">${listing.city}</p>
          <h5 class="card-brand">Country of origin: ${listing.address}</h5>
          <h5 class="card-brand">Type: ${listing.state}</h5>
          <p class="card-text">Available quantity is ${listing.zip}</p>
          <button id="edit" class="btn btn-primary"><i class="fa fa-pencil" aria-hidden="true"></i>Edit</button>
          <button id="buy" class="btn btn-primary">Buy Residence</button>
        </div>
      `;
      li.querySelector("#edit").addEventListener("click", () => {
        listing.price -= 1000;
        li.querySelector(".card-title").textContent = listing.description;
        li.querySelector(".card-text").textContent = `Ksh ${listing.price}`;
      });
      li.querySelector("#buy").addEventListener("click", () => {
        const selectedListing = {
          image: listing.image,
          description: listing.description,
          price: listing.price,
          city: listing.city,
          address: listing.address,
          state: listing.state,
          zip: listing.zip,
          id: listing.id,
        };
        const buyLi = document.createElement("li");
        buyLi.dataset.id = selectedListing.id;
        buyLi.innerHTML = `
          <img src="${selectedListing.image}" alt="${selectedListing.price}">
          <h3>${selectedListing.description}</h3>
          <button data-id="${selectedListing.id}" class="remove-btn">Remove from Buy Residence</button>
        `;
        buyLi.querySelector(".remove-btn").addEventListener("click", (event) => {
          const id = event.target.dataset.id;
          const selectedBuyLi = document.querySelector(`[data-id="${id}"]`);
          selectedBuyLi.remove();
        });
        document.querySelector("#favorites").append(buyLi);
        li.remove();
      });
    });
    document.querySelector("#lists").append(li);
  }
  
  function fetchListings() {
    fetch(" http://localhost:3000/listings")
      .then((response) => response.json())
      .then((listings) => listings.forEach(renderListings))
      .catch((error) => console.error(error));
  }
  
function createListing(listing){
    fetch("http://localhost:3000/listings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(listing)
    })
    .then(listing => {
        renderListings(listing);
        document.querySelector("#create-listing-form").reset(); // Clear the form fields
        const successMessage = document.createElement("p");
        successMessage.textContent = "Listing created successfully!";
        document.querySelector("#create-listing-form").insertAdjacentElement("afterend", successMessage);
        setTimeout(() => successMessage.remove(), 3000); // Remove the success message after 3 seconds
    })
    .catch(error=>console.error(error))
}

function updateListing(id, listing){
    fetch(`http://localhost:3000/listings/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(listing)
    })
    function updateListing(id, listing){
        fetch(`http://localhost:3000/listings/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(listing)
        })
        .then(response=>response.json())
        .then(updatedListing => {
            // Update the UI to display the updated listing information
            const li = document.querySelector(`li[data-id="${updatedListing.id}"]`);
            li.querySelector("img").src = updatedListing.image;
            li.querySelector("img").alt = updatedListing.price;
            li.querySelector("h3").textContent = updatedListing.description;
    
            // Perform additional actions after updating the listing
        })
        .catch(error=>console.error(error))
    }
    
}


document.addEventListener('DOMContentLoaded', () => {
    fetchListings();

   
    // Add event listener for deleting a listing
    document.querySelector("#lists").addEventListener("click", event => {
        if (event.target.matches("button")) {
            const id = event.target.dataset.id;
            deleteListings(id);
        }
    });
});
// function to collect data
let formData;

function collectFormData() {
  let form = document.querySelector("#form")
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    formData = {
      image: e.target.image.value,
      name: e.target.description.value,
      price: e.target.price.value,
      description: e.target.city.value,
      address: e.target.address.value,
      zip: e.target.zip.value,

    }
    postData()
  })
}
collectFormData()

// POST to database
function postData() {
  fetch("http://localhost:3000/listings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
  .then(res => res.json())
  .then(products => console.log(products))
}
// Function to delete product
function deleteListings(id) {
    fetch(`http://localhost:3000/listings/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type" : "application/json"
      }
    })
    .then(res => res.json())
    .then(data => console.log(data))
      
  }
  function editListings(id) {
    fetch(`http://localhost:3000/listings/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type" : "application/json"
      }
    })
    .then(res => res.json())
    .then(data => console.log(data))
      
  }
  