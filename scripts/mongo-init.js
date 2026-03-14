db = db.getSiblingDB('familytree');

db.createCollection('users');
db.createCollection('families');
db.createCollection('members');
db.createCollection('relationships');
db.createCollection('media');
db.createCollection('sources');
db.createCollection('timelines');

db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ familyId: 1 });
db.families.createIndex({ ownerId: 1 });
db.families.createIndex({ 'shareLinks.token': 1 });
db.members.createIndex({ familyId: 1 });
db.members.createIndex({ familyId: 1, 'personalInfo.firstName': 1, 'personalInfo.lastName': 1 });
db.members.createIndex(
  { 'personalInfo.firstName': 'text', 'personalInfo.lastName': 'text', bio: 'text', occupation: 'text' },
  { weights: { 'personalInfo.firstName': 10, 'personalInfo.lastName': 10, bio: 5, occupation: 3 } }
);
db.relationships.createIndex({ familyId: 1 });
db.relationships.createIndex({ person1Id: 1, person2Id: 1, type: 1 }, { unique: true });
db.media.createIndex({ familyId: 1 });
db.sources.createIndex({ familyId: 1 });
db.timelines.createIndex({ familyId: 1 });

print('Database initialized successfully');
