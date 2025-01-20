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

## 复习笔记
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