/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import CustomMarkdown from "./CustomRenderer";
import { fixStreamingMarkdown } from "../utils/fixStreamingMarkdown";
import "../index.css"

// SVGs for Send and Loading
const SendIcon = ({ className = "" }) => (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4 20L20 12L4 4V10L16 12L4 14V20Z" fill="currentColor" />
    </svg>
);
const LoadingIcon = ({ className = "" }) => (
    <svg className={`animate-spin ${className}`} width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        ></circle>
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
    </svg>
);

export default function LLMChatPanel({ agent }) {
    const [conversation, setConversation] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [streamedResponse, setStreamedResponse] = useState("");
    const chatBottomRef = useRef();
    const textareaRef = useRef();

    // Auto expand textarea based on its scrollHeight (like ChatGPT)
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto"; // reset before measuring
            const newHeight = Math.max(textarea.scrollHeight, 38);
            textarea.style.height = Math.min(newHeight, 180) + "px";
        }
    }, [input]);

    // Scroll to bottom on new message/response
    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation, streamedResponse]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        setLoading(true);
        const updatedConversation = [
            ...conversation,
            { role: "user", content: input }
        ];
        setConversation(updatedConversation);
        setInput("");
        setStreamedResponse("");

        const payload = {
            conversation: updatedConversation,
            query: input
        };

        try {
            const res = await fetch("http://3.83.205.202:8585/chat-stream", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.body) throw new Error("No response body");

            const reader = res.body.getReader();
            let decoder = new TextDecoder("utf-8");
            let fullResponse = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                fullResponse += chunk;
                setStreamedResponse(fullResponse);
            }
            setConversation([
                ...updatedConversation,
                { role: "model", content: fullResponse }
            ]);
            setStreamedResponse("");
        } catch (err) {
            setStreamedResponse("**Error:** Failed to get response.");
        } finally {
            setLoading(false);
        }
    };

    const onInputKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-between">
            <div
                className="flex-1 overflow-y-auto mb-2 bg-slate-50 rounded-lg p-3 border border-slate-200 custom-scrollbar"
                style={{ minHeight: 0, maxHeight: 450 }}
            >
                {conversation.length === 0 && !streamedResponse && (
                    <div className="text-slate-400 text-center py-10">Start chatting with your agent!</div>
                )}
                {conversation.map((msg, i) => (
                    <div key={i} className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] px-4 py-2 rounded-lg ${msg.role === "user" ? "bg-indigo-100 text-indigo-900" : "bg-orange-50 text-slate-800"}`}>
                            <CustomMarkdown>{msg.content}</CustomMarkdown>
                        </div>
                    </div>
                ))}
                {streamedResponse && (
                    <div className="mb-3 flex justify-start">
                        <div className="max-w-[85%] px-4 py-2 rounded-lg bg-orange-50 text-slate-800">
                            <CustomMarkdown>{fixStreamingMarkdown(streamedResponse)}</CustomMarkdown>
                            {loading && <span className="ml-2 animate-pulse text-orange-500">▌</span>}
                        </div>
                    </div>
                )}
                <div ref={chatBottomRef} />
            </div>
        
            <div className="w-full flex items-end gap-2 pt-1 pb-2">
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        className="block w-full resize-none border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:outline-none px-3 py-2 bg-white font-normal text-slate-800 placeholder:text-slate-400 shadow-sm transition-all min-h-[38px] max-h-[180px] overflow-y-auto"
                        rows={1}
                        placeholder="Type your message and press Enter"
                        value={input}
                        disabled={loading}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={onInputKeyDown}
                        style={{
                            minHeight: 38,
                            maxHeight: 180,
                            lineHeight: "1.5",
                            //   overflowY: input ? "auto" : "hidden"
                        }}
                        spellCheck="true"
                        autoComplete="off"
                    />
                </div>
                <button
                    className={`flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-2 transition-colors disabled:opacity-60 shadow-sm`}
                    disabled={loading || !input.trim()}
                    onClick={sendMessage}
                    style={{ height: 38, width: 44, minWidth: 44 }}
                >
                    {loading
                        ? <LoadingIcon className="w-6 h-6" />
                        : <SendIcon className="w-6 h-6" />
                    }
                </button>
            </div>
        </div>
    );
}