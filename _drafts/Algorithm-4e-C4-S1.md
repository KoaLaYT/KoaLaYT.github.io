# Chapter 4 / Section 1 : Undirected Graphs

## Main Content

### 1. Glossary

|      Terms      |                          Definition                          |
| :-------------: | :----------------------------------------------------------: |
|      graph      | A graph is a set of *vertices* and a collection of *edges* that each connect a pair of vertices |
|    self-loop    |   A self-loop is an edge that connects a vertex to itself    |
|    parallel     | Two edges that connect the same pair of vertices are parallel |
|      path       | A path in a graph is a sequence of vertices connected by edges |
|   simple path   |        A simple path is one with no repeated vertices        |
|      cycle      | A cycle is a path with at least one edge whose first and last vertices are the same |
|  simple cycle   | A simple cycle is a cycle with no repeated edges or vertices |
|     length      |    The length of a path or a cycle is its number of edges    |
|    connected    | A graph is connected if there is a path from every vertex to every other vertex in the graph. A graph that is not connected consists of a set of connected components, which are maximal connected subgraphs |
|     acyclic     |          An acyclic graph is a graph with no cycles          |
|      tree       |             A tree is an acyclic connected graph             |
|     forest      |          A disjoint set of trees is called a forest          |
|  spanning tree  | A spanning tree of a connected graph is a subgraph that contains all of that graph's vertices and is a single tree |
| spanning forest | A spanning forest of a graph is the union of spanning trees of its connected components |
|     density     | The density of a graph is the proportion of possible pairs of vertices that are connected by edges |
| bipartite graph | A bipartite graph is a graph whose vertices we can divide into two sets such that all edges connect a vertex in one set with a vertex in the other set. |

Here is the anatomy of a graph : (image from text book)

![Graph Anatomy](../img/GraphAnatomy.png)

### 2. Undirected graph data type

This is the API that defines the fundamental graph operations : (image from text book)

![GraphAPI](../img/GraphAPI.png)

This figure shows the principle of our implementation : (image from text book)

![Adjacency-list representation](../img/AdjacencyList.png)

Our implementation is using adjacency-lists data structure which can achieves the following performance characteristics :

- space usage proportional to V+E
- constant time to add an edge
- time proportional to the degree of v to iterate through vertices adjacent to v

```java
public class Graph
{
	private Bag<Integer>[] adj;
	private int V;
	private int E;
	
	public Graph(int V)
	{
		this.V = V;
		adj = (Bag<Integer>[]) new Bag[V];
		for (int i = 0; i < V; i++)
			adj[i] = new Bag<Integer>();
	}
	
	public Graph(In in)
	{
		this(in.readInt())
		int E = in.readInt();
		for (int i = 0; i < E; i++)
		{
			int v = in.readInt();
			int w = in.readInt();
			addEdge(v, w);
		}
	}
	
	public int V()
	{ return V; }
	
	public int E()
	{ return E; }
	
	public void addEdge(int v, int w)
	{
		adj[v].add(w);
		adj[w].add(v);
		E++;
	}
	
	public Iterable<Integer> adj(int v)
	{ return adj[v]; }
}
```

There are many different implementations of `Graph`, here is their performance comparison : (image from text book)

![Graph implementation comparison](../img/ComparisonOfGraphImplementation.png)

The first graph processing problem is to find the vertices in the graph that are connected to the source, as the following API defined : (image from text book)

![Warm up graph processing API](../img/WarmUpGraphProcessingAPI.png)

### 3. Depth-first search

This method searching a graph by :

1. Mark a vertex as having been visited
2. Visit (recursively) all the vertices that are adjacent to it and that have not yet been marked

```java
public class DepthFirstSearch
{
    private boolean[] marked;
    private int N;
    
    public DepthFirstSearch(Graph G, int s)
    {
        int V = G.V();
        marked = new boolean[V];
        dfs(G, s);
    }
    
    private void dfs(Graph G, int v)
    {
        marked[v] = true;
        N++;
        for (Integer w : G.adj(v))
            if (!marked[w])
                dfs(G, w);
    }
    
    public boolean marked(int v)
    { return marked[v]; }
    
    public int count()
    { return N; }
}
```

This is the detailed trace of depth-first search method to find vertices connected to 0 : (image from text book)

![Trace of dfs to find vertices connected to 0](../img/TraceOfDFS.png)

**Depth-first search analysis** :

> DFS marks all the vertices connected to a given source in time proportional to the sum of their degrees.

We can use this method to solve the *Single-source paths* problem, first, we define the following API : (image from text book)

![Paths API](../img/PathsAPI.png)

```java
public class DepthFirstPaths
{
    private boolean[] marked;
    private int[] edgeTo;
    private final int s;
    
    public DepthFirstPaths(Graph G, int s)
    {
        this.s = s;
        marked = new boolean[G.V()];
        edgeTo = new int[G.V()];
        dfs(G, s);
    }
    
    private void dfs(Graph G, int v)
    {
        marked[v] = true;
        for (Integer w : G.adj(v))
            if (!marked[w])
            {
                edgeTo[w] = v;
                dfs(G, w);
            }
    }
    
    public boolean hasPathTo(int v)
    { return marked[v]; }
    
    public Iterable<Integer> pathTo(int v)
    {
        if (!hasPathTo(v)) return null;
        Stack<Integer> paths = new Stack<>();
        for (int w = v; w != s; w = edgeTo[w])
            paths.push(w);
        paths.push(s);
        return paths;
    }
}
```

This is the trace of depth-first search to find paths from 0 : (image from text book)

![Trace of depth-first search to find paths](../img/TraceOfDFSPaths.png)

**Depth-first paths analysis** :

> DFS allows us to provide clients with a path from a given source to any marked vertex in time proportional its length.

### 4. Breadth-first seach

If we want to solve the *single-source shortest paths* problem, DFS may not be helpful. A method call breadth-first search need to be introduced, it solving the problem by following steps :

1. Take the next vertex v from the queue and mark it
2. Put onto the queue all unmarked vertices that are adjacent to v

```java
public class BreadthFirstPaths
{
    private boolean[] marked;
    private int[] edgeTo;
    private final int s;
    
    public BreadthFirstPaths(Graph G, int s)
    {
        this.s = s;
        marked = new boolean[G.V()];
        edgeTo = new int[G.V()];
        Queue<Integer> q = new Queue<>();
        marked[s] = true;
        q.enqueue(s);
        
        while (!q.isEmpty())
        {
            int v = q.dequeue();
            for (Integer w : G.adj(v))
                if (!marked[w])
                {
                    marked[w] = true;
                    edgeTo[w] = v;
                    q.enqueue(w);
                }
        }
    }
}
```

This is the trace of breadth-first search to find paths from 0 : (image from text book)

![Trace of BFS to find paths](../img/TraceOfBFSPaths.png)

**Breadth-first search analysis** :

> - For any vertex v reachable from s, BFS computes a shortest path from s to v.
> - BFS takes time proportional to V+E in the worst case.

Here is a comparison between DFS and BFS for searching paths : (image from text book)

![DFS and BFS Comparison](../img/DFSAndBFSComparison.png)

### 5. Connected components

Another common application of DFS is to find the connected components of a graph, we define the following API first : (image from text book)

![CC API](../img/CCAPI.png)

```java
public class CC
{
    private boolean[] marked;
    private int[] id;
    private int count;
    
    public CC(Graph G)
    {
        marked = new boolean[G.V()];
        id = new int[G.V()];
        count = 0;
        for (int v = 0; v < G.V(); v++)
            if (!marked[v])
            {
                dfs(G, v);
            	count++;
            }
    }
    
    private void dfs(Graph G, int v)
    {
        marked[v] = true;
        id[v] = count;
        for (Integer w : G.adj(v))
            if (!marked[w])
                dfs(G, w);
    }
    
    public boolean connected(int v, int w)
    { return id[v] == id[w]; }
    
    public int count()
    { return count; }
    
    public int id(int v)
    { return id[v]; }
}
```

The trace is as follow : (image from text book)

![Trace of cc](../img/TraceOfCC.png)

**Connected components analysis** :

> DFS uses preprocessing time and space proportional to V+E to support constant-time connectivity queries in a graph.

Another two problems that can be solved by DFS :

1. **Cycle detection** : Is a given graph acyclic

```java
public class Cycle
{
    private boolean[] marked;
    private boolean hasCycle;
    
    public Cycle(Graph G)
    {
        marked = new boolean[G.V()];
        for (int v = 0; v < G.V(); v++)
            if (!marked[v])
                dfs(g, v, v);
    }
    
    private void dfs(Graph G, int v, int u)
    {
        marked[v] = true;
        for (Integer w : G.adj(v))
        {
            if (!marked[w])
                dfs(g, w, v);
            else if (w != u)
                hasCycle = true;
        }
    }
    
    public boolean hasCycle()
    { return hasCycle; }
}
```

1. **Two-colorability** : Can the vertices of a given graph be assigned one of two colors in such a way that no edge connects vertices of the same color? (Is the graph bipartite?)

```java
public class TwoColor
{
    private boolean[] marked;
    private boolean[] color;
    private boolean isBipartite;
    
    public TwoColor(Graph G)
    {
        marked = new boolean[G.V()];
        color = new boolean[G.V()];
        isBipartite = true;
        for (int v = 0; v < G.V(); v++)
            if (!marked[v])
                dfs(G, v);
    }
    
    private void dfs(Graph G, int v)
    {
        marked[v] = true;
        for (Integer w : G.adj(v))
        {
            if (!marked[w])
            {
                color[w] = !color[v];
                dfs(G, w);
            }
            else if (color[w] == color[v])
                isBipartite = false;
        }
    }
    
    public boolean isBipartite()
    { return isBipartite; }
}
```

### 6. Symbol graphs

The following API defined a graph with symbolic vertex names : (image from text book)

![Symbol graphs API](../img/SGAPI.png)

```java
public class SymbolGraph
{
    private ST<String, Integer> st;
    private String[] keys;
    private Graph G;
    
    public SymbolGraph(String filename, String delim)
    {
        st = new ST<String, Integer>();
        In in = new In(filename);
        while (in.hasNextLine())
        {
            String[] s = in.readLine().split(delim);
            for (int i = 0; i < s.length; i++)
            	if (!st.contains(s[i]))
                	st.put(s[i], st.size());
        }
        keys = new String[st.size()];
        for (String s : st.keys())
            keys[st.get(s)] = s;
        
        G = new Graph(st.size());
        In in = new In(filename);
        while (in.hasNextLine())
        {
            String[] s = in.readLine().split(delim);
            for (int i = 1; i < s.length; i++)
            	G.addEdge(st.get(s[0]), st.get(s[i]));
        }
    }
    
    public boolean contains(String key)
    { return st.contains(key); }
    
    public int index(String key)
    { return st.get(key); }
    
    public String name(int v)
    { return keys[v]; }
    
    Graph G()
    { return G; }
}
```

## Exercise
### 4.1.4 
> Add a method hasEdge() to Graph which takes two int arguments v and w and returns true if the graph has an edge v-w , false otherwise.

The code is :
```java
public boolean hasEdge(int v, int w)
{
	for (Integer i : adj[v])
	{
		if (i == w)
			return true;
	}
	return false;
}
```

### 4.1.5
> Modify Graph to disallow parallel edges and self-loops.

Just add two checks into the function `addEdge` will do:
```java
public void addEdge(int a, int b)
{
	// forbid self-loops
	if (a == b)
		return;

	// forbid parallel edges
	for (Integer i : adj[a])
	{
		if (i == b)
			return;
	}

	adj[a].add(b);
	adj[b].add(a);
	E++;
}
```

### 4.1.13
> Add a distTo() method to the BreadthFirstPath API and implementation, which returns the number of edges on the shortest path from the source to a given vertex. A distTo() query should run in constant time.

I add an array `distTo[]` to record the depth of every vertex, here are my modified `bfp()` and new added `distTo()` methods: 
```java
private void bfp(Graph g, int s)
{
	Queue<Integer> q = new Queue<>();
	Queue<Integer> d = new Queue<>();
	marked[s] = true;
	distTo[s] = 0;
	q.enqueue(s);
	d.enqueue(1);

	while (!q.isEmpty())
	{
		int t = q.dequeue();
		int dp = d.dequeue();
		for (Integer i : g.adj(t))
		{
			if (!marked[i])
			{
				edgeTo[i] = t;
				marked[i] = true;
				distTo[i] = dp;
				d.enqueue(dp+1);
				q.enqueue(i);
			}
		}
	}
}

public int distTo(int v)
{
	return distTo[v];
}
```

### 4.1.15
> Modify the input stream constructor for Graph to also allow adjacency lists from standard input (in a manner similar to SymbolGraph ), as in the example tinyGadj.txt shown at right. After the number of vertices and edges, each line contains a vertex and its list of adjacent vertices.

Just similar as `Graph(In in)`, we can get following construtor:
```java
public MyGraph()
{
	this(Integer.parseInt(StdIn.readLine()));
	StdIn.readLine();
	while (StdIn.hasNextLine())
	{
		String[] s = StdIn.readLine().split(" ");
		int a = Integer.parseInt(s[0]);
		for (int i = 1; i < s.length; i++)
		{
			int b = Integer.parseInt(s[i]);
			addEdge(a, b);
		}
	}
}
```
And the result is just the same with the book:
```
$ java MyGraph
# std input
13
13
0 1 2 5 6
3 4 5
4 5 6
7 8
9 10 11 12
11 12
13 vertices, 13 edges
0: 6 5 2 1
1: 0
2: 0
3: 5 4
4: 6 5 3
5: 4 3 0
6: 4 0
7: 8
8: 7
9: 12 11 10
10: 9
11: 12 9
12: 11 9
```

### 4.1.16
> The eccentricity of a vertex v is the the length of the shortest path from that vertex to the furthest vertex from v . The diameter of a graph is the maximum eccentricity of any vertex. The radius of a graph is the smallest eccentricity of any vertex. A center is a vertex whose eccentricity is the radius. Implement the following API:

return type | method | discriptions
----------- | ------ | ------------
/ | GraphProperties(Graph G) | constructor (exception if G not connected)
int | eccentricity(int v) | eccentricity of v
int | diameter() | diameter of G
int | radius() | radius of G
int | center() | a center of G

This is my implementation of `Class GraphProperties`:
```java
import edu.princeton.cs.algs4.Graph;
import edu.princeton.cs.algs4.BreadthFirstPaths;
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.In;

public class GraphProperties
{
	private Graph g;

	public GraphProperties(Graph g)
	{
		this.g = g;
		BreadthFirstPaths bfp = new BreadthFirstPaths(g, 0);
		int count = 0;
		for (int v = 0; v < g.V(); v++)
			if (bfp.hasPathTo(v))
				count++;
		if (count != g.V())
			throw new IllegalArgumentException("Graph g is not connected");
	}

	public int eccentricity(int v)
	{
		BreadthFirstPaths bfp = new BreadthFirstPaths(g, v);

		int max = 0;
		for (int w = 0; w < g.V(); w++)
		{
			int count = 0;
			for (Integer i : bfp.pathTo(w))
				count++;
			if (--count > max)
				max = count;
		}
		return max;
	}

	public int diameter()
	{
		int max = 0;
		for (int v = 0; v < g.V(); v++)
		{
			int t = eccentricity(v);
			if (t > max)
				max = t;
		}
		return max;
	}

	public int radius()
	{
		int min = Integer.MAX_VALUE;
		for (int v = 0; v < g.V(); v++)
		{
			int t = eccentricity(v);
			if (t < min)
				min = t;
		}
		return min;
	}

	public int center()
	{
		int r = radius();
		for (int v = 0; v < g.V(); v++)
		{
			int t = eccentricity(v);
			if (t == r)
				return v;
		}
		return -1;
	}

	public String toString()
	{
		return g.toString();
	}

	public static void main(String[] args)
	{
		Graph g = new Graph(new In(args[0]));
		GraphProperties gp = new GraphProperties(g);

		int t = gp.center();
		BreadthFirstPaths bfp = new BreadthFirstPaths(g, t);
		for (int v = 0; v < g.V(); v++)
		{
			StdOut.print(t + ": ");
			for (Integer i : bfp.pathTo(v))
			{
				if (i == t)
					StdOut.print(t);
				else
					StdOut.print("-" + i);
			}
			StdOut.println();
		}
		StdOut.println("The eccentricity of " + t + " is: " + gp.eccentricity(t));
		StdOut.println("The diameter is: " + gp.diameter());
		StdOut.println("The radius is: " + gp.radius());
		StdOut.println("The center is: " + gp.center());
	}
}
```
And the test result is : 
```
$ java GraphProperties mediumG.txt 
7: 7-197-118-165-68-0
7: 7-188-62-128-69-107-1
7: 7-42-2
7: 7-188-62-239-55-67-3
7: 7-188-138-4
7: 7-188-138-4-5
7: 7-42-2-14-166-6
7: 7
7: 7-101-219-30-8
7: 7-197-118-142-9
7: 7-101-219-30-8-246-10
7: 7-101-219-30-11
7: 7-42-141-35-12
7: 7-101-214-51-133-13
7: 7-42-2-14
7: 7-65-208-168-204-15
7: 7-42-2-14-166-16
7: 7-42-141-35-41-17
7: 7-42-2-18
7: 7-101-214-70-19
7: 7-188-62-128-136-87-194-20
7: 7-230-21
7: 7-42-141-35-41-81-53-22
7: 7-197-118-165-68-23
7: 7-197-118-165-68-0-24
7: 7-188-62-128-136-87-111-25
7: 7-188-138-26
7: 7-230-27
7: 7-42-141-35-28
7: 7-42-141-35-41-81-227-29
7: 7-101-219-30
7: 7-188-62-239-55-67-3-241-31
7: 7-65-208-32
7: 7-197-118-142-9-33
7: 7-42-141-35-41-81-53-34
7: 7-42-141-35
7: 7-42-141-35-36
7: 7-188-62-239-55-67-3-37
7: 7-42-141-35-41-81-146-109-38
7: 7-65-208-168-44-80-39
7: 7-188-62-128-136-87-194-40
7: 7-42-141-35-41
7: 7-42
7: 7-101-219-43
7: 7-65-208-168-44
7: 7-188-138-26-217-45
7: 7-188-62-128-69-107-72-186-46
7: 7-42-141-35-41-81-146-47
7: 7-188-138-26-217-48
7: 7-197-118-165-191-49
7: 7-65-208-32-248-50
7: 7-101-214-51
7: 7-65-208-52
7: 7-42-141-35-41-81-53
7: 7-42-2-14-166-6-54
7: 7-188-62-239-55
7: 7-42-141-35-41-81-53-56
7: 7-57
7: 7-197-118-165-68-58
7: 7-65-208-32-248-59
7: 7-188-62-128-136-87-111-60
7: 7-188-62-239-112-234-61
7: 7-188-62
7: 7-188-62-128-136-87-111-25-63
7: 7-42-141-35-41-17-134-64
7: 7-65
7: 7-65-208-168-204-15-66
7: 7-188-62-239-55-67
7: 7-197-118-165-68
7: 7-188-62-128-69
7: 7-101-214-70
7: 7-71
7: 7-188-62-128-69-107-72
7: 7-42-141-35-41-81-53-73
7: 7-42-141-35-41-81-146-109-74
7: 7-188-62-128-136-87-194-75
7: 7-188-138-26-217-45-76
7: 7-188-138-77
7: 7-188-62-78
7: 7-101-214-79
7: 7-65-208-168-44-80
7: 7-42-141-35-41-81
7: 7-101-219-30-82
7: 7-188-138-26-217-83
7: 7-101-214-70-84
7: 7-101-219-30-8-85
7: 7-42-86
7: 7-188-62-128-136-87
7: 7-42-141-35-88
7: 7-188-62-239-112-234-61-89
7: 7-188-62-90
7: 7-42-141-35-41-17-134-91
7: 7-197-172-92
7: 7-188-138-226-93
7: 7-42-141-94
7: 7-188-138-26-217-45-95
7: 7-188-62-128-136-87-111-25-96
7: 7-65-208-168-97
7: 7-42-141-35-88-98
7: 7-42-2-14-129-99
7: 7-101-214-70-100
7: 7-101
7: 7-188-138-102
7: 7-101-214-70-19-103
7: 7-65-208-32-104
7: 7-101-219-30-143-105
7: 7-101-219-30-179-106
7: 7-188-62-128-69-107
7: 7-181-108
7: 7-42-141-35-41-81-146-109
7: 7-101-110
7: 7-188-62-128-136-87-111
7: 7-188-62-239-112
7: 7-188-62-90-113
7: 7-197-118-165-68-114
7: 7-188-62-239-55-67-3-115
7: 7-188-62-128-136-87-194-116
7: 7-42-2-14-166-6-117
7: 7-197-118
7: 7-42-141-35-41-81-119
7: 7-188-62-90-113-170-229-120
7: 7-188-62-90-242-121
7: 7-101-122
7: 7-101-219-30-8-246-123
7: 7-197-124
7: 7-125
7: 7-42-141-35-41-81-146-109-126
7: 7-188-62-239-112-234-61-89-127
7: 7-188-62-128
7: 7-42-2-14-129
7: 7-188-62-239-112-234-130
7: 7-101-219-30-179-131
7: 7-197-124-235-132
7: 7-101-214-51-133
7: 7-42-141-35-41-17-134
7: 7-230-135
7: 7-188-62-128-136
7: 7-42-141-35-41-17-134-137
7: 7-188-138
7: 7-101-139
7: 7-42-2-14-166-6-140
7: 7-42-141
7: 7-197-118-142
7: 7-101-219-30-143
7: 7-65-208-32-144
7: 7-42-141-35-41-17-134-145
7: 7-42-141-35-41-81-146
7: 7-42-2-14-166-147
7: 7-148
7: 7-197-118-165-68-0-149
7: 7-188-62-128-69-107-1-150
7: 7-65-151
7: 7-101-219-30-152
7: 7-188-62-239-55-67-3-153
7: 7-197-118-142-154
7: 7-197-155
7: 7-101-156
7: 7-157
7: 7-188-62-90-113-158
7: 7-188-62-239-159
7: 7-65-208-32-160
7: 7-188-62-90-242-223-249-161
7: 7-101-214-51-133-13-162
7: 7-197-118-165-68-0-163
7: 7-188-62-128-69-107-1-164
7: 7-197-118-165
7: 7-42-2-14-166
7: 7-42-2-14-166-6-117-167
7: 7-65-208-168
7: 7-188-62-128-69-107-1-220-169
7: 7-188-62-90-113-170
7: 7-197-124-171
7: 7-197-172
7: 7-188-62-128-173
7: 7-101-214-70-174
7: 7-101-219-30-11-175
7: 7-197-118-165-68-176
7: 7-188-62-128-69-107-72-177
7: 7-42-2-14-129-178
7: 7-101-219-30-179
7: 7-197-118-180
7: 7-181
7: 7-188-62-90-242-182
7: 7-42-141-35-41-17-134-64-183
7: 7-184
7: 7-65-208-32-185
7: 7-188-62-128-69-107-72-186
7: 7-65-208-187
7: 7-188
7: 7-188-62-128-69-107-1-189
7: 7-188-62-128-69-107-1-220-190
7: 7-197-118-165-191
7: 7-101-214-70-19-192
7: 7-101-219-30-179-193
7: 7-188-62-128-136-87-194
7: 7-197-118-142-195
7: 7-181-196
7: 7-197
7: 7-42-141-35-198
7: 7-188-62-128-136-87-111-25-199
7: 7-188-62-128-69-107-200
7: 7-65-208-32-201
7: 7-197-118-165-68-202
7: 7-188-62-128-69-107-203
7: 7-65-208-168-204
7: 7-101-205
7: 7-197-118-165-68-0-209-206
7: 7-101-219-207
7: 7-65-208
7: 7-197-118-165-68-0-209
7: 7-101-219-210
7: 7-197-118-165-68-0-211
7: 7-101-219-212
7: 7-197-118-213
7: 7-101-214
7: 7-42-141-35-41-17-134-64-215
7: 7-65-208-32-201-216
7: 7-188-138-26-217
7: 7-42-141-35-41-81-227-218
7: 7-101-219
7: 7-188-62-128-69-107-1-220
7: 7-101-219-221
7: 7-197-118-165-68-222
7: 7-188-62-90-242-223
7: 7-42-141-35-41-81-146-224
7: 7-197-118-165-191-225
7: 7-188-138-226
7: 7-42-141-35-41-81-227
7: 7-188-62-239-55-67-3-228
7: 7-188-62-90-113-170-229
7: 7-230
7: 7-65-208-231
7: 7-188-138-26-217-232
7: 7-188-233
7: 7-188-62-239-112-234
7: 7-197-124-235
7: 7-42-2-14-166-236
7: 7-188-62-128-136-87-111-60-237
7: 7-197-155-238
7: 7-188-62-239
7: 7-188-240
7: 7-188-62-239-55-67-3-241
7: 7-188-62-90-242
7: 7-101-214-70-19-243
7: 7-101-219-30-244
7: 7-197-124-171-245
7: 7-101-219-30-8-246
7: 7-188-62-128-69-107-1-220-247
7: 7-65-208-32-248
7: 7-188-62-90-242-223-249
The eccentricity of 7 is: 8
The diameter is: 14
The radius is: 8
The center is: 7
```

### 4.1.17
> The girth of a graph is the length of its shortest cycle. If a graph is acyclic, then its girth is infinite. Add a method girth() to GraphProperties that returns the girth of the graph. Hint : Run BFS from each vertex. The shortest cycle containing s is a shortest path from s to some vertex v , plus the edge from v back to s .

Just like the `class Cycle` in the book, but use `BreadthFirstPaths` to check the cycle:
```java
public int girth()
{
	int min = Integer.MAX_VALUE;
	for (int v = 0; v < g.V(); v++)
	{
		int t = girth(g, v);
		if (t < min)
			min = t;
	}
	return min;
}

private int girth(Graph g, int s)
{
	int v1 = -1;
	int v2 = -1;
	int flag = 0;
	Queue<Integer> q = new Queue<>();
	Queue<Integer> f = new Queue<>();
	boolean[] marked = new boolean[g.V()];
	marked[s] = true;
	q.enqueue(s);
	f.enqueue(-1);
	while (!q.isEmpty())
	{
		int v = q.dequeue();
		int father = f.dequeue();
		for (Integer i : g.adj(v))
		{
			if (!marked[i])
			{
				marked[i] = true;
				q.enqueue(i);
				f.enqueue(v);
			}
			else
			{
				if (i != father)
				{
					v1 = v;
					v2 = i;
					flag = 1;
					break;
				}
			}
		}
		if (flag == 1)
			break;
	}
	if (flag == 0)
		return -1;
	BreadthFirstPaths b = new BreadthFirstPaths(g, s);
	int count = 0;
	for (Integer i : b.pathTo(v1))
		count++;
	for (Integer i : b.pathTo(v2))
		count++;
	return count-1;
}
```

### 4.1.22
> Write a program BaconHistogram that prints a histogram of Kevin Bacon numbers, indicating how many performers from movies.txt have a Bacon number of 0, 1, 2, 3, ... . Include a category for those who have an infinite number (not connected to Kevin Bacon).

The code is not difficult, just follow the example on the book: 
```java
import edu.princeton.cs.algs4.StdDraw;
import edu.princeton.cs.algs4.SymbolGraph;
import edu.princeton.cs.algs4.Graph;
import edu.princeton.cs.algs4.Queue;
import edu.princeton.cs.algs4.BreadthFirstPaths;
import edu.princeton.cs.algs4.ST;
import edu.princeton.cs.algs4.StdOut;

public class BaconHistogram
{
	public static void main(String[] args)
	{
		SymbolGraph sg = new SymbolGraph(args[0], args[1]);
		Graph g = sg.graph();
		int s = sg.indexOf("Bacon, Kevin");
		BreadthFirstPaths bfp = new BreadthFirstPaths(g, s);

		ST<Integer, Integer> st = new ST<>();

		for (int v = 0; v < g.V(); v++)
		{
			int count = 0;
			if (bfp.hasPathTo(v))
			{
				for (Integer i : bfp.pathTo(v))
					count++;
				if (count % 2 == 1)
				{
					if (!st.contains(count/2))
						st.put(count/2, 1);
					else
						st.put(count/2, st.get(count/2)+1);
				}
			}
			else
			{
				if (!st.contains(-1))
					st.put(-1, 1);
				else
					st.put(-1, st.get(-1)+1);
			}
		}

		int ymax = 0;
		for (Integer i : st.keys())
		{
			int t = st.get(i);
			if (t > ymax)
				ymax = t;
		}

		StdDraw.setXscale(-1.5, st.size()+0.5);
		StdDraw.setYscale(-1, 1.2*ymax);

		for (Integer i : st.keys())
		{
			if (i == -1)
				StdOut.print("Not connected with Kevin: ");
			else
				StdOut.print("Bacon number of " + i + " : ");
			StdOut.println(st.get(i));
			StdDraw.filledRectangle(i+0.5, st.get(i)/2, 0.4, st.get(i)/2);
		}
	}
}
```
And we will get the following result:
```
$ java BaconHistogram movies.txt "/"
Not connected with Kevin: 655
Bacon number of 0 : 1
Bacon number of 1 : 1324
Bacon number of 2 : 70717
Bacon number of 3 : 40862
Bacon number of 4 : 1591
Bacon number of 5 : 125
```
The histogram is look like this:

![](../img/BaconHistogram.jpg)

### 4.1.34 Symbol graph.
> Implement a one-pass SymbolGraph (it need not be a Graph client). Your implementation may pay an extra log V factor for graph operations, for symbol-table lookups.

Here is my implementation by using three `ST`: 
```java
import edu.princeton.cs.algs4.ST;
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.StdIn;
import edu.princeton.cs.algs4.In;
import edu.princeton.cs.algs4.Bag;

public class OnePassSymbolGraph
{
	private ST<String, Integer> st; 		// key -> index
	private ST<Integer, String> ts; 		// index -> key
	private ST<Integer, Bag<Integer>> graph; 	// graph implemented by st
	private int V;
	private int E;

	public OnePassSymbolGraph(String filename, String delim)
	{
		st = new ST<String, Integer>();
		ts = new ST<Integer, String>();
		graph = new ST<Integer, Bag<Integer>>();
		In in = new In(filename);
		this.V = 0;
		this.E = 0;

		while (in.hasNextLine())
		{
			String[] keys = in.readLine().split(delim);
			if (!st.contains(keys[0]))
			{
				st.put(keys[0], st.size());
				ts.put(ts.size(), keys[0]);
				V++;
			}
			for (int i = 1; i < keys.length; i++)
			{
				// add key and index
				if (!st.contains(keys[i]))
				{
					st.put(keys[i], st.size());
					ts.put(ts.size(), keys[i]);
					V++;
				}
				this.addEdge(st.get(keys[0]), st.get(keys[i]));
			}
		}
	}

	public boolean contains(String key)
	{
		return st.contains(key);
	}

	public int index(String key)
	{
		return st.get(key);
	}

	public String name(int v)
	{
		return ts.get(v);
	}

	public int V()
	{
		return V;
	}

	public int E()
	{
		return E;
	}

	public void addEdge(int v, int w)
	{
		if (!graph.contains(v))
			graph.put(v, new Bag<Integer>());
		graph.get(v).add(w);
		if (!graph.contains(w))
			graph.put(w, new Bag<Integer>());
		graph.get(w).add(v);
		E++;
	}

	public Iterable<Integer> adj(int v)
	{
		if (!ts.contains(v))
			return null;
		else
			return graph.get(v);
	}

	public String toString()
	{
		return "omitted";
	}

	public static void main(String[] args)
	{
		String filename = args[0];
		String delim = args[1];
		OnePassSymbolGraph sg = new OnePassSymbolGraph(filename, delim);

		while (StdIn.hasNextLine())
		{
			String source = StdIn.readLine();
			for (Integer w : sg.adj(sg.index(source)))
				StdOut.println("    " + sg.name(w));
		}
	}
}
```
And I do not use the `graph` class but implement its own function of `adj()` and `addEdge()`. The test result would just be the same as the book:
```
$ java OnePassSymbolGraph routes.txt " "
JFK
    ORD
    ATL
    MCO
LAX
    LAS
    PHX
```

### 4.1.41 Random Euclidean graphs.
> Write a EuclideanGraph client (see Exercise 4.1.37) RandomEuclideanGraph that produces random graphs by generating V random points in the plane, then connecting each point with all points that are within a circle of radius d centered at that point. Note : The graph will almost certainly be connected if d is larger than the threshold value sqrt( lg V/ PI * V ) and almost certainly disconnected if d is smaller than that value.

This is my code, using an inner class `Point` to wrap the coordinates:
```java
import edu.princeton.cs.algs4.StdDraw;
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.ST;
import edu.princeton.cs.algs4.Graph;
import edu.princeton.cs.algs4.In;

public class EuclideanGraph
{
	private ST<Integer, Point> st;
	private Graph g;

	private class Point
	{
		double x;
		double y;

		public Point(double x, double y)
		{
			this.x = x;
			this.y = y;
		}

		public double getx()
		{
			return x;
		}

		public double gety()
		{
			return y;
		}

		public double distance(Point that)
		{
			double a = this.x - that.getx();
			double b = this.y - that.gety();
			return Math.sqrt(a*a + b*b);
		}
	}

	public EuclideanGraph(int V, double d)
	{
		st = new ST<Integer, Point>();
		g = new Graph(V);
		for (int v = 0; v < V; v++)
		{
			double x = StdRandom.uniform();
			double y = StdRandom.uniform();
			st.put(v, new Point(x, y));
		}
		for (int v = 0; v < V; v++)
		{
			for (int w = v; w < V; w++)
			{
				if (st.get(v).distance(st.get(w)) < d)
					g.addEdge(v, w);
			}
		}
	}

	public void show()
	{
		for (int v = 0; v < g.V(); v++)
		{
			StdDraw.setPenRadius(0.008);
			StdDraw.setPenColor(StdDraw.BLACK);
			StdDraw.point(st.get(v).getx(), st.get(v).gety());
			StdDraw.setPenRadius();
			StdDraw.setPenColor(StdDraw.GRAY);
			for (Integer w : g.adj(v))
				StdDraw.line(st.get(v).getx(), st.get(v).gety(), st.get(w).getx(), st.get(w).gety());
		}
	}

	public static void main(String[] args)
	{
		int V = Integer.parseInt(args[0]);
		double d = Double.parseDouble(args[1]);
		EuclideanGraph eg = new EuclideanGraph(V, d);
		eg.show();
	}
}
```
If we set the `V` to be `500`, so the threshold value of `d` is about `0.0755`, and the following three image's d value is `0.05`, `0.08` and `0.1`. From these three image we can clearly see the relationship between d with connectivity.

![](../img/EuclideanGraph-500-0.05.jpg)

![](../img/EuclideanGraph-500-0.08.jpg)

![](../img/EuclideanGraph-500-0.1.jpg)

## Web Exercises
### 5 Perfect Maze
> Write a program Maze.java that takes a command-line argument n, and generates a random n-by-n perfect maze. A maze is perfect if it has exactly one path between every pair of points in the maze, i.e., no inaccessible locations, no cycles, and no open spaces. Here's a nice algorithm to generate such mazes. Consider an n-by-n grid of cells, each of which initially has a wall between it and its four neighboring cells. For each cell (x, y), maintain a variable north[x][y] that is true if there is wall separating (x, y) and (x, y + 1). We have analogous variables east[x][y], south[x][y], and west[x][y] for the corresponding walls. Note that if there is a wall to the north of (x, y) then north[x][y] = south[x][y+1] = true. Construct the maze by knocking down some of the walls as follows:

> 1. Start at the lower level cell (1, 1).
> 2. Find a neighbor at random that you haven't yet been to.
> 3. If you find one, move there, knocking down the wall. If you don't find one, go back to the previous cell.
> 4. Repeat steps ii. and iii. until you've been to every cell in the grid.

> Hint: maintain an (n+2)-by-(n+2) grid of cells to avoid tedious special cases.

Here is my code according to the instruction where I use `explore()` to find a random neighbor, if find one, use `update()` to update the information in the four direction array, if not, use `turnBack()` to get a previous cell :
```java
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.StdDraw;

public class Maze
{
	private boolean[][] north;
	private boolean[][] south;
	private boolean[][] west;
	private boolean[][] east;
	private boolean[][] marked;
	private Pair[][] pathTo;
	private final int N;
	
	private class Pair
	{
		int x;
		int y;
		
		public Pair(int x, int y)
		{
			this.x = x;
			this.y = y;
		}
		
		public int getX()
		{
			return x;
		}
		
		public int getY()
		{
			return y;
		}
	}
	
	public Maze(int N)
	{
		// false means cell[i][j] is blocked in that direction
		north = new boolean[N+2][N+2];
		south = new boolean[N+2][N+2];
		west = new boolean[N+2][N+2];
		east = new boolean[N+2][N+2];
		// false means cell[i][j] has not been reached before
		marked = new boolean[N+2][N+2];
		for (int i = 0; i < N+2; i++)
		{
			marked[0][i] = true;
			marked[N+1][i] = true;
			marked[i][0] = true;
			marked[i][N+1] = true;
		} 	// initialize the four edge to be unreachable
		// record the path to cell[i][j]
		pathTo = new Pair[N+2][N+2];
		this.N = N;
	}
	
	public void generate()
	{
		int amount = N * N;
		// setup start position
		marked[1][1] = true;
		int count = 1;
		Pair current = new Pair(1, 1);
		
		while (count < amount)
		{
			int result = explore(current);
			if (result != 0)
			{
				current = update(current, result);
				count++;
			}
			else
				current = turnBack(current);
		}
	}
	
	private int explore(Pair p)
	{
		// randomlize the direction array
		// 1 means left; 2 means up; 3 means right; 4 means down
		// if all direction are unreachable, return 0
		int[] direction = new int[4];
		for (int i = 0; i < 4; i++)
			direction[i] = i+1;
		StdRandom.shuffle(direction);
		
		for (int i = 0; i < 4; i++)
		{
			if (reachable(p, direction[i]))
				return direction[i];
		}
		
		return 0;
	}
	
	private boolean reachable(Pair p, int d)
	{
		if (d == 1)
		{
			if (marked[p.getX()-1][p.getY()])
				return false;
			else
				return true;
		}
		else if (d == 2)
		{
			if (marked[p.getX()][p.getY()+1])
				return false;
			else
				return true;
		}
		else if (d == 3)
		{
			if (marked[p.getX()+1][p.getY()])
				return false;
			else
				return true;
		}
		else if (d == 4)
		{
			if (marked[p.getX()][p.getY()-1])
				return false;
			else
				return true;
		}
		return false;
	}

	private Pair update(Pair p, int d)
	{
		int x = p.getX();
		int y = p.getY();
		
		if (d == 1)
		{
			marked[x-1][y] = true;
			west[x][y] = true;
			east[x-1][y] = true;
			pathTo[x-1][y] = p;
			return new Pair(x-1, y);
		}
		else if (d == 2)
		{
			marked[x][y+1] = true;
			north[x][y] = true;
			south[x][y+1] = true;
			pathTo[x][y+1] = p;
			return new Pair(x, y+1);
		}
		else if (d == 3)
		{
			marked[x+1][y] = true;
			east[x][y] = true;
			west[x+1][y] = true;
			pathTo[x+1][y] = p;
			return new Pair(x+1, y);
		}
		else if (d == 4)
		{
			marked[x][y-1] = true;
			south[x][y] = true;
			north[x][y-1] = true;
			pathTo[x][y-1] = p;
			return new Pair(x, y-1);
		}
		return null;
	}
	
	private Pair turnBack(Pair p)
	{
		int x = p.getX();
		int y = p.getY();
		return pathTo[x][y];
	}
	
	public void draw()
	{
		StdDraw.setXscale(0, N+2);
		StdDraw.setYscale(0, N+2);
		StdDraw.setPenColor(StdDraw.BLACK);
		for (int i = 1; i <= N; i++)
		{
			for (int j = 1; j <= N; j++)
			{
				if (!west[i][j])
					StdDraw.line(i, j, i, j+1);
				if (!east[i][j])
					StdDraw.line(i+1, j, i+1, j+1);
				if (!north[i][j])
					StdDraw.line(i, j+1, i+1, j+1);
				if (!south[i][j])
					StdDraw.line(i, j, i+1, j);
			}
		}
	}
	
	public static void main(String[] args)
	{
		int N = Integer.parseInt(args[0]);
		Maze m = new Maze(N);
		m.generate();
		m.draw();
	}
}
```
And here is a 50*50 maze generated by this code: 

![](../img/Maze-50*50.jpg)

### 6 Getting out of the maze.
> Given an n-by-n maze (like the one created in the previous exercise), write a program to find a path from the start cell (1, 1) to the finish cell (n, n), if it exists. To find a solution to the maze, run the following algorithm, starting from (1, 1) and stopping if we reach cell (n, n).

Just add these code will show the path to get out of the maze :
```java
public void getOut()
{
	boolean[][] isReached = new boolean[N+2][N+2];
	Stack<Pair> pathToEnd = new Stack<>();
	Pair position = new Pair(1, 1);
	Pair end = new Pair(N, N);
	pathToEnd.push(position);
	while (!position.equals(end))
	{
		if (hasNeighbor(isReached, position))
			position = goNext(isReached, pathToEnd, position);
		else
		{
			pathToEnd.pop();
			position = pathToEnd.pop();
			pathToEnd.push(position);
		}
	}
	// draw the path
	StdDraw.setPenRadius(0.01);
	StdDraw.setPenColor(StdDraw.PRINCETON_ORANGE);
	double lastX = N+0.5;
	double lastY = N+0.5;
	for (Pair p : pathToEnd)
	{
		double x = p.getX()+0.5;
		double y = p.getY()+0.5;
		StdDraw.line(x, y, lastX, lastY);
		lastX = x;
		lastY = y;
	}
}

private boolean hasNeighbor(boolean[][] isReached, Pair p)
{
	int x = p.getX();
	int y = p.getY();

	if (west[x][y] && !isReached[x-1][y])
		return true;
	else if (east[x][y] && !isReached[x+1][y])
		return true;
	else if (north[x][y] && !isReached[x][y+1])
		return true;
	else if (south[x][y] && !isReached[x][y-1])
		return true;
	else
		return false;
}

private Pair goNext(boolean[][] isReached, Stack<Pair> pathToEnd, Pair p)
{
	int x = p.getX();
	int y = p.getY();

	if (west[x][y] && !isReached[x-1][y])
	{
		isReached[x-1][y] = true;
		Pair next = new Pair(x-1, y);
		pathToEnd.push(next);
		return next;
	}
	else if (east[x][y] && !isReached[x+1][y])
	{
		isReached[x+1][y] = true;
		Pair next = new Pair(x+1, y);
		pathToEnd.push(next);
		return next;
	}
	else if (north[x][y] && !isReached[x][y+1])
	{
		isReached[x][y+1] = true;
		Pair next = new Pair(x, y+1);
		pathToEnd.push(next);
		return next;
	}
	else if (south[x][y] && !isReached[x][y-1])
	{
		isReached[x][y-1] = true;
		Pair next = new Pair(x, y-1);
		pathToEnd.push(next);
		return next;
	}
	else
		return null;
}
```
And here is the path it generates:

![](../img/PathToMaze.jpg)
