# 数据结构总结：复杂度对比

## 堆
| Heaps        | Leftist           | Skew                  | Binomial                        | Fibonacci             | Binary            | Link list |
| ------------ | ----------------- | --------------------- | ------------------------------- | --------------------- | ----------------- | --------- |
| Make heap    | $O(1)$            | $O(1)$                | $O(1)$                          | $O(1)$                | $O(1)$            | $O(1)$    |
| Build heap   | $\Theta (N)$      | amortized $\Theta(N)$  | $\Theta(N)$                     | $\Theta(N)$           | $\Theta(N)$       | $O(N)$    |
| Find-Min     | $\Theta(1)$       | $\Theta(1)$           | $\Theta(\log{N})$或$\Theta( 1)$ | $\Theta(1)$           | $\Theta(1)$       | $O(N)$    |
| Merge(Union) | $\Theta(\log{N})$ | amortized $O(\log{N})$ | $\Theta(\log{N})$               | $\Theta(1)$           | $\Theta(N)$       | $O(1)$    |
| Insert       | $\Theta(\log{N})$ | amortized $O(\log{N})$ | amortized$O(1)$                 | $\Theta(1)$           | $\Theta(\log{N})$ | $O(1)$    |
| Delete-Min   | $\Theta(\log{N})$ | amortized$O(\log{N})$ | $\Theta(\log{N})$               | amortized $O(\log{N})$ | $\Theta(\log{N})$ | $O(N)$    |
| Decrease-Key | $\Theta(\log{N})$ | amortized $O(\log{N})$ | $\Theta(\log{N})$               | amortized $\Theta(1)$  | $\Theta(\log{N})$ | $O(1)$    |

**注** ： 

1. Make heap指初始化一个空的堆， Build heap则是依据已有数据构建堆
2. Delete指在只知道数值的情况下删除数值对应节点
3. Decrease-Key指将一已知节点的值修改并调整数据结构的过程
4. Link list指无序的链表，仅用作对照
5. 内容参考了[Wikipedia](https://en.wikipedia.org/wiki/Priority_queue#Summary_of_running_times){:target="_blank"} 
6. 二项堆的Find-Min操作的两种复杂度取决于有没有用变量实时更新记录Min值，老师PPT中貌似默认不维护

## 平衡树

|        | BST    | RBTree       | AVL          | Splay                 |
| ------ | ------ | ------------ | ------------ | --------------------- |
| Insert | $O(N)$ | $O(\log{N})$ | $O(\log{N})$ | amortized $O(\log{N})$ |
| Delete | $O(N)$ | $O(\log{N})$ | $O(\log{N})$ | amortized $O(\log{N})$ |
| Find   | $O(N)$ | $O(\log{N})$ | $O(\log{N})$ | amortized $O(\log{N})$ |


## 比较：AVL与RBT的旋转操作次数

|        | AVL          | RBT     |
| ------ | ------------ | ------- |
| Insert | $\le 2$      | $\le 2$ |
| Delete | $O(\log{n})$ | $\le 3$ |
