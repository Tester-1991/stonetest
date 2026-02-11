---
id: 11
title: dict()
sidebar_position: 11
---
`dict()` 是 Python 的内置函数，用于创建一个 **字典 (Dictionary)**。

字典是 Python 中最重要的数据结构之一，它存储的是 **键值对 (Key-Value Pair)** 的映射关系。虽然我们平时常用花括号 `{}` 来创建字典，但 `dict()` 函数在某些特定场景下比 `{}` 更强大、更灵活。

### 1. 基础介绍

#### 语法
```python
dict(**kwargs)
dict(mapping, **kwargs)
dict(iterable, **kwargs)
```

#### 常见创建方式

**1. 关键字参数 (最简洁，键必须是字符串)**
```python
# 键不需要加引号，看起来像变量赋值
d1 = dict(name="Alice", age=18, city="Beijing")
print(d1) 
# 输出: {'name': 'Alice', 'age': 18, 'city': 'Beijing'}
```

**2. 映射 (从另一个字典复制)**
```python
old_d = {"x": 1}
d2 = dict(old_d) # 浅拷贝
```

**3. 可迭代对象 (列表/元组的列表)**
```python
# 列表嵌套元组，每个元组只有两个元素 (key, value)
items = [('id', 1001), ('status', 'active')]
d3 = dict(items)
print(d3) 
# 输出: {'id': 1001, 'status': 'active'}
```

**4. 配合 `zip()` (最常用)**
```python
keys = ['a', 'b', 'c']
values = [1, 2, 3]
d4 = dict(zip(keys, values))
print(d4) 
# 输出: {'a': 1, 'b': 2, 'c': 3}
```

---

### 2. 项目中的实际使用场景

在项目中，`dict()` 往往用于**数据转换**和**动态构建**，而不仅仅是定义静态数据。

#### 场景一：将两个列表合并为字典 (Excel/CSV 处理)
**需求**：读取 Excel 时，第一行是表头（Keys），第二行是数据（Values）。你需要把它们组合成一个字典以便通过列名访问数据。

```python
headers = ["ID", "Name", "Department"]
row_data = [101, "Bob", "IT"]

# 使用 dict(zip(...)) 瞬间完成映射
user_info = dict(zip(headers, row_data))

print(user_info)
# 输出: {'ID': 101, 'Name': 'Bob', 'Department': 'IT'}
# 访问: user_info['Name']
```

#### 场景二：处理数据库查询结果 (List of Tuples 转 Dict)
**需求**：很多数据库驱动（如 `sqlite3` 或某些 ORM 的原生查询）返回的数据格式是“元组列表”，例如 `[('setting_a', True), ('setting_b', 100)]`。我们需要把它转为字典以便快速查找。

```python
# 模拟数据库返回的配置项列表
db_results = [
    ('theme', 'dark'),
    ('notifications', True),
    ('version', '1.0.5')
]

# 直接转换为字典
config = dict(db_results)

if config.get('theme') == 'dark':
    print("启用深色模式")
```

#### 场景三：定义配置项 (代码更整洁)
**需求**：在编写默认配置或测试数据时，如果 Key 都是合法的标识符（纯字符串，不含空格和特殊符号），使用 `dict()` 关键字参数写法比 `{}` 少写很多引号，代码看起来更像配置文件。

```python
# 方式 A: 使用 {} (引号多，看起来乱)
config_a = {
    'host': '127.0.0.1',
    'port': 8080,
    'debug': True,
    'timeout': 30
}

# 方式 B: 使用 dict() (键无需引号，类似赋值，更清晰)
config_b = dict(
    host='127.0.0.1',
    port=8080,
    debug=True,
    timeout=30
)
```

#### 场景四：字典的浅拷贝 (Shallow Copy)
**需求**：你有一个基础配置字典，想在此基础上修改几个参数用于测试，但**不想影响原字典**。

```python
default_config = {'host': 'localhost', 'port': 80}

# 创建副本
test_config = dict(default_config)
test_config['port'] = 8080  # 修改副本

print(default_config['port']) # 80 (原件未变)
print(test_config['port'])    # 8080 (副本已变)
```

#### 场景五：URL 参数解析
**需求**：解析 URL 查询字符串（Query String），将其转换为字典。

```python
from urllib.parse import parse_qsl

url = "https://example.com?category=book&id=123&sort=desc"
query_string = "category=book&id=123&sort=desc"

# parse_qsl 返回 [('category', 'book'), ('id', '123'), ...]
params = dict(parse_qsl(query_string))

print(params)
# 输出: {'category': 'book', 'id': '123', 'sort': 'desc'}
```

### 3. 面试/进阶知识点：`{}` vs `dict()`

虽然两者都能创建字典，但在性能上有细微差别：

*   **`{}` (字面量)**：**更快**。因为它是 Python 的语法糖，在编译成字节码时直接对应 `BUILD_MAP` 指令。
*   **`dict()` (函数)**：**稍慢**。因为它是一个函数调用，涉及函数栈的压栈出栈、参数解析等过程。

**最佳实践建议**：
1.  如果只是定义一个简单的静态字典，优先用 `{}`（如 `d = {'a': 1}`）。
2.  如果需要**类型转换**（如 `zip` 结果转字典、列表转字典），必须用 `dict()`。
3.  如果为了**代码可读性**（如大量字符串 Key 的配置），可以用 `dict(key=val)`。