<DragDropContext onDragEnd={this.onDragEnd}>
  <Droppable droppableId="droppable">
    {(provided, snapshot) => (
      <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
        {this.state.items.map((item, index) => (
          <Draggable key={item.id} draggableId={item.id} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
              >
                {item.content}
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
  <Droppable droppableId="droppable2">
    {(provided, snapshot) => (
      <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
        {this.state.selected.map((item, index) => (
          <Draggable key={item.id} draggableId={item.id} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
              >
                {item.content}
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>;
