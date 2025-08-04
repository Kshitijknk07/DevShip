"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";
import Editor from "@monaco-editor/react";
import {
  Play,
  Share2,
  Users,
  Settings,
  ArrowLeft,
  MessageCircle,
  Send,
} from "lucide-react";

interface Project {
  _id: string;
  title: string;
  description: string;
  language: string;
  files: Array<{
    name: string;
    content: string;
    language: string;
    path: string;
  }>;
  shareId: string;
  owner: {
    _id: string;
    username: string;
  };
  collaborators: Array<{
    _id: string;
    username: string;
  }>;
}

interface Message {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [currentFile, setCurrentFile] = useState(0);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [user, setUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_BASE = "http://localhost:5000/api";

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user && params.id) {
      fetchProject();
      setupSocket();
    }
  }, [user, params.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const response = await axios.get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem("token");
      router.push("/");
    }
  };

  const fetchProject = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(`${API_BASE}/projects/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProject(response.data);
      if (response.data.files.length > 0) {
        setCode(response.data.files[0].content);
      }
    } catch (error) {
      toast.error("Failed to load project");
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  const setupSocket = () => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.emit("join-project", {
      projectId: params.id,
      user: user.username,
    });

    newSocket.on("user-joined", (data) => {
      setOnlineUsers((prev) => [...prev, data.user]);
      toast.success(`${data.user} joined the project`);
    });

    newSocket.on("user-left", (data) => {
      setOnlineUsers((prev) => prev.filter((u) => u !== data.user));
      toast.info(`${data.user} left the project`);
    });

    newSocket.on("code-change", (data) => {
      if (data.user !== user.username) {
        setCode(data.code);
      }
    });

    newSocket.on("chat-message", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          user: data.user,
          message: data.message,
          timestamp: new Date(),
        },
      ]);
    });

    newSocket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      newSocket.close();
    };
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      socket?.emit("code-change", {
        projectId: params.id,
        code: value,
        user: user.username,
      });
    }
  };

  const saveCode = async () => {
    const token = localStorage.getItem("token");
    if (!token || !project) return;

    try {
      const updatedFiles = [...project.files];
      updatedFiles[currentFile] = {
        ...updatedFiles[currentFile],
        content: code,
      };

      await axios.put(
        `${API_BASE}/projects/${params.id}`,
        {
          files: updatedFiles,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Code saved successfully");
    } catch (error) {
      toast.error("Failed to save code");
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    socket?.emit("send-message", {
      projectId: params.id,
      message: newMessage,
      user: user.username,
    });

    setNewMessage("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const copyShareLink = () => {
    if (project) {
      const shareUrl = `${window.location.origin}/share/${project.shareId}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center space-x-2 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-xl font-semibold">{project.title}</h1>
            <p className="text-sm text-gray-400">{project.description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <Users className="h-4 w-4" />
            <span>{onlineUsers.length} online</span>
          </div>

          <button
            onClick={() => setShowChat(!showChat)}
            className="flex items-center space-x-2 bg-blue-600 px-3 py-2 rounded hover:bg-blue-700"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat</span>
          </button>

          <button
            onClick={() => setShowShare(!showShare)}
            className="flex items-center space-x-2 bg-green-600 px-3 py-2 rounded hover:bg-green-700"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>

          <button
            onClick={saveCode}
            className="flex items-center space-x-2 bg-purple-600 px-3 py-2 rounded hover:bg-purple-700"
          >
            <Play className="h-4 w-4" />
            <span>Save</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* File Explorer */}
        <div className="w-64 bg-gray-800 text-white p-4">
          <h3 className="font-semibold mb-4">Files</h3>
          <div className="space-y-2">
            {project.files.map((file, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentFile(index);
                  setCode(file.content);
                }}
                className={`w-full text-left p-2 rounded ${
                  currentFile === index ? "bg-blue-600" : "hover:bg-gray-700"
                }`}
              >
                {file.name}
              </button>
            ))}
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1">
          <Editor
            height="100%"
            language={project.files[currentFile]?.language || "javascript"}
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              automaticLayout: true,
            }}
          />
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="w-80 bg-gray-800 text-white flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold">Chat</h3>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg) => (
                <div key={msg.id} className="mb-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-blue-400">
                      {msg.user}
                    </span>
                    <span className="text-xs text-gray-400">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-300">{msg.message}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 px-3 py-2 rounded hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Share Panel */}
        {showShare && (
          <div className="w-80 bg-gray-800 text-white p-4">
            <h3 className="font-semibold mb-4">Share Project</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Share Link
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/share/${project.shareId}`}
                    readOnly
                    className="flex-1 bg-gray-700 text-white px-3 py-2 rounded"
                  />
                  <button
                    onClick={copyShareLink}
                    className="bg-blue-600 px-3 py-2 rounded hover:bg-blue-700"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Collaborators
                </label>
                <div className="space-y-2">
                  {project.collaborators.map((collab) => (
                    <div
                      key={collab._id}
                      className="flex items-center justify-between bg-gray-700 p-2 rounded"
                    >
                      <span>{collab.username}</span>
                      <span className="text-xs text-green-400">Online</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
