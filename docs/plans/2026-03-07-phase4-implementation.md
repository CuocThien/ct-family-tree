# Family Tree V2 - Phase 4: Polish - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the application with i18n, timeline features, source management, user management, testing, and documentation.

**Duration:** Week 5

---

## Task Index

| Task | Name | Priority |
|------|------|----------|
| 4.1 | Complete i18n Translation Files | High |
| 4.2 | Create Language Switcher Component | High |
| 4.3 | Apply Translations to All Components | High |
| 4.4 | Create Timeline Entity | Medium |
| 4.5 | Create Timeline Mongoose Model | Medium |
| 4.6 | Implement TimelineService | Medium |
| 4.7 | Create Timeline Resolvers | Medium |
| 4.8 | Frontend - Timeline Page | Medium |
| 4.9 | Create Source Entity | Low |
| 4.10 | Create Source Mongoose Model | Low |
| 4.11 | Implement SourceService | Low |
| 4.12 | Frontend - Source Components | Low |
| 4.13 | Implement UserManagementService | High |
| 4.14 | Create User Management Resolvers | High |
| 4.15 | Frontend - User Management Page | High |
| 4.16 | Write E2E Tests | High |
| 4.17 | Achieve >80% Coverage | High |
| 4.18 | Generate API Documentation | Medium |
| 4.19 | Final Deployment Setup | High |

---

## Task 4.1: Complete i18n Translation Files

### Files
- Update: `frontend/public/locales/en/translation.json`
- Update: `frontend/public/locales/vi/translation.json`

### Implementation

**en/translation.json**
```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "add": "Add",
    "search": "Search",
    "noResults": "No results found",
    "confirm": "Confirm",
    "confirmDelete": "Are you sure you want to delete this?",
    "yes": "Yes",
    "no": "No",
    "close": "Close",
    "back": "Back",
    "next": "Next",
    "previous": "Previous"
  },
  "auth": {
    "login": "Login",
    "logout": "Logout",
    "register": "Register",
    "username": "Username",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "familyName": "Family Name",
    "loginTitle": "Sign in to your account",
    "registerTitle": "Create your family tree",
    "forgotPassword": "Forgot password?",
    "noAccount": "Don't have an account?",
    "hasAccount": "Already have an account?",
    "invalidCredentials": "Invalid username or password",
    "usernameExists": "Username already exists",
    "passwordRequirements": "Password must be at least 8 characters with uppercase, lowercase, and number"
  },
  "nav": {
    "dashboard": "Dashboard",
    "tree": "Family Tree",
    "members": "Members",
    "media": "Media",
    "timeline": "Timeline",
    "settings": "Settings",
    "users": "User Management"
  },
  "member": {
    "title": "Family Members",
    "addMember": "Add Member",
    "editMember": "Edit Member",
    "viewMember": "View Member",
    "firstName": "First Name",
    "lastName": "Last Name",
    "middleName": "Middle Name",
    "maidenName": "Maiden Name",
    "gender": "Gender",
    "male": "Male",
    "female": "Female",
    "other": "Other",
    "bio": "Biography",
    "occupation": "Occupation",
    "birthDate": "Birth Date",
    "deathDate": "Death Date",
    "isLiving": "Living",
    "deceased": "Deceased",
    "photo": "Photo",
    "education": "Education",
    "contact": "Contact Information",
    "medicalHistory": "Medical History"
  },
  "lifeEvent": {
    "birth": "Birth",
    "death": "Death",
    "marriage": "Marriage",
    "work": "Work",
    "custom": "Custom",
    "addEvent": "Add Life Event",
    "eventType": "Event Type",
    "customType": "Custom Type",
    "date": "Date",
    "location": "Location",
    "notes": "Notes"
  },
  "relationship": {
    "title": "Relationships",
    "addRelationship": "Add Relationship",
    "parent": "Parent",
    "child": "Child",
    "spouse": "Spouse",
    "partner": "Partner",
    "adoption": "Adoption",
    "person1": "Person 1",
    "person2": "Person 2",
    "type": "Relationship Type",
    "startDate": "Start Date",
    "endDate": "End Date",
    "current": "Currently Active"
  },
  "tree": {
    "chartView": "Tree Chart",
    "graphView": "Graph View",
    "timelineView": "Timeline View",
    "listView": "List View",
    "zoomIn": "Zoom In",
    "zoomOut": "Zoom Out",
    "resetView": "Reset View",
    "expandAll": "Expand All",
    "collapseAll": "Collapse All"
  },
  "share": {
    "title": "Share Family Tree",
    "createLink": "Create Share Link",
    "copyLink": "Copy Link",
    "linkCopied": "Link copied to clipboard",
    "password": "Password (optional)",
    "expiresAt": "Expiration Date (optional)",
    "revoke": "Revoke Link",
    "activeLinks": "Active Share Links",
    "noLinks": "No active share links"
  },
  "user": {
    "title": "User Management",
    "addUser": "Add User",
    "editUser": "Edit User",
    "username": "Username",
    "role": "Role",
    "owner": "Owner",
    "editor": "Editor",
    "viewer": "Viewer",
    "resetPassword": "Reset Password",
    "newPassword": "New Password",
    "deleteUser": "Delete User",
    "linkMember": "Link to Member"
  },
  "settings": {
    "title": "Family Settings",
    "familyName": "Family Name",
    "description": "Description",
    "isPublic": "Public Family Tree",
    "saveChanges": "Save Changes"
  }
}
```

**vi/translation.json**
```json
{
  "common": {
    "loading": "Đang tải...",
    "error": "Lỗi",
    "success": "Thành công",
    "cancel": "Hủy",
    "save": "Lưu",
    "delete": "Xóa",
    "edit": "Sửa",
    "add": "Thêm",
    "search": "Tìm kiếm",
    "noResults": "Không tìm thấy kết quả",
    "confirm": "Xác nhận",
    "confirmDelete": "Bạn có chắc chắn muốn xóa không?",
    "yes": "Có",
    "no": "Không",
    "close": "Đóng",
    "back": "Quay lại",
    "next": "Tiếp theo",
    "previous": "Trước đó"
  },
  "auth": {
    "login": "Đăng nhập",
    "logout": "Đăng xuất",
    "register": "Đăng ký",
    "username": "Tên đăng nhập",
    "password": "Mật khẩu",
    "confirmPassword": "Xác nhận mật khẩu",
    "familyName": "Tên gia đình",
    "loginTitle": "Đăng nhập vào tài khoản của bạn",
    "registerTitle": "Tạo cây gia phả của bạn",
    "forgotPassword": "Quên mật khẩu?",
    "noAccount": "Chưa có tài khoản?",
    "hasAccount": "Đã có tài khoản?",
    "invalidCredentials": "Tên đăng nhập hoặc mật khẩu không đúng",
    "usernameExists": "Tên đăng nhập đã tồn tại",
    "passwordRequirements": "Mật khẩu phải có ít nhất 8 ký tự với chữ hoa, chữ thường và số"
  },
  "nav": {
    "dashboard": "Bảng điều khiển",
    "tree": "Cây gia phả",
    "members": "Thành viên",
    "media": "Media",
    "timeline": "Dòng thời gian",
    "settings": "Cài đặt",
    "users": "Quản lý người dùng"
  },
  "member": {
    "title": "Thành viên gia đình",
    "addMember": "Thêm thành viên",
    "editMember": "Sửa thông tin",
    "viewMember": "Xem thông tin",
    "firstName": "Tên",
    "lastName": "Họ",
    "middleName": "Tên đệm",
    "maidenName": "Họ gốc",
    "gender": "Giới tính",
    "male": "Nam",
    "female": "Nữ",
    "other": "Khác",
    "bio": "Tiểu sử",
    "occupation": "Nghề nghiệp",
    "birthDate": "Ngày sinh",
    "deathDate": "Ngày mất",
    "isLiving": "Còn sống",
    "deceased": "Đã mất",
    "photo": "Ảnh",
    "education": "Học vấn",
    "contact": "Thông tin liên lạc",
    "medicalHistory": "Lịch sử y tế"
  },
  "lifeEvent": {
    "birth": "Sinh",
    "death": "Mất",
    "marriage": "Kết hôn",
    "work": "Công việc",
    "custom": "Tùy chỉnh",
    "addEvent": "Thêm sự kiện",
    "eventType": "Loại sự kiện",
    "customType": "Loại tùy chỉnh",
    "date": "Ngày",
    "location": "Địa điểm",
    "notes": "Ghi chú"
  },
  "relationship": {
    "title": "Mối quan hệ",
    "addRelationship": "Thêm mối quan hệ",
    "parent": "Cha/mẹ",
    "child": "Con",
    "spouse": "Vợ/chồng",
    "partner": "Bạn đời",
    "adoption": "Nuôi con nuôi",
    "person1": "Người 1",
    "person2": "Người 2",
    "type": "Loại quan hệ",
    "startDate": "Ngày bắt đầu",
    "endDate": "Ngày kết thúc",
    "current": "Đang hoạt động"
  },
  "tree": {
    "chartView": "Sơ đồ cây",
    "graphView": "Đồ thị",
    "timelineView": "Dòng thời gian",
    "listView": "Danh sách",
    "zoomIn": "Phóng to",
    "zoomOut": "Thu nhỏ",
    "resetView": "Đặt lại",
    "expandAll": "Mở rộng tất cả",
    "collapseAll": "Thu gọn tất cả"
  },
  "share": {
    "title": "Chia sẻ cây gia phả",
    "createLink": "Tạo liên kết chia sẻ",
    "copyLink": "Sao chép liên kết",
    "linkCopied": "Đã sao chép liên kết",
    "password": "Mật khẩu (tùy chọn)",
    "expiresAt": "Ngày hết hạn (tùy chọn)",
    "revoke": "Thu hồi liên kết",
    "activeLinks": "Liên kết đang hoạt động",
    "noLinks": "Không có liên kết chia sẻ"
  },
  "user": {
    "title": "Quản lý người dùng",
    "addUser": "Thêm người dùng",
    "editUser": "Sửa người dùng",
    "username": "Tên đăng nhập",
    "role": "Vai trò",
    "owner": "Chủ sở hữu",
    "editor": "Biên tập viên",
    "viewer": "Người xem",
    "resetPassword": "Đặt lại mật khẩu",
    "newPassword": "Mật khẩu mới",
    "deleteUser": "Xóa người dùng",
    "linkMember": "Liên kết với thành viên"
  },
  "settings": {
    "title": "Cài đặt gia đình",
    "familyName": "Tên gia đình",
    "description": "Mô tả",
    "isPublic": "Cây gia phả công khai",
    "saveChanges": "Lưu thay đổi"
  }
}
```

---

## Task 4.13: Implement UserManagementService

### Files
- Create: `backend/src/application/services/UserManagementService.ts`
- Test: `backend/tests/unit/services/UserManagementService.test.ts`

### Implementation

```typescript
import { IUserRepository, IFamilyRepository } from '@/domain/interfaces';
import { UnauthorizedError, NotFoundError, ValidationError } from '@/domain/errors';
import { hashPassword } from '@/utils/hash';
import { User, UserRole } from '@/domain/entities';
import { z } from 'zod';

const createUserSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
  role: z.enum(['OWNER', 'EDITOR', 'VIEWER']),
  memberProfileId: z.string().optional(),
});

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
});

export class UserManagementService {
  constructor(
    private userRepo: IUserRepository,
    private familyRepo: IFamilyRepository
  ) {}

  async createUser(ownerId: string, input: {
    username: string;
    password: string;
    role: UserRole;
    memberProfileId?: string;
  }): Promise<User> {
    const owner = await this.userRepo.findById(ownerId);
    if (!owner || owner.role !== 'OWNER') {
      throw new UnauthorizedError('Only owners can create users');
    }

    const validated = createUserSchema.parse(input);
    const existing = await this.userRepo.findByUsername(validated.username);
    if (existing) {
      throw new ValidationError('Username already exists');
    }

    const passwordHash = await hashPassword(validated.password);
    const user = await this.userRepo.create({
      username: validated.username,
      passwordHash,
      role: validated.role,
      familyId: owner.familyId,
      memberProfileId: validated.memberProfileId,
    });

    return user;
  }

  async updateUserRole(ownerId: string, userId: string, role: UserRole): Promise<User> {
    const owner = await this.userRepo.findById(ownerId);
    if (!owner || owner.role !== 'OWNER') {
      throw new UnauthorizedError('Only owners can update user roles');
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User', userId);
    }

    if (user.familyId !== owner.familyId) {
      throw new UnauthorizedError('Cannot update users from other families');
    }

    if (user.id === owner.id) {
      throw new ValidationError('Cannot change your own role');
    }

    return await this.userRepo.update(userId, { role });
  }

  async resetUserPassword(ownerId: string, userId: string, newPassword: string): Promise<void> {
    const owner = await this.userRepo.findById(ownerId);
    if (!owner || owner.role !== 'OWNER') {
      throw new UnauthorizedError('Only owners can reset passwords');
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User', userId);
    }

    if (user.familyId !== owner.familyId) {
      throw new UnauthorizedError('Cannot reset passwords for users from other families');
    }

    const validated = resetPasswordSchema.parse({ newPassword });
    const passwordHash = await hashPassword(validated.newPassword);
    await this.userRepo.update(userId, { passwordHash } as any);
  }

  async deleteUser(ownerId: string, userId: string): Promise<void> {
    const owner = await this.userRepo.findById(ownerId);
    if (!owner || owner.role !== 'OWNER') {
      throw new UnauthorizedError('Only owners can delete users');
    }

    if (ownerId === userId) {
      throw new ValidationError('Cannot delete yourself');
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User', userId);
    }

    if (user.familyId !== owner.familyId) {
      throw new UnauthorizedError('Cannot delete users from other families');
    }

    await this.userRepo.delete(userId);
  }

  async getFamilyUsers(ownerId: string): Promise<User[]> {
    const owner = await this.userRepo.findById(ownerId);
    if (!owner) {
      throw new UnauthorizedError('User not found');
    }

    return await this.userRepo.findByFamilyId(owner.familyId);
  }
}
```

---

## Task 4.16: Write E2E Tests

### Files
- Create: `frontend/tests/e2e/auth.spec.ts`
- Create: `frontend/tests/e2e/member.spec.ts`
- Create: `frontend/tests/e2e/tree.spec.ts`
- Create: `frontend/tests/e2e/sharing.spec.ts`

### Implementation

**auth.spec.ts**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Sign in');
  });

  test('should register new user', async ({ page }) => {
    await page.click('text=Register');
    await page.fill('[name="username"]', 'testuser123');
    await page.fill('[name="password"]', 'TestPass123');
    await page.fill('[name="confirmPassword"]', 'TestPass123');
    await page.fill('[name="familyName"]', 'Test Family');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should login existing user', async ({ page }) => {
    await page.fill('[name="username"]', 'existinguser');
    await page.fill('[name="password"]', 'TestPass123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.fill('[name="username"]', 'wronguser');
    await page.fill('[name="password"]', 'wrongpass');
    await page.click('button[type="submit"]');
    await expect(page.locator('.ant-message-error')).toBeVisible();
  });
});
```

**member.spec.ts**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Member Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="username"]', 'testowner');
    await page.fill('[name="password"]', 'TestPass123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should create new member', async ({ page }) => {
    await page.click('text=Members');
    await page.click('text=Add Member');
    await page.fill('[name="firstName"]', 'John');
    await page.fill('[name="lastName"]', 'Doe');
    await page.selectOption('[name="gender"]', 'MALE');
    await page.click('button[type="submit"]');
    await expect(page.locator('.ant-message-success')).toBeVisible();
  });

  test('should display member list', async ({ page }) => {
    await page.click('text=Members');
    await expect(page.locator('[data-testid="member-card"]')).toHaveCountGreaterThan(0);
  });

  test('should search members', async ({ page }) => {
    await page.click('text=Members');
    await page.fill('[placeholder="Search"]', 'John');
    await page.waitForTimeout(300);
    await expect(page.locator('[data-testid="member-card"]')).toContainText('John');
  });
});
```

---

## Task 4.18: Generate API Documentation

### Files
- Create: `backend/docs/api/README.md`
- Create: `backend/scripts/generate-api-docs.ts`

### Implementation

The GraphQL schema is self-documenting. Use GraphQL Playground for interactive documentation.

Additional documentation should include:
- Authentication flow
- Error handling patterns
- Rate limiting details
- File upload specifications

---

## Success Criteria - Phase 4

- [ ] All UI text uses i18n
- [ ] Language switcher works
- [ ] Timeline events can be created/viewed
- [ ] Sources can be added to members
- [ ] Owner can manage users
- [ ] E2E tests pass
- [ ] Test coverage >80%
- [ ] API documentation accessible
- [ ] Application deployable via Docker Compose

---

## Final Checklist

### MVP Acceptance Criteria

- [ ] User can register and create family
- [ ] User can login/logout
- [ ] Owner can create family members
- [ ] Owner can add relationships
- [ ] Basic tree visualization works
- [ ] Photos can be uploaded
- [ ] Share links work
- [ ] i18n (EN/VI) functional
- [ ] Test coverage > 80%
- [ ] Docker deployment works
- [ ] No critical security vulnerabilities
- [ ] Responsive on mobile devices

### Quality Criteria

- [ ] No critical security vulnerabilities
- [ ] Responsive on mobile devices
- [ ] Accessible (WCAG 2.1 AA)
- [ ] API documented
- [ ] Deployment documented
