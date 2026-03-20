#include <iostream>
#include <vector>
#include <map>
#include <set>
#include <queue>
#include <algorithm>

using namespace std;

class WaitForGraph {
private:
    int numProcesses;
    map<int, vector<int>> adjList;
    
public:
    WaitForGraph(int n) : numProcesses(n) {}
    
    void addEdge(int from, int to) {
        adjList[from].push_back(to);
    }
    
    void display() {
        cout << "\nWait-For Graph:" << endl;
        for (int i = 0; i < numProcesses; i++) {
            cout << "P" << i << " → ";
            if (adjList.find(i) != adjList.end() && !adjList[i].empty()) {
                for (size_t j = 0; j < adjList[i].size(); j++) {
                    cout << "P" << adjList[i][j];
                    if (j < adjList[i].size() - 1) cout << ", ";
                }
            } else {
                cout << "none";
            }
            cout << endl;
        }
    }
    
    // ═══════════════════════════════════════════════════════════
    // METHOD 1: DFS-Based Cycle Detection (MOST COMMONLY USED)
    // ═══════════════════════════════════════════════════════════
    
    bool DFS_CycleUtil(int vertex, vector<bool>& visited, vector<bool>& recStack, 
                       vector<int>& path) {
        visited[vertex] = true;
        recStack[vertex] = true;
        path.push_back(vertex);
        
        if (adjList.find(vertex) != adjList.end()) {
            for (int neighbor : adjList[vertex]) {
                if (!visited[neighbor]) {
                    if (DFS_CycleUtil(neighbor, visited, recStack, path)) {
                        return true;
                    }
                } else if (recStack[neighbor]) {
                    // Cycle detected! Add the vertex that completes the cycle
                    path.push_back(neighbor);
                    return true;
                }
            }
        }
        
        recStack[vertex] = false;
        path.pop_back();
        return false;
    }
    
    bool detectCycle_DFS(vector<int>& cycle) {
        vector<bool> visited(numProcesses, false);
        vector<bool> recStack(numProcesses, false);
        vector<int> path;
        
        for (int i = 0; i < numProcesses; i++) {
            if (!visited[i]) {
                if (DFS_CycleUtil(i, visited, recStack, path)) {
                    // Extract the actual cycle
                    int cycleStart = path.back();
                    cycle.clear();
                    bool inCycle = false;
                    
                    for (int vertex : path) {
                        if (vertex == cycleStart) inCycle = true;
                        if (inCycle) cycle.push_back(vertex);
                    }
                    return true;
                }
            }
        }
        return false;
    }
    
    // ═══════════════════════════════════════════════════════════
    // METHOD 2: BFS-Based Cycle Detection (Kahn's Algorithm)
    // ═══════════════════════════════════════════════════════════
    
    bool detectCycle_BFS(vector<int>& cycle) {
        // Calculate in-degrees
        vector<int> inDegree(numProcesses, 0);
        
        for (auto& pair : adjList) {
            for (int neighbor : pair.second) {
                inDegree[neighbor]++;
            }
        }
        
        // Queue of vertices with in-degree 0
        queue<int> q;
        for (int i = 0; i < numProcesses; i++) {
            if (inDegree[i] == 0) {
                q.push(i);
            }
        }
        
        int visitedCount = 0;
        
        while (!q.empty()) {
            int vertex = q.front();
            q.pop();
            visitedCount++;
            
            if (adjList.find(vertex) != adjList.end()) {
                for (int neighbor : adjList[vertex]) {
                    inDegree[neighbor]--;
                    if (inDegree[neighbor] == 0) {
                        q.push(neighbor);
                    }
                }
            }
        }
        
        // If not all vertices visited, there's a cycle
        if (visitedCount != numProcesses) {
            // Find vertices still in cycle
            for (int i = 0; i < numProcesses; i++) {
                if (inDegree[i] > 0) {
                    cycle.push_back(i);
                }
            }
            return true;
        }
        
        return false;
    }
    
    // ═══════════════════════════════════════════════════════════
    // METHOD 3: Tarjan's Algorithm (Strongly Connected Components)
    // ═══════════════════════════════════════════════════════════
    
    void tarjanUtil(int vertex, vector<int>& disc, vector<int>& low, 
                    vector<bool>& onStack, vector<int>& st, int& time,
                    vector<vector<int>>& sccs) {
        disc[vertex] = low[vertex] = ++time;
        st.push_back(vertex);
        onStack[vertex] = true;
        
        if (adjList.find(vertex) != adjList.end()) {
            for (int neighbor : adjList[vertex]) {
                if (disc[neighbor] == -1) {
                    tarjanUtil(neighbor, disc, low, onStack, st, time, sccs);
                    low[vertex] = min(low[vertex], low[neighbor]);
                } else if (onStack[neighbor]) {
                    low[vertex] = min(low[vertex], disc[neighbor]);
                }
            }
        }
        
        if (low[vertex] == disc[vertex]) {
            vector<int> scc;
            while (true) {
                int w = st.back();
                st.pop_back();
                onStack[w] = false;
                scc.push_back(w);
                if (w == vertex) break;
            }
            if (scc.size() > 1) {  // Cycle found
                sccs.push_back(scc);
            }
        }
    }
    
    bool detectCycle_Tarjan(vector<int>& cycle) {
        vector<int> disc(numProcesses, -1);
        vector<int> low(numProcesses, -1);
        vector<bool> onStack(numProcesses, false);
        vector<int> st;
        vector<vector<int>> sccs;
        int time = 0;
        
        for (int i = 0; i < numProcesses; i++) {
            if (disc[i] == -1) {
                tarjanUtil(i, disc, low, onStack, st, time, sccs);
            }
        }
        
        if (!sccs.empty()) {
            cycle = sccs[0];  // Return first SCC found
            return true;
        }
        return false;
    }
    
    int getNumProcesses() { return numProcesses; }
};

// ═══════════════════════════════════════════════════════════
// Test Cases
// ═══════════════════════════════════════════════════════════

void testCase1_SimpleDeadlock() {
    cout << "\n╔═══════════════════════════════════════════════════════╗" << endl;
    cout << "║  TEST CASE 1: Simple Two-Process Deadlock            ║" << endl;
    cout << "╚═══════════════════════════════════════════════════════╝" << endl;
    
    WaitForGraph wfg(2);
    cout << "\nScenario: P0 ↔ P1 (Mutual waiting)\n";
    wfg.addEdge(0, 1);
    wfg.addEdge(1, 0);
    
    wfg.display();
    
    vector<int> cycle;
    cout << "\n--- DFS-Based Detection ---" << endl;
    if (wfg.detectCycle_DFS(cycle)) {
        cout << "✗ DEADLOCK DETECTED!" << endl;
        cout << "Cycle: ";
        for (size_t i = 0; i < cycle.size(); i++) {
            cout << "P" << cycle[i];
            if (i < cycle.size() - 1) cout << " → ";
        }
        cout << endl;
    } else {
        cout << "✓ No deadlock" << endl;
    }
}

void testCase2_CircularWait() {
    cout << "\n╔═══════════════════════════════════════════════════════╗" << endl;
    cout << "║  TEST CASE 2: Three-Process Circular Wait            ║" << endl;
    cout << "╚═══════════════════════════════════════════════════════╝" << endl;
    
    WaitForGraph wfg(3);
    cout << "\nScenario: P0 → P1 → P2 → P0 (Circular)\n";
    wfg.addEdge(0, 1);
    wfg.addEdge(1, 2);
    wfg.addEdge(2, 0);
    
    wfg.display();
    
    vector<int> cycle;
    cout << "\n--- DFS-Based Detection ---" << endl;
    if (wfg.detectCycle_DFS(cycle)) {
        cout << "✗ DEADLOCK DETECTED!" << endl;
        cout << "Cycle: ";
        for (size_t i = 0; i < cycle.size(); i++) {
            cout << "P" << cycle[i];
            if (i < cycle.size() - 1) cout << " → ";
        }
        cout << endl;
    }
    
    cycle.clear();
    cout << "\n--- BFS-Based Detection (Kahn's Algorithm) ---" << endl;
    if (wfg.detectCycle_BFS(cycle)) {
        cout << "✗ DEADLOCK DETECTED!" << endl;
        cout << "Processes in cycle: ";
        for (size_t i = 0; i < cycle.size(); i++) {
            cout << "P" << cycle[i];
            if (i < cycle.size() - 1) cout << ", ";
        }
        cout << endl;
    }
}

void testCase3_NoDeadlock() {
    cout << "\n╔═══════════════════════════════════════════════════════╗" << endl;
    cout << "║  TEST CASE 3: No Deadlock - Linear Chain             ║" << endl;
    cout << "╚═══════════════════════════════════════════════════════╝" << endl;
    
    WaitForGraph wfg(4);
    cout << "\nScenario: P0 → P1 → P2 → P3 (No cycle)\n";
    wfg.addEdge(0, 1);
    wfg.addEdge(1, 2);
    wfg.addEdge(2, 3);
    
    wfg.display();
    
    vector<int> cycle;
    cout << "\n--- DFS-Based Detection ---" << endl;
    if (wfg.detectCycle_DFS(cycle)) {
        cout << "✗ DEADLOCK DETECTED!" << endl;
    } else {
        cout << "✓ No deadlock (Safe state)" << endl;
    }
}

void testCase4_ComplexDeadlock() {
    cout << "\n╔═══════════════════════════════════════════════════════╗" << endl;
    cout << "║  TEST CASE 4: Complex Multi-Process Scenario         ║" << endl;
    cout << "╚═══════════════════════════════════════════════════════╝" << endl;
    
    WaitForGraph wfg(6);
    cout << "\nScenario: Multiple cycles\n";
    cout << "- Cycle 1: P0 → P1 → P2 → P0\n";
    cout << "- P3 → P4 (independent)\n";
    cout << "- P5 isolated\n";
    
    wfg.addEdge(0, 1);
    wfg.addEdge(1, 2);
    wfg.addEdge(2, 0);
    wfg.addEdge(3, 4);
    
    wfg.display();
    
    vector<int> cycle;
    cout << "\n--- DFS-Based Detection ---" << endl;
    if (wfg.detectCycle_DFS(cycle)) {
        cout << "✗ DEADLOCK DETECTED!" << endl;
        cout << "Cycle found: ";
        for (size_t i = 0; i < cycle.size(); i++) {
            cout << "P" << cycle[i];
            if (i < cycle.size() - 1) cout << " → ";
        }
        cout << endl;
    }
    
    cycle.clear();
    cout << "\n--- Tarjan's Algorithm (SCC Detection) ---" << endl;
    if (wfg.detectCycle_Tarjan(cycle)) {
        cout << "✗ DEADLOCK DETECTED!" << endl;
        cout << "Strongly Connected Component: ";
        for (size_t i = 0; i < cycle.size(); i++) {
            cout << "P" << cycle[i];
            if (i < cycle.size() - 1) cout << ", ";
        }
        cout << endl;
    }
}

void testCase5_SelfLoop() {
    cout << "\n╔═══════════════════════════════════════════════════════╗" << endl;
    cout << "║  TEST CASE 5: Self-Loop Deadlock                     ║" << endl;
    cout << "╚═══════════════════════════════════════════════════════╝" << endl;
    
    WaitForGraph wfg(3);
    cout << "\nScenario: P1 waits for itself (self-loop)\n";
    wfg.addEdge(1, 1);
    wfg.addEdge(0, 2);
    
    wfg.display();
    
    vector<int> cycle;
    cout << "\n--- DFS-Based Detection ---" << endl;
    if (wfg.detectCycle_DFS(cycle)) {
        cout << "✗ DEADLOCK DETECTED (Self-loop)!" << endl;
        cout << "Cycle: ";
        for (size_t i = 0; i < cycle.size(); i++) {
            cout << "P" << cycle[i];
            if (i < cycle.size() - 1) cout << " → ";
        }
        cout << endl;
    }
}

int main() {
    cout << "╔════════════════════════════════════════════════════════════╗" << endl;
    cout << "║   Cycle Detection for Deadlock (C++ STL Version)          ║" << endl;
    cout << "╚════════════════════════════════════════════════════════════╝" << endl;
    
    cout << "\nCycle Detection Algorithms Implemented:" << endl;
    cout << "1. DFS-Based (Recursion Stack) - O(V+E)" << endl;
    cout << "2. BFS-Based (Kahn's Algorithm) - O(V+E)" << endl;
    cout << "3. Tarjan's Algorithm (SCC) - O(V+E)" << endl;
    
    testCase1_SimpleDeadlock();
    cout << "\nPress Enter to continue..."; cin.get();
    
    testCase2_CircularWait();
    cout << "\nPress Enter to continue..."; cin.get();
    
    testCase3_NoDeadlock();
    cout << "\nPress Enter to continue..."; cin.get();
    
    testCase4_ComplexDeadlock();
    cout << "\nPress Enter to continue..."; cin.get();
    
    testCase5_SelfLoop();
    
    cout << "\n\n╔════════════════════════════════════════════════════════════╗" << endl;
    cout << "║                      SUMMARY                               ║" << endl;
    cout << "╚════════════════════════════════════════════════════════════╝" << endl;
    
    cout << "\nC++ Advantages for Deadlock Detection:" << endl;
    cout << "✓ vector<> instead of fixed arrays" << endl;
    cout << "✓ map<> for adjacency list (cleaner than matrix)" << endl;
    cout << "✓ No manual memory management" << endl;
    cout << "✓ STL algorithms (queue, stack built-in)" << endl;
    cout << "✓ Classes for better organization" << endl;
    
    cout << "\nRecommended Algorithm: DFS-Based" << endl;
    cout << "- Most intuitive and commonly taught" << endl;
    cout << "- Efficient O(V+E) time complexity" << endl;
    cout << "- Easy to trace the actual cycle" << endl;
    
    return 0;
}
