from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import Float
from sqlalchemy import DateTime

from sqlalchemy.sql import func

from database import Base


class PredictionHistory(Base):

    __tablename__ = "prediction_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    molecule_name = Column(
        String(255),
        nullable=True
    )

    smiles = Column(
        Text,
        nullable=False
    )

    predicted_solubility = Column(
        Float,
        nullable=True
    )

    category = Column(
        String(100),
        nullable=True
    )

    prediction_type = Column(
        String(50),
        nullable=True
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )