# Chaper 01 Introduction

## Database Systems

!!! note "Database"
    （非定义，仅作描述）

    Database 是一个单位里面相互关联的数据构成的数据集，且受到 DBMS(Database Management System) 管理

    (PPT上的原话为：Database is a collection of interrelated data about an enterprise, which is managed by DBMS.)

!!! note "两种应用组织方式"
    Applications built on **files** : applications $\leftarrow$ files

    Applications built on **databases** : applications $\leftrightarrow$ DBMS $\leftrightarrow$ database

DBMS 的目标是方便快捷地存、取、找数据

管理数据包括定义结构和操作数据，不同的模型各有不同。

数据库系统需要保证存储数据的安全性，包括系统故障，存储介质坏了，非法访问等等，需要保证数据可用具有一致性。

如果很多用户并发访问，系统要保证数据有序访问不出现混乱。

## Database Applications

数据库很大 $\Rightarrow$ Big Data

其特性为四个 V ：

- Volume: 容量大
- Variety: 种类繁多
- Velocity: 需要实时监测，不是静态数据而是时刻交流的
- Value: 垃圾数据太多不叫大数据，一定是有价值的数据

## Purpose of Database Systems

基于文件系统（而非DB）的APP有如下弊端

- Data redundancy & inconsistency | 数据冗余与不一致
    
    多个文件用来备份保证稳定，但如果一个要修改其他的可能要联动修改，从而易于导致数据不一致

- Data isolation | 数据孤立

    多个文件之间格式不互通    
  
- Difficulty in accessing data | 存取数据困难

    面对不同的查询数据要求可能需要重新编写程序

- Integrity problems | 完整性问题

    很多数据实际上存在限制（例如性别只有两种，年级不为负等），在编程时使用硬编码的方式（使用大量 if 语句判断），如果约束条件变化修改困难

- Atomicity problems | 原子性问题

    一系列操作是不可分割的整体（例如转账时一个账户的扣款，另一个账户收钱，修改的数据写回）。

    如果操作做到一半断电了，没有依据继续修改，要么回撤要么做完

- Concurrent acess anomalies | 并发访问异常

    不受控的并行访问行为也会导致不一致性。

    例如：两个人同时给账户扣款并读取余额，则他们读出的余额可能都是错的。

    需要对并发访问进行有序的控制

- Security problems | 安全性问题
    
    给每个用户一定权限控制

    - authentication 认证,priviledge 权限,audit 审计

DBMS对上述问题进行了解决

!!! DB的特性
    - 数据持久性 | data persistence

    - 数据访问便利性 | convenience in accessing data

    - 数据完整性 | data integrity

    - 多用户并发控制 | concurrency control for multiple user

    - 故障恢复 | failure recovery

    - 安全控制 | security control

## ※View of Data | 数据视图

在 DB 里面数据分三个抽象级别：

物理层，逻辑层和视图层。

![3abstractionlevel](/img/DB/Ch1-3level.png)
> Physical level:describes how a record is stored

表述一条数据如何存储在介质里面（偏向硬件）

例如学生存放在学生文件夹，在某盘某目录下面，而老师在同目录下的老师文件夹。

> Logical level:describes data stored in database, and the relationships among the data.

描述数据的关系

例如老师，同学

> View level: application programs hide details of data types. Views can also hide information for security purposes.

不同应用看到的数据不一样，会隐藏部分细节

相邻两层之间存在映射，不同的视图能映射到逻辑层的数据等。

!!! note "三层抽象的功能"
    1. 隐藏复杂性，例如 view level 无法看到具体存储方式

    2. 能增加适应变化的能力

!!! definition "Schema and Instance"
    相当于编程语言中的 types 和 variables

    **Schema** : DB的逻辑结构，三层抽象各自对应 schema

    在此基础上生成的一个完整的表称为 **Instance**

!!! definition "Data Independence"
    - Physical Data Independence | 物理数据独立性：修改 physical schema 而不用修改 logical schema 的能力
    
    - Logical Data Independence | 逻辑数据独立性：修改 logical schema 而不用修改 physical schema 的能力

    个人理解类似于编程中封装做得越好，外部访问内部的具体文件越少而调用各类功能越多，从而如果要修改类的一些内容时只需要改好这些功能外部就可以不受影响。

## Data Models | 数据模型

是一系列的用于表述 [数据，数据的联系，数据的语义semantics，数据的约束constraints] 的工具。

sjl：提供了数据构造和操作的手段

例如 **关系模型Relational data model** ，实体-联系模型Entity-Relationship data model等。

??? note "Relational Model | 关系模型"
    All the data is stored in various tables.

    Example of tabular data in the relational model.

    每一列是一个属性attribute，每一行是一个元组tuple，例如：

    |姓名|学号|专业|
    |---|---|---|
    |A|1234567|cs|

    不同类型的数据存到不同的表里面（这些表可以有不同的格式），很多张表构成数据库系统

    这是一种数学概念，并非实际使用的表现。

    - [ ] project投影操作和select操作

    有时需要通过某种属性连接两张表，然后再进行tuple的选择和attribute的投影

基于对象的 data model 包括面向对象数据模型

Obeject-oriented 和对象-关系模型Object-relational。

Obeject-oriented database 是通过 class 而非表格来管理数据的。

其吸收了关系数据库的一些理念，得到了对象-关系模型。

其他还有半结构化数据模型Semistructured data model，网状模型Network model，层次模型Hierarchical model等等

一个数据库系统不会同时支持两种 data model 

## Database Languages

数据库的语言包括 Data Definition Language(DDL), Data Manipulation Language(DML), SQL Query Language, Application Program Interface(API)

### DDL

对不同的数据的完整性约束条件进行定义

metadata | 元数据：data about data，描述数据的数据

![DDL](/img/DB/Ch1-DDL.png)

### DML

DML 也被称作 query language （例如 SQL）, "Language for accessing and manipulating the data organized by the appropriate data model."  

语言分两种： Procedural Language 和 Declarative(nonprocedural) Language

包含 顺序、分支、循环 三种语句的语言就是 Procedural language ，它对于可计算的问题能编出程序。

!!! warning "钦定小测考点"
    SQL的询问输入是若干（至少一个，上不封顶）个表，返回值是 **一个表** （即使是单个值，或者空的，也应该理解成表）

### API 

数据库往往是作为高级语言程序的数据支持，这个用来构建完整程序的语言被称为 host language 

而高级语言调用它有两种方式，一是调用 API，二是 embedded SQL 。

其中 embedded SQL 是直接在源代码中写 SQL 语句，但是需要显式指出这是 SQL 语言，然后用编译器转为函数调用，因此不太常用。

## Database Design

- Entity Relationship Model | 实体-联系模型

    它是在设计阶段描述数据模式结构的，使用图示形式而非表格形式

    把信息的实体集 (entity set) 全部设计出来，并将实体之间的联系建立出来

    这个设计是不依赖下面的数据模型的，后续用关系模型或者 O2 模型都可以

- Normalization Theory | 规范化理论

    判断一个关系模式的好坏，并进一步选择分解（如果冗余太多）或者其他处理方式。

## Database Engine | 数据库引擎

构建原理，复杂类型处理等

## Storage Manager | 存储管理

内外存之间数据交换以块为单位，需要高效访问。

一般实现使用 B+ 树（几百叉的）
![StorageManager](/img/DB/Ch1-StorageManager.png)

## Query Processing

查询语句要内部处理转换为关系代数表达式并进行优化，得到 execution plan ，经过查询引擎得到结果

查询优化需要数据库的统计信息和 metadata ，是动态的过程（随着表的变化可能变化）

## Transaction Management

![TM](/img/DB/Ch1-Transaction.png)

## Data Users

![DU](/img/DB/Ch1-TU.png)

## History of DB Systems

- [ ] 自行阅读PPT