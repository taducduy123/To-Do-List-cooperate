import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.main import app
from src.database import Base, get_db

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def reset_db():
    """Reset database before each test"""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


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
    response = client.get("/api/v1/todos/999")
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
    response = client.delete("/api/v1/todos/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Todo with id 999 not found"


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"