"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket-client";
import { Socket } from "socket.io-client";

export default function SocketTestPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const sock = getSocket();
    setSocket(sock);

    const addLog = (msg: string) => {
      setLogs((prev) => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    if (sock) {
      sock.on("connect", () => {
        addLog("✅ Connected!");
        setConnected(true);
      });

      sock.on("disconnect", () => {
        addLog("❌ Disconnected");
        setConnected(false);
      });

      sock.on("connect_error", (err) => {
        addLog(`❌ Error: ${err.message}`);
      });

      sock.on("connect_timeout", () => {
        addLog("⏰ Timeout");
      });

      addLog("Connecting...");
    }

    return () => {
      addLog("Cleanup");
    };
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#050505",
      color: "white",
      padding: "40px",
      fontFamily: "monospace",
    }}>
      <h1 style={{ fontSize: "32px", marginBottom: "24px" }}>🔌 Socket Test</h1>
      
      <div style={{
        padding: "16px",
        borderRadius: "8px",
        backgroundColor: connected ? "rgba(0,255,65,0.1)" : "rgba(255,49,49,0.1)",
        border: `2px solid ${connected ? "#00FF41" : "#FF3131"}`,
        marginBottom: "24px",
      }}>
        <p style={{ fontSize: "20px", margin: 0 }}>
          Status: {connected ? "✅ CONNECTED" : "❌ NOT CONNECTED"}
        </p>
        <p style={{ fontSize: "14px", color: "#888", marginTop: "8px" }}>
          Socket ID: {socket?.id || "N/A"}
        </p>
      </div>

      <div style={{
        padding: "16px",
        borderRadius: "8px",
        backgroundColor: "#111",
        border: "1px solid #333",
      }}>
        <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>Connection Logs:</h2>
        {logs.map((log, i) => (
          <div key={i} style={{ fontSize: "12px", color: "#888" }}>{log}</div>
        ))}
      </div>

      <div style={{ marginTop: "24px" }}>
        <button
          onClick={() => {
            socket?.disconnect();
            setLogs((prev) => [...prev, "[Manual] Disconnected"]);
          }}
          style={{
            padding: "12px 24px",
            marginRight: "12px",
            backgroundColor: "#FF3131",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Disconnect
        </button>
        <button
          onClick={() => {
            socket?.connect();
            setLogs((prev) => [...prev, "[Manual] Reconnecting..."]);
          }}
          style={{
            padding: "12px 24px",
            backgroundColor: "#00FF41",
            color: "black",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Reconnect
        </button>
      </div>

      <div style={{ marginTop: "40px", padding: "20px", backgroundColor: "#111", borderRadius: "8px" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>Troubleshooting:</h2>
        <ol style={{ fontSize: "14px", color: "#888", lineHeight: "1.8" }}>
          <li>Check if server is running on http://localhost:3000</li>
          <li>Open browser console (F12) for detailed logs</li>
          <li>Check terminal for "🔌 Initializing Socket.IO" message</li>
          <li>Try hard refresh (Ctrl+F5)</li>
          <li>Clear browser cache</li>
        </ol>
      </div>
    </div>
  );
}
