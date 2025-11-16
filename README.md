# 🚀 Task Management Dashboard  
A modern Kanban-style task manager built with **React**, **Redux Toolkit**, and **Material UI**.

## 📌 Overview

A fully interactive **task management dashboard** that allows users to create, edit, delete, and organize tasks using a drag-and-drop Kanban layout.  
Includes **comments**, **subtasks**, **files**, **priority filtering**, **date filtering**, and an intuitive **notification system**.

---

## ✨ Features

### 🔐 Authentication  
- Signup, Login, Logout  
- LocalStorage-based auth  
- Protected routes using a custom `ProtectedRoute`  
- Stores user info + token locally  

---

### 📝 Task Management  
- Create new tasks  
- Edit existing tasks  
- Delete tasks  
- Drag & drop tasks between columns  
- Kanban columns:  
  - **To Do**  
  - **In Progress**  
  - **Done**  

---

### 📑 Task Details  
Each task includes:

- Title  
- Description  
- Priority (High, Medium, Low)  
- Due Date  
- Subtasks (add, toggle, delete)  
- Comments (add/delete)  
- File attachments (add/delete)  
- Status and metadata panel  

_All accessible inside a full task detail dialog._

---

### 🧩 Subtasks  
- Add subtasks  
- Mark as completed  
- Remove subtasks  
- Subtask progress updates instantly  

---

### 💬 Comments  
- Add comments  
- Delete comments  
- Author and timestamp stored  

---

### 📎 File Attachments  
- Upload attachments  
- Delete attachments  
- File preview + metadata  

---

### 🗂 Filters  
Includes both **priority filters** and **date filters**:

#### Priority Filter:
- All  
- High  
- Medium  
- Low  

#### Date Filter:
- Today  
- This Week  
- This Month  
- Custom Date  
- Clear Date Filter  

---

### 🔔 Notifications  
Automatic reminders based on due dates:

- **Overdue tasks**  
- **Tasks due today**  
- **Tasks due soon (next 1–2 days)**  
- Badge on navbar showing unread reminders  
- Clicking notification opens task detail  

---

### 🖼️ UI Features  
- Two view modes: Spacious / Compact  
- Clean Material UI styling  
- Project rename modal  
- Project link sharing  
- Responsive layout  

---

## 🛠️ Tech Stack

| Layer        | Technology |
|--------------|------------|
| Frontend     | React + Vite |
| State Mgmt   | Redux Toolkit |
| UI Library   | Material UI |
| Drag & Drop  | `@hello-pangea/dnd` |
| Routing      | React Router DOM |
| Storage      | LocalStorage |


## 🚀 Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Harrssshh/Mobile-app.git

