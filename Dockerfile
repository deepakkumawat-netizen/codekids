FROM python:3.11-slim

# Install Java, C++, Go, Node.js
RUN apt-get update && apt-get install -y \
    default-jdk \
    g++ \
    golang \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Pre-warm Go build cache
RUN mkdir -p /tmp/gowarm && \
    printf 'package main\nimport "fmt"\nfunc main(){fmt.Println("warm")}\n' > /tmp/gowarm/main.go && \
    GOCACHE=/root/.cache/go-build go build -o /tmp/gowarm/out /tmp/gowarm/main.go && \
    rm -rf /tmp/gowarm

WORKDIR /app

COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

COPY frontend/ ./frontend/
RUN cd frontend && npm run build

COPY backend/ ./backend/

CMD sh -c "cd /app/backend && uvicorn main:app --host 0.0.0.0 --port $PORT"
