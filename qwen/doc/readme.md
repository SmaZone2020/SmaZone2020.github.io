下面是将你的页面整理为 **Markdown 文档说明版**，适合放到 README / 接口调试文档里。

---

# QwenWebAPI 调试工具

通过该页面可以**可视化调试 QwenWebAPI 的所有核心接口**，支持：

* 会话管理
* 模型查询
* 创建会话
* 会话历史
* 流式消息发送（Streaming）

---

## 🔧 使用方式

页面通过 **URL 参数** 自动读取认证信息：

```
?auth=你的密钥&host=http://你的服务器地址
```

示例：

```
http://localhost:8080/index.html?auth=ABC123&host=http://localhost:5000
```

| 参数     | 说明                                  |
| ------ | ----------------------------------- |
| `auth` | WebAPI 的认证密钥，会自动填充到页面               |
| `host` | API 基础地址，默认 `http://localhost:5000` |

---

## 🧭 页面结构

页面分为三块：

1. **左侧：接口列表**
2. **右侧上：接口参数区**
3. **右侧下：响应结果区（支持流式展示）**

---

## 📡 接口列表

### 1️⃣ 获取会话列表

```
GET /Main/sessions
```

---

### 2️⃣ 获取模型列表

```
GET /Main/models
```

---

### 3️⃣ 创建新会话

```
POST /Main/sessions
```

返回：

```json
{
  "Id": "session-id"
}
```

页面会自动记录该 `Id` 作为当前会话。

---

### 4️⃣ 获取会话历史

```
GET /Main/sessions/{sessionId}
```

参数：

| 参数        | 必填 | 说明   |
| --------- | -- | ---- |
| sessionId | ✅  | 会话ID |

---

### 5️⃣ 发送消息（支持流式响应）

```
POST /Main/sessions/{sessionId}/messages
```

请求体：

```json
{
  "Content": "你好，有什么可以帮助我的吗？"
}
```

特性：

* 使用 `ReadableStream`
* 实时流式输出到页面
* 自动滚动
* 自动记录当前 `sessionId`

---

## 🔐 请求头

所有请求都会自动附带：

```
Auth: 你的密钥
Content-Type: application/json
```

---

## 📺 响应区域功能

| 功能         | 说明                 |
| ---------- | ------------------ |
| 状态码显示      | 显示 HTTP 状态与成功/失败   |
| JSON 格式化   | 自动格式化返回            |
| 流式展示       | sendMessage 实时流式输出 |
| 复制         | 一键复制响应             |
| 清空         | 清空响应区域             |
| Loading 动画 | 请求时遮罩提示            |

---

## 🧠 会话自动管理机制

以下情况会自动记录 `currentSessionId`：

* 创建会话成功
* 获取会话列表成功（取第一个）
* 发送消息成功

后续接口会自动填充该 ID。

---

## 💡 技术要点

| 技术              | 用途           |
| --------------- | ------------ |
| TailwindCSS     | UI 样式        |
| Fetch API       | 请求发送         |
| ReadableStream  | 流式读取         |
| URLSearchParams | 读取 auth/host |
| 原生 JS           | 无框架依赖        |

---

## 🚀 适用场景

* WebAPI 联调
* Streaming 调试
* 会话机制验证
* 模型接口测试
* 部署后远程调试

---

## 🧪 调试建议流程

1. 获取模型列表
2. 创建新会话
3. 发送消息测试流式
4. 查看会话历史
5. 查看会话列表验证

---

## 📌 注意事项

* 必须通过 URL 提供 `auth`
* Streaming 接口仅在 `sendMessage` 中生效
* 支持任意 WebAPI 服务器地址切换
* 无需后端页面，纯前端 HTML

---

## ✅ 示例完整调试地址

```
http://localhost:8080/debug.html?auth=ABC123&host=http://localhost:5000
```
