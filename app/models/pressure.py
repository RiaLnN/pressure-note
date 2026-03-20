from sqlalchemy import Integer, ForeignKey, func, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base
from datetime import datetime
from typing import TYPE_CHECKING, Optional
if TYPE_CHECKING:
    from .user import User


class PressureMeasurement(Base):
    __tablename__ = "pressure_measurement"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    sys: Mapped[int] = mapped_column(Integer)
    dia: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now()
    )
    description: Mapped[Optional[str]] = mapped_column(String, default=None)

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="measurements")