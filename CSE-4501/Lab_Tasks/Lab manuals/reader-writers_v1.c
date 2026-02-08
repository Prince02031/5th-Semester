#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

sem_t rw_mutex;
sem_t mutex;

int read_count= 0;
int data= 0;

void* writer(void* arg) {
    int f = *(int*)arg;
    while(1){
        sem_wait(&rw_mutex);
        data++;
        printf("Writer %d modified data to %d\n",f,data);
        sleep(2);
        sem_post(&rw_mutex);
        sleep(1);
    }
}

