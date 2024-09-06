import React, { useState, useEffect } from 'react';
import './Whiteboard.css';

const Whiteboard = () => {
  const [drawing, setDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [tool, setTool] = useState('freehand');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:3000');
    setSocket(socket);

    socket.on('draw', (data) => {
      setLines((prevLines) => [...prevLines, data]);
    });

    socket.on('clear', () => {
      setLines([]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleMouseDown = (e) => {
    setDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    setLines([...lines, { x: offsetX, y: offsetY, tool }]);
    socket.emit('draw', { x: offsetX, y: offsetY, tool });
  };

  const handleMouseMove = (e) => {
    if (drawing) {
      const { offsetX, offsetY } = e.nativeEvent;
      setLines([...lines, { x: offsetX, y: offsetY, tool }]);
      socket.emit('draw', { x: offsetX, y: offsetY, tool });
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  const handleClear = () => {
    setLines([]);
    socket.emit('clear');
  };

  const handleSave = () => {
    const canvas = document.getElementById('canvas');
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="whiteboard">
      <canvas
        id="canvas"
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <div className="toolbar">
        <button onClick={() => setTool('freehand')}>Freehand Pen</button>
        <button onClick={() => setTool('line')}>Line Tool</button>
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default Whiteboard;