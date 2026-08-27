# 🚀 Deploying DracoClause Frontend to Vercel

This guide explains how to deploy the DracoClause Next.js 16 frontend to Vercel in 2 minutes.

---

## Option A: Direct Import via Vercel Dashboard (Recommended)

1. Go to [https://vercel.com/new](https://vercel.com/new).
2. Select your repository: **`9ja-maxx/dracoclause`**.
3. In the **Configure Project** screen:
   - **Root Directory**: Select `frontend` (or leave as root `./` since `vercel.json` handles it).
   - **Framework Preset**: `Next.js`.
4. Under **Environment Variables**, add the following keys:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_DRACO_CLAUSE_ADDRESS` | `0x2cf548F7Ec57c58b014ee98466852db63d1D9878` |
| `NEXT_PUBLIC_GENLAYER_RPC_URL` | `https://studio.genlayer.com/api` |
| `NEXT_PUBLIC_GENLAYER_CHAIN_ID` | `61999` |

5. Click **Deploy**.

---

## Option B: Deploy via Vercel CLI

```bash
cd frontend
npm i -g vercel
vercel
# For production release:
vercel --prod
```

---

## 🛡️ Pre-Configured Live Environment Settings

- **Deployed Intelligent Contract**: `0x2cf548F7Ec57c58b014ee98466852db63d1D9878`
- **Network**: GenLayer StudioNet
- **Chain ID**: `61999`
- **RPC Endpoint**: `https://studio.genlayer.com/api`