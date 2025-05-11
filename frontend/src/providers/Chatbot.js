import React, { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { v4 as uuid } from 'uuid';

// Use your Vapi *public* API key here (not private secret)
const ASSISTANT_ID = process.env.REACT_APP_VAPI_ASSISTANT_ID;
const API_KEY = process.env.REACT_APP_VAPI_API_KEY;

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const vapiRef = useRef(null);
  const endRef = useRef(null);

  // Log config and validate env
  useEffect(() => {
    console.log('CONFIG:', { API_KEY, ASSISTANT_ID });
    if (!API_KEY || !ASSISTANT_ID) {
      setError('Missing REACT_APP_VAPI_API_KEY or REACT_APP_VAPI_ASSISTANT_ID in .env');
    }
  }, []);

  // Request mic
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => console.log('Microphone permission granted'))
      .catch(err => {
        console.error('Microphone permission denied', err);
        setError('Microphone access is needed.');
      });
  }, []);

  // Init SDK and start call
  useEffect(() => {
    setMessages([{ id: uuid(), role: 'bot', content: 'Initializing assistant...' }]);
    (async () => {
      if (!API_KEY || !ASSISTANT_ID) return;
      try {
        const vapi = new Vapi(API_KEY);
        vapiRef.current = vapi;
        vapi.on('call-start', () => { console.log('call-start'); setIsConnected(true); setError(null); });
        vapi.on('call-end', () => { console.log('call-end'); setIsConnected(false); });
        vapi.on('error', err => { console.error('error', err); setError(err.message||'error'); });
        vapi.on('message', msg => { console.log('message', msg); setMessages(m => [...m, { id: uuid(), role: 'bot', content: msg.text||msg.content||'<no>' }]); });
        vapi.on('transcript', ({ text, isFinal }) => { console.log('transcript', text, isFinal); if (isFinal) setMessages(m => [...m, { id: uuid(), role: 'user', content: text }]); });
        vapi.on('speech-start', () => { console.log('speech-start'); setIsSpeaking(true); });
        vapi.on('speech-end', () => { console.log('speech-end'); setIsSpeaking(false); });

        console.log('Calling vapi.start...');
        const call = await vapi.start(ASSISTANT_ID);
        console.log('vapi.start returned', call);
        if (!call) setError('Invalid call object; check CORS & credentials');
      } catch (e) {
        console.error('SDK init error', e);
        setError('SDK init failed: ' + e.message);
      }
    })();
    return () => { vapiRef.current?.stop?.(); };
  }, []);

  // Scroll
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Test API via full endpoint
    // Test direct API connectivity via REST API
  const testApi = async () => {
    try {
      // Use POST /call endpoint with type 'web'
      const res = await fetch('https://api.vapi.ai/call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({ assistant: { id: ASSISTANT_ID }, type: 'web' })
      });
      const data = await res.json();
      console.log('API test /call response:', data);
      setMessages(m => [...m, { id: uuid(), role: 'bot', content: 'API Test (/call): ' + JSON.stringify(data) }]);
    } catch (e) {
      console.error('API test error', e);
      setError('API test failed: ' + e.message);
    }
  };

  // Send user text
  const handleSend = async () => {
    const text = input.trim(); if (!text) return;
    setMessages(m => [...m, { id: uuid(), role:'user', content:text }]);
    setInput('');
    if (vapiRef.current && isConnected) {
      console.log('vapi.send', text);
      try {
        await vapiRef.current.send({ type:'add-message', message:{ role:'user', content:text } });
      } catch (e) { console.error('send error', e); setError('send failed: '+e.message); }
    } else setError('Not connected');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h3 style={styles.headerText}>Vapi Chatbot</h3>
        <span style={isConnected?styles.connectedBadge:styles.disconnectedBadge}>
          {isConnected?'Connected':'Disconnected'}
        </span>
      </header>
      <section style={styles.chatWindow}>
        {messages.map(m=>(<div key={m.id} style={{...styles.bubble,alignSelf:m.role==='user'?'flex-end':'flex-start',background:m.role==='user'?'#2e3b4e':'#444'}}>
          <strong>{m.role==='user'?'You':'Bot'}:</strong> {m.content}
        </div>))}
        {isSpeaking&&<div style={styles.speakingIndicator}>🎤 Speaking…</div>}
        {error&&<div style={styles.errorContainer}><div style={styles.errorMessage}>⚠️ {error}</div></div>}
        <div ref={endRef}/>
      </section>
      <footer style={styles.controls}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSend()} placeholder='Type a message…' disabled={!isConnected} style={styles.input}/>
        <button onClick={handleSend} disabled={!input.trim()||!isConnected} style={{...styles.button,opacity:(!input.trim()||!isConnected)?0.6:1}}>Send</button>
        <button onClick={testApi} style={{...styles.button,marginLeft:8}}>Test API</button>
      </footer>
    </div>
  );
}
const styles={container:{width:400,border:'1px solid #555',borderRadius:8,background:'#1e1e1e',color:'#eee',display:'flex',flexDirection:'column',height:520,boxShadow:'0 4px 12px rgba(0,0,0,0.5)'},header:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px',borderBottom:'1px solid #333'},headerText:{margin:0,fontSize:16},connectedBadge:{background:'#39a03a',color:'#fff',padding:'2px 6px',borderRadius:4,fontSize:12},disconnectedBadge:{background:'#a0393a',color:'#fff',padding:'2px 6px',borderRadius:4,fontSize:12},chatWindow:{flex:1,overflowY:'auto',padding:12,display:'flex',flexDirection:'column'},bubble:{maxWidth:'80%',padding:'8px 12px',borderRadius:6,margin:'4px 0',boxShadow:'0 1px 2px rgba(0,0,0,0.3)'},speakingIndicator:{fontStyle:'italic',color:'#6cf',margin:'8px 0',alignSelf:'center'},errorContainer:{background:'rgba(160,57,57,0.2)',padding:8,borderRadius:6,margin:'8px 0'},errorMessage:{color:'#f88'},controls:{display:'flex',gap:8,padding:12,borderTop:'1px solid #333'},input:{flex:1,padding:8,borderRadius:4,border:'1px solid #444',background:'#2a2a2a',color:'#eee'},button:{padding:'6px 12px',border:'none',borderRadius:4,cursor:'pointer',background:'#1976d2',color:'#fff'}};
