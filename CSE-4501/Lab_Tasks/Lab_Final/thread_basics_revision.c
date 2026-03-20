#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

// --- Basic thread ---
void* say_hello(void* arg) {
    int id = *(int*)arg;
    printf("Hello from thread %d\n", id);
    return NULL;
}

// --- Race condition (no lock) ---
int counter = 0;

void* increment(void* arg) {
    for (int i = 0; i < 100000; i++)
        counter++;  // unsafe: read-add-write can be interrupted
    return NULL;
}

// --- Mutex fix ---
int safe_counter = 0;
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;  // static init

void* increment_safe(void* arg) {
    for (int i = 0; i < 100000; i++) {
        pthread_mutex_lock(&lock);    // only 1 thread past this at a time
        safe_counter++;
        pthread_mutex_unlock(&lock);
    }
    return NULL;
}

// --- Binary semaphore (behaves like mutex) ---
int sem_counter = 0;
sem_t sem;

void* increment_sem(void* arg) {
    for (int i = 0; i < 100000; i++) {
        sem_wait(&sem);   // s-- (blocks if s==0)
        sem_counter++;
        sem_post(&sem);   // s++ (unblocks one waiter)
    }
    return NULL;
}

// --- Producer/Consumer (counting semaphore) ---
// empty: free slots (init=BUFFER_SIZE), producer waits on this
// full:  filled slots (init=0),         consumer waits on this
#define BUFFER_SIZE 5
#define ITEMS 8

int buffer[BUFFER_SIZE];
int buf_in = 0, buf_out = 0;
sem_t empty, full;
pthread_mutex_t buf_lock = PTHREAD_MUTEX_INITIALIZER;

void* producer(void* arg) {
    for (int item = 1; item <= ITEMS; item++) {
        sem_wait(&empty);
        pthread_mutex_lock(&buf_lock);
        buffer[buf_in] = item;
        printf("  produced %d -> slot %d\n", item, buf_in);
        buf_in = (buf_in + 1) % BUFFER_SIZE;
        pthread_mutex_unlock(&buf_lock);
        sem_post(&full);
    }
    return NULL;
}

void* consumer(void* arg) {
    for (int i = 0; i < ITEMS; i++) {
        sem_wait(&full);
        pthread_mutex_lock(&buf_lock);
        int item = buffer[buf_out];
        printf("  consumed %d <- slot %d\n", item, buf_out);
        buf_out = (buf_out + 1) % BUFFER_SIZE;
        pthread_mutex_unlock(&buf_lock);
        sem_post(&empty);
    }
    return NULL;
}

// --- Deadlock ---
// T1 locks m1 then waits for m2
// T2 locks m2 then waits for m1 → circular wait → both stuck forever
pthread_mutex_t m1 = PTHREAD_MUTEX_INITIALIZER;
pthread_mutex_t m2 = PTHREAD_MUTEX_INITIALIZER;

void* thread1_deadlock(void* arg) {
    pthread_mutex_lock(&m1);
    sleep(1);                   // give T2 time to grab m2
    pthread_mutex_lock(&m2);    // blocks forever — T2 holds m2
    pthread_mutex_unlock(&m2);
    pthread_mutex_unlock(&m1);
    return NULL;
}

void* thread2_deadlock(void* arg) {
    pthread_mutex_lock(&m2);
    sleep(1);                   // give T1 time to grab m1
    pthread_mutex_lock(&m1);    // blocks forever — T1 holds m1
    pthread_mutex_unlock(&m1);
    pthread_mutex_unlock(&m2);
    return NULL;
}

// --- Deadlock fix: lock ordering ---
// Both threads acquire locks in the same order (m1 then m2)
// No circular wait can form → no deadlock
void* thread1_safe(void* arg) {
    pthread_mutex_lock(&m1);
    pthread_mutex_lock(&m2);
    printf("  T1 got both locks\n");
    pthread_mutex_unlock(&m2);
    pthread_mutex_unlock(&m1);
    return NULL;
}

void* thread2_safe(void* arg) {
    pthread_mutex_lock(&m1);    // same order as T1
    pthread_mutex_lock(&m2);
    printf("  T2 got both locks\n");
    pthread_mutex_unlock(&m2);
    pthread_mutex_unlock(&m1);
    return NULL;
}

int main() {
    // Basic threads
    pthread_t t1, t2;
    int a = 1, b = 2;
    pthread_create(&t1, NULL, say_hello, &a);
    pthread_create(&t2, NULL, say_hello, &b);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    // Race condition
    pthread_t t3, t4;
    counter = 0;
    pthread_create(&t3, NULL, increment, NULL);
    pthread_create(&t4, NULL, increment, NULL);
    pthread_join(t3, NULL);
    pthread_join(t4, NULL);
    printf("counter      = %d (expected 200000)\n", counter);

    // Mutex
    pthread_t t5, t6;
    safe_counter = 0;
    pthread_create(&t5, NULL, increment_safe, NULL);
    pthread_create(&t6, NULL, increment_safe, NULL);
    pthread_join(t5, NULL);
    pthread_join(t6, NULL);
    printf("safe_counter = %d (expected 200000)\n", safe_counter);

    // Binary semaphore
    sem_init(&sem, 0, 1);  // pshared=0 (threads), init=1 (binary)
    pthread_t t7, t8;
    sem_counter = 0;
    pthread_create(&t7, NULL, increment_sem, NULL);
    pthread_create(&t8, NULL, increment_sem, NULL);
    pthread_join(t7, NULL);
    pthread_join(t8, NULL);
    printf("sem_counter  = %d (expected 200000)\n", sem_counter);
    sem_destroy(&sem);

    // Producer/Consumer
    sem_init(&empty, 0, BUFFER_SIZE);  // all slots free
    sem_init(&full,  0, 0);            // nothing to consume yet
    pthread_t prod, cons;
    pthread_create(&prod, NULL, producer, NULL);
    pthread_create(&cons, NULL, consumer, NULL);
    pthread_join(prod, NULL);
    pthread_join(cons, NULL);
    sem_destroy(&empty);
    sem_destroy(&full);

    // Deadlock fix (lock ordering)
    // NOTE: the deadlock version is left out — it hangs forever.
    // To see it, swap thread1_safe/thread2_safe with thread1_deadlock/thread2_deadlock.
    pthread_t td1, td2;
    pthread_create(&td1, NULL, thread1_safe, NULL);
    pthread_create(&td2, NULL, thread2_safe, NULL);
    pthread_join(td1, NULL);
    pthread_join(td2, NULL);

    return 0;
}

// Compile: gcc thread_basics_revision.c -o thread_basics -pthread
// Run:     ./thread_basics
