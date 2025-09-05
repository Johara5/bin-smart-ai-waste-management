import { useState } from 'react';

const DebugPage = () => {
  const [clickCount, setClickCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `${timestamp}: ${message}`;
    console.log(logEntry);
    setLogs(prev => [...prev, logEntry]);
  };

  const handleSafeClick = () => {
    addLog('Safe button clicked');
    setClickCount(prev => prev + 1);
  };

  const handleDangerousClick = () => {
    addLog('Dangerous button clicked - testing if this causes disappearing');
    // Simulate what might be causing the issue
    try {
      // Test if it's a state update issue
      setClickCount(prev => prev + 1);
      addLog('State update successful');
      
      // Test if it's a console.log issue
      console.log('Console log test');
      addLog('Console log successful');
      
    } catch (error) {
      addLog(`Error caught: ${error}`);
    }
  };

  const handleAsyncClick = async () => {
    addLog('Async button clicked');
    try {
      // Test if it's an async operation issue
      await new Promise(resolve => setTimeout(resolve, 100));
      addLog('Async operation completed');
      setClickCount(prev => prev + 1);
    } catch (error) {
      addLog(`Async error: ${error}`);
    }
  };

  addLog('DebugPage rendered');

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'monospace',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1>DEBUG PAGE - Testing Disappearing Issue</h1>
      <p>This page should help identify what causes the disappearing.</p>
      <p>Click count: {clickCount}</p>
      
      <div style={{ margin: '20px 0' }}>
        <button 
          onClick={handleSafeClick}
          style={{
            padding: '10px 20px',
            margin: '10px',
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Safe Button (Should Not Disappear)
        </button>

        <button 
          onClick={handleDangerousClick}
          style={{
            padding: '10px 20px',
            margin: '10px',
            backgroundColor: 'orange',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Test Button (Check Console)
        </button>

        <button 
          onClick={handleAsyncClick}
          style={{
            padding: '10px 20px',
            margin: '10px',
            backgroundColor: 'blue',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Async Button (Test Async)
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '10px',
        border: '1px solid #ccc',
        maxHeight: '300px',
        overflowY: 'auto',
        fontSize: '12px'
      }}>
        <h3>Logs:</h3>
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px' }}>
        <h3>Instructions:</h3>
        <ol>
          <li>Open browser console (F12)</li>
          <li>Click each button and observe behavior</li>
          <li>Note which button (if any) causes the page to disappear</li>
          <li>Check console for any error messages</li>
        </ol>
      </div>
    </div>
  );
};

export default DebugPage;
