# Chapter 4 / Section 3 : Minimum Spanning Trees

## Main Content

The definition of *minimum spanning tree* (MST) is :

> A minimum spanning tree of an edge-weighted graph is a spanning tree whose weight is no larger than the weight of any other spanning tree.

### 1. Underlying principles

Two basic properties of tree that can prove a fundamental property of MST :

- Adding an edge that connects two vertices in a tree creates a unique cycle
- Removing an edge from a tree breaks it into two separate subtrees

**Cut** and **crossing edge** :

> A cut of a graph is a partition of its vertices into two nonempty disjoint sets.
>
> A crossing edge of a cut is an edge that connects a vertex in one set with a vertex in the other.

**Cut property** :

> Given any cut in an edge-weighted graph, the crossing edge of minimum weight is in the MST of the graph.

**Greedy MST algorithm** :

> The following method colors black all edges in the MST of any connected edge-weight graph with V vertices: starting with all edges colored gray, find a cut with no black edges, color its minimum-weight edge black, and continue until V-1 edges have been colored black.

Here is its trace : (image from text book)

![Greedy MST algorithm](../img/GreedyMSTAlgorithm.png)

### 2. Edge-weighted graph data type

First we define a `Edge` object : (image from text book)

![Edge API](../img/EdgeAPI.png)

```java
public class Edge
{
    private int v;
    private int w;
    private double weight;
    
    public Edge(int v, int w, double weight)
    {
        this.v = v;
        this.w = w;
        this.weight = weight;
    }
    
    public double weight() { return weight; }
    
    public int either() { return v; }
    
    public int other(int v)
    {
        if (v == this.v) return w;
        else if (v == this.w) return v;
        else throw new RunTimeException("Inconsistent edge");
    }
    
    public int compareTo(Edge that)
    {
        if (this.weight() < that.weight()) return -1;
        else if (this.weight() > that.weight()) return +1;
        else return 0;
    }
    
    public String toString()
    { return String.format("%d-%d %.2f", v, w, weight); }
}
```

Then we define the class of `EdgeWeightedGraph` by using the `Edge` object in a natural manner : (image from text book)

![EdgeWeightGraph API](../img/EdgeWeightGraphAPI.png)

```java
public class EdgeWeightedGraph
{
    private Bag<Edge>[] adj;
    private int E;
    private int V;
    
    public EdgeWeightedGaph(int V)
    {
        this.V = V;
        this.E = 0;
        adj = (Bag<Edge>[]) new Bag[V];
        for (int v = 0; v < V; v++)
            adj[v] = new Bag<Edge>();
    }
    
    public int V() { return V; }
    public int E() { return E; }
    
    public void addEdge(Edge e)
    {
        int v = e.either();
        int w = e.other(v);
        adj[v].add(e);
        adj[w].add(e);
        E++;
    }
    
    public Iterable<Edge> adj(int v) { return adj[v]; }
    
    public Iterable<Edge> edges()
    {
        Bag<Edge> bag = new Bag<>();
        for (int v = 0; v < V; v++)
            for (Edge e : adj[v])
                if (e.other(v) > v)
                    bag.add(e);
        return bag;
    }
}
```

### 3. Prim's algorithm

The following figure shows its principle : (image from text book)

![Prim's MST algorithm](../img/PrimMSTAlgorithm.png)

We first implement its lazy version :

```java
public class LazyPrimMST
{
    private boolean[] marked;
    private MinPQ<Edge> pq;
    private Queue<Edge> mst;
    
    public LazyPrimMST(EdgeWeightedGraph G)
    {
        marked = new boolean[G.V()];
        pq = new MinPQ<Edge>();
        mst = new Queue<Edge>();
        
        visit(G, 0);
        while (!pq.isEmpty())
        {
            Edge e = pq.delMin();
            int v = e.either();
            int w = e.other(v);
            if (marked[v] && marked[w]) continue;
            mst.enqueue(e);
            if (!marked[v]) visit(G, v);
            if (!marked[w]) visit(G, w);
        }
    }
    
    private void visit(EdgeWeightedGraph G, int v)
    {
        marked[v] = true;
        for (Edge e : G.adj(v))
            if (!marked[e.other[v]])
                pq.insert(e);
    }
}
```

This is its trace : (image from text book)

![Trace of Lazy Prim MST](../img/LazyPrimMSTTrace.png)

**Lazy Prim MST analysis** :

> The lazy version of Prim's algorithm uses space proportional to E and time proportional to ElogE (in the worst case) to compute the MST of a connected edge-weighted graph with E edges and V vertices.

Then implement its eager version :

```java
public class PrimMST
{
    private Edge[] edgeTo;
    private double[] distTo;
    private boolean[] marked;
    private IndexMinPQ<Double> pq;
    
    public PrimMST(EdgeWeightedGraph G)
    {
        edgeTo = new Edge[G.V()];
        distTo = new double[G.V()];
        for (int v = 0; v < G.V(); v++)
            distTo[v] = Double.POSITIVE_INFINITY;
        marked = new boolean[G.V()];
        pq = new IndexMinPQ<Double>(G.V());
        
        distTo[0] = 0.0;
        pq.insert(0, 0.0);
        
        while (!pq.isEmpty())
        {
            int v = delMin();
            marked[v] = true;
            for (Edge e : G.adj(v))
            {
                int w = e.other(v);
                if (marked[w]) continue;
                if (disTo[w] > e.weight())
                {
                    disTo[w] = e.weight();
                    edgeTo[w] = e;
                    if (!pq.contains(w)) pq.insert(w, distTo[w]);
                    else 				 pq.change(w, distTo[w]);
                }
            }
        }
    }
}
```

Here is its trace : (image from text book)

![Trace of eager prim MST](../img/EagerPrimMSTTrace.png)

**Eager prim MST analysis** :

> The eager version of Prim's algorithm uses extra space proportional to V and time proportional to ElogV in the worst case to compute the MST of a connected edge-weighted graph with E edges and V vertices.

### 4. Kruskal's algorithm

Prim's algorithm builds the MST one edge at a time, finding a new edge to attach to a single growing tree at each step. Kruskal's algorithm also build the MST one edge at a time, but, by contrast, it finds an edge that connects two trees in a forest of growing trees.

```java
public class KruskalMST
{
    private Queue<Edge> mst;
    
    public KruskalMST(EdgeWeightedGraph G)
    {
        mst = new Queue<Edge>();
        UF uf = new UF(G.V());
        MinPQ<Edge> pq = new MinPQ<>();
        for (Edge e : G.edges())
            pq.insert(e);
        while (!pq.isEmpty() && mst.size() < G.V()-1)
        {
            Edge e = pq.delMin();
            int v = e.either();
            int w = e.other(v);
            if (uf.connected(v, w)) continue;
            uf.union(v, w);
            mst.enqueue(e);
        }
    }
}
```

This is the trace of it : (image from text book)

![Trace of Kruskal MST](../img/KruskalMSTTrace.png)

**Kruskal MST analysis** :

> Kruskal's algorithm uses space proportional to E and time proportional to ElogE in the worst case to compute the MST of an edge-weighted connected graph with E edges and V vertices.

The follow figure is the comparison of two algorithm :

![Prim and Kruskal comparison](../img/PrimKruskalMSTComparison.png)

The table below summarizes the performance characteristics of different MST algorithm :

![MST Summary](../img/MSTSummary.png)

## Exercise
### 4.3.9
> Implement the constructor for EdgeWeightedGraph that reads a graph from the input stream, by suitably modifying the constructor from Graph (see page 526).

It is exactly the same as previous section: 
```java
public MyEdgeWeightedGraph(In in)
{
	this(Integer.parseInt(in.readLine()));
	in.readLine();
	while (in.hasNextLine())
	{
		String[] a = in.readLine().split("\\s+");
		int v = Integer.parseInt(a[0]);
		int w = Integer.parseInt(a[1]);
		double weight = Double.parseDouble(a[2]);
		addEdge(new MyEdge(v, w, weight));
	}
}
```

### 4.3.16 
> Given an MST for an edge-weighted graph G and a new edge e, write a program that determines the range of weights for which e is in an MST.

When add a new edge, a cycle will be created. So only if its weight is lower than the maximum weight edge of the cycle, it would be added into a MST. I use `dfs()` to find the cycle, which is just the path from new edge's one vertex to the other, so there is no need to actually put the new edge in the graph and creat a real cycle. Then `range()` will calculate the maximum weight in that cycle.
```java
import edu.princeton.cs.algs4.Edge;
import edu.princeton.cs.algs4.EdgeWeightedGraph;
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.PrimMST;
import edu.princeton.cs.algs4.In;

public class AddNewEdgeInMST
{
	private Edge[] pathTo;
	private boolean[] marked;
	private EdgeWeightedGraph ng;

	public AddNewEdgeInMST(EdgeWeightedGraph g)
	{
		PrimMST mst = new PrimMST(g);
		ng = new EdgeWeightedGraph(g.V());
		for (Edge e : mst.edges())
			ng.addEdge(e);
		pathTo = new Edge[g.V()];
		marked = new boolean[g.V()];
	}

	public double range(int v, int w)
	{
		dfs(ng, v);
		
		int x = w;
		double max = Double.NEGATIVE_INFINITY;
		while (x != v)
		{
			Edge t = pathTo[x];
			if (t.weight() > max)
				max = t.weight();
			x = t.other(x);
		}
		return max;
	}

	public void print(int v, int w)
	{
		StdOut.println("The cycle created by e : ");
		for (int x = w; x != v; x = pathTo[x].other(x))
			StdOut.println(pathTo[x]);
	}

	private void dfs(EdgeWeightedGraph g, int v)
	{
		marked[v] = true;
		for (Edge e : g.adj(v))
		{
			int w = e.other(v);
			if (!marked[w])
			{
				pathTo[w] = e;
				dfs(g, w);
			}
		}
	}

	public static void main(String[] args)
	{
		EdgeWeightedGraph g = new EdgeWeightedGraph(new In(args[0]));
		AddNewEdgeInMST nmst = new AddNewEdgeInMST(g);
		
		int v = Integer.parseInt(args[1]);
		int w = Integer.parseInt(args[2]);
		StdOut.println("Add new edge [" + v + "-" + w + "], its weight must lower than : " + nmst.range(v, w));
		nmst.print(v, w);
	}
}
```
Here is the test result which I think can prove its correctness:
```
$ java AddNewEdgeInMST tinyEWG.txt 4 6
Add new edge [4-6], its weight must lower than : 0.4
The cycle created by e : 
6-2 0.40
0-2 0.26
0-7 0.16
5-7 0.28
4-5 0.35
```
And if the new edge is already in the MST, it will work too. This means to create a parallel edge.
```
$ java AddNewEdgeInMST tinyEWG.txt 2 3
Add new edge [2-3], its weight must lower than : 0.17
The cycle created by e : 
2-3 0.17
```

### 4.3.24 Reverse-delete algorithm.
> Develop an implementation that computes the MST as follows: Start with a graph containing all of the edges. Then repeatedly go through the edges in decreasing order of weight. For each edge, check if deleting that edge will disconnect the graph; if not, delete it. Prove that this algorithm computes the MST. What is the order of growth of the number of edge-weight compares performed by your implementation?

I use a `MaxPQ` to store all the edges and a `Queue` to store the edges that is in the MST. When delete a maximum edge of current `MaxPQ`, create a new `EdgeWeigetedGraph` that contains all the rest edges in the `MaxPQ` and all the edges in the `Queue`. Then use `dfs` to check if the Graph is still connected. If is, just step to next edge, if not, add it to the `Queue`.
```java
import edu.princeton.cs.algs4.Edge;
import edu.princeton.cs.algs4.EdgeWeightedGraph;
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.MaxPQ;
import edu.princeton.cs.algs4.Queue;
import edu.princeton.cs.algs4.In;

public class ReverseDelete
{
	private Queue<Edge> mst;
	private MaxPQ<Edge> pq;
	private final int V;

	public ReverseDelete(EdgeWeightedGraph g)
	{
		mst = new Queue<Edge>();
		pq = new MaxPQ<Edge>();
		this.V = g.V();

		for (Edge e : g.edges())
			pq.insert(e);

		while (!pq.isEmpty())
		{
			Edge e = pq.delMax();

			if (stillConnected())
				continue;
			else
				mst.enqueue(e);
		}
	}

	private boolean stillConnected()
	{
		EdgeWeightedGraph g = new EdgeWeightedGraph(V);
		for (Edge e : pq)
			g.addEdge(e);
		for (Edge e : mst)
			g.addEdge(e);
		boolean[] marked = new boolean[g.V()];
		dfs(g, 0, marked);

		for (int i = 0; i < marked.length; i++)
			if (marked[i] == false)
				return false;

		return true;
	}

	private void dfs(EdgeWeightedGraph g, int v, boolean[] marked)
	{
		marked[v] = true;

		for (Edge e : g.adj(v))
		{
			int w = e.other(v);
			if (!marked[w])
				dfs(g, w, marked);
		}
	}

	public Iterable<Edge> edges()
	{
		return mst;
	}

	public double weight()
	{
		double weight = 0.0;
		for (Edge e : edges())
			weight += e.weight();
		return weight;
	}

	public static void main(String[] args)
	{
		In in = new In(args[0]);
		EdgeWeightedGraph g = new EdgeWeightedGraph(in);

		ReverseDelete mst = new ReverseDelete(g);

		for (Edge e : mst.edges())
			StdOut.println(e);
		StdOut.println(mst.weight());
	}
}
```

### 4.3.27 Animations.
> Write a client program that does dynamic graphical animations of MST algorithms. Run your program for mediumEWG.txt to produce images like the figures on page 621 and page 624.

My program doesn't process images for mediumEWG.txt, instead, it create a random EdgeWeightedGraph and draw its MST :
```java
import edu.princeton.cs.algs4.Edge;
import edu.princeton.cs.algs4.EdgeWeightedGraph;
import edu.princeton.cs.algs4.StdDraw;
import edu.princeton.cs.algs4.ST;
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.LazyPrimMST;
import edu.princeton.cs.algs4.KruskalMST;

public class EuclideanEdgeWeightedGraph
{
	private ST<Integer, Point> st;
	private EdgeWeightedGraph g;

	private class Point
	{
		double x;
		double y;

		public Point(double x, double y)
		{
			this.x = x;
			this.y = y;
		}

		public double X()
		{
			return x;
		}

		public double Y()
		{
			return y;
		}

		public double distance(Point that)
		{
			double a = this.x - that.X();
			double b = this.y - that.Y();
			return Math.sqrt(a*a + b*b);
		}
	}

	public EuclideanEdgeWeightedGraph(int V, double d)
	{
		st = new ST<Integer, Point>();
		g = new EdgeWeightedGraph(V);
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
				double weight = st.get(v).distance(st.get(w));
				if (weight < d)
					g.addEdge(new Edge(v, w, weight));
			}
		}
	}

	public void draw()
	{
		for (int v = 0; v < g.V(); v++)
		{
			StdDraw.setPenColor(StdDraw.BLACK);
			StdDraw.point(st.get(v).X(), st.get(v).Y());
			StdDraw.setPenRadius();
			StdDraw.setPenColor(StdDraw.GRAY);
			for (Edge e : g.adj(v))
			{
				int w = e.other(v);
				if (w > v)
					StdDraw.line(st.get(v).X(), st.get(v).Y(), st.get(w).X(), st.get(w).Y());
			}
		}
	}

	public EdgeWeightedGraph graph()
	{
		return g;
	}

	public void draw(Edge e)
	{
		int v = e.either();
		int w = e.other(v);

		StdDraw.setPenRadius(0.008);
		StdDraw.setPenColor(StdDraw.PRINCETON_ORANGE);
		StdDraw.line(st.get(v).X(), st.get(v).Y(), st.get(w).X(), st.get(w).Y());
		StdDraw.pause(100);
	}

	public static void main(String[] args)
	{
		int V = Integer.parseInt(args[0]);
		double d = Double.parseDouble(args[1]);
		String s = args[2];
		EuclideanEdgeWeightedGraph eg = new EuclideanEdgeWeightedGraph(V, d);
		eg.draw();

		EdgeWeightedGraph g = eg.graph();
		if (s.equals("Prim"))
		{
			LazyPrimMST mst = new LazyPrimMST(g);
			for (Edge e : mst.edges())
				eg.draw(e);
		}
		else if (s.equals("Kruskal"))
		{
			KruskalMST mst = new KruskalMST(g);
			for (Edge e : mst.edges())
				eg.draw(e);
		}
		else
			throw new IllegalArgumentException(s + ": not a valid MST method");

	}
}
```
Here are the two animations generated by those code:

![](../img/Prim.gif)

![](../img/Kruskal.gif)
