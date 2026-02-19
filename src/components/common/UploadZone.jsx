import { useState, useRef } from 'react';

export default function UploadZone({ label, accept, onFiles }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles?.(files);
  };

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) onFiles?.(files);
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${dragging ? 'border-primary bg-highlight' : 'border-border hover:border-primary/50 hover:bg-bg'}`}
    >
      <div className="text-3xl mb-2">📁</div>
      <div className="text-table text-text-sec">{label || 'Drag & drop files here or click to browse'}</div>
      <input ref={inputRef} type="file" accept={accept} multiple onChange={handleChange} className="hidden" />
    </div>
  );
}
