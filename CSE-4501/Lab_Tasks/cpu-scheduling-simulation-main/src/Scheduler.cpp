#include "Scheduler.hpp"
#include <algorithm>
#include <limits>

using namespace std;

// Helper: remaining instructions
static size_t remainingInstructions(Process* p) {
    if (!p) return 0;
    return p->getTotalInstructions() - p->getProgramCounter();
}

// FCFS Implementation
void FCFSScheduler::addProcess(Process* process) {
    process->setState(ProcessState::READY);
    readyQueue.push(process);
}

Process* FCFSScheduler::nextProcess() {
    if (readyQueue.empty()) {
        return nullptr;
    }
    
    while (!readyQueue.empty() && readyQueue.front()->getState() == ProcessState::TERMINATED) {
        readyQueue.pop();
    }
    
    if (readyQueue.empty()) {
        return nullptr;
    }

    Process* p = readyQueue.front();
    
    // If the process at the front has no more instructions, pop it
    if (!p->hasNextInstruction()) {
        readyQueue.pop();
        // Try to get the next one
        return nextProcess();
    }
    
    return p;
}


// SJF (Non-preemptive)
void SJFScheduler::addProcess(Process* process) {
    process->setState(ProcessState::READY);
    readyList.push_back(process);
}

Process* SJFScheduler::nextProcess() {
    // Clean up terminated processes
    readyList.erase(
        remove_if(readyList.begin(), readyList.end(),
                       [](Process* p){ return p->getState() == ProcessState::TERMINATED; }),
        readyList.end()
    );

    // If current process is still running and not finished, continue (non-preemptive)
    if (currentProcess && currentProcess->getState() != ProcessState::TERMINATED && currentProcess->hasNextInstruction()) {
        return currentProcess;
    }

    // Choose shortest job by remaining instructions
    Process* best = nullptr;
    size_t bestRem = numeric_limits<size_t>::max();
    for (auto* p : readyList) {
        if (p->getState() == ProcessState::READY && p->hasNextInstruction()) {
            size_t rem = remainingInstructions(p);
            if (rem < bestRem) {
                bestRem = rem;
                best = p;
            }
        }
    }

    currentProcess = best;
    return currentProcess;
}


// Preemptive SJF (Shortest Remaining Time First)
void PreemptiveSJFScheduler::addProcess(Process* process) {
    process->setState(ProcessState::READY);
    readyList.push_back(process);
}

Process* PreemptiveSJFScheduler::nextProcess() {
    // Clean up terminated processes
    readyList.erase(
        remove_if(readyList.begin(), readyList.end(),
                       [](Process* p){ return p->getState() == ProcessState::TERMINATED; }),
        readyList.end()
    );

    // Find process with smallest remaining time
    Process* best = nullptr;
    size_t bestRem = numeric_limits<size_t>::max();
    for (auto* p : readyList) {
        if ((p->getState() == ProcessState::READY || p->getState() == ProcessState::RUNNING) && p->hasNextInstruction()) {
            size_t rem = remainingInstructions(p);
            if (rem < bestRem) {
                bestRem = rem;
                best = p;
            }
        }
    }

    // If none found, return nullptr (no runnable process)
    return best;
}


// Priority Scheduler (Preemptive; lower number = higher priority)
void PriorityScheduler::addProcess(Process* process) {
    process->setState(ProcessState::READY);
    readyList.push_back(process);
}

Process* PriorityScheduler::nextProcess() {
    // Clean up terminated processes
    readyList.erase(
        remove_if(readyList.begin(), readyList.end(),
                       [](Process* p){ return p->getState() == ProcessState::TERMINATED; }),
        readyList.end()
    );

    // Choose process with highest priority (lowest numeric value)
    Process* best = nullptr;
    int bestPrio = numeric_limits<int>::max();
    for (auto* p : readyList) {
        if ((p->getState() == ProcessState::READY || p->getState() == ProcessState::RUNNING) && p->hasNextInstruction()) {
            int pr = p->getPriority();
            if (pr < bestPrio) {
                bestPrio = pr;
                best = p;
            }
        }
    }

    // If no ready in list, maybe continue with current if it's not finished
    if (!best && currentProcess && currentProcess->getState() != ProcessState::TERMINATED && currentProcess->hasNextInstruction()) {
        return currentProcess;
    }

    currentProcess = best;
    return currentProcess;
}



// Round Robin
void RRScheduler::addProcess(Process* process) {
    process->setState(ProcessState::READY);
    readyQueue.push(process);
}

Process* RRScheduler::nextProcess() {
    // Remove terminated processes from front
    while (!readyQueue.empty() && readyQueue.front()->getState() == ProcessState::TERMINATED) {
        readyQueue.pop();
    }

    // If we have no current process or it's terminated, pick next
    if (currentProcess == nullptr || currentProcess->getState() == ProcessState::TERMINATED || !currentProcess->hasNextInstruction()) {
        currentQuantumUsed = 0;
        if (readyQueue.empty()) {
            currentProcess = nullptr;
            return nullptr;
        }
        currentProcess = readyQueue.front();
        readyQueue.pop();
        return currentProcess;
    }

    // If current process still has instructions but exceeded quanta, rotate it
    if (currentQuantumUsed >= quanta) {
        // If still has work, push it to back of queue
        if (currentProcess->hasNextInstruction() && currentProcess->getState() != ProcessState::TERMINATED) {
            currentProcess->setState(ProcessState::READY);
            readyQueue.push(currentProcess);
        }
        // pick next runnable
        currentQuantumUsed = 0;
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

    // Continue with current process and increment quantum
    currentQuantumUsed++;
    return currentProcess;
}