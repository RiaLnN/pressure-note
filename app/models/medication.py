from sqlalchemy import Integer, ForeignKey, func, String, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.ext.mutable import MutableList
from app.db.base_class import Base
from datetime import datetime, time
from typing import TYPE_CHECKING, List, Optional
if TYPE_CHECKING:
    from .user import User


class Medication(Base):
    __tablename__ = "medications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    item_name: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    reminders: Mapped[Optional[List[str]]] = mapped_column(MutableList.as_mutable(JSON), nullable=True, default=list)

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="medications")