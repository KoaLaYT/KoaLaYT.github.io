# Chapter 1 / Section 2 : Data Abstraction

## Main Content

*Abstract date type* (ADT) is introduced in this section. In this book, it is used to :

- Precisely specify problems in the form of **APIs**
- Describe algorithms and data structures as API implementations

*Encapsulation* enables modular programming and isolates data-type operations so that some mistakes can be avoided.

*Design APIs* is one of the most important and challenging steps in building modern software. Followings are some common pitfalls that it is susceptible to :

- too hard to implement
- too hard to use (code became more complicate than without using the API)
- too narrow (omitting methods)
- too wide (including methods that no one needs)
- too general (no useful abstraction)
- too specific
- too dependent on a particular representation

And all these can be summarized into one motto: 

> provide to clients the methods they need and no others.

And more *java* knowledge about **Interface inheritance**, **Wrapper types**, **Memory management** and others are briefly introduced.

## Exercise

### 1.2.10 

> Develop a class VisualCounter that allows both increment and decrement operations. Take two arguments N and max in the constructor, where N specifies the maximum number of operations and max specifies the maximum absolute value for the counter. As a side effect, create a plot showing the value of the counter each time its tally changes.

Here is the implementation :

```java
import edu.princeton.cs.algs4.StdDraw;
import edu.princeton.cs.algs4.StdRandom;

public class VisualCounter
{
	private int count;
	private int actionNum;
	private int maxNum;

	public VisualCounter(int N, int max)
	{
		actionNum = N;
		maxNum = Math.abs(max);
	}

	public void increment()
	{
		if (actionNum > 0)
		{
			actionNum--;
			if (count >= maxNum)
			{
				System.out.println("You have reached the max number of the counter.");
				System.out.println("Useless opration.");
				return;
			}
			else
			{
				count++;
				StdDraw.setYscale(-1.0 * maxNum, 1.0 * maxNum);
				StdDraw.filledRectangle(0.5, count / 2.0, 0.25, Math.abs(count / 2.0));
			}
		}
		else
		{
			System.out.println("You have used all the opration times of the counter.");
			System.out.println("Useless opration.");
			return;
		}
	}
	
	public void decrement()
	{
		if (actionNum > 0)
		{
			actionNum--;
			if (Math.abs(count) >= maxNum)
			{
				System.out.println("You have reached the max number of the counter.");
				System.out.println("Useless opration.");
				return;
			}
			else
			{
				count--;
				StdDraw.setYscale(-1.0 * maxNum, 1.0 * maxNum);
				StdDraw.filledRectangle(0.5, count / 2.0, 0.25, Math.abs(count / 2.0));
			}
		}
		else
		{
			System.out.println("You have used all the opration times of the counter.");
			System.out.println("Useless opration.");
			return;
		}
	}

	public static void main(String[] args)
	{
		VisualCounter a = new VisualCounter(10, 5);

		for (int i = 0; i < 3; i++)
			a.decrement();
	}
}
```

### 1.2.16 Rational numbers.

>  Implement an immutable data type Rational for rational numbers that supports addition, subtraction, multiplication, and division.

Here it is : 

```java
public class Rational
{
	private final int numer;
	private final int denom;

	public Rational(int numerator, int denominator)
	{
		if (denominator == 0)
			throw new RuntimeException("Error, denominator can't be ZERO.");
		if (numerator == 0)
		{
			numer = 0;
			denom = 1;
			return;
		}

		int tmpa = Math.abs(numerator);
		int tmpb = Math.abs(denominator);
		int g = gcd(tmpa, tmpb);
		tmpa /= g;
		tmpb /= g;

		if (numerator * denominator < 0)
			tmpa = -tmpa;
		numer = tmpa;
		denom = tmpb;
	}

	public int getNumer()
	{
		return numer;
	}

	public int getDenom()
	{
		return denom;
	}

	public Rational plus(Rational b)
	{
		int num = this.getNumer() * b.getDenom() + b.getNumer() * this.getDenom();
		int den = this.getDenom() * b.getDenom();
		return new Rational(num, den);
	}
	
	public Rational minus(Rational b)
	{
		int num = this.getNumer() * b.getDenom() - b.getNumer() * this.getDenom();
		int den = this.getDenom() * b.getDenom();
		return new Rational(num, den);
	}
	
	public Rational times(Rational b)
	{
		int num = this.getNumer() * b.getNumer();
		int den = this.getDenom() * b.getDenom();
		return new Rational(num, den);
	}

	public Rational divides(Rational b)
	{
		int num = this.getNumer() * b.getDenom();
		int den = this.getDenom() * b.getNumer();
		return new Rational(num, den);
	}

	public boolean equals(Rational that)
	{
		if (that == this)
			return true;
		if (that == null)
			return false;
		if (this.getClass() != that.getClass())
			return false;
		if (this.getNumer() == that.getNumer() && this.getDenom() == that.getDenom())
			return true;
		else
			return false;
	}

	private static int gcd(int p, int q)
	{
		if (q == 0)
			return p;
		int r = p % q;
		return gcd(q, r);
	}

	public String toString()
	{
		if (numer == 0 || Math.abs(numer) == Math.abs(denom))
			return numer + "";
		else
			return numer + "/" + denom;
	}

	public static void main (String[] args)
	{
		Rational a = new Rational(-2, -3);
		Rational b = new Rational(-3, 3);
		Rational c = new Rational(3, -4);
		Rational d = new Rational(6, -6);

		System.out.println(a + " + " + c + "=" + a.plus(c));
		System.out.println(a + " - " + c + "=" + a.minus(c));
		System.out.println(a + " * " + c + "=" + a.times(c));
		System.out.println(a + " / " + c + "=" + a.divides(c));
		System.out.println(a + " equals to " + c + "? " + a.equals(c));
		System.out.println(b + " equals to " + d + "? " + b.equals(d));
	}
}
```

The result of test is :

```
$ java Rational
2/3 + -3/4=-1/12
2/3 - -3/4=17/12
2/3 * -3/4=-1/2
2/3 / -3/4=-8/9
2/3 equals to -3/4? false
-1 equals to -1? true
```
