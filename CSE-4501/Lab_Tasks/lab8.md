\# CSE4502 (Operating Systems Lab): 1A



\## Jibon Naher^1 and Samnun Azfar^2



(^1) Assistant Professor, CSE

(^2) Junior Lecturer, CSE



\## February 3, 2026



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

4

5 pthread\_mutex\_t lock1 = PTHREAD\_MUTEX\_INITIALIZER;

6 pthread\_mutex\_t lock2 = PTHREAD\_MUTEX\_INITIALIZER;

7

8 void\* thread1\_routine(void\* arg) {

9 printf("Thread 1: Trying to lock Mutex 1...\\n");

10 pthread\_mutex\_lock(\&lock1);

11 printf("Thread 1: Locked Mutex 1. Sleeping...\\n");

12 sleep(1);

13





14 printf("Thread 1: Trying to lock Mutex 2...\\n");

15 pthread\_mutex\_lock(\&lock2);

16 printf("Thread 1: Locked Mutex 2.\\n");

17

18 pthread\_mutex\_unlock(\&lock2);

19 pthread\_mutex\_unlock(\&lock1);

20 return NULL;

21 }

22

23 void\* thread2\_routine(void\* arg) {

24 printf("Thread 2: Trying to lock Mutex 2...\\n");

25 pthread\_mutex\_lock(\&lock2);

26 printf("Thread 2: Locked Mutex 2. Sleeping...\\n");

27 sleep(1);

28

29 printf("Thread 2: Trying to lock Mutex 1...\\n");

30 pthread\_mutex\_lock(\&lock1);

31 printf("Thread 2: Locked Mutex 1.\\n");

32

33 pthread\_mutex\_unlock(\&lock1);

34 pthread\_mutex\_unlock(\&lock2);

35 return NULL;

36 }

37

38 int main() {

39 pthread\_t t1, t2;

40 pthread\_create(\&t1, NULL, thread1\_routine , NULL);

41 pthread\_create(\&t2, NULL, thread2\_routine , NULL);

42 pthread\_join(t1, NULL);

43 pthread\_join(t2, NULL);

44 return 0;

45 }



\### Instructions for Task 1



\- Compile the code:gcc deadlock\_demo.c -o deadlock -pthread

\- Run the program:./deadlock, and check what happens

\- Modify the code so that deadlock can be avoided by attacking the Hold and Wait condition.





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



\### Helper Code: Banker’s Safety Algorithm



\#### bankers\_safety.c



1 #include <stdio.h>

2 #include <stdbool.h>

3

4 #define N 5 // Processes

5 #define M 3 // Resources

6

7 bool isSafe(int alloc\[N]\[M], int max\[N]\[M], int avail\[M], int safeSeq\[N]) {

8 // 1. Initialize 'need\[N]\[M]' matrix (Max - Allocation)

9 // 2. Initialize 'finish\[N]' boolean array to all false

10 // 3. Initialize 'work\[M]' array with 'avail' values

11 // 4. While there are processes to finish:

12 // a. Find an index 'i' such that finish\[i] == false AND need\[i] <=

work

13 // b. If no such 'i' exists, return false (System is Unsafe)

14 // c. If found, add alloc\[i] to work, set finish\[i] = true, and

record 'i' in safeSeq

15 // 5. If all processes are finished, return true (System is Safe)

16

17 /\* STUDENT IMPLEMENTATION HERE \*/

18 return false;

19 }

20

21 int main() {

22 int alloc\[N]\[M] = { {0, 1, 0}, {2, 0, 0}, {3, 0, 2}, {2, 1, 1}, {0, 0,

2} };

23 int max\[N]\[M] = { {7, 5, 3}, {3, 2, 2}, {9, 0, 2}, {2, 2, 2}, {4, 3, 3}

};

24 int avail\[M] = {3, 3, 2};

25 int safeSeq\[N];

26

27 if (isSafe(alloc, max, avail, safeSeq)) {





28 printf("System is in SAFE state.\\nSafe Sequence: ");

29 for (int i = 0; i < N; i++) printf("P%d%s", safeSeq\[i], (i == N-1?

"\\n" : " -> "));

30 } else {

31 printf("System is in UNSAFE state (Deadlock potential).\\n");

32 }

33

34 return 0;

35 }



\### Instructions for Task 2



\- Fill the implemenation for theisSafe()function based on the provided instructions.







