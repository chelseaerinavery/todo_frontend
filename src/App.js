import "./App.css";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPencilAlt,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";

function App() {
  const [todoData, setTodoData] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  useEffect(() => {
    if (!todoData) {
      getToDos();
    }
  });

  const getToDos = async () => {
    const response = await fetch(`http://localhost:3000/todo`);
    var newTodos = await response.json();
    setTodoData(newTodos);
  };

  const handleSubmit = async (values) => {
    await fetch("http://localhost:3000/todo", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    getToDos();
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(e.target.value, e.target.name);
  };

  const deleteTodo = async (id) => {
    await fetch("http://localhost:3000/todo", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    getToDos();
  };

  const completeTodo = async (id, completed) => {
    await fetch("http://localhost:3000/todo", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, completed: completed }),
    });
    getToDos();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>To-Do:</h2>
        <button id="add">+</button>
      </header>
      <form className="App-form" onSubmit={handleSubmit}>
        <p>Title:</p>
        <input
          value={formData.name}
          type="text"
          name="name"
          onChange={handleChange}
        ></input>
        <p>Decription:</p>
        <textarea
          value={formData.description}
          onChange={handleChange}
          name="description"
        ></textarea>
        <button type="submit">Add</button>
      </form>
      <div className="flex">
        {todoData &&
          todoData.map((toDo) => {
            return (
              <div className="toDo">
                <FontAwesomeIcon
                  id="faTrash"
                  className="icon"
                  icon={faTrash}
                  onClick={() => deleteTodo(toDo.id)}
                />
                <FontAwesomeIcon
                  id={toDo.completed ? "faCheckCircle" : "faCircle"}
                  className="icon"
                  icon={toDo.completed ? faCheckCircle : faCircle}
                  onClick={() => completeTodo(toDo.id, !toDo.completed)}
                />
                {/* in p tag below -- Ensure if green text, green check and circle */}
                <p
                  style={
                    toDo.completed ? { color: "#27a147" } : { color: "#D91414" }
                  }
                >
                  {/* Style h4 object manually vs having in header tag */}

                  <h4>{toDo.name}</h4>
                </p>{" "}
                <p>{toDo.description}</p>
                <FontAwesomeIcon
                  id="faPencilAlt"
                  className="icon"
                  icon={faPencilAlt}
                  // onClick={() => deleteTodo(toDo.id)}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
