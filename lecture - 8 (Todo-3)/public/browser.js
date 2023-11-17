document.addEventListener("click", function (event) {
  if (event.target.classList.contains("add_item")) {
    console.log("Add item");
  } else if (event.target.classList.contains("edit-me")) {
    const id = event.target.getAttribute("data-id");
    const newData = prompt("Enter new todo text");

    axios
      .post("/edit-item", { id, newData })
      .then((res) => {
        console.log(res);
        event.target.parentElement.parentElement.querySelector(
          ".item-text"
        ).innerHTML = newData;
        return;
      })
      .catch((err) => {
        console.log(err);
        return;
      });

    console.log(id, newData);
  } else if (event.target.classList.contains("delete-me")) {
    console.log("delete");
  }
});

window.onload = genrateTodos();

function genrateTodos() {
  axios
    .get("/read-item")
    .then((res) => {
      console.log(res.data.data);
      const todos = res.data.data;

      document.getElementById("item_list").insertAdjacentHTML(
        "beforeend",
        todos
          .map((item) => {
            return `
          <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                  <span class="item-text"> ${item.todo}</span>
                  <div>
                  <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                  <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
              </div>
          </li>`;
          })
          .join("")
      );

      return;
    })
    .catch((err) => {
      console.log(err);
    });
}
