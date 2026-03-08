# Family Tree V2 - Phase 3: Enhanced Features - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement advanced features including calculated relationships, search, multiple visualization views, and sharing functionality.

**Duration:** Week 4

---

## Task Index

| Task | Name | Priority |
|------|------|----------|
| 3.1 | Implement Relationship Calculator Service | High |
| 3.2 | Create CalculatedRelationship Type | High |
| 3.3 | Add Calculated Relationship Resolver | High |
| 3.4 | Implement MongoDB Text Search | High |
| 3.5 | Create SearchService | High |
| 3.6 | Add Search Resolvers | High |
| 3.7 | Implement ShareService | High |
| 3.8 | Create Share Link Model Updates | High |
| 3.9 | Add Share Resolvers | High |
| 3.10 | Frontend - Graph View (react-flow) | Medium |
| 3.11 | Frontend - Timeline View | Medium |
| 3.12 | Frontend - List View | Medium |
| 3.13 | Frontend - View Selector Component | Medium |
| 3.14 | Frontend - Search Component | High |
| 3.15 | Frontend - Share Dialog | High |
| 3.16 | Frontend - Shared Tree Page | High |

---

## Task 3.1: Implement Relationship Calculator Service

### Files
- Create: `backend/src/application/services/RelationshipCalculatorService.ts`
- Test: `backend/tests/unit/services/RelationshipCalculatorService.test.ts`

### Implementation

```typescript
import { Relationship } from '@/domain/entities';

interface CalculatedRelationship {
  relationshipPath: { memberId: string; relationshipType: string }[];
  relationshipName: string;
  degree: number;
}

export class RelationshipCalculatorService {
  private relationships: Relationship[];

  constructor(relationships: Relationship[]) {
    this.relationships = relationships;
  }

  calculateRelationship(fromMemberId: string, toMemberId: string): CalculatedRelationship | null {
    if (fromMemberId === toMemberId) {
      return { relationshipPath: [], relationshipName: 'Self', degree: 0 };
    }

    const path = this.findShortestPath(fromMemberId, toMemberId);
    if (!path) return null;

    const relationshipName = this.determineRelationshipName(path);
    const degree = path.length;

    return {
      relationshipPath: path,
      relationshipName,
      degree,
    };
  }

  private findShortestPath(from: string, to: string): { memberId: string; relationshipType: string }[] | null {
    const queue: { id: string; path: { memberId: string; relationshipType: string }[] }[] =
      [{ id: from, path: [] }];
    const visited = new Set<string>([from]);

    while (queue.length > 0) {
      const current = queue.shift()!;

      const relatedMembers = this.getRelatedMembers(current.id);
      for (const { memberId, type } of relatedMembers) {
        if (memberId === to) {
          return [...current.path, { memberId, relationshipType: type }];
        }
        if (!visited.has(memberId)) {
          visited.add(memberId);
          queue.push({
            id: memberId,
            path: [...current.path, { memberId, relationshipType: type }],
          });
        }
      }
    }
    return null;
  }

  private getRelatedMembers(memberId: string): { memberId: string; type: string }[] {
    const related: { memberId: string; type: string }[] = [];

    for (const rel of this.relationships) {
      if (rel.person1Id === memberId) {
        related.push({ memberId: rel.person2Id, type: this.getRelationshipLabel(rel.type, false) });
      } else if (rel.person2Id === memberId) {
        related.push({ memberId: rel.person1Id, type: this.getRelationshipLabel(rel.type, true) });
      }
    }
    return related;
  }

  private getRelationshipLabel(type: string, reverse: boolean): string {
    const labels: Record<string, { forward: string; reverse: string }> = {
      PARENT: { forward: 'child', reverse: 'parent' },
      SPOUSE: { forward: 'spouse', reverse: 'spouse' },
      PARTNER: { forward: 'partner', reverse: 'partner' },
      ADOPTION: { forward: 'adopted child', reverse: 'adoptive parent' },
    };
    return reverse ? labels[type]?.reverse ?? type : labels[type]?.forward ?? type;
  }

  private determineRelationshipName(path: { memberId: string; relationshipType: string }[]): string {
    if (path.length === 0) return 'Self';
    if (path.length === 1) {
      const type = path[0].relationshipType;
      if (type === 'parent') return 'Parent';
      if (type === 'child') return 'Child';
      if (type === 'spouse') return 'Spouse';
      if (type === 'partner') return 'Partner';
    }
    if (path.length === 2) {
      const [first, second] = path;
      if (first.relationshipType === 'parent' && second.relationshipType === 'parent') return 'Grandparent';
      if (first.relationshipType === 'child' && second.relationshipType === 'child') return 'Grandchild';
      if (first.relationshipType === 'parent' && second.relationshipType === 'child') return 'Sibling';
      if (first.relationshipType === 'child' && second.relationshipType === 'parent') return 'Sibling';
      if (first.relationshipType === 'spouse' && second.relationshipType === 'parent') return 'Parent-in-law';
    }
    if (path.length === 3) {
      if (path.every(p => p.relationshipType === 'parent')) return 'Great-grandparent';
      if (path.every(p => p.relationshipType === 'child')) return 'Great-grandchild';
      const parentSteps = path.filter(p => p.relationshipType === 'parent').length;
      if (parentSteps === 1) return 'Cousin';
      if (parentSteps === 2) return 'Aunt/Uncle or Niece/Nephew';
    }
    return `${path.length}th degree relative`;
  }

  getAncestors(memberId: string, generations: number = 3): string[] {
    const ancestors: string[] = [];
    const queue: { id: string; gen: number }[] = [{ id: memberId, gen: 0 }];
    const visited = new Set<string>([memberId]);

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.gen >= generations) continue;

      const parents = this.relationships
        .filter(r => r.type === 'PARENT' && r.person2Id === current.id)
        .map(r => r.person1Id);

      for (const parentId of parents) {
        if (!visited.has(parentId)) {
          visited.add(parentId);
          ancestors.push(parentId);
          queue.push({ id: parentId, gen: current.gen + 1 });
        }
      }
    }
    return ancestors;
  }

  getDescendants(memberId: string, generations: number = 3): string[] {
    const descendants: string[] = [];
    const queue: { id: string; gen: number }[] = [{ id: memberId, gen: 0 }];
    const visited = new Set<string>([memberId]);

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.gen >= generations) continue;

      const children = this.relationships
        .filter(r => r.type === 'PARENT' && r.person1Id === current.id)
        .map(r => r.person2Id);

      for (const childId of children) {
        if (!visited.has(childId)) {
          visited.add(childId);
          descendants.push(childId);
          queue.push({ id: childId, gen: current.gen + 1 });
        }
      }
    }
    return descendants;
  }
}
```

---

## Task 3.4: Implement MongoDB Text Search

### Files
- Update: `scripts/mongo-init.js` (add text indexes)
- Create: `backend/src/application/services/SearchService.ts`

### Implementation

```typescript
import { IMemberRepository } from '@/domain/interfaces';
import { Member } from '@/domain/entities';

interface SearchResult {
  members: Member[];
  totalCount: number;
  hasMore: boolean;
}

export class SearchService {
  constructor(private memberRepo: IMemberRepository) {}

  async searchMembers(
    familyId: string,
    query: string,
    options: { limit?: number; skip?: number } = {}
  ): Promise<SearchResult> {
    const limit = options.limit ?? 20;
    const skip = options.skip ?? 0;

    const { members, totalCount } = await this.memberRepo.search(familyId, query, { limit: limit + 1, skip });

    return {
      members: members.slice(0, limit),
      totalCount,
      hasMore: members.length > limit,
    };
  }
}
```

---

## Task 3.7: Implement ShareService

### Files
- Create: `backend/src/application/services/ShareService.ts`
- Test: `backend/tests/unit/services/ShareService.test.ts`

### Implementation

```typescript
import { randomBytes, createHash } from 'crypto';
import { IFamilyRepository } from '@/domain/interfaces';
import { NotFoundError, ValidationError } from '@/domain/errors';

export class ShareService {
  constructor(private familyRepo: IFamilyRepository) {}

  generateShareToken(): string {
    return randomBytes(32).toString('base64url');
  }

  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async createShareLink(
    familyId: string,
    userId: string,
    options: { password?: string; expiresAt?: Date } = {}
  ): Promise<{ token: string; hashedToken: string }> {
    const family = await this.familyRepo.findById(familyId);
    if (!family) throw new NotFoundError('Family', familyId);

    const token = this.generateShareToken();
    const hashedToken = this.hashToken(token);

    const shareLink = {
      token: hashedToken,
      passwordHash: options.password ? await this.hashPassword(options.password) : undefined,
      expiresAt: options.expiresAt,
      createdAt: new Date(),
    };

    await this.familyRepo.addShareLink(familyId, shareLink);

    return { token, hashedToken };
  }

  async validateShareLink(
    token: string,
    password?: string
  ): Promise<{ valid: boolean; familyId?: string; requiresPassword?: boolean }> {
    const hashedToken = this.hashToken(token);
    const family = await this.familyRepo.findByShareLinkToken(hashedToken);

    if (!family) return { valid: false };

    const shareLink = family.shareLinks.find(sl => sl.token === hashedToken);
    if (!shareLink) return { valid: false };

    if (shareLink.expiresAt && new Date() > shareLink.expiresAt) {
      return { valid: false };
    }

    if (shareLink.passwordHash) {
      if (!password) return { valid: false, requiresPassword: true };
      const isValid = await this.verifyPassword(password, shareLink.passwordHash);
      if (!isValid) return { valid: false };
    }

    return { valid: true, familyId: family.id };
  }

  private async hashPassword(password: string): Promise<string> {
    return await Bun.password.hash(password, { algorithm: 'bcrypt', cost: 10 });
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await Bun.password.verify(password, hash, 'bcrypt');
  }
}
```

---

## Task 3.10: Frontend - Graph View

### Files
- Create: `frontend/src/features/tree/components/GraphView/GraphView.tsx`
- Create: `frontend/src/features/tree/components/GraphView/CustomNode.tsx`
- Create: `frontend/src/features/tree/components/GraphView/CustomEdge.tsx`

### Implementation

```typescript
import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { CustomNode } from './CustomNode';
import type { Member, Relationship } from '@/graphql/generated';

const nodeTypes = { custom: CustomNode };

interface GraphViewProps {
  members: Member[];
  relationships: Relationship[];
  onMemberClick?: (member: Member) => void;
}

export function GraphView({ members, relationships, onMemberClick }: GraphViewProps) {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = members.map((member, index) => ({
      id: member.id,
      type: 'custom',
      position: { x: (index % 5) * 200, y: Math.floor(index / 5) * 150 },
      data: { member, onClick: () => onMemberClick?.(member) },
    }));

    const edges: Edge[] = relationships.map((rel) => ({
      id: rel.id,
      source: rel.person1Id,
      target: rel.person2Id,
      animated: rel.isCurrent,
      label: rel.type.toLowerCase(),
      style: { stroke: rel.type === 'SPOUSE' ? '#ec4899' : rel.type === 'PARENT' ? '#3b82f6' : '#6b7280' },
    }));

    return { nodes, edges };
  }, [members, relationships, onMemberClick]);

  return (
    <div className="w-full h-[600px]">
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
```

---

## Success Criteria - Phase 3

- [ ] Calculated relationships work correctly
- [ ] Search returns relevant results
- [ ] Share links can be created
- [ ] Share links can be accessed
- [ ] Password-protected share links work
- [ ] Graph view renders with drag/zoom
- [ ] Timeline view shows events chronologically
- [ ] List view shows hierarchy
- [ ] View selector switches between views

---

## Next: Phase 4

After Phase 3 completion, proceed to Phase 4: Polish (i18n, Timeline, Sources, User Management, Documentation)
