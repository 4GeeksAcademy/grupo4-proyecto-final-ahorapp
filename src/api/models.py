from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, DateTime, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
from typing import Optional

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(120), nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(40), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    role: Mapped[str] = mapped_column(String(20), nullable=False, default="user")
    last_login: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.now(timezone.utc))
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=True)
    is_premium: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=False)
    

    wallets: Mapped[list["Wallet"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    records: Mapped[list["Record"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    goals: Mapped[list["Goal"]] = relationship(back_populates='user', cascade="all, delete-orphan")


    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "role": self.role,
            "last_login": self.last_login.isoformat(),
            "is_active": self.is_active,
            "is_premium": self.is_premium,
            "wallets": [wallet.serialize() for wallet in self.wallets],
            "records": [record.serialize() for record in self.records],
            "goals": [goal.serialize() for goal in self.goals]
        }

class Record(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    description: Mapped[str] = mapped_column(String(120), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True),nullable=False,default=lambda: datetime.now(timezone.utc))
    amount: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    type: Mapped[str] = mapped_column(String(120))

    category_id: Mapped[int] = mapped_column(ForeignKey("category.id"), nullable=False)
    wallet_id: Mapped[int] = mapped_column(ForeignKey("wallet.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)

    category: Mapped["Category"] = relationship(back_populates="records")
    wallet: Mapped["Wallet"] = relationship(back_populates="records")
    user: Mapped["User"] = relationship(back_populates="records")
    

    def serialize(self):
        return {
            "id": self.id,
            "description": self.description,
            "timestamp": self.timestamp.isoformat(),
            "amount": self.amount,
            "type": self.type,
            "category": self.category.serialize() if self.category else None,
            "wallet": {
                "id": self.wallet.id,
                "name": self.wallet.name
            } if self.wallet else None,
            "user": {
                "id": self.user.id,
                "name": self.user.name
            } if self.user else None
        }


class Category(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False, unique=True)
    description: Mapped[str] = mapped_column(String(120), nullable=False)

    records: Mapped[list["Record"]] = relationship(back_populates="category")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "records_count": len(self.records)
        }


class Currency(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    symbol: Mapped[str] = mapped_column(String(120), nullable=False)
    exchange_rate: Mapped[float] = mapped_column(Float, nullable=True)

    wallets: Mapped[list["Wallet"]] = relationship(back_populates="currency")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "symbol": self.symbol,
            "exchange_rate": self.exchange_rate
        }


class Wallet(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    total_value: Mapped[int] = mapped_column(nullable=False)

    currency_id: Mapped[int] = mapped_column(ForeignKey("currency.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)

    currency: Mapped["Currency"] = relationship(back_populates="wallets")
    user: Mapped["User"] = relationship(back_populates="wallets")
    records: Mapped[list["Record"]] = relationship(back_populates="wallet", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "balance": self.total_value,
            "currency_id": self.currency_id,
            "user_id": self.user_id,
            "total_value": self.total_value,
            "currency": self.currency.serialize() if self.currency else None,
            "user": {
                "id": self.user.id,
                "name": self.user.name
            } if self.user else None
        }

class Goal(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    goal_value: Mapped[int] = mapped_column(nullable=False)
    is_complete: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=False)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False)

    user: Mapped["User"] = relationship(back_populates='goals')

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "goal_value": self.goal_value,
            "is_complete": self.is_complete,
            "user": {
                "id": self.user.id,
                "name": self.user.name
            } if self.user else None
        }
