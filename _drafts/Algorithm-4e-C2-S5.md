# Chapter 2 / Section 5 : Applications
## Main Content
The performance characteristics of different sorting algorithm : (image from text book)

![performance](../img/SortPerformance.png)

## Exercise
### 2.5.13 Load balancing.
> Write a program LPT.java that takes an integer M as a command-line argument, reads job names and processing times from standard input and prints a schedule assigning the jobs to M processors that approximately minimizes the time when the last job completes using the longest processing time first rule, as described on page 349.

Here is the code, where I set the mission number to 10 to simplify it:
```java
import edu.princeton.cs.algs4.IndexMinPQ;
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.Quick;
import edu.princeton.cs.algs4.Queue;

public class LoadingBalance
{
	private class Mission implements Comparable<Mission>
	{
		String name;
		int time;

		public Mission(String n, int t)
		{
			name = n;
			time = t;
		}

		public int compareTo(Mission that)
		{
			return this.time - that.time;
		}

		public String toString()
		{
			return name + ": [" + time + "s]";
		}
	}

	private class Processor implements Comparable<Processor>
	{
		Queue<Mission> q = new Queue<Mission>();
		int index;
		int priority;

		public Processor(int i)
		{
			index = i;
			priority = 0;
		}

		public int compareTo(Processor that)
		{
			return this.priority - that.priority;
		}

		public void takeMission(Mission m)
		{
			q.enqueue(m);
			priority += m.time;
		}

		public String toString()
		{
			return "total loading time: " + priority + ". Mission: " + q;
		}
	}

	private void genMissions(Mission[] m)
	{
		for (int i = 0; i < m.length; i++)
		{
			String s = "Mission-" + (i+1);
			m[i] = new Mission(s, StdRandom.uniform(20));
		}
	}

	public static void main(String[] args)
	{
		int M = Integer.parseInt(args[0]);

		LoadingBalance lb = new LoadingBalance();
		Mission[] m = new Mission[10];
		lb.genMissions(m);
		Quick.sort(m);

		IndexMinPQ<Processor> pq = new IndexMinPQ<Processor>(M);
		Processor[] p = new Processor[M];
		for (int i = 0; i < M; i++)
		{
			p[i] = lb.new Processor(i);
			pq.insert(i, p[i]);
		}

		for (int i = 9; i >= 0; i--)
		{
			int index = pq.delMin();
			p[index].takeMission(m[i]);
			pq.insert(index, p[index]);
		}

		for (int i = 0; i < M; i++)
			StdOut.println("Processor[" + i + "]: " + p[i]);
	}
}
```
So if set M = 3, the result is like this:
```
$ java LoadingBalance 3
Processor[0]: total loading time: 36. Mission: Mission-6: [19s] Mission-5: [9s] Mission-1: [6s] Mission-9: [2s] 
Processor[1]: total loading time: 37. Mission: Mission-3: [17s] Mission-7: [16s] Mission-8: [4s] 
Processor[2]: total loading time: 36. Mission: Mission-10: [19s] Mission-2: [16s] Mission-4: [1s] 
```

### 2.5.16 Unbiased election.
> In order to thwart bias against candidates whose names appear toward the end of the alphabet, California sorted the candidates appearing on its 2003 gubernatorial ballot by using the following order of characters:
R W Q O J M V A H B S G Z X N T C I E K U P D Y F L
Create a data type where this is the natural order and write a client California with a single static method main() that sorts strings according to this ordering. Assume that each string is composed solely of uppercase letters.

Here is the code:
```java
import edu.princeton.cs.algs4.Quick;
import edu.princeton.cs.algs4.StdOut;

public class UnbiasedElection
{
	private static char[] a = { 'R', 'W', 'Q', 'O', 'J', 'M', 'V', 'A', 'H', 'B', 'S', 'G', 'Z', 
				    'X', 'N', 'T', 'C', 'I', 'E', 'K', 'U' ,'P', 'D', 'Y', 'F', 'L' };
	private class Unbiased implements Comparable<Unbiased>
	{
		String s;

		public Unbiased(String string)
		{
			s = string;
		}

		private int getValue(char c)
		{
			for (int i = 0; i < a.length; i++)
			{
				if (c == a[i])
					return i;
			}
			return -1;
		}

		public int compareTo(Unbiased that)
		{
			int thislength = this.s.length();
			int thatlength = that.s.length();

			int N = Math.min(thislength, thatlength);

			for (int i = 0; i < N; i++)
			{
				char ti = this.s.charAt(i);
				char ta = that.s.charAt(i);
				if (ti == ta)
					continue;
				return this.getValue(ti) - that.getValue(ta);
			}

			return thislength - thatlength;
		}

		public String toString()
		{
			return s;
		}
	}

	public static void main(String[] args)
	{
		String[] s = { "APPLE", "QUEUE", "GOOD", "DOG", "RAT", "APP", "ABORT" };
		UnbiasedElection ue = new UnbiasedElection();
		Unbiased[] u = new Unbiased[s.length];
		for (int i = 0; i < s.length; i++)
			u[i] = ue.new Unbiased(s[i]);
		Quick.sort(u);
		for (int i = 0; i < u.length; i++)
			StdOut.println(u[i]);
	}
}
```
And the result is:
```
$ java UnbiasedElection
RAT
QUEUE
ABORT
APP
APPLE
GOOD
DOG
```

### 2.5.31 Duplicates.
> Write a client that takes integers M , N , and T as command-line arguments, then uses the code given in the text to perform T trials of the following experiment: Generate N random int values between 0 and M – 1 and count the number of duplicates. Run your program for T = 10 and N = 10 3 , 10 4 , 10 5 , and 10 6 , with M = N/2, and N, and 2N. Probability theory says that the number of duplicates should be about(1 – e ^ –a ) where a = N/M
Print a table to help you confirm that your experiments validate that formula.

So this is my code and result:
```java
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.Quick;

public class Duplicates
{
	public static void main(String[] args)
	{
		int N = Integer.parseInt(args[0]);
		int T = Integer.parseInt(args[1]);

		for (double m = 0.5; m <= 2; m *= 2)
		{
			for (int n = N; n <= 1000000; n *= 10)
			{
				int M = (int) (N * m);
				double totalcount = 0.0;
				for (int t = 0; t < T; t++)
				{
					Integer[] a = new Integer[N];
					for (int i = 0; i < N; i++)
						a[i] = StdRandom.uniform(M);
					Quick.sort(a);
					int count = 0;
					int head = 0;
					int flag = 0;
					for (int i = 1; i < N; i++)
					{
						if (a[i].compareTo(a[head]) == 0)
						{
							count++;
							flag = 1;
						}
						else 
						{
							if (flag == 1)
								count++;
							head = i;
							flag = 0;
						}
					}
					totalcount += count;
				}
				double f = 1 - Math.exp(-N/(M+0.0));
				StdOut.printf("%5.3f - %5.3f  ", totalcount/T/N, f);
			}
			StdOut.println();
		}
	}
}
```
```
$ java Duplicates 1000 100
0.864 - 0.865  0.862 - 0.865  0.865 - 0.865  0.865 - 0.865  
0.632 - 0.632  0.628 - 0.632  0.631 - 0.632  0.633 - 0.632  
0.389 - 0.393  0.394 - 0.393  0.388 - 0.393  0.393 - 0.393  
```
The column means different N while the rows means different M. The value before *-* is experiment value, while the value after *-* is formula value.

### 2.5.32 8 puzzle.
> The 8 puzzle is a game popularized by S. Loyd in the 1870s. It is played on a 3-by-3 grid with 8 tiles labeled 1 through 8 and a blank square. Your goal is to rearrange the tiles so that they are in order. You are permitted to slide one of the available tiles horizontally or vertically (but not diagonally) into the blank square. Write a program that solves the puzzle using the A* algorithm. Start by using as priority the sum of the number of moves made to get to this board position plus the number of tiles in the wrong position. (Note that the number of moves you must make from a given board position is at least as big as the number of tiles in the wrong place.) Investigate substituting other functions for the number of tiles in the wrong position, such as the sum of the Manhattan distance from each tile to its correct position, or the sums of the squares of these distances.

I didn't get all the instrutments of this exercise, so I just do it my own way, which takes really a lot time to get the final answer. I'm sure the code below have a lot space to improve, but I will show it here anyway:
```java
import edu.princeton.cs.algs4.MaxPQ;
import edu.princeton.cs.algs4.Stack;
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.StdOut;

public class EightPuzzle
{
	private class Status implements Comparable<Status>
	{
		Integer[] stat;
		int priority;
		int blank;

		public Status(Integer[] a)
		{
			stat = new Integer[9];
			for (int i = 0; i < 9; i++)
			{
				stat[i] = a[i];
				if (a[i] == -1)
					blank = i;
			}
			priority = calPriority(stat);
		}

		public int getPriority()
		{
			return priority;
		}

		public Status moveLeft()
		{
			Status st = new Status(stat);
			if (st.blank == 0)
				return null;
			st.exch(st.blank, st.blank-1);
			st.blank--;
			st.priority = calPriority(st.stat);
			return st;
		}
		
		public Status moveRight()
		{
			Status st = new Status(stat);
			if (st.blank == 8)
				return null;
			st.exch(st.blank, st.blank+1);
			st.blank++;
			st.priority = calPriority(st.stat);
			return st;
		}
		
		public Status moveUP()
		{
			Status st = new Status(stat);
			if (st.blank < 3)
				return null;
			st.exch(st.blank, st.blank-3);
			st.blank -= 3;
			st.priority = calPriority(st.stat);
			return st;
		}
		
		public Status moveDown()
		{
			Status st = new Status(stat);
			if (st.blank > 5)
				return null;
			st.exch(st.blank, st.blank+3);
			st.blank += 3;
			st.priority = calPriority(st.stat);
			return st;
		}

		private void exch(int i, int j)
		{
			int t = stat[i];
			stat[i] = stat[j];
			stat[j] = t;
		}

		public int compareTo(Status that)
		{
			return this.priority - that.priority;
		}

		public String toString()
		{
			String s = "";
			for (int i = 0; i < 9; i++)
				s = s + stat[i] + " ";
			return s;
		}
	}

	private Integer[] a;

	public EightPuzzle()
	{
		a = new Integer[9];
		for (int i = 0; i < 8; i++)
			a[i] = i + 1;
		a[8] = -1;
		StdRandom.shuffle(a);
	}

	private static int calPriority(Integer[] s)
	{
		int count = 0;
		for (int i = 0; i < 8; i++)
		{
			if (s[i] != i+1)
				count++;
		}
		return count;
	}

	private void show()
	{
		for (int i = 0; i < 9; i++)
			StdOut.print(a[i] + " ");
		StdOut.println();
	}

	public static void main(String[] args)
	{
		EightPuzzle e = new EightPuzzle();
		Status s = e.new Status(e.a);
		MaxPQ<Status> pq = new MaxPQ<Status>();
		Stack<Status> stack = new Stack<Status>();
		stack.push(s);
		pq.insert(s);
		int total = 1;
		while (!pq.isEmpty())
		{
			Status tmp = pq.delMax();
			total--;
			Status[] newS = new Status[4];
			newS[0] = tmp.moveLeft();
			newS[1] = tmp.moveRight();
			newS[2] = tmp.moveUP();
			newS[3] = tmp.moveDown();
			for (int i = 0; i < 4; i++)
			{
				if (newS[i] == null)
					continue;
				if (newS[i].getPriority() == 0)
				{
					StdOut.println(newS[i]);
					return;
				}
				int old = 0;
				for (Status x : stack)
				{
					int eq = 0;
					for (int j = 0; j < 9; j++)
					{
						if (x.stat[j].compareTo(newS[i].stat[j]) == 0)
							eq++;
					}
					if (eq == 9)
					{
						old = 1;
						break;
					}
				}
				if (old == 1)
					continue;
				pq.insert(newS[i]);
				total++;
				stack.push(newS[i]);
			}
			StdOut.println(total + " in MaxPQ");
		}
	}
}
```
I use the var `total` to help me debug this code. While the program is running, its value increase to about 30,000, and then begin to decrease, and sonn increase again. but its max is always about 30,000. And at last, it will decrease towards zero to get to the final status, and below is the last few lines of its computing process: 
```
$ java EightPuzzle
...
...
23 in MaxPQ
23 in MaxPQ
22 in MaxPQ
21 in MaxPQ
20 in MaxPQ
19 in MaxPQ
18 in MaxPQ
17 in MaxPQ
16 in MaxPQ
15 in MaxPQ
14 in MaxPQ
13 in MaxPQ
12 in MaxPQ
11 in MaxPQ
10 in MaxPQ
9 in MaxPQ
8 in MaxPQ
7 in MaxPQ
6 in MaxPQ
5 in MaxPQ
4 in MaxPQ
1 2 3 4 5 6 7 8 -1 
```
