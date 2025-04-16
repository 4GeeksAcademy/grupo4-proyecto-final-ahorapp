from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, DateTime, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    contrasena: Mapped[str] = mapped_column(String(120), nullable=False)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    telefono: Mapped[str] = mapped_column(String(40), nullable=False)
    direccion: Mapped[str] = mapped_column(String(120))
    fecha_login: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.now(timezone.utc))
    activo: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=True)

    billeteras: Mapped[list["Billetera"]] = relationship(back_populates="usuario")
    registros: Mapped[list["Registro"]] = relationship(back_populates="usuario")

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email,
            "telefono": self.telefono,
            "direccion": self.direccion,
            "fecha_login": self.fecha_login,
            "activo": self.activo,
        }


class Registro(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    descripcion: Mapped[str] = mapped_column(String(120), nullable=False)
    fecha_hora: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.now(timezone.utc))
    valor: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    tipo: Mapped[str] = mapped_column(String(120))

    categoria_id: Mapped[int] = mapped_column(ForeignKey("categoria.id"), nullable=False)
    billetera_id: Mapped[int] = mapped_column(ForeignKey("billetera.id"), nullable=False)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)

    categoria: Mapped["Categoria"] = relationship(back_populates="registros")
    billetera: Mapped["Billetera"] = relationship(back_populates="registros")
    usuario: Mapped["User"] = relationship(back_populates="registros")

    def serialize(self):
        return {
            "id": self.id,
            "descripcion": self.descripcion,
            "fecha_hora": self.fecha_hora,
            "valor": self.valor,
            "tipo": self.tipo
        }


class Categoria(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    descripcion: Mapped[str] = mapped_column(String(120), nullable=False)

    registros: Mapped[list["Registro"]] = relationship(back_populates="categoria")

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion
        }


class Divisa(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    simbolo: Mapped[str] = mapped_column(String(120), nullable=False)
    tasa_cambio: Mapped[float] = mapped_column(Float, nullable=True)

    billeteras: Mapped[list["Billetera"]] = relationship(back_populates="divisa")

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "simbolo": self.simbolo,
            "tasa_cambio": self.tasa_cambio
        }


class Billetera(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    valor_total: Mapped[int] = mapped_column(nullable=False)

    divisa_id: Mapped[int] = mapped_column(ForeignKey("divisa.id"), nullable=False)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)

    divisa: Mapped["Divisa"] = relationship(back_populates="billeteras")
    usuario: Mapped["User"] = relationship(back_populates="billeteras")
    registros: Mapped[list["Registro"]] = relationship(back_populates="billetera")

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "saldo": self.valor_total,
            "divisa_id": self.divisa_id
        }
