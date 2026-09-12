"use client";
import { useState, useEffect } from "react";

export default function CommentsSection({ isAdmin = false }: { isAdmin?: boolean }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");

  useEffect(() => {
    fetch("/api/comments").then(res => res.json()).then(setComments);
  }, []);

  const postComment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return alert("Both Name and Message are required!");
    
    const res = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ text: `${authorName}: ${newComment}` }), // Prepend author to text for simple storage
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
    <div className="max-w-4xl mx-auto mt-20 p-8 bg-black/40 backdrop-blur-md border-2 border-green-600 rounded-xl shadow-2xl relative z-20">
      <h2 className="text-2xl font-bold text-green-400 mb-6 font-mono tracking-widest uppercase">Community Chance Cards</h2>
      
      <form onSubmit={postComment} className="flex flex-col md:flex-row gap-2 mb-8">
        <input 
          type="text" 
          value={authorName} 
          onChange={e => setAuthorName(e.target.value)}
          placeholder="Your Name"
          required
          className="w-full md:w-1/4 p-4 rounded bg-gray-900 text-white border border-gray-700 focus:border-green-400 focus:outline-none"
        />
        <input 
          type="text" 
          value={newComment} 
          onChange={e => setNewComment(e.target.value)}
          placeholder="Draw a card... leave a message!"
          required
          className="flex-1 p-4 rounded bg-gray-900 text-white border border-gray-700 focus:border-green-400 focus:outline-none"
        />
        <button type="submit" className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-widest rounded transition-colors">
          Post
        </button>
      </form>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {comments.map(c => {
          // Split author and message if formatted correctly
          const splitIndex = c.text.indexOf(': ');
          const author = splitIndex > -1 ? c.text.substring(0, splitIndex) : "Anonymous";
          const message = splitIndex > -1 ? c.text.substring(splitIndex + 2) : c.text;

          return (
            <div key={c.id} className="p-4 bg-gray-800/80 rounded border border-gray-700 flex justify-between items-start group">
              <div>
                <span className="font-bold text-green-400 mr-2">{author}</span>
                <span className="text-gray-200">{message}</span>
              </div>
              {isAdmin && (
                <button onClick={() => deleteComment(c.id)} className="text-red-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity ml-4 shrink-0 hover:text-red-400">
                  Delete
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
}