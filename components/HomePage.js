import { useState, useEffect, useContext } from "react";
import moment from "moment";
import HomeNav from "../components/HomeNav";
import homeStyles from "../styles/HomePage.module.css";
import TodoBoard from "../components/TodoBoard";
import { db } from "../firebase/main";
import Spinner from "../components/Spinner";
import UserContext from "../userContext";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

export default function HomePage({ demoMode, demoDates }) {
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
  const [loading, setLoading] = useState(demoMode ? false : true);

  const { currentUserEmail } = useContext(UserContext);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    //switching automatically to dark mode.
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode === "ON") {
      setDarkMode(true);
    }

    //getting all todo list for all dates
    if (!demoMode) {
      db.collection(currentUserEmail)
        .get()
        .then((docs) => {
          docs.forEach((doc) => {
            setTodos((prev) => [...prev, { date: doc.id, todos: doc.data()?.todos || [] }]);
          });
          setLoading(false);
        });
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

      //update in db

      if (!demoMode) {
        db.collection(currentUserEmail).doc(destination.droppableId).set({ todos: updatedDestionationTodos });

        if (source.droppableId !== destination.droppableId) {
          db.collection(currentUserEmail).doc(source.droppableId).set({ todos: updatedSourceTodos });
        }
      }
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);

    if (!darkMode) localStorage.setItem("darkMode", "ON");
    else localStorage.removeItem("darkMode");
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div style={{ marginTop: "3vh" }} className={darkMode ? homeStyles.darkMode : null}>
          {/*option section*/}
          <HomeNav demoMode={demoMode} setDatePlus={setDatePlus} darkMode={darkMode} setDarkMode={toggleDarkMode} />

          {/*todo boards*/}
          <DragDropContext onDragEnd={onDragEnd}>
            <div className={homeStyles.todosBoard}>
              {dates.map((e, i) => {
                return (
                  <Droppable droppableId={e} key={i}>
                    {(provided, snapshot) => (
                      <section ref={provided.innerRef}>
                        <TodoBoard
                          demoMode={demoMode}
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

      <style jsx global>{`
        body,
        html {
          background: ${darkMode ? "#303030" : "white"} !important;
        }
      `}</style>
    </>
  );
}
