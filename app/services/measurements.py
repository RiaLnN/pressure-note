from sqlalchemy import select, delete, func, extract
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.pressure import PressureMeasurement
from app.schemas.measurements import PressureUpdate, PressureCreate
from typing import List, Optional, Dict, Any
from itertools import groupby
from datetime import datetime, timedelta, date
from collections import defaultdict
from app.core.logging import logger
import calendar

async def create_measurement(session: AsyncSession, pressure_in: PressureCreate, user_id: int) -> PressureMeasurement:
    pressure = PressureMeasurement(**pressure_in.model_dump(), user_id=user_id)
    session.add(pressure)
    await session.commit()
    await session.refresh(pressure)
    return pressure

async def get_measurements(session: AsyncSession, user_id: int) -> List[PressureMeasurement]:
    result = await session.execute(
        select(PressureMeasurement).where(PressureMeasurement.user_id == user_id).order_by(PressureMeasurement.created_at.desc())
    )
    return result.scalars().all()

async def get_history(session: AsyncSession, user_id: int) -> List[PressureMeasurement]:
    measurements = await get_measurements(session, user_id)
    grouped = []
    for day, items in groupby(measurements, key=lambda x: x.created_at.date()):
        grouped.append({
            "date": day,
            "measurements": list(items)
        })
    return grouped

async def get_stats(session: AsyncSession, user_id: int, period: str = "week"):
    now = datetime.now().date()
    days_count = {"week": 7, "month": 30, "year": 365}.get(period, 7)
    start_date = now - timedelta(days=days_count - 1)

    result = await session.execute(
        select(PressureMeasurement)
        .where(PressureMeasurement.user_id == user_id)
        .where(PressureMeasurement.created_at >= start_date)
        .order_by(PressureMeasurement.created_at.asc())
    )
    stats = result.scalars().all()

    if period == "year":
        measurements_by_month = {
            f"{day.year}-{day.month:02d}": list(items)
            for day, items in groupby(stats, key=lambda x: x.created_at.date().replace(day=1))
        }
        
        full_stats = []
        for i in range(12):
            first_of_current = (now.replace(day=1) - timedelta(days=i*30)).replace(day=1)
            month_key = first_of_current.strftime("%Y-%m")
            
            month_measurements = measurements_by_month.get(month_key, [])
            
            full_stats.append({
                "date": first_of_current,
                "measurements": month_measurements
            })
        
        full_stats.sort(key=lambda x: x["date"])
        
    else:
        measurements_by_date = {
            day: list(items) 
            for day, items in groupby(stats, key=lambda x: x.created_at.date())
        }
        full_stats = []
        for i in range(days_count):
            current_day = start_date + timedelta(days=i)
            full_stats.append({
                "date": current_day,
                "measurements": measurements_by_date.get(current_day, [])
            })
            
    return full_stats

async def get_measurements_by_id(session: AsyncSession, user_id: int, pressure_id: int) -> PressureMeasurement:
    result = await session.execute(
        select(PressureMeasurement)
        .where(PressureMeasurement.user_id == user_id)
        .where(PressureMeasurement.id == pressure_id)
    )
    return result.scalar_one_or_none()

async def update_measurement(session: AsyncSession, pressure: PressureMeasurement, pressure_update: PressureUpdate) -> PressureMeasurement:
    update_data = pressure_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(pressure, key, value)
    
    await session.commit()
    await session.refresh()
    return pressure

async def delete_measurement(session: AsyncSession, user_id: int, pressure_id: int) -> bool:
    query = (
        delete(PressureMeasurement)
        .where(PressureMeasurement.user_id == user_id)
        .where(PressureMeasurement.id == pressure_id)
        )
    result = await session.execute(query)
    await session.commit()
    return result.rowcount > 0

async def get_measurements_monthly(session: AsyncSession, user_id: int, target_date: datetime):
    year = target_date.year
    month = target_date.month
    _, last_day = calendar.monthrange(year, month)
    start_date = date(year, month, 1)
    end_date = date(year, month, last_day)

    result = await session.execute(
        select(PressureMeasurement)
        .where(PressureMeasurement.user_id == user_id)
        .where(PressureMeasurement.created_at >= start_date)
        .where(PressureMeasurement.created_at <= end_date)
        .order_by(PressureMeasurement.created_at.asc())
    )
    all_measurements = result.scalars().all()
    data_by_day = defaultdict(list)
    total_sys = 0
    total_dia = 0
    count_total = 0
    for m in all_measurements:
        day_key = m.created_at.date()
        data_by_day[day_key].append(m)
        total_sys += m.sys
        total_dia += m.dia
        count_total += 1
    
    full_stats = []
    for day in range(1, last_day + 1):
        current_date = date(year, month, day)
        day_measurements = data_by_day.get(current_date, [])
        day_avg = None
        if day_measurements:
            d_sys = sum(m.sys for m in day_measurements) / len(day_measurements)
            d_dia = sum(m.dia for m in day_measurements) / len(day_measurements)
            day_avg = {"sys": round(d_sys, 1), "dia": round(d_dia, 1)}
        
        full_stats.append({
            "date": current_date.isoformat(),
            "measurements": day_measurements,
            "average": day_avg
        })
    month_avg = None
    if count_total > 0:
        month_avg = {
            "sys": round(total_sys / count_total, 1),
            "dia": round(total_dia / count_total, 1)
        }
    
    return {
        "year": year,
        "month": month,
        "month_average": month_avg,
        "days": full_stats
    }

async def get_measurements_daily(session: AsyncSession, user_id: int, target_date: datetime):
    result = await session.execute(
        select(PressureMeasurement)
        .where(PressureMeasurement.user_id == user_id)
        .where(PressureMeasurement.created_at >= datetime.combine(target_date, datetime.min.time()))
        .where(PressureMeasurement.created_at <= datetime.combine(target_date, datetime.max.time()))
        .order_by(PressureMeasurement.created_at.asc())
    )
    all_measurements = result.scalars().all()
    avg = None
    if all_measurements:
        avg_sys = sum(m.sys for m in all_measurements) / len(all_measurements)
        avg_dia = sum(m.dia for m in all_measurements) / len(all_measurements)
        avg = {"sys": round(avg_sys, 1), "dia": round(avg_dia, 1)}

    return {
        "date": target_date.isoformat(),
        "average": avg,
        "measurements": all_measurements
    }