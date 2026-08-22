import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Trash2, Loader2, Terminal, Code2, Sparkles, Copy, Check, Users, User, Zap } from 'lucide-react';
import { API_URL } from '../config';
import { socketService } from '../utils/socket';
import { getStoredUser } from '../utils/userClient';
import toast from 'react-hot-toast';

const BOILERPLATES = {
  javascript: '// JavaScript Collaborative Session\nfunction solve(input) {\n  console.log("Processing input:", input);\n  return input * 2;\n}\n\nconsole.log("Result:", solve(21));\n',
  python: '# Python 3 Collaborative Session\ndef solve(x):\n    print(f"Running calculation with {x}")\n    return x ** 2\n\nprint("Result:", solve(9))\n',
  cpp: '// C++ Collaborative Session\n#include <iostream>\n\nint main() {\n    std::cout << "Hello from GDG Peer Collab Room!" << std::endl;\n    return 0;\n}\n',
  java: '// Java Collaborative Session\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from GDG Peer Java Runner!");\n    }\n}\n'
};

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python 3' },
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' }
];

export default function CodeEditor({ roomId, onCodeChange }) {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(BOILERPLATES['javascript']);
  const [output, setOutput] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [runningPeer, setRunningPeer] = useState(null);
  const [lastRunner, setLastRunner] = useState(null);
  const [showConsole, setShowConsole] = useState(true);
  const [copied, setCopied] = useState(false);
  const [remotePeerEditor, setRemotePeerEditor] = useState(null);

  const editorRef = useRef(null);
  const isRemoteUpdate = useRef(false);
  const user = getStoredUser();

  // 1. Synchronize Code, Language, Room State, and Output with all peers
  useEffect(() => {
    if (!roomId) return;

    // Incoming code edit from peer
    const handleCodeUpdate = (data) => {
      if (!data) return;
      isRemoteUpdate.current = true;
      if (data.code !== undefined) {
        setCode(data.code);
      }
      if (data.language && data.language !== language) {
        setLanguage(data.language);
        toast(`Language changed to ${data.language} by ${data.senderName || 'peer'}`, { icon: '🔄' });
      }
      if (data.senderName) {
        setRemotePeerEditor(data.senderName);
        setTimeout(() => setRemotePeerEditor(null), 2500);
      }
    };

    // Full Room State on join
    const handleRoomState = (state) => {
      if (!state) return;
      isRemoteUpdate.current = true;
      if (state.code) {
        setCode(state.code);
      }
      if (state.language) {
        setLanguage(state.language);
      }
    };

    // Peer started running code
    const handleCodeExecuting = ({ runnerName, language: runLang }) => {
      setRunningPeer(runnerName);
      setIsLoading(true);
      setShowConsole(true);
      setOutput(`⏳ ${runnerName || 'A peer'} is executing ${runLang || 'code'} on server...`);
      setIsError(false);
    };

    // Peer code execution finished with output
    const handleCodeExecutionResult = ({ output: remoteOutput, isError: remoteError, runnerName }) => {
      setIsLoading(false);
      setRunningPeer(null);
      setLastRunner(runnerName);
      setShowConsole(true);
      setOutput(remoteOutput || '✓ Execution finished with no output.');
      setIsError(Boolean(remoteError));
    };

    socketService.on('code_update', handleCodeUpdate);
    socketService.on('room_state', handleRoomState);
    socketService.on('code_executing', handleCodeExecuting);
    socketService.on('code_execution_result', handleCodeExecutionResult);

    return () => {
      socketService.off('code_update', handleCodeUpdate);
      socketService.off('room_state', handleRoomState);
      socketService.off('code_executing', handleCodeExecuting);
      socketService.off('code_execution_result', handleCodeExecutionResult);
    };
  }, [roomId, language]);

  // Language Change Handler (Syncs to all peers in the room)
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    const newBoilerplate = BOILERPLATES[newLang] || '';
    setCode(newBoilerplate);
    setOutput('');
    setIsError(false);

    if (roomId) {
      socketService.emit('code_change', {
        roomId,
        code_diff: newBoilerplate,
        language: newLang
      });
    }
  };

  // Editor Content Change Handler (Syncs keystrokes to all peers in the room)
  const handleEditorChange = (value) => {
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }
    setCode(value);
    if (onCodeChange) onCodeChange(value);

    if (roomId) {
      const position = editorRef.current?.getPosition();
      socketService.emit('code_change', {
        roomId,
        code_diff: value,
        cursorPosition: position,
        language
      });
    }
  };

  // Run Code Handler (Broadcasts execution state and real-time output to all peers)
  const runCode = async () => {
    if (!code.trim() || isLoading) return;

    setIsLoading(true);
    setRunningPeer(null);
    setLastRunner('You');
    setShowConsole(true);
    setOutput('Executing code on server...');
    setIsError(false);

    if (roomId) {
      socketService.emit('code_executing', {
        roomId,
        language
      });
    }

    try {
      const response = await fetch(`${API_URL}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: language,
          code: code
        })
      });

      const data = await response.json();
      let finalOutput = '';
      let errorFlag = false;

      if (data.stderr) {
        finalOutput = data.stderr;
        errorFlag = true;
      } else if (data.stdout) {
        finalOutput = data.stdout;
        errorFlag = false;
      } else if (data.error) {
        finalOutput = data.error;
        errorFlag = true;
      } else {
        finalOutput = '✓ Execution finished with no output.';
        errorFlag = false;
      }

      setOutput(finalOutput);
      setIsError(errorFlag);

      // Broadcast execution output to all peers in the room
      if (roomId) {
        socketService.emit('code_execution_result', {
          roomId,
          output: finalOutput,
          isError: errorFlag,
          language
        });
      }

    } catch (error) {
      const errText = 'Failed to execute code: ' + error.message;
      setOutput(errText);
      setIsError(true);

      if (roomId) {
        socketService.emit('code_execution_result', {
          roomId,
          output: errText,
          isError: true,
          language
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const clearOutput = () => {
    setOutput('');
    setIsError(false);
  };

  return (
    <div className="flex flex-col h-full w-full rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-xl font-sans relative">
      
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5">
            <Code2 className="h-4 w-4 text-emerald-600" />
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-gray-100 text-gray-800 text-xs rounded-xl px-2.5 py-1.5 border border-gray-200 focus:outline-none focus:border-black cursor-pointer shadow-xs font-semibold"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {roomId && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync
            </span>
          )}

          {remotePeerEditor && (
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full animate-in fade-in">
              <Zap className="w-3 h-3 text-blue-500" />
              {remotePeerEditor} is typing...
            </span>
          )}

          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-xl transition-all ${
              showConsole 
                ? 'bg-gray-900 text-white font-bold shadow-xs' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Terminal</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={copyCode}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors font-medium"
            title="Copy code"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {showConsole && output && (
            <button
              onClick={clearOutput}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors font-medium"
              title="Clear Output"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
          
          <button
            onClick={runCode}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl transition-all shadow-md ${
              isLoading 
                ? 'bg-emerald-600/60 text-white cursor-not-allowed' 
                : 'bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95'
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-current" />
            )}
            <span>
              {isLoading 
                ? (runningPeer ? `${runningPeer} running...` : 'Running...') 
                : 'Run Code'
              }
            </span>
          </button>
        </div>
      </div>

      {/* 2. Monaco Editor & Synchronized Output Drawer */}
      <div className="flex-grow flex flex-col relative overflow-hidden">
        {/* Editor Pane */}
        <div className="flex-grow relative overflow-hidden">
          <Editor
            height="100%"
            language={language}
            theme="light"
            value={code}
            onChange={handleEditorChange}
            onMount={(editor) => { editorRef.current = editor; }}
            options={{
              minimap: { enabled: false },
              fontSize: 13.5,
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
              padding: { top: 12, bottom: 12 },
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              roundedSelection: true
            }}
          />
        </div>

        {/* Real-Time Terminal Console Output Drawer */}
        {showConsole && (
          <div className="h-44 bg-zinc-950 border-t border-zinc-800 flex flex-col shrink-0 text-white animate-in slide-in-from-bottom duration-150">
            
            {/* Terminal Header */}
            <div className="px-3.5 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                  Shared Terminal Output
                </span>
                {lastRunner && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 font-mono">
                    Run by: {lastRunner}
                  </span>
                )}
              </div>
              <button 
                onClick={() => setShowConsole(false)} 
                className="text-zinc-400 hover:text-white text-xs px-2 py-0.5 rounded-lg hover:bg-zinc-800 transition-colors"
                title="Hide Terminal"
              >
                ✕
              </button>
            </div>

            {/* Terminal Body */}
            <div className="flex-grow p-3.5 overflow-y-auto font-mono text-xs leading-relaxed select-text">
              {output ? (
                <pre className={`whitespace-pre-wrap break-words ${isError ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>
                  {output}
                </pre>
              ) : (
                <div className="text-zinc-500 italic font-sans text-xs">
                  Click 'Run Code' to execute across peers. Results appear live in this shared terminal.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
