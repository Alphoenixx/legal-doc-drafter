from pydantic import BaseModel, Field, validator
from typing import Optional
import re


# ------------------------------------------------
# Base model for all legal documents
# ------------------------------------------------

class LegalBaseModel(BaseModel):

    class Config:
        anystr_strip_whitespace = True
        min_anystr_length = 1
        validate_assignment = True
        extra = "ignore"

    # ---------------------------
    # sanitize whitespace
    # ---------------------------

    @validator("*", pre=True)
    def normalize_text(cls, v):

        if isinstance(v, str):
            v = re.sub(r"\s+", " ", v).strip()

        return v

    # ---------------------------
    # prevent extremely large text
    # ---------------------------

    @validator("*")
    def prevent_prompt_overflow(cls, v):

        if isinstance(v, str) and len(v) > 5000:
            raise ValueError("Field exceeds safe length")

        return v


# ------------------------------------------------
# NDA
# ------------------------------------------------

class NDASchema(LegalBaseModel):

    effective_date: str = Field(..., description="Date agreement becomes effective")
    party_a: str = Field(..., description="First party name")
    party_b: str = Field(..., description="Second party name")

    purpose: str = Field(..., description="Purpose of disclosure")
    duration_months: str = Field(..., description="Duration of NDA")

    jurisdiction: str = Field(..., description="Governing law jurisdiction")


# ------------------------------------------------
# MOU
# ------------------------------------------------

class MOUSchema(LegalBaseModel):

    effective_date: str
    party_a: str
    party_b: str

    purpose: str
    responsibilities: str

    duration_months: str
    jurisdiction: str


# ------------------------------------------------
# Service Agreement
# ------------------------------------------------

class ServiceAgreementSchema(LegalBaseModel):

    effective_date: str

    provider: str
    client: str

    services_desc: str
    payment_terms: str

    duration_months: str
    jurisdiction: str


# ------------------------------------------------
# Partnership Agreement
# ------------------------------------------------

class PartnershipAgreementSchema(LegalBaseModel):

    effective_date: str

    partner_a: str
    partner_b: str

    business_name: str
    purpose: str

    equity_split: str

    jurisdiction: str


# ------------------------------------------------
# Collaboration Agreement
# ------------------------------------------------

class CollaborationAgreementSchema(LegalBaseModel):

    effective_date: str

    party_a: str
    party_b: str

    project_name: str
    contributions: str

    ip_ownership: str

    duration_months: str
    jurisdiction: str


# ------------------------------------------------
# Contract
# ------------------------------------------------

class ContractSchema(LegalBaseModel):

    effective_date: str

    party_a: str
    party_b: str

    obligations: str
    consideration: str

    jurisdiction: str


# ------------------------------------------------
# Statement of Agreement
# ------------------------------------------------

class StatementOfAgreementSchema(LegalBaseModel):

    effective_date: str

    party_a: str
    party_b: str

    agreed_terms: str


# ------------------------------------------------
# Meeting Resolution
# ------------------------------------------------

class MeetingResolutionSchema(LegalBaseModel):

    meeting_date: str

    company_name: str
    attendees: str

    resolutions: str


# ------------------------------------------------
# Router for Gemini schema selection
# ------------------------------------------------

SCHEMA_ROUTER = {

    "nda": NDASchema,

    "mou": MOUSchema,

    "service_agreement": ServiceAgreementSchema,

    "partnership_agreement": PartnershipAgreementSchema,

    "collaboration_agreement": CollaborationAgreementSchema,

    "contract": ContractSchema,

    "statement_of_agreement": StatementOfAgreementSchema,

    "meeting_resolution": MeetingResolutionSchema,

}