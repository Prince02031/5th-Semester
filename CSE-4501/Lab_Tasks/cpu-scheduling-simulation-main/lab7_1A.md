\# CSE4502 (Operating Systems Lab): 1A



\## Jibon Naher^1 and Samnun Azfar^2



(^1) Assistant Professor, CSE

(^2) Junior Lecturer, CSE



\## January 27, 2026



\## Part A: Process Scheduling Test Case and CPU Time Slice Analysis



\*\*Objective:\*\* Demonstrate how different CPU scheduling algorithms allocate CPU time slices to pro-

cesses.



\## Setup



Clone the following git repository:



```

https://github.com/azfarus/cpu-scheduling-simulation.git

```

```

Git Link for Scheduling Simulation.

```

\## Instructions



\- Navigate to thesrc/andinclude/directories.

\- You must fill up the boilerplate codes in the \*\*Scheduler.hpp\*\* and \*\*Scheduler.cpp\*\* files to imple-

&nbsp;   ment the scheduling logic for the required algorithms.

\- Paycloseattention to \*\*process.hpp\*\* and \*\*process.cpp\*\*. These filescontaintheProcessclass/struct

&nbsp;   definition, which includes vital attributes such as Arrival Time (AT), Burst Time (BT), program

&nbsp;   counter, total instructions and Priority. These values are essential for calculating the execution

&nbsp;   order and priorities in your implementation.



\## Test Case (5 Processes)



Process Arrival Time Burst Time Priority

P1 0 5 2

P2 1 4 1

P3 2 2 3

P4 3 6 2

P5 4 3 4



```

Note: Lower priority number means higher priority.

```



\## 1. FCFS Scheduling Output



\*\*Execution Order and Time Slices:\*\*



=== Gantt Chart ===

+----------+--------+------+------------+------+

| P1 | P2 | P3 | P4 | P5 |

+----------+--------+------+------------+------+

0 5 9 11 17 20

===================



\## 2. SJF (Non-Preemptive) Scheduling Output



\*\*Execution Order and Time Slices:\*\*



=== Gantt Chart ===

+----------+------+------+--------+------------+

| P1 | P3 | P5 | P2 | P4 |

+----------+------+------+--------+------------+

0 5 7 10 14 20

===================



\## 3. Priority Scheduling (Preemptive)



\*\*Execution Order and Time Slices:\*\*



=== Gantt Chart ===

+----------+--------+------------+------+------+

| P1 | P2 | P4 | P3 | P5 |

+----------+--------+------------+------+------+

0 5 9 15 17 20

===================



\## 4. Pre-emptive SJF Scheduling (Shortest Remaining Time First)



\*\*Execution Order and Time Slices:\*\*



=== Gantt Chart ===

+------+------+------+------+--------+------------+

| P1 | P3 | P1 | P5 | P2 | P4 |

+------+------+------+------+--------+------------+

0 2 4 7 10 14 20

===================



\## 5. Round Robin



\*\*Execution Order and Time Slices:\*\*



=== Gantt Chart ===

+------+------+------+------+------+------+------+------+------+------+------+

| P1 | P2 | P3 | P1 | P4 | P5 | P2 | P1 | P4 | P5 | P4 |

+------+------+------+------+------+------+------+------+------+------+------+

0 2 4 6 8 10 12 14 15 17 18 20

===================





\## Part B: Advanced FCFS Scheduling (with CPU Utilization and Idle Time)



\*\*Description:\*\* This enhanced version of FCFS scheduling includes additional performance metrics

like CPU idle time, CPU utilization, and throughput. It handles cases where processes arrive late,

causing idle periods in the CPU.

\*\*Logic:\*\*



1\. Input number of processes and their AT and BT.

2\. Sort processes by AT.

3\. For each process:

&nbsp;   - \*\*Start Time (ST)\*\* =max(AT, previous CT)

&nbsp;   - \*\*Completion Time (CT)\*\* = ST + BT

&nbsp;   - \*\*Turnaround Time (TAT)\*\* = CT - AT

&nbsp;   - \*\*Waiting Time (WT)\*\* = TAT - BT

4\. Calculate:

&nbsp;   - \*\*Total Idle Time\*\* = sum of all CPU gaps

&nbsp;   - \*\*CPU Utilization (%)\*\* =(T otalT imeT otalT ime−IdleT ime)× 100

&nbsp;   - \*\*Throughput\*\* =No. of P rocessesT otalT ime



\## Example Calculation (FCFS)



Process | AT | BT | CT | TAT | WT

--------------------------------

P1 | 0 | 5 | 5 | 5 | 0

P2 | 1 | 4 | 9 | 8 | 4

P3 | 2 | 2 | 11 | 9 | 7

P4 | 3 | 6 | 17 | 14 | 8

P5 | 4 | 3 | 20 | 16 | 13



```

Average Waiting Time:

0 + 4 + 7 + 8 + 13

5

```

\### = 6. 4



```

Average Turnaround Time:

```

```

5 + 8 + 9 + 14 + 16

5

```

\### = 10. 4



\## CPU Utilization and Throughput



\*\*Total Execution Time\*\* = 20

\*\*Idle Time\*\* = 0

\*\*CPU Utilization:\*\*

20 − 0

20



\### ×100 = 100%



```

Throughput:

5

20

```

```

= 0. 25 processes per unit time

```





