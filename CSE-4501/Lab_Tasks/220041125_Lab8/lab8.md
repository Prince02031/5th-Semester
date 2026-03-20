\# CSE4502 Operating Systems Lab 8 (Deadlocks): 1B



\## Jibon Naher^1 and Samnun Azfar^2



(^1) Assistant Professor, CSE

(^2) Junior Lecturer, CSE



\## February 5, 2026



\## Introduction



\#### A Deadlock is a situation where a set of processes are blocked because each process is holding



\#### a resource and waiting for another resource held by some other process. This lab explores how



\#### deadlocksoccurinamulti-threadedenvironmentandhowtheycanbeavoidedusingmathematical



\#### models like the Banker’s Algorithm.



\## The Four Necessary Conditions



\#### For a deadlock to occur, the following four conditions must hold simultaneously:



\#### 1. Mutual Exclusion: At least one resource must be held in a non-sharable mode; only one



\#### process can use the resource at any given time.



\#### 2. Hold and Wait: A process must be holding at least one resource and waiting to acquire ad-



\#### ditional resources that are currently being held by other processes.



\#### 3. No Preemption: Resources cannot be preempted; they can only be released voluntarily by



\#### the process holding them.



\#### 4. Circular Wait: A closed chain of processes exists such that each process holds at least one



\#### resource needed by the next process in the chain.



\## Task 1: Simulating a Deadlock in C



\#### Objective: Write a C program using POSIX threads (pthreads) and mutexes to create a circular



\#### wait condition.



\#### deadlock\_demo.c



1 #include <pthread.h>

2 #include <stdio.h>

3 #include <unistd.h>

4 #include <stdlib.h>

5

6 #define THREAD\_COUNT 5

7

8 pthread\_mutex\_t locks\[THREAD\_COUNT];

9

10

11

12 void\* worker(void\* arg) {

13





14 int idx = \*(int \*)arg;

15 int next\_idx = (idx+1)%THREAD\_COUNT;

16 free(arg);

17

18 printf("Thread %d: Locking %d\\n",idx,idx);

19 pthread\_mutex\_lock(\&locks\[idx]);

20 sleep(1);

21

22 printf("Thread %d: Trying to lock %d\\n",idx,next\_idx);

23 pthread\_mutex\_lock(\&locks\[next\_idx]);

24

25 /\* Never reached \*/

26 pthread\_mutex\_unlock(\&locks\[idx]);

27 pthread\_mutex\_unlock(\&locks\[next\_idx]);

28 return NULL;

29 }

30

31

32 int main() {

33 pthread\_t threads\[THREAD\_COUNT];

34

35 for (int i = 0 ; i < THREAD\_COUNT; i++){

36 pthread\_mutex\_init(\&locks\[i],NULL);

37 }

38

39 for (int i = 0 ; i < THREAD\_COUNT; i++){

40 int \* idx = (int\*)malloc(sizeof(int));

41 \*idx=i;

42 pthread\_create(\&threads\[i],NULL,worker,idx);

43 }

44

45

46 for (int i = 0 ; i < THREAD\_COUNT; i++){

47 pthread\_join(threads\[i],NULL);

48 }

49

50 return 0;

51 }



\### Instructions for Task 1



\- Compile the code:gcc deadlock\_demo.c -o deadlock -pthread

\- Run the program:./deadlock, and check what happens

\- Modify the code so that deadlock can be avoided.

\- Write only one if statement to solve the deadlock.





\## Task 2: Deadlock Avoidance (Banker’s Algorithm)



\#### Objective: ImplementtheSafetyAlgorithmpartoftheBanker’sAlgorithmtodetermineifasystem



\#### is in a safe state.



\### Example 1: Safe State Scenario



\#### Given 5 processes (P 0 throughP 4 ) and 3 resource types (A, B, C) with total instances (10, 5, 7).



\#### Allocation Max Demand Available



\#### Process A B C A B C A B C



\#### P 0 0 1 0 7 5 3 3 3 2



\#### P 1 2 0 0 3 2 2



\#### P 2 3 0 2 9 0 2



\#### P 3 2 1 1 2 2 2



\#### P 4 0 0 2 4 3 3



\### Example 2: Unsafe State Scenario



\#### Modify the available resources in your code to Available = (0, 2, 0).



\### Example 3: Partial Completion Scenario



\#### Modify the available resources in your code to Available = (2, 1, 1).



\### Helper Code: Banker’s Safety Algorithm



\#### bankers\_safety.c



1 #include <stdio.h>

2 #include <stdbool.h>

3

4 #define N 5 // Numberof Processes

5 #define M 3 // Numberof ResourceTypes

6

7 typedef struct {

8 int allocation\[N]\[M];

9 int max\[N]\[M];

10 int available\[M];

11 int need\[N]\[M];

12 } SystemState;

13

14 int count= 0;

15

16 int \*isSafe(SystemState \*state) {

17 // 2. Initialize 'finish\[N]' boolean array to all false

18 // 3. Initialize 'work\[M]' array with 'avail' values

19 // 4. While there are processes to finish:

20 // a. Find an index 'i' such that finish\[i] == false AND need\[i] <=

work

21 // b. If found, add alloc\[i] to work, set finish\[i] = true, and

record 'i' in safeSeq

22 // c. if no process found to finish,break from the loop

23 // 5. return safeSeq

24

25





26 int \*safeSeq = new int\[N];

27

28 /\* STUDENT IMPLEMENTATION HERE \*/

29 }

30

31 int main() {

32 SystemState state = {

33 .allocation = {{0, 1, 0}, {2, 0, 0}, {3, 0, 2}, {2, 1, 1}, {0, 0,

2}},

34 .max = {{7, 5, 3}, {3, 2, 2}, {9, 0, 2}, {2, 2, 2}, {4, 3, 3}},

35 .available = {2, 1, 1}

36 };

37

38 //int safeSeq\[N];

39 int \*safeSeq = isSafe(\&state);

40 // for(int i = 0; i < count; i++) printf("P%d ", safeSeq\[i]);

41

42 if (count == N){

43 printf("System is SAFE.\\nSequence: ");

44 for (int i = 0; i < N; i++) printf("P%d ", safeSeq\[i]);

45 printf("\\n");

46 } else {

47 printf("System is UNSAFE.\\nSequence: ");

48 for (int i = 0; i < count; i++) printf("P%d ", safeSeq\[i]);

49 printf("\\n");

50 }

51 return 0;

52 }



\### Instructions for Task 2



\- Fill the implemenation for theisSafe()function based on the provided instructions.







