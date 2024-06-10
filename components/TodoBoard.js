import homePageStyles from "../styles/HomePage.module.css";
import moment from "moment";
import TodoItem from "../components/TodoItem";
import { useContext, useState } from "react";
import { db } from "../firebase/main";
import UserContext from "../userContext";

export default function TodoBoard({ localMode, fullTodoList, todosDate, todos, setFullTodos }) {
  //check if date is past
  const todayDate = moment(new Date());
  const dateDiff = moment(todosDate).diff(todayDate, "days");

  //new todo form handler
  const [newTodo, setNewTodo] = useState("");

  //getting current user email from context
  const { currentUserEmail } = useContext(UserContext);

  //action performer to reuse same code
  const actionPerformer = (actionType, indexOfTodo) => {
    const indexOfBoard = fullTodoList.findIndex((e) => e.date === todosDate);
    const fullTodoListCopy = [...fullTodoList];
    const boardTodos = [...(fullTodoList[indexOfBoard]?.todos || [])];

    //new todo
    const newTodoObject = { title: newTodo, completed: false };

    //for final data
    let finalUpdatedTodoList = [];

    switch (actionType) {
      case "createnew":
        finalUpdatedTodoList = [...todos, newTodoObject];
        if (indexOfBoard >= 0) {
          fullTodoListCopy[indexOfBoard].todos = [...boardTodos, newTodoObject];
          setFullTodos(fullTodoListCopy);
        } else {
          setFullTodos((prev) => [...prev, { date: todosDate, todos: [newTodoObject] }]);
        }
        break;

      case "doundo":
        boardTodos[indexOfTodo].completed = !boardTodos[indexOfTodo].completed;
        fullTodoListCopy[indexOfBoard].todos = boardTodos;
        setFullTodos(fullTodoListCopy);
        finalUpdatedTodoList = boardTodos;

        break;

      case "delete":
        const filteredTodos = boardTodos.filter((_, i) => i !== indexOfTodo);
        fullTodoListCopy[indexOfBoard].todos = filteredTodos;
        setFullTodos(fullTodoListCopy);
        finalUpdatedTodoList = filteredTodos;

        break;
    }

    //update in db if user is logged in
    //else update in localstorage
    if (!localMode) {
      db.collection(currentUserEmail).doc(todosDate).set({ todos: finalUpdatedTodoList });
    } else {
      localStorage.setItem("todos", JSON.stringify(finalUpdatedTodoList));
    }
  };

  const AddNewTodo = (e) => {
    e.preventDefault();
    actionPerformer("createnew");
    setNewTodo("");
  };

  return (
    <>
      {/* date */}
      <p style={dateDiff < 0 ? { color: "grey", textAlign: "center" } : { textAlign: "center" }}>{todosDate}</p>

      {/* todo list*/}
      <div className={homePageStyles.todos}>
        {todos.map((todo, i) => {
          return (
            <TodoItem
              key={i}
              index={i}
              todo={todo}
              date={todosDate}
              doUndo={(indexOfTodo) => actionPerformer("doundo", indexOfTodo)}
              deleteTodo={(indexOfTodo) => actionPerformer("delete", indexOfTodo)}
            />
          );
        })}
      </div>

      {/*new todo input*/}
      <form onSubmit={AddNewTodo} style={todos.length === 17 ? { display: "none" } : null}>
        <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
      </form>

      {/*dummy lines*/}
      <div>
        {[...Array(17 - todos.length)].map((_, i) => {
          return <li key={i}></li>;
        })}
      </div>
    </>
  );
}
