import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import os from 'os';

export const execCode = (req, res) => {
  const { language, code } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  // Create a unique temporary directory for this execution to avoid conflicts
  const tempDir = path.join(os.tmpdir(), `code-exec-${crypto.randomBytes(8).toString('hex')}`);
  fs.mkdirSync(tempDir, { recursive: true });

  let filename = '';
  let command = '';

  if (language === 'javascript') {
    filename = 'index.js';
    command = `node ${filename}`;
  } else if (language === 'python') {
    filename = 'main.py';
    // Use 'python' or 'python3' depending on system, windows is usually 'python'
    command = `python ${filename}`;
  } else if (language === 'cpp') {
    filename = 'main.cpp';
    const exeName = process.platform === 'win32' ? 'main.exe' : './main';
    command = `g++ ${filename} -o ${exeName} && ${exeName}`;
  } else if (language === 'java') {
    filename = 'Main.java';
    command = `javac ${filename} && java Main`;
  } else {
    fs.rmSync(tempDir, { recursive: true, force: true });
    return res.status(400).json({ error: 'Unsupported language' });
  }

  const filePath = path.join(tempDir, filename);
  fs.writeFileSync(filePath, code);

  // Execute the command in the temp directory
  exec(command, { cwd: tempDir, timeout: 5000 }, (error, stdout, stderr) => {
    // Cleanup temporary files
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {
      console.error('Failed to clean up temp dir', e);
    }

    if (error) {
      if (error.killed) {
        return res.json({ stderr: 'Execution timed out (5 second limit).' });
      }
      return res.json({ stderr: stderr || error.message });
    }

    res.json({ stdout, stderr });
  });
};
