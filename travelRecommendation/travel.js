const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const searchInput = document.getElementById("searchInput");
const container = document.getElementById("destinations");
const localTimeDiv = document.getElementById("localTime");


let data; // we’ll load this from travel.json
let clockInterval;

// Function to clear results
function clearResults() {
  container.innerHTML = "";
  searchInput.value = "";
  localTimeDiv.classList.add("opacity-0", "pointer-events-none");
  if (clockInterval) clearInterval(clockInterval);
}

// Function to create a card
function createCard(title, imgUrl, desc,) {
  const card = document.createElement("div");
  card.className = "bg-white rounded-xl shadow-lg overflow-hidden";

  card.innerHTML = `
    <img src="${imgUrl}" alt="${title}" class="w-[30vw] h-60 object-cover">
    <div class="p-4">
      <h2 class="text-xl font-bold">${title}</h2>
      <p class="text-gray-600 mt-2">${desc}</p>
      <button class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">Visit</button>
    </div>
  `;
  container.appendChild(card);
}

// Function to handle search
function handleSearch() {
  const query = searchInput.value.toLowerCase().trim();

  container.innerHTML = ""; // clear old results
  localTimeDiv.innerHTML = "";

  if (!query) {
    container.innerHTML = "<p class='text-red-500'>Please enter a keyword.</p>";
    return;
  }

  let resultsFound = false;

  if (!data) {
    container.innerHTML = "<p class='text-red-500'>Data not loaded yet.</p>";
    return;
  }

  // Match beaches
  if (query === "beach" || query === "beaches") {
    data.beaches.forEach(beach => {
      createCard(beach.name, beach.imageUrl, beach.description);
    });
    resultsFound = true;
  }

  // Match temples
  else if (query === "temple" || query === "temples") {
    data.temples.forEach(temple => {
      createCard(temple.name, temple.imageUrl, temple.description);
    });
    resultsFound = true;
  }

  // Match countries
  else {
    data.countries.forEach(country => {
      if (country.name.toLowerCase() === query) {
        console.log("Searching for:", query);
        console.log("Country matched:", country.name);
        if (country.cities.length > 0) {
          console.log("First city timezone:", country.cities[0].timezone);
          showLocalTime(country.cities[0].timezone, country.name);
        }

        country.cities.forEach(city => {
          createCard(city.name, city.imageUrl, city.description, city.timezone);
        });
        resultsFound = true;
      }
    });
  }

  // No results
  if (!resultsFound) {
    container.innerHTML = `<p class="text-gray-600">No results found for "${query}".</p>`;
  }

}

// Load JSON using XMLHttpRequest
function loadData() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "travel_api.json", true); // make sure travel.json is in same folder

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      data = JSON.parse(xhr.responseText);
      console.log("Data loaded:", data);
    }
  };

  xhr.send();
}

// Event listeners
searchBtn.addEventListener("click", handleSearch);
clearBtn.addEventListener("click", clearResults);

// Load data on page load
window.onload = loadData;


// Function to show local time
function showLocalTime(timezone, placeName) {
  if (!timezone) {
     localTimeDiv.classList.add("opacity-0", "pointer-events-none");
    return;
  }

  localTimeDiv.classList.remove("opacity-0", "pointer-events-none"); // show div

  function updateClock() {
    const now = new Date();
    const options = { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const timeStr = new Intl.DateTimeFormat('en-US', options).format(now);
    localTimeDiv.innerHTML = `Local time in <strong>${placeName}</strong>: ${timeStr}`;
  }

  // First call
  updateClock();

  // Update every second (live clock)
  clockInterval = setInterval(updateClock, 1000);
}

