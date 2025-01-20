---
title: 计组笔记
published: 2024-09-24
description: '计算机组成课堂笔记'
image: ''
tags: [computer-organization,hardware]
category: 'notebook'
draft: false 
lang: 'zh-CN'
---

[RISC-V指令译码器](#https://luplab.gitlab.io/rvcodecjs/)

# 目录

[期末复习](#Review)

- [Chapter1: Computer Abstraction and Technology](#Chapter1)
- [**Chapter2: Instructions: Language of the Computer**](#Chapter2)
- [**Chapter3: Arithmetic for Computers**](#Chapter3)
- **[Chapter4: The Processor: Datapath and Control](#Chapter4)**
- **[Chapter5: Large and Fast: Exploiting Memory Hierarchy](#Chapter5)**
- Chapter 6: Parallel processor from client to Cloud (选讲，非考试内容)
- Appendix: Storage, Networks, and Other Peripherals (了解概念)
- [附录](#附录)

# 期末复习<a id="Review"></a>

## Ch2

- 指令格式、含义。

  - 注意有无符号、offset*2

  ![img](/img/CO/Fin-instFormatAndRegs.jpg)

- 指令扩展、程序到运行的过程

  - M、A、F、D、C

![combined_image](/img/CO/Final-inst_op.jpg)

![image-20250101104846047](/img/CO/Final-c_to_program.jpg)

## Ch3

- 上下溢出
  - 双符号位判断、溢出后中断处理
- ALU控制信号

![image-20250101105212098](/img/CO/Fin-ALUFunTable.jpg)

- 浮点数：格式（1+8+23 & 1+11+52)，省略1，指数偏移量(127,1023)，精度，非正常数据

![image-20250101105755690](/img/CO/Fin-FloatInfNaN.jpg)

## Ch4

- 单周期：控制信号，各种指令数据通路

![image-20250101105955529](/img/CO/Fin-SingleControl1.jpg)

- [ ] ALU control真值表

- 流水线

  - IF ID EX MEM WB五段，增加吞吐率，Latency不变
  - 流程图画法：IM，REG，无标注的ALU图形，DM，REG，除了ALU其他都可分左右上色，左阴影为写入右阴影为读出
  - Hazard:Structure（同时访问同一个资源导致，指令和数据存储分离、增加4个寄存器就不会），data(dddd，load use hazard无法forwarding只能stall)，Control（分支跳转）
  - （一般采用）Branch Predict（静态固定结果，动态依据以前结果）

  ![image-20250101115024113](/img/CO/Fin-LUHazardStallCond.jpg)

  - 减少Branch Delay:在ID处加元件处理Branch以减少stall数量
  - 注意WB 先于ID（实验实现为例）
  - Forward

  ![image-20250101114842783](/img/CO/Fin-ForwardCond.jpg)

  ![image-20250101114906749](/img/CO/Fin-ForwardCondMem.jpg)

  ![image-20250101141901367](/img/CO/Fin-PipelineCPU.jpg)

- 中断

  - 处理：保存PC到SEPC，保存错误原因到SCAUSE，跳转到处理程序
    - Direct:统一到固定地址；Vectored:通过某个基址与SCAUSE的编号跳转到一个位置，该位置存储一条跳转指令以跳转到相应处理程序
    - 如果可以修复就修复再回去（SEPC），否则终止程序报告错误
  - 流水线中的处理：运行完报错指令之前的指令，同时将当前与后续指令flush掉（类似predict错误）

## Ch5

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

## Ch6

- Rotational latency
  - Average rotational latency = $\frac{\text{0.5 rotation}}{\text{xxxRPM}}$ 注意下面单位是 per minute要换算成题目所需

- Access time = seek time + rotational latency+transfer time + controller time

  - transfer time = 数据量/传输速度

- 硬盘可靠性Dependability

- Availability = $\frac{MTTF}{MTTF+MTTR}$

  - MTTF平均无故障时间
    - 增加：避免、预知fault，增加容错（redundancy）
  - MTTR平均修复时间
  - MTBF=MTTF+MTTR平均故障间隔时间

- 磁盘阵列

  - N个磁盘的Reliability是单个磁盘的1/N倍
  - Redundant Arrays of Inexpensive disks
    - 条带化存储striped
    - 利用冗余确保数据可靠性（但是在内存、带宽上有所牺牲）

  ![image-20250101194800274](/img/CO/Fin-diskarray.jpg)

- 其中RAID 2跳过，RAID4：一块校验四块数据，修改/读入均可选择large->整条都读/写，small->修改&校验读/写（校验块负载很高），优化为校验块平均分布得到RAID5
- RAID6：两个不同算法得到的校验块，允许两个错误



# Chapter 1<a id="Chapter1"></a>

- $Performance = \dfrac{1}{Execution Time}$
  - 算法：影响IC，可能影响CPI
  - 编程语言：影响IC和CPI
  - 编译器：影响IC和CPI
  - ISA：影响IC，CPI和$T_c$

- **Execution Time**
  - Elapsed time: Total response time,determines system performance
    - Processing , IO, OS overhead, idle time...
  - CPU time: Time spent processing a given job
    - different programs are affected differently by CPU & system performance
    - Comprises user CPU time & system CPU time
    - $CPU\ \ Time = \frac{CPU\ \ Clock\ \ Cycles}{Clock\ \ Rate} = CPU\ \ Clock\ \ Cycles \times Clock\ \ Cycle\ \ Time $
      - 提速：Clock Cycles和Clock Rate的trade off

$$
\begin{aligned}
CPU\ \ Time =& \frac{CPU\ \ Clock\ \ Cycles}{Clock\ \ Rate}\\
=& CPU\ \ Clock\ \ Cycles \times Clock\ \ Cycle\ \ Time\\
=&Instruction\ \ Count \times CPI\times Clock\ \ Cycle\ \ Time\\
=&\dfrac{Instruction\ \ Count \times CPI}{Clock\ \ Rate}\\
=& \dfrac{Instructions}{Program} \times \dfrac{Clock\ \ cycles}{Instructions}\times\dfrac{Seconds}{Clock cycle}
\end{aligned}
$$

- 平均CPI由CPU硬件、指令类型等决定

$$
Average CPI = \sum(CPI_i\times \dfrac{Instruction\ \ Count_i}{Instruction\ \ Count})
$$

- Instruction Count由程序、指令集（ISA）和编译器决定

- CMOS IC technology中

$$
Power = Capacitive\ \ load\times Voltage^2\times Frequency
$$

- Pitfall

  - **Amdahl's Law**

  $$
  T_{imporved} = \dfrac{T_affected}{improvement\ \ factor}+T_{unaffected}
  $$
  
  - MIPS

  $$
  \begin{aligned}
  MIPS =&\dfrac{IC}{Execution\ \ time \times 10^6}\\
  =& \dfrac{IC}{\dfrac{IC\times CPI}{Clock\ \ rate} \times 10^6}\\
  =&\dfrac{Clock\ \ rate}{CPI \times 10^6}
  \end{aligned}
  $$
  
  
  
  
  
  ![image-20240925113511973](/img/CO/EightIdea.jpg)



# Chapter 2<a id="Chapter2"></a>

## 2 key principles

- Instruction are represented as numbers.

- 
  Programs can be stored in memory to be read or written just like numbers.

## Operations

- 指令的Format决定了指令的结构

  - RISC-V指令集

    ![RISC-V Instruction Format](/img/CO/RISC-VInstructionFormat.jpg)

    - R型：操作全寄存器
    - I型：两个寄存器，一个立即数
    - S型：两个寄存器，一个立即数（被腰斩了）
    - SB型：分支结构，与S型大体相似
      - SB指令的imm[4:1,11]的安排是为了与S对齐 ~~没有imm[0]，很神奇吧~~，imm[12]是符号位拓展，默认第零位是0
    
  - MIPS指令集
  
  ![MIPS Instruction Format](/img/CO/MIPSInstructionFormat.jpg)
  
- Arithmetic

  - One operation per instruction

  - 3 variables(2 src+1 dest)

    - add dest src1 src2 (dest = src1 + src2)
    - sub dest src1 src2 (dest = src1-src2)

  - 操作数得是寄存器

  - Risc-V有32个64位的寄存器（x0~x31)

    - 32b $\rightarrow$ word，64b $\rightarrow$ doublewords

    功能表见[附录](#附录operands)

    

- Memory

    - 只有读写两种操作

    - 按byte操作

    - RISC-V是Little Endian（更低位的byte放在更小的地址）（Big Endian反之）

    - RISC-V不要求Memory Alignment

      - 对齐：存储为0到3,4到7等，起始地址是4的倍数不会跨byte

    - 示例：`A[12]=h+A[8]`，h在x21，A基址x22

      - 指令如下

        ```
        ld x9, 64(x22)
        add x9, x21,x9
        sd 72(x22), x9
        ```

        ` ld`是load double word,`64(x22)`指A[8]，即数字部分是相对基址的偏移量（以字节为单位）

    - 示例：`h=h+55`

      ```
      addi x9 x9 55
      ```

    - Byte/Halfword/Word Operations

      寄存器都是64位不变的，因而

      - 在 `lb,lh,lw` 指令时用符号位扩展
      - 在 `lbu,lhu,lwu` 指令时用0扩展

- Logical Operations

  ![BitwiseOperation](/img/CO/BitwiseOperation.jpg)

  按位取反是不需要的（与全一取异或）

  - Shift Operations : I format
  - AND Operations & OR Operations & XOR Operations: R format 

- Conditional Operations & Loop<a id="条件与循环"></a>
  - beq : 相等则执行；bne : 不等则执行

    `beq x21,x22,L1`,其中L1指代一个指令，值为那条指令与本指令的相对位置。

  - slt : 以 `slt x5, x19, x20` 为例，若 $x_{19}<x_{20}$ 则 $x_5$ 为1

  - blt : 若 $rs_1<rs_2$ 则跳转；bge : 若 $rs_1\ge rs_2$ 则跳转

    - 以及相应的unsigned形式bltu,bgeu

  - SB指令的立即数处理


  ![branch addressing](/img/CO/BranchAddressing.jpg)

  ​			会省略掉最低位的零，因而需要以half word对齐（实际设计是word对齐）

  - 循环的写法

  	- g ~ k对应x20 ~ x24,  base A[i] 存在 x25


  ```c
      do{
      	g = g + A[i];
      	i = i + j;
      }while(i!=h);
  ```

  ```
      LOOP:	slli x10,x22,3  #按字节数A[i]相对于A的偏移量
      		add x10,x10,x25 #x10存储A[i]的地址
      		ld x19 ,0(x10)  #x19存储A[i]的值
      		add x20 x20 x19 
      		add x22,x22,x23
      		bne x22,x21,LOOP
  ```

  ```
      while(A[i] == k) i+=1;
  ```

  ```
      LOOP: slli x10,x22,3
      	  add x10,x10,x25
      	  ld x9,0(x10)
      	  bne x9,x24,EXIT
      	  addi x22,x22,1
      	  beq x0,x0,LOOP
      EXIT:....
  ```

Q：LOOP的值为多少？
A：相对调用语句 ` beq x0,x0,LOOP` 的偏移量，即 -5*4=-20

  - 使用jalr实现Switch

    ```
    switch ( k )  {
    	case  0 :    f  =  i+  j ;  break ;    /*  k  =  0  */
    	case  1 :    f  =  g +  h ;  break ;   /*  k  =  1  */
    	case  2 :    f  =  g  -h ;  break ;   /*  k  =  2  */
    	case  3 :    f  =  i-j ;  break ;    /*  k  =  3  */
    }
    ```

    使用 **jump address table** 解决

    假设 f ~ k 对应 x20 ~ x25， x6 存储 jump address table 的基址，则对应汇编代码如下

    ```
    blt x25, x0, Exit      # test if  k  <  0 
    bge x25, x5, Exit      # if  k  >=  4,  go to Exit
    slli x7, x25, 3        # temp reg x7  =  8  *  k  (0<=k<=3) 
    add x7, x7, x6         # x7  =  address of JumpTable[k]
    ld x7, 0(x7)           # temp reg x7 getsJumpTable[k]
    jalr x1, 0(x7)         # jump based on register x7(entrance)
    Exit:...
    ...
    L0:add $s0, $s3, $s4   # k  =  0  so  f  gets  i+j
       jalr x0, 0(x1)      # end of this case so go to Exit 
    L1:add $s0, $s1, $s2   # k  =  1  so  f  gets  g+h
       jalr x0, 0(x1)      # end of this case so go to Exit 
    L2:sub $s0, $s1, $s2   # k  =  2  so  f  gets  g-h
       jalr x0, 0(x1)      # end of this case so go to Exit 
    L3:sub $s0, $s3, $s4   # k  =  3  so  f  gets  i-j
       jalr x0, 0(x1)      # end of  switch statement
    ```

    代码理解：

    1. 为什么 `slli x7, x25, 3` ？

       A：每条指令都是4B的，下面每个case带2条指令，因此乘以8

    2. 每个case的最后一句的 `jalr x0, 0(x1)` 是什么作用？

       A：跳转回 x1 指令（即Exit），下一条指令没有必要存下来

    3. 代码中出现的 `$s0,$s3,$s4` 都是什么东西？

       A：这是寄存器的别名

    4. `ld x7 0(x7)` 是为什么？

       A：类似于C语言中解引用的过程，可以这么理解。如L0这种label存储的是指令单位置（是一个指向指令的指针），而x6存储的是L0的地址（也就是x6是一个二级指针），因此通过 `x7=x6+8*k` 得到的是存储Lk的地址的寄存器的地址，则此处 ld 指令过后就得到了 Lk的地址

- Basic Blocks
  - 要求：
    - 没有分支
    - 不会有跳转到中间的情况 ("No branch targets/branch labels, except at beginning")
  - 编译器会对 basic blocks 进行加速

## Supporting Procedures

- 函数调用的6个步骤
  - Place Parameters in a place where the procedure can access them
  - Transfer control to the procedure：jump to
  - Acquire the storage resources needed for the procedure
  - Perform the desired task Place the result value in a place where the calling program can access it
  - Return control to the point of origin 
  
- Procedure Call Instructions
  - jal jalr : 无条件跳转  (作caller使用)
    - Jump-and-link : `jal x1,ProcedureAddress` [UJ型]
      - 将紧随其后的下一条指令存入 x1 （如果是 x0 就与 goto 指令等价）
      
      - 并跳转至`ProcedureAddress`
      
      - UJ 指令的立即数处理
      
        ![UJcode](/img/CO/JumpAddress.jpg)
      
        - 可以做到约 1MB 的跳转范围
        - 因为省略最低位同样需要 half word 对齐
      
    - Jump-and-link-register : `jalr x0,0(x1)` [I型] (作callee使用)
      - 跳转到 `0(x1)` 的位置
      - 下一条指令存入 x0 （丢掉不要）
      - 因为寄存器的引入可以实现更大的跳转范围
      - 可以用作switch功能（实例见[Conditional Operations](#条件与循环)部分）
  
- 参数的功用
  - a0 ~ a7(x10 ~ x17) : 传参
  - ra/x1 : 传返回地址

- 堆栈

  - 栈：高地址到低地址

  - 堆：低地址到高地址

  - 包括3个参数： push, pop, 堆栈指针(sp)

    sp存在两种用法：指向最后一个和指向空的，本课程使用指向最后一个的用法。

    以栈为例：

    push: 

    ```
    addi sp, sp, -8
    sd ..., 0(sp)
    ```

    pop:

    ```
    ld ..., 0(sp)
    addi sp, sp, 8
    ```

  - 为了减少入栈出栈，对寄存器进行分类

      - t0 ~ t2(x5 ~ x7) 是临时寄存器，函数调用不保存值
      - a0 ~a7 用于传参

- 样例：阶乘求解

    ```c
    int fact ( int n ){
        if ( n  <  1 )   return  ( 1 ) ;
        else return   ( n  *  fact ( n  -1 ) ) ;
    }
    ```

    ```
    fact:   addi sp, sp, -16   # adjust stack for 2 items
            sd ra, 8(sp)       # save the return address：x1
            sd a0, 0($sp)      # save the argument  n:x10(a0)
            addi t0, a0, -1    # x5 = n  - 1
            bge t0, zero, L1   # if  n  >=  1, go to L1(else)
            addi a0, zero, 1   # return 1 if n <1
            addi sp, sp, 16    # Recover sp(Why not recover x1 and x10 ?)
            jalr zero, 0(ra)   # return to caller
    L1:     addi a0,  a0, -1   # n  >=  1: argument gets ( n  -1 )
            jal ra, fact	   # call fact with ( n  -1)
            add t1, a0, zero   # move result of fact(n -1) to x6(t1)
            ld a0, 0(sp)	   # return from jal: restore argument n
            ld ra, 8(sp)	   # restore the return address
            add sp, sp, 16     # adjust stack pointer to pop 2 items
            mul a0, a0, t1	   # return  n*fact ( n  -1 )
            jalr zero, 0(ra)   # return to the  caller
    ```

​	代码理解：

 1. ra是干什么的？

    书上说法是”保存函数调用返回地址“，这里可以举例子帮助理解。

    在这段代码中，修改ra的地方除了ld只有jal，前者没啥分析价值，只看`jal ra, fact`那句。此处会将jal的后一条指令存入ra，也就是说如果运行了这句话，跳转到fact标签运行，一通操作完之后（肯定入栈和弹栈数量持平），运行`jalr zero,0(ra)`就会跳回到jal的下一句，即从`add t1, a0, zero`开始跑。

    如果放到c里面理解（其实高级语言没有对应的东西），相当于在调用函数之前标记了一下函数后面那句话说是在这里断开开始递归的所以要从这里接着跑。

 2. 怎么理解a0的双重身份？

    a0在传入参数的时候代表 $n$ ，计算完成的时候才作为 $n!$ 存在。例如考虑L1的部分。

    `addi a0,  a0, -1` 是 n

    `jal ra, fact`和` add t1, a0, zero` 处因为递归调用的完成是存储的 $(n-1)!$ 于是很快就用 t1这个临时变量存起来了

    `ld a0, 0(sp)` 恢复 a0 为 $n$

    `mul a0, a0, t1` `jalr zero, 0(ra)` 的位置 a0 终于成为计算结果 $n!$
    
 3. `addi sp, sp, 16    # Recover sp(Why not recover x1 and x10 ?)`

    已经到最底层了，a0不需要往下传，下次使用就是作为 $0!$ 所以不用改； ra没有变化也不用改

## Memory Layout

![MemoryLayout](/img/CO/MemoryLayout.jpg)

- Dynamic data : 堆栈，配有 sp

  ![stack allocation](/img/CO/StackAllocation.jpg)

  - fp(frame pointer) ：指向当前函数压进去的第一个参数的位置（当前进程的起始位置）
  - save saved registers : 超过现有32个的寄存器使用（类似于c的malloc）

- static data : 静态变量（如数组，字符串）、x3 (global pointer) 

- text : 代码

## Character Data

- Byte-encoded character sets
  - ASCII : 128 个字符，其中 33 个是控制字符
  - Latin-1 : 在ASCII基础上加了96个可显示字符
- Unicode : 32b
  - UTF-8 , UTF 16:可变长度的编码

## RISC-V Addressing for 32b Immediate and Address

- U type指令有20位立即数，效果如下

![lui operation](/img/CO/Utype-lui.jpg)

​	则如果要 load 一个 32b 的数可以这样做

![load 32b](/img/CO/ld32b.jpg)

​	Q：为什么是 977 而非 976？

​	A： 2304的符号位是1，赋值的时候符号位扩展需要补一个1消除掉（也就是值+低一位的值）

## Synchronization

- Load reserved: `lr.d rd,(rs1)`
  - 从 rs1 读到 rd
  - 内存预留
- Store conditional: `sc.d rd,(rs1),rs2`
  - 从 rs2 存到 rs1里面的地址
  - 如果该地址未被占用就返回0，反之返回非零值（且不修改）

## Other RISC-V Instructions

- RV64I & RV32I : 64/32b寄存器
  - RV64I中的 addw, subw, addiw, sllw,....是专门处理32b的
- RV32I和RV64I加上后缀表示更多的功能
  - M：支持整数乘除法
  - A：支持原子操作
  - F：支持单精度浮点数
  - D：支持双精度浮点数
  - C：支持压缩指令（有16b指令）

# Chapter 3<a id="Chapter3"></a>

**默认64bit为double word，一个word为32bit**

- 补码可以直接加减，不可直接相乘！
  - （？）如(1001)2平方不会得到49，但是如果补全成(11111001)2的平方可以

- 浮点数：Single precicion ~ Quadruple precision

## ALU

- 加减法溢出条件

  ![image-20240925114525853](/img/CO/overflowCondition.jpg)

![image-20240925115021116](/img/CO/ALUstruct.jpg)

注：上图的set传到less是为了执行slt操作

![image-20240925115107894](/img/CO/ALUFunctionTable&logo.jpg)

### 超前进位加法器

#### 一位版本

$G_i = A_i \& B_i$(generate)

$P_i = A_i|B_i$ (propogation)

则$S_i = P_i \bigoplus C_i$, $C_{i+1}=G_i+P_iC_i$

#### 四位版本

对每个 $C_i$ 进行展开，得到结果如下

$$
\begin{aligned}
C_1 &= G_0 + P_0C_0\\
C_2 &= G_1 + P_1C_1 = G_1 + P_1G_0 + P_1P_0C_0\\
C_3 &= G_2 + P_2C_2 = G_2 + P_2G_1 + P_2P_1G_0 + P_2P_1P_0C_0\\
C_4 &= G_3 + P_3C_3 = G_3 + P_3G_2 + P_3P_2G_1 + P_3P_2P_1G_0 + P_3P_2P_1P_0C_0
\end{aligned}
$$

![CarryLookaheadAdder4b](/img/CO/CarryLookaheadAdder4b.jpg)

-  $C_1$ 到 $C_4$ 同步可得

#### 十六位版本

- fan-in限制不能继续展开了

### 乘法

- 符号问题：一般转成绝对值运算再回去

- 实操：龟速乘做法$\rightarrow$ “山不就我我来就山” 运算结果右移，被乘数不动

$\Rightarrow$ 乘数和结果右移同步，可以利用低位存储乘数

![image-20240925121430846](/img/CO/Multiplier_example.jpg)

- [了解] Booth's Algorithm

​		Idea: 1111010-> 10000000 + 10 -1000

### 除法

- 长除法的减法版本
  - 允许有试减环节，不判断先减再说
- 具体操作（V1）：除数存在寄存器左边，逐渐右移试减；被除数（余数）放在寄存器右边不用动

![DivisionV1](/img/CO/DivisionV1.jpg)

![DivisionV1Process](/img/CO/DivisionV1Process.jpg)

- V2（优化了存储空间）：除数不用开二倍长度，Remainder寄存器将被除数放在右侧，逐步左移，Divisior对齐Remainder最左侧进行减法操作。减法结果从右侧存入Remainder充当V1的Quotient

![DivisionV2](/img/CO/DivisionV2.jpg)

![DivisionV2Process](/img/CO/DivisionV2Process.jpg)

- 因为第一次减法结果必定为0，所以先左移再做减法。随之导致最后多移一次，故加上了ShiftRight接口

**Q：负数除法，余数和商的符号问题？**

**A:Remainder和Dividend保持一致**

- 除法无法并行实现：依赖前一次的结果
- [可以了解]Faster dividers（e.g. SRT division)
- Risc-V中的除法指令
  - div,rem:有符号除法
  - divu,remu:无符号除法
  - 处理器不会对除0和溢出的情况进行报错，需要自行处理

### 浮点数

仿照科学计数法，可以将浮点数记为 $(-1)^s\times F \times 2^E$ 。

- 上溢：正指数太大
- 下溢：负指数太小

#### 表示形式

- RISC-V

  - float : 1位符号位+8位指数+23位尾数
  - double : 1位符号位+11位指数+52位尾数

- IEEE 754浮点数标准：将尾数的1隐含掉（类似科学计数法没有前导零，尾数的第一位必然为1），但0是例外，其表示为 $0....0_2$ 。例如一个浮点数尾数部分表示为 $f_1f_2...f_n$ ，则其值实际为 $1+0.f_1f_2f_3...f_n$   。

  - 对异常值有特殊的表示

  ![image-20241006135825563](/img/CO/FloatNumberSpecialExpression.jpg)

  - 整个浮点数不是补码表示法而是符号-数值形式，但指数部分使用补码表示
  - **移码表示法** ：对指数部分加上一个偏移量以方便比较大小（类似从有符号整数到无符号整数范围的位移），IEEE 754规定 float 偏移量127， double 偏移量1023。则一个浮点数实际值为 $(-1)^S\times (1+$有效位数$) \times 2^{exponent-bias}$ 。
  - 所以float绝对值最小的是 $\pm 1.0\times 2^{-126}$，最大的Fraction:111111，约为2.0，绝对值最大的就是$\pm 2.0\times 2^{127}$ 。双精度分别为 $\pm 1.0\times 2^{-1022}$ 和 $\pm 2.0 \times 2^{1023}$

#### 加减

- 对齐：指数小往指数大对齐

![FloatCalcProcess](/img/CO/FloatCalcProcess.jpg)

![FloatCalcStruct](/img/CO/FloatCalcStruct.jpg)

#### 乘除

- 指数相加（但是要把bias补回来）

![FloatMulProcess](/img/CO/FloatMulProcess.jpg)

![FloatMulStruct](/img/CO/FloatMulStruct.jpg)

（除法类似）

#### Accurate Arithmetic

- 三个extra bits（不一定系统有）
  - guard:
  - round:
  - sticky:
  - [ ] TODO：理解三个extra bits的作用并了解其在浮点数运算具体操作

# Chapter 4<a id="Chapter4"></a>

## 单周期CPU

### Implementation Overview

- 1st: identical

  - 从内存中取出指令
  - 解码，（读寄存器） 

- 2nd：依据指令类型，进行内存访问/计算/分支

  - ALU计算
  - 访问内存，读写
  - 修改PC
  
  ![implementation](/img/CO/implementationOverview.jpg)
  
- PC：寄存器，电脑运行指令的指针
  
- Instruction Memory：存储指令，用来读取
  
- Registers：寄存器读出/写入
  
- Data Memory：更大的内存
  
- ALUs
  
  - 右下：用于寄存器加减等操作
  - 左上：正常运行， `pc=pc+4`
  - 右上：非正常运行（如jal），偏移值来自指令
  
- 多处数据汇流：需要mux
  
  - 下：ALU操作数可能是与立即数或者寄存器；寄存器出来的值（还没懂，待研究！！！）
  - 中：指令可能只是算数运算，结果从ALU产生，也可能是如 `ld t1, 0(t2)` 之类从 Data Memory产出
  - 上：是否跳转决定PC的改变量
  
  图上是数据流向的示意图datapath，但读还是写之类需要另外一套控制系统，如下图蓝色部分
  
  ![Control Part](/img/CO/CPUwithControl.jpg)

### Datapath

#### 部件

- 组合逻辑：ALU、Adder、Multiplexer

- 时序逻辑：Registers、Register files、存储器

  - Registers
    - 写使能 Write Enable ： 置为1且有效时钟边沿到来时修改数据输出为输入值
  - Register files：32个Register
    - 32位输出端口 busA busB & 32位输入端口 busW
    - 5位输入端口 RW RA RB 
    - Clk & Write Enable
    - 读操作：RA 作为地址选择的数据输出到 busA ; RB $\Rightarrow$ busB，**不受 clk 限制**
    - 写操作：当 Write Enable 为1时 RW 作为地址选择的寄存器写入 busW 的数据，**受 clk 限制**
  - 存储器：对应示意图中 Data Memory 的部分
    - 输入输出端口 DataIn & DataOut
    - 地址线 Address
    - Clk & Write Enable
    - 读操作： Address 处数据输出到 DataOut
    - 写操作：当Write Enable为1且时钟边缘有效时向 Address 处写 DataIn

  - Summary：三个部件在读功能时不受 clk 限制，相当于组合逻辑部件，但写操作都要在 clk 有效边缘

Q ：非阻塞和阻塞赋值？

A ：非阻塞等式右边的值统一评估完一起赋值；阻塞赋值是逐条进行，以这组代码为例

```verilog
always @ (posedge clk)begin
	c<=1;
	b<=c;
	a<=b;
end
```

上文是非阻塞赋值，因而c = 1需要两个时钟才能给到a

```verilog
always @ (posedge clk)begin
	c=1;
	b=c;
	a=b;
end
```

这是阻塞赋值，运行是逐行的，因此在一个周期内就能完成 `a=b=c=1` 的任务

### 各类操作对应的 Data path 和 Control 情况

**完整结构图**

![image-20241106110625223](/img/CO/CPUFullDatapathWithControl.jpg)

**Control信号的作用**

![image-20241106105855273](/img/CO/Single_CPU_Control.jpg)

#### R型

- Instruction 流向 Reg1 和 Reg2 和 Wreg ， Reg1 与 Reg2 进入 ALU ，ALU result 直接从 Mux 流向 Reg 的 Write Data 
- RegWrite 1， ALUSrc 0, ALU operation 取决于具体指令， MemWrite 和 MemRead 0，MemtoReg 00， PCSrc 0

 ![image-20241106101336099](/img/CO/Datapath_R.jpg)

#### I 型

- Instruction 流向 Reg1 和 WReg 及 Imm Gen ， Imm Gen 和  Reg1 进入 ALU ，结果输入 Memory address ， 再从 MUX 流回 Reg Write Data.
- RegWrite 1, ALUSrc 1, ALU operation加, MemWrite 0, MemRead 1, MemtoReg 01, PCSrc 0

![image-20241106103552151](/img/CO/Datapath_I.jpg)

#### S 型

- Instruction 流向 Reg1,  Reg2 和 Imm Gen， Imm Gen 和 Reg1 进入 ALU，结果输入 Memory address， Reg2 流向 Memory Write Data 
- RegWrite 0, ALUSrc 1, ALU operation加, MemWrite 1, MemRead 0, MemtoReg 无所谓 , PCSrc 0

![image-20241106104113840](/img/CO/Datapath_S.jpg)

#### SB 型

- Instruction 流向 Reg1, Reg2 和 Imm Gen，Reg1 和 Reg2 流入 ALU ， ALU 的zero 流向顶上的 MUX， Imm Gen 流向 PC 的一个加法器
- RegWrite 0, ALUSrc 0, ALU operation减, MemWrite 0, MemRead 0, MemtoReg 无所谓, PCSrc 由 ALU 的 zero 给出

![image-20241106104843079](/img/CO/Datapath_SB.jpg)

#### J 型

- Instruction 流向 Imm Gen 和 WReg , Imm Gen 流向 Shift left1 从而进入PC的加法器， PC+4 汇入 Data Memory 右边的 MUX 再到 Reg Write Data
- RegWrite 1, ALUSrc 无所谓, ALU operation 无所谓, MemWrite 0, MemRead 0, MemtoReg 10 , PCSrc 1

![image-20241106105651232](/img/CO/Datapath_J.jpg)

#### 汇总：Control信号

**main control**

![image-20241106110151820](/img/CO/CPUmainController.jpg)

**ALU control**

![image-20241106110500572](/img/CO/CPUALUControl.jpg)

## Pipeline

### 理论基础

#### Five stages

- IF : Instruction fetch from memory
- ID : Instruction decode & register read （同时进行）
- EX : Execute operation or calculate address
- MEM : Access memory operand
- WB : Write  result back to register

不是所有指令都五步齐全，但是那一步还是要走

流水线处理 $\Rightarrow$ CPI=1

#### 存在问题

**数据竞争**：相邻两指令用到同寄存器，存在依赖关系 

$\Rightarrow$ 插入 stall 

- [ ] 需要对一段有依赖关系的代码算总时钟周期，能把依赖关系消除掉

$\Rightarrow$ 旁路(bypass)过来（算完了马上取出来用，不走流程）

**控制竞争**：比如前一条指令是跳转，那么后一条指令执行什么取决于前一条的结果

$\Rightarrow$ Branch Prediction

预测是否跳转（基于普遍历史经验预测），预测错误再插入stall

### 实现

#### Datapath

- 每层之间加寄存器，把结果存下来以为下一条指令做缓冲
- 以ld指令为例：直接使用上述设计最后写回的地址出问题了 $\Rightarrow$ Write address（后面要用到的一切信号） 跟着逐级移动（不能直接跳层否则流程出问题） 

#### Control

- IF/ID解码指令，同单周期
- 后面边传边用边丢

#### Hazard

##### Data Hazards

- Detect

![image-20241112081418089](/img/CO/DataHazardDetect.jpg)

​	注意若 Rd 是 x0 就没必要了

​	若前一条指令是 `ld` 则无法旁路处理

```verilog
ID/EX.MemRead and
((ID/EX.RegisterRd= IF/ID.RegisterRs1) or (ID/EX.RegisterRd=IF/ID.RegisterRs2))
```



- Solve

  - bypath

    一般可以从EX/MEM,MEM/WB旁路到ID/EX，因此需要设置一个选择器控制从哪里旁路（处理 Double Data Hazard）

    ![image-20241112082000364](/img/CO/BypathControl.jpg)

    其中FowardA的信号对应选择方式如下，FowardB同理

    ```
    if (MEM/WB.RegWrite and (MEM/WB.RegisterRd≠ 0)
    	and not(EX/MEM.RegWrite and (EX/MEM.RegisterRd≠ 0)
    			and (EX/MEM.RegisterRd=ID/EX.RegisterRs1))
    			and (MEM/WB.RegisterRd= ID/EX.RegisterRs1)) ForwardA= 01
    ```

    ![image-20241112082137189](/img/CO/FowardUnitMuxControl.jpg)

  - bubble

    - 前一条指令是 `ld`，无法直接旁路，插入一个 bubble 可以从 MEM 旁路到 EX（Load-Use Hazard）
    - 强制清空 EX 到 WB 的所有 ( do nop )
      - 只需要：控制信号置零（新增一个 Mux 用于控制）
    - 阻止 PC 和 IF/ID 的更新（新增 Hazard detection unit 用于处理）

    ![image-20241112084242676](/img/CO/Pipeline-LoadHazardDone.jpg)

### Branch Hazards

使用 Predictor 预测行为

- 1b ：与上次跳转结果相同，索引与该指令PC相同
  - 缺点：在双重循环的内层跳出循环和重进循环时会错两次
- 2b ：增加一次的容错

​	![image-20241112090640711](/img/CO/Branch-2bPredictor.jpg)

但是计算 PC 仍然会浪费一个周期

- 预存储好 PC 跳转的值
  - 缺点：空间不够啊
    - sol ：存最近的

#### Instruction-Level Parallelism(ILP)

- Multiple issue （多发）
  - CPI<1 ，所以改用 IPC 衡量效率
  
  - 指令的依赖关系会使得实际 IPC 小于理论
  
  - **Static Multiple issue**
  
    例如：每次同时处理一个ALU/branch+一个load/store指令
  
    - 需要额外的寄存器，额外的ALU（只用加法就行）
  
    ![image-20241113101048768](/img/CO/CPU_StaticDualIssue.jpg)
  
    - 存在问题：遇到依赖差不多废了
  
      例如
  
      ![image-20241113101243354](/img/CO/CPU_StaticDualIssue_problem.jpg)
  
      IPC只有1.25
  
    - 处理方法： Loop Unrolling （编译器实现）
  
      上图的循环可以几次循环捆在一起展开，让并行性提高
  
      ![image-20241113101735266](/img/CO/CPU_StaticDualIssue_LoopUnrolling.jpg)
  
      IPC提高到1.75
  
      可以以这个例子理解
  
      ```cpp
      for(int i = 0; i < 20; ++i) a[i] += 5;
      ```
  
      Loop Unrolling后
  
      ```cpp 
      for(int i = 0; i < 20; i+=4){
      	a[i]+=5;
      	a[i+1]+=5;
      	a[i+2]+=5;
      	a[i+3]+=5;
      }
      ```
  
      `a[i]+=5`的过程改成RISC-V需要先 `ld` 再 `add` 再 `sd` ，改写后可以先全部 `ld` 再全部 `add` 再全部 `sd` ，冲突化解。
  
  - **Dynamic Multiple issue**
  
    - "Superscalar" processors
    - CPU自行决定处理几条指令（在避免hazards的前提下）
    - 不需要编译器（虽然编译器可能有用）
    - $\Rightarrow$ 可以支持乱序执行，结果依然顺序写入寄存器/Memory
  
    ![image-20241113102911115](/img/CO/DynamicallyScheduledCPU_structure.jpg)
  
    - 原因：编译器不总是理解何时有stall， 对branch结果了解不够实时，不专精于本指令集等
  
  - Register Renaming
  
    - 解决指令在流水线中使用相同寄存器导致的冲突
      - 如果操作数可用了就从 register file 或者 reorder buffer 放到 reservation station 去
      - 否则后续由功能函数 直接提供到 reservation station，不经由寄存器
  
  - Speculation
  
    - branch : 预测结果并依据预测结果继续算，但是直到 branch 的结果出来再确定计算结果要不要
    - Load : 预测地址、Load的值、 bypass处理等。同样等到 speculation 被确认后再 commit

## 异常与中断

- 不可预测事件（例如溢出、不合法指令等）
- 外部导致的

### 单周期的处理
### 流水线的处理
- 视为一种特殊的hazard
- 完成前面的操作，后面的操作及本操作的下一步即刻终止（flush）
- 更改 SEPC,SCAUSE 等，跳转到处理程序

问题：若同时存在多条指令出错

- sol 1 : 在最先一条指令报错，把后面的指令flush掉（"precise exceptions"）软件压力小硬件压力大
  - 但是在乱序处理等频发的复杂流水线不好用
- sol 2 : 遇到问题报错，剩下交给软件（"Imprecise exceptions"）软件压力大硬件压力小

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

# Appendix<a id="Appendix"></a>

- - 

## Buses and Other Connections between Processors Memory, and I/O devices

- 总线(Bus)：分北桥和南桥,"shared communication link"
  - 是一组线而非一根

    - 包含两种线：Control lines & Data lines （同CPU）

    - 按速度不同分为三类

      - Processor memory：最快，用于CPU与RAM链接

      - back plane：中等，用于子系统链接

      - I/O：最慢，链接到外部设备

    - 按时钟分为：synchronous bus & asynchronous bus

      - 同步：速度快，但是要求时钟一致且距离够短（例如芯片内部）
      - 异步：握手
  - 南桥慢，北桥快
  - Bus Arbitration
    - daisy chain
    - centralized
    - self selection
    - collision detection
  - [ ] 总线最大带宽计算
  - 如何提高带宽？
    - Increasing data bus width
    - Use separate address and data lines
    - transfer multiple words
- I/O -> Memory,Processor,Operating System
  - commands to I/O
    - memory-mapped I/O(我们使用的)
      - 给IO分配不同的内存接口

    - special I/O instructions
    - command port, data port

  - 与处理器的交流
    - Polling：周期性检查status bit
      - 缺点：浪费CPU的时间

    - Interrupt：I/O设备在需要时会引起处理器的中断
      - 优势：同步操作（IO干活的时候CPU可以干别的）
      - e.g. CPU让打印机启动->CPU继续干活，打印机龟速启动->启动完成，CPU中断，处理打印相关->指令下达完成后CPU继续干活，打印机龟速打印

    - DMA(direct memory access)：设备与内存直接进行数据交流，不经过处理器（数据交流完了之后才跟CPU指令交流）


# 附 录<a id="附录"></a>

## RISC-V operands<a id="附录operands"></a>

![RISC-V operands](/img/CO/RegTable.jpg)


##  RISC-V assembly language<a id="附录assembly language"></a>

![RISC-VAssemblyLanguage1](/img/CO/RISC-VAssemblyLanguage1.jpg)

![RISC-VAssemblyLanguage2](/img/CO/RISC-VAssemblyLanguage2.jpg)

## RISC-V instruction structure<a id="附录instruction structure"></a>

![InstructionStructure](/img/CO/InstructionStructure.jpg)

## RISC-V instruction encoding<a id="附录instruction encoding"></a>

![RISC-Vinstructionencoding1](/img/CO/RISC-Vinstructionencoding1.jpg)

![RISC-Vinstructionencoding2](/img/CO/RISC-Vinstructionencoding2.jpg)

![RISC-Vinstructionencoding3](/img/CO/RISC-Vinstructionencoding3.jpg)







# 最后一节课

- 流水线，不同的配置，判断指令处理结果
  - 4.20搞清楚！
