"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Code, Users, Zap, ArrowRight, Github } from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  language: string;
  shareId: string;
  createdAt: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const router = useRouter();

  const API_BASE = "http://localhost:5000/api";

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        fetchProjects(token);
      } catch (error) {
        localStorage.removeItem("token");
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const fetchProjects = async (token: string) => {
    try {
      const response = await axios.get(`${API_BASE}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = authMode === "login" ? "login" : "register";

    try {
      const response = await axios.post(
        `${API_BASE}/auth/${endpoint}`,
        formData
      );
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      setShowAuth(false);
      setFormData({ username: "", email: "", password: "" });
      toast.success(
        authMode === "login" ? "Welcome back!" : "Account created successfully!"
      );
      fetchProjects(response.data.token);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Authentication failed");
    }
  };

  const createProject = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.post(
        `${API_BASE}/projects`,
        {
          title: "New Project",
          description: "Start coding together!",
          language: "javascript",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProjects([...projects, response.data]);
      router.push(`/project/${response.data._id}`);
    } catch (error) {
      toast.error("Failed to create project");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setProjects([]);
    toast.success("Logged out successfully");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">DevShip</h1>
            </div>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user.username}!</span>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!user ? (
          // Landing Page
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Code Together in Real-Time
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              DevShip is a collaborative coding platform where teams can write,
              share, and execute code together in real-time.
            </p>

            <div className="flex justify-center space-x-6 mb-12">
              <div className="flex items-center space-x-2 text-gray-600">
                <Users className="h-5 w-5" />
                <span>Real-time collaboration</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Zap className="h-5 w-5" />
                <span>Live code execution</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Github className="h-5 w-5" />
                <span>Project sharing</span>
              </div>
            </div>

            <button
              onClick={() => setShowAuth(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <span>Start Coding Now</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        ) : (
          // Dashboard
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Your Projects
              </h2>
              <button
                onClick={createProject}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                New Project
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-12">
                <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No projects yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first project to start coding together!
                </p>
                <button
                  onClick={createProject}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => router.push(`/project/${project._id}`)}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {project.language}
                      </span>
                      <span>
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {authMode === "login" ? "Welcome Back" : "Create Account"}
            </h2>

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === "register" && (
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              )}

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {authMode === "login" ? "Login" : "Register"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() =>
                  setAuthMode(authMode === "login" ? "register" : "login")
                }
                className="text-blue-600 hover:text-blue-700"
              >
                {authMode === "login"
                  ? "Don't have an account? Register"
                  : "Already have an account? Login"}
              </button>
            </div>

            <button
              onClick={() => setShowAuth(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
