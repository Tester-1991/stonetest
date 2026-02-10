---
id: 10
title: callable()
sidebar_position: 10
---
`callable()` 是 Python 的一个内置函数，用于检查一个对象**是否可以被调用**（即是否能在后面加括号 `()` 来执行）。

它是 Python 动态特性的重要体现，帮助我们在运行时判断一个变量到底是“数据”还是“函数/方法”。

### 1. 基础介绍

#### 语法
```python
callable(object)
```

#### 返回值
*   **`True`**: 对象看起来是可以调用的。
*   **`False`**: 对象绝对不可调用。

> **注意**：返回 `True` 并不保证调用一定成功（比如参数传错了会报错），但返回 `False` 则意味着如果你尝试 `object()`，一定会报 `TypeError`。

#### 哪些对象是 Callable 的？
1.  **函数**（内置函数、自定义函数、`lambda` 表达式）。
2.  **类**（调用类会创建实例，即 `MyClass()`）。
3.  **类的方法**。
4.  **实现了 `__call__` 方法的类实例**（这是 Python 的黑魔法之一）。

#### 简单示例
```python
def my_func():
    pass

class MyClass:
    def method(self):
        pass

class CallMe:
    def __call__(self):
        return "I am called!"

# 1. 函数 -> True
print(callable(my_func))      # True
print(callable(len))          # True (内置函数)

# 2. 类 -> True
print(callable(MyClass))      # True

# 3. 普通变量 -> False
name = "Python"
print(callable(name))         # False

# 4. 类实例 (实现了 __call__) -> True
obj = CallMe()
print(callable(obj))          # True
print(obj())                  # 输出: I am called!
```

---

### 2. 项目中的实际使用场景

`callable()` 在编写**通用框架**、**回调系统**或**灵活配置**时非常有用。

#### 场景一：回调函数校验 (Callback Validation)
**需求**：编写一个事件处理系统（如按钮点击、网络请求完成），允许用户注册回调函数。在注册或执行前，必须确保用户传进来的是个函数，而不是字符串或整数。

```python
def register_click_handler(handler):
    # 防御性编程：防止用户传错参数导致程序崩溃
    if not callable(handler):
        raise ValueError(f"Handler must be a function, got {type(handler)}")
    
    print("Handler registered successfully.")
    # 模拟点击
    handler()

def on_click():
    print("Button clicked!")

# 正确用法
register_click_handler(on_click)

# 错误用法 (会抛出 ValueError)
# register_click_handler("not a function")
```

#### 场景二：灵活的配置项 (静态值 vs 动态函数)
**需求**：设计一个缓存系统，过期时间（TTL）既可以是一个固定的数字（如 60秒），也可以是一个函数（根据当前系统负载动态计算过期时间）。

```python
import time

class Cache:
    def __init__(self, ttl):
        # ttl 可以是 int，也可以是 function
        self.ttl = ttl

    def get_ttl(self):
        # 核心逻辑：如果是函数就调用它，否则直接返回数值
        if callable(self.ttl):
            return self.ttl()
        return self.ttl

# 用法 A: 固定过期时间
static_cache = Cache(ttl=60)
print(static_cache.get_ttl())  # 60

# 用法 B: 动态过期时间 (例如：白天短，晚上长)
def dynamic_ttl():
    hour = time.localtime().tm_hour
    return 60 if 9 <= hour < 18 else 300

dynamic_cache = Cache(ttl=dynamic_ttl)
print(dynamic_cache.get_ttl()) # 根据当前时间返回 60 或 300
```

#### 场景三：装饰器 (Decorator) 开发
**需求**：编写一个装饰器，既可以不带参数使用 `@log`，也可以带参数使用 `@log(level="INFO")`。这需要判断传入的第一个参数是函数（被装饰者）还是配置值。

```python
import functools

def log(arg=None):
    # 如果 arg 是 callable，说明是 @log 直接使用（arg 就是被装饰的函数）
    if callable(arg):
        @functools.wraps(arg)
        def wrapper(*args, **kwargs):
            print(f"Calling {arg.__name__}")
            return arg(*args, **kwargs)
        return wrapper
    
    # 否则，说明是 @log(...) 带参数使用（arg 是参数，如 level）
    else:
        def decorator(func):
            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                print(f"[{arg}] Calling {func.__name__}")
                return func(*args, **kwargs)
            return wrapper
        return decorator

@log
def func_a(): pass

@log("DEBUG")
def func_b(): pass
```

#### 场景四：依赖注入与插件加载
**需求**：在 Web 框架（如 Django/Flask）或插件系统中，经常需要根据字符串路径加载模块中的某个对象。加载后，需要判断这个对象是直接的数据，还是一个需要实例化的类或函数。

```python
# 模拟从配置文件加载对象
loaded_obj = load_from_string("my_module.MyPlugin")

if callable(loaded_obj):
    # 如果是类或函数，实例化/调用它
    plugin_instance = loaded_obj()
    plugin_instance.run()
else:
    # 如果是预配置好的对象，直接使用
    loaded_obj.run()
```

### 3. 总结

*   **核心作用**：区分“数据”和“代码”。
*   **最佳实践**：当你设计的 API 允许参数既可以是**值**也可以是**生成值的工厂函数**时，`callable()` 是必不可少的工具。
*   **底层原理**：`callable(obj)` 本质上是在检查对象所属的类是否定义了 `__call__` 方法。