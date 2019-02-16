# Chapter 1 / Section 5 : Case study: union-find
## Main Content
In this section, an algorithm called **union-find** is introduced to emphasize the following themes.
1. Good algorithms can make the difference between being able to solve a practical problem and not being able to address it at all.
2. An efficient algorithm can be as simple to code as an inefficient one. 
3. Understanding the performance characteristics of an implementation can be an interesting and satisfying intellectual challenge.
4. The scientific method is an important tool in helping us choose among different methods for solving the same problem.
5. An iterative refinement process can lead to increasingly efficient algorithms.

When possible, this book will follow same basic steps for fundamental problems throughout the book that have taken for
*union–find* algorithms in this section, some of which are highlighted in this list:
1. decide on a complete and specific problem statement, including identifying fundamental abstract operations that are intrinsic to the problem and an API.
2. Carefully develop a succinct implementation for a straightforward algorithm, using a well-thought-out development client and realistic input data.
3. know when an implementation could not possibly be used to solve problems on the scale contemplated and must be improved or abandoned.
4. Develop improved implementations through a process of stepwise refinement, validating the efficacy of ideas for improvement through empirical analysis, mathematical analysis, or both.
5. Find high-level abstract representations of data structures or algorithms in operation that enable effective high-level design of improved versions.
6. Strive for worst-case performance guarantees when possible, but accept good performance on typical data when available.
7. Know when to leave further improvements for detailed in-depth study to skilled researchers and move on to the next problem.

Here is the API of Union-find : (image from the text book)

![union-find](../img/union-find.png)

This is the structure of its implementation, method `find()` and `union()` will have different implementations : 

```java
public class UF
{
    private int[] id;
    private int count;
    
    public UF(int N)
    {
        count = N;
        id = new int[N];
        for (int i = 0; i < N; i++)
            id[i] = i;
    }
    
    public int count()
    { return count; }
    
    public boolean connected(int p, int q)
    { return find(p) == find(q); }
    
    public int find(int p) {}
    public void union(int p, int q) {}
    // two important method waited to be implemented
    
    public static void main(String[] args)
    {
        int N = StdIn.readInt();
        UF uf = new UF(N);
        while (!StdIn.isEmpty())
        {
            int p = StdIn.readInt();
            int q = StdIn.readInt();
            if (uf.connected(p, q)) continue;
            uf.union(p, q);
            StdOut.println(p + " " + q);
        }
        StdOut.println(uf.count() + " components");
    }
}
```

### 1. Quick-find

The first implementation is called *quick-find*, its idea is to use the value of `id[i]` to record which component `i` is in, here is a picture that describe its principle : (image from the text book)

![quick-find overview](../img/quick-find.png)

So the `find()` is very simple and quick, but `union()` has to go through the array :

```java
public int find(int p)
{ return id[p]; }

public void union(int p, int q)
{
    int pID = id[p];
    int qID = id[q];
    if (pID == qID) return;
    for (int i = 0; i < N; i++)
        if (id[i] == pID)
            id[i] = qID;
    count--;
}
```

Quick-find analysis :

> one array access for each call to `find()`
>
> N+3 to 2N+1 array accesses for each call to `union()`

If we use this implementation and get one single component at last, it will need (N+3)(N-1) ~ N^2^  array accesses, so this is a **quadratic-time** process.

### 2. Quick-union

The second implementation is called *quick-union*, it use the idea of trees : let the value of `id[i]` represent its father node, if a site's father node is itself, so called it is a *root*. If two site has same root, then they are in the same component. Here is its overview : (image from the text book)

![quick-union overview](../img/quick-union.png)

So the `union()` method became easy, but `find()` became a little more confused :

```java
public int find(int p)
{
    while (p != id[p])
        p = id[p];
    return p;
}

public voud union(int p, int q)
{
    int pRoot = find(p);
    int qRoot = find(q);
    if (pRoot == qRoot) return;
    id[pRoot] = qRoot;
    count--;
}
```

Quick-union analysis :

> 2 * depth of the node + 1 when call to `find()`
>
> the cost of two `find()` when call to `union()`, and will plus one if the given two sites are in different roots

So in the worst case, it still is a **quadratic-time** process : (image from the text book)

![worst-case-of-quick-union](../img/worst-case-of-quick-union.png)

### 3. Weighted Quick-Union

To avoid the worst case in *quick union*, we just need to modify it a little bit : instead of arbitrarily connecting two trees, we keep tracking the size of each tree and always connect the smaller tree to the larger. Here is a contrast between quick union and weighted quick union : (image from the text book)

![contrast](../img/contrast.png)

Here is its complete implementation :

```java
public class WeightedQuickUnion
{
    private int[] id;
    private int[] sz;
    private int count;
    
    public WeightedQuickUnion(int N)
    {
        count = N;
        id = new int[N];
        sz = new int[N];
        for (int i = 0; i < N; i++)
        {
            id[i] = i;
            sz[i] = 1;
        }
    }
    
    public int count() 
    { return count; }
    
    public boolean connected(int p, int q)
    { return find(p) == find(q); }
    
    public int find(int p)
    {
        while (p != id[p])
            p = id[p];
        return p;
    }
    
    public void union(int p, int q)
    {
        int i = find(p);
        int j = find(q);
        if (i == j) return;
        if (sz[i] < sz[j]) 
        {
            id[i] = j;
            sz[j] += sz[i];
        }
        else
        {
            id[j] = i;
            sz[i] += sz[j];
        }
        count--;
    }
}
```

Weighted quick-union analysis :

> For N sites, the cost of worst case when call to `find()`, `connected()` and `union()` are log N.

And here is a table of the performance characteristics of different *union-find* algorithms : (image from text book)

![union-find-table](../img/union-find-table.png)

## Exercise

### 1.5.12 Quick-union with path compression.
> Modify quick-union (page 224) to include path compression, by adding a loop to union() that links every site on the paths from p and q to the roots of their trees to the root of the new tree. Give a sequence of input pairs that causes this method to produce a path of length 4.

This is my solution:
```java
private int find(int p)
	{
		Stack<Integer> s = new Stack<Integer>();
		while (p != id[p])
		{
			s.push(p);
			p = id[p];
		}
		s.pop(); 		// the top element has already pointed to the root
		for (int i = 0; i < s.size(); i++)
			id[s.pop()] = p;
		return p;
	}
```
Comparing to the solution on the website of the book, mine seems to be stupid...Because the connection between nodes has already been recorded, so there is no need to save them in another place. Here is the solution on the website: 
```java
    public int find(int p) {
        int root = p;
        while (root != id[root])
            root = id[root];
        while (p != root) {
            int newp = id[p];
            id[p] = root;
            p = newp;
        }
        return root;
    }
```

### 1.5.14 Weighted quick-union by height.
> Develop a UF implementation that uses the same basic strategy as weighted quick-union but keeps track of tree height and always links the shorter tree to the taller one. Prove a logarithmic upper bound on the height of the trees for N sites with your algorithm.

This is also not difficult, the tree's height will only grow by one when two same height trees are going to union. And my code is as follow:
```java
public class HeightedQuickUnion
{
	private int[] id;
	private int[] ht;
	private int count;

	public HeightedQuickUnion(int N)
	{
		count = N;
		id = new int[N];
		for (int i = 0; i < N; i++)
			id[i] = i;
		ht = new int[N];
	}

	public int count()
	{
		return count;
	}

	public boolean connected(int p, int q)
	{
		return find(p) == find(q);
	}

	public int find(int p)
	{
		while (p != id[p])
			p = id[p];
		return p;
	}

	public void union(int p, int q)
	{
		int i = find(p);
		int j = find(q);

		if (i == j)
			return;

		if (ht[i] < ht[j])
			id[i] = j;
		else if (ht[i] > ht[j])
			id[j] = i;
		else
		{
			id[i] = j;
			ht[j]++;
		}
		count--;
	}
}
```
To prove a logarithmic upper bound on the height of the trees for N sites is quite the same with the textbook.

### 1.5.16 Amortized costs plots.
> Instrument your implementations from Exercise 1.5.7 to make amortized costs plots like those in the text.

I always find drawing has a lot of fun, so I will do this exercise.
Here is the code for QucikFindUF:
```java
import edu.princeton.cs.algs4.StdDraw;
import edu.princeton.cs.algs4.StdIn;

public class QuickFindUF
{
	private int[] id;
	private int count;

	public QuickFindUF(int N)
	{
		count = N;
		id = new int[N];
		for (int i = 0; i < N; i++)
			id[i] = i;
	}

	public int count()
	{
		return count;
	}

	public boolean connected(int p, int q)
	{
		return find(p) == find(q);
	}

	public int find(int q)
	{
		return id[q];
	}

	public int union(int p, int q)
	{
		int cost = 2;
		int pID = find(p);
		int qID = find(q);

		if (pID == qID)
			return cost;

		for (int i = 0; i < id.length; i++)
		{
			cost++;
			if (id[i] == pID)
			{
				cost++;
				id[i] = qID;
			}
		}
		count--;
		return cost;
	}

	public static void main(String[] args)
	{
		int N = StdIn.readInt();
		QuickFindUF qfuf = new QuickFindUF(N);
		int total = 0;
		int cost;
		int i = 0;
		
		StdDraw.setXscale(-100.0, 1000.0);
		StdDraw.setYscale(-100.0, 1900.0);
		StdDraw.line(-10.0, 0.0, 900, 0.0);
		StdDraw.line(0.0, -10.0, 0.0, 1800);
		StdDraw.text(-50.0, 0.0, "0");
		StdDraw.text(900, -50.0, "900");
		StdDraw.text(0.0, -50.0, "0");
		StdDraw.text(-50.0, 1800, "1800");

		StdDraw.setPenRadius(0.004);
		while (!StdIn.isEmpty())
		{
			int p = StdIn.readInt();
			int q = StdIn.readInt();
			
			if (qfuf.connected(p, q))
				cost = 2;
			else
				cost = qfuf.union(p, q);
			total += cost;

			StdDraw.setPenColor(StdDraw.BLACK);
			StdDraw.point(i, cost);
			StdDraw.setPenColor(StdDraw.PRINCETON_ORANGE);
			StdDraw.point(i, total / (i + 1));

			i++;
		}
	}
}
```
And we can get the picture like this:

![](../img/QFUFDraw.jpg)

And code and picture for QuickUnionUF:
```java
import edu.princeton.cs.algs4.StdDraw;
import edu.princeton.cs.algs4.StdIn;

public class QuickUnionUF
{
	private int[] id;
	private int count;

	public QuickUnionUF(int N)
	{
		count = N;
		id = new int[N];
		for (int i = 0; i < N; i++)
			id[i] = i;
	}

	public int count()
	{
		return count;
	}

	public boolean connected(int p, int q, int[] cost, int i, int j)
	{
		return find(p, cost, i) == find(q, cost, j);
	}

	public int find(int p, int[] cost, int i)
	{
		int co = 0;
		while (p != id[p])
		{
			co++;
			p = id[p];
		}
		cost[i] = co;
		return p;
	}

	public int union(int p, int q)
	{
		int[] cost = new int[2];
		int pRoot = find(p, cost, 0);
		int qRoot = find(q, cost, 1);

		if (pRoot == qRoot)
			return cost[0] + cost[1];
		
		id[pRoot] = qRoot;
		count--;
		return cost[0] + cost[1] + 1;
	}

	public static void main(String[] args)
	{
		int N = StdIn.readInt();
		QuickUnionUF quuf = new QuickUnionUF(N);
		int total = 0;
		int[] cost = new int[900];
		int i = 0;
		
		StdDraw.setXscale(-100.0, 1000.0);
		StdDraw.setYscale(-100.0, 200.0);
		StdDraw.line(-10.0, 0.0, 900, 0.0);
		StdDraw.line(0.0, -10.0, 0.0, 100);
		StdDraw.text(-30.0, 0.0, "0");
		StdDraw.text(900, -20.0, "900");
		StdDraw.text(0.0, -20.0, "0");
		StdDraw.text(-50.0, 100, "100");

		StdDraw.setPenRadius(0.004);
		while (!StdIn.isEmpty())
		{
			int p = StdIn.readInt();
			int q = StdIn.readInt();
			int[] tmp = new int[2];
			
			if (quuf.connected(p, q, tmp, 0, 1))
				cost[i] = tmp[0] + tmp[1];
			else
				cost[i] = quuf.union(p, q);
			total += cost[i];

			StdDraw.setPenColor(StdDraw.BLACK);
			StdDraw.point(i, cost[i]);
			StdDraw.setPenColor(StdDraw.PRINCETON_ORANGE);
			StdDraw.point(i, total / (i + 1));

			i++;
		}
	}
}
```

![](../img/QUUFDraw.jpg)

### 1.5.17 Random connections.
> Develop a UF client ErdosRenyi that takes an integer value N from the command line, generates random pairs of integers between 0 and N-1 , calling connected() to determine if they are connected and then union() if not (as in our development client), looping until all sites are connected, and printing the number of connections generated. Package your program as a static method count() that takes N as argument and returns the number of connections and a main() that takes N from the command line, calls count() , and prints the returned value.

I will draw the grid so that 1.5.18 and 1.5.19 are also completed. So here is the code:
```java
import edu.princeton.cs.algs4.WeightedQuickUnionUF;
import edu.princeton.cs.algs4.StdDraw;
import edu.princeton.cs.algs4.StdRandom;

public class ErdosRenyi
{
	private class Connection
	{
		int p;
		int q;

		public Connection(int p, int q)
		{
			this.p = p;
			this.q = q;
		}
	}

	public void generate(int N)
	{
		WeightedQuickUnionUF uf = new WeightedQuickUnionUF(N * N);

		while (uf.count() != 1)
		{
			Connection c = createPair(N);
			if (uf.connected(c.p, c.q))
				continue;
			uf.union(c.p, c.q);
			
			double p1x = ((int) (c.p % N) + 1)*10.0;
			double p1y = ((int) (c.p / N) + 1)*10.0;
			double p2x = ((int) (c.q % N) + 1)*10.0;
			double p2y = ((int) (c.q / N) + 1)*10.0;
			StdDraw.line(p1x, p1y, p2x, p2y);
		}
	}

	private Connection createPair(int N)
	{
		int p = StdRandom.uniform(N * N);
		int q;
		if (p % N == 0) //left edge
		{
			if (p == 0)
			{
				int dir = StdRandom.uniform(2);
				if (dir == 0)
					q = p + 1;
				else
					q = p + N;
			}
			else if (p == N * (N-1))
			{
				int dir = StdRandom.uniform(2);
				if (dir == 0)
					q = p + 1;
				else
					q = p - N;
			}
			else
			{
				int dir = StdRandom.uniform(3);
				if (dir == 0)
					q = p - N;
				else if (dir == 1)
					q = p + 1;
				else
					q = p + N;
			}
		}
		else if ((p+1) % N == 0) //right edge
		{
			if (p == N - 1)
			{
				int dir = StdRandom.uniform(2);
				if (dir == 0)
					q = p - 1;
				else
					q = p + N;
			}
			else if (p == N*N - 1)
			{
				int dir = StdRandom.uniform(2);
				if (dir == 0)
					q = p - N;
				else 
					q = p - 1;
			}
			else
			{
				int dir = StdRandom.uniform(3);
				if (dir == 0)
					q = p - N;
				else if (dir == 1)
					q = p - 1;
				else 
					q = p + N;
			}
		}
		else if (p < N && p > 0) //top edge
		{
			int dir = StdRandom.uniform(3);
			if (dir == 0)
				q = p + 1;
			else if (dir == 1)
				q = p + N;
			else
				q = p - 1;
		}
		else if (p < N*N && p > N*(N-1)) //bottom edge
		{
			int dir = StdRandom.uniform(3);
			if (dir == 0)
				q = p - 1;
			else if (dir == 1)
				q = p - N;
			else
				q = p + 1;
		}
		else
		{
			int dir = StdRandom.uniform(4);
			if (dir == 0)
				q = p - 1;
			else if (dir == 1)
				q = p - N;
			else if (dir == 2)
				q = p + 1;
			else
				q = p + N;
		}
		Connection c = new Connection(p, q);
		return c;
	}

	public static void main(String[] args)
	{
		int N = Integer.parseInt(args[0]);
		StdDraw.setXscale(0.0, (N+1)*10);
		StdDraw.setYscale(0.0, (N+1)*10);
		StdDraw.setPenRadius(0.01);
		StdDraw.setPenColor(StdDraw.GRAY);

		for (int i = 0; i < N; i++)
		{
			double x = (i+1)*10.0;
			for (int j = 0; j < N; j++)
			{
				double y = (j+1)*10.0;
				StdDraw.point(x, y);
			}
		}
		
		StdDraw.setPenRadius(0.005);
		StdDraw.setPenColor(StdDraw.BLACK);
		ErdosRenyi e = new ErdosRenyi();
		e.generate(N);
	}
}
```
And these two picture are the result of 25X25 and 50X50:

![](../img/RandomGrid25*25.jpg)

![](../img/RandomGrid50*50.jpg)
