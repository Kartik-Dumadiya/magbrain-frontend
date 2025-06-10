export const agentTypeTabs = [
  { key: "single-prompt", label: "Single Prompt" },
  { key: "multi-prompt", label: "Multi Prompt" },
  { key: "conversation-flow", label: "Conversation Flow" },
];

export const templateOptions = {
  "single-prompt": [
    {
      key: "blank",
      icon: (
        <span className="text-[2.5rem] text-gray-400 flex items-center justify-center h-20">
          +
        </span>
      ),
      title: "Start from blank",
      subtitle: "",
      desc: "",
    },
    {
      key: "healthcare",
      icon: (
        <svg className="w-11 h-11 mx-auto text-indigo-500" fill="none" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="24" fill="#f3f4f6"/>
          <path d="M17 24h14M24 17v14" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Healthcare Check-In",
      subtitle: "Transfer call",
      desc: "Ask questions to gather information, can transfer call.",
    },
    {
      key: "notification",
      icon: (
        <svg className="w-11 h-11 mx-auto text-indigo-500" fill="none" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="24" fill="#f3f4f6"/>
          <path d="M24 16v16M32 24H16" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Notification",
      subtitle: "Then end the call",
      desc: "After giving the notification, end the call.",
    },
  ],
  "multi-prompt": [
    {
      key: "blank",
      icon: (
        <span className="text-[2.5rem] text-gray-400 flex items-center justify-center h-20">
          +
        </span>
      ),
      title: "Start from blank",
      subtitle: "",
      desc: "",
    },
    // Add more templates for Multi Prompt as needed
  ],
  "conversation-flow": [
    {
      key: "blank",
      icon: (
        <span className="text-[2.5rem] text-gray-400 flex items-center justify-center h-20">
          +
        </span>
      ),
      title: "Start from blank",
      subtitle: "",
      desc: "",
    },
    // Add more templates for Conversation Flow as needed
  ],
};