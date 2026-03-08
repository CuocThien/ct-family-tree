# Family Tree V2 - Phase 2: Core Features - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement core family tree functionality including member management, relationships, media uploads, and basic tree visualization.

**Duration:** Week 2-3

---

## Task Index

| Task | Name | Priority |
|------|------|----------|
| 2.1 | Create Member Entity | High |
| 2.2 | Create Member Mongoose Model | High |
| 2.3 | Implement MemberRepository | High |
| 2.4 | Create MemberService | High |
| 2.5 | Create Member GraphQL Resolvers | High |
| 2.6 | Create Relationship Entity | High |
| 2.7 | Create Relationship Mongoose Model | High |
| 2.8 | Implement RelationshipRepository | High |
| 2.9 | Create RelationshipService | High |
| 2.10 | Create Relationship GraphQL Resolvers | High |
| 2.11 | Setup MinIO Service | Medium |
| 2.12 | Create Media Entity and Model | Medium |
| 2.13 | Implement MediaRepository | Medium |
| 2.14 | Create MediaService | Medium |
| 2.15 | Create Media GraphQL Resolvers | Medium |
| 2.16 | Frontend - Apollo Client Refinement | High |
| 2.17 | Frontend - Auth Pages (Login/Register) | High |
| 2.18 | Frontend - Member List Page | High |
| 2.19 | Frontend - Member Detail Page | High |
| 2.20 | Frontend - Member Form Page | High |
| 2.21 | Frontend - Basic Tree Chart | High |

---

## Task 2.1: Create Member Entity

### Files
- Create: `backend/src/domain/entities/Member.ts`
- Update: `backend/src/domain/entities/index.ts`
- Test: `backend/tests/unit/domain/entities/Member.test.ts`

### Implementation

```typescript
import { ValidationError } from '@/domain/errors';
import { LifeEvent } from '@/domain/value-objects';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  middleName?: string;
  maidenName?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  photoId?: string;
}

interface Education {
  institution: string;
  degree?: string;
  field?: string;
  startDate?: { year: number; month?: number; day?: number };
  endDate?: { year: number; month?: number; day?: number };
}

interface ContactInfo {
  email?: string;
  phone?: string;
  address?: { street?: string; city?: string; state?: string; country: string };
}

interface MedicalInfo {
  bloodType?: string;
  allergies?: string[];
  conditions?: string[];
  notes?: string;
}

interface MemberProps {
  id?: string;
  familyId: string;
  personalInfo: PersonalInfo;
  lifeEvents: LifeEvent[];
  bio?: string;
  occupation?: string;
  education: Education[];
  contact?: ContactInfo;
  medicalHistory?: MedicalInfo;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Member {
  readonly id?: string;
  readonly familyId: string;
  readonly personalInfo: PersonalInfo;
  readonly lifeEvents: LifeEvent[];
  readonly bio?: string;
  readonly occupation?: string;
  readonly education: Education[];
  readonly contact?: ContactInfo;
  readonly medicalHistory?: MedicalInfo;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: MemberProps) {
    this.id = props.id;
    this.familyId = props.familyId;
    this.personalInfo = props.personalInfo;
    this.lifeEvents = props.lifeEvents;
    this.bio = props.bio;
    this.occupation = props.occupation;
    this.education = props.education;
    this.contact = props.contact;
    this.medicalHistory = props.medicalHistory;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  static create(props: MemberProps): Member {
    if (!props.personalInfo.firstName?.trim()) {
      throw new ValidationError('First name is required');
    }
    if (!props.personalInfo.lastName?.trim()) {
      throw new ValidationError('Last name is required');
    }
    return new Member({ ...props, lifeEvents: props.lifeEvents ?? [], education: props.education ?? [] });
  }

  hasBirthEvent(): boolean {
    return this.lifeEvents.some(e => e.type === 'BIRTH');
  }

  hasDeathEvent(): boolean {
    return this.lifeEvents.some(e => e.type === 'DEATH');
  }

  isLiving(): boolean {
    return !this.hasDeathEvent();
  }

  toJSON() {
    return {
      id: this.id,
      familyId: this.familyId,
      personalInfo: this.personalInfo,
      lifeEvents: this.lifeEvents.map(e => e.toJSON()),
      bio: this.bio,
      occupation: this.occupation,
      education: this.education,
      contact: this.contact,
      medicalHistory: this.medicalHistory,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
```

---

## Task 2.6: Create Relationship Entity

### Files
- Create: `backend/src/domain/entities/Relationship.ts`

### Implementation

```typescript
import { ValidationError } from '@/domain/errors';

export type RelationshipType = 'PARENT' | 'SPOUSE' | 'PARTNER' | 'ADOPTION';

interface RelationshipMetadata {
  adoptionDate?: Date;
  isAdopted?: boolean;
  [key: string]: any;
}

interface RelationshipProps {
  id?: string;
  familyId: string;
  type: RelationshipType;
  person1Id: string;
  person2Id: string;
  startDate?: Date;
  endDate?: Date;
  isCurrent: boolean;
  metadata?: RelationshipMetadata;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Relationship {
  readonly id?: string;
  readonly familyId: string;
  readonly type: RelationshipType;
  readonly person1Id: string;
  readonly person2Id: string;
  readonly startDate?: Date;
  readonly endDate?: Date;
  readonly isCurrent: boolean;
  readonly metadata?: RelationshipMetadata;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: RelationshipProps) {
    this.id = props.id;
    this.familyId = props.familyId;
    this.type = props.type;
    this.person1Id = props.person1Id;
    this.person2Id = props.person2Id;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.isCurrent = props.isCurrent;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  static create(props: RelationshipProps): Relationship {
    if (props.person1Id === props.person2Id) {
      throw new ValidationError('Cannot create self-relationship');
    }
    const validTypes: RelationshipType[] = ['PARENT', 'SPOUSE', 'PARTNER', 'ADOPTION'];
    if (!validTypes.includes(props.type)) {
      throw new ValidationError('Invalid relationship type');
    }
    return new Relationship(props);
  }

  involves(memberId: string): boolean {
    return this.person1Id === memberId || this.person2Id === memberId;
  }

  getOtherMemberId(memberId: string): string {
    if (this.person1Id === memberId) return this.person2Id;
    if (this.person2Id === memberId) return this.person1Id;
    throw new Error('Member not involved in this relationship');
  }

  toJSON() {
    return {
      id: this.id, familyId: this.familyId, type: this.type,
      person1Id: this.person1Id, person2Id: this.person2Id,
      startDate: this.startDate, endDate: this.endDate,
      isCurrent: this.isCurrent, metadata: this.metadata,
      createdAt: this.createdAt, updatedAt: this.updatedAt,
    };
  }
}
```

---

## Task 2.11: Setup MinIO Service

### Files
- Create: `backend/src/infrastructure/storage/MinIOService.ts`
- Create: `backend/src/infrastructure/storage/FileValidator.ts`
- Test: `backend/tests/unit/infrastructure/storage/`

### Implementation

```typescript
import { Client as MinioClient, ClientOptions } from 'minio';
import { config } from '@/infrastructure/config';

export class MinIOService {
  private client: MinioClient;
  private bucket: string;

  constructor() {
    this.client = new MinioClient({
      endPoint: config.minio.endPoint,
      port: config.minio.port,
      accessKey: config.minio.accessKey,
      secretKey: config.minio.secretKey,
      useSSL: config.minio.useSSL,
    });
    this.bucket = config.minio.bucket;
  }

  async ensureBucket(): Promise<void> {
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      await this.client.makeBucket(this.bucket);
    }
  }

  async uploadFile(objectName: string, buffer: Buffer, metadata: { contentType: string }): Promise<string> {
    await this.client.putObject(this.bucket, objectName, buffer, buffer.length, {
      'Content-Type': metadata.contentType,
    });
    return objectName;
  }

  async getPresignedUrl(objectName: string, expirySeconds: number = 3600): Promise<string> {
    return await this.client.presignedGetObject(this.bucket, objectName, expirySeconds);
  }

  async deleteFile(objectName: string): Promise<void> {
    await this.client.removeObject(this.bucket, objectName);
  }

  generateObjectName(originalName: string): string {
    const ext = originalName.split('.').pop()?.toLowerCase() || '';
    const timestamp = Date.now();
    const random = crypto.randomUUID().slice(0, 8);
    return `${timestamp}-${random}.${ext}`;
  }
}
```

---

## Task 2.17: Frontend - Auth Pages

### Files
- Create: `frontend/src/features/auth/pages/LoginPage.tsx`
- Create: `frontend/src/features/auth/pages/RegisterPage.tsx`
- Create: `frontend/src/features/auth/components/LoginForm.tsx`
- Create: `frontend/src/features/auth/components/RegisterForm.tsx`
- Create: `frontend/src/features/auth/hooks/useAuth.ts`
- Create: `frontend/src/features/auth/atoms/authAtom.ts`
- Create: `frontend/src/features/auth/graphql/mutations.ts`

### Key Implementation

**authAtom.ts**
```typescript
import { atom, atomWithStorage } from 'jotai';

export interface AuthUser {
  id: string;
  username: string;
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
  familyId: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
}

export const authAtom = atomWithStorage<AuthState>('auth', {
  isAuthenticated: false,
  user: null,
  token: null,
});

export const isAuthenticatedAtom = atom((get) => get(authAtom).isAuthenticated);
export const currentUserAtom = atom((get) => get(authAtom).user);
export const userRoleAtom = atom((get) => get(authAtom).user?.role);
export const canEditAtom = atom((get) => {
  const role = get(userRoleAtom);
  return role === 'OWNER' || role === 'EDITOR';
});
export const isOwnerAtom = atom((get) => get(userRoleAtom) === 'OWNER');
```

**mutations.ts**
```typescript
import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        username
        role
        familyId
      }
      token
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        username
        role
        familyId
      }
      token
    }
  }
`;
```

---

## Task 2.21: Frontend - Basic Tree Chart

### Files
- Create: `frontend/src/features/tree/pages/TreeViewPage.tsx`
- Create: `frontend/src/features/tree/components/TreeChart/TreeChart.tsx`
- Create: `frontend/src/features/tree/components/TreeChart/TreeNode.tsx`
- Create: `frontend/src/features/tree/components/TreeChart/TreeEdge.tsx`
- Create: `frontend/src/features/tree/hooks/useTreeData.ts`
- Create: `frontend/src/features/tree/utils/treeLayout.ts`
- Create: `frontend/src/features/tree/graphql/queries.ts`

### Key Implementation

**TreeChart.tsx**
```typescript
import { useMemo } from 'react';
import { TreeNode } from './TreeNode';
import { TreeEdge } from './TreeEdge';
import { useTreeLayout } from '../../hooks/useTreeLayout';
import type { Member, Relationship } from '@/graphql/generated';

interface TreeChartProps {
  members: Member[];
  relationships: Relationship[];
  onMemberClick?: (member: Member) => void;
}

export function TreeChart({ members, relationships, onMemberClick }: TreeChartProps) {
  const { nodes, edges } = useTreeLayout(members, relationships);

  return (
    <div className="w-full h-full overflow-auto">
      <svg width={nodes.width} height={nodes.height} className="mx-auto">
        <g transform="translate(50, 50)">
          {edges.map((edge) => (
            <TreeEdge key={edge.id} edge={edge} />
          ))}
          {nodes.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              onClick={() => onMemberClick?.(node.member)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
```

---

## Success Criteria - Phase 2

- [ ] Member CRUD operations working
- [ ] Relationship CRUD operations working
- [ ] File uploads working with MinIO
- [ ] Frontend auth pages functional
- [ ] Member list/detail pages working
- [ ] Basic tree chart renders with pan/zoom
- [ ] TDD followed with >80% coverage

---

## Next: Phase 3

After Phase 2 completion, proceed to Phase 3: Enhanced Features (Calculated Relationships, Search, Multiple Views, Sharing)
