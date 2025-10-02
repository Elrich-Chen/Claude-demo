import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, X, ChevronUp, ChevronDown, ZoomIn, ZoomOut } from 'lucide-react';

const defaultRepoData = {
  name: 'TaskManager App',
  description: 'Learn how a real app is built step-by-step',
  commits: [
    {
      id: 0,
      sha: '0000000',
      author: 'Initial Commit',
      date: '2024-01-01T00:00:00Z',
      message: 'Initial setup',
      explanation:
        'Every project starts here. We create package.json to list dependencies and README to document the project.',
      folder: 'root',
      files: [
        {
          name: 'package.json',
          path: 'package.json',
          type: 'config',
          status: 'added',
          changes: 120,
          explanation: 'Added package.json to track dependencies and scripts for the TaskManager app.',
          purpose: 'Dependency management',
        },
        {
          name: 'README.md',
          path: 'README.md',
          type: 'docs',
          status: 'added',
          changes: 48,
          explanation: 'Created README to document project setup and usage instructions.',
          purpose: 'Project documentation',
        },
      ],
    },
    {
      id: 1,
      sha: '1111111',
      author: 'Initial Commit',
      date: '2024-01-02T00:00:00Z',
      message: 'Create entry point',
      explanation: 'index.js is where React starts. It mounts the App component into the HTML page.',
      folder: 'src/',
      files: [
        {
          name: 'index.js',
          path: 'src/index.js',
          type: 'entry',
          status: 'added',
          changes: 60,
          explanation: 'Introduced entry point to bootstrap the React application.',
          purpose: 'Application entry point',
        },
        {
          name: 'App.js',
          path: 'src/App.js',
          type: 'root',
          status: 'added',
          changes: 110,
          explanation: 'Created the root App component with high level layout.',
          purpose: 'Root component',
        },
      ],
    },
    {
      id: 2,
      sha: '2222222',
      author: 'Initial Commit',
      date: '2024-01-03T00:00:00Z',
      message: 'Add UI components',
      explanation: 'Components are reusable UI pieces. Each one handles a specific part of the interface.',
      folder: 'src/components/',
      files: [
        {
          name: 'TaskList.js',
          path: 'src/components/TaskList.js',
          type: 'component',
          status: 'added',
          changes: 92,
          explanation: 'Added TaskList to render a collection of tasks with controls.',
          purpose: 'Display tasks',
        },
        {
          name: 'TaskItem.js',
          path: 'src/components/TaskItem.js',
          type: 'component',
          status: 'added',
          changes: 68,
          explanation: 'Introduced TaskItem for individual task interactions.',
          purpose: 'Individual task UI',
        },
        {
          name: 'AddTaskForm.js',
          path: 'src/components/AddTaskForm.js',
          type: 'component',
          status: 'added',
          changes: 77,
          explanation: 'Created a controlled form to add new tasks.',
          purpose: 'Create new tasks',
        },
      ],
    },
    {
      id: 3,
      sha: '3333333',
      author: 'Initial Commit',
      date: '2024-01-04T00:00:00Z',
      message: 'Add state management',
      explanation: 'Redux stores all app data in one place. Actions change state, reducers describe how.',
      folder: 'src/store/',
      files: [
        {
          name: 'store.js',
          path: 'src/store/store.js',
          type: 'store',
          status: 'added',
          changes: 58,
          explanation: 'Configured Redux store as the central data hub.',
          purpose: 'State container',
        },
        {
          name: 'tasksSlice.js',
          path: 'src/store/tasksSlice.js',
          type: 'store',
          status: 'added',
          changes: 144,
          explanation: 'Implemented task reducers and actions for CRUD operations.',
          purpose: 'Task state logic',
        },
      ],
    },
    {
      id: 4,
      sha: '4444444',
      author: 'Initial Commit',
      date: '2024-01-05T00:00:00Z',
      message: 'Connect to backend',
      explanation: 'API layer talks to the server. Fetches tasks from database and sends updates.',
      folder: 'src/api/',
      files: [
        {
          name: 'api.js',
          path: 'src/api/api.js',
          type: 'api',
          status: 'added',
          changes: 84,
          explanation: 'Added API client with shared configuration.',
          purpose: 'HTTP client setup',
        },
        {
          name: 'tasksAPI.js',
          path: 'src/api/tasksAPI.js',
          type: 'api',
          status: 'added',
          changes: 101,
          explanation: 'Implemented REST helpers for task operations.',
          purpose: 'Task API calls',
        },
      ],
    },
    {
      id: 5,
      sha: '5555555',
      author: 'Initial Commit',
      date: '2024-01-06T00:00:00Z',
      message: 'Add authentication',
      explanation: 'Users need to login. Auth system manages user sessions and protected routes.',
      folder: 'src/auth/',
      files: [
        {
          name: 'Login.js',
          path: 'src/auth/Login.js',
          type: 'component',
          status: 'added',
          changes: 120,
          explanation: 'Built login form to collect credentials.',
          purpose: 'User login UI',
        },
        {
          name: 'authSlice.js',
          path: 'src/auth/authSlice.js',
          type: 'store',
          status: 'added',
          changes: 96,
          explanation: 'Added authentication slice to manage user session state.',
          purpose: 'Auth state',
        },
        {
          name: 'PrivateRoute.js',
          path: 'src/auth/PrivateRoute.js',
          type: 'component',
          status: 'added',
          changes: 54,
          explanation: 'Protected routes based on authentication status.',
          purpose: 'Route protection',
        },
      ],
    },
    {
      id: 6,
      sha: '6666666',
      author: 'Initial Commit',
      date: '2024-01-07T00:00:00Z',
      message: 'Add tests',
      explanation: 'Tests verify code works correctly. Run automatically to catch bugs early.',
      folder: 'src/__tests__/',
      files: [
        {
          name: 'TaskList.test.js',
          path: 'src/__tests__/TaskList.test.js',
          type: 'test',
          status: 'added',
          changes: 86,
          explanation: 'Covered TaskList component behavior with unit tests.',
          purpose: 'Component testing',
        },
        {
          name: 'tasksSlice.test.js',
          path: 'src/__tests__/tasksSlice.test.js',
          type: 'test',
          status: 'added',
          changes: 102,
          explanation: 'Added reducers and actions test coverage.',
          purpose: 'State logic testing',
        },
      ],
    },
    {
      id: 7,
      sha: '7777777',
      author: 'Initial Commit',
      date: '2024-01-08T00:00:00Z',
      message: 'Style the app',
      explanation: 'CSS makes it look good. Styles layout, colors, spacing, and responsiveness.',
      folder: 'src/styles/',
      files: [
        {
          name: 'global.css',
          path: 'src/styles/global.css',
          type: 'css',
          status: 'added',
          changes: 140,
          explanation: 'Added base styles and CSS reset.',
          purpose: 'Global styles',
        },
        {
          name: 'TaskList.css',
          path: 'src/styles/TaskList.css',
          type: 'css',
          status: 'added',
          changes: 74,
          explanation: 'Styled TaskList grid and hover states.',
          purpose: 'Component styles',
        },
      ],
    },
  ],
};

const fileTypes = {
  config: { color: '#ef4444', icon: '⚙️', name: 'Config' },
  docs: { color: '#06b6d4', icon: '📝', name: 'Docs' },
  entry: { color: '#eab308', icon: '🚀', name: 'Entry' },
  root: { color: '#f59e0b', icon: '🏠', name: 'Root' },
  component: { color: '#10b981', icon: '🧩', name: 'Component' },
  store: { color: '#ec4899', icon: '💾', name: 'State' },
  api: { color: '#8b5cf6', icon: '🌐', name: 'API' },
  test: { color: '#6366f1', icon: '🧪', name: 'Test' },
  css: { color: '#d946ef', icon: '🎨', name: 'Style' },
  json: { color: '#f97316', icon: '🧾', name: 'JSON' },
  md: { color: '#14b8a6', icon: '📘', name: 'Markdown' },
  script: { color: '#22d3ee', icon: '📜', name: 'Script' },
  data: { color: '#a855f7', icon: '🗂️', name: 'Data' },
  configfile: { color: '#facc15', icon: '🧷', name: 'Config' },
  asset: { color: '#38bdf8', icon: '🖼️', name: 'Asset' },
  unknown: { color: '#94a3b8', icon: '📄', name: 'File' },
};

const statusLabels = {
  added: { text: 'Added', color: '#16a34a' },
  modified: { text: 'Modified', color: '#f97316' },
  removed: { text: 'Removed', color: '#ef4444' },
  renamed: { text: 'Renamed', color: '#8b5cf6' },
};

const formatDate = (iso) => {
  if (!iso) return 'Unknown';
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    return iso;
  }
};

const inferFileType = (filename) => {
  const lower = filename.toLowerCase();
  if (lower.includes('.test.') || lower.includes('.spec.')) return 'test';
  if (lower.endsWith('.json')) return 'json';
  if (lower.endsWith('.md')) return 'md';
  if (lower.endsWith('.css') || lower.endsWith('.scss') || lower.endsWith('.sass')) return 'css';
  if (lower.endsWith('.ts') || lower.endsWith('.tsx')) return 'component';
  if (lower.endsWith('.js') || lower.endsWith('.jsx')) return 'component';
  if (lower.includes('slice')) return 'store';
  if (lower.includes('store')) return 'store';
  if (lower.includes('api')) return 'api';
  if (lower.includes('config') || lower.endsWith('.config.js')) return 'config';
  if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.svg')) return 'asset';
  if (lower.endsWith('.yml') || lower.endsWith('.yaml') || lower.endsWith('.toml') || lower.endsWith('.ini')) return 'configfile';
  if (lower.endsWith('.lock')) return 'config';
  if (lower.endsWith('.sql') || lower.endsWith('.csv')) return 'data';
  if (lower.endsWith('.py') || lower.endsWith('.sh')) return 'script';
  return 'unknown';
};

const describeFileChange = (file) => {
  const status = statusLabels[file.status]?.text ?? file.status;
  const changeInfo = file.changes != null ? `${file.changes} changes` : '';
  return `${status ?? 'Updated'} ${file.filename}${changeInfo ? ` (${changeInfo})` : ''}`;
};

const createTextSprite = (
  text,
  {
    backgroundColor = 'rgba(30, 64, 175, 0.85)',
    textColor = '#ffffff',
    fontSize = 48,
    padding = 24,
  } = {}
) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  context.font = `bold ${fontSize}px Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  const textWidth = context.measureText(text).width;

  canvas.width = textWidth + padding * 2;
  canvas.height = fontSize + padding * 2;

  context.font = `bold ${fontSize}px Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = textColor;
  context.textBaseline = 'middle';
  context.fillText(text, padding, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  const scaleFactor = 0.015;
  sprite.scale.set(canvas.width * scaleFactor, canvas.height * scaleFactor, 1);
  return sprite;
};

const disposeMaterial = (material) => {
  if (!material) return;
  if (Array.isArray(material)) {
    material.forEach(disposeMaterial);
    return;
  }
  if (material.map) {
    material.map.dispose();
  }
  material.dispose?.();
};

const disposeNode = (node) => {
  if (node.geometry) {
    node.geometry.dispose();
  }
  if (node.material) {
    disposeMaterial(node.material);
  }
  if (node.texture) {
    node.texture.dispose?.();
  }
};

const parseRepoInput = (input) => {
  const trimmed = input.trim();
  if (!trimmed) throw new Error('Please provide a GitHub repository URL or owner/name.');

  const githubUrlPattern = /github\.com\/(.+?)\/(.+?)(?:\.git|\/?$)/i;
  const directPattern = /([^\s\/]+)\/([^\s\/]+)/;

  let match = trimmed.match(githubUrlPattern);
  if (match) {
    return { owner: match[1], repo: match[2] };
  }

  match = trimmed.match(directPattern);
  if (match) {
    return { owner: match[1], repo: match[2] };
  }

  throw new Error('Unable to parse repository reference. Use owner/name or full GitHub URL.');
};

const deriveFolderFromFiles = (files) => {
  if (!files?.length) return 'root';
  const firstPath = files[0].path ?? files[0].filename ?? '';
  if (!firstPath.includes('/')) return 'root';
  return `${firstPath.split('/').slice(0, -1).join('/')}/`;
};

const GitRepoVisualizer = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCommit, setCurrentCommit] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [cameraY, setCameraY] = useState(25);
  const [cameraZoom, setCameraZoom] = useState(35);
  const [repoData, setRepoData] = useState(defaultRepoData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [repoInput, setRepoInput] = useState('');

  const getFileType = useCallback((typeKey) => fileTypes[typeKey] ?? fileTypes.unknown, []);

  const resetPlayback = useCallback(() => {
    setIsPlaying(false);
    setCurrentCommit(0);
  }, []);

  useEffect(() => {
    if (!mountRef.current || sceneRef.current || rendererRef.current) return;

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
    const pointLight = new THREE.PointLight(0xffffff, 1.2);
    pointLight.position.set(10, 20, 10);
    scene.add(pointLight);

    const renderLoop = () => {
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      animationRef.current = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      scene.traverse((child) => disposeNode(child));
      if (renderer.domElement.parentElement === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
    };
  }, [cameraY, cameraZoom]);

  useEffect(() => {
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateScene = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const lights = scene.children.filter((child) => child.isLight);
    scene.children
      .filter((child) => !child.isLight)
      .forEach((child) => {
        scene.remove(child);
        disposeNode(child);
      });

    lights.forEach((light) => {
      if (!scene.children.includes(light)) {
        scene.add(light);
      }
    });

    const commitSpacing = 10;

    for (let i = 0; i <= currentCommit && i < repoData.commits.length; i++) {
      const commit = repoData.commits[i];
      const y = -i * commitSpacing;

      const commitGeo = new THREE.SphereGeometry(0.8, 20, 20);
      const commitMat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        emissive: 0x3b82f6,
        emissiveIntensity: 0.5,
      });
      const commitSphere = new THREE.Mesh(commitGeo, commitMat);
      commitSphere.position.set(0, y, 0);
      scene.add(commitSphere);

      const label = createTextSprite(`#${i + 1} ${commit.message}`);
      label.position.set(0, y + 2.5, 0);
      scene.add(label);

      const authorLabel = createTextSprite(`${commit.author ?? 'Unknown'} • ${formatDate(commit.date)}`, {
        backgroundColor: 'rgba(15, 118, 110, 0.85)',
        fontSize: 36,
        padding: 18,
      });
      authorLabel.position.set(0, y + 1.2, 0);
      scene.add(authorLabel);

      if (i > 0) {
        const prevY = -(i - 1) * commitSpacing;
        const points = [new THREE.Vector3(0, prevY, 0), new THREE.Vector3(0, y, 0)];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({ color: 0x3b82f6 });
        const line = new THREE.Line(lineGeo, lineMat);
        scene.add(line);
      }

      commit.files.forEach((file, idx) => {
        const angle = (idx / Math.max(commit.files.length, 1)) * Math.PI * 2;
        const radius = 8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const fileType = getFileType(file.type);
        const fileColor = fileType.color;
        const fileGeo = new THREE.SphereGeometry(1, 24, 24);
        const fileMat = new THREE.MeshStandardMaterial({
          color: fileColor,
          emissive: fileColor,
          emissiveIntensity: 0.3,
        });
        const fileSphere = new THREE.Mesh(fileGeo, fileMat);
        fileSphere.position.set(x, y, z);
        scene.add(fileSphere);

        const fileLabel = createTextSprite(file.name, {
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          fontSize: 32,
          padding: 16,
        });
        fileLabel.position.set(x, y + 1.8, z);
        scene.add(fileLabel);

        const statusColor = statusLabels[file.status]?.color ?? '#0ea5e9';
        const statusLabel = createTextSprite(statusLabels[file.status]?.text ?? file.status ?? 'Updated', {
          backgroundColor: `${statusColor}cc`,
          fontSize: 28,
          padding: 14,
        });
        statusLabel.position.set(x, y + 0.6, z);
        scene.add(statusLabel);

        const points = [new THREE.Vector3(0, y, 0), new THREE.Vector3(x, y, z)];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({ color: fileColor, opacity: 0.3, transparent: true });
        const line = new THREE.Line(lineGeo, lineMat);
        scene.add(line);
      });
    }
  }, [currentCommit, repoData, getFileType]);

  useEffect(() => {
    updateScene();
  }, [updateScene]);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.y = cameraY;
      cameraRef.current.position.z = cameraZoom;
      cameraRef.current.lookAt(0, 0, 0);
    }
  }, [cameraY, cameraZoom]);

  useEffect(() => {
    resetPlayback();
  }, [repoData, resetPlayback]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentCommit((prev) => {
        if (prev >= repoData.commits.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isPlaying, repoData.commits.length]);

  const fetchRepositoryData = useCallback(
    async (input) => {
      try {
        setIsLoading(true);
        setError(null);
        const { owner, repo } = parseRepoInput(input);

        const [repoResponse, commitsResponse] = await Promise.all([
          fetch(`https://api.github.com/repos/${owner}/${repo}`),
          fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=12`),
        ]);

        if (!repoResponse.ok) {
          throw new Error(`Unable to load repository: ${repoResponse.status}`);
        }
        if (!commitsResponse.ok) {
          throw new Error(`Unable to load commits: ${commitsResponse.status}`);
        }

        const repoInfo = await repoResponse.json();
        const commits = await commitsResponse.json();

        const commitDetails = await Promise.all(
          commits.map(async (commit, idx) => {
            const commitSha = commit.sha;
            const detailsResponse = await fetch(
              `https://api.github.com/repos/${owner}/${repo}/commits/${commitSha}`
            );
            if (!detailsResponse.ok) {
              throw new Error(`Failed to load commit details for ${commitSha}`);
            }
            const detail = await detailsResponse.json();
            const files = (detail.files ?? []).map((file, fileIdx) => {
              const type = inferFileType(file.filename);
              const typeMeta = fileTypes[type] ?? fileTypes.unknown;
              return {
                id: `${commitSha}-${fileIdx}`,
                name: file.filename.split('/').pop() ?? file.filename,
                path: file.filename,
                type,
                status: file.status,
                changes: file.changes,
                explanation: describeFileChange(file),
                purpose: `File type: ${typeMeta.name}`,
              };
            });

            return {
              id: idx,
              sha: commitSha,
              author: detail.commit?.author?.name ?? commit.commit?.author?.name ?? 'Unknown',
              date: detail.commit?.author?.date ?? commit.commit?.author?.date,
              message: detail.commit?.message?.split('\n')[0] ?? 'Commit',
              explanation: detail.commit?.message ?? '',
              folder: deriveFolderFromFiles(files),
              files,
            };
          })
        );

        const normalizedRepo = {
          name: repoInfo.full_name ?? repoInfo.name ?? `${owner}/${repo}`,
          description: repoInfo.description ?? '',
          commits: commitDetails,
          url: repoInfo.html_url,
        };

        setRepoData(normalizedRepo);
      } catch (err) {
        console.error(err);
        setError(err.message ?? 'Failed to load repository.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const repoMeta = useMemo(
    () => ({
      name: repoData.name,
      description: repoData.description,
      commitCount: repoData.commits.length,
    }),
    [repoData]
  );

  const currentCommitData = repoData.commits[currentCommit] ?? repoData.commits[repoData.commits.length - 1];

  return (
    <div className="w-full h-screen bg-slate-900 flex">
      {/* Left Panel */}
      <div className="w-2/5 bg-slate-800 border-r-4 border-blue-500 p-6 overflow-y-auto">
        <div className="mb-6 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">🌳 Git Repo Explorer</h1>
            <p className="text-slate-300">Paste a GitHub link and watch the commit history come alive.</p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
            <div>
              <label className="text-slate-300 text-sm font-semibold block mb-2" htmlFor="repo-input">
                GitHub repository URL or owner/name
              </label>
              <input
                id="repo-input"
                type="text"
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && repoInput.trim() && !isLoading) {
                    fetchRepositoryData(repoInput);
                  }
                }}
                placeholder="facebook/react or https://github.com/facebook/react"
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => repoInput.trim() && fetchRepositoryData(repoInput)}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:text-blue-200 text-white font-semibold rounded-lg transition"
              >
                {isLoading ? 'Loading…' : 'Load repository'}
              </button>
              <button
                onClick={() => {
                  setRepoInput('');
                  setRepoData(defaultRepoData);
                  resetPlayback();
                  setError(null);
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
              >
                Use demo repo
              </button>
            </div>
            {error && <p className="text-red-400 text-sm">⚠️ {error}</p>}
            <p className="text-slate-400 text-xs">Tip: Works best with public repositories under the GitHub rate limit.</p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700 rounded-xl p-4">
            <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Loaded repository</p>
            <p className="text-white text-lg font-semibold">{repoMeta.name}</p>
            {repoMeta.description && <p className="text-slate-300 text-sm mt-1">{repoMeta.description}</p>}
            <p className="text-slate-400 text-xs mt-2">Commits loaded: {repoMeta.commitCount}</p>
          </div>
        </div>

        {currentCommitData && (
          <>
            {/* Current Commit Info */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 mb-6 border-2 border-blue-400">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white text-blue-600 font-bold rounded-full w-12 h-12 flex items-center justify-center text-xl">
                  {currentCommit + 1}
                </div>
                <div>
                  <p className="text-blue-100 text-sm">
                    Commit {currentCommit + 1} of {repoData.commits.length}
                  </p>
                  <p className="text-white font-bold text-xl">{currentCommitData.message}</p>
                </div>
              </div>
              <p className="text-blue-50 text-base leading-relaxed whitespace-pre-line">
                {currentCommitData.explanation}
              </p>
              <div className="mt-3 bg-blue-800 bg-opacity-50 rounded-lg px-3 py-2 space-y-1">
                <p className="text-blue-200 text-sm">
                  📁 Folder: <span className="font-mono text-white">{currentCommitData.folder}</span>
                </p>
                <p className="text-blue-200 text-sm">👤 Author: {currentCommitData.author ?? 'Unknown'}</p>
                <p className="text-blue-200 text-sm">📅 {formatDate(currentCommitData.date)}</p>
                <p className="text-blue-200 text-sm font-mono">SHA: {currentCommitData.sha?.slice(0, 12)}</p>
              </div>
            </div>

            {/* Files in this commit */}
            <div className="space-y-3">
              <h3 className="text-white font-bold text-lg mb-3">Files touched in this commit:</h3>
              {currentCommitData.files.map((file, idx) => {
                const type = getFileType(file.type);
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
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-1 rounded font-bold" style={{ backgroundColor: type.color }}>
                            {type.name}
                          </span>
                          {file.status && (
                            <span
                              className="text-xs px-2 py-1 rounded font-bold"
                              style={{ backgroundColor: (statusLabels[file.status]?.color ?? '#0ea5e9') + '33' }}
                            >
                              {statusLabels[file.status]?.text ?? file.status}
                            </span>
                          )}
                          {typeof file.changes === 'number' && (
                            <span className="text-xs px-2 py-1 rounded font-bold bg-slate-700 text-slate-200">
                              {file.changes} changes
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm">{file.explanation}</p>
                    <p className="text-slate-500 text-xs mt-2 font-mono">{file.path}</p>
                  </button>
                );
              })}
              {currentCommitData.files.length === 0 && (
                <p className="text-slate-400 text-sm">No file metadata available for this commit.</p>
              )}
            </div>
          </>
        )}

        {/* Timeline */}
        <div className="mt-8 pt-6 border-t-2 border-slate-700">
          <h3 className="text-white font-bold mb-4">All Commits Timeline:</h3>
          <div className="space-y-2">
            {repoData.commits.map((commit, idx) => (
              <button
                key={commit.sha ?? idx}
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
                <p className="font-bold">
                  {idx + 1}. {commit.message}
                </p>
                <p className="text-xs opacity-75 font-mono">
                  {(commit.sha ?? '').slice(0, 7)} • {formatDate(commit.date)}
                </p>
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
              onClick={() => setCameraY((prev) => Math.min(50, prev + 5))}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2"
            >
              <ChevronUp size={20} /> Up
            </button>
            <button
              onClick={() => setCameraY((prev) => Math.max(0, prev - 5))}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2"
            >
              <ChevronDown size={20} /> Down
            </button>
            <button
              onClick={() => setCameraZoom((prev) => Math.max(15, prev - 5))}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2"
            >
              <ZoomIn size={20} /> Zoom In
            </button>
            <button
              onClick={() => setCameraZoom((prev) => Math.min(60, prev + 5))}
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
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-300">Commit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-purple-500" />
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
                <span className="text-6xl">{getFileType(selectedFile.type).icon}</span>
                <div>
                  <p className="text-white font-bold text-3xl font-mono">{selectedFile.name}</p>
                  <span
                    className="text-lg px-3 py-1 rounded-lg font-bold mt-2 inline-block"
                    style={{ backgroundColor: getFileType(selectedFile.type).color }}
                  >
                    {getFileType(selectedFile.type).name}
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
                <p className="text-slate-400 text-sm font-bold mb-2">📄 Path:</p>
                <p className="text-white font-mono text-sm">{selectedFile.path}</p>
              </div>

              <div className="bg-slate-900 rounded-xl p-4">
                <p className="text-slate-400 text-sm font-bold mb-2">📅 Added in:</p>
                <p className="text-white">
                  Commit {selectedFile.commitId + 1}: {repoData.commits[selectedFile.commitId].message}
                </p>
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
                setIsPlaying((prev) => !prev);
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
              max={Math.max(repoData.commits.length - 1, 0)}
              value={currentCommit}
              onChange={(e) => {
                setCurrentCommit(parseInt(e.target.value, 10));
                setIsPlaying(false);
              }}
              className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          <div className="text-white font-bold">
            {repoData.commits.length ? currentCommit + 1 : 0} / {repoData.commits.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitRepoVisualizer;
