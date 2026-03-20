## CSE 4512

# Student ID:

# Lab 09 Task: Building ChatIUT

You are tasked to build a simple multi-user chat application called ChatIUT.

Task Requirements

1. tcp_chat_server.py
    - Bind to 0.0.0.0 on port 6006 (or a CLI-configured port).
    - Accept multiple TCP client connections and maintain a list of active clients.
    - For each incoming message from a client, forward it (broadcast) to all other con-
       nected clients.
    - Handle client disconnects and remove the client from the list to avoid broken pipes.
    - Use threading.Thread(..., daemon=True) to serve each client concurrently.
    - Log server events (startup, connect, disconnect, forwarded messages) to server.log.
2. tcp_chat_client.py
    - Accept server IP and port as command-line arguments: python3 tcp_chat_client.py
       <server_ip> <port>.
    - Connect to the server and spawn two threads:
       - Read from stdin and send messages to the server.
       - Receive messages from the server and display them to the user.
    - Allow a client to cleanly exit (/quit or Ctrl+C).
3. Optional (bonus) features
    - Support ‘/nick <name>‘ so clients can set display names.
    - Implement a UDP-based presence announcer (simple periodic broadcast).
    - Allow private messages using a ‘/msg <client-id> <text>‘ command.
4. Deliverables
    (a) Sourcefiles: tcp_chat_server.py, tcp_chat_client.py, (optional udp_discover.py),
       and README.md.
(b) server.log capturing a short session.
(c) Short report and a couple of screenshots or terminal logs demonstrating multi-client
chat.

# Lab 09 Grading Criteria

1. Functionality (30 pts)
    - Server accepts multiple clients and broadcasts correctly: 10 pts
    - Client sends and receives messages correctly: 10 pts

```
Islamic University of Technology (IUT)
```

## CSE 4512

- Graceful disconnect handling: 10 pts
2. Robustness & Logging (10 pts)
- Informative logging present and correct: 5 pts
- Error handling, retries/timeouts where applicable: 5 pts
3. Documentation & Testing (10 pts)
- README, run instructions, logs/screenshots: 5 pts
- Demonstration during lab or recorded evidence: 5 pts
4. Bonus features (30 pts)
5. Total: 50 pts

EndofLab

```
Islamic University of Technology (IUT)
```

