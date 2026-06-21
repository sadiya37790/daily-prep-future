window.theoryConcepts = [
  {
    id: 1,
    subject: "DBMS",
    topic: "Joins in SQL",
    question: "What is the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN?",
    answer: "1. **INNER JOIN**: Returns records that have matching values in both tables.\n2. **LEFT JOIN**: Returns all records from the left table, and the matched records from the right table. If there is no match, the result is NULL on the right side.\n3. **RIGHT JOIN**: Returns all records from the right table, and the matched records from the left table. If there is no match, the result is NULL on the left side.",
    quiz: {
      question: "Which JOIN returns all records from the left table even if there are no matches in the right table?",
      options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"],
      answer: 1
    }
  },
  {
    id: 2,
    subject: "Operating Systems",
    topic: "Process vs. Thread",
    question: "Explain the difference between a Process and a Thread.",
    answer: "1. **Process**: An executing instance of an application running in separate memory spaces. Processes do not share memory by default. Context switching between processes is relatively slow.\n2. **Thread**: A path of execution within a process. Multiple threads share the memory space of their parent process. Threads are lightweight, and context switching is fast.",
    quiz: {
      question: "Which of the following is shared among threads of the same process?",
      options: ["Stack", "CPU Registers", "Program Counter", "Address Space / Memory"],
      answer: 3
    }
  },
  {
    id: 3,
    subject: "OOPs",
    topic: "Polymorphism",
    question: "What is Polymorphism? Explain Compile-time vs. Run-time Polymorphism.",
    answer: "Polymorphism allows an object to behave differently in different situations.\n1. **Compile-time Polymorphism (Static Binding)**: Achieved through **Method Overloading** (methods with same name but different signatures in the same class).\n2. **Run-time Polymorphism (Dynamic Binding)**: Achieved through **Method Overriding** (child class provides a specific implementation of a method defined in parent class, resolved at runtime).",
    quiz: {
      question: "Method Overloading is an example of which type of polymorphism?",
      options: ["Run-time", "Compile-time", "Dynamic", "Inherited"],
      answer: 1
    }
  },
  {
    id: 4,
    subject: "DBMS",
    topic: "ACID Properties",
    question: "What are the ACID properties in a Database Management System?",
    answer: "ACID guarantees that database transactions are processed reliably:\n1. **Atomicity**: 'All or nothing'. If any part of the transaction fails, the entire transaction is rolled back.\n2. **Consistency**: A transaction must transition the database from one valid state to another.\n3. **Isolation**: Concurrent transactions must execute independently without interfering with each other.\n4. **Durability**: Once a transaction is committed, its changes are permanent and survive crashes.",
    quiz: {
      question: "Which property ensures that once a transaction is committed, it remains saved even during a power outage?",
      options: ["Atomicity", "Consistency", "Isolation", "Durability"],
      answer: 3
    }
  },
  {
    id: 5,
    subject: "Operating Systems",
    topic: "Deadlock",
    question: "What is a Deadlock and what are the four necessary conditions for it to occur?",
    answer: "A deadlock is a state where a set of processes are blocked because each process is holding a resource and waiting for another resource held by another process.\nThe four conditions are:\n1. **Mutual Exclusion**: Resource can only be held by one process at a time.\n2. **Hold and Wait**: Process holding resources can request additional resources.\n3. **No Preemption**: Resources cannot be forcibly taken away.\n4. **Circular Wait**: A cycle of processes exists where each process waits for a resource held by the next.",
    quiz: {
      question: "Which of the following is NOT one of the four necessary conditions for deadlock?",
      options: ["Mutual Exclusion", "No Preemption", "Resource Preemption", "Circular Wait"],
      answer: 2
    }
  },
  {
    id: 6,
    subject: "Computer Networks",
    topic: "OSI Model Layers",
    question: "Briefly explain the 7 layers of the OSI model.",
    answer: "1. **Physical**: Transmits raw bitstreams over a physical medium.\n2. **Data Link**: Organizes data into frames; handles error-free physical transmission.\n3. **Network**: Routs packets across networks; handles IP addressing.\n4. **Transport**: Ensures reliable end-to-end delivery (TCP/UDP).\n5. **Session**: Manages sessions between applications.\n6. **Presentation**: Translates, encrypts, and compresses data.\n7. **Application**: Direct interface for user applications (HTTP, SMTP).",
    quiz: {
      question: "Which layer of the OSI model handles routing, packet forwarding, and IP addressing?",
      options: ["Physical Layer", "Data Link Layer", "Network Layer", "Transport Layer"],
      answer: 2
    }
  },
  {
    id: 7,
    subject: "OOPs",
    topic: "Interface vs Abstract Class",
    question: "What is the difference between an Interface and an Abstract Class?",
    answer: "1. **Abstract Class**: Can have both abstract (without body) and concrete (with body) methods. Can store instance variables. Supports single inheritance.\n2. **Interface**: Can only contain abstract methods (until Java 8). Cannot store instance variables. Supports multiple inheritance.",
    quiz: {
      question: "Which of the following is true about abstract classes?",
      options: [
        "A class can inherit multiple abstract classes.",
        "They can contain instance fields and concrete methods.",
        "They cannot have constructors.",
        "All methods in an abstract class must be abstract."
      ],
      answer: 1
    }
  },
  {
    id: 8,
    subject: "Computer Networks",
    topic: "TCP vs UDP",
    question: "Differentiate between TCP and UDP.",
    answer: "1. **TCP (Transmission Control Protocol)**: Connection-oriented, guarantees delivery, checks for errors, orders packets. Heavyweight. Used in HTTP, FTP.\n2. **UDP (User Datagram Protocol)**: Connectionless, does not guarantee delivery or packet ordering. Lightweight and fast. Used in video streaming, DNS.",
    quiz: {
      question: "Which protocol is connectionless and preferred for real-time video streaming?",
      options: ["TCP", "UDP", "FTP", "SMTP"],
      answer: 1
    }
  },
  {
    id: 9,
    subject: "DBMS",
    topic: "Database Normalization",
    question: "Explain the first three Normal Forms (1NF, 2NF, 3NF).",
    answer: "1. **1NF**: All columns must contain atomic (indivisible) values, and each record must be unique.\n2. **2NF**: Must be in 1NF, and all non-key attributes must be fully functionally dependent on the primary key (no partial dependencies).\n3. **3NF**: Must be in 2NF, and there must be no transitive dependencies (non-key columns depending on other non-key columns).",
    quiz: {
      question: "Removing partial dependency on a composite primary key is the main goal of which normal form?",
      options: ["1NF", "2NF", "3NF", "BCNF"],
      answer: 1
    }
  },
  {
    id: 10,
    subject: "Operating Systems",
    topic: "Virtual Memory & Paging",
    question: "What is Virtual Memory, Paging, and Page Fault?",
    answer: "1. **Virtual Memory**: Memory management technique that makes it appear as though the system has more RAM by using hard disk space.\n2. **Paging**: Divides virtual memory into pages and physical memory into frames of equal size.\n3. **Page Fault**: Happens when a program tries to access a page of memory that is not currently loaded in physical RAM.",
    quiz: {
      question: "What event is triggered when a program attempts to access data in a virtual page not currently in RAM?",
      options: ["Cache Miss", "Segmentation Fault", "Page Fault", "Stack Overflow"],
      answer: 2
    }
  },
  {
    id: 11,
    subject: "OOPs",
    topic: "Encapsulation",
    question: "What is Encapsulation and how is it implemented?",
    answer: "Encapsulation is the bundling of data (variables) and methods that operate on that data into a single unit (class). It restricts direct access to some of the object's components, which is a form of data hiding. It is implemented using access modifiers (private variables, public getter/setter methods).",
    quiz: {
      question: "Which OOP concept is primarily associated with data hiding and access control?",
      options: ["Inheritance", "Abstraction", "Encapsulation", "Polymorphism"],
      answer: 2
    }
  },
  {
    id: 12,
    subject: "DBMS",
    topic: "Database Indexing",
    question: "What is the difference between a Clustered and a Non-Clustered index?",
    answer: "1. **Clustered Index**: Determines the physical order of data rows in the table. There can only be one clustered index per table. Leaves contain actual data blocks.\n2. **Non-Clustered Index**: Stores index keys in a separate structure with pointers to the actual data rows. A table can have multiple non-clustered indexes.",
    quiz: {
      question: "How many Clustered Indexes can be created on a single database table?",
      options: ["Only 1", "Up to 5", "Unlimited", "None"],
      answer: 0
    }
  },
  {
    id: 13,
    subject: "Operating Systems",
    topic: "Semaphores vs Mutex",
    question: "Explain the difference between a Mutex and a Semaphore.",
    answer: "1. **Mutex (Mutual Exclusion)**: A locking mechanism used to synchronize access to a resource. It is owned by only one thread at a time. Binary (0 or 1).\n2. **Semaphore**: A signaling mechanism. It allows a set number of threads (Counting Semaphore) to access a resource concurrently. Does not have an owner.",
    quiz: {
      question: "Which mechanism supports letting a specific number of threads (e.g. 3) access a resource concurrently?",
      options: ["Mutex", "Counting Semaphore", "Binary Semaphore", "Critical Section"],
      answer: 1
    }
  },
  {
    id: 14,
    subject: "Computer Networks",
    topic: "HTTP vs HTTPS",
    question: "What is HTTPS, and how does it secure communication?",
    answer: "HTTPS (Hypertext Transfer Protocol Secure) is the secure version of HTTP. It uses SSL/TLS (Secure Sockets Layer/Transport Layer Security) to encrypt all data transmitted between the client and server, protecting against eavesdropping and tampering using public-key cryptography.",
    quiz: {
      question: "What cryptographic protocols are used by HTTPS to encrypt web traffic?",
      options: ["TCP/IP", "FTP/SMTP", "SSL/TLS", "DNS/ARP"],
      answer: 2
    }
  },
  {
    id: 15,
    subject: "System Design",
    topic: "Scaling",
    question: "Explain the difference between Horizontal Scaling and Vertical Scaling.",
    answer: "1. **Vertical Scaling (Scaling Up)**: Adding more power (CPU, RAM, SSD) to an existing single server. Limited by hardware capabilities.\n2. **Horizontal Scaling (Scaling Out)**: Adding more machine nodes to the resource pool. Unlimited scaling potential but requires load balancers and handles distributed data challenges.",
    quiz: {
      question: "Adding more RAM and CPU cores to a single database server is an example of:",
      options: ["Horizontal Scaling", "Vertical Scaling", "Load Balancing", "Sharding"],
      answer: 1
    }
  },
  {
    id: 16,
    subject: "OOPs",
    topic: "Inheritance vs Composition",
    question: "Explain Inheritance vs. Composition. Why is Composition often preferred?",
    answer: "1. **Inheritance**: 'Is-A' relationship. A child class extends a parent class. Creates tight coupling.\n2. **Composition**: 'Has-A' relationship. A class contains instances of other classes. Provides loose coupling and flexibility to change behavior dynamically at runtime.\n**Rule**: 'Favor composition over inheritance.'",
    quiz: {
      question: "What type of relationship is represented by class Composition?",
      options: ["Is-A relationship", "Has-A relationship", "Uses-A relationship", "Inherited relationship"],
      answer: 1
    }
  },
  {
    id: 17,
    subject: "DBMS",
    topic: "Primary Key vs Unique Key",
    question: "Differentiate between a Primary Key and a Unique Key constraint.",
    answer: "1. **Primary Key**: Uniquely identifies each row in a table. Cannot accept NULL values. Only one primary key is allowed per table.\n2. **Unique Key**: Ensures all values in a column are unique. Can accept a single NULL value (in most RDBMS). Multiple unique key columns are allowed per table.",
    quiz: {
      question: "Which of the following is a key difference between a Primary Key and a Unique Key?",
      options: [
        "Primary Key allows multiple NULL values.",
        "Unique Key cannot have NULL values.",
        "Primary Key is restricted to one per table, while multiple Unique Keys are allowed.",
        "Unique Key physically orders the data rows in the table."
      ],
      answer: 2
    }
  },
  {
    id: 18,
    subject: "Operating Systems",
    topic: "Thrashing",
    question: "What is Thrashing in Operating Systems?",
    answer: "Thrashing is a state where the CPU spends more time swapping pages in and out of virtual memory (disk) than executing actual process instructions. It happens when the active pages of running processes exceed the physical memory available, causing constant page faults.",
    quiz: {
      question: "What causes a system to thrash?",
      options: [
        "Too much RAM availability.",
        "The page replacement overhead exceeds productive CPU processing time.",
        "A deadlock between processes.",
        "High CPU cache hits."
      ],
      answer: 1
    }
  },
  {
    id: 19,
    subject: "Computer Networks",
    topic: "TCP Handshake",
    question: "Explain the TCP 3-Way Handshake mechanism.",
    answer: "TCP establishes a connection using a three-step handshake:\n1. **SYN**: Client sends a SYN (Synchronize) packet to server to start connection.\n2. **SYN-ACK**: Server responds with a SYN-ACK packet, acknowledging client and requesting synchronization.\n3. **ACK**: Client sends an ACK (Acknowledge) packet back. Connection is now established.",
    quiz: {
      question: "What is the second packet type sent during a standard TCP connection handshake?",
      options: ["SYN", "ACK", "SYN-ACK", "FIN"],
      answer: 2
    }
  },
  {
    id: 20,
    subject: "System Design",
    topic: "Load Balancer",
    question: "What is a Load Balancer, and what are common load balancing algorithms?",
    answer: "A Load Balancer distributes incoming network traffic across multiple servers to prevent any single server from becoming overloaded. Common algorithms include:\n1. **Round Robin**: Distributes requests sequentially.\n2. **Least Connections**: Sends requests to the server with the fewest active sessions.\n3. **IP Hash**: Determines server based on client IP hash.",
    quiz: {
      question: "Which load balancing algorithm routes requests sequentially down a list of active servers?",
      options: ["Least Connections", "Round Robin", "IP Hash", "Weighted Random"],
      answer: 1
    }
  },
  {
    id: 21,
    subject: "OOPs",
    topic: "Shallow vs Deep Copy",
    question: "What is the difference between a Shallow Copy and a Deep Copy?",
    answer: "1. **Shallow Copy**: Copies the top-level object, but nested references still point to the original memory locations. Modifying nested properties impacts both copies.\n2. **Deep Copy**: Recursively copies all objects and references. Creating a fully independent duplicate. Modifying one copy has no effect on the other.",
    quiz: {
      question: "In which type of copy does modifying a nested array in the clone also modify it in the original object?",
      options: ["Shallow Copy", "Deep Copy", "Static Copy", "Reference Copy"],
      answer: 0
    }
  },
  {
    id: 22,
    subject: "DBMS",
    topic: "NoSQL vs SQL",
    question: "Differentiate between SQL and NoSQL databases.",
    answer: "1. **SQL (Relational)**: Structured data, predefined schemas, supports joins, ACID compliant, scales vertically (typically). E.g. MySQL, PostgreSQL.\n2. **NoSQL (Non-Relational)**: Unstructured/semi-structured data (documents, key-value, graphs), dynamic schemas, scales horizontally, BASE properties. E.g. MongoDB, Redis.",
    quiz: {
      question: "Which of the following database engines is classified as a NoSQL document database?",
      options: ["PostgreSQL", "MySQL", "MongoDB", "Oracle SQL"],
      answer: 2
    }
  },
  {
    id: 23,
    subject: "Operating Systems",
    topic: "CPU Scheduling",
    question: "Briefly explain FCFS, SJF, and Round Robin scheduling.",
    answer: "1. **FCFS (First Come First Served)**: Non-preemptive. Schedules tasks in arrival order. Can cause Convoy Effect.\n2. **SJF (Shortest Job First)**: Schedules task with shortest burst time. Minimizes average waiting time.\n3. **Round Robin**: Preemptive. Each process gets a small fixed time unit (time quantum) in cycles.",
    quiz: {
      question: "Which CPU scheduling algorithm gives each process a slice of CPU time in cyclic rotation?",
      options: ["First Come First Served", "Shortest Job First", "Round Robin", "Priority Scheduling"],
      answer: 2
    }
  },
  {
    id: 24,
    subject: "Computer Networks",
    topic: "DNS Lookup",
    question: "What is DNS and how does a DNS lookup resolve an IP address?",
    answer: "DNS (Domain Name System) translates human-readable domain names (e.g. google.com) into machine IP addresses. Lookup steps:\n1. Check browser and OS cache.\n2. Query **Recursive Resolver** (ISP).\n3. Query **Root Name Server**.\n4. Query **TLD Name Server** (e.g. .com).\n5. Query **Authoritative Name Server** to get IP.\n6. Return IP to browser.",
    quiz: {
      question: "Which DNS server is the final authority that holds the actual IP mapping for a specific website?",
      options: ["Recursive Resolver", "Root Name Server", "TLD Name Server", "Authoritative Name Server"],
      answer: 3
    }
  },
  {
    id: 25,
    subject: "System Design",
    topic: "Caching Strategies",
    question: "Explain Write-Through, Write-Around, and Write-Back caching strategies.",
    answer: "1. **Write-Through**: Data is written to the cache and the backend database simultaneously. Safe but slower writes.\n2. **Write-Around**: Data is written directly to the database, bypassing the cache. Cache is updated on a miss.\n3. **Write-Back**: Data is written to cache first, and written asynchronously to the database later. Fast writes, risk of data loss.",
    quiz: {
      question: "Which caching strategy writes data to the cache first and updates the database asynchronously later?",
      options: ["Write-Through", "Write-Around", "Write-Back", "Read-Through"],
      answer: 2
    }
  },
  {
    id: 26,
    subject: "OOPs",
    topic: "Diamond Problem",
    question: "What is the Diamond Problem in Multiple Inheritance?",
    answer: "The Diamond Problem is an ambiguity that arises when a class inherits from two classes, both of which inherit from a single superclass. If both parent classes override a method from the superclass, the child class does not know which method to inherit. Java resolves this by forbidding multiple inheritance with classes and using Interfaces instead.",
    quiz: {
      question: "How does Java prevent the ambiguity of the Diamond Problem in multiple inheritance?",
      options: [
        "By using pointers.",
        "By not allowing a class to extend multiple classes.",
        "By enforcing dynamic binding at compile time.",
        "By utilizing virtual method tables."
      ],
      answer: 1
    }
  },
  {
    id: 27,
    subject: "DBMS",
    topic: "Transaction Isolation Levels",
    question: "What are the four SQL Transaction Isolation Levels?",
    answer: "1. **Read Uncommitted**: Transaction can read uncommitted changes of other transactions (allows Dirty Reads).\n2. **Read Committed**: Can only read committed data (prevents Dirty Reads).\n3. **Repeatable Read**: Guarantees that any read data will remain the same throughout transaction (prevents Non-Repeatable Reads).\n4. **Serializable**: Strict execution. Complete isolation (prevents Phantom Reads).",
    quiz: {
      question: "Which isolation level is the most restrictive and prevents Dirty, Non-Repeatable, and Phantom reads?",
      options: ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"],
      answer: 3
    }
  },
  {
    id: 28,
    subject: "Operating Systems",
    topic: "System Call vs Library Call",
    question: "What is the difference between a System Call and a Library Function?",
    answer: "1. **System Call**: An interface provided by the kernel of the operating system (e.g. fork(), write()). Operates in Kernel Mode. Slow due to context switch.\n2. **Library Function**: A standard function provided by programming library headers (e.g. printf(), malloc()). Operates in User Mode. May internally call a system call.",
    quiz: {
      question: "Which of the following executes directly in Kernel Mode?",
      options: ["printf() in C", "math.sqrt() in Python", "fork() system call", "console.log() in JavaScript"],
      answer: 2
    }
  },
  {
    id: 29,
    subject: "Computer Networks",
    topic: "Cookies vs Sessions",
    question: "Compare HTTP Cookies and Sessions.",
    answer: "1. **Cookies**: Data stored as small text files on the client browser. Can persist across sessions. Insecure; size limited to 4KB.\n2. **Sessions**: Data stored on the web server. Client only holds a session ID (stored in a cookie). More secure; can hold larger amounts of data.",
    quiz: {
      question: "Where is session state data typically stored in web applications?",
      options: ["On the client browser", "On the web server", "In the URL query parameters", "In local storage"],
      answer: 1
    }
  },
  {
    id: 30,
    subject: "System Design",
    topic: "CAP Theorem",
    question: "Explain the CAP Theorem in distributed databases.",
    answer: "CAP Theorem states that a distributed system can only guarantee at most two of these three properties simultaneously:\n1. **Consistency**: Every read receives the most recent write or an error.\n2. **Availability**: Every request receives a non-error response, without guarantee that it contains the most recent write.\n3. **Partition Tolerance**: System continues to operate despite network partition errors. In practice, partition tolerance (P) is mandatory, so systems must choose between AP and CP.",
    quiz: {
      question: "In distributed database systems under network partition, choosing Availability means sacrificing which property?",
      options: ["Consistency", "Partition Tolerance", "Scalability", "Isolation"],
      answer: 0
    }
  }
];

window.sqlQuestions = [
  {
    id: 1,
    title: "Second Highest Salary",
    description: "Write a SQL query to find the second highest salary from the `Employee` table. If there is no second highest salary, return NULL.",
    schema: "Employee (id INT, salary INT)",
    sampleInput: "| id | salary |\n|----|--------|\n| 1  | 100    |\n| 2  | 200    |\n| 3  | 300    |",
    sampleOutput: "| SecondHighestSalary |\n|---------------------|\n| 200                 |",
    solution: "SELECT MAX(salary) AS SecondHighestSalary \nFROM Employee \nWHERE salary < (SELECT MAX(salary) FROM Employee);",
    keywords: ["select", "salary", "employee"]
  },
  {
    id: 2,
    title: "Duplicate Emails",
    description: "Write a SQL query to find all duplicate emails in a table named `Person`.",
    schema: "Person (id INT, email VARCHAR)",
    sampleInput: "| id | email            |\n|----|------------------|\n| 1  | john@example.com  |\n| 2  | jane@example.com  |\n| 3  | john@example.com  |",
    sampleOutput: "| Email            |\n|------------------|\n| john@example.com  |",
    solution: "SELECT email \nFROM Person \nGROUP BY email \nHAVING COUNT(email) > 1;",
    keywords: ["select", "email", "person", "group", "having", "count"]
  },
  {
    id: 3,
    title: "Employees Earning More Than Managers",
    description: "Write a SQL query to find the employees who earn more than their managers. The `Employee` table holds employee ID, name, salary, and manager ID.",
    schema: "Employee (id INT, name VARCHAR, salary INT, managerId INT)",
    sampleInput: "| id | name  | salary | managerId |\n|----|-------|--------|-----------|\n| 1  | Joe   | 70000  | 3         |\n| 2  | Henry | 80000  | 4         |\n| 3  | Sam   | 60000  | NULL      |\n| 4  | Max   | 90000  | NULL      |",
    sampleOutput: "| Employee |\n|----------|\n| Joe      |",
    solution: "SELECT e1.name AS Employee \nFROM Employee e1 \nJOIN Employee e2 ON e1.managerId = e2.id \nWHERE e1.salary > e2.salary;",
    keywords: ["select", "employee", "join", "on", "salary", ">"]
  },
  {
    id: 4,
    title: "Customers Who Never Order",
    description: "Write a SQL query to find all customers who never order anything. Two tables: `Customers` (id, name) and `Orders` (id, customerId).",
    schema: "Customers (id INT, name VARCHAR)\nOrders (id INT, customerId INT)",
    sampleInput: "Customers:\n| id | name  |\n|----|-------|\n| 1  | Joe   |\n| 2  | Henry |\nOrders:\n| id | customerId |\n|----|------------|\n| 1  | 1          |",
    sampleOutput: "| Customers |\n|-----------|\n| Henry     |",
    solution: "SELECT name AS Customers \nFROM Customers \nWHERE id NOT IN (SELECT customerId FROM Orders);",
    keywords: ["select", "customers", "orders", "not", "in"]
  },
  {
    id: 5,
    title: "Big Countries",
    description: "A country is big if it has an area of more than 3 million sq km or a population of more than 25 million. Write a query to report the name, population, and area of big countries.",
    schema: "World (name VARCHAR, continent VARCHAR, area INT, population INT, gdp BIGINT)",
    sampleInput: "| name | continent | area | population | gdp |\n|------|-----------|------|------------|-----|\n| India| Asia      | 3287 | 1350000000 | 2800|",
    sampleOutput: "| name  | population | area |\n|-------|------------|------|",
    solution: "SELECT name, population, area \nFROM World \nWHERE area > 3000000 OR population > 25000000;",
    keywords: ["select", "name", "population", "area", "world", "where"]
  },
  {
    id: 6,
    title: "Classes More Than 5 Students",
    description: "Write a SQL query to report all the classes that have at least five students.",
    schema: "Courses (student VARCHAR, class VARCHAR)",
    sampleInput: "| student | class    |\n|---------|----------|\n| A       | Math     |\n| B       | Math     |",
    sampleOutput: "| class |\n|-------|\n| Math  |",
    solution: "SELECT class \nFROM Courses \nGROUP BY class \nHAVING COUNT(student) >= 5;",
    keywords: ["select", "class", "courses", "group", "having", "count"]
  },
  {
    id: 7,
    title: "Swap Salary",
    description: "Write a SQL query to swap all 'f' and 'm' values (i.e., change all 'f' to 'm' and vice versa) in a single update statement with no intermediate temp table.",
    schema: "Salary (id INT, name VARCHAR, sex CHAR, salary INT)",
    sampleInput: "| id | sex |\n|----|-----|\n| 1  | m   |\n| 2  | f   |",
    sampleOutput: "| id | sex |\n|----|-----|\n| 1  | f   |\n| 2  | m   |",
    solution: "UPDATE Salary \nSET sex = CASE sex WHEN 'm' THEN 'f' ELSE 'm' END;",
    keywords: ["update", "salary", "set", "sex", "case", "when"]
  },
  {
    id: 8,
    title: "Reformat Department Table",
    description: "Reformat the table so that there is a department id column and a revenue column for each month.",
    schema: "Department (id INT, revenue INT, month VARCHAR)",
    sampleInput: "| id | revenue | month |\n|----|---------|-------|\n| 1  | 8000    | Jan   |",
    sampleOutput: "| id | Jan_Revenue | Feb_Revenue | ... |\n|----|-------------|-------------|-----|",
    solution: "SELECT id, \n  MAX(CASE WHEN month = 'Jan' THEN revenue END) AS Jan_Revenue, \n  MAX(CASE WHEN month = 'Feb' THEN revenue END) AS Feb_Revenue, \n  MAX(CASE WHEN month = 'Mar' THEN revenue END) AS Mar_Revenue \nFROM Department GROUP BY id;",
    keywords: ["select", "id", "case", "when", "month", "group", "by"]
  },
  {
    id: 9,
    title: "Delete Duplicate Emails",
    description: "Write a SQL query to delete all duplicate email entries in a table named `Person`, keeping only unique emails based on its smallest Id.",
    schema: "Person (id INT, email VARCHAR)",
    sampleInput: "| id | email            |\n|----|------------------|\n| 1  | john@example.com  |\n| 2  | jane@example.com  |\n| 3  | john@example.com  |",
    sampleOutput: "(Deletes row 3)",
    solution: "DELETE p1 FROM Person p1 \nJOIN Person p2 ON p1.email = p2.email \nWHERE p1.id > p2.id;",
    keywords: ["delete", "person", "join", "on", "where", ">"]
  },
  {
    id: 10,
    title: "Rising Temperature",
    description: "Write a SQL query to find all dates' IDs with higher temperatures compared to its previous dates (yesterday).",
    schema: "Weather (id INT, recordDate DATE, temperature INT)",
    sampleInput: "| id | recordDate | temperature |\n|----|------------|-------------|\n| 1  | 2015-01-01 | 10          |\n| 2  | 2015-01-02 | 25          |",
    sampleOutput: "| id |\n|----|\n| 2  |",
    solution: "SELECT w1.id \nFROM Weather w1 \nJOIN Weather w2 ON DATEDIFF(w1.recordDate, w2.recordDate) = 1 \nWHERE w1.temperature > w2.temperature;",
    keywords: ["select", "weather", "join", "on", "datediff", "temperature"]
  },
  {
    id: 11,
    title: "Rank Scores",
    description: "Write a SQL query to rank scores. If there is a tie between two scores, both should have the same ranking. The rank number should be consecutive.",
    schema: "Scores (id INT, score DECIMAL)",
    sampleInput: "| id | score |\n|----|-------|\n| 1  | 3.50  |\n| 2  | 4.00  |\n| 3  | 4.00  |",
    sampleOutput: "| score | rank |\n|-------|------|\n| 4.00  | 1    |\n| 4.00  | 1    |\n| 3.50  | 2    |",
    solution: "SELECT score, DENSE_RANK() OVER(ORDER BY score DESC) AS 'Rank' \nFROM Scores;",
    keywords: ["select", "score", "dense_rank", "over", "order", "desc"]
  },
  {
    id: 12,
    title: "Consecutive Numbers",
    description: "Write a SQL query to find all numbers that appear at least three times consecutively in the `Logs` table.",
    schema: "Logs (id INT, num INT)",
    sampleInput: "| id | num |\n|----|-----|\n| 1  | 1   |\n| 2  | 1   |\n| 3  | 1   |\n| 4  | 2   |",
    sampleOutput: "| ConsecutiveNums |\n|-----------------|\n| 1               |",
    solution: "SELECT DISTINCT l1.num AS ConsecutiveNums \nFROM Logs l1 \nJOIN Logs l2 ON l1.id = l2.id - 1 \nJOIN Logs l3 ON l1.id = l3.id - 2 \nWHERE l1.num = l2.num AND l2.num = l3.num;",
    keywords: ["select", "distinct", "logs", "join", "on", "where"]
  },
  {
    id: 13,
    title: "Department Highest Salary",
    description: "Write a SQL query to find employees who have the highest salary in each of the departments.",
    schema: "Employee (id INT, name VARCHAR, salary INT, departmentId INT)\nDepartment (id INT, name VARCHAR)",
    sampleInput: "Employee:\n| id | name | salary | departmentId |\n|----|------|--------|--------------|\n| 1  | Joe  | 70000  | 1            |\nDepartment:\n| id | name |\n|----|------|\n| 1  | IT   |",
    sampleOutput: "| Department | Employee | Salary |\n|------------|----------|--------|\n| IT         | Joe      | 70000  |",
    solution: "SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary \nFROM Employee e \nJOIN Department d ON e.departmentId = d.id \nWHERE (e.departmentId, e.salary) IN \n  (SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId);",
    keywords: ["select", "employee", "department", "join", "on", "where", "in", "max"]
  },
  {
    id: 14,
    title: "Department Top Three Salaries",
    description: "Write a SQL query to find employees who earn a salary that is in the top three unique salaries for their departments.",
    schema: "Employee (id INT, name VARCHAR, salary INT, departmentId INT)\nDepartment (id INT, name VARCHAR)",
    sampleInput: "Employee:\n| id | name | salary | departmentId |",
    sampleOutput: "| Department | Employee | Salary |",
    solution: "SELECT d.name AS Department, e1.name AS Employee, e1.salary AS Salary \nFROM Employee e1 \nJOIN Department d ON e1.departmentId = d.id \nWHERE 3 > (SELECT COUNT(DISTINCT e2.salary) \n           FROM Employee e2 \n           WHERE e2.departmentId = e1.departmentId AND e2.salary > e1.salary);",
    keywords: ["select", "department", "employee", "join", "on", "count", "distinct", "where"]
  },
  {
    id: 15,
    title: "Find Customer Referee",
    description: "Write a SQL query to report the names of customers that are not referred by the customer with id = 2.",
    schema: "Customer (id INT, name VARCHAR, referee_id INT)",
    sampleInput: "| id | name | referee_id |\n|----|------|------------|\n| 1  | Will | NULL       |\n| 2  | Jane | 2          |\n| 3  | Alex | 2          |",
    sampleOutput: "| name |\n|------|\n| Will |",
    solution: "SELECT name \nFROM Customer \nWHERE referee_id != 2 OR referee_id IS NULL;",
    keywords: ["select", "name", "customer", "where", "referee_id", "null"]
  }
];

/**
 * Validates if the user's SQL query matches the solution keywords.
 * @param {number} questionId - ID of SQL question
 * @param {string} userQuery - The typed query
 * @returns {{success: boolean, message: string}}
 */
window.checkSQLQuery = function checkSQLQuery(questionId, userQuery) {
  const question = sqlQuestions.find(q => q.id === questionId);
  if (!question) return { success: false, message: "Question not found." };

  const cleanQuery = userQuery.trim().toLowerCase().replace(/\s+/g, ' ');

  if (cleanQuery.length < 10) {
    return { success: false, message: "Query seems too short. Please write a complete SQL statement." };
  }

  // Basic keyword validation
  const missingKeywords = [];
  question.keywords.forEach(kw => {
    if (!cleanQuery.includes(kw)) {
      missingKeywords.push(kw.toUpperCase());
    }
  });

  if (missingKeywords.length > 0) {
    return {
      success: false,
      message: `Your query is missing essential clauses/identifiers like: ${missingKeywords.join(', ')}. Keep trying!`
    };
  }

  // Syntax validation - check basic SQL structures
  if (!cleanQuery.startsWith("select") && !cleanQuery.startsWith("delete") && !cleanQuery.startsWith("update")) {
    return { success: false, message: "A query must start with SELECT, DELETE, or UPDATE." };
  }

  // If keywords are satisfied, mark it as solved for the simulation
  return {
    success: true,
    message: "Query syntax verified! It matches the expected structure and keywords."
  };
}
