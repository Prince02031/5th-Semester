# Understanding Process and Scheduler Components

## Table of Contents
1. [Process Class Overview](#process-class-overview)
2. [How Process Works](#how-process-works)
3. [Scheduler Base Class](#scheduler-base-class)
4. [FCFS Scheduler](#fcfs-scheduler)
5. [SJF Scheduler](#sjf-scheduler)
6. [Preemptive SJF (SRTF)](#preemptive-sjf-srtf)
7. [Priority Scheduler](#priority-scheduler)
8. [Round Robin Scheduler](#round-robin-scheduler)
9. [Key Concepts Summary](#key-concepts-summary)

---

## Process Class Overview

The `Process` class represents a single process in the CPU scheduling simulation. Think of it as a program that needs to run on the CPU.

### Process Attributes

```cpp
int id;                              // Unique identifier (P1, P2, etc.)
int arrivalTime;                     // When the process arrives (AT)
int priority;                        // Process priority (lower number = higher priority)
vector<Instruction> instructions;    // List of instructions to execute
size_t programCounter;               // Current position in instruction list
ProcessState state;                  // Current state of the process
```

### Process States

A process can be in one of five states:

1. **CREATED** - Process is created but hasn't arrived yet
2. **READY** - Process is waiting in the ready queue for CPU
3. **RUNNING** - Process is currently executing on CPU
4. **BLOCKED** - Process is waiting for I/O (not used in this simulation)
5. **TERMINATED** - Process has finished all instructions

---

## How Process Works

### 1. Creation
```cpp
Process(int id, int arrivalTime, int priority, vector<Instruction>& instructions)
```
- When created, a process starts in the **CREATED** state
- Program counter starts at 0
- Has a list of instructions to execute (burst time = number of instructions)

### 2. Instruction Execution
- **hasNextInstruction()** - Checks if there are more instructions to execute
  - Returns `true` if `programCounter < total instructions`
  
- **advanceMock()** - Simulates executing one instruction
  - Increments the program counter by 1
  - Called by the CPU every tick (1 instruction per tick)

### 3. Tracking Progress
- **getProgramCounter()** - Returns current position in instruction list
- **getTotalInstructions()** - Returns total number of instructions
- **Remaining Instructions** = Total - Program Counter

### Example:
If a process has 5 instructions (Burst Time = 5):
- At start: PC = 0, Remaining = 5
- After 1 tick: PC = 1, Remaining = 4
- After 2 ticks: PC = 2, Remaining = 3
- ...
- After 5 ticks: PC = 5, Remaining = 0 → TERMINATED

---

## Scheduler Base Class

The `Scheduler` is an abstract base class that defines the interface for all scheduling algorithms:

```cpp
class Scheduler {
    virtual void addProcess(Process* process) = 0;   // Add process to ready queue
    virtual Process* nextProcess() = 0;               // Decide which process runs next
};
```

### How It's Used:
1. **Emulator calls `addProcess()`** when a process arrives (AT reached)
2. **Emulator calls `nextProcess()`** every tick to decide which process runs
3. **CPU executes** the returned process for one tick

---

## FCFS Scheduler

**First Come First Serve** - Processes execute in the order they arrive (non-preemptive).

### Data Structure:
```cpp
queue<Process*> readyQueue;  // FIFO queue
```

### How It Works:

#### addProcess():
```
1. Set process state to READY
2. Push process to back of queue
```

#### nextProcess():
```
1. Remove any terminated processes from front
2. If queue is empty → return nullptr (CPU idle)
3. Return process at front of queue
4. If that process is finished → pop it and try next one
```

### Key Behavior:
- **Non-preemptive**: Once a process starts, it runs until completion
- **Simple FIFO**: First In, First Out
- **No switching**: Process at front stays until it's done

### Example Flow:
```
Queue: [P1, P2, P3]
Tick 0-4: P1 runs (5 instructions)
Tick 5: P1 done, removed → Queue: [P2, P3]
Tick 5-8: P2 runs (4 instructions)
...
```

---

## SJF Scheduler

**Shortest Job First** - Non-preemptive scheduler that picks the process with the shortest burst time.

### Data Structure:
```cpp
vector<Process*> readyList;           // List of all ready processes
Process* currentProcess;              // Currently running process
```

### How It Works:

#### addProcess():
```
1. Set process state to READY
2. Add process to readyList
```

#### nextProcess():
```
1. Clean up terminated processes from list
2. If currentProcess is still running and not finished:
   → Continue with it (non-preemptive)
3. Otherwise, search through readyList:
   - Find process with smallest remaining instructions
   - Only consider READY processes
4. Set that process as currentProcess and return it
```

### Key Behavior:
- **Non-preemptive**: Once started, process runs to completion
- **Shortest first**: When choosing, picks the one with least work remaining
- **Continues current**: Doesn't switch until current process is done

### Example:
```
At tick 5:
Ready: [P2(4 instr), P3(2 instr), P5(3 instr)]
P1 just finished
→ Select P3 (shortest with 2 instructions)
P3 runs till completion, then select P5, then P2, then P4
```

---

## Preemptive SJF (SRTF)

**Shortest Remaining Time First** - Preemptive version that can switch to a shorter job anytime.

### Data Structure:
```cpp
vector<Process*> readyList;           // List of all processes
```

### How It Works:

#### addProcess():
```
1. Set process state to READY
2. Add process to readyList
```

#### nextProcess():
```
1. Clean up terminated processes
2. Search through ALL processes (READY or RUNNING):
   - Calculate remaining instructions for each
   - Find the one with minimum remaining time
3. Return that process (might be different from current!)
```

### Key Behavior:
- **Preemptive**: Can switch processes every tick
- **Always shortest**: At every moment, runs the process with least remaining work
- **No current tracking**: Recalculates best choice every tick

### Example:
```
Tick 0: P1(5) arrives → P1 runs
Tick 1: P2(4) arrives → P1(4 rem) vs P2(4 rem) → Continue P1
Tick 2: P3(2) arrives → P1(3 rem) vs P2(4) vs P3(2) → SWITCH to P3!
Tick 4: P3 done → P1(3) vs P2(4) → SWITCH back to P1
```

---

## Priority Scheduler

**Priority-based** - Preemptive scheduler where lower priority number = higher priority.

### Data Structure:
```cpp
vector<Process*> readyList;
Process* currentProcess;
```

### How It Works:

#### addProcess():
```
1. Set process state to READY
2. Add to readyList
```

#### nextProcess():
```
1. Clean up terminated processes
2. Search through all READY or RUNNING processes:
   - Find process with lowest priority number (highest priority)
3. If found, set as currentProcess and return
4. If not found, continue with old currentProcess if still valid
```

### Key Behavior:
- **Preemptive**: High-priority process can interrupt low-priority one
- **Priority-based**: Always runs the highest priority (lowest number) available
- **Handles ties**: First found wins in case of same priority

### Example:
```
Processes: P1(priority=2), P2(priority=1), P3(priority=3), P4(priority=2)

Tick 0: P1 arrives → P1 runs
Tick 1: P2 arrives → P2 has priority 1 (higher) → SWITCH to P2
Tick 5: P2 done → P1(2) vs P3(3) → P1 runs
Tick 8: P4 arrives → P4(2) vs P1(2) → Continue P1 (already running)
```

---

## Round Robin Scheduler

**Time-sharing** - Each process gets a fixed time quantum (2 ticks), then rotates.

### Data Structure:
```cpp
queue<Process*> readyQueue;
Process* currentProcess;
int quanta = 2;                       // Time slice
int currentQuantumUsed = 0;           // How many ticks used by current process
```

### How It Works:

#### addProcess():
```
1. Set process state to READY
2. Push to back of queue
```

#### nextProcess():
```
1. Remove terminated processes from front

2. If no currentProcess or it's finished:
   - Reset quantum counter to 0
   - Pop next process from queue
   - Return it

3. If currentQuantumUsed >= quanta (time slice expired):
   - If currentProcess still has work:
     → Set to READY and push to back of queue
   - Reset quantum counter
   - Pop next process from queue
   - Return it

4. Otherwise (quantum not expired):
   - Increment currentQuantumUsed
   - Continue with currentProcess
```

### Key Behavior:
- **Time-sharing**: Each process gets exactly 2 ticks
- **Fair rotation**: After 2 ticks, goes to back of queue
- **Preemptive**: Forces switch after time quantum expires
- **Circular**: Process cycles through queue until done

### Example:
```
Queue: [P1(5), P2(4), P3(2)]

Tick 0-1: P1 runs (quantum used: 0→1→2)
Tick 2: Quantum expired → P1 to back, P2 starts
        Queue: [P3, P1(3 remaining)]
Tick 2-3: P2 runs
Tick 4: Quantum expired → P2 to back, P3 starts
        Queue: [P1(3), P2(2)]
Tick 4-5: P3 runs
Tick 6: P3 done → P1 starts
        Queue: [P2(2)]
Tick 6-7: P1 runs
Tick 8: Quantum expired → P1 to back, P2 starts
        Queue: [P1(1)]
...
```

---

## Key Concepts Summary

### 1. **Preemptive vs Non-Preemptive**

**Non-Preemptive** (FCFS, SJF):
- Once a process starts, it runs until completion
- Uses `currentProcess` to track and continue with same process
- Only switches when current process finishes

**Preemptive** (SRTF, Priority, RR):
- Can switch processes at any time
- Rechecks conditions every tick
- May interrupt currently running process

### 2. **Data Structures**

**Queue** (FIFO):
- Used by FCFS and RR
- Maintains order: first in, first out
- Easy to implement round-robin

**Vector/List**:
- Used by SJF, SRTF, Priority
- Allows searching for "best" process
- Requires iteration to find optimal choice

### 3. **Selection Criteria**

| Scheduler | Criteria |
|-----------|----------|
| FCFS | First to arrive |
| SJF | Shortest total burst time |
| SRTF | Shortest remaining time |
| Priority | Lowest priority number |
| RR | Next in queue (FIFO with time limit) |

### 4. **Process Flow**

```
CREATED → (arrives) → READY → (scheduled) → RUNNING → (completes) → TERMINATED
           ↑                                    ↓
           └─────────── (preempted) ────────────┘
```

### 5. **Scheduler's Job Every Tick**

```
1. Check if any new processes arrived → addProcess()
2. Decide which process should run → nextProcess()
3. CPU executes that process for 1 tick
4. Update process state and program counter
5. Repeat
```

### 6. **Helper Function**

```cpp
remainingInstructions(Process* p) {
    return p->getTotalInstructions() - p->getProgramCounter();
}
```
This calculates how many instructions are left for a process - used by SJF and SRTF schedulers.

---

## Visualization Example

Let's trace P1 through FCFS:

```
P1: 5 instructions, arrives at tick 0

Tick 0:
- Emulator: P1 arrived, call addProcess(P1)
- FCFS: P1 state = READY, push to queue
- Emulator: call nextProcess()
- FCFS: return P1 (front of queue)
- CPU: setProcess(P1), state = RUNNING
- CPU: execute() → P1.advanceMock() → PC = 0→1
- P1: PC=1, remaining=4

Tick 1:
- Emulator: call nextProcess()
- FCFS: return P1 (still at front, not finished)
- CPU: execute() → P1.advanceMock() → PC = 1→2
- P1: PC=2, remaining=3

... (ticks 2, 3, 4)

Tick 4:
- CPU: execute() → P1.advanceMock() → PC = 4→5
- P1: PC=5, remaining=0, hasNextInstruction()=false
- CPU: Set P1 state to TERMINATED

Tick 5:
- Emulator: call nextProcess()
- FCFS: P1 is terminated, pop it, return next process
```

---

## Important Notes

1. **Burst Time = Number of Instructions**: In this simulation, if a process has burst time of 5, it has 5 instructions.

2. **1 Instruction per Tick**: The CPU executes exactly 1 instruction per clock tick.

3. **State Management**: 
   - Scheduler sets processes to READY when added
   - CPU sets process to RUNNING when it starts executing
   - CPU sets process to TERMINATED when it finishes

4. **Null Returns**: When `nextProcess()` returns `nullptr`, the CPU is idle for that tick.

5. **Cleaning Up**: Schedulers regularly remove TERMINATED processes from their data structures to avoid memory issues.

---

This completes the explanation of how Process and Scheduler components work in the CPU scheduling simulation!
