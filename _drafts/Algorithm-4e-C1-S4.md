# Chapter 1 / Section 4 : Analysis of Algorithms
## Main Content
D. E. Knuth postulated that the total running time of a program is determined by two primary factors :

- The cost of executing each statement
- The frequency of execution of each statement

For many programs, developing a mathematical model of running time can reduces to the following steps :

- Develop an *input model*, including a definition of the problem size
- Identify the *inner* loop
- Define a *cost model* that includes operations in the inner loop
- Determine the frequency of execution of those operations for the given input

The typical orders of growth : (image from the text book)

![growth](../img/growth.png)

## Exercise

### 1.4.16 Closest pair (in one dimension).
> Write a program that, given an array a[] of N
> double values, finds a closest pair : two values whose difference is no greater than the
> the difference of any other pair (in absolute value). The running time of your program
> should be linearithmic in the worst case.

Here is my solution:
1. sort the array a[]
2. compare every adjacent elements and save the closest value
Here is the code:
```java
import edu.princeton.cs.algs4.StdOut;
import java.util.Arrays;

public class ClosestPair
{
	public static double findClosest(double[] a)
	{
		Arrays.sort(a);
		int N = a.length;
		double min = Double.MAX_VALUE;

		for (int i = 0; i < N - 1; i++)
		{
			double tmp = Math.abs(a[i] - a[i + 1]);
			if (tmp < min)
				min = tmp;
		}

		return min;
	}

	public static void main(String[] args)
	{
		double[] a = { 2.0, 3.0, -1.0, 0.5, 0.0 };
		StdOut.println("The closest value is: " + ClosestPair.findClosest(a) + " [Expect 0.5]");
	}
}
```
And we can test the solution by running a ratio experiment. The test code is very similar with the text book, so i will just omit it.
Here is the test result, which the number `20` stands for 20 times of trials
```bash
$ java ClosestPairTest 20
       250     0.0     0.0
       500     0.0     0.0
      1000     0.0     0.0
      2000     0.0     0.0
      4000     0.0     0.0
      8000     0.0     0.0
     16000     0.0     3.0
     32000     0.0     1.7
     64000     0.0     1.6
    128000     0.0     2.1
    256000     0.0     1.1
    512000     0.0     2.0
   1024000     0.1     2.1
   2048000     0.2     2.1
   4096000     0.3     2.1
   8192000     0.7     2.1
  16384000     1.4     2.1
  32768000     3.0     2.1
  65536000     6.1     2.1
 131072000    12.8     2.1
```

### 1.4.17 Farthest pair (in one dimension).
> Write a program that, given an array a[] of N
> double values, finds a farthest pair : two values whose difference is no smaller than the
> the difference of any other pair (in absolute value). The running time of your program
> should be linear in the worst case.

Finding the farthest pair can be **linear** in the worst case while finding the closest pair can just be **linearithmic**

And the solution is easy:
1. Traversing the array a[], record the min and max
2. return max - min
Here is my code:
```java
import edu.princeton.cs.algs4.StdOut;

public class FarthestPair
{
	public static double findFarthest(double[] a)
	{
		int N = a.length;
		double min = a[0];
		double max = a[0];
		for (int i = 1; i < N; i++)
		{
			min = Math.min(min, a[i]);
			max = Math.max(max, a[i]);
		}
		return Math.abs(max - min);
	}

	public static void main(String[] args)
	{
		double[] a = { -0.1, 0.2, 3.0, -0.2, 4.0 };
		StdOut.println("The farthest value is: " + FarthestPair.findFarthest(a) + " [Expect 4.2]");
	}
}
```
Running the ratio experiment we will get:
```bash
$ java FarthestPairTest 20
       250     0.0     0.0
       500     0.0     0.0
      1000     0.0     0.0
      2000     0.0     0.0
      4000     0.0     0.0
      8000     0.0     0.0
     16000     0.0     0.0
     32000     0.0     2.0
     64000     0.0     0.0
    128000     0.0     0.0
    256000     0.0     1.0
    512000     0.0     1.0
   1024000     0.0     2.0
   2048000     0.0     2.0
   4096000     0.0     2.0
   8192000     0.0     2.0
  16384000     0.0     2.0
  32768000     0.1     2.0
  65536000     0.1     2.0
 131072000     0.3     2.0
```
We can see that the ratio of linear and linearithmic is both about 2, but the calculate time is very different.

### 1.4.20 Bitonic search.
> An array is bitonic if it is comprised of an increasing sequence
> of integers followed immediately by a decreasing sequence of integers. Write a program
> that, given a bitonic array of N distinct int values, determines whether a given integer
> is in the array. Your program should use ~3lg N compares in the worst case.

Here is the solution:

1. use binary search to find the max number *M* of the array, split the array into two parts, left part(0 - M) and right part(M+1 - N-1)
2. binary search the left part of the array
3. binary search the right part of the array

Each step takes linearithmic, so it will use ~3lgN in total.
The code is omitted.

### 1.4.22 Binary search with only addition and subtraction.
> Write a program that, given an array of N distinct int values in ascending order, determines
> whether a given integer is in the array. You may use only additions and subtractions
> and a constant amount of extra memory. The running time of your program should be
> proportional to log N in the worst case.

In the website [Mihai Patrascu](http://people.csail.mit.edu/mip/probs.html) it gives the solution based on Fibonacci numbers:
1. compute the Fibonacci number F(k) according to the length of the array, keep F(k) and F(k-1)
2. test A[F(k-2)], F(k-2) can be calculate by a sub operation
3. search for the left or right part according to the test result and update the F(k) and F(k-1)

Here is the code:
```java
import edu.princeton.cs.algs4.StdOut;

public class BinarySearchWithAddSubOnly
{
	public static boolean search(int key, int[] A)
	{
		int N = A.length;
		int fk_1 = 0; 		//fk-1
		int fk = 1; 		//fk

		for (int i = 0; fk < N; i++)
		{
			int tmp = fk;
			fk = fk + fk_1;
			fk_1 = tmp;
		}

		int lo = 0;
		int hi = fk;

		while (lo <= hi)
		{
			int fk_2 = fk - fk_1;
			int test = lo + fk_2;

			if (test >= N)
				test = N -1;
			if (test < 0)
				test = 0;

			if (key > A[test])
			{
				lo = lo + fk_2;
				fk = fk_1;
				fk_1 = fk_2;
			}
			else if (key < A[test])
			{
				hi = lo + fk_1;
				fk = fk_2;
				fk_1 = fk_1 - fk_2;
			}
			else
				return true;
		}

		return false;
	}

	public static void main(String[] args)
	{
		int[] a = { -2, -1, 0, 1, 3, 5, 7 };

		StdOut.print("The array is: ");
		for (int i = 0; i < a.length; i++)
			StdOut.print(a[i] + " ");
		StdOut.println();
		
		for (int i = -3; i < 9; i++)
		    StdOut.println("search " + i + " in the array: " + search(i, a));
	}
}
```
If test it with the ratio experiment, the result proved that it is proportional to log N:
```bash
$ java BinarySearchWithAddSubOnlyTest 20
       250     0.0     0.0
       500     0.0     0.0
      1000     0.0     0.0
      2000     0.0     0.0
      4000     0.0     0.0
      8000     0.0     0.0
     16000     0.0     0.0
     32000     0.0     0.0
     64000     0.0     0.0
    128000     0.0     0.0
    256000     0.0     0.0
    512000     0.0     0.0
   1024000     0.0     0.0
   2048000     0.0     0.0
   4096000     0.0     0.0
   8192000     0.0     0.0
  16384000     0.0     0.0
  32768000     0.0     0.0
  65536000     0.0     0.0
 131072000     0.0     0.0
```

### 1.4.24 Throwing eggs from a building.
> Suppose that you have an N-story building and plenty of eggs. 
> Suppose also that an egg is broken if it is thrown off floor F or higher,
> and unhurt otherwise. First, devise a strategy to determine the value of F such that the
> number of broken eggs is ~lg N when using ~lg N throws, then find a way to reduce the
> cost to ~2lg F.

First, let's try binary search:
```java
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.StdOut;

public class ThrowEggs
{
	private int buildingfloor;
	private int brokenfloor;
	private int guesstimes;
	private int brokeneggs;

	public ThrowEggs(int N)
	{
		buildingfloor = N;
		brokenfloor = StdRandom.uniform(N / 100 + 1);
	}

	public int showBrokenFloor()
	{
		return brokenfloor;
	}

	public int calBrokenFloor()
	{
		int lo = 1;
		int hi = buildingfloor;

		while (lo <= hi)
		{
			guesstimes++;
			int mid = lo + (hi - lo) / 2;
			if (mid > brokenfloor)
			{
				hi = mid - 1;
				brokeneggs++;
			}
			else if (mid < brokenfloor)
			{
				lo = mid + 1;
			}
			else
				return mid;
		}
		
		return -1;
	}

	public void showWastedEggs()
	{
		StdOut.println("You have throwed " + guesstimes + " eggs");
		StdOut.println("And " + brokeneggs + " eggs wasted");
	}

	public static void main(String[] args)
	{
		int N = Integer.parseInt(args[0]);
		ThrowEggs te = new ThrowEggs(N);
		StdOut.println("This building has " + N + " floors");
		StdOut.println("The broken floor is: " + te.showBrokenFloor());
		StdOut.println("The calculated floor is : " + te.calBrokenFloor());
		te.showWastedEggs();
	}
}
```

Running it will get the following result:
```bash
$ java ThrowEggs 10000000
This building has 10000000 floors
The broken floor is: 65047
The calculated floor is : 65047
You have throwed 24 eggs
And 14 eggs wasted
$ java ThrowEggs 10000000
This building has 10000000 floors
The broken floor is: 98431
The calculated floor is : 98431
You have throwed 24 eggs
And 16 eggs wasted
$ java ThrowEggs 10000000
This building has 10000000 floors
The broken floor is: 77347
The calculated floor is : 77347
You have throwed 23 eggs
And 11 eggs wasted
```
So we have to waste about `15` eggs to find the safe floor to throw eggs in a `10000000` floor building.
If we want to reduce cost to ~2lgF, we can replace the `calBrokenFloor()` function to the following function:
```java
public int calBrokenFloorInLowerCost()
	{
		int guess = 1;
		while (guess < brokenfloor)
		{
			guesstimes++;
			guess *= 2;
		}

		int lo = guess / 2;
		int hi = guess;

		while (lo <= hi)
		{
			guesstimes++;
			int mid = lo + (hi - lo) / 2;
			if (mid > brokenfloor)
			{
				hi = mid - 1;
				brokeneggs++;
			}
			else if (mid < brokenfloor)
				lo = mid + 1;
			else
				return mid;
		}
		return -1;
	}
```
What we do is throwing eggs from the lowest floor, then doubling the floor to find the broken floor, and then binary search bewteen  the last two floors. This will save us some eggs, but we have to throw more times. Here is the prove:
```bash
$ java ThrowEggs 10000000
This building has 10000000 floors
The broken floor is: 68751
The calculated floor is : 68751
You have throwed 29 eggs
And 8 eggs wasted
$ java ThrowEggs 10000000
This building has 10000000 floors
The broken floor is: 66955
The calculated floor is : 66955
You have throwed 31 eggs
And 9 eggs wasted
$ java ThrowEggs 10000000
This building has 10000000 floors
The broken floor is: 78910
The calculated floor is : 78910
You have throwed 33 eggs
And 7 eggs wasted
```

### 1.4.25 Throwing two eggs from a building.
> Consider the previous question, but now suppose you only have two eggs, and your cost 
> model is the number of throws. Devise a strategy to determine F such that the number 
> of throws is at most 2√N, then find a way to reduce the cost to ~c √F. This is analogous
> to a situation where search hits (egg intact) are much cheaper than misses (egg broken).

The solution is: 
1. set increment step to sqrt(N), throw the first eggs from sqrt(N) till it's broken, assume it broke at k*sqrt(N)
2. set increment step to 1, throw the other eggs from (k-1)*sqrt(N) till it's broken

Each step will cost √N at most. Here is the code for the core function `findBrokenFloor()`:
```java
public int findBrokenFloor()
	{
		int step = (int) Math.sqrt((double) buildingfloor);
		int guess = step;

		while (guess < brokenfloor)
		{
			guesstimes++;
			guess += step;
		}

		for (int i = guess - step + 1; i < guess; i++)
		{
			guesstimes++;
			if (i == brokenfloor)
				return i;
		}

		return -1;
	}
```
We can run the test to see if it's right:
```bash
$ java ThrowTwoEggs 10000000
This building has 10000000 floors
The broken floor is: 3049249
The calculated floor is : 3049249
You have throwed 2045 times
$ java ThrowTwoEggs 10000000
This building has 10000000 floors
The broken floor is: 2590841
The calculated floor is : 2590841
You have throwed 1982 times
$ java ThrowTwoEggs 10000000
This building has 10000000 floors
The broken floor is: 3500657
The calculated floor is : 3500657
You have throwed 1430 times
$ java ThrowTwoEggs 10000000
This building has 10000000 floors
The broken floor is: 6146756
The calculated floor is : 6146756
You have throwed 4933 times
```
`10000000` times' throw means the result can not be larger than `6324` times, and the test seems to be OK.
To reduce the cost to ~c √F, the hint from the website says that 1 + 2 + 3 + ... + k ~ k^2, so here is the strategy: 
1. the step is increase by 1, which means first check floor 1, then floor 3, then floor 6..., after k times' increment, we have the floor number larger than F, and from the hint we know that k is ~c√F
2. then just increase one by one to find the F, which is ~c√F

And here is the function code:
```java
public int findBrokenFloorInLowerCost()
	{
		int guess = 1;
		int increment = 0;
		while (guess < brokenfloor)
		{
			guesstimes++;
			increment++;
			guess += increment;
		}

		for (int i = guess - increment; i < guess; i++)
		{
			guesstimes++;
			if (i == brokenfloor)
				return i;
		}

		return -1;
	}
```
If we change the test code a bit, then we can compare these two functions, and the result is like this:
```bash
$ java ThrowTwoEggs 10000000 1000
This building has 10000000 floors
The broken floor calculated by method1 is : 1000
You have throwed 1000 times
The broken floor calculated by method2 is : 1000
You have throwed 55 times

$ java ThrowTwoEggs 10000000 10000
This building has 10000000 floors
The broken floor calculated by method1 is : 10000
You have throwed 517 times
The broken floor calculated by method2 is : 10000
You have throwed 271 times

$ java ThrowTwoEggs 10000000 100000
This building has 10000000 floors
The broken floor calculated by method1 is : 100000
You have throwed 2009 times
The broken floor calculated by method2 is : 100000
You have throwed 766 times

$ java ThrowTwoEggs 10000000 1000000
This building has 10000000 floors
The broken floor calculated by method1 is : 1000000
You have throwed 1124 times
The broken floor calculated by method2 is : 1000000
You have throwed 2423 times

$ java ThrowTwoEggs 10000000 10000000
This building has 10000000 floors
The broken floor calculated by method1 is : 10000000
You have throwed 4918 times
The broken floor calculated by method2 is : 10000000
You have throwed 7316 times
```
When the `F` is much lower than the `N`, the second method is way better.

### 1.4.34 Hot or cold.
> Your goal is to guess a secret integer between 1 and N. You repeat-
> edly guess integers between 1 and N. After each guess you learn if your guess equals the
> secret integer (and the game stops). Otherwise, you learn if the guess is hotter (closer to)
> or colder (farther from) the secret number than your previous guess. Design an algo-
> rithm that finds the secret number in at most ~2 lg N guesses. Then design an algorithm
> that finds the secret number in at most ~ 1 lg N guesses.

Here is my solution, I'm not sure if its ~2lgN: 
1. guess the mid point of the origin array
2. if its not, guess the left part's mid and the right part's mid, to determind the secret number is actually in which part
3. repeat step 1 and 2 in the left part or right part according to the last result

And here is my code:
```java
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.StdOut;

public class HotOrCold
{
	private int Max;
	private int secret;
	private int guesstimes;

	public HotOrCold(int N)
	{
		Max = N;
		secret = StdRandom.uniform(N) + 1;
		guesstimes = 0;
	}

	public int showSecret()
	{
		return secret;
	}

	public int guessSecret(int lo, int hi)
	{
		guesstimes++;
		int mmid = lo + (hi - lo) / 2;
		int lmid = lo + (mmid - lo) / 2;
		int rmid = mmid + (hi - mmid) / 2;
		if (mmid == secret)
			return mmid;
		else
		{
			guesstimes += 2;
			int ldist = Math.abs(lmid - secret);
			int rdist = Math.abs(rmid - secret);
			if (ldist < rdist)
				return guessSecret(lo, mmid - 1);
			else
				return guessSecret(mmid + 1, hi);
		}
	}

	public int showGuessTimes()
	{
		return guesstimes;
	}

	public static void main(String[] args)
	{
		int N = Integer.parseInt(args[0]);
		HotOrCold hoc = new HotOrCold(N);

		StdOut.println("The secret number is: " + hoc.showSecret());
		StdOut.println("And your guess number is: " + hoc.guessSecret(1, N));
		StdOut.println("You took " + hoc.showGuessTimes() + " times guess");
	}
}
```
And here is the test result:
```bash
$ java HotOrCold 100
The secret number is: 63
And your guess number is: 63
You took 16 times guess

$ java HotOrCold 1000
The secret number is: 384
And your guess number is: 384
You took 25 times guess

$ java HotOrCold 10000
The secret number is: 5290
And your guess number is: 5290
You took 37 times guess

$ java HotOrCold 100000
The secret number is: 96995
And your guess number is: 96995
You took 49 times guess

$ java HotOrCold 1000000
The secret number is: 755059
And your guess number is: 755059
You took 55 times guess

$ java HotOrCold 10000000
The secret number is: 8923170
And your guess number is: 8923170
You took 70 times guess

$ java HotOrCold 100000000
The secret number is: 18555519
And your guess number is: 18555519
You took 79 times guess

$ java HotOrCold 1000000000
The secret number is: 44403124
And your guess number is: 44403124
You took 85 times guess
```

### 1.4.44 Birthday problem.
> Write a program that takes an integer N from the command
> line and uses StdRandom.uniform() to generate a random sequence of integers be-
> tween 0 and N – 1. Run experiments to validate the hypothesis that the number of
> integers generated before the first repeated value is found is ~√PI*N/2.

The code is easy, so I will just give the result:
```bash
$ java BirthdayProblem
       Max     None-repeated-numbers           hypo-value      ratio
       100                2                      12.53         0.16
      1000              102                      39.63         2.57
     10000               62                     125.33         0.49
    100000               52                     396.33         0.13
   1000000             1733                    1253.31         1.38
```

### 1.4.45 Coupon collector problem.
> Generating random integers as in the previous exer-
> cise, run experiments to validate the hypothesis that the number of integers generated
> before all possible values are generated is ~N*HN .

Here is the code:
```java
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.StdOut;

public class CouponCollectorProblem
{
	public static int countInts(int N)
	{
		int[] a = new int[N];
		boolean isContain = false;
		int count = 0;
		int i = 0;
		while (i < N)
		{
			count++;
			int random = StdRandom.uniform(N);
			for (int j = 0; j < i; j++)
			{
				if (a[j] == random)
				{
					isContain = true;
					break;
				}
			}
			if (!isContain)
				a[i++] = random;	
			isContain = false;
		}
		return count;
	}

	public static void main(String[] args)
	{
		int N = Integer.parseInt(args[0]);
		double Hn = 0.0;
		for (int i = 1; i <= N; i++)
			Hn += 1 / (double) i;

		StdOut.printf("%20s %20s %20s %10s\n", "Int-to-gen", "total-random-num", "hypo-num", "ratio");
		for (int i = 0; i < 5; i++)
		{
			int counts = countInts(N);
			StdOut.printf("%20d %20d %20.2f %10.2f\n", N, counts, N * Hn, counts / N / Hn);
		}
	}
}
```
And here is the result:
```bash
$ java CouponCollectorProblem 100000
          Int-to-gen     total-random-num             hypo-num      ratio
              100000              1076578           1209014.61       0.83
              100000              1267233           1209014.61       0.99
              100000              1068500           1209014.61       0.83
              100000              1399896           1209014.61       1.08
              100000              1249759           1209014.61       0.99
```
