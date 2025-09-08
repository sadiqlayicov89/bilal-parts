# 🚀 Deployment Guide - GitHub + Vercel

Bu təlimat sizə GitHub və Vercel istifadə edərək proyektinizi deploy etməyi göstərir.

## 📋 Addım-addım Deployment

### 1. GitHub Repository Yaradın

1. [GitHub.com](https://github.com) saytına daxil olun
2. "New repository" düyməsini basın
3. Repository adı: `bilal-parts-ecommerce`
4. "Public" və ya "Private" seçin
5. "Create repository" basın

### 2. Kodu GitHub-a Push Edin

Terminal-da aşağıdakı əmrləri icra edin:

```bash
# Remote repository əlavə edin (YOUR_USERNAME-i öz GitHub istifadəçi adınızla əvəzləyin)
git remote add origin https://github.com/YOUR_USERNAME/bilal-parts-ecommerce.git

# Main branch-a push edin
git branch -M main
git push -u origin main
```

### 3. Vercel-də Deploy Edin

#### A. Vercel hesabı yaradın
1. [vercel.com](https://vercel.com) saytına keçin
2. "Sign up" basın
3. GitHub hesabınızla daxil olun

#### B. Proyekti import edin
1. Vercel dashboard-da "New Project" basın
2. GitHub repository-nizi seçin: `bilal-parts-ecommerce`
3. "Import" basın

#### C. Build ayarları
Vercel avtomatik olaraq aşağıdakı ayarları tapacaq:
- **Framework Preset:** Other
- **Build Command:** `npm run vercel-build`
- **Output Directory:** `frontend/build`
- **Install Command:** `npm install`

### 4. Environment Variables Əlavə Edin

Vercel dashboard-da "Settings" → "Environment Variables" bölməsinə keçin və aşağıdakı dəyişənləri əlavə edin:

```bash
DATABASE_URL=file:./data/production.db
JWT_SECRET=your-super-secret-jwt-key-production-change-this
NODE_ENV=production
CORS_ORIGIN=https://your-project-name.vercel.app
```

### 5. 1C Integration Endpoint

Deploy olunduqdan sonra 1C integration endpoint-iniz:
```
https://your-project-name.vercel.app/backend/1c_exchange.php
```

### 6. Custom Domain (Opsional)

Öz domeninizi əlavə etmək üçün:
1. Vercel dashboard-da "Settings" → "Domains"
2. Custom domain əlavə edin
3. DNS ayarlarını yeniləyin

## 🔧 Deploy Sonrası Ayarlar

### Admin Panel
1. `https://your-project-name.vercel.app/admin` ünvanına keçin
2. Default admin hesabı:
   - Email: `admin@bilal-parts.com`
   - Şifrə: `admin123`

### 1C Konfiqurasiyası
1C-də aşağıdakı URL-i istifadə edin:
```
https://your-project-name.vercel.app/backend/1c_exchange.php
```

## 🔄 Yenidən Deploy Etmək

Kodu yeniləyib yenidən deploy etmək üçün:

```bash
git add .
git commit -m "Update: your changes description"
git push origin main
```

Vercel avtomatik olaraq yenidən deploy edəcək.

## 🐛 Problemlər və Həllər

### Build Error
Əgər build zamanı xəta alırsınızsa:
1. Local-da `npm run build` əmrini yoxlayın
2. Package.json-da dependencies-ləri yoxlayın
3. Vercel logs-larını yoxlayın

### Environment Variables
Əgər environment variables işləmirsə:
1. Vercel dashboard-da düzgün əlavə edildiyini yoxlayın
2. Redeploy edin

### 1C Connection
Əgər 1C əlaqə qura bilmirsə:
1. URL-in düzgün olduğunu yoxlayın
2. Authentication məlumatlarını yoxlayın
3. Admin panel-də "1C İnteqrasiya" bölməsində logs-lara baxın

## 📞 Dəstək

Əgər problemlər yaranarsa:
1. GitHub Issues yaradın
2. Vercel support-a müraciət edin
3. Logs-ları yoxlayın

## ✅ Deployment Checklist

- [ ] GitHub repository yaradıldı
- [ ] Kod GitHub-a push edildi  
- [ ] Vercel-də import edildi
- [ ] Environment variables əlavə edildi
- [ ] Build uğurla tamamlandı
- [ ] Site açılır və işləyir
- [ ] Admin panel-ə daxil ola bilirəm
- [ ] 1C integration test edildi
- [ ] Custom domain əlavə edildi (opsional)

Uğurlu deployment! 🎉
