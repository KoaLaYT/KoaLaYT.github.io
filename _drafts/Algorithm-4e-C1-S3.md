# Chapter 1 / Section 3 : Bags, Queues, and Stacks

## Main Content

In this section, three important data type of *collection* is introduced : **Bag**, **Queue** and **Stack**. The goals of this section is :

1. emphasize the idea that the way we represent the data will directly impacts the efficiency of the operations.
2. introduces *generics* and *iteration* which make client code more clear, compact and elegant.
3. show the importance of *linked* data structures.

The APIs of these collection (image from the text book) :

![APIs](../img/APIs.jpg)

The implementation of `Stack` using array :

```java
public class ResizingArrayStack<Item> implements Iterable<Item>
{
	private Item[] a = (Item[]) new Object[1];
	private int N = 0;
	
	private void resize(int cap)
    {
    	Item[] tmp = (Item[]) new Object[cap];
    	for (int i = 0; i < N; i++)
    		tmp[i] = a[i];
    	a = tmp;
    }
	public void push(Item item)
    {
    	if (N == a.length)
    		resize(a.length * 2);
        a[N++] = item;
    }
    
    public Item pop()
    {
    	Item i = a[--N];
    	a[N] = null;
    	if (N > 0 && N == a.length/4)
    		resize(a.length / 2);
    	return i;
    }
    
    public boolean isEmpty()
    {
    	return N == 0;
    }
    
    public int size()
    {
    	return N;
    }
    
    public Iterator<Item> iterator()
    {
    	return new ReverseArrayIterator();
    }
    
    private class ReverseArrayIterator implements Iterator<Item>
    {
    	private int i = N;
    	public boolean hasNext() { return i > 0; }
    	public Item next() { return a[--i]; }
    	public void remove() {}
    }
}
```

The implementation of `Stack` by using linked-list :

```java
public class Stack<Item> implements Iterable<Item>
{
	private Node first;
	private int N;
	
	private class Node
    {
    	Item item;
    	Node next;
    }
    
    public void push(Item item)
    {
    	Node oldfirst = first;
    	first = new Node();
    	first.item = item;
    	first.next = oldfirst;
    	N++;
    }
    
    public Item pop()
    {
    	Item item = first.item;
    	first = first.next;
    	N--;
    	return item;
    }
    
    public boolean isEmpty()
    {
    	return N == 0;
    }
    
    public int size()
    {
    	return N;
    }
    
    public Iterator<Item> iterator()
    {
    	return new ListIterator();
    }
    
    private class ListIterator implements Iterator<Item>
    {
    	Node x = first;
    	public boolean hasNext() { return x != null; }
    	public Item next()
        {
        	Item item = x.item;
        	x = x.next;
        	return item;
        }
        public void remove() {}
    }
}
```

The implementation of `Queue` by using linked-list :

```java
public class Queue<Item> implements Iterable<Item>
{
	private Node first;
	private Node last;
	private int N;
	
	private class Node
    {
    	Item item;
    	Node next;
    }
    
    public void enqueue(Item item)
    {
    	Node oldlast = last;
    	last = new Node();
    	last.item = item;
    	if (isEmpty())
    		first = last;
    	else
    		oldlast.next = last;
    	N++;
    }
    
    public Item dequeue()
    {
    	Item item = first.item;
    	first = first.next;
    	N--;
    	if (isEmpty())
    		last = null;
    	return item;
    }
    
    // iterator() is same as Stack;
}
```

The implementation of `Bag` by using linked-list is very likely with `Stack`.

Here is a table summarize the cons and pros of *array* and *linked list* :

|               Data Structure               |                  advantage                  |            disadvantage             |
| :----------------------------------------: | :-----------------------------------------: | :---------------------------------: |
|    <span style='color:red'>array</span>    | index provides immediate access to any item | need to know size on initialization |
| <span style='color:red'>linked list</span> |       uses space proportional to size       |  need reference to access an item   |

This section also points the steps it take to approaching a new applications domain :

- Specify an API
- Develop client code with reference to specific applications
- Describe a data structure that can serve as the basis for the instance variables in a class that will implement an ADT that meets the specification in the API
- Describe algorithms that can serve as the basis for implementing the instance methods in the class
- Analyze the performance characteristics of the algorithms



## Exercise

### 1.3.1

> Add a method isFull() to FixedCapacityStackOfStrings .

```java
import edu.princeton.cs.algs4.StdIn;
import edu.princeton.cs.algs4.StdOut;

public class FixedCapacityStack<Item>
{
	private Item[] a;
	private int N;
	private int max;

	public FixedCapacityStack(int cap)
	{
		a = (Item[]) new Object[cap];
		max = cap;
	}

	public boolean isEmpty()
	{
		return N == 0;
	}

	public int size()
	{
		return N;
	}

	public boolean isFull()
	{
		return N == max;
	}

	public void push(Item item)
	{
		a[N++] = item;
	}

	public Item pop()
	{
		return a[--N];
	}

	public static void main (String[] args)
	{
		FixedCapacityStack<String> a = new FixedCapacityStack<String>(5);
		while (!StdIn.isEmpty())
		{
			String item = StdIn.readString();
			if (!item.equals("-"))
			{
				if (!a.isFull())
					a.push(item);
				else
					StdOut.println("Stack is full. Element " + item + " will just be ignored.");
			}
			else if (!a.isEmpty())
				StdOut.print(a.pop() + " ");
		}
		StdOut.println("(" + a.size() + " left on stack)");
	}
}
```

### 1.3.4

> Write a stack client Parentheses that reads in a text stream from standard input and uses a stack to determine whether its parentheses are properly balanced. For example, your program should print true for [()]{}{[()()]()} and false for [(]) .

The client is as follow :

```java
import edu.princeton.cs.algs4.Stack;
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.StdIn;

public class Parentheses
{
	private static boolean isPair(char pLeft, char pRight)
	{
		if ((pLeft == '{' && pRight == '}') || 
		    (pLeft == '[' && pRight == ']') ||
		    (pLeft == '(' && pRight == ')'))
			return true;
		else
			return false;
	}

	public static void main (String[] args)
	{
		boolean result = true;
		Stack<Character> s = new Stack<Character>();
		while (!StdIn.isEmpty())
		{
			char token = StdIn.readChar();
			if (token == '{' || token == '[' || token == '(')
				s.push(token);
			else if (token == '}' || token == ']' || token == ')')
			{
				if (!isPair(s.pop(), token))
				{
					result = false;
					break;
				}
			}
		}

		if (s.size() != 0)
			result = false;

		StdOut.println(result);
	}
}
```

Here is the test result :

```
$ java Parentheses
[()]{}{[()()]()}
true
$ java Parentheses
[(])
false
```

### 1.3.9

> Write a program that takes from standard input an expression without left parentheses and prints the equivalent infix expression with the parentheses inserted. For example, given the input:
> 1 + 2 ) * 3 - 4 ) * 5 - 6 ) ) )
> your program should print
> ( ( 1 + 2 ) * ( ( 3 - 4 ) * ( 5 - 6 ) )

This is it :

```java
import edu.princeton.cs.algs4.Stack;
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.StdIn;

public class CompletionParentheses
{
	public static void main (String[] args)
	{
		Stack<String> num = new Stack<String>();
		Stack<String> ops = new Stack<String>();

		while (!StdIn.isEmpty())
		{
			String token = StdIn.readString();
			if (token.equals("+") ||
			    token.equals("-") ||
			    token.equals("*") ||
			    token.equals("/"))
				ops.push(token);
			else if (token.equals(")"))
			{
				String nRight = num.pop();
				String nLeft = num.pop();
				String operation = ops.pop();
				num.push("( "+ nLeft + " " + operation + " " + nRight + " )");
			}
			else
				num.push(token);
		}
		StdOut.println(num.pop());
	}
}
```

Here is the result :

```
$ java CompletionParentheses
1 + 2 ) * 3 - 4 ) * 5 - 6 ) ) )
( ( 1 + 2 ) * ( ( 3 - 4 ) * ( 5 - 6 ) ) )
```

### 1.3.10 

> Write a filter InfixToPostfix that converts an arithmetic expression from infix to postfix.

This is my filter :

```java
import edu.princeton.cs.algs4.Stack;
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.StdIn;

public class InfixToPostfix
{
	private static boolean isOps(String token)
	{
		if (token.equals("+") ||
		    token.equals("-") ||
		    token.equals("*") ||
		    token.equals("/"))
			return true;
		else
			return false;
	}

	public static void main (String[] args)
	{
		Stack<String> num = new Stack<String>();
		Stack<String> ops = new Stack<String>();

		while (!StdIn.isEmpty())
		{
			String token = StdIn.readString();
			if (token.equals("("))
				continue;
			else if (isOps(token))
				ops.push(token);
			else if (token.equals(")"))
			{
				String rightNum = num.pop();
				String leftNum = num.pop();
				String operation = ops.pop();
				num.push("( " + leftNum + " " + rightNum + " " + operation + " )");
			}
			else
				num.push(token);
		}
		StdOut.println(num.pop());
	}
}
```

The result :

```
$ cat testString.txt 
( ( 1 + 2 ) * ( ( 3 - 4 ) * ( 5 - 6 ) ) )
$ java InfixToPostfix < testString.txt 
( ( 1 2 + ) ( ( 3 4 - ) ( 5 6 - ) * ) * )

```

### 1.3.14 

> Develop a class ResizingArrayQueueOfStrings that implements the queue abstraction with a fixed-size array, and then extend your implementation to use array resizing to remove the size restriction.

This is my implementation : 

```java
import java.util.Iterator;
import java.util.NoSuchElementException;
import edu.princeton.cs.algs4.StdIn;
import edu.princeton.cs.algs4.StdOut;

public class ResizingArrayQueue<Item> implements Iterable<Item>
{
	private Item[] a = (Item[]) new Object[1];
	private int head = 0;
	private int tail = 0;
	private int cap = 1;

	private void resize(int max)
	{
		cap = max;
		tail = size();
		Item[] tmp = (Item[]) new Object[max];
		for (int i = 0; i < tail; i++)
			tmp[i] = a[head++];
		a = tmp;
		head = 0;
	}

	public void enqueue(Item item)
	{
		if (tail == cap)
			resize(2 * size());
		a[tail++] = item;
	}

	public Item dequeue()
	{
		if (isEmpty())
		{	
			throw new NoSuchElementException("Stack underflow");
		}
		Item item = a[head];
		a[head++] = null;
		if ( size() > 0 && size() == cap / 4)
			resize(cap / 2);
		return item;
	}

	public boolean isEmpty()
	{
		return head == tail;
	}

	public int size()
	{
		return tail - head;
	}

	public String toSting()
	{
		StringBuilder s = new StringBuilder();
		for (Item item : this)
		{
			s.append(item);
			s.append(' ');
		}
		return s.toString();
	}

	public Iterator<Item> iterator()
	{
		return new ArrayQueueIterator();
	}
	private class ArrayQueueIterator implements Iterator<Item>
	{
		private int h = head;
		private int t = tail;

		public boolean hasNext()
		{
			return t > h;
		}

		public Item next()
		{
			return a[h++];
		}

		public void remove()
		{
			throw new UnsupportedOperationException();
		}
	}

	public static void main (String[] args)
	{
		ResizingArrayQueue<String> s = new ResizingArrayQueue<String>();

		while (!StdIn.isEmpty())
		{
			String item = StdIn.readString();
			if (!item.equals("-"))
				s.enqueue(item);
			else if (!s.isEmpty())
				StdOut.print(s.dequeue() + " ");
		}
		StdOut.println("(" + s.size() + " left on Queue)");
	}
}
```

### 1.3.15

> Write a Queue client that takes a command-line argument k and prints the k th from the last string found on standard input (assuming that standard input has k or more strings).

```java
import edu.princeton.cs.algs4.Queue;
import edu.princeton.cs.algs4.StdIn;
import edu.princeton.cs.algs4.StdOut;

public class PrintStringByQueue
{
	public static void main (String[] args)
	{
		int k = Integer.parseInt(args[0]);
		Queue<String> q = new Queue<String>();

		while (!StdIn.isEmpty())
		{
			String string = StdIn.readString();
			q.enqueue(string);
		}

		int size = q.size();

		for (int i = 0; i < size - k; i++)
			q.dequeue();

		StdOut.println(q.dequeue());
	}
}
```

And the test is : 

```
$ java PrintStringByQueue 4
apple banana car dog elephant fish
car
```

### 1.3.26 

> Write a method remove() that takes a linked list and a string key as arguments and removes all of the nodes in the list that have key as its item field.

```java
public void remove (String key)
{
    while (key.equals(first.item))
        first = first.next;

    Node last = first;
    for (Node x = first.next; x != null; x = x.next)
    {
        if (key.equals(x.item))
        {
            last.next = last.next.next;
            x = last;
        }
        else
            last = last.next;
    }
}
```

### 1.3.27 

> Write a method max() that takes a reference to the first node in a linked list as argument and returns the value of the maximum key in the list. Assume that all keys are positive integers, and return 0 if the list is empty.

```java
public Node max(Node first)
{
    Node max = first;
    for (Node x = first.next; x != null; x = x.next)
    {
        if (max.compareTo(x) < 0)
            max = x;
    }
    return max;
}
```

### 1.3.28

> Develop a recursive solution to the previous question.

```java
public Node rmax(Node first)
{
    if (first.next == null)
        return first;
    if (first.next.next == null)
        return first.next.compareTo(first) < 0 ? first : first.next;
    return first.compareTo(rmax(first.next)) < 0 ? rmax(first.next) : first;
}
```

### 1.3.29

> Write a Queue implementation that uses a circular linked list, which is the same as a linked list except that no links are null and the value of last.next is first whenever the list is not empty. Keep only one Node instance variable ( last ).

```java
import java.util.NoSuchElementException;
import edu.princeton.cs.algs4.StdIn;
import edu.princeton.cs.algs4.StdOut;

public class LoopQueue<Item>
{
	private Node last;
	private class Node
	{
		Item item;
		Node next;
	}
	private int N = 0;

	void enqueue(Item item)
	{
		if (last == null)
		{
			last = new Node();
			last.item = item;
			last.next = last;
		}
		else
		{
			Node first = last.next;
			Node oldLast = last;
			last = new Node();
			last.item = item;
			last.next = first;
			oldLast.next = last;
		}
		N++;
	}

	Item dequeue()
	{
		if (isEmpty())
			throw new NoSuchElementException("Stack underflow");

		Item item = last.next.item;
		if (N == 1)
		{
			last = null;
		}
		else
		{
			last.next = last.next.next;
		}
		N--;
		return item;
	}

	boolean isEmpty()
	{
		return N == 0;
	}

	int size()
	{
		return N;
	}
	
	public static void main (String[] args)
	{
		LoopQueue<String> s = new LoopQueue<String>();

		while (!StdIn.isEmpty())
		{
			String item = StdIn.readString();
			if (!item.equals("-"))
				s.enqueue(item);
			else if (!s.isEmpty())
				StdOut.print(s.dequeue() + " ");
		}
		StdOut.println("(" + s.size() + " left on Queue)");
	}
}
```

### 1.3.30 

> Write a function that takes the first Node in a linked list as argument and (destructively) reverses the list, returning the first Node in the result.

```java
public class ReverseList<Item>
{
	private Node first;
	private class Node
	{
		Item item;
		Node next;
	}
	private int N = 0;

	public Node getFirstNode()
	{
		return first;
	}

	public void add(Item item)
	{
		Node a = new Node();
		a.item = item;
		Node oldfirst = first;
		first = a;
		a.next = oldfirst;
		N++;
	}

	public Node rreverse(Node f)
	{
		if (f.next == null || f == null)
			return f;

		Node last = f.next;
		Node seclast = f;
		while (last.next != null)
		{
			last = last.next;
		}
		while (seclast.next.next != null)
		{
			seclast = seclast.next;
		}

		last.next = seclast;
		seclast.next = null;
		rreverse(f);

		return last;
	}

	public Node ireverse(Node f)
	{
		if (f.next == null || f == null)
			return f;

		Node nextfirst = f.next;
		f.next = null;
		while (nextfirst != null)
		{
			Node tmp = nextfirst.next;
			nextfirst.next = f;
			f = nextfirst;
			nextfirst = tmp;
		}
		return f;
	}
	
	public void printList(Node first)
	{
		for (Node x = first; x != null; x = x.next)
			System.out.print(x.item + " ");
		System.out.println();
	}

	public static void main (String[] args)
	{
		ReverseList<Integer> list1 = new ReverseList<Integer>();
		ReverseList<Integer> list2 = new ReverseList<Integer>();
		for (int i = 1; i <= 20; i++)
		{
			list1.add(i);
			list2.add(i);
		}
		list1.printList(list1.getFirstNode());
		list1.printList(list1.rreverse(list1.getFirstNode()));
		list2.printList(list2.getFirstNode());
		list2.printList(list2.ireverse(list2.getFirstNode()));
	}
}
```

### 1.3.32 Steque.

> A stack-ended queue or steque is a data type that supports push, pop, and enqueue. Articulate an API for this ADT. Develop a linked-list-based implementation.

```java
public class Steque<Item>
{
	private Node first;
	private Node last;
	private class Node
	{
		Item item;
		Node next;
	}
	private int N;

	public boolean isEmpty()
	{
		return first == null;
	}

	public int size()
	{
		return N;
	}

	public void push(Item item)
	{
		Node oldfirst = first;
		first = new Node();
		first.item = item;
		first.next = oldfirst;
		N++;

		if (N == 1)
			last = first;
	}

	public Item pop()
	{
		Item item = first.item;
		first = first.next;
		N--;

		if (N == 0)
			last = null;
		return item;
	}

	public void enqueue(Item item)
	{
		Node a = new Node();
		a.item = item;
		if (last != null)
			last.next = a;
		last = a;
		N++;

		if (N == 1)
			first = last;
	}

	public void printList()
	{
		for (Node x = first; x != null; x = x.next)
			System.out.print(x.item + " ");
		System.out.println();
	}

	public static void main (String[] args)
	{
		Steque<String> s = new Steque<String>();
		s.push("push 1");
		s.push("push 2");
		s.push("push 3");
		s.enqueue("enqueue 1");
		s.enqueue("enqueue 2");
		s.enqueue("enqueue 3");
		s.printList();
		System.out.println("pop, " + s.pop());
		System.out.println("pop again " + s.pop());
		s.printList();
		s.push("push 4");
		s.enqueue("enqueue 4");
		s.printList();
		System.out.println("And we got " + s.size() + " left.");
	}
}
```

### 1.3.33 Deque.

> A double-ended queue or deque (pronounced “deck”) is like a stack or a queue but supports adding and removing items at both ends.

The implementation of using doubly-linked list :

```java
import java.util.Iterator;

public class Deque<Item> implements Iterable<Item>
{
	private Node left;
	private Node right;
	private class Node
	{
		Item item;
		Node next;
		Node last;
	}
	private int N;

	public boolean isEmpty()
	{
		return N == 0;
	}

	public int size()
	{
		return N;
	}

	public void pushLeft(Item item)
	{
		Node tmp = new Node();
		tmp.item = item;
		tmp.next = left;
		if (left != null)
			left.last = tmp;
		left = tmp;
		N++;

		if (N == 1)
			right = left;

	}

	public void pushRight(Item item)
	{
		Node tmp = new Node();
		tmp.item = item;
		tmp.last = right;
		if (right != null)
			right.next = tmp;
		right = tmp;
		N++;

		if (N == 1)
			left = right;
	}

	public Item popLeft()
	{
		Item item = left.item;
		left = left.next;
		if (left != null)
			left.last = null;
		N--;
		if (N == 0)
			right = null;
		return item;
	}

	public Item popRight()
	{
		Item item = right.item;
		right = right.last;
		if (right != null)
			right.next = null;
		N--;
		if (N == 0)
			left = null;
		return item;
	}

	public void printFromLeft()
	{
		System.out.print("The deque is print from left: ");
		for (Node x = left; x != null; x = x.next)
			System.out.print(x.item + " ");
		System.out.println();
	}

	public void printFromRight()
	{
		System.out.print("The deque is print from right: ");
		for (Node x = right; x != null; x = x.last)
			System.out.print(x.item + " ");
		System.out.println();
	}

	public Iterator<Item> iterator()
	{
		return new ListIterator();
	}
	private class ListIterator implements Iterator<Item>
	{
		private Node current = left;
		public boolean hasNext()
		{
			return current != null;
		}
		public void remove() { }
		public Item next()
		{
			Item item = current.item;
			current = current.next;
			return item;
		}
	}

	public static void main (String[] args)
	{
		Deque<String> d = new Deque<String>();
		d.pushLeft(">>");
		d.pushLeft(">>");
		d.pushRight("<<");
		d.pushRight("<<");
		d.printFromLeft();
		d.printFromRight();
		System.out.println("pop from left, got a " + d.popLeft());
		System.out.println("pop from right, got a " + d.popRight());
		d.printFromLeft();
		d.printFromRight();
		System.out.println(d.size() + " elements left in the deque");
	}
}
```

And the implementation of using resizing array :

```java
import java.util.Iterator;

public class ResizingArrayDeque<Item>
{
	private Item[] lefta = (Item[]) new Object[1];
	private Item[] righta = (Item[]) new Object[1];
	private int lefthead = 0;
	private int lefttail = 0;
	private int righthead = 0;
	private int righttail = 0;
	private int leftcap = 1;
	private int rightcap = 1;

	private void leftResize(int max)
	{
		leftcap = max;
		int lsize = lefttail - lefthead;
		Item[] tmp = (Item[]) new Object[max];
		for (int i = 0; i < lsize; i++)
			tmp[i] = lefta[lefthead++];
		lefta = tmp;
		lefthead = 0;
	}
	
	private void rightResize(int max)
	{
		rightcap = max;
		int rsize = righttail - righthead;
		Item[] tmp = (Item[]) new Object[max];
		for (int i = 0; i < rsize; i++)
			tmp[i] = righta[righthead++];
		righta = tmp;
		righthead = 0;
	}

	public boolean isEmpty()
	{
		return (lefttail - lefthead + righttail - righthead) == 0;
	}

	public int size()
	{
		return lefttail - lefthead + righttail - righthead;
	}

	public void pushLeft(Item item)
	{
		if (lefttail == leftcap)
			leftResize(2 * leftcap);
		lefta[lefttail++] = item;
	}
	
	public void pushRight(Item item)
	{
		if (righttail == rightcap)
			rightResize(2 * rightcap);
		righta[righttail++] = item;
	}

	public Item popLeft()
	{
		if (lefttail == 0)
		{
			Item il1 = righta[righthead];
			righta[righthead++] = null;
			if ((righttail - righthead) == rightcap / 4)
				rightResize(rightcap / 2);
			return il1;
		}
		Item il2 = lefta[--lefttail];
		lefta[lefttail] = null;
		if (lefttail < leftcap / 4)
			leftResize(leftcap / 2);
		return il2;
	}
	
	public Item popRight()
	{
		if (righttail == 0)
		{
			Item ir1 = lefta[lefthead];
			lefta[lefthead++] = null;
			if ((lefttail - lefthead) == leftcap / 4)
				leftResize(leftcap / 2);
			return ir1;
		}
		Item ir2 = righta[--righttail];
		righta[righttail] = null;
		if (righttail < rightcap / 4)
			rightResize(rightcap / 2);
		return ir2;
	}

	public void printArray()
	{
		for (int i = lefttail - 1; i >= lefthead ; i--)
			System.out.print(lefta[i] + " ");
		for (int i = righthead; i < righttail; i++)
			System.out.print(righta[i] + " ");
		System.out.println();
	}

	public static void main (String[] args)
	{
		ResizingArrayDeque<String> d = new ResizingArrayDeque<String>();
		d.pushLeft(">>");
		d.pushLeft(">>");
		d.pushRight("<<");
		d.pushRight("<<");
		d.printArray();
		System.out.println("pop from left, got a " + d.popLeft());
		System.out.println("pop from left, got a " + d.popLeft());
		System.out.println("pop from left, got a " + d.popLeft());
		d.printArray();
		System.out.println(d.size() + " elements left in the deque");
	}
}
```

### 1.3.34 Random bag.

> A random bag stores a collection of items and supports the following API (omitted). Write a class RandomBag that implements this API. Note that this API is the same as for Bag , except for the adjective random, which indicates that the iteration should provide the items in random order (all N ! permutations equally likely, for each iterator). 
>
> Hint : Put the items in an array and randomize their order in the iterator’s constructor.

```java
import java.util.Iterator;
import edu.princeton.cs.algs4.StdRandom;

public class RandomBag<Item> implements Iterable<Item>
{
	private Node first;
	private class Node
	{
		Item item;
		Node next;
	}
	private int N;

	public boolean isEmpty()
	{
		return N == 0;
	}

	public int size()
	{
		return N;
	}

	public void add(Item item)
	{
		Node oldfirst = first;
		first = new Node();
		first.item = item;
		first.next = oldfirst;
		N++;
	}

	public Iterator<Item> iterator()
	{
		return new RandomIterator();
	}

	private class RandomIterator implements Iterator<Item>
	{
		private int scan = 0;
		private Item[] a = (Item[]) new Object[N];
		Node x = first;

		public RandomIterator()
		{
			for (int i = 0 ; i < N; i++)
			{
				a[i] = x.item;
				x = x.next;
			}
			StdRandom.shuffle(a);
		}

		public boolean hasNext()
		{
			return scan < N;
		}

		public void remove() { }

		public Item next()
		{
			Item item = a[scan++];
			return item;
		}
	}

	public static void main (String[] args)
	{
		RandomBag<String> rb = new RandomBag<String>();

		rb.add("one");
		rb.add("two");
		rb.add("three");
		rb.add("four");
		rb.add("five");

		System.out.print("This is bag has: ");
		for (String s : rb)
			System.out.print(s + " ");
		System.out.println();
		
		System.out.print("This is bag has: ");
		for (String s : rb)
			System.out.print(s + " ");
		System.out.println();
	}
}
```

This is the test result that prove its randomness :

```
$ java RandomBag
This is bag has: four two three one five 
This is bag has: one four two three five 
$ java RandomBag
This is bag has: four one three five two 
This is bag has: five three two four one 

```

### 1.3.35 Random queue.

> A random queue stores a collection of items and supports the following API (omitted). Write a class RandomQueue that implements this API. 
>
> Hint : Use an array representation (with resizing). To remove an item, swap one at a random position (indexed 0 through N-1 ) with the one at the last position (index N-1 ). Then delete and return the last object, as in ResizingArrayStack . Write a client that deals bridge hands (13 cards each) using RandomQueue<Card> .

This is the implementation of `RandomQueue` :

```java
import edu.princeton.cs.algs4.StdRandom;
import java.util.NoSuchElementException;

public class RandomQueue<Item>
{
	private Item[] a = (Item[]) new Object[1];
	private int N;

	private void resize(int max)
	{
		Item[] tmp = (Item[]) new Object[max];
		for (int i = 0; i < N; i++)
			tmp[i] = a[i];
		a = tmp;
	}

	public boolean isEmpty()
	{
		return N == 0;
	}

	public void enqueue(Item item)
	{
		if (N == a.length)
			resize(2 * a.length);
		a[N++] = item;
	}

	public Item dequeue()
	{
		if (N == 0)
			throw new NoSuchElementException("Queue underflow");
		int rand = StdRandom.uniform(N);
		Item tmp = a[N - 1];
		a[N - 1] = a[rand];
		a[rand] = tmp;
		Item item = a[--N];

		if (N > 0 && N == a.length / 4)
			resize(a.length / 2);
		return item;
	}

	public void printRandomQueue()
	{
		System.out.print("This random queue looks like: ");
		for (int i = 0; i < N; i++)
			System.out.print(a[i] + " ");
		System.out.println();
	}

	public Item sample()
	{
		if (N == 0)
			throw new NoSuchElementException("Queue underflow");
		int rand = StdRandom.uniform(N);
		return a[rand];
	}

	public static void main(String[] args)
	{
		RandomQueue<Integer> a = new RandomQueue<Integer>();
		for (int i = 0; i < 10; i++)
			a.enqueue(i);
		a.printRandomQueue();
		
		System.out.println("Delete an element: " + a.dequeue());
		a.printRandomQueue();
		System.out.println("Delete an element: " + a.dequeue());
		a.printRandomQueue();

		System.out.println("Look an element: " + a.sample());
		a.printRandomQueue();
		System.out.println("Look an element: " + a.sample());
		a.printRandomQueue();
	}
}
```

And this is the client of `CardDealer` that using `RandomQueue<Card>` :

```java
public class CardDealer
{
	private class Card
	{
		private final String[] cardnum = { null, "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" };
		private String suit;
		private int number;

		public Card(String s, int n)
		{
			suit = s;
			number = n;
		}

		public String toString()
		{
			return suit + "-" + cardnum[number];
		}
	}

	RandomQueue<Card> rq = new RandomQueue<Card>();

	public CardDealer()
	{
		for (int i = 1; i <=13; i++)
		{
			rq.enqueue(new Card("heart", i));
			rq.enqueue(new Card("spade", i));
			rq.enqueue(new Card("club", i));
			rq.enqueue(new Card("diamond", i));
		}
	}

	public void sendCards(Card[] c)
	{
		for (int i = 0; i < c.length; i++)
			c[i] = rq.dequeue();
	}

	public static void main(String[] args)
	{
		CardDealer cd = new CardDealer();
		Card[] c = new Card[13];

		for (int i = 1; i <= 4; i++)
		{
			cd.sendCards(c);
			System.out.print("The player #" + i + " got: ");
			for (int j = 0; j < 13; j++)
				System.out.print(c[j] + " ");
			System.out.println();
		}
	}
}
```

And here is a test result :

```
$ java CardDealer
The player #1 got: heart-2 club-10 heart-8 club-A club-7 spade-6 diamond-A diamond-8 spade-A spade-5 club-J heart-Q spade-10 
The player #2 got: spade-2 spade-4 club-Q heart-6 diamond-K diamond-Q diamond-7 heart-4 club-9 heart-10 heart-5 spade-K heart-9 
The player #3 got: diamond-3 diamond-10 spade-J heart-7 heart-J club-4 spade-Q club-3 diamond-2 spade-8 spade-7 diamond-9 club-8 
The player #4 got: heart-K diamond-6 diamond-4 spade-3 diamond-5 heart-A diamond-J club-6 club-2 club-5 heart-3 spade-9 club-K 
```

### 1.3.37 Josephus problem.

> In the Josephus problem from antiquity, N people are in dire straits and agree to the following strategy to reduce the population. They arrange themselves in a circle (at positions numbered from 0 to N–1) and proceed around the circle, eliminating every Mth person until only one person is left. Legend has it that Josephus figured out where to sit to avoid being eliminated. Write a Queue client Josephus that takes N and M from the command line and prints out the order in which people are eliminated (and thus would show Josephus where to sit in the circle).

By using a `Queue`, it became very easy : 

```java
import edu.princeton.cs.algs4.Queue;

public class Josephus
{
	public static void main(String[] args)
	{
		int N = Integer.parseInt(args[0]);
		int M = Integer.parseInt(args[1]);

		Queue<Integer> q = new Queue<Integer>();
		for (int i = 0; i < N; i++)
			q.enqueue(i);

		while (!q.isEmpty())
		{
			for (int i = 1; i < M; i++)
			{
				int tmp = q.dequeue();
				q.enqueue(tmp);
			}
			System.out.print(q.dequeue() + " ");
		}
		System.out.println();
	}
}
```

Here is the result :

```
$ java Josephus 7 2
1 3 5 0 4 2 6 
```

### 1.3.40 Move-to-front.

> Read in a sequence of characters from standard input and maintain the characters in a linked list with no duplicates. When you read in a previously unseen character, insert it at the front of the list. When you read in a duplicate character, delete it from the list and reinsert it at the beginning. Name your program MoveToFront : it implements the well-known move-to-front strategy, which is useful for caching, data compression, and many other applications where items that have been recently accessed are more likely to be reaccessed.

```java
import edu.princeton.cs.algs4.StdIn;

public class MoveToFront
{
	private Node first;
	private class Node
	{
		char ch;
		Node next;
	}

	public void add(char c)
	{
		if (findThenDelete(c) == 0)
			return;

		Node oldfirst = first;
		first = new Node();
		first.ch = c;
		first.next = oldfirst;
	}

	private int findThenDelete(char c)
	{
		if (first == null)
			return 1;
		if (first.ch == c)
			return 0;
		
		for (Node x = first, y = first.next; y != null; x = x.next, y = y.next)
		{
			if (y == null)
				break;
			if (y.ch == c)
			{
				x.next = y.next;
				break;
			}
		}
		return 1;
	}

	public void printList()
	{
		System.out.print("This list has: ");
		for (Node x = first; x != null; x = x.next)
			System.out.print(x.ch + " ");
		System.out.println();
	}

	public static void main(String[] args)
	{
		MoveToFront mtf = new MoveToFront();
		while(!StdIn.isEmpty())
			mtf.add(StdIn.readChar());
		mtf.printList();
	}
}
```

### 1.3.41 Copy a queue.

> Create a new constructor so that 
>
> Queue<Item> r = new Queue<Item>(q); 
>
> makes r a reference to a new and independent copy of the queue q . You should be able to push and pop from either q or r without influencing the other. Hint : Delete all of the elements from q and add these elements to both q and r .

```java
public Queue(Queue<Item> q)
{
    for (int i = 0; i < q.size(); i++)
    {
        Item it = q.dequeue();
        q.enqueue(it);
        enqueue(it);
    }
}
```

### 1.3.44 Text editor buffer.

> Develop a data type for a buffer in a text editor that implements the following API (omitted). 
>
> Hint: Use two stacks.

```java
import edu.princeton.cs.algs4.Stack;
import edu.princeton.cs.algs4.StdOut;

public class Buffer
{
	private Stack<Character> cleft = new Stack<Character>();
	private Stack<Character> crght = new Stack<Character>();
	private int cursor;
	private int count;

	public void insert(char c)
	{
		cleft.push(c);
		cursor++;
		count++;
	}

	public char delete()
	{
		if (cursor == 0)
			return '*';
		
		char ch = cleft.pop();
		cursor--;
		count--;
		return ch;
	}

	public void left(int k)
	{
		if (k > cursor)
			k = cursor;

		for (int i = 0; i < k; i++)
		{
			crght.push(cleft.pop());
			cursor--;
		}
	}

	public void right(int k)
	{
		if (k > (count - cursor))
			k = count - cursor;

		for (int i = 0; i < k; i++)
		{
			cleft.push(crght.pop());
			cursor++;
		}
	}

	public int size()
	{
		return count;
	}

	public void printBuffer()
	{
		String left = cleft + "";
		String[] l = left.split(" ");
		String right = crght + "";
		String[] r = right.split(" ");

		StdOut.print("The Buffer has content as: ");
		for (int i = l.length - 1; i >= 0; i--)
			StdOut.print(l[i]);
		for (int i = 0; i < r.length; i++)
			StdOut.print(r[i]);
		StdOut.println();
		StdOut.println("And the cursor is at positon: " + cursor);
		StdOut.println();
	}

	public static void main(String[] args)
	{
		Buffer b = new Buffer();
		b.insert('c');
		b.insert('h');
		b.insert('a');
		b.insert('r');
		b.printBuffer();

		StdOut.println("Delete a character: " + b.delete());
		b.printBuffer();

		b.left(2);
		b.insert('a');
		StdOut.println("Move cursor left 2 times, and insert an 'a'");
		b.printBuffer();

		b.left(4);
		b.insert('a');
		StdOut.println("Move cursor left 4 times, and insert an 'a'");
		b.printBuffer();

		b.right(2);
		b.delete();
		b.delete();
		StdOut.println("Move cursor right 2 times, and delete 2 character");
		b.printBuffer();

		b.right(9);
		b.insert('!');
		StdOut.println("Move cursor right 9 times, and insert a '!'");
		b.printBuffer();
	}
}
```
