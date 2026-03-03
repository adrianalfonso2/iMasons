from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional
from database import get_db
from models import JobPosting, CustomQuestion, Employer
from schemas import (
    MentorshipCreate,
    MentorshipUpdate,
    MentorshipResponse,
    MentorshipListResponse,
)

router = APIRouter(prefix="/api/mentorships", tags=["mentorships"])


@router.post("", response_model=MentorshipResponse, status_code=201)
def create_mentorship(posting: MentorshipCreate, db: Session = Depends(get_db)):
    """Create a mentorship posting (jobType is always 'mentorship')."""
    employer = db.query(Employer).filter(Employer.id == posting.employerId).first()
    if not employer:
        raise HTTPException(status_code=404, detail="Employer not found")

    # Validate status value
    if posting.status not in ("active", "closed", "archived"):
        raise HTTPException(status_code=422, detail="status must be 'active', 'closed', or 'archived'")

    db_posting = JobPosting(
        employerId=posting.employerId,
        title=posting.title,
        description=posting.description,
        location=posting.location,
        jobType="mentorship",
        industry=posting.industry,
        status=posting.status,
        isActive=1 if posting.status == "active" else 0,
    )
    db.add(db_posting)
    db.flush()

    for i, q in enumerate(posting.customQuestions):
        db_question = CustomQuestion(
            jobPostingId=db_posting.id,
            questionText=q.questionText,
            questionOrder=q.questionOrder if q.questionOrder else i,
        )
        db.add(db_question)

    db.commit()
    db.refresh(db_posting)
    return db_posting


@router.get("", response_model=list[MentorshipListResponse])
def list_mentorships(
    search: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    industry: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    isActive: Optional[int] = Query(None),
    employerId: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """
    List mentorships with optional search and filters.
    Results are always jobType=='mentorship'.
    """
    query = db.query(JobPosting).filter(JobPosting.jobType == "mentorship")

    # status/isActive filtering same as jobs
    if status is not None:
        query = query.filter(JobPosting.status == status)
    elif isActive is not None:
        query = query.filter(JobPosting.isActive == isActive)

    if employerId is not None:
        query = query.filter(JobPosting.employerId == employerId)
    if location:
        query = query.filter(JobPosting.location.ilike(f"%{location}%"))
    if industry:
        query = query.filter(JobPosting.industry.ilike(f"%{industry}%"))
    if search:
        query = query.filter(
            (JobPosting.title.ilike(f"%{search}%"))
            | (JobPosting.description.ilike(f"%{search}%"))
        )
    return query.order_by(JobPosting.createdAt.desc()).all()


@router.get("/{posting_id}", response_model=MentorshipResponse)
def get_mentorship(posting_id: int, db: Session = Depends(get_db)):
    """Get a single mentorship posting with its custom questions."""
    posting = (
        db.query(JobPosting)
        .options(joinedload(JobPosting.customQuestions))
        .filter(JobPosting.id == posting_id, JobPosting.jobType == "mentorship")
        .first()
    )
    if not posting:
        raise HTTPException(status_code=404, detail="Mentorship not found")
    return posting


@router.put("/{posting_id}", response_model=MentorshipResponse)
def update_mentorship(posting_id: int, updates: MentorshipUpdate, db: Session = Depends(get_db)):
    """Update a mentorship posting.
    jobType stays fixed at 'mentorship' and status/isActive synced.
    """
    posting = db.query(JobPosting).filter(JobPosting.id == posting_id, JobPosting.jobType == "mentorship").first()
    if not posting:
        raise HTTPException(status_code=404, detail="Mentorship not found")

    update_data = updates.model_dump(exclude_unset=True)

    # enforce jobType if provided
    if "jobType" in update_data and update_data["jobType"] != "mentorship":
        raise HTTPException(status_code=422, detail="jobType for mentorship must be 'mentorship'")

    # When status is updated, sync the legacy isActive field
    if "status" in update_data:
        new_status = update_data["status"]
        if new_status not in ("active", "closed", "archived"):
            raise HTTPException(status_code=422, detail="status must be 'active', 'closed', or 'archived'")
        update_data["isActive"] = 1 if new_status == "active" else 0

    for key, value in update_data.items():
        setattr(posting, key, value)

    db.commit()
    db.refresh(posting)
    return posting


@router.delete("/{posting_id}")
def deactivate_mentorship(posting_id: int, db: Session = Depends(get_db)):
    """Close a mentorship posting (soft delete)."""
    posting = db.query(JobPosting).filter(JobPosting.id == posting_id, JobPosting.jobType == "mentorship").first()
    if not posting:
        raise HTTPException(status_code=404, detail="Mentorship not found")
    posting.status = "closed"
    posting.isActive = 0
    db.commit()
    return {"message": "Mentorship closed"}
