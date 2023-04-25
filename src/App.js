import "./App.css";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPencilAlt,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { motion } from "framer-motion";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

function App() {
  const [todoData, setTodoData] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!todoData) {
      getToDos();
    }
  });

  const getToDos = async () => {
    const response = await fetch(`${API_ENDPOINT}/todo`);
    var newTodos = await response.json();
    setTodoData(newTodos.rows.sort((a, b) => a.completed - b.completed));
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

  const updateTodo = async (toDo) => {
    await fetch(`${API_ENDPOINT}/todo`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toDo),
    });
    getToDos();
  };

  const modalDisplay = (isDisplayed, toDo) => {
    if (toDo) {
      setFormData({
        id: toDo.id,
        name: toDo.name,
        description: toDo.description,
        completed: toDo.completed,
      });
      setEditing(true);
    } else {
      setFormData({ name: "", description: "" });
      setEditing(false);
    }
    setModalVisible(isDisplayed);
  };

  return (
    <div className="App">
      <button id="add" onClick={() => modalDisplay(true)}>
        +
      </button>
      <header className="App-header">
        <h1 id="header-title">To-Do ✍️</h1>
      </header>

      {modalVisible && (
        <motion.div
          style={{ zIndex: 2 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >

          <form
            className="App-form"
            onSubmit={editing ? () => updateTodo(formData) : handleSubmit}
          >
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
              maxLength="250"
            ></textarea>
            <div className="horizontal-button-pair">
              <button onClick={() => modalDisplay(false)}>Cancel</button>
              <button type="submit">Submit</button>
            </div>
          </form>
        </motion.div >
      )
      }

      <div className="flex">
        {todoData &&
          todoData.map((toDo) => {
            return (
              <div key={toDo.id} className="toDo">
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
                  onClick={() =>
                    updateTodo(
                      Object.assign(toDo, { completed: !toDo.completed })
                    )
                  }
                />

                <div className="grid-card-container">
                  <span
                    style={
                      toDo.completed
                        ? { color: "#4e7026" }
                        : { color: "#40689c" }
                    }
                  >
                    <span title={toDo.name}>{toDo.name}</span>
                  </span>
                  <div id="scroll">{toDo.description}</div>
                </div>
                <div className="icon-bottom-row">
                  <FontAwesomeIcon
                    id="faPencilAlt"
                    className="icon"
                    icon={faPencilAlt}
                    onClick={() => modalDisplay(true, toDo)}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div >
  );
}

export default App;
