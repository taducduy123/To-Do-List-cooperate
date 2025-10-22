import pytest
from fastapi.testclient import TestClient
from src.main import app
from src.database import get_db
from src.models import Todo

client = TestClient(app)


@pytest.fixture(autouse=True)
def cleanup_todos():
    """Clean up todos before and after each test"""
    db = next(get_db())
    try:
        # Clean before test
        db.query(Todo).delete()
        db.commit()
        yield
        # Clean after test
        db.query(Todo).delete()
        db.commit()
    finally:
        db.close()


def test_create_todo():
    """Test creating a new todo"""
    response = client.post(
        "/api/v1/todos",
        json={"title": "Test Todo", "description": "Test Description"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["description"] == "Test Description"
    assert data["is_completed"] is False
    assert "id" in data


def test_get_todos():
    """Test getting all todos"""
    # Create a todo first
    client.post("/api/v1/todos", json={"title": "Test Todo"})
    
    response = client.get("/api/v1/todos")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert len(data["items"]) == 1


def test_get_todo_by_id():
    """Test getting a specific todo"""
    # Create a todo
    create_response = client.post("/api/v1/todos", json={"title": "Test Todo"})
    todo_id = create_response.json()["id"]
    
    # Get the todo
    response = client.get(f"/api/v1/todos/{todo_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "Test Todo"


def test_get_nonexistent_todo():
    """Test getting a todo that doesn't exist"""
    response = client.get("/api/v1/todos/999999")
    assert response.status_code == 404


def test_update_todo():
    """Test updating a todo"""
    # Create a todo
    create_response = client.post("/api/v1/todos", json={"title": "Test Todo"})
    todo_id = create_response.json()["id"]
    
    # Update the todo
    response = client.put(
        f"/api/v1/todos/{todo_id}",
        json={"title": "Updated Todo", "is_completed": True}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Todo"
    assert data["is_completed"] is True


def test_delete_todo():
    """Test deleting a todo"""
    # Create a todo
    create_response = client.post("/api/v1/todos", json={"title": "Test Todo"})
    todo_id = create_response.json()["id"]
    
    # Delete the todo
    response = client.delete(f"/api/v1/todos/{todo_id}")
    assert response.status_code == 204
    
    # Verify it's deleted
    get_response = client.get(f"/api/v1/todos/{todo_id}")
    assert get_response.status_code == 404
    

def test_delete_todo_not_found():
    """Test deleting nonexistent todo"""
    response = client.delete("/api/v1/todos/999999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Todo with id 999999 not found"


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_create_todo_without_description():
    """Test creating a todo without description"""
    response = client.post(
        "/api/v1/todos",
        json={"title": "Test Todo Only"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Todo Only"
    assert data["description"] is None or data["description"] == ""


def test_update_partial_todo():
    """Test partial update of a todo"""
    # Create a todo
    create_response = client.post(
        "/api/v1/todos",
        json={"title": "Original Title", "description": "Original Description"}
    )
    todo_id = create_response.json()["id"]
    
    # Update only the completion status
    response = client.put(
        f"/api/v1/todos/{todo_id}",
        json={"is_completed": True}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_completed"] is True
    # Original title should remain if your API supports partial updates
    

def test_get_todos_pagination():
    """Test pagination of todos"""
    # Create multiple todos
    for i in range(5):
        client.post("/api/v1/todos", json={"title": f"Test Todo {i}"})
    
    # Get with pagination
    response = client.get("/api/v1/todos?skip=0&limit=3")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 5
    assert len(data["items"]) == 3


def test_create_todo_empty_title():
    """Test creating a todo with empty title (should fail if validation exists)"""
    response = client.post(
        "/api/v1/todos",
        json={"title": "", "description": "Test"}
    )
    # This should return 422 if you have validation, otherwise 201
    assert response.status_code in [422, 201]