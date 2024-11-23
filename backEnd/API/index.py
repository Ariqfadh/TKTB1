from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from tempfile import TemporaryFile
import requests
import shutil
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ML_SERVER_URL = os.getenv("ML_SERVER_URL", "http://127.0.0.1:8001/predict")

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG and PNG are supported.")

    try:

        with TemporaryFile() as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_file.seek(0)

            files = {"file": (file.filename, temp_file, file.content_type)}
            logger.info(f"Sending file {file.filename} to ML server: {ML_SERVER_URL}")
            response = requests.post(ML_SERVER_URL, files=files)

            if response.status_code == 200:
                if "Content-Type" in response.headers and "image" in response.headers["Content-Type"]:
                    return StreamingResponse(
                        content=response.iter_content(chunk_size=1024),
                        media_type=response.headers["Content-Type"],
                        headers={"Content-Disposition": f"attachment; filename=output_{file.filename}"}
                    )
                
                return JSONResponse(content=response.json(), status_code=200)
            else:
                logger.error(f"Error from ML server: {response.status_code} - {response.text}")
                return JSONResponse(
                    content={"error": "Failed to get a valid response from ML server"},
                    status_code=response.status_code
                )
    except Exception as e:
        logger.exception("An error occurred during file upload or ML server communication.")
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/")
async def root():
    return {"message": "FastAPI backend is running."}
