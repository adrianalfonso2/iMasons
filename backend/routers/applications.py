from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json

from database import get_db
from models import Application, Student, JobPosting
from schemas import ApplicationCreate, ApplicationResponse, ApplicationStatusUpdate

router = APIRouter(prefix="/api/applications", tags=["applications"])


@router.post("", response_model=ApplicationResponse)
def create_application(payload: ApplicationCreate, db: Session = Depends(get_db)):
    # Validate student + posting exist
    student = db.query(Student).filter(Student.id == payload.studentId, Student.isActive == 1).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found or inactive")

    posting = db.query(JobPosting).filter(JobPosting.id == payload.jobPostingId).first()
    if not posting or posting.status != "active":
        raise HTTPException(status_code=404, detail="Job posting not found or not active")

    # Prevent duplicate applications
    existing = db.query(Application).filter(
        Application.studentId == payload.studentId,
        Application.jobPostingId == payload.jobPostingId
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Already applied to this posting")

    answers_json = json.dumps(payload.answers or {})

    app_row = Application(
        studentId=payload.studentId,
        jobPostingId=payload.jobPostingId,
        status="submitted",
        answersJson=answers_json
    )
    db.add(app_row)
    db.commit()
    db.refresh(app_row)
    return app_row


@router.get("/student/{student_id}", response_model=list[ApplicationResponse])
def list_by_student(student_id: int, db: Session = Depends(get_db)):
    return db.query(Application).filter(Application.studentId == student_id).order_by(Application.createdAt.desc()).all()


@router.get("/posting/{posting_id}", response_model=list[ApplicationResponse])
def list_by_posting(posting_id: int, db: Session = Depends(get_db)):
    return db.query(Application).filter(Application.jobPostingId == posting_id).order_by(Application.createdAt.desc()).all()


@router.put("/{application_id}/status", response_model=ApplicationResponse)
def update_status(application_id: int, payload: ApplicationStatusUpdate, db: Session = Depends(get_db)):
    app_row = db.query(Application).filter(Application.id == application_id).first()
    if not app_row:
        raise HTTPException(status_code=404, detail="Application not found")

    app_row.status = payload.status
    db.commit()
    db.refresh(app_row)
    return app_row
