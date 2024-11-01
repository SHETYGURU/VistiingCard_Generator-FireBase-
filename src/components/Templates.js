// src/components/Templates.js
import React from "react";
import { useNavigate } from "react-router-dom";
import preview from "../assets/Preview.PNG";
import preview2 from "../assets/Preview2.PNG";
import preview3 from "../assets/Preview3.PNG";
import Navbar from "./Navbar";


function Templates() {
  const navigate = useNavigate();
  const templates = [
    {
      id: 1,
      image: preview, // Update with the actual path
      description: "Modern Black and Gold Design",
    },
    {
      id: 2,
      image: preview2, // Update with the actual path
      description: "Classic Minimalist Layout",
    },
    {
      id: 3,
      image: preview3, // Update with the actual path
      description: "Bold and Colorful Theme",
    },
  ];

  return (
    <div>
        <Navbar />
   
    <div className="flex flex-col items-center p-8">
          

      <h2 className="text-2xl font-bold mb-8 text-center">Select a Visiting Card Template</h2>
      <div className="template-list grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className="template-card p-4   transform hover:scale-105 transition-transform duration-200 ease-in-out cursor-pointer"
            onClick={() => navigate(`/editor/${template.id}`)}
          >
            <img
              src={template.image}
              alt={`Template ${template.id}`}
              className="w-full h-48 object-cover rounded-md"
            />
            <p className="text-center mt-4 text-gray-700 font-medium">{template.description}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default Templates;
