from sqlalchemy import String, BigInteger, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.ext.mutable import MutableDict
from app.db.base_class import Base
from .pressure import PressureMeasurement
from typing import List, TYPE_CHECKING, Dict, Any
if TYPE_CHECKING:
    from .pressure import PressureMeasurement
    from .medication import Medication

class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, index=True)
    username: Mapped[str | None] = mapped_column(String, nullable=True)
    settings: Mapped[Dict[str, Any]] = mapped_column(MutableDict.as_mutable(JSON), default=lambda: {
        "theme": "light",
        "target_pressure": {"sys": 120, "dia": 80},
        "notifications": True,
        "pressure_reminders": ["09:00", "21:00"],
        "language_code": "en",
        "timezone": "Europe/Kyiv"
    })

    measurements: Mapped[List["PressureMeasurement"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    medications: Mapped[List["Medication"]] = relationship(back_populates="user", cascade="all, delete-orphan")