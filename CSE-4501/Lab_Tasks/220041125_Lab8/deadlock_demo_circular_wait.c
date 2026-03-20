#include <pthread.h>
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

#define THREAD_COUNT 5

pthread_mutex_t locks[THREAD_COUNT];

void* worker(void* arg) {
    int idx = *(int *)arg;
    int next_idx = (idx+1)%THREAD_COUNT;
    free(arg);

    // ONE IF STATEMENT SOLUTION: Break circular wait with lock ordering
    if (idx == THREAD_COUNT - 1) {
        // Last thread locks in reverse order to avoid circular wait
        printf("Thread %d: Locking %d (reverse order)\n", idx, next_idx);
        pthread_mutex_lock(&locks[next_idx]);
        sleep(1);
        
        printf("Thread %d: Trying to lock %d\n", idx, idx);
        pthread_mutex_lock(&locks[idx]);
        
        printf("Thread %d: Successfully acquired both locks!\n", idx);
        
        pthread_mutex_unlock(&locks[idx]);
        pthread_mutex_unlock(&locks[next_idx]);
    } else {
        // Normal order for other threads
        printf("Thread %d: Locking %d\n", idx, idx);
        pthread_mutex_lock(&locks[idx]);
        sleep(1);

        printf("Thread %d: Trying to lock %d\n", idx, next_idx);
        pthread_mutex_lock(&locks[next_idx]);
        
        printf("Thread %d: Successfully acquired both locks!\n", idx);

        pthread_mutex_unlock(&locks[idx]);
        pthread_mutex_unlock(&locks[next_idx]);
    }
    
    return NULL;
}

int main() {
    pthread_t threads[THREAD_COUNT];

    for (int i = 0 ; i < THREAD_COUNT; i++){
        pthread_mutex_init(&locks[i],NULL);
    }

    for (int i = 0 ; i < THREAD_COUNT; i++){
        int * idx = (int*)malloc(sizeof(int));
        *idx=i;
        pthread_create(&threads[i],NULL,worker,idx);
    }

    for (int i = 0 ; i < THREAD_COUNT; i++){
        pthread_join(threads[i],NULL);
    }

    printf("\nAll threads completed successfully - No deadlock!\n");

    for (int i = 0 ; i < THREAD_COUNT; i++){
        pthread_mutex_destroy(&locks[i]);
    }

    return 0;
}
