"use client";
import { useState, useEffect } from "react";

export default function CommentsSection({ isAdmin = false }: { isAdmin?: boolean }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetch("/api/comments").then(res => res.json()).then(setComments);
  }, []);

  const postComment = async () => {
    if (!newComment.trim()) return;
    const res = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ text: newComment }),
    });
    const saved = await res.json();
    setComments([saved, ...comments]);
    setNewComment("");
  };

  const deleteComment = async (id: string) => {
    await fetch("/api/comments", { method: "DELETE", body: JSON.stringify({ id }) });
    setComments(comments.filter(c => c.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 p-8 bg-gray-900 border-4 border-green-600 rounded-xl shadow-2xl relative z-20">
      <h2 className="text-2xl font-bold text-green-400 mb-6 font-mono tracking-widest uppercase">Community Chance Cards</h2>
      <div className="flex gap-2 mb-8">
        <input 
          type="text" 
          value={newComment} 
          onChange={e => setNewComment(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && postComment()}
          placeholder="Draw a card... leave a message!"
          className="flex-1 p-4 rounded bg-gray-800 text-white border-2 border-gray-700 focus:border-green-400 focus:outline-none"
        />
        <button onClick={postComment} className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-widest rounded transition-colors">
          Post
        </button>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {comments.map(c => (
          <div key={c.id} className="p-4 bg-gray-800 rounded border border-gray-700 flex justify-between items-start group">
            <p className="text-gray-200">{c.text}</p>
            {isAdmin && (
              <button onClick={() => deleteComment(c.id)} className="text-red-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity ml-4 shrink-0">
                Delete
              </button>
            )}
          </div>
        ))}
        {comments.length === 0 && <p className="text-gray-500 italic text-center py-8">No messages yet. Be the first!</p>}
      </div>
    </div>
  );
}