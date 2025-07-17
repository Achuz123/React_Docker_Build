import React, { useState, useEffect } from "react";

// A custom hook for managing state with localStorage
function useLocalStorage(key, initialValue) {
  // Get stored value from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Update localStorage whenever the state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

// Main App Component
export default function App() {
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [inputValue, setInputValue] = useState("");

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Add a new task
  const addTask = () => {
    if (inputValue.trim() === "") {
      return; // Don't add empty tasks
    }
    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setInputValue(""); // Clear input field
  };

  // Handle key press for adding task with "Enter"
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  // Toggle task completion status
  const toggleTaskCompletion = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Get a count of completed tasks for a progress message
  const completedTasksCount = tasks.filter((task) => task.completed).length;

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-start font-sans pt-10">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full">
        {/* Header Section */}
        <h1 className="text-4xl font-bold text-cyan-400 mb-2">
          Daily Task Planner
        </h1>
        <p className="text-gray-400 mb-6">
          Stay organized, one task at a time.
        </p>

        {/* Input Section */}
        <div className="flex space-x-2 mb-6">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Add a new task..."
            className="w-full bg-gray-700 text-white placeholder-gray-400 border-2 border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
          />
          <button
            onClick={addTask}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-5 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300"
          >
            Add
          </button>
        </div>

        {/* Task List Section */}
        <div className="space-y-3 text-left">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-4 rounded-lg transition ${
                  task.completed ? "bg-gray-700 opacity-60" : "bg-gray-900"
                }`}
              >
                <div className="flex items-center">
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className="mr-4 focus:outline-none"
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 ${
                        task.completed
                          ? "border-green-400 bg-green-400"
                          : "border-gray-500"
                      } flex items-center justify-center`}
                    >
                      {task.completed && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      )}
                    </div>
                  </button>
                  <span
                    className={`flex-grow ${
                      task.completed
                        ? "line-through text-gray-500"
                        : "text-white"
                    }`}
                  >
                    {task.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-pink-500 hover:text-pink-400 font-bold transition-transform transform hover:scale-110 focus:outline-none"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p>No tasks yet. Add one to get started!</p>
            </div>
          )}
        </div>

        {/* Footer with Progress */}
        {tasks.length > 0 && (
          <div className="mt-6 text-sm text-gray-400">
            <p>
              {completedTasksCount} of {tasks.length} tasks completed.
            </p>
          </div>
        )}
      </div>
      <footer className="mt-8 text-gray-500 text-sm">
        <p>Your tasks are saved locally.</p>
      </footer>
    </div>
  );
}
