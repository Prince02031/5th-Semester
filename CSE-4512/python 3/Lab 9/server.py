import socket 
import threading
import logging
logging.basicConfig(
    filename='server.log',
    level=logging.INFO,
    format='%(asctime)s %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

clients= []

clients_lock= threading.Lock()

def handle_client(conn, addr):
    logging.info(f"connect:{addr}")

    with clients_lock:
        clients.append(conn)

    try:
        while True:

            data=conn.recv(1024)
            if not data:
                break
            logging.info(f"forwarded message from {addr} ")

            with clients_lock:
                targets= [c for c in clients if c != conn]

                for c in targets:
                    try:
                        c.sendall(data)
                    except OSError:
                        pass
    except OSError as e:
        logging.error(f"socket error with {addr}: {e}")


    finally:
        with clients_lock:
            if conn in clients:
                clients.remove(conn)
        conn.close()
        logging.info(f"disconnect: {addr}")


server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('0.0.0.0', 6006))
server.listen(5)

logging.info("startup")
print("Server started on port 6006...")

try:
    while True:
        conn, addr = server.accept()
        threading.Thread(target=handle_client, args=(conn, addr), daemon=True).start()
except KeyboardInterrupt:
    server.close()
    logging.info("shutdown")
    print("\nServer shut down.")
    logging.info("server shut off")
    server.close()

