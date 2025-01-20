# Chapter 5 Cache<a id="Chapter5"></a>

- 原理：**时间局部性** 和 **空间局部性**

**重要内容**

![image-20241203092300481](/img/CO/Ch5-allinone.jpg)

## Block Placement

- direct mapped直接映射
  - address % number of blocks
  - 算1路组关联
- full associative全关联
  - 任意存都行
  - 算BLOCKSIZE路组关联
  - 不适用于大一点的cache
- set associative组关联
  - 可以存到其中某组的任意位置
  - 每组有N个block，称为N路组关联
  - block address % number of sets

## 复习笔记

- DRAM结构：行列地址分周期输入
- 时间和空间的局部性
- hit, miss, hit time, miss penalty
  - Read miss:data cache miss & instruction cache miss
- ![image-20250101155411639](/img/CO/Fin-MemoryHierachies.jpg)

- ![image-20250101160305645](/img/CO/Fin-Ch5CacheIdea.jpg)

- 全关联组关联直接映射：并行数量区别

  - Block address % Number of sets

- 物理地址：高位tag，中间index(log_2 Set number），尾部offset(log_2 block size(/word)+2(4B/word))

  - 例如全关联没有index位，而直接映射的index直接退化为block number
  - 不要误区了！地址以B为单位！

- Cache组成：若干个组，每组若干个block，每个block有1位valid+tag+data

- 替换策略：Random，LRU（上次访问距离最远的），FIFO（字面意，队列）

- 写穿写回，写回需要dirty位表示数据是否修改

  - write miss：Write allocate(先读回Cache再写，与写回配对) & write around（不读回Cache，与写穿配对）
  - 写入内存时间太长，加buffer也难以避免 称为write stall。（加buffer则读数据要先找buffer再找内存）

- Average Memory Assess time = hit time + miss time = hit rate × Cache time + miss rate × memory time

- **虚拟地址**

  - 主存是磁盘的Cache；对于每一个进程建立pagetable以让程序认为内存连续且够大
  - 地址以页为最小单元
  - 一般认为virtual pages更多，但不一定
  - 虚拟内存使用LRU策略，写回
  - ![image-20250101163819391](/img/CO/Fin-vir&phyPage.jpg)
  - page fault:数据不在内存而在磁盘
  - page table：每个block1b valid 1b dirty,存储物理地址
  - TLB：全关联（感觉像cache和Page table生了个孩子）valid,dirty,tag,**physical page address**

  ![image-20250101171055859](/img/CO/Fin-TLBPTMRelation.jpg)