import React, { useState, useRef } from 'react';
import { MessageSquare, Send, CornerDownRight, X } from 'lucide-react';
import './App.css';

// Data awal (Mock Data)
const initialComments = [
  {
    id: 1,
    user: "Muhammad Rafi Putra Suryawan",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafi",
    text: "tes",
    timestamp: "Baru saja",
    replies: [],
    x: null, // Komentar ini tidak punya posisi di gambar (komentar umum)
    y: null
  }
];

// Komponen Item Komentar (Sidebar)
const CommentItem = ({ comment, onReply }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleSendReply = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText("");
      setShowReplyInput(false);
    }
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <img src={comment.avatar} alt="avatar" className="avatar" />
        <div className="user-info">
          <span className="username">{comment.user}</span>
          <span className="timestamp">{comment.timestamp}</span>
        </div>
      </div>
      
      <div className="comment-body">
        <p>{comment.text}</p>
      </div>

      <div className="comment-actions">
        <button onClick={() => setShowReplyInput(!showReplyInput)} className="reply-btn">
          Balas ...
        </button>
      </div>

      {showReplyInput && (
        <div className="reply-input-container">
          <input 
            type="text" 
            placeholder="Tulis balasan..." 
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
            autoFocus
          />
          <button onClick={handleSendReply}><CornerDownRight size={16}/></button>
        </div>
      )}

      {comment.replies.length > 0 && (
        <div className="replies-list">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};

function App() {
  const [comments, setComments] = useState(initialComments);
  const [mainComment, setMainComment] = useState("");
  
  // State untuk menangani klik pada gambar
  const [tempPoint, setTempPoint] = useState(null); // { x: 100, y: 200 }
  const [tempText, setTempText] = useState("");
  const inputRef = useRef(null);

  // --- Logic Balasan (Nested) ---
  const addReplyNode = (nodes, parentId, newReply) => {
    return nodes.map(node => {
      if (node.id === parentId) {
        return { ...node, replies: [...node.replies, newReply] };
      } else if (node.replies.length > 0) {
        return { ...node, replies: addReplyNode(node.replies, parentId, newReply) };
      }
      return node;
    });
  };

  const handleAddReply = (parentId, text) => {
    const newReply = {
      id: Date.now(),
      user: "User Tamu",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
      text: text,
      timestamp: "Baru saja",
      replies: []
    };
    setComments(prev => addReplyNode(prev, parentId, newReply));
  };

  // --- Logic Komentar Gambar ---
  const handleImageClick = (e) => {
    // Mencegah klik jika user mengklik input box itu sendiri
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;

    // Mendapatkan posisi relatif terhadap container gambar
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTempPoint({ x, y });
    setTempText("");
    
    // Focus otomatis ke input (setelah render)
    setTimeout(() => {
        if(inputRef.current) inputRef.current.focus();
    }, 10);
  };

  const submitPointComment = () => {
    if (!tempText.trim()) {
        setTempPoint(null); // Batalkan jika kosong
        return;
    }

    const newComment = {
      id: Date.now(),
      user: "User Tamu",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
      text: tempText,
      timestamp: "Baru saja",
      replies: [],
      x: tempPoint.x, // Simpan koordinat
      y: tempPoint.y
    };

    setComments([...comments, newComment]);
    setTempPoint(null); // Tutup input popup
    setTempText("");
  };

  // --- Logic Komentar Sidebar Biasa ---
  const handleMainCommentSubmit = () => {
    if (!mainComment.trim()) return;
    const newComment = {
      id: Date.now(),
      user: "User Tamu",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
      text: mainComment,
      timestamp: "Baru saja",
      replies: [],
      x: null, 
      y: null
    };
    setComments([...comments, newComment]);
    setMainComment("");
  };

  return (
    <div className="app-container">
      {/* Area Kiri: Gambar Utama */}
      <div className="content-area">
        {/* Tambahkan onClick handler disini */}
        <div className="image-card" onClick={handleImageClick}>
            <h3>iMy design</h3>
            
            <div className="image-wrapper-relative">
                <img 
                src="https://i.pinimg.com/474x/ea/e7/ff/eae7ffec6cec27630569cee7980754f2.jpg" // Pastikan ada gambar di folder public/meme.png atau ganti URL
                alt="Meme Content" 
                className="main-image"
                />

                {/* 1. Render Marker untuk komentar yang SUDAH ada */}
                {comments.map((c) => (
                    c.x !== null && c.y !== null && (
                        <div 
                            key={c.id}
                            className="annotation-marker existing"
                            style={{ left: c.x, top: c.y }}
                            title={c.text}
                        >
                            <img src={c.avatar} alt="u" />
                        </div>
                    )
                ))}

                {/* 2. Render Input Box Sementara (Popup) */}
                {tempPoint && (
                    <div 
                        className="floating-input-wrapper"
                        style={{ left: tempPoint.x, top: tempPoint.y }}
                        onClick={(e) => e.stopPropagation()} // Supaya tidak memicu click gambar lagi
                    >
                        <div className="floating-input-header">
                            <span>Komentar di sini</span>
                            <button onClick={() => setTempPoint(null)} className="close-btn"><X size={14}/></button>
                        </div>
                        <input 
                            ref={inputRef}
                            type="text"
                            placeholder="Ketik sesuatu..."
                            value={tempText}
                            onChange={(e) => setTempText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && submitPointComment()}
                        />
                        <button className="floating-send-btn" onClick={submitPointComment}>
                            <Send size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Area Kanan: Sidebar Komentar */}
      <div className="sidebar">
        <div className="sidebar-header">
            <h3>Komentar ({comments.length})</h3>
        </div>
        
        <div className="comments-scroll">
          {comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} onReply={handleAddReply} />
          ))}
        </div>

        <div className="main-input-area">
            <div className="input-wrapper">
                <input 
                    type="text" 
                    placeholder="Balas umum ..." 
                    value={mainComment}
                    onChange={(e) => setMainComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleMainCommentSubmit()}
                />
                <button onClick={handleMainCommentSubmit} className="send-btn">
                    <Send size={18}/>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;