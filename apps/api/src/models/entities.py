import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import JSON, DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class Founder(Base, TimestampMixin):
    __tablename__ = "founders"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255))
    linkedin_url: Mapped[str | None] = mapped_column(String(500))
    twitter_handle: Mapped[str | None] = mapped_column(String(255))
    bio: Mapped[str | None] = mapped_column(Text)
    education: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list)
    work_history: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list)
    sector_focus: Mapped[list[str]] = mapped_column(JSON, default=list)
    thesis_fit_score: Mapped[float | None] = mapped_column()
    relationship_strength: Mapped[str | None] = mapped_column(String(50))
    last_contacted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    enrichment_data: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)

    companies: Mapped[list["Company"]] = relationship("Company", back_populates="founders")


class Company(Base, TimestampMixin):
    __tablename__ = "companies"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    website: Mapped[str | None] = mapped_column(String(500))
    description: Mapped[str | None] = mapped_column(Text)
    sector: Mapped[str | None] = mapped_column(String(100))
    sub_sector: Mapped[str | None] = mapped_column(String(100))
    stage: Mapped[str | None] = mapped_column(String(50))
    round_size: Mapped[float | None] = mapped_column()
    valuation: Mapped[float | None] = mapped_column()
    total_raised: Mapped[float | None] = mapped_column()
    employee_count: Mapped[int | None] = mapped_column()
    founding_year: Mapped[int | None] = mapped_column()
    location: Mapped[str | None] = mapped_column(String(255))
    ai_fit_score: Mapped[float | None] = mapped_column()
    pipeline_stage: Mapped[str | None] = mapped_column(String(50))
    thesis_alignment: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    enrichment_data: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)

    founders: Mapped[list[Founder]] = relationship("Founder", back_populates="companies")
    signals: Mapped[list["Signal"]] = relationship("Signal", back_populates="company")
    meetings: Mapped[list["Meeting"]] = relationship("Meeting", back_populates="company")


class Signal(Base, TimestampMixin):
    __tablename__ = "signals"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("companies.id"))
    signal_type: Mapped[str] = mapped_column(String(50), nullable=False)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    source: Mapped[str | None] = mapped_column(String(255))
    source_url: Mapped[str | None] = mapped_column(String(1000))
    relevance_score: Mapped[float | None] = mapped_column()
    extra: Mapped[dict[str, Any]] = mapped_column("metadata", JSON, default=dict)
    detected_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    company: Mapped[Company | None] = relationship("Company", back_populates="signals")


class Meeting(Base, TimestampMixin):
    __tablename__ = "meetings"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("companies.id"))
    founder_name: Mapped[str | None] = mapped_column(String(255))
    meeting_type: Mapped[str | None] = mapped_column(String(100))
    scheduled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    transcript: Mapped[str | None] = mapped_column(Text)
    summary: Mapped[str | None] = mapped_column(Text)
    action_items: Mapped[list[str]] = mapped_column(JSON, default=list)
    sentiment_score: Mapped[float | None] = mapped_column()
    ai_brief: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)

    company: Mapped[Company | None] = relationship("Company", back_populates="meetings")


class Memo(Base, TimestampMixin):
    __tablename__ = "memos"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    company_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("companies.id"))
    content: Mapped[str | None] = mapped_column(Text)
    memo_type: Mapped[str | None] = mapped_column(String(100))
    conviction_score: Mapped[float | None] = mapped_column()
    author: Mapped[str | None] = mapped_column(String(255))
    tags: Mapped[list[str]] = mapped_column(JSON, default=list)
    structured_data: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
