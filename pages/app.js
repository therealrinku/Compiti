import { useState, useEffect, useContext } from "react";
import moment from "moment";
import HomeNav from "../components/HomeNav";
import homeStyles from "../styles/HomePage.module.css";
import TodoBoard from "../components/TodoBoard";
import { db } from "../firebase/main";
import Spinner from "../components/Spinner";
import UserContext from "../userContext";
import Meta from "../components/Meta";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useRouter } from "next/router";
import Link from "next/link";

export default function HomePage() {
  //date stuffs
  const [currentDate, setCurrentDate] = useState(new Date());
  const [datePlus, setDatePlus] = useState(0);
  const createDate = (daysToAdd) => {
    return moment(currentDate).add({ days: daysToAdd }).format("dddd, MMMM D YYYY");
  };
  //creating dates depending on currentDate plus addedDate
  const dates = [datePlus, datePlus + 1, datePlus + 2, datePlus + 3].map((e) => createDate(e));

  //all todos storage
  const [todos, setTodos] = useState([]);

  //loading handler
  const [loading, setLoading] = useState(false);

  const { currentUserEmail, setEmailAddress } = useContext(UserContext);

  const [darkMode, setDarkMode] = useState(true);

  const router = useRouter();

  useEffect(() => {
    //switching automatically to light mode.
    const lightMode = localStorage.getItem("lightMode");
    if (lightMode === "ON") {
      setDarkMode(false);
    }

    //getting all todo list for all dates from db
    //if user is logged in
    if (currentUserEmail) {
      db.collection(currentUserEmail)
        .get()
        .then((docs) => {
          docs.forEach((doc) => {
            setTodos((prev) => [...prev, { date: doc.id, todos: doc.data()?.todos || [] }]);
          });
          setLoading(false);
        });

      //try to load from localstorage if user is not logged in
    } else {
      const locallySavedTodos = JSON.parse(localStorage.getItem("todos"));
      if (locallySavedTodos) {
        setTodos(locallySavedTodos);
      }
    }
  }, []);

  const onDragEnd = (data) => {
    const { source, destination } = data;
    if (source && destination) {
      const indexOfSourceBoard = todos.findIndex((e) => e.date === source.droppableId);
      const indexOfDestinationBoard = todos.findIndex((e) => e.date === destination.droppableId);

      const fullTodoListCopy = [...todos];
      const sourceBoardTodos = [...todos[indexOfSourceBoard]?.todos];
      const destinationBoardTodos = [...(todos[indexOfDestinationBoard]?.todos || [])];
      //switching positions
      const sourceTodo = sourceBoardTodos[source.index];
      const destionationTodo = destinationBoardTodos[destination.index];
      sourceBoardTodos[source.index] = destionationTodo;
      destinationBoardTodos[destination.index] = sourceTodo;
      //removing from source and adding to the destination
      fullTodoListCopy[indexOfSourceBoard].todos.splice(source.index, 1);
      if (fullTodoListCopy[indexOfDestinationBoard]?.todos) {
        fullTodoListCopy[indexOfDestinationBoard].todos.splice(destination.index, 0, sourceTodo);
      } else {
        fullTodoListCopy.push({ date: destination.droppableId, todos: [sourceTodo] });
      }

      setTodos(fullTodoListCopy);

      const updatedSourceTodos = fullTodoListCopy[indexOfSourceBoard].todos;
      const indexOfDestinationBoardUpdated = fullTodoListCopy.findIndex((e) => e.date === destination.droppableId);
      const updatedDestionationTodos = fullTodoListCopy[indexOfDestinationBoardUpdated].todos;

      //update in db if user is loggedin
      //else update in localstorage
      if (currentUserEmail) {
        db.collection(currentUserEmail).doc(destination.droppableId).set({ todos: updatedDestionationTodos });

        if (source.droppableId !== destination.droppableId) {
          db.collection(currentUserEmail).doc(source.droppableId).set({ todos: updatedSourceTodos });
        }
      } else {
        localStorage.setItem("todos", fullTodoListCopy);
      }
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);

    if (darkMode) localStorage.setItem("lightMode", "ON");
    else localStorage.removeItem("lightMode");
  };

  const handleLogout = () => {
    if (currentUserEmail) {
      localStorage.setItem("loginToken", null);
      setEmailAddress("");
    }

    router.push("/");
  };

  return (
    <>
      <Meta />
      {loading ? (
        <Spinner />
      ) : (
        <div style={{ marginTop: "3vh" }} className={darkMode ? homeStyles.darkMode : null}>
          {/*option section*/}
          <HomeNav
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            onLogout={handleLogout}
            setDatePlus={setDatePlus}
            darkMode={darkMode}
            setDarkMode={toggleDarkMode}
          />

          {/*todo boards*/}
          <DragDropContext onDragEnd={onDragEnd}>
            <div className={homeStyles.todosBoard}>
              {dates.map((e, i) => {
                return (
                  <Droppable droppableId={e} key={i}>
                    {(provided, snapshot) => (
                      <section ref={provided.innerRef}>
                        <TodoBoard
                          localMode={!currentUserEmail}
                          todosDate={e}
                          fullTodoList={todos}
                          setFullTodos={setTodos}
                          todos={todos[todos.findIndex((td) => td.date === e)]?.todos || []}
                        />
                        {provided.placeholder}
                      </section>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </DragDropContext>
        </div>
      )}

      {!currentUserEmail && (
        <p
          style={{
            position: "fixed",
            padding: "0 25px",
            bottom: 0,
            color: "white",
            fontSize: 10,
            textAlign: "center",
            width: "100%",
          }}
        >
          Note: currently all your todos are saved locally. To make sure they don't get lost, please{" "}
          <Link href="/login">login.</Link>
        </p>
      )}

      <style jsx global>{`
        body,
        html {
          background: ${darkMode ? "#222831" : "white"} !important;
        }
      `}</style>
    </>
  );
}
