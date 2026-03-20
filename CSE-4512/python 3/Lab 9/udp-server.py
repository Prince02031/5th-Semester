import sys
import socket
import threading
import logging

logging.basicConfig(
    filename='server.log',
    level=logging.INFO,
    format='%(asctime)s %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

clients=[]

def handle_client(conn,addr):
    logging.info(f"connect:{addr}")
    clients.append(conn)

    try:
        while True:
            data=conn.recv(1024)
            if not data:
                break
            logging.info(f"forwarded message from: {addr}")
            for c in clients:
                if c!=conn:
                    c.sendall(data)
    except:
        pass
    if conn in clients:
        clients.remove(conn)
        logging.info(f"disconnect: {addr}")
        conn.close()

server=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.setsockopt(socket.SOL_SOCKET,socket.SO_REUSEADDR,1)
server.bind(('0.0.0.0',6006))
server.listen(5)

logging.info("startup")

try:
    while True:
        conn,addr=server.accept()
        threading.Thread(target=handle_client,args=(conn,addr),daemon=True).start()
except KeyboardInterrupt:
    pass
    server.close()