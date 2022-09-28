# READEME.md

## 部署

```bash
DOCKER_BUILDKIT=0 docker build -t htmltopdf:latest .
docker run -d --restart unless-stopped --name htmltopdf -p 3000:3000 htmltopdf:latest
```