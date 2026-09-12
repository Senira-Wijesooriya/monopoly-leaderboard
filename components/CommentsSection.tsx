"use client";
import { useState, useEffect } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";

// Replace these with your actual Firebase config from console.firebase.google.com
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

// Initialize Firebase safely for Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function CommentsSection({ isAdmin = false }: { isAdmin?: boolean }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/comments").then(res => res.json()).then(setComments);
    
    // Listen for Google Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Sign-In Error (Did you put your API keys in code?):", error);
      alert("Firebase Config Missing: Update apiKey in CommentsSection.tsx to use real Google Auth!");
    }
  };

  const postComment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user) return alert("You must sign in with Google to comment!");
    if (!newComment.trim()) return;
    
    const res = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ text: `${user.displayName}: ${newComment}` }), 
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
    <div className="max-w-4xl mx-auto mt-20 p-8 bg-white border-4 border-black rounded-xl shadow-[12px_12px_0px_rgba(0,0,0,1)] relative z-20">
      <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
        <h2 className="text-3xl font-black text-black tracking-tighter uppercase">Community Chest</h2>
        
        {user ? (
          <div className="flex items-center gap-3">
            <img src={user.photoURL} alt="profile" className="w-10 h-10 rounded-full border-2 border-black" />
            <button onClick={() => signOut(auth)} className="text-sm font-bold text-red-600 hover:underline">Sign Out</button>
          </div>
        ) : (
          <button onClick={handleGoogleLogin} className="px-4 py-2 bg-blue-600 text-white font-bold border-2 border-black rounded shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all">
            Sign In with Google
          </button>
        )}
      </div>
      
      <form onSubmit={postComment} className="flex gap-2 mb-8">
        <input 
          type="text" 
          value={newComment} 
          onChange={e => setNewComment(e.target.value)}
          placeholder={user ? "Draw a card... leave a message!" : "Sign in to post a message..."}
          disabled={!user}
          className="flex-1 p-4 rounded bg-gray-100 text-black border-2 border-black font-bold focus:outline-none focus:bg-white"
        />
        <button type="submit" disabled={!user} className="px-8 py-4 bg-green-500 disabled:bg-gray-400 text-black border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] font-black uppercase tracking-widest rounded transition-all hover:translate-y-1 hover:shadow-none">
          Post
        </button>
      </form>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {comments.map(c => {
          const splitIndex = c.text.indexOf(': ');
          const author = splitIndex > -1 ? c.text.substring(0, splitIndex) : "Anonymous";
          const message = splitIndex > -1 ? c.text.substring(splitIndex + 2) : c.text;

          return (
            <div key={c.id} className="p-4 bg-yellow-100 rounded border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex justify-between items-start group">
              <div>
                <span className="font-black text-black mr-2 uppercase">{author}</span>
                <span className="text-gray-800 font-bold">{message}</span>
              </div>
              {isAdmin && (
                <button onClick={() => deleteComment(c.id)} className="bg-red-500 text-white px-3 py-1 rounded border-2 border-black font-bold opacity-0 group-hover:opacity-100 transition-opacity ml-4 shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
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