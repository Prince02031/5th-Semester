#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

sem_t sem_nav;
sem_t sem_launch;

void* fuel_thread(void* arg) {
    sleep(1);
    printf("[Fuel Thread] Fuel system activated. Signal sent.\n");
    sem_post(&sem_nav);
    return NULL;
}

void* navigation_thread(void* arg) {
    printf("[Navigation Thread] Waiting for fuel system...\n");
    sem_wait(&sem_nav);
    sleep(1);
    printf("[Navigation Thread] Navigation system online. Signal sent.\n");
    sem_post(&sem_launch);
    return NULL;
}

void* launch_thread(void* arg) {
    printf("[Launch Thread] Waiting for navigation system...\n");
    sem_wait(&sem_launch);
    sleep(1);
    printf("[Launch Thread] Launch sequence initiated!\n");
    return NULL;
}

int main() {
    pthread_t fuel, nav, launch;

    sem_init(&sem_nav, 0, 0);
    sem_init(&sem_launch, 0, 0);

    pthread_create(&launch, NULL, launch_thread, NULL);
    pthread_create(&nav, NULL, navigation_thread, NULL);
    pthread_create(&fuel, NULL, fuel_thread, NULL);

    pthread_join(fuel, NULL);
    pthread_join(nav, NULL);
    pthread_join(launch, NULL);

    sem_destroy(&sem_nav);
    sem_destroy(&sem_launch);

    return 0;
}
