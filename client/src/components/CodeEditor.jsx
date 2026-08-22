import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Trash2, Loader2, Terminal, Code2, Sparkles, Copy, Check, Users } from 'lucide-react';
import { API_URL } from '../config';
import { socketService } from '../utils/socket';
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
  const [showConsole, setShowConsole] = useState(true);
  const [copied, setCopied] = useState(false);
  const editorRef = useRef(null);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(BOILERPLATES[newLang] || '');
    setOutput('');
    setIsError(false);
  };

  const handleEditorChange = (value) => {
    setCode(value);
    if (onCodeChange) onCodeChange(value);
  };

  const runCode = async () => {
    if (!code.trim() || isLoading) return;

    setIsLoading(true);
    setShowConsole(true);
    setOutput('Executing code on server...');
    setIsError(false);

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

      if (data.stderr) {
        setOutput(data.stderr);
        setIsError(true);
      } else if (data.stdout) {
        setOutput(data.stdout);
        setIsError(false);
      } else if (data.error) {
        setOutput(data.error);
        setIsError(true);
      } else {
        setOutput('✓ Execution finished with no output.');
        setIsError(false);
      }
    } catch (error) {
      setOutput('Failed to execute code: ' + error.message);
      setIsError(true);
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
    <div className="flex flex-col h-full w-full rounded-xl overflow-hidden bg-white border border-gray-200 shadow-xl font-sans">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5">
            <Code2 className="h-4 w-4 text-emerald-500" />
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-gray-100 text-gray-800 text-xs rounded-md px-2.5 py-1.5 border border-gray-200 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-sm font-medium"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {roomId && (
            <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync
            </span>
          )}

          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors ${showConsole ? 'bg-gray-200 text-emerald-600 font-medium border border-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Console</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={copyCode}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {showConsole && output && (
            <button
              onClick={clearOutput}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              title="Clear Output"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
          
          <button
            onClick={runCode}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-md ${
              isLoading 
                ? 'bg-emerald-600/50 text-emerald-200 cursor-not-allowed' 
                : 'bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95'
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-current" />
            )}
            <span>{isLoading ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Output Container */}
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
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              padding: { top: 12 }
            }}
          />
        </div>

        {/* Console Output Drawer */}
        {showConsole && (
          <div className="h-40 bg-gray-50 border-t border-gray-200 flex flex-col shrink-0 animate-in slide-in-from-bottom duration-150">
            <div className="px-3 py-1.5 bg-white border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-gray-600" />
                <span className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider">Terminal Output</span>
              </div>
              <button 
                onClick={() => setShowConsole(false)} 
                className="text-gray-400 hover:text-gray-700 text-xs px-1.5 py-0.5 rounded hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <div className="flex-grow p-3 overflow-y-auto font-mono text-xs">
              {output ? (
                <pre className={`whitespace-pre-wrap break-words leading-relaxed ${isError ? 'text-red-600' : 'text-gray-900'}`}>
                  {output}
                </pre>
              ) : (
                <div className="text-gray-400 italic font-medium">Code output will appear here after clicking 'Run Code'...</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
