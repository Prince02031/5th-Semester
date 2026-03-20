#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

void *say_hello(void* arg)
{
    int id= *(int*) arg;
    printf("hello from thread %d\n",id);
    return NULL;
}

int counter=0;

void* increment(void* arg){
    for(int i=0;i<100000;i++)
        counter++;
    return NULL;
}

int safe_counter=0;
pthread_mutex_t lock= PTHREAD_MUTEX_INITIALIZER;

void* increment_safe(void* arg)
{
    for(int i=0;i<10000;i++)
    {
        pthread_mutex_lock(&lock);
            safe_counter++;
        pthread_mutex_unlock(&lock);
    }
    return NULL;
}

int sem_counter=0;
sem_t sem;

void* increment_sem(void* arg) {
    for(int i=0;i<10000;i++)
    {
        sem_wait(&sem);
            sem_counter++;
        sem_post(&sem);
    }

    return NULL;
}


int main(){
    pthread_t t1, t2;
    int a=1,b=2;

    pthread_create(&t1, NULL, say_hello, &a);
    pthread_create(&t2, NULL, say_hello, &b);

    pthread_join(t1,NULL);
    pthread_join(t2,NULL);

    printf("both threads done");

    pthread_t t3, t4;
    counter=0;

    pthread_create(&t3, NULL, increment_safe, NULL);
    pthread_create(&t4, NULL, increment_safe, NULL);

    pthread_join(t3, NULL);
    pthread_join(t4, NULL);

    printf("\ncounter= %d", safe_counter);

    sem_init(&sem, 0, 1);

    pthread_t t5,t6;
    sem_counter=0;

    pthread_create(&t5, NULL, increment_sem, NULL);
    pthread_create(&t6, NULL, increment_sem, NULL);

    pthread_join(t5, NULL);
    pthread_join(t6, NULL);

    printf("\nsem_counter = %d",sem_counter);
    sem_destroy(&sem);

    return 0;

}

