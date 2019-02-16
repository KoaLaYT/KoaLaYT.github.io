# Chapter 3 / Section 5 : Applications
## Main Content
The following table summarizes the performance characteristics of the symbol-table algorithm :

![Cost summary for ST](../img/CostSummartForAllST.png)

## Exercise
### 3.5.17 Mathematical sets.
This is my implementation of the API *MathSET* :
```java
import edu.princeton.cs.algs4.LinearProbingHashST;
import edu.princeton.cs.algs4.StdOut;

public class MathSET<Key>
{
	private LinearProbingHashST<Key, Boolean> st;
	private int N;
	private int M;

	public MathSET(Key[] universe)
	{
		int n = universe.length;

		st = new LinearProbingHashST<Key, Boolean>();

		for (int i = 0; i < n; i++)
			st.put(universe[i], false);

		this.N = 0;
		this.M = n;
	}

	public void add(Key key)
	{
		st.put(key, true);
		N++;
	}

	public MathSET<Key> complement()
	{
		int i = 0;
		Key[] universe = (Key[]) new Object[M];
		for (Key k : st.keys())
			universe[i++] = k;

		MathSET<Key> cst = new MathSET<>(universe);
		for (Key k : st.keys())
		{
			if (st.get(k) == false)
				cst.add(k);
		}

		return cst;
	}

	private Key[] keys()
	{
		Key[] tmp = (Key[]) new Object[N];
		int i = 0;
		for (Key k : st.keys())
			if (st.get(k) == true)
				tmp[i++] = k;
		return tmp;
	}

	public void union(MathSET<Key> a)
	{
		for (Key k : a.keys())
			st.put(k, true);
	}

	public void intersection(MathSET<Key> a)
	{
		for (Key k : st.keys())
		{
			if (st.get(k) == true && !a.contains(k))
				st.put(k, false);
		}
	}

	public void delete(Key key)
	{
		if (st.contains(key) && st.get(key) == true)
		{
			st.put(key, false);
			N--;
		}
	}

	public boolean contains(Key key)
	{
		if (!st.contains(key))
			return false;
		else
			return st.get(key) == true;
	}

	public boolean isEmpty()
	{
		return N == 0;
	}

	public int size()
	{
		return N;
	}

	public void print()
	{
		for (Key k : st.keys())
		{
			if (st.get(k) == true)
				StdOut.print(k + " ");
		}
		StdOut.println();
	}

	public static void main(String[] args)
	{
		Integer[] universe1 = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
		Integer[] universe2 = { 0, 2, 4, 6, 8, 10 };
		MathSET<Integer> st1 = new MathSET<Integer>(universe1);
		MathSET<Integer> st2 = new MathSET<Integer>(universe2);

		st1.add(1);
		st1.add(3);
		st1.add(5);
		StdOut.print("SET1: ");
		st1.print();
		StdOut.print("And its complement: ");
		st1.complement().print();

		st2.add(2);
		st2.add(4);
		st2.add(6);
		StdOut.print("SET2: ");
		st2.print();
		StdOut.print("And its complement: ");
		st2.complement().print();

		st1.union(st2);
		StdOut.print("SET1 union SET2: ");
		st1.print();

		st1.intersection(st2);
		StdOut.print("SET1 intersection SET2: ");
		st1.print();

		st1.delete(1);
		st1.delete(2);
		StdOut.print("SET1 delete 1 & 2: ");
		st1.print();

		StdOut.println("SET1 has " + st1.size() + " elements");
	}
}
```

### 3.5.22 Fully indexed CSV.
> Implement an ST client FullLookupCSV that builds an array of ST objects (one for each field), with a test client that allows the user to specify the key and value fields in each query.

Here is the code:
```java
import edu.princeton.cs.algs4.ST;
import edu.princeton.cs.algs4.In;
import edu.princeton.cs.algs4.Queue;
import edu.princeton.cs.algs4.StdIn;
import edu.princeton.cs.algs4.StdOut;

public class FullLookupCSV
{
	public static void main(String[] args)
	{
		In tmp = new In(args[0]);
		String sp = args[1];
		String[] t = tmp.readLine().split(sp);
		int N = t.length;
		tmp.close();

		In in = new In(args[0]);

		ST<String, Queue<String>> st[] = (ST<String, Queue<String>>[]) new ST[N];
		for (int i = 0; i < N; i++)
			st[i] = new ST<String, Queue<String>>();

		while (in.hasNextLine())
		{
			String[] a = in.readLine().split(sp);
			for (int i = 0; i < N; i++)
			{
				if (!st[i].contains(a[i]))
					st[i].put(a[i], new Queue<String>());
				for (int j = 0; j < N; j++)
					st[i].get(a[i]).enqueue(a[j]);
			}
		}

		StdOut.println("Please put the key and val you want to look up: ");
			
		while (!StdIn.isEmpty())
		{
			String[] col = StdIn.readLine().split(" ");
			int keyCol = Integer.parseInt(col[0]);
			int valCol = Integer.parseInt(col[1]);

			for (String s : st[keyCol].keys())
			{
				String[] vals = st[keyCol].get(s).toString().split(" ");
				String valResult = "";
				for (int i = valCol; i < vals.length; i += N)
					valResult = valResult + vals[i] + " ";
				StdOut.println(s + " " + valResult);
			}

			StdOut.println();
			StdOut.println("Please put the key and val you want to look up: ");
		}
	}
}
```

### 3.5.24 Non-overlapping interval search.
> Given a list of non-overlapping intervals of items, write a function that takes an item as argument and determines in which, if any, interval that item lies. For example, if the items are integers and the intervals are 1643-2033 , 5532-7643 , 8999-10332 , 5666653-5669321 , then the query point 9122 lies in the third interval and 8122 lies in no interval.

The code is as follow:
```java
import edu.princeton.cs.algs4.ST;
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.StdIn;

public class IntervalSearch
{
	public static void main(String[] args)
	{
		ST<Integer, String> st = new ST<>();

		st.put(1, "1643-2033");
		st.put(2, "5532-7643");
		st.put(3, "8999-10332");
		st.put(4, "5666653-5669321");

		StdOut.println("Please input your query integer: ");
		while (!StdIn.isEmpty())
		{
			int query = StdIn.readInt();
			int flag = 0;

			for (Integer i : st.keys())
			{
				String[] s = st.get(i).split("-");
				int lo = Integer.parseInt(s[0]);
				int hi = Integer.parseInt(s[1]);
				if (query >= lo && query <= hi)
				{
					flag = 1;
					StdOut.println(query + " is in the #" + i + " interval");
					break;
				}
			}
			if (flag == 0)
				StdOut.println("No interval can find " + query);

			StdOut.println("Please input your next query integer: ");
		}
	}
}
```
