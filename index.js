let cardsData = [];
let currentFilter = "all";
const gridContainer = document.getElementById("grid");
const filterButtons = document.querySelectorAll('[data-filter]');

const toggle = document.querySelector("#theme-toggle");
const root = document.documentElement;

function toggleTheme(){
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark){
        root.removeAttribute('data-theme');
    } else {
        root.setAttribute('data-theme', 'dark');
    }
};
 
toggle.addEventListener('click', toggleTheme);
toggle.addEventListener('keydown', (e) =>{
    if (e.key === 'Enter' || e.key === " "){
        e.preventDefault();
        toggleTheme();
    }
});

// ======Filter Buttons======
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );
        button.classList.add("active");

        applyFilter();
        console.log("Current filter:", currentFilter);
    });

});

// ======Apply Filter======
function applyFilter() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (currentFilter === "all" || card.dataset.status === currentFilter
        ) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
        console.log(
            [...document.querySelectorAll('.card')]
                .map(c => c.dataset.status)
        );
    });
}

// ======Grid Container======
gridContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;

    // ======Remove card======
    if (e.target.classList.contains("remove-btn")) {
        const index = Array.from(gridContainer.children).indexOf(card);
        cardsData.splice(index, 1);
        renderCards();
        applyFilter();
    }
});

// ======Create Cards Function======
function createCard(item, index) {
    const card = document.createElement("div");
    card.className = `card ${item.isActive ? "active" : "inactive"}`;
    card.dataset.status = item.isActive ? "active" : "inactive";

    const img = document.createElement("img");
    img.src = item.logo;
    img.className = "img";

    const button = document.createElement("button");
    button.textContent = "Remove";
    button.className = "remove-btn";

    const cardText = document.createElement("div");
    cardText.className = "para";

    const btnContainer = document.createElement("div");
    btnContainer.className = "flex-card-btns";

    const cardFlex = document.createElement("div");
    cardFlex.className = "card-flex";

    const title = document.createElement("h2");
    title.textContent = item.name;

    const description = document.createElement("p");
    description.textContent = item.description;

    const toggleBtn = document.createElement("label");
    toggleBtn.className = "switch ";
    // toggle-btn

    const toggleInput = document.createElement("input");
    toggleInput.type = "checkbox";
    toggleInput.checked = item.isActive;

    const slider = document.createElement("span");
    slider.className = "slider round";

    // ======Append Child======
    card.appendChild(cardFlex);
    card.appendChild(btnContainer);
    cardText.appendChild(title);
    cardText.appendChild(description);
    cardFlex.appendChild(img)
    cardFlex.appendChild(cardText);
    toggleBtn.appendChild(toggleInput);
    toggleBtn.appendChild(slider);
    btnContainer.appendChild(button);
    btnContainer.appendChild(toggleBtn);

    toggleInput.addEventListener("change", () => {
        toggleCard(index);
    });
    return card;
}

// ======Toggle Card Function======
function toggleCard(index) {
    cardsData[index].isActive = !cardsData[index].isActive;
    renderCards();
    applyFilter();
}

// ======Render Cards======
function renderCards() {
    gridContainer.innerHTML = "";
    cardsData.forEach((item, index) => {
        const card = createCard(item, index);
        gridContainer.appendChild(card);
    });
}

// ======Fetch Data Json======
fetch("data.json")
    .then(response => response.json())
    .then(data => {
        cardsData = data;
        console.log(data);
        renderCards();
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });

