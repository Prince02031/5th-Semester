#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

#define CLIENTS 6

sem_t server_slots;
pthread_mutex_t mutex;
int serving[CLIENTS] = {0};

void* client(void* arg) {
    int id = *(int*)arg;

    sem_wait(&server_slots);

    pthread_mutex_lock(&mutex);
    serving[id] = 1;
    pthread_mutex_unlock(&mutex);

    sleep(1);

    pthread_mutex_lock(&mutex);
    serving[id] = 0;
    pthread_mutex_unlock(&mutex);

    sem_post(&server_slots);
    return NULL;
}

void* monitor(void* arg) {
    for (int i = 0; i < 4; i++) {
        pthread_mutex_lock(&mutex);
        for (int j = 0; j < CLIENTS; j++)
            printf("C%d=%s ", j + 1, serving[j] ? "True" : "False");
        printf("\n");
        pthread_mutex_unlock(&mutex);

        usleep(500000);
    }
    return NULL;
}

int main() {
    pthread_t clients[CLIENTS], monitor_thread;
    int ids[CLIENTS];

    sem_init(&server_slots, 0, 3);
    pthread_mutex_init(&mutex, NULL);

    pthread_create(&monitor_thread, NULL, monitor, NULL);

    for (int i = 0; i < CLIENTS; i++) {
        ids[i] = i;
        pthread_create(&clients[i], NULL, client, &ids[i]);
    }

    for (int i = 0; i < CLIENTS; i++) pthread_join(clients[i], NULL);
    pthread_join(monitor_thread, NULL);

    sem_destroy(&server_slots);
    pthread_mutex_destroy(&mutex);
    return 0;
}
