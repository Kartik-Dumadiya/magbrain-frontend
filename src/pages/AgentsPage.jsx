/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import AgentSidebar from "../components/AgentSidebar";
import AgentList from "../components/AgentList";
import CreateAgentDropdown from "../components/CreateAgentDropdown";
import AgentTemplateModal from "../components/AgentTemplateModal";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Upload, Sparkles } from "lucide-react";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { toast } from 'react-toastify';


const AgentsPage = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const [templateModal, setTemplateModal] = useState({ open: false, agentType: "single-prompt" });
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteModal, setDeleteModal] = useState({ open: false, agent: null });


    

    // Open modal to create agent
    const handleCreateAgent = (type) => {
        if (["single-prompt", "multi-prompt", "conversation-flow"].includes(type)) {
            setTemplateModal({ open: true, agentType: type });
        } else {
            toast.info("Custom LLM: show custom modal or redirect");
        }
    };

    const handleSidebarAdd = () => {
        setTemplateModal({ open: true, agentType: "single-prompt" });
    };

    // Handle select template and create agent
    const handleTemplateSelect = async (agentType, templateKey) => {
        setTemplateModal({ open: false, agentType: "single-prompt" });

        let agentData = {
            agent_type: agentType,
            template: templateKey,
            prompt: "",
            welcome_message: "",
            system_prompt: "",
            model_name: "gpt-4.1",
            llm_setting: {},
            name: "",
            voice: "cimo",
            language: "en",
        };

        if (agentType === "single-prompt") {
            if (templateKey === "blank") {
                agentData.name = "Single-Prompt Agent";
                agentData.prompt = "";
                agentData.welcome_message = "User Initiates: AI remains silent until users speak first.";
            }
            if (templateKey === "healthcare") {
                agentData.name = "Healthcare Check-In";
                agentData.prompt = "Ask healthcare check-in questions as an AI assistant and transfer call if needed.";
                agentData.welcome_message = "Welcome to the healthcare check-in assistant.";
            }
            if (templateKey === "notification") {
                agentData.name = "Notification";
                agentData.prompt = "Notify the user of important information, then end the call.";
                agentData.welcome_message = "Hello, I have a notification for you.";
            }
        }

        if (agentType === "conversation-flow") {
            if (templateKey === "blank") {
                agentData.name = "conversation-flow Agent";
                agentData.prompt = "";
                agentData.welcome_message = "User Initiates: AI remains silent until users speak first.";
            }
        }
        // Add similar logic for multi-prompt, conversation-flow as needed

        try {
            const res = await axios.post("http://localhost:3000/agents", agentData, { withCredentials: true });
            const bot_id = res.data.agent.bot_id;
            toast.success("Agent created!");
            window.open(`/agent/${bot_id}`, "_blank");
        } catch (err) {
            toast.error("Error creating agent!");
            console.error("Error creating agent:", err);
        }
    };

    const handleRequestDelete = (agent) => {
        setDeleteModal({ open: true, agent });
    };

    // When user confirms deletion in modal
    const handleConfirmDelete = async () => {
        const agent = deleteModal.agent;
        try {
            await axios.delete(`http://localhost:3000/agents/${agent.bot_id}`, { withCredentials: true });
            setAgents((prev) => prev.filter((a) => a.bot_id !== agent.bot_id));
            toast.success(`Agent "${agent.name}" deleted!`);
        } catch (err) {
            toast.error("Error deleting agent!");
            console.error("Error deleting agent:", err);
        }
        setDeleteModal({ open: false, agent: null });
    };

    const handleCancelDelete = () => setDeleteModal({ open: false, agent: null });

    // Add this function inside your AgentsPage component (not outside)
    const handleDeleteAgent = async (agent) => {
        try {
            await axios.delete(`http://localhost:3000/agents/${agent.bot_id}`, { withCredentials: true });
            setAgents((prev) => prev.filter((a) => a.bot_id !== agent.bot_id));
            toast.success(`Agent "${agent.name}" deleted!`);
        } catch (err) {
            toast.error("Error deleting agent!");
            console.error("Error deleting agent:", err);
        }
    };
    useEffect(() => {
            axios
            .get("http://localhost:3000/agents", { withCredentials: true })
            .then((res) =>setAgents(res.data.agents))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="flex h-screen p-6 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 overflow-hidden">
            <AgentSidebar onAdd={handleSidebarAdd} />

            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex-1 ml-6 p-6 flex flex-col items-center bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-xl min-h-0 overflow-hidden"
            >
                <div className="w-full flex items-center justify-between border-b pb-4 border-blue-100">
                    <h1 className="text-2xl font-extrabold  flex items-center gap-2 bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 bg-clip-text text-transparent">
                        <Sparkles className="text-blue-400" /> All Agents
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search agents..."
                                className="w-56 border border-blue-100 pl-10 pr-3 py-2.5 rounded-lg text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300 shadow hover:shadow-md placeholder:text-blue-400"
                            />
                            <Search className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
                        </div>
                        <motion.button
                            whileHover={{
                                scale: 1.06,
                                boxShadow: "0 10px 24px 0 rgba(129,140,248,0.12)",
                                backgroundColor: "#E0E7FF",
                            }}
                            whileTap={{ scale: 0.99 }}
                            transition={{ duration: 0.18 }}
                            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold shadow hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            <Upload size={18} />
                            Import
                        </motion.button>
                        <CreateAgentDropdown onSelect={handleCreateAgent} />
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.18 }}
                    className="w-full flex-1 mt-8 overflow-y-auto px-2 custom-scrollbar"
                >
                    <AnimatePresence>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
                                <p className="text-blue-500">Loading agents...</p>
                            </div>
                        ) : agents.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center h-64 mt-10 bg-blue-50 rounded-xl p-6 text-center"
                            >
                                <Sparkles className="text-blue-400 text-5xl mb-2" />
                                <p className="text-blue-700 text-lg font-semibold mb-1">No agents yet</p>
                                <p className="text-blue-400 text-sm">Click "Create Agent" to get started!</p>
                            </motion.div>
                        ) : (
                            <AgentList
                                agents={agents}
                                loading={loading}
                                user={user}
                                searchQuery={searchQuery}
                                onDelete={handleRequestDelete}
                            />
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Modal */}

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
        `}</style>
            </motion.div>
            {/* Modal */}
                <ConfirmDeleteModal
                    open={deleteModal.open}
                    agent={deleteModal.agent}
                    onCancel={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                />
            <AnimatePresence>
                {templateModal.open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.22 }}
                        className="backdrop-blur-[1.5px] fixed inset-0 z-40 flex items-center justify-center bg-black/10"
                    >
                        <AgentTemplateModal
                            open={templateModal.open}
                            agentType={templateModal.agentType}
                            onClose={() => setTemplateModal({ open: false, agentType: "single-prompt" })}
                            onSelect={handleTemplateSelect}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AgentsPage;