# Chapter 4 / Section 4 : Shortest Paths
## Main Content
A *shortest path* from vertex s to vertex t in an edge-weighted digraph is a directed path from s to t with the property that no other such path has a lower weight.

### 1. Properties of shortest paths

- Paths are directed
- The weights are not necessarily distances
- Not all vertices need be reachable
- Negative weights introduce complications
- Shortest paths are normally simple
- Shortest paths are not necessarily unique
- Parallel edges and self-loops may be present

We will focus on the *single-source shortest-paths problem* :

> Given an edge-weighted digraph and a designated vertex s, a shortest-paths tree for a source s is a subgraph containing s and all the vertices reachable from s that forms a directed tree rooted at s such that every tree path is a shortest path in the digraph.

### 2. Edge-weighted digraph data types

![Weighted directed-edge API](../img/WeightedDirectedEdgeAPI.png)

```java
public class DirectedEdge
{
    private int v;
    private int w;
    private double weight;
    
    public DirectedEdge(int v, int w, double weight)
    {
        this.v = v;
        this.w = w;
        this.weight = weight;
    }
    
    public double weight() { return weight; }
    
    public int from() { return v; }
    
    public int to() { return w; }
    
    public String toString()
    { return String.format("%d->%d %.2f", v, w, weight); }
}
```

![Edge-weighted digraph API](../img/EdgeWeightedDigraphAPI.png)

```java
public class EdgeWeightedDigraph
{
    private Bag<DirectedEdge>[] adj;
    private int V;
    private int E;
    
    public EdgeWeightedDigraph(int V)
    {
        this.V = V;
        this.E = 0;
        adj = (Bag<DirectedEdge>[]) new Bag[V];
        for (int v = 0; v < V; v++)
            adj[v] = new Bag<DirectedEdge>();
    }
    
    public int V() { return V; }
    
    public int E() { return E; }
    
    public void addEdge(DirectedEdge e)
    {
        int v = e.from();
        adj[v].add(e);
        E++;
    }
    
    public Iterable<DirectedEdge> adj(int v)
    { return adj[v]; }
    
    public Iterable<DirectedEdge> edges()
    {
        Bage<DirectedEdge> b = new Bag<>();
        for (int v = 0; v < V; v++)
            for (DirectedEdge e : adj(v))
                b.add(e);
        return b;
    }
}
```

For Shortest-paths, we use the following API : (image from text book)

![Shortest-paths API](../img/ShortestPathsAPI.png)

### 3. Dijkstra's algorithm

Dijkstra's algorithm is an analogous scheme of Prim's algorithm for finding MST of an edge-weighted undirected graph.

```java
public class DijkstraSP
{
    private double[] distTo;
    private DirectedEdge[] edgeTo;
    private IndexMinPQ<double> pq;
    
    public DijkstraSP(EdgeWeightedDigraph G, int s)
    {
        distTo = new double[G.V()];
        for (int v = 0; v < G.V(); v++)
            distTo[v] = Double.POSITIVE_INFINITY;
        edgeTo = new DirectedEdge[G.V()];
        pq = new IndexMinPQ<double>(G.V());
        distTo[s] = 0.0;
        pq.insert(s, distTo[s]);
        
        while (!pq.isEmpty())
            relax(G, pq.delMin());
    }
    
    private void relax(EdgeWeightedDigraph G, int v)
    {
        for (DirectedEdge e : G.adj(v))
        {
            int w = e.to();
            if (distTo[w] > distTo[v] + e.weight())
            {
                distTo[w] = distTo[v] + e.weight();
                edgeTo[w] = e;
                if (!pq.contains(w))
                    pq.insert(w, distTo[w]);
                else
                    pq.change(w, distTo[w]);
            }
        }
    }
}
```

**Dijkstra's algorithm analysis** :

> Dijkstra's algorithm uses extra space proportional to V and time proportional to ElogV in the worst case to compute the SPT rooted at a given source in an edge-weighted digraph with E edges and V vertices.

Here is the figure of Dijkstra's algorithm : (image from text book)

![Dijkstra's algorithm](../img/DijkstraSPT.png)

### 4. Acyclic edge-weighted digraphs

This algorithm for finding shortest paths in an acyclic edge-weighted digraph is simpler and faster than Dijkstra's algorithm with following three characteristics :

- Solves the single-source problem in linear time
- Handles negative edge weights
- Solves related problems, such as finding longest paths

Its principle is based on the following proposition :

> By relaxing vertices in topological order, we can solve the single-source shortest-paths problem for edge-weighted DAGs in time proportional to E+V.

```java
public class AcyclicSP
{
    private double[] distTo;
    private DirectedEdge[] edgeTo;
    
    public AcyclicSP(EdgeWeightedDigraph G, int s)
    {
        distTo = new double[G.V()];
        edgeTo = new DirectedEdge[G.V()];
        for (int v = 0; v < G.V(); v++)
            distTo[v] = Double.POSITIVE_INFINITY;
        distTo[s] = 0.0;
        
        Topological top = new Topological(G);
        for (Integer v : top.order())
            relax(G, v);
    }
}
```

### 5. Shortest paths in general edge-weighted digraphs

There exists a shortest path from s to v in an edge-weighted digraph if and only if there exists at least on directed path from s to v and no vertex on any directed path from s to v is on a **negative cycle**.

The Bellman-Ford algorithm can solve this problem :

> The following method solves the single-source shortest-paths problem from a given source s for any edge-weighted digraph with V vertices and no negative cycle reachable from s : Initialize `distTo[s]` to 0 and all other `distTo()` values to infinity. Then, considering the digraph's edges in any order, relax all edges. Make V such passes.

Here is a Queue-based Bellman-Ford algorithm :

```java
public class BellmanFordSP
{
    private double[] distTo;
    private DirectedEdge[] edgeTo;
    private boolean[] onQ;
    private Queue<Integer> q;
    private int cost;
    private Iterable<DirectedEdge> cycle;
    
    public BellmanFordSP(EdgeWeightedDigraph G, int s)
    {
        distTo = new double[G.V()];
        for (int v = 0; v < G.V(); v++)
            distTo[v] = Double.POSITIVE.INFINITY;
        distTo[s] = 0.0;
        edgeTo = new DirectedEdge[G.V()];
        onQ = new boolean[G.V()];
        q = new Queue<Integer>();
        
        q.enqueue(s);
        onQ[s] = true;
        while (!q.isEmpty() && !hasNegativeCycle())
        {
            int v = q.dequeue();
            onQ[v] = false;
            relax(G, v);
        }
    }
    
    private void relax(EdgeWeightedDigraph G, int v)
    {
        for (DirectedEdge e : G.adj(v))
        {
            int w = e.to();
            if (distTo[w] > distTo[v] + e.weight())
            {
                distTo[w] = distTo[v] + e.weight();
                edgeTo[w] = e;
                if (!onQ[w])
                {
                    onQ[w] = true;
                    q.enqueue(w);
                }
            }
            if (cost++ % G.V() == 0)
                findNegativeCycle();
        }
    }
    
    private void findNegativeCycle()
    {
        int V = edgeTo.length;
        EdgeWeightedDigraph spt = new EdgeWeightedDigraph(V);
        for (int v = 0; v < V; v++)
            if (edgeTo[v] != null)
                spt.addEdge(edgeTo[v]);
        EdgeWeightedCycleFinder cf = new EdgeWeightedCycleFinder(spt);
        cycle = cf.cycle();
    }
    
    public boolean hasNegativeCycle()
    { return cycle != null; }
    
    public Iterable<DirectedEdge> negativeCycle()
    { return cycle; }
}
```

**Queue-based Bellman-Ford algorithm analysis** :

> The queue-based implementation of the Bellman-Ford algorithm solves the shortest-paths problem from a given source s for any edge-weighted digraph with V vertices, in time proportional to EV and extra space proportional to V in the worst case.

### 6. Summary

The table below summarizes the important characteristics of the shortest-paths algorithm in this section : (image from text book)

![Performance table](../img/ShortestPathSummaryTable.png)

## Exercise
### 4.4.2
> Provide an implementation of toString() for EdgeWeightedDigraph .

Just to be familiar with the API:
```java
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.In;
import edu.princeton.cs.algs4.Bag;

public class MyEdgeWeightedDigraph
{
	private Bag<MyDirectedEdge>[] adj;
	private int V;
	private int E;

	public MyEdgeWeightedDigraph(int V)
	{
		this.V = V;
		this.E = E;
		adj = (Bag<MyDirectedEdge>[]) new Bag[V];

		for (int v = 0; v < V; v++)
			adj[v] = new Bag<MyDirectedEdge>();
	}

	public MyEdgeWeightedDigraph(In in)
	{
		this(Integer.parseInt(in.readLine()));
		in.readLine();

		while (in.hasNextLine())
		{
			String[] a = in.readLine().split("\\s+");
			int v = Integer.parseInt(a[0]);
			int w = Integer.parseInt(a[1]);
			double weight = Double.parseDouble(a[2]);
			adj[v].add(new MyDirectedEdge(v, w, weight));
			E++;
		}
	}

	public int V()
	{
		return V;
	}

	public int E()
	{
		return E;
	}

	public void addEdge(MyDirectedEdge e)
	{
		adj[e.from()].add(e);
		E++;
	}

	public Iterable<MyDirectedEdge> adj(int v)
	{
		return adj[v];
	}

	public Iterable<MyDirectedEdge> edges()
	{
		Bag<MyDirectedEdge> b = new Bag<>();
		for (int v = 0; v < V; v++)
		{
			for (MyDirectedEdge e : adj[v])
				b.add(e);
		}
		return b;
	}

	public String toString()
	{
		String s = "";
		for (MyDirectedEdge e : edges())
			s += e + "\n";
		return s;
	}

	public static void main(String[] args)
	{
		MyEdgeWeightedDigraph g = new MyEdgeWeightedDigraph(new In(args[0]));
		StdOut.print(g.toString());
	}
}
```

### 4.4.12
> Adapt the DirectedCycle and Topological classes from Section 4.2 to use the EdgeweightedDigraph and DirectedEdge APIs of this section, thus implementing EdgeWeightedCycleFinder and EdgeWeightedTopological classes.

Here is `EdgeWeightedCycleFinder`
```java
import edu.princeton.cs.algs4.DirectedEdge;
import edu.princeton.cs.algs4.EdgeWeightedDigraph;
import edu.princeton.cs.algs4.Stack;

public class EdgeWeightedCycleFinder
{
	private boolean[] marked;
	private boolean[] onStack;
	private DirectedEdge[] edgeTo;
	private Stack<DirectedEdge> cycle;

	public EdgeWeightedCycleFinder(EdgeWeightedDigraph g)
	{
		marked = new boolean[g.V()];
		onStack = new boolean[g.V()];
		edgeTo = new DirectedEdge[g.V()];

		for (int v = 0; v < g.V(); v++)
			if (!marked[v])
				dfs(g, v);
	}

	private void dfs(EdgeWeightedDigraph g, int v)
	{
		marked[v] = true;
		onStack[v] = true;

		for (DirectedEdge e : g.adj(v))
		{
			if (this.hasCycle())
				return;

			int w = e.to();
			if (!marked[w])
			{
				edgeTo[w] = e;
				dfs(g, w);
			}
			else if (onStack[w])
			{
				cycle = new Stack<DirectedEdge>();
				DirectedEdge f = e;
				while (f.from() != w)
				{
					cycle.push(f);
					f = edgeTo[f.from()];
				}
				cycle.push(f);
			}
		}

		onStack[v] = false;
	}

	public boolean hasCycle()
	{
		return cycle != null;
	}

	public Iterable<DirectedEdge> cycle()
	{
		return cycle;
	}
}
```
And this is `EdgeWeightedTopological`
```java
import edu.princeton.cs.algs4.DirectedEdge;
import edu.princeton.cs.algs4.EdgeWeightedDigraph;
import edu.princeton.cs.algs4.Stack;
import edu.princeton.cs.algs4.Queue;

public class EdgeWeightedTopological
{
	private Stack<Integer> order;
	private boolean[] marked;

	public EdgeWeightedTopological(EdgeWeightedDigraph g)
	{
		EdgeWeightedCycleFinder cf = new EdgeWeightedCycleFinder(g);
		if (!cf.hasCycle())
		{
			order = new Stack<Integer>();
			marked = new boolean[g.V()];

			for (int v = 0; v < g.V(); v++)
				if (!marked[v])
					dfs(g, v);
		}
	}

	private void dfs(EdgeWeightedDigraph g, int v)
	{
		marked[v] = true;

		for (DirectedEdge e : g.adj(v))
		{
			int w = e.to();
			if (!marked[w])
				dfs(g, w);
		}

		order.push(v);
	}

	public boolean isDAG()
	{
		return order != null;
	}

	public Iterable<Integer> order()
	{
		return order;
	}
}
```
