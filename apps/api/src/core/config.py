from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # App
    app_env: Literal["development", "staging", "production"] = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    app_secret_key: str = "change-me-in-production"
    # Stored as a plain string so pydantic-settings never attempts JSON-decoding.
    # Use the `cors_origins` property wherever a list is needed.
    allowed_origins: str = "http://localhost:3000"

    @property
    def cors_origins(self) -> list[str]:
        if not self.allowed_origins:
            return ["http://localhost:3000"]
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/lattice"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # Neo4j
    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_username: str = "neo4j"
    neo4j_password: str = "password"

    # Weaviate
    weaviate_url: str = "http://localhost:8080"
    weaviate_api_key: str | None = None

    # OpenAI
    openai_api_key: str = ""
    openai_model: str = "gpt-4o"
    openai_embedding_model: str = "text-embedding-3-large"

    # Anthropic
    anthropic_api_key: str = ""
    anthropic_model: str = "claude-sonnet-4-6"

    # Clerk
    clerk_secret_key: str = ""
    clerk_publishable_key: str = ""

    # Sentry
    sentry_dsn: str | None = None

    # Langfuse
    langfuse_secret_key: str | None = None
    langfuse_public_key: str | None = None
    langfuse_host: str = "https://cloud.langfuse.com"

    # Celery
    celery_broker_url: str = "redis://localhost:6379/1"
    celery_result_backend: str = "redis://localhost:6379/2"

    # Integrations
    google_client_id: str | None = None
    google_client_secret: str | None = None
    slack_bot_token: str | None = None
    crunchbase_api_key: str | None = None

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

    @property
    def is_development(self) -> bool:
        return self.app_env == "development"


@lru_cache
def get_settings() -> Settings:
    return Settings()
