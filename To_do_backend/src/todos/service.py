from sqlalchemy.orm import Session
from typing import List, Optional
from src.todos.models import Todo
from src.todos.schemas import TodoCreate, TodoUpdate
from src.todos.exceptions import TodoNotFoundException


class TodoService:
    """Business logic for Todo operations"""
    
    def __init__(self, db: Session): #create new Session for get_db() when get new request
        self.db = db
    
    def get_all_todos(self, skip: int = 0, limit: int = 100) -> List[Todo]:
        """Get all todos with list"""
        return self.db.query(Todo).offset(skip).limit(limit).all()
    
    def get_todo_count(self) -> int:
        """Get total count of todos"""
        return self.db.query(Todo).count()
    
    def get_todo_by_id(self, todo_id: int) -> Todo:
        """Get a specific todo by ID"""
        todo = self.db.query(Todo).filter(Todo.id == todo_id).first()
        if not todo:
            raise TodoNotFoundException(todo_id)
        return todo
    
    def create_todo(self, todo_data: TodoCreate) -> Todo:
        """Create a new todo"""
        db_todo = Todo(
            title=todo_data.title,
            description=todo_data.description,
            is_completed=todo_data.is_completed,
        )
        self.db.add(db_todo)
        self.db.commit()
        self.db.refresh(db_todo)
        return db_todo
    
    def update_todo(self, todo_id: int, todo_data: TodoUpdate):
        todo = self.db.query(Todo).filter(Todo.id == todo_id).first()
        if not todo:
            raise TodoNotFoundException(todo_id)

        for key, value in todo_data.model_dump(exclude_unset=True).items():
            setattr(todo, key, value)

        self.db.commit()
        self.db.refresh(todo)
        return todo
    
    def delete_todo(self, todo_id: int):
        todo = self.db.query(Todo).filter(Todo.id == todo_id).first()
        if not todo:
            raise TodoNotFoundException(todo_id)

        self.db.delete(todo)
        self.db.commit()
    
    def get_completed_todos(self) -> List[Todo]:
        """Get all completed todos"""
        return self.db.query(Todo).filter(Todo.is_completed == True).all()
    
    def get_pending_todos(self) -> List[Todo]:
        """Get all pending todos"""
        return self.db.query(Todo).filter(Todo.is_completed == False).all()