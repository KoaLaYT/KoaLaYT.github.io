# Chapter 4 / Section 2 : Directed Graphs

## Main Content

In *directed graphs*, edges are one-way: the pair of vertices that defines each edge is an ordered pair that specifies a  one-way adjacency.

### 1. Glossary

|          Terms           |                          Definition                          |
| :----------------------: | :----------------------------------------------------------: |
| directed graph (digraph) | A directed graph is a set of vertices and a collection of directed edges. Each directed edge connects an ordered pair of vertices |
|        outdegree         | The outdegree of a vertex in a digraph is the number of edges going **from** it |
|         indegree         | The indegree of a vertex is the number of edges going **to** in |
|           head           |             The first vertex in a directed edge              |
|           tail           |             The second vertex in a directed edge             |
|      directed path       | A directed path in a digraph is a sequence of vertices in which there is a directed edge pointing from each vertex in the sequence to its successor in the sequence |
|      directed cycle      | A directed cycle is a directed path with at least one edge whose first and last vertices are the same |
|       simple cycle       |    A simple is a cycle with no repeated edges or vertices    |
|          length          |    The length of a path or a cycle is its number of edges    |

Here is the anatomy of a digraph : (image from text book)

![Anatomy of a digraph](../img/AnatomyOfDigraph.png)

### 2. Digraph data type

![Digraph API](../img/DigraphAPI.png)

This `Digraph` data type is identical to `Graph ` except that `addEdge()` only calls `add()` once : 

```java
public class Digraph
{
    private Bag<Integer>[] adj;
    private int V;
    private int E;
    
    public Digraph(int V)
    {
        this.V = V;
        this.E = 0;
        adj = (Bag<Integer>[]) new Bag[V];
        for (int v = 0; v < V; v++)
            adj[v] = new Bag<Integer>();
    }
    
    public int V() { return V; }
    public int E() { return E; }
    
    public void addEdge(int v, int w)
    { adj[v].add(w); E++; }
    
    public Iterable<Integer> adj(int v) { return adj[v]; }
    
    public Digraph reverse()
    {
        Digraph reverse = new Digraph(V);
        for (int v = 0; v < V; v++)
            for (Integer w : this.adj(v))
                reverse.addEdge(w, v);
        return reverse;
    }
}
```

### 3. Reachability in digraphs

The API below is a slight embellishment of `DepthFirstSeach` : (image from text book)

![DirectedDFS API](../img/DirectedDFS.png)

This API supports for clients the following generalization of the problem :

**Multiple-source reachability ** : Is there a directed path from any vertex in the set to a given target vertex v?

```java
public class DirectedDFS
{
    private boolean[] marked;
    
    public DirectedDFS(Digraph G, int s)
    {
        marked = new boolean[G.V()];
        dfs(G, s);
    }
    
    public DirectedDFS(Digraph G, Iterable<Integer> sources)
    {
        marked = new boolean[G.V()];
        for (Integer s : sources)
            if (!marked[s])
            	dfs(G, s);
    }
    
    private void dfs(Digraph G, int v)
    {
        marked[v] = true;
        for (Integer w : G.adj(v))
            if (!marked[w])
                dfs(G, w);
    }
    
    public boolean marked(int v) { return marked[v]; }
}
```

**Directed DFS analysis** :

> DFS marks all the vertices in a digraph reachable from a given set of sources in time proportional to the sum of the outdegrees of the vertices marked.

### 4. Cycles and DAGs

To solve the following problem :

**Directed cycle detection** : Does a given digraph have a directed cycle ? If so, find the vertices on some such cycle, in order from some vertex back to itself.

We define the API as : (image from text book)

![DirectedCycle API](../img/DirectedCycleAPI.png)

```java
public class DirectedCycle
{
    private boolean[] marked;
    private boolean[] onStack;
    private int[] edgeTo;
    private Stack<Integer> cycle;
    
    public DirectedCycle(Digraph G)
    {
        marked = new boolean[G.V()];
        onStack = new boolean[G.V()];
        edgeTo = new int[G.V()];
        
        for (int v = 0; v < G.V(); v++)
            if (!marked[v])
                dfs(G, v);
    }
    
    private void dfs(Digraph G, int v)
    {
        onStack[v] = true;
        marked[v] = true;
        for (Integer w : G.adj(v))
        {
            if (hasCycle()) return;
            else if (!marked[w])
            {
                edgeTo[w] = v;
                dfs(G, w);
            }
            else if (onStack[w])
            {
                cycle = new Stack<Integer>();
 				for (int x = v; x != w; x = edgeTo[x])
                    cycle.push(x);
                cycle.push(w);
                cycle.push(v);
            }
        }
        onStack[v] = false;
    }
    
    public boolean hasCycle() { return cycle != null; }
    public Iterable<Integer> cycle() { return cycle; }
}
```

This is the trace of finding a directed cycle in a digraph : (image from text book)

![Finding a directed cycle in a digraph](../img/FindingCycleInDigraph.png)

When a digraph is checked to be a DAG, it can be topological, here is the API : (image from text book)

![Topological sorting](../img/TopologicalSorting.png)

Three vertex ordering are of interest in typical applications :

- *Preorder* : Put the vertex on a queue before the recursive calls.
- *Postorder* : Put the vertex on a queue after the recursive calls.
- *Reverse postorder* : Put the vertex on a stack after the recursive calls.

We first implement the `DepthFirstOrder` class to produce those vertex orders :

```java
public class DepthFirstOrder
{
    private Queue<Integer> pre;
    private Queue<Integer> post;
    private Stack<Integer> reversePost;
    private boolean[] marked;
    
    public DepthFirstOrder(Digraph G)
    {
        pre = new Queue<Integer>();
        post = new Queue<Integer>();
        reversePost = new Stack<Integer>();
        marked = new boolean[G.V()];
        for (int v = 0; v < G.V(); v++)
            if (!marked[v]) dfs(G, v);
    }
    
    private void dfs(Digraph G, int v)
    {
        pre.enqueue(v);
        marked[v] = true;
        for (Integer w : G.adj(v))
            if (!marked[w]) dfs(G, w);
        post.enqueue(v);
        reversePost.push(v);
    }
    
    public Iterable<Integer> pre() { return pre; }
    public Iterable<Integer> post() { return post; }
    public Iterable<Integer> reversePost() { return reversePost; }
}
```

Here is the trace of computing depth-first orders in a digraph : (image from text book)

![Preorder, postorder and reverse postorder](../img/ThreeOrderOfDigraph.png)

Then we can implement the `Topological` class :

```java
public class Topological
{
    private Stack<Integer> order;
    
    public Topological(Digraph G)
    {
        DirectedCycle dc = new DirectedCycle(G);
        if (!dc.hasCycle())
        {
            DepthFirstOrder dfo = new DepthFirstOrder(G);
            order = dfo.reversePost();
        }
    }
    
    public boolean isDAG() { return order != null; }
    public Iterable<Integer> order() { return order; }
}
```

Here is the trace to topological sort a DAG : (image from text book)

![Topological Sorting trace](../img/TopologicalSortTrace.png)

**Topological sorting analysis** :

> With DFS, we can topologically sort a DAG in time proportional to V+E.

In a typical job-scheduling application, it has three-step process :

1. Specify the tasks and precedence constraints
2. Make sure that a feasible solution exists, by detecting and removing cycles in the underlying digraph until none exist
3. Solve the scheduling problem, using topological sort

### 5. Strong connectivity in digraphs

The definition is :

> Two vertices v and w are strongly connected if they are mutually reachable: that is, if there is a directed path from v to w and a directed path from w to v. 
>
> A digraph is strongly connected if all its vertices are strongly connected to one another.

To compute strong component, we define following API : (image from text book)

![SCC API](../img/SCCAPI.png)

**Kosaraju's algorithm** solving this problem efficiently by just adding a few lines of code to `CC`, as follows :

1. Given a graph G, use `DepthFirstOrder` to compute the reverse postorder of its reverse, G<sup>R</sup>
2. Run standard DFS on G, but consider the unmarked vertices in the order just computed instead of the standard numerical order
3. All vertices reached on a call to the recursive `dfs()` from the constructor are in a strong component, so identify them as in `CC`

Here is the proof of correctness for Kosaraju's algorithm : (image from text book)

![Proof of correctness for Kosaraju's algorithm](../img/ProofOfCorrectnessForSCC.png)

```java
public class KosarajuSCC
{
    private boolean[] marked;
    private int[] id;
    private int count;
    
    public KosarajuSCC(Digraph G)
    {
        marked = new boolean[G.V()];
        id = new int[G.V()];
        DepthFirstOrder dfo = new DepthFirstOrder(G.reverse());
        for (Integer v : dfo.reversePost())
            if (!marked[v])
            {
                dfs(G, v);
                count++;
            }
    }
    
    private void dfs(Digraph G, int v)
    {
        marked[v] = true;
        id[v] = count;
        for (Integer w : G.adj(v))
            if (!marked[w]) dfs(G, w);
    }
    
    public boolean stronglyConnected(int v, int w)
    { return id[v] == id[w]; }
    
    public int count() { return count; }
    public int id(int v) { return id[v]; }
}
```

Here is the trace of Kosaraju's algorithm for find strong components in digraph : (image from text book)

![KosarajuSCC trace](../img/KosarajuSCCTrace.png)

**Kosaraju's algorithm analysis** :

> Kosaraju's algorithm uses preprocessing time and space proportional to V+E to support constant-time strong connectivity queries in a digraph.

### 6. All-pairs reachability

The question is : Is there a directed path from a given vertex v to another given vertex w ?

We can define the following API : (image from text book)

![All-pairs reachability API](../img/AllPairsReachability.png)

```java
public class TransitiveClosure
{
    private DirectedDFS[] dfs;
    
    public TransitiveClosure(Digraph G)
    {
        dfs = new DirectedDFS[G.V()];
        for (int v = 0; v < G.V(); v++)
            dfs[v] = new DirectedDFS(G, v);
    }
    
    public boolean reachable(int v, int w)
    { return dfs[v].marked(w); }
}
```

**Transitive closure analysis** :

> The constructor of the implementation uses space proportional to V<sup>2</sup> and time proportional to V(V+E) and support constant-time queries in a digraph.

## Exercise
### 4.2.7 
> The indegree of a vertex in a digraph is the number of directed edges that point to that vertex. The outdegree of a vertex in a digraph is the number of directed edges that emanate from that vertex. No vertex is reachable from a vertex of outdegree 0, which is called a sink; a vertex of indegree 0, which is called a source, is not reachable from any other vertex. A digraph where self-loops are allowed and every vertex has outdegree 1 is called a map (a function from the set of integers from 0 to V–1 onto itself). Write a program Degrees.java that implements the following API:

return type | method | discription
----------- | ------ | -----------
/ | Degrees(Digraph G) | constructor
int | indegree(int v) | indegree of v
int | outdegree(int v) | outdegree of v
Iterable<Integer> | sources() | sources
Iterable<Integer> | sinks() | sinks
boolean | isMap() | is G a map?

To implement the API is not difficult:
```java
import edu.princeton.cs.algs4.Digraph;
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.In;
import edu.princeton.cs.algs4.Bag;

public class Degrees
{
	private int[] indegree;
	private int[] outdegree;

	public Degrees(Digraph g)
	{
		indegree = new int[g.V()];
		outdegree = new int[g.V()];

		for (int v = 0; v < g.V(); v++)
		{
			int count = 0;
			for (Integer w : g.adj(v))
			{
				count++;
				indegree[w]++;
			}
			outdegree[v] = count;
		}
	}

	public int indegree(int v)
	{
		return indegree[v];
	}

	public int outdegree(int v)
	{
		return outdegree[v];
	}

	public Iterable<Integer> sources()
	{
		Bag<Integer> b = new Bag<>();
		for (int v = 0; v < indegree.length; v++)
			if (indegree[v] == 0)
				b.add(v);
		return b;
	}

	public Iterable<Integer> sinks()
	{
		Bag<Integer> b = new Bag<>();
		for (int v = 0; v < outdegree.length; v++)
			if (outdegree[v] == 0)
				b.add(v);
		return b;
	}

	public boolean isMap()
	{
		for (int v = 0; v < outdegree.length; v++)
			if (outdegree[v] != 1)
				return false;
		return true;
	}

	public static void main(String[] args)
	{
		Digraph g = new Digraph(new In(args[0]));
		Degrees d = new Degrees(g);

		for (int v = 0; v < g.V(); v++)
			StdOut.println(v + " indegree: " + d.indegree(v) + ", outdegree: " + d.outdegree(v));

		StdOut.print("sources is : ");
		for (Integer w : d.sources())
			StdOut.print(w + " ");
		StdOut.println();
		StdOut.print("sinks is : ");
		for (Integer w : d.sinks())
			StdOut.print(w + " ");
		StdOut.println();
		StdOut.println("Is a map: " + d.isMap());
	}
}
```
And here is the test result:
```
$ java Degrees tinyDG.txt 
0 indegree: 2, outdegree: 2
1 indegree: 1, outdegree: 0
2 indegree: 2, outdegree: 2
3 indegree: 2, outdegree: 2
4 indegree: 3, outdegree: 2
5 indegree: 2, outdegree: 1
6 indegree: 1, outdegree: 3
7 indegree: 1, outdegree: 2
8 indegree: 1, outdegree: 2
9 indegree: 3, outdegree: 2
10 indegree: 1, outdegree: 1
11 indegree: 1, outdegree: 2
12 indegree: 2, outdegree: 1
sources is : 
sinks is : 1 
Is a map: false
```

### 4.2.21 LCA of a DAG.
> Given a DAG and two vertices v and w , find the lowest common ancestor (LCA) of v and w . The LCA of v and w is an ancestor of v and w that has no descendants that are also ancestors of v and w . Computing the LCA is useful in multiple inheritance in programming languages, analysis of genealogical data (find degree of inbreeding in a pedigree graph), and other applications. Hint : Define the height of a vertex v in a DAG to be the length of the longest path from a root to v . Among vertices that are ancestors of both v and w , the one with the greatest height is an LCA of v and w .

Following the instruction, method `ancestor()` is used to find all the ancestors of a given vertex v, method `height()` is used to calculate the longest path of v to a root, and in method `lca()` the lowest common ancestor is found. Here is the code: 
```java
import edu.princeton.cs.algs4.Digraph;
import edu.princeton.cs.algs4.Topological;
import edu.princeton.cs.algs4.Bag;
import edu.princeton.cs.algs4.ST;
import edu.princeton.cs.algs4.In;
import edu.princeton.cs.algs4.StdOut;

public class LowestCommonAncestor
{
	public static Iterable<Integer> ancestor(Digraph g, int v)
	{
		Topological t = new Topological(g);
		if (!t.hasOrder())
			throw new IllegalArgumentException("g is not a DAG");

		int[] order = new int[g.V()];
		ST<Integer, Integer> st = new ST<>();
		for (Integer w : t.order())
		{
			order[st.size()] = w;
			st.put(w, st.size());
		}

		Bag<Integer> bag = new Bag<>();
		bag.add(v);

		for (int i = st.get(v)-1; i >= 0; i--)
		{
			int flag = 0;
			for (Integer w : g.adj(order[i]))
			{
				for (Integer x : bag)
				{
					if (x == w)
					{
						bag.add(order[i]);
						flag = 1;
						break;
					}
				}
				if (flag == 1)
					break;
			}
		}

		return bag;
	}

	private static int height(Digraph g, int v)
	{
		Bag<Integer> b = (Bag<Integer>) ancestor(g, v);
		int count = 0;
		for (Integer i : b)
			count++;
		return count;
	}

	public static int LCA(Digraph g, int v, int w)
	{
		Bag<Integer> bv = (Bag<Integer>) ancestor(g, v);
		Bag<Integer> bw = (Bag<Integer>) ancestor(g, w);

		int lca = -1;
		int max = -1;

		for (Integer i : bv)
		{
			for (Integer j : bw)
			{
				if (i == j)
				{
					int tmp = height(g, i);
					if (tmp > max)
					{
						max = tmp;
						lca = i;
					}
				}
			}
		}
		return lca;
	}

	public static void main(String[] args)
	{
		Digraph g = new Digraph(new In(args[0]));
		int v = Integer.parseInt(args[1]);
		int w = Integer.parseInt(args[2]);
		
		StdOut.print("Ancestor of " + v + " : ");
		for (Integer i : ancestor(g, v))
			StdOut.print(i + " ");
		StdOut.println();
		StdOut.print("Ancestor of " + w + " : ");
		for (Integer i : ancestor(g, w))
			StdOut.print(i + " ");
		StdOut.println();

		StdOut.println("Their lowest common ancestor is : " + LCA(g, v, w));
	}
}
```
I use the digraph of `jobs.txt` to test the code: 
```
$ java LowestCommonAncestor test.txt 4 12
Ancestor of 4 : 8 7 2 3 0 5 6 4 
Ancestor of 12 : 8 7 2 0 6 9 11 12 
Their lowest common ancestor is : 6
$ java LowestCommonAncestor test.txt 5 12
Ancestor of 5 : 2 3 0 5 
Ancestor of 12 : 8 7 2 0 6 9 11 12 
Their lowest common ancestor is : 0
```

### 4.2.23 Strong component.
> Describe a linear-time algorithm for computing the strong connected component containing a given vertex v . On the basis of that algorithm, describe a simple quadratic algorithm for computing the strong components of a digraph.

My solution to a quadratic algorithm for computing the SCC is that 

1. use an array to record if a vertex v has been marked before. If not, for all the other vertex w, using the class `DirectedDFS` to find if v can reach w while w can reach v too.
2. if find such a vertex w, mark it and add it to the same component of v.
3. repeat step 1 and 2 until all vertex has been marked.

And here is my code:
```java
import edu.princeton.cs.algs4.DirectedDFS;
import edu.princeton.cs.algs4.Digraph;
import edu.princeton.cs.algs4.In;
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.Bag;

public class QuadraticSCC
{
	private boolean[] marked;
	private int[] id;
	private int count;

	public QuadraticSCC(Digraph g)
	{
		marked = new boolean[g.V()];
		id = new int[g.V()];
		this.count = 0;

		for (int v = 0; v < g.V(); v++)
		{
			if (!marked[v])
			{
				scc(g, v);
				count++;
			}
		}
	}

	private void scc(Digraph g, int v)
	{
		marked[v] = true;
		id[v] = count;
		DirectedDFS dfsv = new DirectedDFS(g, v);
		for (int w = 0; w < g.V(); w++)
		{
			if (marked[w]) 
				continue;
			DirectedDFS dfsw = new DirectedDFS(g, w);
			if (dfsv.marked(w) && dfsw.marked(v))
			{
				marked[w] = true;
				id[w] = count;
			}
		}
	}

	public boolean stronglyConnected(int v, int w)
	{
		return id[v] == id[w];
	}

	public int count()
	{
		return count;
	}

	public int id(int v)
	{
		return id[v];
	}

	public static void main(String[] args)
	{
		Digraph g = new Digraph(new In(args[0]));
		QuadraticSCC qscc = new QuadraticSCC(g);
		Bag<Integer>[] bags = (Bag<Integer>[]) new Bag[qscc.count()];
		for (int i = 0; i < qscc.count(); i++)
			bags[i] = new Bag<Integer>();
		for (int v = 0; v < g.V(); v++)
			bags[qscc.id(v)].add(v);
		for (int i = 0; i < qscc.count(); i++)
		{
			StdOut.print(i + " component: ");
			for (Integer j : bags[i])
				StdOut.print(j + " ");
			StdOut.println();
		}
	}
}
```
And the test result shows its correctness:
```
$ java QuadraticSCC tinyDG.txt 
0 component: 5 4 3 2 0 
1 component: 1 
2 component: 6 
3 component: 8 7 
4 component: 12 11 10 9 
```

### 4.2.30 Queue-based topological sort.
> Develop a topological sort implementation that maintains a vertex-indexed array that keeps track of the indegree of each vertex. Initialize the array and a queue of sources in a single pass through all the edges, as in Exercise 4.2.7. Then, perform the following operations until the source queue is empty:
> - Remove a source from the queue and label it.
> - Decrement the entries in the indegree array corresponding to the destination vertex of each of the removed vertex’s edges.
> - If decrementing any entry causes it to become 0, insert the corresponding vertex onto the source queue.

Here is the code that follow the instruction: 
```java
import edu.princeton.cs.algs4.Digraph;
import edu.princeton.cs.algs4.In;
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.DirectedCycle;
import edu.princeton.cs.algs4.Queue;

public class QueueBasedTopological
{
	private Queue<Integer> order;
	private Queue<Integer> source;
	private boolean[] marked;
	private int[] indegree;

	public QueueBasedTopological(Digraph g)
	{
		DirectedCycle dc = new DirectedCycle(g);
		if (dc.hasCycle())
			throw new IllegalArgumentException("g is not DAG");

		order = new Queue<Integer>();
		source = new Queue<Integer>();
		marked = new boolean[g.V()];
		indegree = new int[g.V()];

		Degrees d = new Degrees(g);
		for (int v = 0; v < g.V(); v++)
			indegree[v] = d.indegree(v);
		for (Integer v : d.sources())
			source.enqueue(v);

		while (!source.isEmpty())
		{
			int t = source.dequeue();
			marked[t] = true;
			order.enqueue(t);

			for (Integer w : g.adj(t))
			{
				if (marked[w])
					continue;
				if (--indegree[w] == 0)
					source.enqueue(w);
			}
		}
	}

	public boolean isDAG()
	{
		return order != null;
	}

	public Iterable<Integer> order()
	{
		return order;
	}

	public static void main(String[] args)
	{
		Digraph g = new Digraph(new In(args[0]));
		QueueBasedTopological qbt = new QueueBasedTopological(g);
		for (Integer i : qbt.order())
			StdOut.print(i + " ");
		StdOut.println();
	}
}
```
