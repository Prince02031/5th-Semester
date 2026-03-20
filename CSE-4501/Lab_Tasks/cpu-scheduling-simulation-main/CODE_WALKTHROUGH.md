# Detailed Code Walkthrough

A line-by-line explanation of Process and Scheduler implementation.

---

## Table of Contents
1. [Process.hpp - Header File](#processhpp---header-file)
2. [Process.cpp - Implementation](#processcpp---implementation)
3. [Scheduler.hpp - Header File](#schedulerhpp---header-file)
4. [Scheduler.cpp - Implementation](#schedulercpp---implementation)

---

# Process.hpp - Header File

## 1. Include Guards
```cpp
#ifndef PROCESS_HPP
#define PROCESS_HPP
```
**What it does:** Prevents the header file from being included multiple times in the same compilation unit, which would cause "redefinition" errors.

---

## 2. Instruction Structure
```cpp
struct Instruction {
    int duration; // Duration in ticks 
    
    Instruction(int d = 1) : duration(d) {}
};
```

**Breaking it down:**
- `struct Instruction` - A simple container for instruction data
- `int duration` - How many ticks this instruction takes to execute
- `Instruction(int d = 1)` - Constructor with default parameter
  - `d = 1` means if you create `Instruction()`, duration defaults to 1
  - `: duration(d)` - Member initializer list, sets duration to d

**Why it exists:** In real CPUs, different instructions (ADD, LOAD, etc.) take different amounts of time. Here we simplify: all instructions take 1 tick.

---

## 3. Process State Enum
```cpp
enum class ProcessState {
    CREATED,
    READY,
    RUNNING,
    BLOCKED,
    TERMINATED
};
```

**Breaking it down:**
- `enum class` - Strongly-typed enumeration (can't implicitly convert to int)
- Each value represents a lifecycle state
- `ProcessState::CREATED` is accessed with scope resolution (`::`)

**State meanings:**
- **CREATED** - Process object exists but hasn't "arrived" yet (AT not reached)
- **READY** - In ready queue, waiting for CPU
- **RUNNING** - Currently executing on CPU
- **BLOCKED** - Waiting for I/O (not used in this simulation)
- **TERMINATED** - All instructions completed

---

## 4. Process Class Declaration

### Private Members
```cpp
private:
    int id;
    int arrivalTime;
    int priority;
    std::vector<Instruction> instructions;
    size_t programCounter;
    ProcessState state;
```

**Breaking it down:**
- `int id` - Unique identifier (1, 2, 3... for P1, P2, P3...)
- `int arrivalTime` - Clock tick when process arrives (AT from input)
- `int priority` - Priority value (lower number = higher priority)
- `std::vector<Instruction> instructions` - Dynamic array of all instructions
  - Size of this vector = burst time
- `size_t programCounter` - Index of next instruction to execute (like PC register in real CPU)
  - `size_t` is unsigned integer, perfect for array indices
- `ProcessState state` - Current state from the enum

**Why private:** Encapsulation - only Process methods can directly modify these values.

---

### Constructor
```cpp
Process(int id, int arrivalTime, int priority, const std::vector<Instruction>& instructions);
```

**Breaking it down:**
- Takes 4 parameters to initialize a process
- `const std::vector<Instruction>&` - Pass by const reference
  - `const` - Can't modify the passed vector
  - `&` - Reference (no copy, saves memory)
  - Why? Vectors can be large; copying is expensive

---

### Getter Methods
```cpp
int getId() const;
int getArrivalTime() const;
int getPriority() const;
ProcessState getState() const;
```

**Breaking it down:**
- All marked `const` at the end
  - Means: "This method won't modify the object"
  - Allows calling on const Process objects
- Simply return the private member values

---

### State Management
```cpp
void setState(ProcessState state);
```

**Breaking it down:**
- Only setter provided - allows external control of state
- No `const` because it modifies the object
- Used by Scheduler (READY), CPU (RUNNING), etc.

---

### Instruction Control Methods
```cpp
bool hasNextInstruction() const;
const Instruction& peekInstruction() const;
void advanceMock();
```

**Breaking it down:**

**hasNextInstruction():**
- Returns `bool` - true if more instructions remain
- Used to check if process is finished

**peekInstruction():**
- Returns `const Instruction&` - reference to current instruction (no copy)
- `const` reference means you can read but not modify
- Used to examine instruction without executing it

**advanceMock():**
- Simulates executing current instruction
- Increments program counter
- Called by CPU after execution

---

### Information Methods
```cpp
size_t getProgramCounter() const;
size_t getTotalInstructions() const;
```

**Breaking it down:**
- `size_t` return type matches vector size type
- **getProgramCounter()** - Returns current position (index)
- **getTotalInstructions()** - Returns `instructions.size()`
- Together, these calculate progress: `remaining = total - PC`

---

# Process.cpp - Implementation

## 1. Constructor Implementation
```cpp
Process::Process(int id, int arrivalTime, int priority, const std::vector<Instruction>& instructions)
    : id(id), arrivalTime(arrivalTime), priority(priority), 
      instructions(instructions), programCounter(0), state(ProcessState::CREATED) {}
```

**Breaking it down:**

**Syntax explanation:**
- `Process::Process(...)` - Scope resolution, implementing Process's constructor
- `: id(id), ...` - Member initializer list (runs before constructor body)

**Why initializer list?**
- More efficient than assignment in constructor body
- Required for const members and references
- Initializes members in declaration order

**Parameter shadowing:**
- Constructor parameter `id` shadows member `id`
- `id(id)` means "initialize member id with parameter id"

**Initial values:**
- `programCounter(0)` - Starts at first instruction (index 0)
- `state(ProcessState::CREATED)` - New process not yet arrived

---

## 2. Simple Getters
```cpp
int Process::getId() const {
    return id;
}

int Process::getArrivalTime() const {
    return arrivalTime;
}

int Process::getPriority() const {
    return priority;
}
```

**Breaking it down:**
- `Process::` - Specifies we're implementing Process class methods
- Each just returns the corresponding private member
- `const` qualifier ensures no modifications

**Why separate implementation?**
- Could be inline in header, but separating helps:
  - Reduces recompilation when implementation changes
  - Keeps header file clean and readable

---

## 3. State Management
```cpp
ProcessState Process::getState() const {
    return state;
}

void Process::setState(ProcessState s) {
    state = s;
}
```

**Breaking it down:**

**getState():**
- Returns the enum value directly
- Allows external code to check state

**setState():**
- Parameter named `s` to avoid shadowing member `state`
- Allows Scheduler, CPU to transition process states
- No validation - trusts caller to use correct transitions

---

## 4. Instruction Check
```cpp
bool Process::hasNextInstruction() const {
    return programCounter < instructions.size();
}
```

**Breaking it down:**
- `instructions.size()` - Returns number of instructions (burst time)
- `programCounter < size()` - True if PC is within bounds
- When PC equals size, we've executed all instructions

**Example:**
```
instructions.size() = 5  (indices: 0, 1, 2, 3, 4)
PC = 0 → hasNext = true (0 < 5)
PC = 4 → hasNext = true (4 < 5)
PC = 5 → hasNext = false (5 < 5 is false) ✓ Finished!
```

---

## 5. Peek Instruction
```cpp
const Instruction& Process::peekInstruction() const {
    if (!hasNextInstruction()) {
        throw std::out_of_range("No more instructions in process");
    }
    return instructions[programCounter];
}
```

**Breaking it down:**

**Error checking:**
- `if (!hasNextInstruction())` - Guards against out-of-bounds access
- `throw std::out_of_range(...)` - Throws standard exception if called when done
- Good practice: validate before accessing array

**Return:**
- `instructions[programCounter]` - Accesses vector at current PC index
- Returns reference (no copy)
- `const` reference prevents modification

**When used:** CPU might peek to check instruction duration (though not used in current simulation).

---

## 6. Advance Program Counter
```cpp
void Process::advanceMock() {
    if (hasNextInstruction()) {
        programCounter++;
    }
}
```

**Breaking it down:**

**Safety check:**
- `if (hasNextInstruction())` - Only increment if valid
- Prevents PC from going out of bounds

**Incrementing:**
- `programCounter++` - Move to next instruction
- This "consumes" one instruction

**Called by:** CPU after executing an instruction (1 per tick).

**Example flow:**
```
Initial: PC = 0
advanceMock() → PC = 1
advanceMock() → PC = 2
...
advanceMock() → PC = 5 (now hasNextInstruction() = false)
advanceMock() → PC stays 5 (guard prevents increment)
```

---

## 7. Information Getters
```cpp
size_t Process::getProgramCounter() const {
    return programCounter;
}

size_t Process::getTotalInstructions() const {
    return instructions.size();
}
```

**Breaking it down:**
- Direct returns, no computation
- `size_t` matches vector's size type
- Used by schedulers to calculate remaining work

---

# Scheduler.hpp - Header File

## 1. Base Scheduler Class
```cpp
class Scheduler {
public:
    virtual ~Scheduler() = default;

    virtual void addProcess(Process* process) = 0;
    virtual Process* nextProcess() = 0;
};
```

**Breaking it down:**

**Virtual destructor:**
- `virtual ~Scheduler() = default;`
- `virtual` - Ensures correct destructor called for derived classes
- `= default` - Use compiler-generated destructor
- Critical for proper cleanup when deleting through base pointer

**Pure virtual methods:**
- `= 0` makes methods pure virtual (abstract)
- Base class can't be instantiated
- Derived classes MUST implement these methods

**Method signatures:**
- `void addProcess(Process* process)` - Takes pointer to process
  - Pointer allows null checks and modification
- `Process* nextProcess()` - Returns pointer to next process
  - Returns nullptr when no process ready

---

## 2. FCFS Scheduler Class
```cpp
class FCFSScheduler : public Scheduler {
public:
    void addProcess(Process* process) override;
    Process* nextProcess() override;

private:
    std::queue<Process*> readyQueue;
};
```

**Breaking it down:**

**Inheritance:**
- `: public Scheduler` - FCFSScheduler IS-A Scheduler
- Inherits interface, must implement pure virtual methods

**Override keyword:**
- `override` - Tells compiler "this should override a base method"
- Catches typos (if base method doesn't exist, compile error)
- Good practice for maintainability

**Data structure choice:**
- `std::queue<Process*>` - FIFO queue
- Perfect for FCFS: first in, first out
- Stores pointers (lightweight, no copying processes)

**Why queue?** FCFS needs strict ordering - queue maintains arrival order automatically.

---

## 3. SJF Scheduler Class
```cpp
class SJFScheduler : public Scheduler {
public:
    void addProcess(Process* process) override;
    Process* nextProcess() override;

private:
    std::vector<Process*> readyList;
    Process* currentProcess = nullptr;
};
```

**Breaking it down:**

**Data structure choice:**
- `std::vector<Process*> readyList` - Dynamic array of process pointers
- Why vector? Need to search through all processes to find shortest
- Can't use queue (can't peek at all elements)

**Current process tracking:**
- `Process* currentProcess = nullptr;`
- `= nullptr` - In-class initializer (C++11)
- Tracks currently running process
- Why needed? SJF is non-preemptive - must remember and continue

**nullptr usage:**
- Indicates "no process currently running"
- Can check `if (currentProcess)` to see if valid

---

## 4. Preemptive SJF Scheduler Class
```cpp
class PreemptiveSJFScheduler : public Scheduler {
public:
    void addProcess(Process* process) override;
    Process* nextProcess() override;

private:
    std::vector<Process*> readyList;
};
```

**Breaking it down:**

**No currentProcess:**
- Unlike SJF, doesn't track current
- Why? Preemptive - recalculates best choice every tick
- No need to remember - always searches all processes

**Same vector structure:**
- Needs to search through all ready processes
- Calculates remaining time for each

---

## 5. Priority Scheduler Class
```cpp
class PriorityScheduler : public Scheduler {
public:
    void addProcess(Process* process) override;
    Process* nextProcess() override;

private:
    std::vector<Process*> readyList;
    Process* currentProcess = nullptr;
};
```

**Breaking it down:**

**Similar to SJF:**
- Uses vector to search through processes
- Tracks currentProcess

**Why currentProcess here?**
- Optimization: if no better priority arrives, continue current
- Avoids unnecessary context switches when priority unchanged

---

## 6. Round Robin Scheduler Class
```cpp
class RRScheduler : public Scheduler {
public:
    void addProcess(Process* process) override;
    Process* nextProcess() override;

private:
    int quanta = 2;
    int currentQuantumUsed = 0;
    std::queue<Process*> readyQueue;
    Process* currentProcess = nullptr;
};
```

**Breaking it down:**

**Time quantum tracking:**
- `int quanta = 2;` - Time slice per process (2 ticks)
- `int currentQuantumUsed = 0;` - Tracks ticks used by current process
- In-class initializers for convenience

**Data structures:**
- `std::queue<Process*> readyQueue` - FIFO for fair rotation
- `Process* currentProcess` - Currently running process

**Why both queue and currentProcess?**
- `currentProcess` - The one actually running
- `readyQueue` - Waiting processes
- When quantum expires, current goes to back of queue

---

# Scheduler.cpp - Implementation

## 1. Helper Function
```cpp
static size_t remainingInstructions(Process* p) {
    if (!p) return 0;
    return p->getTotalInstructions() - p->getProgramCounter();
}
```

**Breaking it down:**

**Static function:**
- `static` - File scope only, not visible outside this .cpp file
- Like a private function for the entire file
- Prevents name conflicts with other files

**Null check:**
- `if (!p)` - If pointer is null
- `return 0` - Safe default value
- Prevents dereferencing null pointer (crash)

**Calculation:**
- Total instructions - current position = remaining work
- Example: Total=5, PC=2 → Remaining=3

**Used by:** SJF and Preemptive SJF to find shortest job.

---

## 2. FCFS Implementation

### addProcess
```cpp
void FCFSScheduler::addProcess(Process* process) {
    process->setState(ProcessState::READY);
    readyQueue.push(process);
}
```

**Breaking it down:**

**State transition:**
- `process->setState(ProcessState::READY);`
- Moves process from CREATED to READY
- `->` operator: dereferences pointer and accesses member

**Queue insertion:**
- `readyQueue.push(process);`
- Adds to back of queue
- Maintains FIFO order

**Simple logic:** FCFS just queues everything in arrival order.

---

### nextProcess
```cpp
Process* FCFSScheduler::nextProcess() {
    if (readyQueue.empty()) {
        return nullptr;
    }
```

**Breaking it down:**

**Empty check:**
- `readyQueue.empty()` - Returns true if queue has no elements
- `return nullptr` - No process to run, CPU will idle

---

```cpp
    while (!readyQueue.empty() && readyQueue.front()->getState() == ProcessState::TERMINATED) {
        readyQueue.pop();
    }
```

**Breaking it down:**

**Cleanup loop:**
- `while (!readyQueue.empty() && ...)` - Two conditions with short-circuit evaluation
  - First checks if queue has elements
  - Only checks second if first is true (prevents accessing empty queue)
  
**Terminated check:**
- `readyQueue.front()` - Access element at front (doesn't remove it)
- `->getState()` - Call method through pointer
- `== ProcessState::TERMINATED` - Compare state

**Removal:**
- `readyQueue.pop()` - Remove front element
- Keeps removing until we find non-terminated or queue empty

**Why needed?** Processes might finish but still be in queue; clean them up.

---

```cpp
    if (readyQueue.empty()) {
        return nullptr;
    }

    Process* p = readyQueue.front();
    
    if (!p->hasNextInstruction()) {
        readyQueue.pop();
        return nextProcess();
    }
    
    return p;
}
```

**Breaking it down:**

**Second empty check:**
- After cleanup, queue might be empty
- Return nullptr if so

**Get front process:**
- `Process* p = readyQueue.front();`
- Stores pointer in local variable
- Still in queue (front doesn't remove)

**Finished check:**
- `if (!p->hasNextInstruction())` - Process completed all instructions
- `readyQueue.pop();` - Remove it from queue
- `return nextProcess();` - Recursive call to get next process
  - Elegant: handles chain of finished processes

**Return:**
- `return p;` - Return the valid process to run
- FCFS doesn't pop here - process stays at front until done

---

## 3. SJF Implementation

### addProcess
```cpp
void SJFScheduler::addProcess(Process* process) {
    process->setState(ProcessState::READY);
    readyList.push_back(process);
}
```

**Breaking it down:**
- Same state transition as FCFS
- `push_back` - Adds to end of vector (order doesn't matter here)
- Vector allows us to search through all processes later

---

### nextProcess
```cpp
Process* SJFScheduler::nextProcess() {
    readyList.erase(
        remove_if(readyList.begin(), readyList.end(),
                  [](Process* p){ return p->getState() == ProcessState::TERMINATED; }),
        readyList.end()
    );
```

**Breaking it down:**

**Erase-remove idiom:**
- Common C++ pattern for removing elements from vector
- `std::remove_if` - Moves matching elements to end, returns new end iterator
- `erase` - Actually removes from new end to old end

**Lambda function:**
- `[](Process* p){ ... }` - Anonymous function (lambda)
- `[]` - Capture clause (empty = captures nothing)
- `(Process* p)` - Parameter: each process in vector
- `return p->getState() == ProcessState::TERMINATED;` - Condition to remove

**Why this pattern?**
- Vectors can't remove while iterating (invalidates iterators)
- This is the efficient, safe way

**Iterators:**
- `readyList.begin()` - Iterator to first element
- `readyList.end()` - Iterator to past-the-end position

---

```cpp
    if (currentProcess && currentProcess->getState() != ProcessState::TERMINATED 
        && currentProcess->hasNextInstruction()) {
        return currentProcess;
    }
```

**Breaking it down:**

**Non-preemptive logic:**
- Three conditions (all must be true):
  1. `currentProcess` - Not null (something is running)
  2. `currentProcess->getState() != ProcessState::TERMINATED` - Still alive
  3. `currentProcess->hasNextInstruction()` - Has work remaining

**Short-circuit evaluation:**
- `&&` evaluates left to right
- If `currentProcess` is null, doesn't check other conditions (prevents null pointer access)

**Return current:**
- If all conditions met, continue with same process
- This is what makes it non-preemptive

---

```cpp
    Process* best = nullptr;
    size_t bestRem = numeric_limits<size_t>::max();
```

**Breaking it down:**

**Finding shortest:**
- `Process* best = nullptr;` - Will store shortest process found
- `size_t bestRem` - Tracks minimum remaining instructions
- `numeric_limits<size_t>::max()` - Maximum possible size_t value
  - Ensures any real process will be smaller
  - Common initialization for finding minimum

---

```cpp
    for (auto* p : readyList) {
        if (p->getState() == ProcessState::READY && p->hasNextInstruction()) {
            size_t rem = remainingInstructions(p);
            if (rem < bestRem) {
                bestRem = rem;
                best = p;
            }
        }
    }
```

**Breaking it down:**

**Range-based for loop:**
- `for (auto* p : readyList)` - Iterate over each element
- `auto*` - Compiler deduces type (Process*), * makes it pointer
- Cleaner than traditional for loop with indices

**Filter conditions:**
- `p->getState() == ProcessState::READY` - Only consider ready processes
- `p->hasNextInstruction()` - Only consider unfinished processes

**Finding minimum:**
- `size_t rem = remainingInstructions(p);` - Calculate work left
- `if (rem < bestRem)` - Found shorter job?
- Update both `bestRem` and `best` - track minimum and which process

**After loop:**
- `best` points to process with fewest remaining instructions
- Or `nullptr` if no ready processes found

---

```cpp
    currentProcess = best;
    return currentProcess;
}
```

**Breaking it down:**
- `currentProcess = best;` - Remember this choice for next tick
- `return currentProcess;` - Could return `best` directly, same result
- Returns `nullptr` if no process found (CPU idles)

---

## 4. Preemptive SJF Implementation

### addProcess
```cpp
void PreemptiveSJFScheduler::addProcess(Process* process) {
    process->setState(ProcessState::READY);
    readyList.push_back(process);
}
```

**Breaking it down:**
- Identical to SJF addProcess
- Difference is in nextProcess (preemption logic)

---

### nextProcess
```cpp
Process* PreemptiveSJFScheduler::nextProcess() {
    readyList.erase(
        remove_if(readyList.begin(), readyList.end(),
                  [](Process* p){ return p->getState() == ProcessState::TERMINATED; }),
        readyList.end()
    );
```

**Breaking it down:**
- Same cleanup as SJF
- Removes terminated processes

---

```cpp
    Process* best = nullptr;
    size_t bestRem = numeric_limits<size_t>::max();
    for (auto* p : readyList) {
        if ((p->getState() == ProcessState::READY || p->getState() == ProcessState::RUNNING) 
            && p->hasNextInstruction()) {
            size_t rem = remainingInstructions(p);
            if (rem < bestRem) {
                bestRem = rem;
                best = p;
            }
        }
    }

    return best;
}
```

**Breaking it down:**

**Key difference from SJF:**
- `(p->getState() == ProcessState::READY || p->getState() == ProcessState::RUNNING)`
- Also considers RUNNING processes!
- This allows preemption - currently running process can be switched out

**No currentProcess tracking:**
- Doesn't remember previous choice
- Recalculates best every tick
- Allows switching to newly arrived shorter job

**Direct return:**
- `return best;` - Returns the shortest, regardless of what was running before
- Might be same as last tick, might be different (preemption)

---

## 5. Priority Scheduler Implementation

### addProcess
```cpp
void PriorityScheduler::addProcess(Process* process) {
    process->setState(ProcessState::READY);
    readyList.push_back(process);
}
```

**Breaking it down:**
- Standard addProcess implementation
- Adds to vector for searching

---

### nextProcess
```cpp
Process* PriorityScheduler::nextProcess() {
    readyList.erase(
        remove_if(readyList.begin(), readyList.end(),
                  [](Process* p){ return p->getState() == ProcessState::TERMINATED; }),
        readyList.end()
    );
```

**Breaking it down:**
- Same cleanup pattern
- Removes finished processes

---

```cpp
    Process* best = nullptr;
    int bestPrio = numeric_limits<int>::max();
    for (auto* p : readyList) {
        if ((p->getState() == ProcessState::READY || p->getState() == ProcessState::RUNNING) 
            && p->hasNextInstruction()) {
            int pr = p->getPriority();
            if (pr < bestPrio) {
                bestPrio = pr;
                best = p;
            }
        }
    }
```

**Breaking it down:**

**Priority comparison:**
- `int bestPrio = numeric_limits<int>::max();` - Start with worst priority
- `int pr = p->getPriority();` - Get process priority
- `if (pr < bestPrio)` - Lower number = higher priority
  - P2 with priority 1 beats P1 with priority 2

**Preemptive:**
- Checks both READY and RUNNING states
- Can switch to higher priority process anytime

---

```cpp
    if (!best && currentProcess && currentProcess->getState() != ProcessState::TERMINATED 
        && currentProcess->hasNextInstruction()) {
        return currentProcess;
    }

    currentProcess = best;
    return currentProcess;
}
```

**Breaking it down:**

**Fallback logic:**
- `if (!best && ...)` - No process found in readyList
- Check if currentProcess is still valid
- Return it if so (edge case handling)

**Update and return:**
- `currentProcess = best;` - Remember new choice
- `return currentProcess;` - Return the highest priority process

---

## 6. Round Robin Implementation

### addProcess
```cpp
void RRScheduler::addProcess(Process* process) {
    process->setState(ProcessState::READY);
    readyQueue.push(process);
}
```

**Breaking it down:**
- Back to using queue (FIFO rotation)
- Same pattern as FCFS addProcess

---

### nextProcess - Part 1
```cpp
Process* RRScheduler::nextProcess() {
    while (!readyQueue.empty() && readyQueue.front()->getState() == ProcessState::TERMINATED) {
        readyQueue.pop();
    }
```

**Breaking it down:**
- Standard cleanup of terminated processes from front
- Same pattern as FCFS

---

### nextProcess - Part 2
```cpp
    if (currentProcess == nullptr || currentProcess->getState() == ProcessState::TERMINATED 
        || !currentProcess->hasNextInstruction()) {
        currentQuantumUsed = 0;
        if (readyQueue.empty()) {
            currentProcess = nullptr;
            return nullptr;
        }
        currentProcess = readyQueue.front();
        readyQueue.pop();
        return currentProcess;
    }
```

**Breaking it down:**

**Need new process conditions:**
- `currentProcess == nullptr` - Nothing running
- `currentProcess->getState() == ProcessState::TERMINATED` - Current finished
- `!currentProcess->hasNextInstruction()` - Current done

**Reset quantum:**
- `currentQuantumUsed = 0;` - New process gets fresh time slice

**Empty queue case:**
- `if (readyQueue.empty())` - No processes waiting
- `currentProcess = nullptr;` - Clear current
- `return nullptr;` - CPU idles

**Pick next from queue:**
- `currentProcess = readyQueue.front();` - Get front process
- `readyQueue.pop();` - Remove it from queue (now running, not waiting)
- `return currentProcess;` - This process gets to run

---

### nextProcess - Part 3
```cpp
    if (currentQuantumUsed >= quanta) {
        if (currentProcess->hasNextInstruction() && currentProcess->getState() != ProcessState::TERMINATED) {
            currentProcess->setState(ProcessState::READY);
            readyQueue.push(currentProcess);
        }
        currentQuantumUsed = 0;
```

**Breaking it down:**

**Time slice expired:**
- `if (currentQuantumUsed >= quanta)` - Used up 2 ticks
- Time to rotate!

**Still has work?**
- `if (currentProcess->hasNextInstruction() && ...)` - Not finished
- `currentProcess->setState(ProcessState::READY);` - Mark as ready (not running)
- `readyQueue.push(currentProcess);` - Send to back of queue
  - This is the "round robin" - goes to back, gets another turn later

**Reset quantum:**
- `currentQuantumUsed = 0;` - Next process gets fresh slice

---

```cpp
        while (!readyQueue.empty() && readyQueue.front()->getState() == ProcessState::TERMINATED) {
            readyQueue.pop();
        }
        if (readyQueue.empty()) {
            currentProcess = nullptr;
            return nullptr;
        }
        currentProcess = readyQueue.front();
        readyQueue.pop();
        return currentProcess;
    }
```

**Breaking it down:**

**Get next process:**
- Clean terminated from front (again, for safety)
- Check if queue empty → no process available
- Otherwise, pop front and make it current
- This process now gets its turn (2 ticks)

---

### nextProcess - Part 4
```cpp
    currentQuantumUsed++;
    return currentProcess;
}
```

**Breaking it down:**

**Continue with current:**
- Quantum not expired yet
- `currentQuantumUsed++;` - Increment counter (tracking usage)
- `return currentProcess;` - Same process continues

**The counting logic:**
```
Tick 0: currentQuantumUsed = 0, increment → 1, continue
Tick 1: currentQuantumUsed = 1, increment → 2, continue
Tick 2: currentQuantumUsed = 2, now >= quanta (2), rotate!
```

---

## Key Patterns Across All Schedulers

### 1. Pointer Usage
```cpp
Process* p = ...;
if (p) { ... }           // Check if valid
p->methodName();         // Access through pointer
```
- Pointers allow null checks
- Lightweight (no copying heavy objects)
- Can modify the process through pointer

### 2. State Transitions
```cpp
process->setState(ProcessState::READY);    // In addProcess
// CPU sets to RUNNING when executing
// CPU sets to TERMINATED when done
```

### 3. Null Returns
```cpp
if (noProcessReady) {
    return nullptr;  // CPU will idle
}
```
- Convention: nullptr means "no process to run"
- Emulator handles this gracefully

### 4. Cleanup Patterns
```cpp
// Queue cleanup (FCFS, RR)
while (!queue.empty() && queue.front()->getState() == ProcessState::TERMINATED) {
    queue.pop();
}

// Vector cleanup (SJF, Priority, SRTF)
readyList.erase(
    remove_if(readyList.begin(), readyList.end(),
              [](Process* p){ return p->getState() == ProcessState::TERMINATED; }),
    readyList.end()
);
```
- Different data structures, different cleanup approaches
- Both achieve same goal: remove finished processes

---

## Summary of Implementation Differences

| Scheduler | Data Structure | Tracks Current? | Preemptive? | Selection Criteria |
|-----------|---------------|-----------------|-------------|-------------------|
| FCFS | Queue | No | No | First in queue |
| SJF | Vector | Yes | No | Shortest remaining |
| SRTF | Vector | No | Yes | Shortest remaining |
| Priority | Vector | Yes | Yes | Lowest priority number |
| RR | Queue | Yes | Yes (by time) | Front of queue, with quantum |

**Why currentProcess differs:**
- **FCFS**: Doesn't need it - queue front is always current
- **SJF**: Needs it - must continue current until done
- **SRTF**: Doesn't need it - recalculates every tick
- **Priority**: Has it for optimization - avoids unnecessary switching
- **RR**: Needs it - must track quantum usage per process

---

This completes the detailed code walkthrough!
