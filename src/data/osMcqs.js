export const osMcqs = [
    // Basics & Process Management
    {
        q: "What is the main purpose of an Operating System?",
        options: [
            "To provide a user GUI",
            "To act as an intermediary between the user and computer hardware",
            "To compile and execute programs",
            "To manage internet connections"
        ],
        ans: 1
    },
    {
        q: "Which of the following is NOT a state of a process?",
        options: ["Running", "Ready", "Waiting", "Executing"],
        ans: 3
    },
    {
        q: "What data structure is used by the OS to keep track of all processes?",
        options: ["Process Table", "Page Table", "Segment Table", "Hash Map"],
        ans: 0
    },
    {
        q: "What is a single sequence stream within a process called?",
        options: ["Program", "Function", "Thread", "Module"],
        ans: 2
    },
    {
        q: "In what type of memory does internal fragmentation occur?",
        options: [
            "Variable-sized partitions",
            "Fixed-sized partitions (Paging)",
            "Virtual Memory",
            "Cache Memory"
        ],
        ans: 1
    },
    {
        q: "Which state transition is NOT possible for a process?",
        options: [
            "Ready to Running",
            "Waiting to Running",
            "Running to Waiting",
            "Running to Ready"
        ],
        ans: 1
    },
    {
        q: "What does PCB stand for in an operating system?",
        options: [
            "Process Control Block",
            "Program Control Block",
            "Printed Circuit Board",
            "Process Communication Block"
        ],
        ans: 0
    },
    {
        q: "A process that has finished execution but still has an entry in the process table is called a:",
        options: ["Orphan Process", "Zombie Process", "Child Process", "Daemon Process"],
        ans: 1
    },
    {
        q: "A process whose parent has terminated without waiting for it is called a:",
        options: ["Orphan Process", "Zombie Process", "Foreground Process", "Init Process"],
        ans: 0
    },
    {
        q: "What is the primary difference between a process and a thread?",
        options: [
            "Threads do not use memory",
            "Processes share memory, threads do not",
            "Threads within the same process share memory space",
            "A thread is heavier than a process"
        ],
        ans: 2
    },

    // CPU Scheduling & Concurrency
    {
        q: "Which CPU scheduling algorithm gives minimum average waiting time?",
        options: ["FCFS", "SJF (Shortest Job First)", "Round Robin", "Priority Scheduling"],
        ans: 1
    },
    {
        q: "In which scheduling algorithm can starvation occur?",
        options: ["First-Come, First-Served", "Round Robin", "Priority Scheduling", "Multilevel Feedback Queue"],
        ans: 2
    },
    {
        q: "What technique is used to prevent starvation of low-priority processes?",
        options: ["Preemption", "Aging", "Context Switching", "Spooling"],
        ans: 1
    },
    {
        q: "Which feature makes Round Robin scheduling fair?",
        options: ["Shortest Job First", "Time Quantum (Time Slicing)", "LIFO Queue", "Aging"],
        ans: 1
    },
    {
        q: "What is the process of saving the state of the old process and loading the state of the new process called?",
        options: ["Swapping", "Context Switching", "Paging", "Spooling"],
        ans: 1
    },
    {
        q: "When two or more processes wait indefinitely for each other to finish, the situation is known as:",
        options: ["Starvation", "Deadlock", "Race Condition", "Mutual Exclusion"],
        ans: 1
    },
    {
        q: "Which of the following is NOT a necessary condition for a deadlock?",
        options: ["Mutual Exclusion", "Circular Wait", "Preemption", "Hold and Wait"],
        ans: 2
    },
    {
        q: "Which algorithm is used for Deadlock Avoidance?",
        options: ["Bakery Algorithm", "Peterson's Algorithm", "Banker's Algorithm", "Elevator Algorithm"],
        ans: 2
    },
    {
        q: "What is a semaphore?",
        options: [
            "An integer variable used for synchronization",
            "A hardware device for tracking memory",
            "A type of cache memory",
            "A scheduling algorithm"
        ],
        ans: 0
    },
    {
        q: "When a process attempts to lock a non-recursive mutex that it has already locked, what happens?",
        options: ["It succeeds", "Context switch occurs", "Deadlock", "Starvation"],
        ans: 2
    },
    {
        q: "What problem arises when the outcome of operations depends on the exact sequence of execution across multiple processes?",
        options: ["Deadlock", "Race Condition", "Starvation", "Thrashing"],
        ans: 1
    },
    {
        q: "What is the term for a section of code that accesses shared resources and must not be concurrently executed?",
        options: ["Critical Section", "Deadlock Zone", "Semaphore Area", "Mutual Exclusion Segment"],
        ans: 0
    },
    {
        q: "Which of the following provides inter-process communication (IPC) in a single direction?",
        options: ["Semaphore", "Shared Memory", "Pipe", "Message Queue"],
        ans: 2
    },
    {
        q: "What is a 'Trap' in an operating system?",
        options: [
            "A hardware mechanism to catch viruses",
            "A software interrupt caused by an error",
            "A dead zone in memory",
            "A specific type of deadlock"
        ],
        ans: 1
    },

    // Memory Management
    {
        q: "What translates a logical address into a physical address?",
        options: ["Compiler", "Assembler", "MMU (Memory Management Unit)", "CPU"],
        ans: 2
    },
    {
        q: "What is the phenomenon where adding more physical memory increases the number of page faults?",
        options: ["Thrashing", "Belady's Anomaly", "Fragmentation", "Paging Overhead"],
        ans: 1
    },
    {
        q: "When does thrashing occur?",
        options: [
            "When the CPU is underutilized",
            "When the process spends more time paging than executing",
            "When the memory is completely full",
            "When a process accesses illegal memory"
        ],
        ans: 1
    },
    {
        q: "What is the main advantage of virtual memory?",
        options: [
            "Increases physical RAM size",
            "Allows execution of processes larger than physical memory",
            "Removes internal fragmentation completely",
            "Increases cache hit ratio"
        ],
        ans: 1
    },
    {
        q: "What memory allocation scheme divides logical memory into fixed-size blocks?",
        options: ["Segmentation", "Paging", "Swapping", "Contiguous allocation"],
        ans: 1
    },
    {
        q: "Segmentation suffers from which problem?",
        options: ["Internal Fragmentation", "External Fragmentation", "Belady's Anomaly", "Thrashing"],
        ans: 1
    },
    {
        q: "What is an event called when a process attempts to access a page that is not currently in RAM?",
        options: ["Page Fault", "Segmentation Fault", "Memory Leak", "Cache Miss"],
        ans: 0
    },
    {
        q: "What technique is used to load only the required pages of a process into memory when needed?",
        options: ["Caching", "Demand Paging", "Pre-paging", "Swapping"],
        ans: 1
    },
    {
        q: "Which memory management technique minimizes external fragmentation?",
        options: ["Contiguous Allocation", "Paging", "Segmentation", "Dynamic Loading"],
        ans: 1
    },
    {
        q: "What is a Translation Lookaside Buffer (TLB)?",
        options: [
            "A hardware cache for the page table",
            "A buffer for network packets",
            "A queue for waiting processes",
            "A temporary storage for disk I/O"
        ],
        ans: 0
    },
    {
        q: "What does 'Locality of Reference' imply?",
        options: [
            "Programs tend to access random memory locations",
            "Programs tend to access instructions/data whose addresses are near one another",
            "Processes refer to their local variables only",
            "Memory references are evenly distributed"
        ],
        ans: 1
    },

    // Advanced & I/O
    {
        q: "What is spooling?",
        options: [
            "Transferring processes from RAM to disk",
            "Temporarily storing data in a buffer before it is processed by a slower device",
            "Dividing memory into pages",
            "A deadlock prevention technique"
        ],
        ans: 1
    },
    {
        q: "What is Direct Memory Access (DMA)?",
        options: [
            "Allowing I/O devices to access memory bypassing the CPU",
            "Direct access to physical addresses by user programs",
            "A fast caching mechanism",
            "Allocating memory directly from the kernel"
        ],
        ans: 0
    },
    {
        q: "Which type of kernel implements both user services and kernel services under the same address space?",
        options: ["Microkernel", "Monolithic Kernel", "Hybrid Kernel", "Exokernel"],
        ans: 1
    },
    {
        q: "What distinguishes a Microkernel from a Monolithic kernel?",
        options: [
            "Microkernel runs faster",
            "Microkernel places essential services in kernel space and others in user space",
            "Microkernel is used only on mobile devices",
            "Microkernel does not use virtual memory"
        ],
        ans: 1
    },
    {
        q: "When we execute the `fork()` system call, what does it return to the child process?",
        options: ["The PID of the parent", "1", "0", "-1"],
        ans: 2
    },
    {
        q: "Which system call ensures that a child process is completely removed from the process table after termination?",
        options: ["kill()", "exit()", "wait()", "sleep()"],
        ans: 2
    },
    {
        q: "In disk scheduling, what is 'Seek Time'?",
        options: [
            "Time taken for the desired sector to rotate under the head",
            "Time taken to move the disk arm to the desired track",
            "Time taken to transfer data",
            "Time spent waiting in the queue"
        ],
        ans: 1
    },
    {
        q: "What is Rotational Latency in a magnetic disk?",
        options: [
            "Time taken to locate the track",
            "Time taken for the disk sector to rotate into position",
            "Time taken to read the file allocation table",
            "Delay caused by CPU processing"
        ],
        ans: 1
    },
    {
        q: "What does RAID stand for?",
        options: [
            "Redundant Array of Independent Disks",
            "Random Access Independent Disks",
            "Rapid Allocation of Integrated Disks",
            "Read Access Integrated Data"
        ],
        ans: 0
    },
    {
        q: "Which RAID level uses striping and mirroring combined?",
        options: ["RAID 0", "RAID 1", "RAID 5", "RAID 10"],
        ans: 3
    },
    {
        q: "What is the primary function of the File Allocation Table (FAT)?",
        options: [
            "To schedule CPU processes",
            "To store user credentials safely",
            "To map clusters to file contents on a disk",
            "To format the hard drive"
        ],
        ans: 2
    },
    {
        q: "What does multi-programming aim to achieve?",
        options: [
            "Run a single process as fast as possible",
            "Keep the CPU as busy as possible by organizing jobs",
            "Prevent multiple users from logging in",
            "Minimize cache misses"
        ],
        ans: 1
    },
    {
        q: "What is Multitasking?",
        options: [
            "A hardware feature for parallel execution",
            "Time-sharing extension of multiprogramming allowing users to interact with concurrent tasks",
            "Writing code in multiple languages simultaneously",
            "Using multiple monitors"
        ],
        ans: 1
    },
    {
        q: "What is Bootstrapping?",
        options: [
            "Allocating memory arrays dynamically",
            "Process of loading the OS kernel into memory during startup",
            "Compiling the kernel source code",
            "A method of deadlock prevention"
        ],
        ans: 1
    },
    {
        q: "Which of the following describes a Real-Time Operating System?",
        options: [
            "An OS that guarantees a response within strict timing constraints",
            "An OS that updates its UI continuously",
            "An OS that connects to the internet without delay",
            "An OS used exclusively in data centers"
        ],
        ans: 0
    },
    {
        q: "What happens if a non-recursive mutex is locked more than once by the same thread?",
        options: ["The lock count increases", "The request is ignored", "Deadlock", "The thread is terminated"],
        ans: 2
    },
    {
        q: "What is 'Cycle Stealing' in the context of DMA?",
        options: [
            "CPU stealing memory cycles from I/O",
            "I/O controller accessing memory without interfering with the CPU",
            "A type of security attack",
            "A process scheduling technique"
        ],
        ans: 1
    },
    {
        q: "In an OS, what is a 'Trapdoor'?",
        options: [
            "A hidden software interrupt",
            "A secret entry point into a program bypassing authentication",
            "A type of memory fragmentation",
            "A kernel panic handler"
        ],
        ans: 1
    },
    {
        q: "Which technique is used to ensure a higher degree of multiprogramming with minimal physical memory?",
        options: ["Paging", "Virtual Memory", "Segmentation", "Caching"],
        ans: 1
    }
];

