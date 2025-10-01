
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, HelpCircle, X, ChevronUp, ChevronDown, ZoomIn, ZoomOut } from 'lucide-react';

const GitRepoVisualizer = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCommit, setCurrentCommit] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [cameraY, setCameraY] = useState(25);
  const [cameraZoom, setCameraZoom] = useState(35);

  // Real git repo structure that makes sense
  const repoData = {
    name: "TaskManager App",
    description: "Learn how a real app is built step-by-step",
    commits: [
      { 
        id: 0, 
        message: "Initial setup", 
        explanation: "Every project starts here. We create package.json to list dependencies and README to document the project.",
        folder: "root",
        files: [
          { name: 'package.json', type: 'config', explanation: 'Lists all npm packages this project needs (like React, Redux)', purpose: 'Dependency management' },
          { name: 'README.md', type: 'docs', explanation: 'Documentation for developers - how to run and use the app', purpose: 'Project documentation' }
        ]
      },
      { 
        id: 1, 
        message: "Create entry point", 
        explanation: "index.js is where React starts. It mounts the App component into the HTML page.",
        folder: "src/",
        files: [
          { name: 'index.js', type: 'entry', explanation: 'The first JavaScript file that runs. Renders <App /> into the DOM', purpose: 'Application entry point' },
          { name: 'App.js', type: 'root', explanation: 'The main React component. Contains routing and overall app structure', purpose: 'Root component' }
        ]
      },
      { 
        id: 2, 
        message: "Add UI components", 
        explanation: "Components are reusable UI pieces. Each one handles a specific part of the interface.",
        folder: "src/components/",
        files: [
          { name: 'TaskList.js', type: 'component', explanation: 'Displays all tasks in a list. Maps over task array and renders TaskItem for each', purpose: 'Display tasks' },
          { name: 'TaskItem.js', type: 'component', explanation: 'Shows a single task with checkbox and delete button. Handles task actions', purpose: 'Individual task UI' },
          { name: 'AddTaskForm.js', type: 'component', explanation: 'Input form to create new tasks. Controlled component with useState for input', purpose: 'Create new tasks' }
        ]
      },
      { 
        id: 3, 
        message: "Add state management", 
        explanation: "Redux stores all app data in one place. Actions change state, reducers describe how.",
        folder: "src/store/",
        files: [
          { name: 'store.js', type: 'store', explanation: 'Creates the Redux store. Central data hub for the entire app', purpose: 'State container' },
          { name: 'tasksSlice.js', type: 'store', explanation: 'Defines tasks state, actions (addTask, deleteTask), and reducers', purpose: 'Task state logic' }
        ]
      },
      { 
        id: 4, 
        message: "Connect to backend", 
        explanation: "API layer talks to the server. Fetches tasks from database and sends updates.",
        folder: "src/api/",
        files: [
          { name: 'api.js', type: 'api', explanation: 'Axios client configured with base URL and auth headers', purpose: 'HTTP client setup' },
          { name: 'tasksAPI.js', type: 'api', explanation: 'Functions like getTasks(), createTask(), deleteTask() that call REST endpoints', purpose: 'Task API calls' }
        ]
      },
      { 
        id: 5, 
        message: "Add authentication", 
        explanation: "Users need to login. Auth system manages user sessions and protected routes.",
        folder: "src/auth/",
        files: [
          { name: 'Login.js', type: 'component', explanation: 'Login form component. Sends credentials to /auth/login endpoint', purpose: 'User login UI' },
          { name: 'authSlice.js', type: 'store', explanation: 'Stores user token and info in Redux. Handles login/logout actions', purpose: 'Auth state' },
          { name: 'PrivateRoute.js', type: 'component', explanation: 'Wrapper that redirects to login if user not authenticated', purpose: 'Route protection' }
        ]
      },
      { 
        id: 6, 
        message: "Add tests", 
        explanation: "Tests verify code works correctly. Run automatically to catch bugs early.",
        folder: "src/__tests__/",
        files: [
          { name: 'TaskList.test.js', type: 'test', explanation: 'Tests TaskList component: renders tasks, handles clicks, updates correctly', purpose: 'Component testing' },
          { name: 'tasksSlice.test.js', type: 'test', explanation: 'Tests Redux logic: actions dispatch correctly, reducers update state properly', purpose: 'State logic testing' }
        ]
      },
      { 
        id: 7, 
        message: "Style the app", 
        explanation: "CSS makes it look good. Styles layout, colors, spacing, and responsiveness.",
        folder: "src/styles/",
        files: [
          { name: 'global.css', type: 'css', explanation: 'Base styles: fonts, colors, reset. Applied to entire app', purpose: 'Global styles' },
          { name: 'TaskList.css', type: 'css', explanation: 'Styles specific to TaskList: grid layout, hover effects, animations', purpose: 'Component styles' }
        ]
      },
    ]
  };

  // File type colors and info
  const fileTypes = {
    config: { color: '#ef4444', icon: '⚙️', name: 'Config' },
    docs: { color: '#06b6d4', icon: '📝', name: 'Docs' },
    entry: { color: '#eab308', icon: '🚀', name: 'Entry' },
    root: { color: '#f59e0b', icon: '🏠', name: 'Root' },
    component: { color: '#10b981', icon: '🧩', name: 'Component' },
    store: { color: '#ec4899', icon: '💾', name: 'State' },
    api: { color: '#8b5cf6', icon: '🌐', name: 'API' },
    test: { color: '#6366f1', icon: '🧪', name: 'Test' },
    css: { color: '#d946ef', icon: '🎨', name: 'Style' }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    sceneRef.current = scene;

    const aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    camera.position.set(0, cameraY, cameraZoom);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 20, 10);
    scene.add(pointLight);

    updateScene();

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (mountRef.current && renderer.domElement.parentElement === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.y = cameraY;
      cameraRef.current.position.z = cameraZoom;
      cameraRef.current.lookAt(0, 0, 0);
    }
  }, [cameraY, cameraZoom]);

  const updateScene = () => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clear scene
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }

    // Re-add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 20, 10);
    scene.add(pointLight);

    const commitSpacing = 10;

    // Draw commits
    for (let i = 0; i <= currentCommit; i++) {
      const commit = repoData.commits[i];
      const y = -i * commitSpacing;

      // Commit node
      const commitGeo = new THREE.SphereGeometry(0.8, 20, 20);
      const commitMat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        emissive: 0x3b82f6,
        emissiveIntensity: 0.5
      });
      const commitSphere = new THREE.Mesh(commitGeo, commitMat);
      commitSphere.position.set(0, y, 0);
      scene.add(commitSphere);

      // Branch line
      if (i > 0) {
        const prevY = -(i - 1) * commitSpacing;
        const points = [new THREE.Vector3(0, prevY, 0), new THREE.Vector3(0, y, 0)];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({ color: 0x3b82f6, linewidth: 2 });
        const line = new THREE.Line(lineGeo, lineMat);
        scene.add(line);
      }

      // Files around commit
      commit.files.forEach((file, idx) => {
        const angle = (idx / commit.files.length) * Math.PI * 2;
        const radius = 8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const fileColor = fileTypes[file.type].color;
        const fileGeo = new THREE.SphereGeometry(1, 24, 24);
        const fileMat = new THREE.MeshStandardMaterial({
          color: fileColor,
          emissive: fileColor,
          emissiveIntensity: 0.3
        });
        const fileSphere = new THREE.Mesh(fileGeo, fileMat);
        fileSphere.position.set(x, y, z);
        scene.add(fileSphere);

        // Connection line
        const points = [new THREE.Vector3(0, y, 0), new THREE.Vector3(x, y, z)];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({ color: fileColor, opacity: 0.3, transparent: true });
        const line = new THREE.Line(lineGeo, lineMat);
        scene.add(line);
      });
    }
  };

  useEffect(() => {
    updateScene();
  }, [currentCommit]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentCommit(prev => {
          if (prev >= repoData.commits.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentCommitData = repoData.commits[currentCommit];

  return (
    <div className="w-full h-screen bg-slate-900 flex">
      {/* Left Panel - The Learning Part */}
      <div className="w-2/5 bg-slate-800 border-r-4 border-blue-500 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">🌳 Git Repo Explorer</h1>
          <p className="text-slate-300">Learn how a real app is built, commit by commit</p>
        </div>

        {/* Current Commit Info */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 mb-6 border-2 border-blue-400">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white text-blue-600 font-bold rounded-full w-12 h-12 flex items-center justify-center text-xl">
              {currentCommit + 1}
            </div>
            <div>
              <p className="text-blue-100 text-sm">Commit {currentCommit + 1} of {repoData.commits.length}</p>
              <p className="text-white font-bold text-xl">{currentCommitData.message}</p>
            </div>
          </div>
          <p className="text-blue-50 text-base leading-relaxed">{currentCommitData.explanation}</p>
          <div className="mt-3 bg-blue-800 bg-opacity-50 rounded-lg px-3 py-2">
            <p className="text-blue-200 text-sm">📁 Folder: <span className="font-mono text-white">{currentCommitData.folder}</span></p>
          </div>
        </div>

        {/* Files in this commit */}
        <div className="space-y-3">
          <h3 className="text-white font-bold text-lg mb-3">Files added in this commit:</h3>
          {currentCommitData.files.map((file, idx) => {
            const type = fileTypes[file.type];
            return (
              <button
                key={idx}
                onClick={() => setSelectedFile({ ...file, commitId: currentCommit })}
                className="w-full bg-slate-900 hover:bg-slate-700 border-2 border-slate-700 hover:border-blue-500 rounded-xl p-4 text-left transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{type.icon}</span>
                  <div className="flex-1">
                    <p className="text-white font-bold font-mono">{file.name}</p>
                    <span className={`text-xs px-2 py-1 rounded font-bold`} style={{ backgroundColor: type.color }}>
                      {type.name}
                    </span>
                  </div>
                </div>
                <p className="text-slate-300 text-sm">{file.explanation}</p>
              </button>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="mt-8 pt-6 border-t-2 border-slate-700">
          <h3 className="text-white font-bold mb-4">All Commits Timeline:</h3>
          <div className="space-y-2">
            {repoData.commits.map((commit, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentCommit(idx);
                  setIsPlaying(false);
                }}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  idx === currentCommit
                    ? 'bg-blue-600 text-white'
                    : idx <= currentCommit
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                <p className="font-bold">{idx + 1}. {commit.message}</p>
                <p className="text-xs opacity-75">{commit.files.length} files • {commit.folder}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - 3D Visualization */}
      <div className="flex-1 relative">
        <div ref={mountRef} className="w-full h-full" />

        {/* Camera Controls */}
        <div className="absolute top-4 right-4 bg-slate-800 bg-opacity-95 rounded-xl p-4 border-2 border-blue-500">
          <p className="text-white font-bold mb-3 text-center">📷 View</p>
          
          <div className="space-y-2">
            <button
              onClick={() => setCameraY(Math.min(50, cameraY + 5))}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2"
            >
              <ChevronUp size={20} /> Up
            </button>
            <button
              onClick={() => setCameraY(Math.max(0, cameraY - 5))}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2"
            >
              <ChevronDown size={20} /> Down
            </button>
            <button
              onClick={() => setCameraZoom(Math.max(15, cameraZoom - 5))}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2"
            >
              <ZoomIn size={20} /> Zoom In
            </button>
            <button
              onClick={() => setCameraZoom(Math.min(60, cameraZoom + 5))}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2"
            >
              <ZoomOut size={20} /> Zoom Out
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-slate-800 bg-opacity-95 rounded-xl p-4 border-2 border-slate-700">
          <p className="text-white font-bold mb-2 text-sm">Legend:</p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-slate-300">Commit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-purple-500"></div>
              <span className="text-slate-300">Files</span>
            </div>
          </div>
        </div>
      </div>

      {/* File Detail Modal */}
      {selectedFile && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center p-8 z-50">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-2xl border-4 border-blue-500">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-6xl">{fileTypes[selectedFile.type].icon}</span>
                <div>
                  <p className="text-white font-bold text-3xl font-mono">{selectedFile.name}</p>
                  <span className="text-lg px-3 py-1 rounded-lg font-bold mt-2 inline-block" style={{ backgroundColor: fileTypes[selectedFile.type].color }}>
                    {fileTypes[selectedFile.type].name}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-white">
                <X size={32} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-900 rounded-xl p-4">
                <p className="text-slate-400 text-sm font-bold mb-2">📝 What it does:</p>
                <p className="text-white text-lg leading-relaxed">{selectedFile.explanation}</p>
              </div>

              <div className="bg-slate-900 rounded-xl p-4">
                <p className="text-slate-400 text-sm font-bold mb-2">🎯 Purpose:</p>
                <p className="text-blue-400 text-lg font-bold">{selectedFile.purpose}</p>
              </div>

              <div className="bg-slate-900 rounded-xl p-4">
                <p className="text-slate-400 text-sm font-bold mb-2">📅 Added in:</p>
                <p className="text-white">Commit {selectedFile.commitId + 1}: {repoData.commits[selectedFile.commitId].message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-slate-800 border-t-2 border-blue-500 p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => {
              if (currentCommit >= repoData.commits.length - 1) {
                setCurrentCommit(0);
                setIsPlaying(true);
              } else {
                setIsPlaying(!isPlaying);
              }
            }}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg flex items-center gap-2"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <button
            onClick={() => {
              setCurrentCommit(0);
              setIsPlaying(false);
            }}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold flex items-center gap-2"
          >
            <RotateCcw size={20} />
            Reset
          </button>

          <div className="flex-1">
            <input
              type="range"
              min="0"
              max={repoData.commits.length - 1}
              value={currentCommit}
              onChange={(e) => {
                setCurrentCommit(parseInt(e.target.value));
                setIsPlaying(false);
              }}
              className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          <div className="text-white font-bold">
            {currentCommit + 1} / {repoData.commits.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitRepoVisualizer;
