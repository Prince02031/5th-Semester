#include <pthread.h>
#include <stdio.h>
#include <unistd.h>

pthread_mutex_t lock1 = PTHREAD_MUTEX_INITIALIZER;
pthread_mutex_t lock2 = PTHREAD_MUTEX_INITIALIZER;

void* thread1_routine(void* arg) {
    printf("Thread 1: Trying to lock Mutex 1...\n");
    pthread_mutex_lock(&lock1);
    printf("Thread 1: Locked Mutex 1. Sleeping...\n");
    sleep(1);

    printf("Thread 1: Trying to lock Mutex 2...\n");
    pthread_mutex_lock(&lock2);
    printf("Thread 1: Locked Mutex 2.\n");

    pthread_mutex_unlock(&lock2);
    pthread_mutex_unlock(&lock1);
    return NULL;
}

void* thread2_routine(void* arg) {
    printf("Thread 2: Trying to lock Mutex 2...\n");
    pthread_mutex_lock(&lock2);
    printf("Thread 2: Locked Mutex 2. Sleeping...\n");
    sleep(1);

    printf("Thread 2: Trying to lock Mutex 1...\n");
    pthread_mutex_lock(&lock1);
    printf("Thread 2: Locked Mutex 1.\n");

    pthread_mutex_unlock(&lock1);
    pthread_mutex_unlock(&lock2);
    return NULL;
}

// Hold and Wait Avoidance Version 
void* thread1_routine_hold_wait(void* arg) {
    printf("Thread 1: Acquiring all locks before proceeding...\n");
    pthread_mutex_lock(&lock1);
    pthread_mutex_lock(&lock2);
    printf("Thread 1: Locked both Mutex 1 and 2. Sleeping...\n");
    sleep(1);

    printf("Thread 1: Doing work with both locks...\n");

    pthread_mutex_unlock(&lock2);
    pthread_mutex_unlock(&lock1);
    printf("Thread 1: Released both locks.\n");
    return NULL;
}

void* thread2_routine_hold_wait(void* arg) {
    printf("Thread 2: Acquiring all locks before proceeding...\n");
    pthread_mutex_lock(&lock1);
    pthread_mutex_lock(&lock2);
    printf("Thread 2: Locked both Mutex 1 and 2. Sleeping...\n");
    sleep(1);

    printf("Thread 2: Doing work with both locks...\n");

    pthread_mutex_unlock(&lock2);
    pthread_mutex_unlock(&lock1);
    printf("Thread 2: Released both locks.\n");
    return NULL;
}

int main() {
    pthread_t t1, t2;
    int choice;
    
    printf("Deadlock Avoidance\n");
    printf("1. Deadlock\n");
    printf("2. Hold and Wait Avoidance\n");
    printf("Enter your choice (1 or 2): ");
    scanf("%d", &choice);
    
    if (choice == 1) {
        pthread_create(&t1, NULL, thread1_routine, NULL);
        pthread_create(&t2, NULL, thread2_routine, NULL);
    } else if (choice == 2) {
        pthread_create(&t1, NULL, thread1_routine_hold_wait, NULL);
        pthread_create(&t2, NULL, thread2_routine_hold_wait, NULL);
    } else {
        printf("Invalid choice!\n");
        return 1;
    }
    
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    return 0;
}
