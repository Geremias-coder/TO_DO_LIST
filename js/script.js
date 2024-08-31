// Seleciona elementos do DOM com base no seletor CSS fornecido. Esses elementos são armazenados em variáveis para facilitar a manipulação ao longo do código.
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");  
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

// oldInputValue: Armazena o valor antigo de uma tarefa quando está sendo editada. Isso é necessário para atualizar a tarefa corretamente no armazenamento local.
let oldInputValue;




// Cria um novo item de tarefa e adiciona à lista de tarefas. text: O texto da tarefa. done: Se a tarefa está concluída (0 ou 1). save: Se a tarefa deve ser salva no armazenamento local (por padrão é 1).
// Funcionalidade : Cria um novo elemento <div> para a tarefa. Adiciona um título (<h3>) com o texto da tarefa. 
// Adiciona botões para concluir, editar e remover a tarefa. Adiciona a tarefa à lista e, se necessário, salva no armazenamento local.

const saveTodo = (text, done = 0, save = 1) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  // Utilizando dados da localStorage
  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTodoLocalStorage({ text, done: 0 });
  }

  todoList.appendChild(todo);

  todoInput.value = "";
};

// Propósito: Alterna entre os formulários de adição e edição, além de ocultar ou mostrar a lista de tarefas. 
// Funcionalidade: Usa classList.toggle para adicionar ou remover a classe hide que controla a visibilidade dos formulários e da lista.
const toggleForms = () => { 
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};
// parâmetro "text" ( Novo texto para a tarefa,  Atualiza o texto de uma tarefa existente ) 
const updateTodo = (text) => {   
  const todos = document.querySelectorAll(".todo"); 

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;

      // Utilizando dados da localStorage
      updateTodoLocalStorage(oldInputValue, text);
    }
  });
};



// Filtra tarefas com base no texto de pesquisa. 
// Verifica se o texto da tarefa contém o texto de pesquisa e exibe ou oculta as tarefas com base nisso
const getSearchedTodos = (search) => {     
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => { 
    const todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    todo.style.display = "flex";

    console.log(todoTitle);

    if (!todoTitle.includes(search)) {
      todo.style.display = "none";
    }
  });
};

// Filtra tarefas com base no critério selecionado.
// Exibe todas as tarefas, apenas as concluídas ou apenas as não concluídas, com base no valor do filtro.
const filterTodos = (filterValue) => {  
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));

      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );

      break;

    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );

      break;

    default:
      break;
  }
};



todoForm.addEventListener("submit", (e) => { // Adiciona uma nova tarefa quando o formulário de tarefa é enviado.
  e.preventDefault(); 

  const inputValue = todoInput.value;

  if (inputValue) {
    saveTodo(inputValue);
  }
});

document.addEventListener("click", (e) => { // Manipula ações de clique para concluir, remover ou editar tarefas.
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText || "";
  }

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");

    updateTodoStatusLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();

    // Utilizando dados da localStorage
    removeTodoLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("edit-todo")) { 
    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTodo(editInputValue); 
  }

  toggleForms();
});

searchInput.addEventListener("keyup", (e) => { // Atualiza a visualização das tarefas com base no texto digitado na barra de pesquisa.
  const search = e.target.value;

  getSearchedTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filterTodos(filterValue);
});

// Obtém a lista de tarefas do armazenamento local
const getTodosLocalStorage = () => {  // Retorna um array de tarefas armazenadas ou um array vazio se não houver dados. 
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
};

const loadTodos = () => {  // Carrega as tarefas do armazenamento local e adiciona-as à lista na página.
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  });
};

const saveTodoLocalStorage = (todo) => { // Salva uma nova tarefa no armazenamento local.
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => { // Remove uma tarefa do armazenamento local com base no texto da tarefa.
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.text != todoText);

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

const updateTodoStatusLocalStorage = (todoText) => { // Atualiza o status de conclusão de uma tarefa no armazenamento local.
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoText ? (todo.done = !todo.done) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoLocalStorage = (todoOldText, todoNewText) => { //  Atualiza o texto de uma tarefa existente no armazenamento local.
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoOldText ? (todo.text = todoNewText) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

loadTodos();  //Inicialização : Carrega as tarefas armazenadas localmente quando a página é carregada para garantir que as tarefas anteriores sejam exibidas.