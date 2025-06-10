/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBookOpen, FaPlusCircle, FaTrash, FaRegEdit, FaFilePdf, 
  FaFileWord, FaFileExcel, FaFileAlt, FaFilePowerpoint,
  FaFileCsv, FaFile, FaPlus, FaGlobe, FaInfoCircle, FaChevronDown,
  FaArrowLeft, FaFolder, FaFolderOpen
} from "react-icons/fa";

// Utility function for file icons
const getFileIcon = (type, name = "") => {
  const ext = name.split(".").pop()?.toLowerCase();
  
  if (type === "url") return <FaGlobe className="text-blue-500" />;
  if (type === "text") return <FaFileAlt className="text-purple-600" />;
  
  switch (ext) {
    case "pdf": return <FaFilePdf className="text-red-600" />;
    case "doc":
    case "docx": return <FaFileWord className="text-blue-700" />;
    case "xls":
    case "xlsx": return <FaFileExcel className="text-green-700" />;
    case "ppt":
    case "pptx": return <FaFilePowerpoint className="text-orange-600" />;
    case "csv": return <FaFileCsv className="text-green-600" />;
    case "txt": return <FaFileAlt className="text-gray-700" />;
    case "md": return <FaFileAlt className="text-blue-500" />;
    case "html": return <FaFileAlt className="text-orange-500" />;
    default: return <FaFile className="text-gray-500" />;
  }
};

const allowedExtensions = [
  "pdf", "doc", "docx", "xls", "xlsx", "csv", "ppt", "pptx", "md", "txt", "html"
];

// Knowledge Base Modal Component with enhanced styling
const KnowledgeBaseModal = ({ closeModal, addKnowledgeBase, initialData }) => {
  const [knowledgeBaseName, setKnowledgeBaseName] = useState(initialData?.name || "");
  const [documents, setDocuments] = useState(initialData?.documents || []);
  const [error, setError] = useState("");
  const fileInputRef = useRef();
  const modalRef = useRef();

  // Popup states
  const [showDocDropdown, setShowDocDropdown] = useState(false);
  const [showWebModal, setShowWebModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);

  // Web input state
  const [webUrl, setWebUrl] = useState("");
  const [webError, setWebError] = useState("");

  // Text input state
  const [textFileName, setTextFileName] = useState("");
  const [textContent, setTextContent] = useState("");
  const [textError, setTextError] = useState("");

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDocDropdown && !event.target.closest(".dropdown-container")) {
        setShowDocDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDocDropdown]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const ext = file.name.split(".").pop().toLowerCase();
      return allowedExtensions.includes(ext);
    });
    const invalidFiles = selectedFiles.filter(file => {
      const ext = file.name.split(".").pop().toLowerCase();
      return !allowedExtensions.includes(ext);
    });
    
    if (invalidFiles.length > 0) {
      setError(
        `File type not allowed: ${invalidFiles
          .map(f => f.name)
          .join(", ")}. Allowed types: ${allowedExtensions.join(", ")}.`
      );
    } else {
      setError(""); // clear error if all are valid
    }
    
    const docs = validFiles.map(f => ({
      type: "file",
      name: f.name,
      file: f
    }));
    
    setDocuments(prev => [...prev, ...docs]);
    e.target.value = ""; // reset input
    setShowDocDropdown(false);
  };

  // Remove document
  const handleRemoveDoc = (idx) => {
    setDocuments(docs => docs.filter((_, i) => i !== idx));
  };

  // Save Knowledge Base
  const handleSave = () => {
    setError("");
    if (!knowledgeBaseName.trim()) {
      setError("Please enter a Knowledge Base Name.");
      return;
    }
    if (documents.length === 0) {
      setError("Please add at least one document.");
      return;
    }
    addKnowledgeBase({
      name: knowledgeBaseName.trim(),
      documents
    });
    setKnowledgeBaseName(""); setDocuments([]); setError("");
  };

  // Add Web Page
  const handleAddWeb = () => {
    setWebError("");
    try {
      new URL(webUrl.trim());
    } catch {
      setWebError("Please enter a valid URL.");
      return;
    }
    setDocuments(prev => [...prev, { type: "url", name: webUrl.trim() }]);
    setWebUrl(""); setShowWebModal(false); setShowDocDropdown(false);
  };

  // Add Text
  const handleAddText = () => {
    setTextError("");
    if (!textFileName.trim()) {
      setTextError("Please enter a file name.");
      return;
    }
    if (!textContent.trim()) {
      setTextError("Please enter some text content.");
      return;
    }
    setDocuments(prev => [...prev, { type: "text", name: textFileName.trim(), content: textContent }]);
    setTextFileName(""); setTextContent(""); setShowTextModal(false); setShowDocDropdown(false);
  };

  // UI
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: "rgba(15,23,42,0.7)", backdropFilter: "blur(8px)" }}
        onClick={closeModal}
      >
        <motion.div
          ref={modalRef}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-xl p-8 relative border border-blue-100 dark:border-slate-700"
          initial={{ y: 40, opacity: 0, scale: 0.95 }} 
          animate={{ y: 0, opacity: 1, scale: 1 }} 
          exit={{ y: 40, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, type: "spring", damping: 20 }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200"
            aria-label="Close"
          >&times;</button>
          
          <motion.h2 
            className="text-2xl font-bold mb-6 text-blue-900 dark:text-blue-100"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {initialData ? "Edit Knowledge Base" : "Add Knowledge Base"}
          </motion.h2>
          
          {error && (
            <motion.div 
              className="mb-6 px-4 py-3 rounded-lg bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <FaInfoCircle className="text-red-500 flex-shrink-0" />
                <p>{error}</p>
              </div>
            </motion.div>
          )}
          
          {/* Name */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Knowledge Base Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={knowledgeBaseName}
              onChange={e => setKnowledgeBaseName(e.target.value)}
              placeholder="Enter name (e.g. Project Documentation)"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:text-white transition-all duration-200"
            />
          </motion.div>
          
          {/* Documents */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Documents</label>
            
            {/* Document list */}
            <div className="mb-4 max-h-48 overflow-y-auto transition-all duration-200 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              {documents.length > 0 ? (
                <ul className="py-2 px-1">
                  {documents.map((doc, idx) => (
                    <motion.li 
                      key={idx} 
                      className="flex items-center gap-3 rounded-lg px-3 py-2 mb-1 hover:bg-white dark:hover:bg-slate-700/70 transition-all duration-200 group border border-transparent hover:border-blue-100 dark:hover:border-slate-600"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      exit={{ opacity: 0, x: -10 }}
                      layout
                    >
                      <span className="text-lg flex-shrink-0">{getFileIcon(doc.type, doc.name)}</span>
                      <span className="truncate flex-1 text-sm text-slate-700 dark:text-slate-300" title={doc.name}>
                        {doc.name}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRemoveDoc(idx)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                        aria-label="Remove document"
                      >
                        <FaTrash size={14} />
                      </motion.button>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-24 text-slate-400 dark:text-slate-500">
                  <FaFolder className="text-2xl mb-2" />
                  <p className="text-sm">No documents added yet</p>
                </div>
              )}
            </div>
            
            {/* Add Document button and menu */}
            <div className="relative dropdown-container">
              <motion.button
                type="button"
                onClick={() => setShowDocDropdown(!showDocDropdown)}
                className="flex items-center gap-2 border border-blue-500 text-blue-700 dark:text-blue-300 dark:border-blue-400/50 px-4 py-2 rounded-lg focus:outline-none font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaPlus size={14} /> 
                Add Document
                <FaChevronDown 
                  size={12} 
                  className={`ml-1 transition-transform duration-200 ${showDocDropdown ? 'rotate-180' : ''}`}
                />
              </motion.button>
              
              {/* Dropdown */}
              <AnimatePresence>
                {showDocDropdown && (
                  <motion.div 
                    className="absolute z-10 mt-2 left-0 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.button
                      className="flex w-full items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200"
                      onClick={() => { setShowWebModal(true); setShowDocDropdown(false); }}
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <FaGlobe className="text-blue-600 dark:text-blue-400" size={18} />
                      <div className="text-left">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">Add Web Pages</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Crawl and sync your website</div>
                      </div>
                    </motion.button>
                    
                    <motion.button
                      className="flex w-full items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200"
                      onClick={() => { fileInputRef.current.click(); }}
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <FaFile className="text-green-600 dark:text-green-400" size={18} />
                      <div className="text-left">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">Upload Files</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">File size &lt; 100MB</div>
                      </div>
                    </motion.button>
                    
                    <motion.button
                      className="flex w-full items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200"
                      onClick={() => { setShowTextModal(true); setShowDocDropdown(false); }}
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <FaFileAlt className="text-purple-600 dark:text-purple-400" size={18} />
                      <div className="text-left">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">Add Text</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Add articles manually</div>
                      </div>
                    </motion.button>
                    
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.md,.txt,.html"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          
          {/* Modal buttons */}
          <motion.div 
            className="flex justify-end space-x-3 mt-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button 
              type="button" 
              onClick={closeModal} 
              className="px-5 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Cancel
            </motion.button>
            <motion.button 
              type="button" 
              onClick={handleSave} 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Save
            </motion.button>
          </motion.div>

          {/* Web Page modal */}
          <AnimatePresence>
            {showWebModal && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                style={{ background: "rgba(15,23,42,0.6)" }}
              >
                <motion.div
                  className="bg-white dark:bg-slate-800 p-7 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-sm relative"
                  initial={{ scale: 0.9, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }} 
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", damping: 25 }}
                >
                  <button 
                    className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200"
                    onClick={() => setShowWebModal(false)}
                  >
                    &times;
                  </button>
                  <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Add Website URL</h3>
                  <input
                    type="text"
                    placeholder="https://example.com"
                    value={webUrl}
                    onChange={e => setWebUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white transition-all duration-200"
                  />
                  {webError && (
                    <motion.div 
                      className="text-red-500 dark:text-red-400 text-xs mt-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                    >
                      {webError}
                    </motion.div>
                  )}
                  <div className="flex justify-end mt-6 space-x-2">
                    <motion.button 
                      className="px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={() => setShowWebModal(false)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button 
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
                      onClick={handleAddWeb}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Add
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Add Text modal */}
          <AnimatePresence>
            {showTextModal && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                style={{ background: "rgba(15,23,42,0.6)" }}
              >
                <motion.div
                  className="bg-white dark:bg-slate-800 p-7 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md relative"
                  initial={{ scale: 0.9, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }} 
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", damping: 25 }}
                >
                  <button 
                    className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200"
                    onClick={() => setShowTextModal(false)}
                  >
                    &times;
                  </button>
                  <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Add Text Document</h3>
                  <input
                    type="text"
                    placeholder="File name (e.g. Meeting Notes)"
                    value={textFileName}
                    onChange={e => setTextFileName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white transition-all duration-200 mb-3"
                  />
                  <textarea
                    rows={6}
                    placeholder="Paste or enter text here..."
                    value={textContent}
                    onChange={e => setTextContent(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white transition-all duration-200 resize-none"
                  />
                  {textError && (
                    <motion.div 
                      className="text-red-500 dark:text-red-400 text-xs mt-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                    >
                      {textError}
                    </motion.div>
                  )}
                  <div className="flex justify-end mt-6 space-x-2">
                    <motion.button 
                      className="px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={() => setShowTextModal(false)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button 
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
                      onClick={handleAddText}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Add
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default KnowledgeBaseModal;