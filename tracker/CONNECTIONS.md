# External Connections

> Status of all external services and integrations.
> Update when integrations change or break.

---

## Services Status

| Service | Status | Purpose | Credentials Location |
|---------|--------|---------|---------------------|
| GitHub | Connected | Source control | `.env` (GITHUB_TOKEN) |
| Vercel | Connected | Deployment | `.env` (VERCEL_TOKEN) |

---

## Account Details

### GitHub
- **Username**: bhagwatgita747
- **Repository**: https://github.com/bhagwatgita747/slow-eating
- **Visibility**: Public

### Vercel
- **Username**: loginforlogins32-6567
- **Email**: loginforlogins32@gmail.com
- **Project**: (To be created on first deploy)

---

## How to Verify Each Connection

### GitHub
```bash
# Using token from .env
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
```

### Vercel
```bash
# Using token from .env
curl -H "Authorization: Bearer $VERCEL_TOKEN" https://api.vercel.com/v2/user
```

---

## Credentials Storage

| Service | Where Stored |
|---------|-------------|
| GITHUB_TOKEN | `.env` (local only, gitignored) |
| VERCEL_TOKEN | `.env` (local only, gitignored) |

**Never commit credentials to git. The .env file is in .gitignore.**

---

*Last updated: 2025-12-11*
