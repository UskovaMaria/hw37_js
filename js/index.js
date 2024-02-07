$(document).ready(function () {
  const todoListEl = $('.todo-list');
 
  loadTodos();

  $('#addTodoBtn').on('click', function () {
    let newTodoText = $('#addTodoInput').val();
    addTodo(newTodoText);
  });

  $('.todo-list').on('click', '.delete-btn', function () {
    let todoId = $(this).parent().data('id');
    deleteTodo(todoId);
  });

  function loadTodos() {
    $.ajax({
      url: 'http://localhost:3000/todos',
      method: 'GET',
      success: function (data) {
        renderTodoList(data);
      }
    });
  }

  function renderTodoList(data) {
    let todoItems = data.map(function (item, index) {
      const todoItem = `
        <li class="todo-item" data-id="${item.id}">
          <span class="todo-item__number mr-1">${index + 1}</span>
          <input 
            class="todo-item__completed mr-1" 
            type="checkbox" 
            ${item.completed ? 'checked' : ''}
          >
          <p class="todo-item__text mr-1 ${item.completed ? ' todo-item__text_completed' : ''}">
            ${item.text}
          </p>
          <button class="todo-item__delBtn delete-btn">del</button>
        </li>
      `;
      return todoItem;
    }).join('');

    todoListEl.html(todoItems);

    $('.todo-item__completed').on('change', function () {
      const id = $(this).parent().data('id');
      const todo = data.find(function (item) {
        return item.id == id;
      });

      if (todo) {
        todo.completed = !todo.completed;
        updateTodo(todo);
      }
    });

    $('.todo-item__delBtn').on('click', function () {
      const id = $(this).parent().data('id');
      deleteTodo(id);
    });
  }

  function addTodo(text) {
    $.ajax({
      url: 'http://localhost:3000/todos',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ text: text, completed: false }),
      success: function () {
        loadTodos();
        $('#addTodoInput').val('');
      }
    });
  }

  function updateTodo(todo) {
    $.ajax({
      url: 'http://localhost:3000/todos/' + todo.id,
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(todo),
      success: function () {
        loadTodos();
      }
    });
  }

  function deleteTodo(id) {
    $.ajax({
      url: 'http://localhost:3000/todos/' + id,
      method: 'DELETE',
      success: function () {
        loadTodos();
      }
    });
  }
});

