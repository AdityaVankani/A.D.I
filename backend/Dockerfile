# Dockerfile

FROM python:3.11-slim

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

ENV PYTHONUNBUFFERED=True

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]