#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>

#define N 5 // Number of Processes
#define M 3 // Number of Resource Types

typedef struct {
    int allocation[N][M];
    int max[N][M];
    int available[M];
    int need[N][M];
} SystemState;

int count = 0;

int *isSafe(SystemState *state) {
    // 1. Calculate need matrix (need[i][j] = max[i][j] - allocation[i][j])
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < M; j++) {
            state->need[i][j] = state->max[i][j] - state->allocation[i][j];
        }
    }

    // 2. Initialize 'finish[N]' boolean array to all false
    bool finish[N];
    for (int i = 0; i < N; i++) {
        finish[i] = false;
    }

    // 3. Initialize 'work[M]' array with 'available' values
    int work[M];
    for (int j = 0; j < M; j++) {
        work[j] = state->available[j];
    }

    // Allocate safe sequence array
    int *safeSeq = (int *)malloc(N * sizeof(int));
    count = 0;

    // 4. While there are processes to finish:
    bool found = true;
    while (found) {
        found = false;
        
        // a. Find an index 'i' such that finish[i] == false AND need[i] <= work
        for (int i = 0; i < N; i++) {
            if (!finish[i]) {
                // Check if need[i] <= work
                bool canAllocate = true;
                for (int j = 0; j < M; j++) {
                    if (state->need[i][j] > work[j]) {
                        canAllocate = false;
                        break;
                    }
                }

                // b. If found, add allocation[i] to work, set finish[i] = true, and record 'i' in safeSeq
                if (canAllocate) {
                    for (int j = 0; j < M; j++) {
                        work[j] += state->allocation[i][j];
                    }
                    finish[i] = true;
                    safeSeq[count++] = i;
                    found = true;
                    break; // Start searching from beginning again
                }
            }
        }
    }

    // 5. return safeSeq
    return safeSeq;
}

int main() {
    SystemState state = {
        .allocation = {{0, 1, 0}, {2, 0, 0}, {3, 0, 2}, {2, 1, 1}, {0, 0, 2}},
        .max = {{7, 5, 3}, {3, 2, 2}, {9, 0, 2}, {2, 2, 2}, {4, 3, 3}},
        .available = {3, 3, 2}  // Example 1: Safe State Scenario
    };

    int *safeSeq = isSafe(&state);

    if (count == N) {
        printf("System is SAFE.\nSequence: ");
        for (int i = 0; i < N; i++) printf("P%d ", safeSeq[i]);
        printf("\n");
    } else {
        printf("System is UNSAFE.\nSequence: ");
        for (int i = 0; i < count; i++) printf("P%d ", safeSeq[i]);
        printf("\n");
    }

    free(safeSeq);
    return 0;
}