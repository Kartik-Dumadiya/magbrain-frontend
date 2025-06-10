/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import KnowledgeBaseModal from "../components/KnowledgeBaseModal";
import { FaBookOpen, FaPlusCircle, FaTrash, FaRegEdit, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";
import { getFileIcon } from "../utils/fileIcons"; // Assuming you have a fileIcons utility
import { motion, AnimatePresence } from "framer-motion"; // Add framer-motion for animations

const KnowledgeBasePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitData, setModalInitData] = useState(null);
  const [knowledgeBases, setKnowledgeBases] = useState([]);
  const [activeIdx, setActiveIdx] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // Open add modal
  const openAddModal = () => { 
    setModalInitData(null); 
    setIsModalOpen(true);
  };
  
  // Open edit modal
  const openEditModal = idx => {
    setModalInitData({ ...knowledgeBases[idx], idx });
    setIsModalOpen(true);
  };

  // Add or update KB
  const handleSaveKB = (data) => {
    if (modalInitData?.idx !== undefined) {
      // Edit
      setKnowledgeBases(kbs => kbs.map((kb, i) => i === modalInitData.idx ? data : kb));
      showToastNotification("Knowledge base updated successfully", "success");
    } else {
      // Add
      setKnowledgeBases(kbs => [...kbs, data]);
      showToastNotification("Knowledge base added successfully", "success");
    }
    setIsModalOpen(false);
  };

  // Delete KB
  const handleDeleteKB = idx => {
    if (window.confirm("Delete this Knowledge Base?")) {
      setKnowledgeBases(kbs => kbs.filter((_, i) => i !== idx));
      if (activeIdx === idx) setActiveIdx(null);
      if (activeIdx !== null && idx < activeIdx) setActiveIdx(activeIdx - 1);
      showToastNotification("Knowledge base deleted", "warning");
    }
  };

  // Toast notification - improved to be more visible
  const showToastNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000); // Longer display time
  };

  // Document deletion with confirmation and constraints check
  const handleDocumentDelete = (kbIndex, docIndex) => {
    const kb = knowledgeBases[kbIndex];
    
    // If this is the last document, prevent deletion
    if (kb.documents.length <= 1) {
      showToastNotification("Cannot delete the last document. A knowledge base must contain at least one document.", "error");
      return;
    }
    
    const docName = kb.documents[docIndex].name;
    if (window.confirm(`Remove "${docName}" from this knowledge base?`)) {
      setKnowledgeBases(kbs => kbs.map((kb, kidx) =>
        kidx === kbIndex
          ? { ...kb, documents: kb.documents.filter((_, di) => di !== docIndex) }
          : kb
      ));
      showToastNotification("Document removed", "info");
    }
  };

  return (
    <div className="flex h-screen p-6 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 overflow-hidden">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-1/4 min-w-[260px] max-w-[340px] bg-white/95 p-6 rounded-2xl shadow-xl border border-blue-100 flex flex-col overflow-hidden"
      >
        <div className="flex justify-between items-center border-b pb-4 border-blue-100">
          <h1 className="text-xl font-extrabold text-blue-800 flex items-center gap-2">
            <FaBookOpen className="text-blue-500" /> Knowledge Base
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openAddModal}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-1.5 rounded-lg font-semibold hover:shadow-md transition-all duration-300"
          >
            <FaPlusCircle /> Add
          </motion.button>
        </div>
        <div className="mt-4 flex-1 overflow-y-auto pr-1 custom-scrollbar">
          <AnimatePresence>
            {knowledgeBases.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-40 mt-4 bg-blue-50 rounded-lg p-4 text-center"
              >
                <FaInfoCircle className="text-blue-400 text-3xl mb-2" />
                <p className="text-gray-500 text-sm">
                  No knowledge bases yet. Click "Add" to create your first one!
                </p>
              </motion.div>
            ) : (
              <ul className="space-y-1">
                {knowledgeBases.map((kb, idx) => (
                  <motion.li 
                    key={kb.name + idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.button
                      whileHover={{ x: 4 }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left font-medium transition-all duration-200
                        ${activeIdx === idx 
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                          : "hover:bg-blue-100/70 text-blue-800"}
                      `}
                      onClick={() => setActiveIdx(activeIdx === idx ? null : idx)}
                      title={kb.name}
                    >
                      <span className="truncate">{kb.name}</span>
                    </motion.button>
                  </motion.li>
                ))}
              </ul>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1 ml-6 p-6 flex flex-col items-center bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-xl min-h-0"
      >
        <AnimatePresence mode="wait">
          {activeIdx === null || !knowledgeBases[activeIdx] ? (
            <motion.div 
              key="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="text-center text-gray-500 flex-1 flex flex-col justify-center items-center"
            >
              <div className="text-6xl mb-4 animate-pulse">📚</div>
              <p className="text-lg font-semibold mb-2 text-blue-800">
                Select or create a knowledge base
              </p>
              <p className="text-sm max-w-md text-gray-500">
                Your knowledge bases help organize documents and information for quick access and reference.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openAddModal}
                className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <FaPlusCircle className="inline mr-2" /> Create Knowledge Base
              </motion.button>
            </motion.div>
          ) : (
            <motion.div 
              key={`kb-${activeIdx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-3xl space-y-6 flex-1 overflow-y-auto px-2 custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-indigo-700 bg-clip-text text-transparent">
                  {knowledgeBases[activeIdx].name}
                </h2>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openEditModal(activeIdx)}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-200 shadow-sm"
                  >
                    <FaRegEdit className="inline -mt-0.5 mr-1" /> Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteKB(activeIdx)}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200 shadow-sm"
                  >
                    <FaTrash className="inline -mt-0.5 mr-1" /> Delete
                  </motion.button>
                </div>
              </div>

              {/* Document List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <h3 className="font-semibold text-blue-700 mb-3 flex items-center gap-2 pl-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  Documents
                </h3>
                <div className="rounded-lg p-3 bg-white shadow-md border border-blue-100">
                  <AnimatePresence>
                    {knowledgeBases[activeIdx].documents?.length ? (
                      <ul className="divide-y divide-blue-100">
                        {knowledgeBases[activeIdx].documents.map((doc, i) => (
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            transition={{ duration: 0.2, delay: i * 0.05 }}
                            className="flex items-center gap-2 py-3 hover:bg-blue-50/50 rounded px-2 transition-colors duration-200"
                          >
                            {/* Icon */}
                            <span className="text-blue-600">{getFileIcon(doc.type, doc.name)}</span>
                            {/* Title/URL */}
                            <span className="truncate flex-1" title={doc.name}>
                              {doc.type === "url" ? (
                                <a href={doc.name} className="underline text-blue-700 hover:text-blue-900 transition-colors duration-200" target="_blank" rel="noopener noreferrer">
                                  {doc.name}
                                </a>
                              ) : (
                                <span className="text-gray-800">{doc.name}</span>
                              )}
                            </span>
                            {/* Download for file */}
                            {doc.type === "file" && (
                              <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href={URL.createObjectURL(doc.file)}
                                download={doc.name}
                                className="ml-2 text-xs text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors duration-200"
                              >
                                Download
                              </motion.a>
                            )}
                            {/* Delete - Only shown if there's more than one document */}
                            {knowledgeBases[activeIdx].documents.length > 1 && (
                              <motion.button
                                whileHover={{ scale: 1.1, color: "#EF4444" }}
                                whileTap={{ scale: 0.95 }}
                                className="ml-2 text-red-400 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-full transition-colors duration-200"
                                onClick={() => handleDocumentDelete(activeIdx, i)}
                                title="Delete document"
                              >
                                <FaTrash />
                              </motion.button>
                            )}
                            {/* If only one document left, show disabled state with tooltip */}
                            {knowledgeBases[activeIdx].documents.length === 1 && (
                              <div 
                                className="ml-2 text-gray-300 p-1.5 rounded-full cursor-not-allowed relative group"
                                title="Cannot delete the last document"
                              >
                                <FaTrash />
                                <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded w-48 -left-20 bottom-full mb-1">
                                  Cannot delete the last document. A knowledge base must contain at least one document.
                                </div>
                              </div>
                            )}
                          </motion.li>
                        ))}
                      </ul>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-400 text-sm p-6 text-center bg-gray-50 rounded-lg"
                      >
                        <svg className="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        No documents attached to this knowledge base.
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="mt-2 text-blue-600 text-xs"
                        >
                          Edit this knowledge base to add documents.
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Modal with animation */}
      <AnimatePresence>
        {isModalOpen && (
          <KnowledgeBaseModal
            closeModal={() => setIsModalOpen(false)}
            addKnowledgeBase={handleSaveKB}
            initialData={modalInitData}
          />
        )}
      </AnimatePresence>

      {/* Toast Notification - Moved to top center and enlarged */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-lg shadow-xl z-50 flex items-center min-w-[300px] ${
              toastType === "success" ? "bg-green-100 text-green-800 border-l-4 border-green-500" : 
              toastType === "warning" ? "bg-amber-100 text-amber-800 border-l-4 border-amber-500" : 
              toastType === "error" ? "bg-red-100 text-red-800 border-l-4 border-red-500" :
              "bg-blue-100 text-blue-800 border-l-4 border-blue-500"
            }`}
          >
            <div className="mr-3">
              {toastType === "success" && (
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              )}
              {toastType === "warning" && (
                <FaExclamationTriangle className="w-6 h-6 text-amber-500" />
              )}
              {toastType === "error" && (
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
              {toastType === "info" && (
                <FaInfoCircle className="w-6 h-6 text-blue-500" />
              )}
            </div>
            <div className="text-sm font-medium">{toastMessage}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(10px); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default KnowledgeBasePage;