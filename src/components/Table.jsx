import React from "react";

const Table = () => {
  return (
    <div className="bg-white shadow rounded p-4">
      <div className="text-center py-8">
        <p className="text-gray-500">You don't have any agents yet.</p>
        <div className="mt-4">
          <button className="bg-gray-200 px-4 py-2 rounded mr-4">Import</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Create an Agent
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;