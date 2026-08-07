import React, { useEffect, useState } from 'react';

// CodeMirror dependencies installed: @uiw/react-codemirror @codemirror/lang-javascript

const defaultCode = `// Try solving here
function example() {
  console.log('Hello, peer learning!');
}`;

const CodeEditor = () => {
  const [code, setCode] = useState(defaultCode);
  const [editorLib, setEditorLib] = useState(null);
  const [output, setOutput] = useState([]);
  const iframeRef = React.createRef();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const ReactCodeMirrorModule = await import('@uiw/react-codemirror');
        const langModule = await import('@codemirror/lang-javascript');
        if (!mounted) return;
        setEditorLib({ ReactCodeMirror: ReactCodeMirrorModule.default, javascript: langModule.javascript });
      } catch (err) {
        setEditorLib(null);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('editor.code');
    if (saved) setCode(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('editor.code', code);
  }, [code]);

  useEffect(() => {
    return () => {
      // cleanup any message handlers attached to iframe
      const iframe = iframeRef.current;
      if (iframe && iframe._msgHandler) {
        window.removeEventListener('message', iframe._msgHandler);
        iframe._msgHandler = null;
      }
    };
  }, []);

  const runCode = () => {
    setOutput([]);
    const iframe = iframeRef.current;
    if (!iframe) return;

    // remove previous handler
    if (iframe._msgHandler) {
      window.removeEventListener('message', iframe._msgHandler);
      iframe._msgHandler = null;
    }

    const html = `<!doctype html><html><body><script>
    (function(){
      function send(type,args){ parent.postMessage({type:type,args:args}, '*'); }
      console.log = function(){ send('log', Array.from(arguments)); };
      console.error = function(){ send('error', Array.from(arguments)); };
      console.warn = function(){ send('warn', Array.from(arguments)); };
      window.onerror = function(msg,src,lineno,colno,err){ send('error',[msg+' at '+lineno+':'+colno]); };
      try {
        ${code}
      } catch (e) {
        send('error',[e && e.message ? e.message : String(e)]);
      }
    })();</script></body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const handler = (e) => {
      if (e.source !== iframe.contentWindow) return;
      const data = e.data;
      if (!data) return;
      const text = (data.args || []).map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
      setOutput((prev) => [...prev, `${data.type.toUpperCase()}: ${text}`]);
    };

    iframe._msgHandler = handler;
    window.addEventListener('message', handler);
    iframe.src = url;
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const EditorArea = () => {
    if (editorLib?.ReactCodeMirror) {
      const ReactCodeMirror = editorLib.ReactCodeMirror;
      const javascript = editorLib.javascript;
      return (
        <ReactCodeMirror
          value={code}
          extensions={[javascript()]}
          onChange={(v) => setCode(v)}
          basicSetup={{}}
          height="100%"
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') runCode();
          }}
        />
      );
    }

    return (
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => {(e.ctrlKey || e.metaKey) && e.key === 'Enter' && runCode();}}
        className="flex-1 w-full p-3 font-mono text-sm bg-slate-50 border border-slate-200 rounded resize-none"
      />
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-600">Editor</div>
        <div className="flex items-center gap-2">
          <select className="text-sm border rounded px-2 py-1 bg-white">
            <option>JavaScript</option>
            <option>Python</option>
            <option>Java</option>
          </select>
          <button className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Run</button>
        </div>
      </div>

      <div className="flex-1 w-full">
        <EditorArea />
      </div>

      <div className="mt-3">
        <div className="flex items-center gap-2">
          <button onClick={runCode} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Run (Ctrl+Enter)</button>
          <button onClick={() => { setOutput([]); }} className="px-3 py-1 border rounded text-sm">Clear Output</button>
        </div>

        <div className="mt-2 bg-slate-900 text-slate-100 p-3 rounded text-sm h-32 overflow-auto">
          {output.length === 0 ? <div className="text-slate-400">No output</div> : output.map((o, i) => <div key={i}><pre className="whitespace-pre-wrap">{o}</pre></div>)}
        </div>

        <iframe ref={iframeRef} title="runner" style={{ display: 'none' }} sandbox="allow-scripts"></iframe>
      </div>
    </div>
  );
};

export default CodeEditor;

function runCode() {
  // This function will be replaced by closure during render via binding in component
}
