// src/components/EditableField.js
import React, { useState } from "react";
import Draggable from "react-draggable";

function EditableField({ field, updateText }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Draggable>
      <div onClick={() => setIsEditing(true)} className="editable-field">
        {isEditing ? (
          <input
            type="text"
            value={field.text}
            onChange={(e) => updateText(e.target.value)}
            onBlur={() => setIsEditing(false)}
          />
        ) : (
          <p>{field.text}</p>
        )}
      </div>
    </Draggable>
  );
}

export default EditableField;
