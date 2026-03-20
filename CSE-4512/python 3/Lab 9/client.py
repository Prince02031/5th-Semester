import sys
import socket
import threading

def receive_msgs(sock):
    while True:
        try:
            data=sock.recv(1024)
            if not data:
                break
            print(data.decode('utf-8'))
        except:
            break

server_ip=sys.argv[1]
server_port=int(sys.argv[2])

client=socket.socket(socket.AF_INET,socket.SOCK_STREAM)

try:
    client.connect((server_ip,server_port))

    threading.Thread(target=receive_msgs,args=(client,),daemon=True).start()

    while True:
        msg=input()
        client.sendall(msg.encode('utf-8'))
except KeyboardInterrupt:
    pass

client.close()