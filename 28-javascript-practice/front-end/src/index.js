console.log('HELP US!')


document.addEventListener("DOMContentLoaded", function(){
  const task_url = "http://localhost:3000/tasks"
  let taskList = document.getElementById("task-list")
  let completedTaskList = document.getElementById("completed-task-list")
  let taskForm = document.getElementById("task-form")
  let count = 150

  //get all tasks
  function fetchTasks (){
    fetch(task_url).then(res => res.json()).then(json => {
      renderAllTasks(json)
    })
  }
  //add HTML to tasks
  function renderTasks(task){
    if (task.completed === false) {
      taskList.innerHTML += `<div class= "task" id="${task.id}"><input type="checkBox" id="${task.id}-check">
      <div class="description"><b>Task Description:</b> ${task.description}</div>
      <p class="priority"><b>Priority:</b> ${task.priority}</p></input></div>`
    }else {
      completedTaskList.innerHTML += `<div class="task description" id="${task.id}">
        <b>Task Description:</b> ${task.description}
        <button type="button" id = "delete-task-button-for-${task.id}" name="button">Press Here to Remove this Task.</button>
        <p class="priority"><b>Priority:</b> ${task.priority}</p></div>`
    }
  }

  function renderAllTasks(json){
    json.forEach((task)=> {
      renderTasks(task)
    })
  }
  //move completed tasks
  function renderCompletedTasks(json){
    document.getElementById(`${json.id}`).remove()
    renderTasks(json)
  }
  //allow task to be checked off complete
  function completeTask(e){
    let taskId = e.target.id.split("-check")[0]
    let configuration = {
      method: "PATCH",
      headers:{
        "content-type": "application/json"
      },
      body: JSON.stringify({completed: true})
    }
    fetch(task_url+"/"+taskId, configuration).then(res=> res.json()).then(json=> renderCompletedTasks(json))
  }
  //change button to render the form for a new task
  function renderTaskForm(e){
    if (e.target === document.getElementById("new-task-button")){
      taskForm.innerHTML = `<form class="create-new-task" action="index.html" method="post">
        <label>Description of Task:</label><br>
        <input type="text" name="task-description" placeholder="Task description here..."><br>
        <input type="text" name="task-priority" placeholder="Priority Level"><br>
        <input type="submit" id="submit-new-task">
      </form>`
    }
  }
  //hides form
  function hideForm(){
      taskForm.innerHTML = `<button type="button" id = "new-task-button" name="button">Press Here to Add a Task.</button>`
  }
  //add a task to the DB
  function createNewTask(e){
    e.preventDefault()
    let taskDescription = e.target[0].value
    let taskPriority = e.target[1].value
    let configuration = {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({description: taskDescription, priority: taskPriority})
    }
    fetch(task_url, configuration).then(res => res.json()).then(json=> renderTasks(json))
    window.setTimeout(hideForm, 500)
  }
  //delete task
  function deleteTask(e){
    if (e.target.tagName === "BUTTON"){
      let taskId = e.target.id.split("delete-task-button-for-")[1]
      let configuration = {
        method: "DELETE"
      }
      fetch(task_url+"/"+taskId, configuration)
      document.getElementById(taskId).remove()
    }
  }

  function countdown(){
    document.getElementById("countdown").innerText = count
    --count
  }

  function boom(){
    alert("BOOOOOOMMMMMM!!!!!")
  }

  function setCountdown(){
    window.setInterval(countdown, 1000)
    window.setTimeout(boom, 150000)
  }

  taskList.addEventListener("click", completeTask)
  taskForm.addEventListener("click", renderTaskForm)
  taskForm.addEventListener("submit", createNewTask)
  completedTaskList.addEventListener("click", deleteTask)
  fetchTasks()
  setCountdown()
})
