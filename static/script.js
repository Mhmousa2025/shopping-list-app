// ========== Add Item ==========
document.getElementById("add-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("item-input").value.trim();
  const price = document.getElementById("price-input").value.trim();
  if (!name) return;

  const res = await fetch("/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item_name: name, price: price })
  });

  const data = await res.json();
  if (data.success) {
    addItemToDOM(data.item, data.index);
    document.getElementById("item-input").value = "";
    document.getElementById("price-input").value = "";
  }
});

// ========== Add Item to DOM ==========
function addItemToDOM(item, index) {
  const li = document.createElement("li");
  li.dataset.index = index;
  if (item.done) li.classList.add("done");

  li.innerHTML = `
    <span class="item-display">
      <strong>${item.item_name}</strong><br />
      <small>💰 ${item.price || "N/A"}</small>
    </span>
    <input class="edit-name" style="display:none;" value="${item.item_name}" />
    <input class="edit-price" style="display:none;" value="${item.price}" />
    <div class="actions">
      <button class="toggle-btn">✅</button>
      <button class="edit-btn">✏️</button>
      <button class="save-btn" style="display:none;">💾</button>
      <button class="delete-btn">🗑️</button>
    </div>
  `;
  document.getElementById("shopping-list").appendChild(li);
  setupItemEvents(li);
  updateItemIndices();
}

// ========== Item Event Bindings ==========
function setupItemEvents(li) {
  const index = li.dataset.index;

  li.querySelector(".toggle-btn").addEventListener("click", async () => {
    const res = await fetch(`/toggle/${index}`, { method: "POST" });
    const data = await res.json();
    if (data.success) {
      li.classList.toggle("done");
    }
  });

  li.querySelector(".delete-btn").addEventListener("click", async () => {
    const res = await fetch(`/delete/${index}`, { method: "POST" });
    if (res.ok) {
      li.remove();
      updateItemIndices();
    }
  });

  li.querySelector(".edit-btn").addEventListener("click", () => {
    li.querySelector(".item-display").style.display = "none";
    li.querySelector(".edit-name").style.display = "block";
    li.querySelector(".edit-price").style.display = "block";
    li.querySelector(".save-btn").style.display = "inline-block";
  });

  li.querySelector(".save-btn").addEventListener("click", async () => {
    const newName = li.querySelector(".edit-name").value.trim();
    const newPrice = li.querySelector(".edit-price").value.trim();
    const res = await fetch(`/edit/${index}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_name: newName, price: newPrice })
    });

    const data = await res.json();
    if (data.success) {
      li.querySelector(".item-display").innerHTML = `
        <strong>${newName}</strong><br />
        <small>💰 ${newPrice || "N/A"}</small>
      `;
      li.querySelector(".item-display").style.display = "block";
      li.querySelector(".edit-name").style.display = "none";
      li.querySelector(".edit-price").style.display = "none";
      li.querySelector(".save-btn").style.display = "none";
    }
  });
}

function updateItemIndices() {
  document.querySelectorAll("#shopping-list li").forEach((li, index) => {
    li.dataset.index = index;
  });
}

// ========== Tab Switcher ==========
function showTab(tabName) {
  document.getElementById("tab-new").style.display = tabName === "new" ? "block" : "none";
  document.getElementById("tab-history").style.display = tabName === "history" ? "block" : "none";
}

// ========== Save List ==========
document.getElementById("save-btn").addEventListener("click", async () => {
  const res = await fetch("/save", { method: "POST" });
  if (res.ok) {
    location.reload();
  }
});

// ========== Market Setter ==========
document.getElementById("market-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const marketName = document.getElementById("market-input").value.trim();
  if (!marketName) return;

  const res = await fetch("/set_market", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ market_name: marketName })
  });

  if (res.ok) {
    document.getElementById("current-market").innerText = "Market: " + marketName;
    document.getElementById("market-input").value = "";
  }
});

// ========== Previous List Actions ==========
async function deleteList(index) {
  const confirmed = confirm("Delete this list?");
  if (!confirmed) return;
  const res = await fetch(`/delete_list/${index}`, { method: "POST" });
  if (res.ok) location.reload();
}

function editPastItem(button, itemIndex, listIndex) {
  const li = button.closest("li");
  li.querySelector(".past-name").style.display = "none";
  li.querySelector(".past-price").style.display = "none";
  li.querySelector(".edit-past-name").style.display = "inline";
  li.querySelector(".edit-past-price").style.display = "inline";
  li.querySelector(".save-past-btn").style.display = "inline";
  button.style.display = "none";
}

async function savePastItem(button, itemIndex, listIndex) {
  const li = button.closest("li");
  const newName = li.querySelector(".edit-past-name").value.trim();
  const newPrice = li.querySelector(".edit-past-price").value.trim();

  const res = await fetch(`/edit_saved/${listIndex}/${itemIndex}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item_name: newName, price: newPrice })
  });

  if (res.ok) {
    li.querySelector(".past-name").innerText = newName;
    li.querySelector(".past-price").innerText = newPrice || "N/A";
    li.querySelector(".past-name").style.display = "inline";
    li.querySelector(".past-price").style.display = "inline";
    li.querySelector(".edit-past-name").style.display = "none";
    li.querySelector(".edit-past-price").style.display = "none";
    li.querySelector(".save-past-btn").style.display = "none";
    li.querySelector("button[onclick^='editPastItem']").style.display = "inline";
  }
}

// ========== Init ==========
document.querySelectorAll("#shopping-list li").forEach(setupItemEvents);
