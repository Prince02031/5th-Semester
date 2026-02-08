#include <stdio.h>
#include <stdbool.h>

#define N 5 //processes
#define M 3 //resources

bool isSafe(int alloc[N][M], int avail[M], int safeSeq[N])