import "./App.css";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPencilAlt,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

function App() {
  const [todoData, setTodoData] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!todoData) {
      getToDos();
    }
  });

  const getToDos = async () => {
    const response = await fetch(`${API_ENDPOINT}/todo`);
    var newTodos = await response.json();
    setTodoData(newTodos.rows);
  };

  const handleSubmit = async (values) => {
    await fetch(`${API_ENDPOINT}/todo`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    getToDos();
    modalDisplay(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(e.target.value, e.target.name);
  };

  const deleteTodo = async (id) => {
    await fetch(`${API_ENDPOINT}/todo`, {
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
    await fetch(`${API_ENDPOINT}/todo`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, completed: completed }),
    });
    getToDos();
  };

  const modalDisplay = (isDisplayed) => {
    setModalVisible(isDisplayed);
  };

  return (
    <div className="App">
      <button id="add" onClick={() => modalDisplay(true)}>
        +
      </button>
      <header className="App-header">
        <h1 id="header-title">To-Do:</h1>
      </header>

      {modalVisible && (
        <form className="App-form" onSubmit={handleSubmit}>
          <p>Title:</p>
          <input
            value={formData.name}
            type="text"
            name="name"
            onChange={handleChange}
            id="input-title"
          ></input>
          <p>Notes:</p>
          <textarea
            value={formData.description}
            onChange={handleChange}
            name="description"
            maxlength="250"
          ></textarea>
          <div className="horizontal-button-pair">
            <button onClick={() => modalDisplay(false)}>Cancel</button>
            <button type="submit">Submit</button>
          </div>
        </form>
      )}

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
                <div className="grid-card-container">
                  <span
                    style={
                      toDo.completed
                        ? { color: "#4e7026" }
                        : { color: "#40689c" }
                    }
                  >
                    {/* Style h4 object manually vs having in header tag */}

                    <span title={toDo.name}>{toDo.name}</span>
                  </span>
                  <div id="scroll">{toDo.description}</div>
                </div>
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
