from fastapi import APIRouter, Depends, status, Query
from typing import List
from src.todos.schemas import TodoCreate, TodoUpdate, TodoResponse, TodoListResponse
from src.todos.service import TodoService
from src.todos.dependencies import get_todo_service

router = APIRouter(prefix="/todos", tags=["Todos"])


@router.get("", response_model=TodoListResponse)
def get_todos(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(100, ge=1, le=100, description="Number of items to return"),
    service: TodoService = Depends(get_todo_service)
):
    """Get all todos with pagination"""
    todos = service.get_all_todos(skip=skip, limit=limit)
    total = service.get_todo_count()
    return TodoListResponse(total=total, items=todos)


@router.get("/{todo_id}", response_model=TodoResponse)
def get_todo(
    todo_id: int,
    service: TodoService = Depends(get_todo_service)
):
    """Get a specific todo by ID"""
    return service.get_todo_by_id(todo_id)


@router.post("", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(
    todo: TodoCreate,
    service: TodoService = Depends(get_todo_service)
):
    """Create a new todo"""
    return service.create_todo(todo)


@router.put("/{todo_id}", response_model=TodoResponse)
def update_todo(
    todo_id: int,
    todo: TodoUpdate,
    service: TodoService = Depends(get_todo_service)
):
    """Update an existing todo"""
    return service.update_todo(todo_id, todo)


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(
    todo_id: int,
    service: TodoService = Depends(get_todo_service)
):
    """Delete a todo"""
    service.delete_todo(todo_id)
    return None


@router.get("/filter/completed", response_model=List[TodoResponse])
def get_completed_todos(service: TodoService = Depends(get_todo_service)):
    """Get all completed todos"""
    return service.get_completed_todos()


@router.get("/filter/pending", response_model=List[TodoResponse])
def get_pending_todos(service: TodoService = Depends(get_todo_service)):
    """Get all pending todos"""
    return service.get_pending_todos()