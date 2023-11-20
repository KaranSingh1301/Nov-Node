let skip = 0;

document.addEventListener("click", function (event) {
  //add
  if (event.target.classList.contains("add_item")) {
    //event.preventDefault();
    const todoText = document.getElementById("create_field").value;
    console.log(typeof todoText);
    if (todoText.length === 0) {
      alert("Please enter the todo text");
    }

    axios
      .post("/create-item", { todo: todoText })
      .then((res) => {
        if (res.data.status !== 201) {
          alert(res.data.message);
          return;
        }

        document.getElementById("create_field").value = "";
        return;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  //edit
  else if (event.target.classList.contains("edit-me")) {
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
  }
  //delete
  else if (event.target.classList.contains("delete-me")) {
    const id = event.target.getAttribute("data-id");

    axios
      .post("/delete-item", { id })
      .then((res) => {
        if (res.data.status !== 200) {
          alert(res.data.message);
        }

        event.target.parentElement.parentElement.remove();
        return;
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }
  //show more
  else if (event.target.classList.contains("show_more")) {
    genrateTodos();
  }
});

window.onload = genrateTodos();

function genrateTodos() {
  console.log(skip);
  axios
    .get(`/pagination_dashboard?skip=${skip}`)
    .then((res) => {
      console.log(res.data.data);
      const todos = res.data.data;

      if (todos.length === 0) {
        alert("No more todos to show");
      }

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

      skip += todos.length;

      return;
    })
    .catch((err) => {
      console.log(err);
    });
}
