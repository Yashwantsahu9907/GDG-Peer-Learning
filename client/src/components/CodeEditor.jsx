import React, { useState } from'react';
import Editor from'@monaco-editor/react';
import { Play, Trash2, Loader2, Terminal, Code2, Sparkles } from'lucide-react';

const BOILERPLATES = {
 javascript:' console.log("Hello world");\n',
 python:'print("Hello world")\n',
 cpp:'#include <iostream>\n using namespace std;\nint main() {\n cout <<"Hello World" << endl;\n return 0;\n}\n',
 java:'// Java Workspace\npublic class Main {\n public static void main(String[] args) {\n System.out.println("Hello from GDG Peer Java Runner!");\n }\n}\n'
};

const LANGUAGES = [
 { value:'javascript', label:'JavaScript' },
 { value:'python', label:'Python ' },
 { value:'cpp', label:'C++ ' },
 { value:'java', label:'Java' }
];

export default function CodeEditor() {
 const [language, setLanguage] = useState('javascript');
 const [code, setCode] = useState(BOILERPLATES['javascript']);
 const [output, setOutput] = useState('');
 const [isError, setIsError] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 const [showConsole, setShowConsole] = useState(true);

 const handleLanguageChange = (e) => {
 const newLang = e.target.value;
 setLanguage(newLang);
 setCode(BOILERPLATES[newLang] ||'');
 setOutput('');
 setIsError(false);
 };

 const handleEditorChange = (value) => {
 setCode(value);
 };

 const runCode = async () => {
 if (!code.trim() || isLoading) return;

 setIsLoading(true);
 setShowConsole(true);
 setOutput('Executing code on server...');
 setIsError(false);

 try {
 const apiUrl = import.meta.env.VITE_SERVER_URL ||'http://localhost:5000';
 const response = await fetch(`${apiUrl}/api/execute`, {
 method:'POST',
 headers: {'Content-Type':'application/json',
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
 setOutput('✓ Execution finished with no output.');
 setIsError(false);
 }
 } catch (error) {
 setOutput('Failed to execute code:' + error.message);
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
 <div className="flex flex-col h-full w-full rounded-xl overflow-hidden bg-white border border-gray-200 shadow-xl font-sans">
 {/* Header Bar */}
 <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-200 shrink-0">
 <div className="flex items-center gap-3">
 <div className="flex items-center gap-1.5">
 <Code2 className="h-4 w-4 text-emerald-400" />
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

 <button
 onClick={() => setShowConsole(!showConsole)}
 className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors ${showConsole ?'bg-gray-200 text-emerald-400 border border-gray-300' :'text-gray-600 hover:text-gray-800'}`}
 >
 <Terminal className="h-3.5 w-3.5" />
 <span className="hidden sm:inline">Console</span>
 </button>
 </div>
 
 <div className="flex items-center gap-2">
 {showConsole && output && (
 <button
 onClick={clearOutput}
 className="flex items-center gap-1 px-2.5 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors"
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
 ?'bg-emerald-600/50 text-emerald-200 cursor-not-allowed' 
 :'bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95'
 }`}
 >
 {isLoading ? (
 <Loader2 className="h-3.5 w-3.5 animate-spin" />
 ) : (
 <Play className="h-3.5 w-3.5 fill-current" />
 )}
 <span>{isLoading ?'Running...' :'Run Code'}</span>
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
 options={{
 minimap: { enabled: false },
 fontSize: 13.5,
 wordWrap:'on',
 scrollBeyondLastLine: false,
 automaticLayout: true,
 fontFamily:"'JetBrains Mono','Fira Code', monospace",
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
 className="text-gray-600 hover:text-gray-800 text-xs px-1.5 py-0.5 rounded hover:bg-gray-500"
 >
 ✕
 </button>
 </div>
 <div className="flex-grow p-3 overflow-y-auto font-mono text-xs">
 {output ? (
 <pre className={`whitespace-pre-wrap break-words leading-relaxed ${isError ?'text-red-600' :'text-black'}`}>
 {output}
 </pre>
 ) : (
 <div className="text-gray-700 italic font-bold">Code output will appear here after clicking'Run Code'...</div>
 )}
 </div>
 </div>
 )}
 </div>
 </div>
 );
}

