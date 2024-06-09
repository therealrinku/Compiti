import { Fragment, useState } from "react";
import Backdrop from "./Backdrop";
import TodoDetailModal from "./TodoDetailModal";
import { Draggable } from "react-beautiful-dnd";

export default function Torobodoitem({ todo, date, index, doUndo, deleteTodo }) {
  const [showDetailModal, setShowDetailModal] = useState(false);

  //toggle detail modal
  const toggleDetailModal = () => {
    setShowDetailModal((prev) => !prev);
    //toggling overflow of body
    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  return (
    <>
      <Draggable draggableId={todo.title + index + date} index={index}>
        {(provided, snapshot) => (
          <li
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={toggleDetailModal}
            className={
              snapshot.isDragging && todo.completed
                ? "dragging completed"
                : snapshot.isDragging
                ? "dragging"
                : todo.completed
                ? "completed"
                : null
            }
          >
            {todo.title}
          </li>
        )}
      </Draggable>

      {/*todo detail modal */}
      {showDetailModal ? (
        <Fragment>
          <TodoDetailModal
            deleteTodo={deleteTodo}
            close={toggleDetailModal}
            todo={todo.title}
            date={date}
            doUndo={doUndo}
            index={index}
            completed={todo.completed}
          />
          <Backdrop toggle={toggleDetailModal} />
        </Fragment>
      ) : null}

      {/*hover effect */}
      <style jsx>{`
        li:hover {
          cursor: default;
        }
        .completed {
          color: grey;
        }
        .dragging {
          border: none;
          background: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
}
