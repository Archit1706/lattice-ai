"""Health check tests."""
import pytest
from httpx import AsyncClient, ASGITransport

from src.main import app


@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


@pytest.mark.asyncio
async def test_root():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/")
    assert response.status_code == 200
    assert "Lattice" in response.json()["name"]


@pytest.mark.asyncio
async def test_signals_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/signals/")
    assert response.status_code == 200
    data = response.json()
    assert "signals" in data
    assert len(data["signals"]) > 0
