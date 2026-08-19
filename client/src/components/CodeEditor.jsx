import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Trash2, Loader2 } from 'lucide-react';

const BOILERPLATES = {
  javascript: 'console.log("Hello, World!");\n',
  python: 'print("Hello, World!")\n',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}\n',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n'
};

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', id: 93 }, // Node.js
  { value: 'python', label: 'Python', id: 71 }, // Python 3
  { value: 'cpp', label: 'C++', id: 54 }, // GCC
  { value: 'java', label: 'Java', id: 62 } // OpenJDK
];

export default function CodeEditor() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(BOILERPLATES['javascript']);
  const [output, setOutput] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(BOILERPLATES[newLang]);
    setOutput('');
    setIsError(false);
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const runCode = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    setOutput('Running...');
    setIsError(false);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        setOutput('Execution finished with no output.');
        setIsError(false);
      }
    } catch (error) {
      setOutput('Failed to execute code: ' + error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const clearOutput = () => {
    setOutput('');
    setIsError(false);
  };

  return (
    <div className="flex flex-col h-[600px] w-full border border-gray-800 rounded-lg overflow-hidden bg-[#1e1e1e] shadow-2xl font-sans">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-[#3c3c3c] text-gray-200 text-sm rounded-md px-3 py-1.5 border-none focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-sm"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={clearOutput}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-[#3c3c3c] rounded-md transition-colors"
            title="Clear Output"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Clear</span>
          </button>
          
          <button
            onClick={runCode}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              isLoading 
                ? 'bg-blue-600/50 text-blue-200 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Play size={16} />
            )}
            <span>{isLoading ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Output Container */}
      <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
        {/* Editor Pane */}
        <div className="flex-grow lg:w-2/3 border-b lg:border-b-0 lg:border-r border-gray-800 relative">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16 }
            }}
          />
        </div>

        {/* Output Pane */}
        <div className="lg:w-1/3 bg-[#1e1e1e] flex flex-col min-h-[200px] lg:min-h-0">
          <div className="px-4 py-2 border-b border-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-[#252526]">
            Terminal Output
          </div>
          <div className="flex-grow p-4 overflow-y-auto font-mono text-sm">
            {output ? (
              <pre className={`whitespace-pre-wrap break-words ${isError ? 'text-red-400' : 'text-gray-300'}`}>
                {output}
              </pre>
            ) : (
              <div className="text-gray-500 italic">Code output will appear here...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
