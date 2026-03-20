# CSE4502 (Operating Systems Lab): 1A

## Jibon Naher^1 and Samnun Azfar^2

(^1) Assistant Professor, CSE
(^2) Junior Lecturer,CSE

## February 26, 2026

## Instruction

- Use the PC from the lab
- Total time is 40 minutes
- Submit your phone at the front
- Turn off the internet connection

## 1 Task: Preepmtive SJF Scheduling Algorithm

## 1.1 Given Code (Do NOT modify this part)

```
The following structure and main function are provided. Your implementation must inte-
grate seamlessly with this boilerplate. 
12 ##includeinclude <<iostreamvector> >
34 ##includeinclude <<algorithmiomanip> >
```
(^56) using namespace std;
(^78) struct Process {
109 int id;int at; // Arrival Time
1112 int bt; // Burst Timeint ct; // Completion Time
1314 int tat; // Turnaround Timeint wt; // Waiting Time
(^1516) }; int remaining; // Remaining Time for preemption
(^1718) // --- Your Implementation Goes Here ---
1920 void preemptiveSJF(vector<Process >& processes) {// Implement the SRTF logic here
2122 }
2324 int main() {vector<Process> processes = {
2526 {1, 0, 6, 0, 0, 0, 6},{2, 2, 4, 0, 0, 0, 4},
2728 {3, 4, 2, 0, 0, 0, 2},{4, 6, 5, 0, 0, 0, 5}
2930 };

### 1


3132 preemptiveSJF(processes);return 0;

(^33) } 

## 1.2 Implementation Hints

```
To successfully implement thepreemptiveSJFfunction, follow this time-unit simulation
approach:
```
- **Initialize Time:** Start a system clock (e.g.,currentTime = 0) and track completed
    processes.
- **At each time unit (increment by 1):**
    1.Findallprocessesthathavearrived(at <= currentTime)andarenotyetfinished
       (remaining > 0).
    2.From these available processes, select the one with the **shortest remaining**
       **time (rt)**.
    3. **Tie-breaking:** If multiple processes have the samert, pick the one with the
       earliest arrival time (at).
    4.Executetheselectedprocessfor **1timeunit** (decrementitsremainingtimeand
       incrementcurrentTime).
    5. **Completion Check:** If a process’srtbecomes 0:
       **-** Mark it as completed.
       **-** Record itsCT(current time).
       **-** CalculateTAT=CT−ATandWT=TAT−BT.
    6. **Idle Handling:** If no process has arrived yet, increment the clock until the next
       arrival.

## 1.3 Your Task

```
Complete thepreemptiveSJFfunction to fulfill the following requirements:
1.Simulate SRTF using the logic described above.
2.Print a table showing the ID, AT, BT, CT, TAT, and WT for every process.
3.Compute and display the Average Turnaround Time and Average Waiting Time.
```
### 2


